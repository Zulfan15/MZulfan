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
  GASPIRITAMON_ACTIONS,
  GASPIRITAMON_IDLE_CLIP,
  GASPIRITAMON_WALK_CLIP,
  type GaspiritamonActionId,
} from './gaspiritamon.animations';
import {
  GASPIRITAMON_DEFAULT_ASSET_BASE,
  resolveGaspiritamonAssets,
} from './gaspiritamon.assets';
import {
  gridCell8x4,
  GASPIRITAMON_BATTLE_RECTS,
  GASPIRITAMON_JPG_HD_RECTS,
  GASPIRITAMON_JPG_ICON_RECT,
  GASPIRITAMON_JPG_MINI_RECTS,
  GASPIRITAMON_WALK_STEPS_BY_DIR,
  GASPIRITAMON_WALK_STEPS_PER_DIR,
} from './gaspiritamon.frames';
import { GASPIRITAMON_META } from './gaspiritamon.meta';

const spriteCache = new Map<string, CharacterSpriteSet>();
const inflightByBase = new Map<string, Promise<CharacterSpriteSet>>();

/**
 * Loads and cleanly slices all 3 Gaspiritamon sprite sheets into a cached `CharacterSpriteSet`.
 * Uses `border-green` chroma keying so glowing emerald-cyan runes on Gaspiritamon's hammer and shield stay intact.
 */
export async function loadGaspiritamon(
  baseUrl = GASPIRITAMON_DEFAULT_ASSET_BASE
): Promise<CharacterSpriteSet> {
  const cached = spriteCache.get(baseUrl);
  if (cached) return cached;

  const existing = inflightByBase.get(baseUrl);
  if (existing) return existing;

  const task = (async () => {
    const urls = resolveGaspiritamonAssets(baseUrl);
    const [walkImg, battleImg, jpgImg] = await Promise.all([
      loadImage(urls.walk),
      loadImage(urls.battle),
      loadImage(urls.sheet),
    ]);

    const stepOrder = DIRECTIONS_8.flatMap((dir) => GASPIRITAMON_WALK_STEPS_BY_DIR[dir]);
    const stepRects = stepOrder.map((s) => gridCell8x4(s.row, s.col));

    const slicedWalk = sliceFrames(walkImg, stepRects, {
      chroma: 'border-green',
      trim: 'uniform',
      isolateMainBody: true,
    }).map((f) => downscaleFrame(f, 96, true));
    const walk = slicedWalk.map((frame, i) => (stepOrder[i].flipX ? flipFrame(frame) : frame));

    // Reuse the standing pose (frame 0 of each direction) for idle
    const idle = DIRECTIONS_8.map((_, dirIdx) => walk[dirIdx * GASPIRITAMON_WALK_STEPS_PER_DIR]);

    const rawBattle = sliceFrames(battleImg, GASPIRITAMON_BATTLE_RECTS, {
      chroma: 'border-green',
      trim: 'tight',
    });
    const battle = rawBattle.map((f) => downscaleFrame(f, 112, true));
    const battleLarge = rawBattle.map((f) => downscaleFrame(f, 220, true));

    const [icon = null] = sliceFrames(jpgImg, [GASPIRITAMON_JPG_ICON_RECT], {
      chroma: 'border-green',
      trim: 'tight',
      isolateMainBody: true,
    });

    const hd = sliceFrames(jpgImg, GASPIRITAMON_JPG_HD_RECTS, {
      chroma: 'border-green',
      trim: 'tight',
      isolateMainBody: true,
    }).map((f) => downscaleFrame(f, 220, true));

    const mini = sliceFrames(jpgImg, GASPIRITAMON_JPG_MINI_RECTS, {
      chroma: 'border-green',
      trim: 'tight',
      isolateMainBody: true,
    });

    const set: CharacterSpriteSet = {
      id: GASPIRITAMON_META.id,
      directionOrder: DIRECTIONS_8,
      groups: { idle, walk, battle, battleLarge, hd, mini },
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

/** Synchronous cache lookup (returns `null` until `loadGaspiritamon` resolves). */
export function getGaspiritamonSync(
  baseUrl = GASPIRITAMON_DEFAULT_ASSET_BASE
): CharacterSpriteSet | null {
  return spriteCache.get(baseUrl) ?? null;
}

/** Clears cached Gaspiritamon sprite canvases. */
export function clearGaspiritamonCache(): void {
  spriteCache.clear();
}

/** Creates an engine-agnostic 8-direction animator for Gaspiritamon. */
export function createGaspiritamonAnimator(
  sprites: CharacterSpriteSet
): CharacterAnimator<GaspiritamonActionId> {
  return new CharacterAnimator(
    sprites,
    GASPIRITAMON_IDLE_CLIP,
    GASPIRITAMON_WALK_CLIP,
    GASPIRITAMON_ACTIONS
  );
}
