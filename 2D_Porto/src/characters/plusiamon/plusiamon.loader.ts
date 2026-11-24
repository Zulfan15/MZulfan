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
  PLUSIAMON_WALK_STEPS_BY_DIR,
  walkCell,
} from './plusiamon.frames';
import { PLUSIAMON_META } from './plusiamon.meta';

const spriteCache = new Map<string, CharacterSpriteSet>();
const inflightByBase = new Map<string, Promise<CharacterSpriteSet>>();

/**
 * Loads and cleanly slices all 5 Plusiamon sprite sheets into a cached `CharacterSpriteSet`.
 * Deduplicates concurrent requests and caches per `baseUrl`.
 */
export async function loadPlusiamon(
  baseUrl = PLUSIAMON_DEFAULT_ASSET_BASE,
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
    const urls = resolvePlusiamonAssets(baseUrl);
    const [idleImg, walkImg] = await Promise.all([
      loadImage(urls.idle),
      loadImage(urls.walk),
    ]);
    const extraPromises =
      mode === 'full'
        ? Promise.all([loadImage(urls.battle), loadImage(urls.sheet), loadImage(urls.ds)])
        : null;

    let idle: CharacterFrame[];
    if (mode === 'overworld') {
      const cardinalIdle = sliceFrames(
        idleImg,
        [PLUSIAMON_IDLE_RECTS[0], PLUSIAMON_IDLE_RECTS[2], PLUSIAMON_IDLE_RECTS[4], PLUSIAMON_IDLE_RECTS[6]],
        { chroma: 'flat-green', trim: 'tight' }
      );
      const empty = createEmptyFrame();
      idle = [cardinalIdle[0], empty, cardinalIdle[1], empty, cardinalIdle[2], empty, cardinalIdle[3], empty];
    } else {
      idle = sliceFrames(idleImg, PLUSIAMON_IDLE_RECTS, {
        chroma: 'flat-green',
        trim: 'tight',
      });
    }
    await yieldToFrame();

    const walk: CharacterFrame[] = [];
    for (const dir of DIRECTIONS_8) {
      const steps = PLUSIAMON_WALK_STEPS_BY_DIR[dir];
      if (mode === 'overworld' && !CARDINAL_DIRECTIONS.has(dir)) {
        for (let i = 0; i < steps.length; i++) walk.push(createEmptyFrame());
        continue;
      }
      const rects = steps.map((s) => walkCell(s.row, s.col));
      const frames = sliceFrames(walkImg, rects, {
        chroma: 'lossy-green',
        trim: 'uniform',
      })
        .map((f) => downscaleFrame(f, 96, true))
        .map((frame, i) => (steps[i].flipX ? flipFrame(frame) : frame));
      walk.push(...frames);
      await yieldToFrame();
    }

    if (mode === 'overworld') {
      const set: CharacterSpriteSet = {
        id: PLUSIAMON_META.id,
        directionOrder: DIRECTIONS_8,
        groups: { idle, walk, battle: [], battleLarge: [], dsIdle: [], hd: [], mini: [] },
        icon: null,
        iconDataUrl: null,
        loadedAt: performance.now(),
      };
      spriteCache.set(cacheKey, set);
      return set;
    }

    const [battleImg, jpgImg, dsImg] = await extraPromises!;
    const rawBattle = sliceFrames(battleImg, PLUSIAMON_BATTLE_RECTS, {
      chroma: 'lossy-green',
      trim: 'tight',
    });
    const battle = rawBattle.map((f) => downscaleFrame(f, 112, false));
    await yieldToFrame();

    const dsIdle = sliceFrames(dsImg, PLUSIAMON_DS_IDLE_RECTS, {
      chroma: 'ds-teal-mint',
      trim: 'tight',
    }).map((f) => downscaleFrame(f, 220, true));
    await yieldToFrame();

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

    spriteCache.set(cacheKey, set);
    return set;
  })().finally(() => {
    inflightByBase.delete(cacheKey);
  });

  inflightByBase.set(cacheKey, task);
  return task;
}

/** Synchronous cache lookup (returns `null` until `loadPlusiamon` resolves). */
export function getPlusiamonSync(
  baseUrl = PLUSIAMON_DEFAULT_ASSET_BASE
): CharacterSpriteSet | null {
  return spriteCache.get(`${baseUrl}::full`) ?? spriteCache.get(`${baseUrl}::overworld`) ?? null;
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
