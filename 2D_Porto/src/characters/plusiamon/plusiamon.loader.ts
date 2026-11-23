import { CharacterAnimator } from '../_shared/CharacterAnimator';
import {
  downscaleFrame,
  frameToDataUrl,
  loadImage,
  sliceFrames,
} from '../_shared/sheetSlicer';
import { DIRECTIONS_8, type CharacterSpriteSet } from '../_shared/types';
import {
  PLUSIAMON_ACTIONS,
  PLUSIAMON_IDLE_CLIP,
  PLUSIAMON_WALK_CLIP,
  type PlusiamonActionId,
} from './plusiamon.animations';
import {
  PLUSIAMON_DEFAULT_ASSET_BASE,
  resolvePlusiamonAssets,
} from './plusiamon.assets';
import {
  PLUSIAMON_BATTLE_RECTS,
  PLUSIAMON_DS_IDLE_RECTS,
  PLUSIAMON_IDLE_RECTS,
  PLUSIAMON_JPG_HD_RECTS,
  PLUSIAMON_JPG_ICON_RECT,
  PLUSIAMON_JPG_MINI_RECTS,
  PLUSIAMON_WALK_RECTS,
} from './plusiamon.frames';
import { PLUSIAMON_META } from './plusiamon.meta';

const spriteCache = new Map<string, CharacterSpriteSet>();
const inflightByBase = new Map<string, Promise<CharacterSpriteSet>>();

/**
 * Loads and cleanly slices all 5 Plusiamon sprite sheets into a cached `CharacterSpriteSet`.
 * Deduplicates concurrent requests and caches per `baseUrl`.
 */
export async function loadPlusiamon(
  baseUrl = PLUSIAMON_DEFAULT_ASSET_BASE
): Promise<CharacterSpriteSet> {
  const cached = spriteCache.get(baseUrl);
  if (cached) return cached;

  const existing = inflightByBase.get(baseUrl);
  if (existing) return existing;

  const task = (async () => {
    const urls = resolvePlusiamonAssets(baseUrl);
    const [idleImg, walkImg, battleImg, jpgImg, dsImg] = await Promise.all([
      loadImage(urls.idle),
      loadImage(urls.walk),
      loadImage(urls.battle),
      loadImage(urls.sheet),
      loadImage(urls.ds),
    ]);

    const idle = sliceFrames(idleImg, PLUSIAMON_IDLE_RECTS, {
      chroma: 'flat-green',
      trim: 'tight',
    });

    const walk = sliceFrames(walkImg, PLUSIAMON_WALK_RECTS, {
      chroma: 'lossy-green',
      trim: 'uniform',
    }).map((f) => downscaleFrame(f, 96, false));

    const rawBattle = sliceFrames(battleImg, PLUSIAMON_BATTLE_RECTS, {
      chroma: 'lossy-green',
      trim: 'tight',
    });
    const battle = rawBattle.map((f) => downscaleFrame(f, 112, false));

    const dsIdle = sliceFrames(dsImg, PLUSIAMON_DS_IDLE_RECTS, {
      chroma: 'ds-teal-mint',
      trim: 'tight',
    }).map((f) => downscaleFrame(f, 220, true));

    const [icon = null] = sliceFrames(jpgImg, [PLUSIAMON_JPG_ICON_RECT], {
      chroma: 'lossy-green',
      trim: 'tight',
      isolateMainBody: true,
    });

    const hd = sliceFrames(jpgImg, PLUSIAMON_JPG_HD_RECTS, {
      chroma: 'lossy-green',
      trim: 'tight',
      isolateMainBody: true,
    }).map((f) => downscaleFrame(f, 220, true));

    const mini = sliceFrames(jpgImg, PLUSIAMON_JPG_MINI_RECTS, {
      chroma: 'lossy-green',
      trim: 'tight',
      isolateMainBody: true,
    });

    const set: CharacterSpriteSet = {
      id: PLUSIAMON_META.id,
      directionOrder: DIRECTIONS_8,
      groups: { idle, walk, battle, battleLarge: rawBattle, dsIdle, hd, mini },
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

/** Synchronous cache lookup (returns `null` until `loadPlusiamon` resolves). */
export function getPlusiamonSync(
  baseUrl = PLUSIAMON_DEFAULT_ASSET_BASE
): CharacterSpriteSet | null {
  return spriteCache.get(baseUrl) ?? null;
}

/** Clears cached Plusiamon sprite canvases. */
export function clearPlusiamonCache(): void {
  spriteCache.clear();
}

/** Creates an engine-agnostic 8-direction animator for Plusiamon. */
export function createPlusiamonAnimator(
  sprites: CharacterSpriteSet
): CharacterAnimator<PlusiamonActionId> {
  return new CharacterAnimator(
    sprites,
    PLUSIAMON_IDLE_CLIP,
    PLUSIAMON_WALK_CLIP,
    PLUSIAMON_ACTIONS
  );
}
