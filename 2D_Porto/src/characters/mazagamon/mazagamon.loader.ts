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
  MAZAGAMON_WALK_STEPS_BY_DIR,
  walkCell,
} from './mazagamon.frames';
import { MAZAGAMON_META } from './mazagamon.meta';

const spriteCache = new Map<string, CharacterSpriteSet>();
const inflightByBase = new Map<string, Promise<CharacterSpriteSet>>();

/**
 * Loads and cleanly slices all 4 Mazagamon sheets into a cached `CharacterSpriteSet`.
 * Deduplicates concurrent requests and caches per `baseUrl`.
 */
export async function loadMazagamon(
  baseUrl = MAZAGAMON_DEFAULT_ASSET_BASE,
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
    const urls = resolveMazagamonAssets(baseUrl);
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
        [MAZAGAMON_IDLE_RECTS[0], MAZAGAMON_IDLE_RECTS[2], MAZAGAMON_IDLE_RECTS[4], MAZAGAMON_IDLE_RECTS[6]],
        { chroma: 'lossy-teal', trim: 'tight' }
      );
      const empty = createEmptyFrame();
      idle = [cardinalIdle[0], empty, cardinalIdle[1], empty, cardinalIdle[2], empty, cardinalIdle[3], empty];
    } else {
      idle = sliceFrames(idleImg, MAZAGAMON_IDLE_RECTS, {
        chroma: 'lossy-teal',
        trim: 'tight',
      });
    }
    await yieldToFrame();

    const walk: CharacterFrame[] = [];
    let southRawWalk: CharacterFrame[] = [];
    for (const dir of DIRECTIONS_8) {
      const steps = MAZAGAMON_WALK_STEPS_BY_DIR[dir];
      if (mode === 'overworld' && !CARDINAL_DIRECTIONS.has(dir)) {
        for (let i = 0; i < steps.length; i++) walk.push(createEmptyFrame());
        continue;
      }
      const rects = steps.map((s) => walkCell(s.row, s.col));
      const rawDirFrames = sliceFrames(walkImg, rects, {
        chroma: 'lossy-green',
        trim: 'uniform',
      }).map((frame, i) => (steps[i].flipX ? flipFrame(frame) : frame));
      if (dir === 'S' && mode === 'full') {
        southRawWalk = rawDirFrames;
      }
      walk.push(...rawDirFrames.map((f) => downscaleFrame(f, 96, true)));
      await yieldToFrame();
    }

    if (mode === 'overworld') {
      const set: CharacterSpriteSet = {
        id: MAZAGAMON_META.id,
        directionOrder: DIRECTIONS_8,
        groups: { idle, walk, walkLarge: [], battle: [], battleLarge: [], hd: [], mini: [] },
        icon: null,
        iconDataUrl: null,
        loadedAt: performance.now(),
      };
      spriteCache.set(cacheKey, set);
      return set;
    }

    const [battleImg, jpgImg] = await extraPromises!;
    const walkLarge = southRawWalk.slice(0, 4).map((f) => downscaleFrame(f, 220, true));

    const rawBattle = sliceFrames(battleImg, MAZAGAMON_BATTLE_RECTS, {
      chroma: 'lossy-teal',
      trim: 'tight',
    });
    const battle = rawBattle.map((f) => downscaleFrame(f, 112, true));
    const battleLarge = rawBattle.map((f) => downscaleFrame(f, 220, true));
    await yieldToFrame();

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
      groups: { idle, walk, walkLarge, battle, battleLarge, hd, mini },
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

/** Synchronous cache lookup (returns `null` until `loadMazagamon` resolves). */
export function getMazagamonSync(
  baseUrl = MAZAGAMON_DEFAULT_ASSET_BASE
): CharacterSpriteSet | null {
  return spriteCache.get(`${baseUrl}::full`) ?? spriteCache.get(`${baseUrl}::overworld`) ?? null;
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
