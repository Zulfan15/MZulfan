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
  baseUrl = RAGNALOARDMON_DEFAULT_ASSET_BASE,
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
    const urls = resolveRagnaloardmonAssets(baseUrl);
    const [idleImg, walkImg] = await Promise.all([
      loadImage(urls.idle),
      loadImage(urls.walk),
    ]);
    const extraPromises =
      mode === 'full'
        ? Promise.all([loadImage(urls.battle), loadImage(urls.sheet), loadImage(urls.ds)])
        : null;

    const rawIdle = sliceFrames(idleImg, RAGNALOARDMON_IDLE_RECTS, {
      chroma: 'lossy-teal',
      trim: 'tight',
    });
    const idle = DIRECTIONS_8.map((dir) => {
      if (mode === 'overworld' && !CARDINAL_DIRECTIONS.has(dir)) return createEmptyFrame();
      const mapping = RAGNALOARDMON_IDLE_DIRECTION_MAP[dir];
      const base = rawIdle[mapping.rawIndex] ?? rawIdle[0];
      return mapping.flipX ? flipFrame(base) : base;
    });
    await yieldToFrame();

    const walk: CharacterFrame[] = [];
    for (const dir of DIRECTIONS_8) {
      const steps = RAGNALOARDMON_WALK_STEPS_BY_DIR[dir];
      if (mode === 'overworld' && !CARDINAL_DIRECTIONS.has(dir)) {
        for (let i = 0; i < steps.length; i++) walk.push(createEmptyFrame());
        continue;
      }
      const rects = steps.map((s) => RAGNALOARDMON_WALK_CELL_RECT(s.row, s.col));
      const frames = sliceFrames(walkImg, rects, {
        chroma: 'lossy-teal',
        trim: 'uniform',
      })
        .map((f) => downscaleFrame(f, 96, true))
        .map((frame, i) => (steps[i].flipX ? flipFrame(frame) : frame));
      walk.push(...frames);
      await yieldToFrame();
    }

    if (mode === 'overworld') {
      const set: CharacterSpriteSet = {
        id: RAGNALOARDMON_META.id,
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
    // Slice battle.jpg both for large DigiDex attack (~220px) and compact overworld actions (~112px)
    const rawBattle = sliceFrames(battleImg, RAGNALOARDMON_BATTLE_RECTS, {
      chroma: 'lossy-teal',
      trim: 'tight',
    });
    const battle = rawBattle.map((f) => downscaleFrame(f, 112, true));
    const battleLarge = rawBattle.map((f) => downscaleFrame(f, 220, true));
    await yieldToFrame();

    const dsIdle = sliceFrames(dsImg, RAGNALOARDMON_DS_IDLE_RECTS, {
      chroma: 'ds-teal-mint',
      trim: 'tight',
    }).map((f) => downscaleFrame(f, 220, true));
    await yieldToFrame();

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

    spriteCache.set(cacheKey, set);
    return set;
  })().finally(() => {
    inflightByBase.delete(cacheKey);
  });

  inflightByBase.set(cacheKey, task);
  return task;
}

/** Synchronous cache lookup (returns `null` until `loadRagnaloardmon` resolves). */
export function getRagnaloardmonSync(
  baseUrl = RAGNALOARDMON_DEFAULT_ASSET_BASE
): CharacterSpriteSet | null {
  return spriteCache.get(`${baseUrl}::full`) ?? spriteCache.get(`${baseUrl}::overworld`) ?? null;
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
