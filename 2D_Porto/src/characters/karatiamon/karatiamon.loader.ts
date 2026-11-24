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
  KARATIAMON_ACTIONS,
  KARATIAMON_IDLE_CLIP,
  KARATIAMON_WALK_CLIP,
  type KaratiamonActionId,
} from './karatiamon.animations';
import {
  KARATIAMON_DEFAULT_ASSET_BASE,
  resolveKaratiamonAssets,
} from './karatiamon.assets';
import {
  KARATIAMON_BATTLE_COMBOS,
  KARATIAMON_HD_RECTS,
  KARATIAMON_ICON_RECT,
  KARATIAMON_IDLE_STEPS_BY_DIR,
  KARATIAMON_MINI_RECTS,
  KARATIAMON_WALK_STEPS_BY_DIR,
  gridCell,
  walkCell,
} from './karatiamon.frames';
import { KARATIAMON_META } from './karatiamon.meta';

const spriteCache = new Map<string, CharacterSpriteSet>();
const inflightByBase = new Map<string, Promise<CharacterSpriteSet>>();

/**
 * Loads and cleanly slices all 4 Karatiamon sprite sheets into a cached `CharacterSpriteSet`.
 * Uses `chroma: 'border-green-despill'` so green halos around glowing violet flames and
 * between legs vanish cleanly while preserving dark-outlined lime-green body accents,
 * and uses the single-tail `walk-cycle.jpg` North pose for `N` idle (source `idle.png` Row 4 has 2 tails).
 */
export async function loadKaratiamon(
  baseUrl = KARATIAMON_DEFAULT_ASSET_BASE,
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
    const urls = resolveKaratiamonAssets(baseUrl);
    const [idleImg, walkImg] = await Promise.all([
      loadImage(urls.idle),
      loadImage(urls.walk),
    ]);
    const extraPromises =
      mode === 'full' ? Promise.all([loadImage(urls.battle), loadImage(urls.sheet)]) : null;

    const northIdleFrame = sliceFrames(
      walkImg,
      [walkCell(2, 2), walkCell(2, 2), walkCell(2, 2), walkCell(2, 2)],
      { chroma: 'border-green-despill', trim: 'uniform' }
    );
    await yieldToFrame();

    const rawIdle: CharacterFrame[] = [];
    for (const dir of DIRECTIONS_8) {
      const steps = KARATIAMON_IDLE_STEPS_BY_DIR[dir];
      if (mode === 'overworld' && !CARDINAL_DIRECTIONS.has(dir)) {
        for (let i = 0; i < steps.length; i++) rawIdle.push(createEmptyFrame());
        continue;
      }
      if (dir === 'N') {
        rawIdle.push(...northIdleFrame);
        continue;
      }
      const rects = steps.map((s) => gridCell(s.row, s.col));
      const frames = sliceFrames(idleImg, rects, {
        chroma: 'border-green-despill',
        trim: 'uniform',
      }).map((frame, i) => (steps[i].flipX ? flipFrame(frame) : frame));
      rawIdle.push(...frames);
      await yieldToFrame();
    }
    const idle = rawIdle.map((f) => downscaleFrame(f, 96, true));

    const walk: CharacterFrame[] = [];
    for (const dir of DIRECTIONS_8) {
      const steps = KARATIAMON_WALK_STEPS_BY_DIR[dir];
      if (mode === 'overworld' && !CARDINAL_DIRECTIONS.has(dir)) {
        for (let i = 0; i < steps.length; i++) walk.push(createEmptyFrame());
        continue;
      }
      const rects = steps.map((s) => walkCell(s.row, s.col));
      const frames = sliceFrames(walkImg, rects, {
        chroma: 'border-green-despill',
        trim: 'uniform',
      })
        .map((f) => downscaleFrame(f, 96, true))
        .map((frame, i) => (steps[i].flipX ? flipFrame(frame) : frame));
      walk.push(...frames);
      await yieldToFrame();
    }

    if (mode === 'overworld') {
      const set: CharacterSpriteSet = {
        id: KARATIAMON_META.id,
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

    const rawBattle = KARATIAMON_BATTLE_COMBOS.flatMap((combo) =>
      sliceFrames(battleImg, combo, {
        chroma: 'border-green-despill',
        trim: 'uniform',
      })
    );
    const battle = rawBattle.map((f) => downscaleFrame(f, 112, true));
    const battleLarge = rawBattle.map((f) => downscaleFrame(f, 220, true));
    await yieldToFrame();

    const [icon = null] = sliceFrames(hdImg, [KARATIAMON_ICON_RECT], {
      chroma: 'border-green-despill',
      trim: 'tight',
      isolateMainBody: true,
    });

    const hd = sliceFrames(hdImg, KARATIAMON_HD_RECTS, {
      chroma: 'border-green-despill',
      trim: 'tight',
    }).map((f) => downscaleFrame(f, 220, true));

    const mini = sliceFrames(hdImg, KARATIAMON_MINI_RECTS, {
      chroma: 'border-green-despill',
      trim: 'tight',
    });

    const set: CharacterSpriteSet = {
      id: KARATIAMON_META.id,
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

/** Synchronous cache lookup (returns `null` until `loadKaratiamon` resolves). */
export function getKaratiamonSync(
  baseUrl = KARATIAMON_DEFAULT_ASSET_BASE
): CharacterSpriteSet | null {
  return spriteCache.get(`${baseUrl}::full`) ?? spriteCache.get(`${baseUrl}::overworld`) ?? null;
}

/** Clears cached Karatiamon sprite canvases. */
export function clearKaratiamonCache(): void {
  spriteCache.clear();
}

/** Creates an engine-agnostic 8-direction animator for Karatiamon. */
export function createKaratiamonAnimator(
  sprites: CharacterSpriteSet
): CharacterAnimator<KaratiamonActionId> {
  return new CharacterAnimator(
    sprites,
    KARATIAMON_IDLE_CLIP,
    KARATIAMON_WALK_CLIP,
    KARATIAMON_ACTIONS
  );
}
