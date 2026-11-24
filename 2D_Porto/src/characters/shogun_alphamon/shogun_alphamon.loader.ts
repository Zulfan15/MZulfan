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
  SHOGUN_ALPHAMON_BATTLE_COMBOS,
  SHOGUN_ALPHAMON_HD_RECTS,
  SHOGUN_ALPHAMON_JPG_ICON_RECT,
  SHOGUN_ALPHAMON_MINI_RECTS,
  SHOGUN_ALPHAMON_STEPS_BY_DIR,
  SHOGUN_ALPHAMON_WALK_STEPS_BY_DIR,
  walkCell,
} from './shogun_alphamon.frames';
import { SHOGUN_ALPHAMON_META } from './shogun_alphamon.meta';

const spriteCache = new Map<string, CharacterSpriteSet>();
const inflightByBase = new Map<string, Promise<CharacterSpriteSet>>();

/**
 * Loads and cleanly slices all 4 Shogun Alphamon sprite sheets into a cached `CharacterSpriteSet`.
 * Deduplicates concurrent requests and caches per `baseUrl`.
 */
export async function loadShogunAlphamon(
  baseUrl = SHOGUN_ALPHAMON_DEFAULT_ASSET_BASE,
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
    const urls = resolveShogunAlphamonAssets(baseUrl);
    const [idleImg, walkImg] = await Promise.all([
      loadImage(urls.idle),
      loadImage(urls.walk),
    ]);
    const extraPromises =
      mode === 'full' ? Promise.all([loadImage(urls.battle), loadImage(urls.sheet)]) : null;

    // Slice per direction with `trim: 'uniform'` so all 4 frames of a direction
    // share the exact same union bounding box without wide-row padding bleed.
    const rawIdle: CharacterFrame[] = [];
    for (const dir of DIRECTIONS_8) {
      const rects = SHOGUN_ALPHAMON_STEPS_BY_DIR[dir];
      if (mode === 'overworld' && !CARDINAL_DIRECTIONS.has(dir)) {
        for (let i = 0; i < rects.length; i++) rawIdle.push(createEmptyFrame());
        continue;
      }
      const frames = sliceFrames(idleImg, rects, {
        chroma: 'lossy-green',
        trim: 'uniform',
        isolateMainBody: true,
      });
      rawIdle.push(...frames);
      await yieldToFrame();
    }
    const idle = rawIdle.map((f) => downscaleFrame(f, 96, true));

    const walk: CharacterFrame[] = [];
    for (const dir of DIRECTIONS_8) {
      const steps = SHOGUN_ALPHAMON_WALK_STEPS_BY_DIR[dir];
      if (mode === 'overworld' && !CARDINAL_DIRECTIONS.has(dir)) {
        for (let i = 0; i < steps.length; i++) walk.push(createEmptyFrame());
        continue;
      }
      const rects = steps.map((s) => walkCell(s.row, s.col));
      const frames = sliceFrames(walkImg, rects, {
        chroma: 'lossy-green',
        trim: 'uniform',
        isolateMainBody: dir === 'N',
      })
        .map((f) => downscaleFrame(f, 96, true))
        .map((frame, i) => (steps[i].flipX ? flipFrame(frame) : frame));
      walk.push(...frames);
      await yieldToFrame();
    }

    if (mode === 'overworld') {
      const set: CharacterSpriteSet = {
        id: SHOGUN_ALPHAMON_META.id,
        directionOrder: DIRECTIONS_8,
        groups: { idle, idleLarge: [], walk, battle: [], battleLarge: [], hd: [], mini: [] },
        icon: null,
        iconDataUrl: null,
        loadedAt: performance.now(),
      };
      spriteCache.set(cacheKey, set);
      return set;
    }

    const [battleImg, hdImg] = await extraPromises!;
    const idleLarge = rawIdle.slice(0, 4).map((f) => downscaleFrame(f, 220, true));

    // Slice each 4-frame directional attack combo uniformly so the horse body
    // does not shift horizontally when the golden flame crescent swings out on frame 2.
    const rawBattle = SHOGUN_ALPHAMON_BATTLE_COMBOS.flatMap((combo) =>
      sliceFrames(battleImg, combo, {
        chroma: 'lossy-green',
        trim: 'uniform',
      })
    );
    const battle = rawBattle.map((f) => downscaleFrame(f, 112, true));
    const battleLarge = rawBattle.map((f) => downscaleFrame(f, 220, true));
    await yieldToFrame();

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
        idleLarge,
        walk,
        battle,
        battleLarge,
        hd,
        mini,
      },
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

/** Synchronous cache lookup (returns `null` until `loadShogunAlphamon` resolves). */
export function getShogunAlphamonSync(
  baseUrl = SHOGUN_ALPHAMON_DEFAULT_ASSET_BASE
): CharacterSpriteSet | null {
  return spriteCache.get(`${baseUrl}::full`) ?? spriteCache.get(`${baseUrl}::overworld`) ?? null;
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
