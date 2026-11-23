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

/**
 * Loads and cleanly slices all 5 Jesmon (X Antibody) sprite sheets into a cached `CharacterSpriteSet`.
 * Deduplicates concurrent requests and caches per `baseUrl`.
 */
export async function loadJesmonX(
  baseUrl = JESMON_X_DEFAULT_ASSET_BASE
): Promise<CharacterSpriteSet> {
  const cached = spriteCache.get(baseUrl);
  if (cached) return cached;

  const existing = inflightByBase.get(baseUrl);
  if (existing) return existing;

  const task = (async () => {
    const urls = resolveJesmonXAssets(baseUrl);
    const [idleImg, walkImg, battleImg, jpgImg, dsImg] = await Promise.all([
      loadImage(urls.idle),
      loadImage(urls.walk),
      loadImage(urls.battle),
      loadImage(urls.sheet),
      loadImage(urls.ds),
    ]);

    const stepOrder = DIRECTIONS_8.flatMap((dir) => JESMON_X_STEPS_BY_DIR[dir]);
    const stepRects = stepOrder.map((s) => gridCell8x4(s.row, s.col));

    const slicedIdle = sliceFrames(idleImg, stepRects, {
      chroma: 'lossy-green',
      trim: 'uniform',
      isolateMainBody: true,
    }).map((f) => downscaleFrame(f, 96, true));
    const idle = slicedIdle.map((frame, i) => (stepOrder[i].flipX ? flipFrame(frame) : frame));

    const slicedWalk = sliceFrames(walkImg, stepRects, {
      chroma: 'lossy-green',
      trim: 'uniform',
      isolateMainBody: true,
    }).map((f) => downscaleFrame(f, 96, true));
    const walk = slicedWalk.map((frame, i) => (stepOrder[i].flipX ? flipFrame(frame) : frame));

    const rawBattle = sliceFrames(battleImg, JESMON_X_BATTLE_RECTS, {
      chroma: 'lossy-green',
      trim: 'tight',
    });
    const battle = rawBattle.map((f) => downscaleFrame(f, 112, true));
    const battleLarge = rawBattle.map((f) => downscaleFrame(f, 220, true));

    const dsIdle = sliceFrames(dsImg, JESMON_X_DS_IDLE_RECTS, {
      chroma: 'ds-teal-mint',
      trim: 'tight',
    }).map((f) => downscaleFrame(f, 220, true));

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

    spriteCache.set(baseUrl, set);
    return set;
  })().finally(() => {
    inflightByBase.delete(baseUrl);
  });

  inflightByBase.set(baseUrl, task);
  return task;
}

/** Synchronous cache lookup (returns `null` until `loadJesmonX` resolves). */
export function getJesmonXSync(
  baseUrl = JESMON_X_DEFAULT_ASSET_BASE
): CharacterSpriteSet | null {
  return spriteCache.get(baseUrl) ?? null;
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
