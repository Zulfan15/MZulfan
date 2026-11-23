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
  RAGNALOARDMON_ACTIONS,
  RAGNALOARDMON_IDLE_CLIP,
  RAGNALOARDMON_WALK_CLIP,
  type RagnaloardmonActionId,
} from './ragnaloardmon.animations';
import {
  RAGNALOARDMON_DEFAULT_ASSET_BASE,
  resolveRagnaloardmonAssets,
} from './ragnaloardmon.assets';
import {
  RAGNALOARDMON_BATTLE_RECTS,
  RAGNALOARDMON_DS_IDLE_RECTS,
  RAGNALOARDMON_IDLE_DIRECTION_MAP,
  RAGNALOARDMON_IDLE_RECTS,
  RAGNALOARDMON_JPG_HD_RECTS,
  RAGNALOARDMON_JPG_ICON_RECT,
  RAGNALOARDMON_JPG_MINI_RECTS,
  RAGNALOARDMON_WALK_CELL_RECT,
  RAGNALOARDMON_WALK_STEPS_BY_DIR,
} from './ragnaloardmon.frames';
import { RAGNALOARDMON_META } from './ragnaloardmon.meta';

const spriteCache = new Map<string, CharacterSpriteSet>();
const inflightByBase = new Map<string, Promise<CharacterSpriteSet>>();

/**
 * Loads and cleanly slices all 5 Ragnaloardmon sheets into a cached `CharacterSpriteSet`.
 * Deduplicates concurrent requests and caches per `baseUrl`.
 */
export async function loadRagnaloardmon(
  baseUrl = RAGNALOARDMON_DEFAULT_ASSET_BASE
): Promise<CharacterSpriteSet> {
  const cached = spriteCache.get(baseUrl);
  if (cached) return cached;

  const existing = inflightByBase.get(baseUrl);
  if (existing) return existing;

  const task = (async () => {
    const urls = resolveRagnaloardmonAssets(baseUrl);
    const [idleImg, walkImg, battleImg, jpgImg, dsImg] = await Promise.all([
      loadImage(urls.idle),
      loadImage(urls.walk),
      loadImage(urls.battle),
      loadImage(urls.sheet),
      loadImage(urls.ds),
    ]);

    const rawIdle = sliceFrames(idleImg, RAGNALOARDMON_IDLE_RECTS, {
      chroma: 'lossy-teal',
      trim: 'tight',
    });
    const idle = DIRECTIONS_8.map((dir) => {
      const mapping = RAGNALOARDMON_IDLE_DIRECTION_MAP[dir];
      const base = rawIdle[mapping.rawIndex] ?? rawIdle[0];
      return mapping.flipX ? flipFrame(base) : base;
    });

    // Collect unique walk cells once so uniform trimming & downscaling keep every frame aligned
    const walkStepOrder = DIRECTIONS_8.flatMap((dir) => RAGNALOARDMON_WALK_STEPS_BY_DIR[dir]);
    const walkRects = walkStepOrder.map((s) => RAGNALOARDMON_WALK_CELL_RECT(s.row, s.col));
    const slicedWalk = sliceFrames(walkImg, walkRects, {
      chroma: 'lossy-teal',
      trim: 'uniform',
    }).map((f) => downscaleFrame(f, 96, true));
    const walk = slicedWalk.map((frame, i) =>
      walkStepOrder[i].flipX ? flipFrame(frame) : frame
    );

    // Slice battle.jpg both for large DigiDex attack (~220px) and compact overworld actions (~112px)
    const rawBattle = sliceFrames(battleImg, RAGNALOARDMON_BATTLE_RECTS, {
      chroma: 'lossy-teal',
      trim: 'tight',
    });
    const battle = rawBattle.map((f) => downscaleFrame(f, 112, true));
    const battleLarge = rawBattle.map((f) => downscaleFrame(f, 220, true));

    const dsIdle = sliceFrames(dsImg, RAGNALOARDMON_DS_IDLE_RECTS, {
      chroma: 'ds-teal-mint',
      trim: 'tight',
    }).map((f) => downscaleFrame(f, 220, true));

    const [icon = null] = sliceFrames(jpgImg, [RAGNALOARDMON_JPG_ICON_RECT], {
      chroma: 'lossy-green',
      trim: 'tight',
      isolateMainBody: true,
    });

    const hd = sliceFrames(jpgImg, RAGNALOARDMON_JPG_HD_RECTS, {
      chroma: 'lossy-green',
      trim: 'tight',
      isolateMainBody: true,
    }).map((f) => downscaleFrame(f, 220, true));

    const mini = sliceFrames(jpgImg, RAGNALOARDMON_JPG_MINI_RECTS, {
      chroma: 'lossy-green',
      trim: 'tight',
      isolateMainBody: true,
    });

    const set: CharacterSpriteSet = {
      id: RAGNALOARDMON_META.id,
      directionOrder: DIRECTIONS_8,
      groups: { idle, walk, battle, battleLarge, dsIdle, hd, mini },
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

/** Synchronous cache lookup (returns `null` until `loadRagnaloardmon` resolves). */
export function getRagnaloardmonSync(
  baseUrl = RAGNALOARDMON_DEFAULT_ASSET_BASE
): CharacterSpriteSet | null {
  return spriteCache.get(baseUrl) ?? null;
}

/** Clears cached Ragnaloardmon sprite canvases. */
export function clearRagnaloardmonCache(): void {
  spriteCache.clear();
}

/** Creates an engine-agnostic 8-direction animator for Ragnaloardmon. */
export function createRagnaloardmonAnimator(
  sprites: CharacterSpriteSet
): CharacterAnimator<RagnaloardmonActionId> {
  return new CharacterAnimator(
    sprites,
    RAGNALOARDMON_IDLE_CLIP,
    RAGNALOARDMON_WALK_CLIP,
    RAGNALOARDMON_ACTIONS
  );
}
