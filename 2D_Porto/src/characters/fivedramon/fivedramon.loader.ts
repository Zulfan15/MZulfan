import { CharacterAnimator } from '../_shared/CharacterAnimator';
import {
  downscaleFrame,
  flipFrame,
  frameToDataUrl,
  loadImage,
  sliceFrames,
} from '../_shared/sheetSlicer';
import { DIRECTIONS_8, type CharacterSpriteSet } from '../_shared/types';
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

/**
 * Loads and cleanly slices all 4 Fivedramon sprite sheets into a cached `CharacterSpriteSet`.
 * Uses `border-green` chroma keyer so the emerald-green dragon head remains intact.
 */
export async function loadFivedramon(
  baseUrl = FIVEDRAMON_DEFAULT_ASSET_BASE
): Promise<CharacterSpriteSet> {
  const cached = spriteCache.get(baseUrl);
  if (cached) return cached;

  const existing = inflightByBase.get(baseUrl);
  if (existing) return existing;

  const task = (async () => {
    const urls = resolveFivedramonAssets(baseUrl);
    const [idleImg, walkImg, battleImg, jpgImg] = await Promise.all([
      loadImage(urls.idle),
      loadImage(urls.walk),
      loadImage(urls.battle),
      loadImage(urls.sheet),
    ]);

    const idle = sliceFrames(idleImg, FIVEDRAMON_IDLE_RECTS, {
      chroma: 'border-green',
      trim: 'tight',
    });

    const walkOrder = DIRECTIONS_8.flatMap((dir) => FIVEDRAMON_WALK_STEPS_BY_DIR[dir]);
    const walkRects = walkOrder.map((s) => fivedramonWalkRect(s.row, s.col));
    const slicedWalk = sliceFrames(walkImg, walkRects, {
      chroma: 'border-green',
      trim: 'uniform',
    });
    const walk = slicedWalk.map((frame, i) => (walkOrder[i].flipX ? flipFrame(frame) : frame));

    const battle = sliceFrames(battleImg, FIVEDRAMON_BATTLE_RECTS, {
      chroma: 'border-green',
      trim: 'tight',
    });

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

    spriteCache.set(baseUrl, set);
    return set;
  })().finally(() => {
    inflightByBase.delete(baseUrl);
  });

  inflightByBase.set(baseUrl, task);
  return task;
}

/** Synchronous cache lookup (returns `null` until `loadFivedramon` resolves). */
export function getFivedramonSync(
  baseUrl = FIVEDRAMON_DEFAULT_ASSET_BASE
): CharacterSpriteSet | null {
  return spriteCache.get(baseUrl) ?? null;
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
