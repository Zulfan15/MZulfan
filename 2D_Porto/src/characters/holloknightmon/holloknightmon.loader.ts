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
  HOLLOKNIGHTMON_WALK_STEPS_BY_DIR,
} from './holloknightmon.frames';
import { HOLLOKNIGHTMON_META } from './holloknightmon.meta';

const spriteCache = new Map<string, CharacterSpriteSet>();
const inflightByBase = new Map<string, Promise<CharacterSpriteSet>>();

/**
 * Loads and cleanly slices all 4 Holloknightmon sprite sheets into a cached `CharacterSpriteSet`.
 * Deduplicates concurrent requests and caches per `baseUrl`.
 */
export async function loadHolloknightmon(
  baseUrl = HOLLOKNIGHTMON_DEFAULT_ASSET_BASE
): Promise<CharacterSpriteSet> {
  const cached = spriteCache.get(baseUrl);
  if (cached) return cached;

  const existing = inflightByBase.get(baseUrl);
  if (existing) return existing;

  const task = (async () => {
    const urls = resolveHolloknightmonAssets(baseUrl);
    const [idleImg, walkImg, battleImg, jpgImg] = await Promise.all([
      loadImage(urls.idle),
      loadImage(urls.walk),
      loadImage(urls.battle),
      loadImage(urls.sheet),
    ]);

    const idleSteps = DIRECTIONS_8.flatMap((dir) => HOLLOKNIGHTMON_IDLE_STEPS_BY_DIR[dir]);
    const idleRects = idleSteps.map((s) => gridCell8x4(s.row, s.col));
    const slicedIdle = sliceFrames(idleImg, idleRects, {
      chroma: 'lossy-green',
      trim: 'uniform',
      isolateMainBody: true,
    }).map((f) => downscaleFrame(f, 96, true));
    const idle = slicedIdle.map((frame, i) => (idleSteps[i].flipX ? flipFrame(frame) : frame));

    const walkSteps = DIRECTIONS_8.flatMap((dir) => HOLLOKNIGHTMON_WALK_STEPS_BY_DIR[dir]);
    const walkRects = walkSteps.map((s) => gridCell8x4(s.row, s.col));
    const slicedWalk = sliceFrames(walkImg, walkRects, {
      chroma: 'lossy-green',
      trim: 'uniform',
      isolateMainBody: true,
    }).map((f) => downscaleFrame(f, 96, true));
    const walk = slicedWalk.map((frame, i) => (walkSteps[i].flipX ? flipFrame(frame) : frame));

    const rawBattle = sliceFrames(battleImg, HOLLOKNIGHTMON_BATTLE_RECTS, {
      chroma: 'lossy-green',
      trim: 'tight',
    });
    const battle = rawBattle.map((f) => downscaleFrame(f, 112, true));
    const battleLarge = rawBattle.map((f) => downscaleFrame(f, 220, true));

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

/** Synchronous cache lookup (returns `null` until `loadHolloknightmon` resolves). */
export function getHolloknightmonSync(
  baseUrl = HOLLOKNIGHTMON_DEFAULT_ASSET_BASE
): CharacterSpriteSet | null {
  return spriteCache.get(baseUrl) ?? null;
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
