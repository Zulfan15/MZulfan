import { CharacterAnimator } from '../_shared/CharacterAnimator';
import {
  downscaleFrame,
  frameToDataUrl,
  loadImage,
  sliceFrames,
} from '../_shared/sheetSlicer';
import { DIRECTIONS_8, type CharacterSpriteSet } from '../_shared/types';
import {
  SHOGUN_ALPHAMON_ACTIONS,
  SHOGUN_ALPHAMON_IDLE_CLIP,
  SHOGUN_ALPHAMON_WALK_CLIP,
  type ShogunAlphamonActionId,
} from './shogun_alphamon.animations';
import {
  SHOGUN_ALPHAMON_DEFAULT_ASSET_BASE,
  resolveShogunAlphamonAssets,
} from './shogun_alphamon.assets';
import {
  SHOGUN_ALPHAMON_BATTLE_RECTS,
  SHOGUN_ALPHAMON_GRID_RECTS,
  SHOGUN_ALPHAMON_HD_RECTS,
  SHOGUN_ALPHAMON_JPG_ICON_RECT,
  SHOGUN_ALPHAMON_MINI_RECTS,
} from './shogun_alphamon.frames';
import { SHOGUN_ALPHAMON_META } from './shogun_alphamon.meta';

const spriteCache = new Map<string, CharacterSpriteSet>();
const inflightByBase = new Map<string, Promise<CharacterSpriteSet>>();

/**
 * Loads and cleanly slices all 4 Shogun Alphamon sprite sheets into a cached `CharacterSpriteSet`.
 * Deduplicates concurrent requests and caches per `baseUrl`.
 */
export async function loadShogunAlphamon(
  baseUrl = SHOGUN_ALPHAMON_DEFAULT_ASSET_BASE
): Promise<CharacterSpriteSet> {
  const cached = spriteCache.get(baseUrl);
  if (cached) return cached;

  const existing = inflightByBase.get(baseUrl);
  if (existing) return existing;

  const task = (async () => {
    const urls = resolveShogunAlphamonAssets(baseUrl);
    const [idleImg, walkImg, battleImg, hdImg] = await Promise.all([
      loadImage(urls.idle),
      loadImage(urls.walk),
      loadImage(urls.battle),
      loadImage(urls.sheet),
    ]);

    const rawIdle = sliceFrames(idleImg, SHOGUN_ALPHAMON_GRID_RECTS, {
      chroma: 'lossy-green',
      trim: 'uniform',
    });
    const idle = rawIdle.map((f) => downscaleFrame(f, 96, false));

    const walk = sliceFrames(walkImg, SHOGUN_ALPHAMON_GRID_RECTS, {
      chroma: 'lossy-green',
      trim: 'uniform',
    }).map((f) => downscaleFrame(f, 96, false));

    const rawBattle = sliceFrames(battleImg, SHOGUN_ALPHAMON_BATTLE_RECTS, {
      chroma: 'lossy-green',
      trim: 'tight',
    });
    const battle = rawBattle.map((f) => downscaleFrame(f, 112, false));

    const [icon = null] = sliceFrames(hdImg, [SHOGUN_ALPHAMON_JPG_ICON_RECT], {
      chroma: 'lossy-green',
      trim: 'tight',
      isolateMainBody: true,
    });

    const hd = sliceFrames(hdImg, SHOGUN_ALPHAMON_HD_RECTS, {
      chroma: 'lossy-green',
      trim: 'tight',
      isolateMainBody: true,
    }).map((f) => downscaleFrame(f, 220, true));

    const mini = sliceFrames(hdImg, SHOGUN_ALPHAMON_MINI_RECTS, {
      chroma: 'lossy-green',
      trim: 'tight',
      isolateMainBody: true,
    });

    const set: CharacterSpriteSet = {
      id: SHOGUN_ALPHAMON_META.id,
      directionOrder: DIRECTIONS_8,
      groups: {
        idle,
        idleLarge: rawIdle,
        walk,
        battle,
        battleLarge: rawBattle,
        hd,
        mini,
      },
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

/** Synchronous cache lookup (returns `null` until `loadShogunAlphamon` resolves). */
export function getShogunAlphamonSync(
  baseUrl = SHOGUN_ALPHAMON_DEFAULT_ASSET_BASE
): CharacterSpriteSet | null {
  return spriteCache.get(baseUrl) ?? null;
}

/** Clears cached Shogun Alphamon sprite canvases. */
export function clearShogunAlphamonCache(): void {
  spriteCache.clear();
}

/** Creates an engine-agnostic 8-direction animator for Shogun Alphamon. */
export function createShogunAlphamonAnimator(
  sprites: CharacterSpriteSet
): CharacterAnimator<ShogunAlphamonActionId> {
  return new CharacterAnimator(
    sprites,
    SHOGUN_ALPHAMON_IDLE_CLIP,
    SHOGUN_ALPHAMON_WALK_CLIP,
    SHOGUN_ALPHAMON_ACTIONS
  );
}
