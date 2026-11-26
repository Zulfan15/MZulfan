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
  JESMON_X_ACTIONS,
  JESMON_X_IDLE_CLIP,
  JESMON_X_WALK_CLIP,
  type JesmonXActionId,
} from './jesmon_x.animations';
import {
  JESMON_X_DEFAULT_ASSET_BASE,
  resolveJesmonXAssets,
} from './jesmon_x.assets';
import {
  gridCell8x4,
  JESMON_X_BATTLE_RECTS,
  JESMON_X_DS_IDLE_RECTS,
  JESMON_X_JPG_HD_RECTS,
  JESMON_X_JPG_ICON_RECT,
  JESMON_X_JPG_MINI_RECTS,
  JESMON_X_STEPS_BY_DIR,
} from './jesmon_x.frames';
import { JESMON_X_META } from './jesmon_x.meta';

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
 * Loads and cleanly slices all 5 Jesmon (X Antibody) sprite sheets into a cached `CharacterSpriteSet`.
 * Deduplicates concurrent requests and caches per `baseUrl`.
 */
export async function loadJesmonX(
  baseUrl = JESMON_X_DEFAULT_ASSET_BASE,
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
    const urls = resolveJesmonXAssets(baseUrl);
    const [idleImg, walkImg] = await Promise.all([
      loadImage(urls.idle),
      loadImage(urls.walk),
    ]);
    const extraPromises =
      mode === 'full'
        ? Promise.all([loadImage(urls.battle), loadImage(urls.sheet), loadImage(urls.ds)])
        : null;

    const idle: CharacterFrame[] = [];
    for (const dir of DIRECTIONS_8) {
      const steps = JESMON_X_STEPS_BY_DIR[dir];
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
      const steps = JESMON_X_STEPS_BY_DIR[dir];
      if (mode === 'overworld' && !CARDINAL_DIRECTIONS.has(dir)) {
        for (let i = 0; i < steps.length; i++) walk.push(createEmptyFrame());
        continue;
      }
      const rects = steps.map((s) => gridCell8x4(s.row, s.col));
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
        id: JESMON_X_META.id,
        directionOrder: DIRECTIONS_8,
        groups: { idle, walk, battle: [], battleLarge: [], dsIdle: [], hd: [], mini: [] },
        icon: null,
        iconDataUrl: null,
        loadedAt: performance.now(),
      };
      spriteCache.set(cacheKey, set);
      return set;
    }

    const [battleImg, jpgImg, dsImg] = await extraPromises!;
    const rawBattle = padToUniformBottomCenter(
      sliceFrames(battleImg, JESMON_X_BATTLE_RECTS, {
        chroma: 'lossy-green',
        trim: 'tight',
        isolateMainBody: true,
      })
    );
    const battle = rawBattle.map((f) => downscaleFrame(f, 112, true));
    const battleLarge = rawBattle.map((f) => downscaleFrame(f, 220, true));
    await yieldToFrame();

    const dsIdle = padToUniformBottomCenter(
      sliceFrames(dsImg, JESMON_X_DS_IDLE_RECTS, {
        chroma: 'ds-teal-mint',
        trim: 'tight',
        isolateMainBody: true,
      })
    ).map((f) => downscaleFrame(f, 220, true));
    await yieldToFrame();

    const [icon = null] = sliceFrames(jpgImg, [JESMON_X_JPG_ICON_RECT], {
      chroma: 'lossy-green',
      trim: 'tight',
      isolateMainBody: true,
    });

    const hd = sliceFrames(jpgImg, JESMON_X_JPG_HD_RECTS, {
      chroma: 'lossy-green',
      trim: 'tight',
      isolateMainBody: true,
    }).map((f) => downscaleFrame(f, 220, true));

    const mini = sliceFrames(jpgImg, JESMON_X_JPG_MINI_RECTS, {
      chroma: 'lossy-green',
      trim: 'tight',
      isolateMainBody: true,
    });

    const set: CharacterSpriteSet = {
      id: JESMON_X_META.id,
      directionOrder: DIRECTIONS_8,
      groups: { idle, walk, battle, battleLarge, dsIdle, hd, mini },
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

/** Synchronous cache lookup (returns `null` until `loadJesmonX` resolves). */
export function getJesmonXSync(
  baseUrl = JESMON_X_DEFAULT_ASSET_BASE
): CharacterSpriteSet | null {
  return spriteCache.get(`${baseUrl}::full`) ?? spriteCache.get(`${baseUrl}::overworld`) ?? null;
}

/** Clears cached Jesmon (X Antibody) sprite canvases. */
export function clearJesmonXCache(): void {
  spriteCache.clear();
}

/** Creates an engine-agnostic 8-direction animator for Jesmon (X Antibody). */
export function createJesmonXAnimator(
  sprites: CharacterSpriteSet
): CharacterAnimator<JesmonXActionId> {
  return new CharacterAnimator(
    sprites,
    JESMON_X_IDLE_CLIP,
    JESMON_X_WALK_CLIP,
    JESMON_X_ACTIONS
  );
}
