import { CharacterAnimator } from '../_shared/CharacterAnimator';
import {
  createEmptyFrame,
  downscaleFrame,
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
  VICTORYGROWLMON_ACTIONS,
  VICTORYGROWLMON_IDLE_CLIP,
  VICTORYGROWLMON_WALK_CLIP,
  type VictoryGrowlmonActionId,
} from './victorygrowlmon.animations';
import {
  VICTORYGROWLMON_DEFAULT_ASSET_BASE,
  resolveVictoryGrowlmonAssets,
} from './victorygrowlmon.assets';
import {
  VICTORYGROWLMON_BATTLE_COMBOS,
  VICTORYGROWLMON_HD_RECTS,
  VICTORYGROWLMON_ICON_RECT,
  VICTORYGROWLMON_MINI_RECTS,
  VICTORYGROWLMON_STEPS_BY_DIR,
} from './victorygrowlmon.frames';
import { VICTORYGROWLMON_META } from './victorygrowlmon.meta';

const spriteCache = new Map<string, CharacterSpriteSet>();
const inflightByBase = new Map<string, Promise<CharacterSpriteSet>>();

/**
 * Loads and cleanly slices all 4 VictoryGrowlmon sprite sheets into a cached `CharacterSpriteSet`.
 * Deduplicates concurrent requests and caches per `baseUrl`.
 */
export async function loadVictoryGrowlmon(
  baseUrl = VICTORYGROWLMON_DEFAULT_ASSET_BASE,
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
    const urls = resolveVictoryGrowlmonAssets(baseUrl);
    const [idleImg, walkImg] = await Promise.all([
      loadImage(urls.idle),
      loadImage(urls.walk),
    ]);
    const extraPromises =
      mode === 'full' ? Promise.all([loadImage(urls.battle), loadImage(urls.sheet)]) : null;

    const rawIdle: CharacterFrame[] = [];
    for (const dir of DIRECTIONS_8) {
      const rects = VICTORYGROWLMON_STEPS_BY_DIR[dir];
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
      const rects = VICTORYGROWLMON_STEPS_BY_DIR[dir];
      if (mode === 'overworld' && !CARDINAL_DIRECTIONS.has(dir)) {
        for (let i = 0; i < rects.length; i++) walk.push(createEmptyFrame());
        continue;
      }
      const frames = sliceFrames(walkImg, rects, {
        chroma: 'lossy-green',
        trim: 'uniform',
        isolateMainBody: true,
      }).map((f) => downscaleFrame(f, 96, true));
      walk.push(...frames);
      await yieldToFrame();
    }

    if (mode === 'overworld') {
      const set: CharacterSpriteSet = {
        id: VICTORYGROWLMON_META.id,
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

    // Preserve floating flame embers & crescent slash arcs on battle frames
    const rawBattle = VICTORYGROWLMON_BATTLE_COMBOS.flatMap((combo) =>
      sliceFrames(battleImg, combo, {
        chroma: 'lossy-green',
        trim: 'uniform',
      })
    );
    const battle = rawBattle.map((f) => downscaleFrame(f, 112, true));
    const battleLarge = rawBattle.map((f) => downscaleFrame(f, 220, true));
    await yieldToFrame();

    const [icon = null] = sliceFrames(hdImg, [VICTORYGROWLMON_ICON_RECT], {
      chroma: 'lossy-green',
      trim: 'tight',
      isolateMainBody: true,
    });

    const hd = sliceFrames(hdImg, VICTORYGROWLMON_HD_RECTS, {
      chroma: 'lossy-green',
      trim: 'tight',
      isolateMainBody: true,
    }).map((f) => downscaleFrame(f, 220, true));

    const mini = sliceFrames(hdImg, VICTORYGROWLMON_MINI_RECTS, {
      chroma: 'lossy-green',
      trim: 'tight',
      isolateMainBody: true,
    });

    const set: CharacterSpriteSet = {
      id: VICTORYGROWLMON_META.id,
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

/** Synchronous cache lookup (returns `null` until `loadVictoryGrowlmon` resolves). */
export function getVictoryGrowlmonSync(
  baseUrl = VICTORYGROWLMON_DEFAULT_ASSET_BASE
): CharacterSpriteSet | null {
  return spriteCache.get(`${baseUrl}::full`) ?? spriteCache.get(`${baseUrl}::overworld`) ?? null;
}

/** Clears cached VictoryGrowlmon sprite canvases. */
export function clearVictoryGrowlmonCache(): void {
  spriteCache.clear();
}

/** Creates an engine-agnostic 8-direction animator for VictoryGrowlmon. */
export function createVictoryGrowlmonAnimator(
  sprites: CharacterSpriteSet
): CharacterAnimator<VictoryGrowlmonActionId> {
  return new CharacterAnimator(
    sprites,
    VICTORYGROWLMON_IDLE_CLIP,
    VICTORYGROWLMON_WALK_CLIP,
    VICTORYGROWLMON_ACTIONS
  );
}
