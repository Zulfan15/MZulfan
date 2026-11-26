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
  FIVEDRAMON_ACTIONS,
  FIVEDRAMON_IDLE_CLIP,
  FIVEDRAMON_WALK_CLIP,
  type FivedramonActionId,
} from './fivedramon.animations';
import {
  FIVEDRAMON_DEFAULT_ASSET_BASE,
  resolveFivedramonAssets,
} from './fivedramon.assets';
import {
  FIVEDRAMON_BATTLE_RECTS,
  FIVEDRAMON_IDLE_RECTS,
  FIVEDRAMON_JPG_HD_RECTS,
  FIVEDRAMON_JPG_ICON_RECT,
  FIVEDRAMON_JPG_MINI_RECTS,
  FIVEDRAMON_WALK_STEPS_BY_DIR,
  fivedramonWalkRect,
} from './fivedramon.frames';
import { FIVEDRAMON_META } from './fivedramon.meta';

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
 * Loads and cleanly slices all 4 Fivedramon sprite sheets into a cached `CharacterSpriteSet`.
 * Uses `border-green` chroma keyer + `isolateMainBody` so the emerald-green dragon head stays intact while corner dividers drop cleanly.
 */
export async function loadFivedramon(
  baseUrl = FIVEDRAMON_DEFAULT_ASSET_BASE,
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
    const urls = resolveFivedramonAssets(baseUrl);
    const [idleImg, walkImg] = await Promise.all([
      loadImage(urls.idle),
      loadImage(urls.walk),
    ]);
    const extraPromises =
      mode === 'full' ? Promise.all([loadImage(urls.battle), loadImage(urls.sheet)]) : null;

    let idle: CharacterFrame[];
    if (mode === 'overworld') {
      const cardinalIdle = sliceFrames(
        idleImg,
        [FIVEDRAMON_IDLE_RECTS[0], FIVEDRAMON_IDLE_RECTS[2], FIVEDRAMON_IDLE_RECTS[4], FIVEDRAMON_IDLE_RECTS[6]],
        { chroma: 'border-green', trim: 'tight', isolateMainBody: true }
      );
      const empty = createEmptyFrame();
      idle = [cardinalIdle[0], empty, cardinalIdle[1], empty, cardinalIdle[2], empty, cardinalIdle[3], empty];
    } else {
      idle = sliceFrames(idleImg, FIVEDRAMON_IDLE_RECTS, {
        chroma: 'border-green',
        trim: 'tight',
        isolateMainBody: true,
      });
    }
    await yieldToFrame();

    const walk: CharacterFrame[] = [];
    for (const dir of DIRECTIONS_8) {
      const steps = FIVEDRAMON_WALK_STEPS_BY_DIR[dir];
      if (mode === 'overworld' && !CARDINAL_DIRECTIONS.has(dir)) {
        for (let i = 0; i < steps.length; i++) walk.push(createEmptyFrame());
        continue;
      }
      const rects = steps.map((s) => fivedramonWalkRect(s.row, s.col));
      const frames = sliceFrames(walkImg, rects, {
        chroma: 'border-green',
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
        id: FIVEDRAMON_META.id,
        directionOrder: DIRECTIONS_8,
        groups: { idle, walk, battle: [], hd: [], mini: [] },
        icon: null,
        iconDataUrl: null,
        loadedAt: performance.now(),
      };
      spriteCache.set(cacheKey, set);
      return set;
    }

    const [battleImg, jpgImg] = await extraPromises!;
    const battle = padToUniformBottomCenter(
      sliceFrames(battleImg, FIVEDRAMON_BATTLE_RECTS, {
        chroma: 'border-green',
        trim: 'tight',
        isolateMainBody: true,
      })
    );
    await yieldToFrame();

    const [icon = null] = sliceFrames(jpgImg, [FIVEDRAMON_JPG_ICON_RECT], {
      chroma: 'border-green',
      trim: 'tight',
      isolateMainBody: true,
    });

    const hd = sliceFrames(jpgImg, FIVEDRAMON_JPG_HD_RECTS, {
      chroma: 'border-green',
      trim: 'tight',
      isolateMainBody: true,
    }).map((f) => downscaleFrame(f, 220, true));

    const mini = sliceFrames(jpgImg, FIVEDRAMON_JPG_MINI_RECTS, {
      chroma: 'border-green',
      trim: 'tight',
      isolateMainBody: true,
    });

    const set: CharacterSpriteSet = {
      id: FIVEDRAMON_META.id,
      directionOrder: DIRECTIONS_8,
      groups: { idle, walk, battle, hd, mini },
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

/** Synchronous cache lookup (returns `null` until `loadFivedramon` resolves). */
export function getFivedramonSync(
  baseUrl = FIVEDRAMON_DEFAULT_ASSET_BASE
): CharacterSpriteSet | null {
  return spriteCache.get(`${baseUrl}::full`) ?? spriteCache.get(`${baseUrl}::overworld`) ?? null;
}

/** Clears cached Fivedramon sprite canvases. */
export function clearFivedramonCache(): void {
  spriteCache.clear();
}

/** Creates an engine-agnostic 8-direction animator for Fivedramon. */
export function createFivedramonAnimator(
  sprites: CharacterSpriteSet
): CharacterAnimator<FivedramonActionId> {
  return new CharacterAnimator(
    sprites,
    FIVEDRAMON_IDLE_CLIP,
    FIVEDRAMON_WALK_CLIP,
    FIVEDRAMON_ACTIONS
  );
}
