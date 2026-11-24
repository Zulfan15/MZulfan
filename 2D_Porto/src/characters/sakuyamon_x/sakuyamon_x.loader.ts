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
  SAKUYAMON_X_ACTIONS,
  SAKUYAMON_X_IDLE_CLIP,
  SAKUYAMON_X_WALK_CLIP,
  type SakuyamonXActionId,
} from './sakuyamon_x.animations';
import {
  SAKUYAMON_X_DEFAULT_ASSET_BASE,
  resolveSakuyamonXAssets,
} from './sakuyamon_x.assets';
import {
  walkCell,
  SAKUYAMON_X_BATTLE_COMBOS,
  SAKUYAMON_X_HD_RECTS,
  SAKUYAMON_X_ICON_RECT,
  SAKUYAMON_X_IDLE_STEPS_BY_DIR,
  SAKUYAMON_X_MINI_RECTS,
  SAKUYAMON_X_WALK_STEPS_BY_DIR,
} from './sakuyamon_x.frames';
import { SAKUYAMON_X_META } from './sakuyamon_x.meta';

const spriteCache = new Map<string, CharacterSpriteSet>();
const inflightByBase = new Map<string, Promise<CharacterSpriteSet>>();

/**
 * Loads and cleanly slices all 4 Sakuyamon (X Antibody) sprite sheets into a cached `CharacterSpriteSet`.
 * Deliberately omits `isolateMainBody` on sprites/HD/battle so detached kuda-gitsune spirit foxes
 * and floating red ofuda talismans stay intact; uses `border-green` on battle to protect cyan fox-fire.
 */
export async function loadSakuyamonX(
  baseUrl = SAKUYAMON_X_DEFAULT_ASSET_BASE,
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
    const urls = resolveSakuyamonXAssets(baseUrl);
    const [idleImg, walkImg] = await Promise.all([
      loadImage(urls.idle),
      loadImage(urls.walk),
    ]);
    const extraPromises =
      mode === 'full' ? Promise.all([loadImage(urls.battle), loadImage(urls.sheet)]) : null;

    const rawIdle: CharacterFrame[] = [];
    for (const dir of DIRECTIONS_8) {
      const rects = SAKUYAMON_X_IDLE_STEPS_BY_DIR[dir];
      if (mode === 'overworld' && !CARDINAL_DIRECTIONS.has(dir)) {
        for (let i = 0; i < rects.length; i++) rawIdle.push(createEmptyFrame());
        continue;
      }
      const frames = sliceFrames(idleImg, rects, {
        chroma: 'lossy-green',
        trim: 'uniform',
      });
      rawIdle.push(...frames);
      await yieldToFrame();
    }
    const idle = rawIdle.map((f) => downscaleFrame(f, 96, true));

    const walk: CharacterFrame[] = [];
    for (const dir of DIRECTIONS_8) {
      const steps = SAKUYAMON_X_WALK_STEPS_BY_DIR[dir];
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
        id: SAKUYAMON_X_META.id,
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

    const rawBattle = SAKUYAMON_X_BATTLE_COMBOS.flatMap((combo) =>
      sliceFrames(battleImg, combo, {
        chroma: 'border-green',
        trim: 'uniform',
      })
    );
    const battle = rawBattle.map((f) => downscaleFrame(f, 112, true));
    const battleLarge = rawBattle.map((f) => downscaleFrame(f, 220, true));
    await yieldToFrame();

    const [icon = null] = sliceFrames(hdImg, [SAKUYAMON_X_ICON_RECT], {
      chroma: 'lossy-green',
      trim: 'tight',
      isolateMainBody: true,
    });

    const hd = sliceFrames(hdImg, SAKUYAMON_X_HD_RECTS, {
      chroma: 'lossy-green',
      trim: 'tight',
    }).map((f) => downscaleFrame(f, 220, true));

    const mini = sliceFrames(hdImg, SAKUYAMON_X_MINI_RECTS, {
      chroma: 'lossy-green',
      trim: 'tight',
    });

    const set: CharacterSpriteSet = {
      id: SAKUYAMON_X_META.id,
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

/** Synchronous cache lookup (returns `null` until `loadSakuyamonX` resolves). */
export function getSakuyamonXSync(
  baseUrl = SAKUYAMON_X_DEFAULT_ASSET_BASE
): CharacterSpriteSet | null {
  return spriteCache.get(`${baseUrl}::full`) ?? spriteCache.get(`${baseUrl}::overworld`) ?? null;
}

/** Clears cached Sakuyamon (X Antibody) sprite canvases. */
export function clearSakuyamonXCache(): void {
  spriteCache.clear();
}

/** Creates an engine-agnostic 8-direction animator for Sakuyamon (X Antibody). */
export function createSakuyamonXAnimator(
  sprites: CharacterSpriteSet
): CharacterAnimator<SakuyamonXActionId> {
  return new CharacterAnimator(
    sprites,
    SAKUYAMON_X_IDLE_CLIP,
    SAKUYAMON_X_WALK_CLIP,
    SAKUYAMON_X_ACTIONS
  );
}
