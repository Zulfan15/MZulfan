import { CharacterAnimator } from '../_shared/CharacterAnimator';
import {
  downscaleFrame,
  frameToDataUrl,
  loadImage,
  sliceFrames,
} from '../_shared/sheetSlicer';
import { DIRECTIONS_8, type CharacterSpriteSet } from '../_shared/types';
import {
  MAZAGAMON_ACTIONS,
  MAZAGAMON_IDLE_CLIP,
  MAZAGAMON_WALK_CLIP,
  type MazagamonActionId,
} from './mazagamon.animations';
import {
  MAZAGAMON_DEFAULT_ASSET_BASE,
  resolveMazagamonAssets,
} from './mazagamon.assets';
import {
  MAZAGAMON_BATTLE_RECTS,
  MAZAGAMON_IDLE_RECTS,
  MAZAGAMON_JPG_HD_RECTS,
  MAZAGAMON_JPG_ICON_RECT,
  MAZAGAMON_JPG_MINI_RECTS,
  MAZAGAMON_WALK_RECTS,
} from './mazagamon.frames';
import { MAZAGAMON_META } from './mazagamon.meta';

const spriteCache = new Map<string, CharacterSpriteSet>();
const inflightByBase = new Map<string, Promise<CharacterSpriteSet>>();

/**
 * Loads and cleanly slices all 4 Mazagamon sheets into a cached `CharacterSpriteSet`.
 * Deduplicates concurrent requests and caches per `baseUrl`.
 */
export async function loadMazagamon(
  baseUrl = MAZAGAMON_DEFAULT_ASSET_BASE
): Promise<CharacterSpriteSet> {
  const cached = spriteCache.get(baseUrl);
  if (cached) return cached;

  const existing = inflightByBase.get(baseUrl);
  if (existing) return existing;

  const task = (async () => {
    const urls = resolveMazagamonAssets(baseUrl);
    const [idleImg, walkImg, battleImg, jpgImg] = await Promise.all([
      loadImage(urls.idle),
      loadImage(urls.walk),
      loadImage(urls.battle),
      loadImage(urls.sheet),
    ]);

    const idle = sliceFrames(idleImg, MAZAGAMON_IDLE_RECTS, {
      chroma: 'lossy-teal',
      trim: 'tight',
    });

    const rawWalkPose = sliceFrames(walkImg, MAZAGAMON_WALK_RECTS, {
      chroma: 'lossy-teal',
      trim: 'tight',
    });
    const walkPose = rawWalkPose.map((f) => downscaleFrame(f, 96, true));
    const walkLarge = rawWalkPose.map((f) => downscaleFrame(f, 220, true));

    // Pair idle + dynamic walk-stance pose per direction (2 steps x 8 directions)
    const walk = DIRECTIONS_8.flatMap((_, dirIdx) => [
      walkPose[dirIdx] ?? idle[dirIdx],
      idle[dirIdx] ?? walkPose[dirIdx],
    ]);

    const rawBattle = sliceFrames(battleImg, MAZAGAMON_BATTLE_RECTS, {
      chroma: 'lossy-teal',
      trim: 'tight',
    });
    const battle = rawBattle.map((f) => downscaleFrame(f, 112, true));
    const battleLarge = rawBattle.map((f) => downscaleFrame(f, 220, true));

    const [icon = null] = sliceFrames(jpgImg, [MAZAGAMON_JPG_ICON_RECT], {
      chroma: 'lossy-green',
      trim: 'tight',
      isolateMainBody: true,
    });

    const hd = sliceFrames(jpgImg, MAZAGAMON_JPG_HD_RECTS, {
      chroma: 'lossy-green',
      trim: 'tight',
      isolateMainBody: true,
    }).map((f) => downscaleFrame(f, 220, true));

    const mini = sliceFrames(jpgImg, MAZAGAMON_JPG_MINI_RECTS, {
      chroma: 'lossy-green',
      trim: 'tight',
      isolateMainBody: true,
    });

    const set: CharacterSpriteSet = {
      id: MAZAGAMON_META.id,
      directionOrder: DIRECTIONS_8,
      groups: { idle, walk, walkPose, walkLarge, battle, battleLarge, hd, mini },
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

/** Synchronous cache lookup (returns `null` until `loadMazagamon` resolves). */
export function getMazagamonSync(
  baseUrl = MAZAGAMON_DEFAULT_ASSET_BASE
): CharacterSpriteSet | null {
  return spriteCache.get(baseUrl) ?? null;
}

/** Clears cached Mazagamon sprite canvases. */
export function clearMazagamonCache(): void {
  spriteCache.clear();
}

/** Creates an engine-agnostic 8-direction animator for Mazagamon. */
export function createMazagamonAnimator(
  sprites: CharacterSpriteSet
): CharacterAnimator<MazagamonActionId> {
  return new CharacterAnimator(
    sprites,
    MAZAGAMON_IDLE_CLIP,
    MAZAGAMON_WALK_CLIP,
    MAZAGAMON_ACTIONS
  );
}
