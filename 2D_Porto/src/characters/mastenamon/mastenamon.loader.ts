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
  MASTENAMON_ACTIONS,
  MASTENAMON_IDLE_CLIP,
  MASTENAMON_WALK_CLIP,
  type MastenamonActionId,
} from './mastenamon.animations';
import {
  MASTENAMON_DEFAULT_ASSET_BASE,
  resolveMastenamonAssets,
} from './mastenamon.assets';
import {
  MASTENAMON_BATTLE_RECTS,
  MASTENAMON_IDLE_STEPS_BY_DIR,
  MASTENAMON_JPG_HD_RECTS,
  MASTENAMON_JPG_ICON_RECT,
  MASTENAMON_JPG_MINI_RECTS,
  MASTENAMON_WALK_STEPS_BY_DIR,
  idleCell,
  walkCell,
} from './mastenamon.frames';
import { MASTENAMON_META } from './mastenamon.meta';

const spriteCache = new Map<string, CharacterSpriteSet>();
const inflightByBase = new Map<string, Promise<CharacterSpriteSet>>();

function downscaleHdFrame(frame: CharacterFrame, maxH = 220): CharacterFrame {
  if (frame.height <= maxH) return frame;
  const scale = maxH / frame.height;
  const w = Math.max(1, Math.round(frame.width * scale));
  const h = Math.max(1, Math.round(frame.height * scale));
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(frame.canvas, 0, 0, w, h);
  }
  return { canvas, width: w, height: h };
}

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
 * Loads and cleanly slices all 4 Mastenamon sprite sheets into a cached `CharacterSpriteSet`.
 * Deduplicates concurrent requests and caches per `baseUrl`.
 */
export async function loadMastenamon(
  baseUrl = MASTENAMON_DEFAULT_ASSET_BASE,
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
    const urls = resolveMastenamonAssets(baseUrl);
    const [idleImg, walkImg] = await Promise.all([
      loadImage(urls.idle),
      loadImage(urls.walk),
    ]);
    const extraPromises =
      mode === 'full' ? Promise.all([loadImage(urls.battle), loadImage(urls.sheet)]) : null;

    const idle: CharacterFrame[] = [];
    for (const dir of DIRECTIONS_8) {
      const steps = MASTENAMON_IDLE_STEPS_BY_DIR[dir];
      if (mode === 'overworld' && !CARDINAL_DIRECTIONS.has(dir)) {
        for (let i = 0; i < steps.length; i++) idle.push(createEmptyFrame());
        continue;
      }
      const rects = steps.map((s) => idleCell(s.row, s.col));
      const frames = sliceFrames(idleImg, rects, {
        chroma: 'lossy-green-warm',
        trim: 'uniform',
      })
        .map((f) => downscaleFrame(f, 96, true))
        .map((frame, i) => (steps[i].flipX ? flipFrame(frame) : frame));
      idle.push(...frames);
      await yieldToFrame();
    }

    const walk: CharacterFrame[] = [];
    for (const dir of DIRECTIONS_8) {
      const steps = MASTENAMON_WALK_STEPS_BY_DIR[dir];
      if (mode === 'overworld' && !CARDINAL_DIRECTIONS.has(dir)) {
        for (let i = 0; i < steps.length; i++) walk.push(createEmptyFrame());
        continue;
      }
      const rects = steps.map((s) => walkCell(s.row, s.col));
      const frames = sliceFrames(walkImg, rects, {
        chroma: 'lossy-green-warm',
        trim: 'uniform',
      })
        .map((f) => downscaleFrame(f, 96, true))
        .map((frame, i) => (steps[i].flipX ? flipFrame(frame) : frame));
      walk.push(...frames);
      await yieldToFrame();
    }

    if (mode === 'overworld') {
      const set: CharacterSpriteSet = {
        id: MASTENAMON_META.id,
        directionOrder: DIRECTIONS_8,
        groups: { idle, walk, battle: [], hd: [], mini: [], idleLarge: [] },
        icon: null,
        iconDataUrl: null,
        loadedAt: performance.now(),
      };
      spriteCache.set(cacheKey, set);
      return set;
    }

    const [battleImg, jpgImg] = await extraPromises!;
    const battle = padToUniformBottomCenter(
      sliceFrames(battleImg, MASTENAMON_BATTLE_RECTS, {
        chroma: 'flat-green',
        trim: 'tight',
      })
    );
    await yieldToFrame();

    const idleLarge = padToUniformBottomCenter(
      sliceFrames(
        idleImg,
        MASTENAMON_IDLE_STEPS_BY_DIR.S.map((s) => idleCell(s.row, s.col)),
        {
          chroma: 'lossy-green-warm',
          trim: 'uniform',
        }
      ).map((f) => downscaleHdFrame(f, 220))
    );

    const [icon = null] = sliceFrames(jpgImg, [MASTENAMON_JPG_ICON_RECT], {
      chroma: 'lossy-green-warm',
      trim: 'tight',
      isolateMainBody: true,
    });

    const hd = sliceFrames(jpgImg, MASTENAMON_JPG_HD_RECTS, {
      chroma: 'lossy-green-warm',
      trim: 'tight',
      isolateMainBody: true,
    }).map((f) => downscaleHdFrame(f, 220));

    const mini = sliceFrames(jpgImg, MASTENAMON_JPG_MINI_RECTS, {
      chroma: 'lossy-green-warm',
      trim: 'tight',
      isolateMainBody: true,
    });

    const set: CharacterSpriteSet = {
      id: MASTENAMON_META.id,
      directionOrder: DIRECTIONS_8,
      groups: { idle, walk, battle, hd, mini, idleLarge },
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

/** Synchronous cache lookup (returns `null` until `loadMastenamon` resolves). */
export function getMastenamonSync(
  baseUrl = MASTENAMON_DEFAULT_ASSET_BASE
): CharacterSpriteSet | null {
  return spriteCache.get(`${baseUrl}::full`) ?? spriteCache.get(`${baseUrl}::overworld`) ?? null;
}

/** Clears cached Mastenamon sprite canvases. */
export function clearMastenamonCache(): void {
  spriteCache.clear();
}

/** Creates an engine-agnostic 8-direction animator for Mastenamon. */
export function createMastenamonAnimator(
  sprites: CharacterSpriteSet
): CharacterAnimator<MastenamonActionId> {
  return new CharacterAnimator(
    sprites,
    MASTENAMON_IDLE_CLIP,
    MASTENAMON_WALK_CLIP,
    MASTENAMON_ACTIONS
  );
}
