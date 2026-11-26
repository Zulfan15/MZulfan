import { CharacterAnimator } from '../_shared/CharacterAnimator';
import {
  createEmptyFrame,
  downscaleFrame,
  flipFrame,
  frameToDataUrl,
  loadImage,
  sliceFrames,
  yieldToFrame,
} from '../_shared/sheetSlicer';
import {
  CARDINAL_DIRECTIONS,
  DIRECTIONS_8,
  type CharacterFrame,
  type CharacterLoadMode,
  type CharacterSpriteSet,
} from '../_shared/types';
import {
  HOLLOKNIGHTMON_ACTIONS,
  HOLLOKNIGHTMON_IDLE_CLIP,
  HOLLOKNIGHTMON_WALK_CLIP,
  type HolloknightmonActionId,
} from './holloknightmon.animations';
import {
  HOLLOKNIGHTMON_DEFAULT_ASSET_BASE,
  resolveHolloknightmonAssets,
} from './holloknightmon.assets';
import {
  gridCell8x4,
  HOLLOKNIGHTMON_BATTLE_RECTS,
  HOLLOKNIGHTMON_IDLE_STEPS_BY_DIR,
  HOLLOKNIGHTMON_JPG_HD_RECTS,
  HOLLOKNIGHTMON_JPG_ICON_RECT,
  HOLLOKNIGHTMON_JPG_MINI_RECTS,
  HOLLOKNIGHTMON_LARGE_IDLE_RECTS,
  HOLLOKNIGHTMON_WALK_STEPS_BY_DIR,
  walkCell,
} from './holloknightmon.frames';
import { HOLLOKNIGHTMON_META } from './holloknightmon.meta';

const spriteCache = new Map<string, CharacterSpriteSet>();
const inflightByBase = new Map<string, Promise<CharacterSpriteSet>>();

/** Pads all frames in a sequence to a shared bottom-centered canvas so scale stays uniform across steps. */
function padToUniformBottomCenter(frames: CharacterFrame[]): CharacterFrame[] {
  if (frames.length <= 1) return frames;
  const maxW = Math.max(1, ...frames.map((f) => f.width));
  const maxH = Math.max(1, ...frames.map((f) => f.height));
  return frames.map((f) => {
    if (f.width === maxW && f.height === maxH) return f;
    const canvas = document.createElement('canvas');
    canvas.width = maxW;
    canvas.height = maxH;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(f.canvas, Math.floor((maxW - f.width) / 2), maxH - f.height);
    }
    return { canvas, width: maxW, height: maxH };
  });
}

/**
 * Loads and cleanly slices all 4 Holloknightmon sprite sheets into a cached `CharacterSpriteSet`.
 * Deduplicates concurrent requests and caches per `baseUrl`.
 */
export async function loadHolloknightmon(
  baseUrl = HOLLOKNIGHTMON_DEFAULT_ASSET_BASE,
  mode: CharacterLoadMode = 'full'
): Promise<CharacterSpriteSet> {
  const fullKey = `${baseUrl}::full`;
  const cachedFull = spriteCache.get(fullKey);
  if (cachedFull) return cachedFull;

  const cacheKey = `${baseUrl}::${mode}`;
  const cached = spriteCache.get(cacheKey);
  if (cached) return cached;

  const existing = inflightByBase.get(fullKey) ?? inflightByBase.get(cacheKey);
  if (existing) return existing;

  const task = (async () => {
    const urls = resolveHolloknightmonAssets(baseUrl);
    const [idleImg, walkImg] = await Promise.all([
      loadImage(urls.idle),
      loadImage(urls.walk),
    ]);
    const extraPromises =
      mode === 'full' ? Promise.all([loadImage(urls.battle), loadImage(urls.sheet)]) : null;

    const idle: CharacterFrame[] = [];
    for (const dir of DIRECTIONS_8) {
      const steps = HOLLOKNIGHTMON_IDLE_STEPS_BY_DIR[dir];
      if (mode === 'overworld' && !CARDINAL_DIRECTIONS.has(dir)) {
        for (let i = 0; i < steps.length; i++) idle.push(createEmptyFrame());
        continue;
      }
      const rects = steps.map((s) => gridCell8x4(s.row, s.col));
      const frames = sliceFrames(idleImg, rects, {
        chroma: 'lossy-green',
        trim: 'uniform',
        isolateMainBody: true,
      })
        .map((f) => downscaleFrame(f, 96, true))
        .map((frame, i) => (steps[i].flipX ? flipFrame(frame) : frame));
      idle.push(...frames);
      await yieldToFrame();
    }

    const walk: CharacterFrame[] = [];
    for (const dir of DIRECTIONS_8) {
      const steps = HOLLOKNIGHTMON_WALK_STEPS_BY_DIR[dir];
      if (mode === 'overworld' && !CARDINAL_DIRECTIONS.has(dir)) {
        for (let i = 0; i < steps.length; i++) walk.push(createEmptyFrame());
        continue;
      }
      const rects = steps.map((s) => walkCell(s.row, s.col));
      const frames = sliceFrames(walkImg, rects, {
        chroma: 'lossy-green',
        trim: 'uniform',
        isolateMainBody: true,
      })
        .map((f) => downscaleFrame(f, 96, true))
        .map((frame, i) => (steps[i].flipX ? flipFrame(frame) : frame));
      walk.push(...frames);
      await yieldToFrame();
    }

    if (mode === 'overworld') {
      const set: CharacterSpriteSet = {
        id: HOLLOKNIGHTMON_META.id,
        directionOrder: DIRECTIONS_8,
        groups: { idle, idleLarge: [], walk, battle: [], battleLarge: [], hd: [], mini: [] },
        icon: null,
        iconDataUrl: null,
        loadedAt: performance.now(),
      };
      spriteCache.set(cacheKey, set);
      return set;
    }

    const [battleImg, jpgImg] = await extraPromises!;
    const idleLarge = padToUniformBottomCenter(
      sliceFrames(idleImg, HOLLOKNIGHTMON_LARGE_IDLE_RECTS, {
        chroma: 'lossy-green',
        trim: 'tight',
        isolateMainBody: true,
      })
    ).map((f) => downscaleFrame(f, 220, true));

    const rawBattle = padToUniformBottomCenter(
      sliceFrames(battleImg, HOLLOKNIGHTMON_BATTLE_RECTS, {
        chroma: 'lossy-green',
        trim: 'tight',
        isolateMainBody: true,
      })
    );
    const battle = rawBattle.map((f) => downscaleFrame(f, 112, true));
    const battleLarge = rawBattle.map((f) => downscaleFrame(f, 220, true));
    await yieldToFrame();

    const [icon = null] = sliceFrames(jpgImg, [HOLLOKNIGHTMON_JPG_ICON_RECT], {
      chroma: 'lossy-green',
      trim: 'tight',
      isolateMainBody: true,
    });

    const hd = sliceFrames(jpgImg, HOLLOKNIGHTMON_JPG_HD_RECTS, {
      chroma: 'lossy-green',
      trim: 'tight',
      isolateMainBody: true,
    }).map((f) => downscaleFrame(f, 220, true));

    const mini = sliceFrames(jpgImg, HOLLOKNIGHTMON_JPG_MINI_RECTS, {
      chroma: 'lossy-green',
      trim: 'tight',
      isolateMainBody: true,
    });

    const set: CharacterSpriteSet = {
      id: HOLLOKNIGHTMON_META.id,
      directionOrder: DIRECTIONS_8,
      groups: { idle, idleLarge, walk, battle, battleLarge, hd, mini },
      icon,
      iconDataUrl: frameToDataUrl(icon),
      loadedAt: performance.now(),
    };

    spriteCache.set(cacheKey, set);
    return set;
  })().finally(() => {
    inflightByBase.delete(cacheKey);
  });

  inflightByBase.set(cacheKey, task);
  return task;
}

/** Synchronous cache lookup (returns `null` until `loadHolloknightmon` resolves). */
export function getHolloknightmonSync(
  baseUrl = HOLLOKNIGHTMON_DEFAULT_ASSET_BASE
): CharacterSpriteSet | null {
  return spriteCache.get(`${baseUrl}::full`) ?? spriteCache.get(`${baseUrl}::overworld`) ?? null;
}

/** Clears cached Holloknightmon sprite canvases. */
export function clearHolloknightmonCache(): void {
  spriteCache.clear();
}

/** Creates an engine-agnostic 8-direction animator for Holloknightmon. */
export function createHolloknightmonAnimator(
  sprites: CharacterSpriteSet
): CharacterAnimator<HolloknightmonActionId> {
  return new CharacterAnimator(
    sprites,
    HOLLOKNIGHTMON_IDLE_CLIP,
    HOLLOKNIGHTMON_WALK_CLIP,
    HOLLOKNIGHTMON_ACTIONS
  );
}
