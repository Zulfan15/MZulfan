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
  GASPIRITAMON_ACTIONS,
  GASPIRITAMON_IDLE_CLIP,
  GASPIRITAMON_WALK_CLIP,
  type GaspiritamonActionId,
} from './gaspiritamon.animations';
import {
  GASPIRITAMON_DEFAULT_ASSET_BASE,
  resolveGaspiritamonAssets,
} from './gaspiritamon.assets';
import {
  gridCell8x4,
  GASPIRITAMON_BATTLE_RECTS,
  GASPIRITAMON_JPG_HD_RECTS,
  GASPIRITAMON_JPG_ICON_RECT,
  GASPIRITAMON_JPG_MINI_RECTS,
  GASPIRITAMON_WALK_STEPS_BY_DIR,
  GASPIRITAMON_WALK_STEPS_PER_DIR,
} from './gaspiritamon.frames';
import { GASPIRITAMON_META } from './gaspiritamon.meta';

const spriteCache = new Map<string, CharacterSpriteSet>();
const inflightByBase = new Map<string, Promise<CharacterSpriteSet>>();

/**
 * Loads and cleanly slices all 3 Gaspiritamon sprite sheets into a cached `CharacterSpriteSet`.
 * Uses `border-green` chroma keying so glowing emerald-cyan runes on Gaspiritamon's hammer and shield stay intact.
 */
export async function loadGaspiritamon(
  baseUrl = GASPIRITAMON_DEFAULT_ASSET_BASE,
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
    const urls = resolveGaspiritamonAssets(baseUrl);
    const walkImg = await loadImage(urls.walk);
    const extraPromises =
      mode === 'full' ? Promise.all([loadImage(urls.battle), loadImage(urls.sheet)]) : null;

    const walk: CharacterFrame[] = [];
    for (const dir of DIRECTIONS_8) {
      const steps = GASPIRITAMON_WALK_STEPS_BY_DIR[dir];
      if (mode === 'overworld' && !CARDINAL_DIRECTIONS.has(dir)) {
        for (let i = 0; i < steps.length; i++) walk.push(createEmptyFrame());
        continue;
      }
      const rects = steps.map((s) => gridCell8x4(s.row, s.col));
      const frames = sliceFrames(walkImg, rects, {
        chroma: 'border-green',
        trim: 'uniform',
        isolateMainBody: true,
      })
        .map((f) => downscaleFrame(f, 96, true))
        .map((frame, i) => (steps[i].flipX ? flipFrame(frame) : frame));
      walk.push(...frames);
      await yieldToFrame();
    }

    // Reuse the standing pose (frame 0 of each direction) for idle
    const idle = DIRECTIONS_8.map((_, dirIdx) => walk[dirIdx * GASPIRITAMON_WALK_STEPS_PER_DIR]);

    if (mode === 'overworld') {
      const set: CharacterSpriteSet = {
        id: GASPIRITAMON_META.id,
        directionOrder: DIRECTIONS_8,
        groups: { idle, walk, battle: [], battleLarge: [], hd: [], mini: [] },
        icon: null,
        iconDataUrl: null,
        loadedAt: performance.now(),
      };
      spriteCache.set(cacheKey, set);
      return set;
    }

    const [battleImg, jpgImg] = await extraPromises!;
    const rawBattle = sliceFrames(battleImg, GASPIRITAMON_BATTLE_RECTS, {
      chroma: 'border-green',
      trim: 'tight',
    });
    const battle = rawBattle.map((f) => downscaleFrame(f, 112, true));
    const battleLarge = rawBattle.map((f) => downscaleFrame(f, 220, true));
    await yieldToFrame();

    const [icon = null] = sliceFrames(jpgImg, [GASPIRITAMON_JPG_ICON_RECT], {
      chroma: 'border-green',
      trim: 'tight',
      isolateMainBody: true,
    });

    const hd = sliceFrames(jpgImg, GASPIRITAMON_JPG_HD_RECTS, {
      chroma: 'border-green',
      trim: 'tight',
      isolateMainBody: true,
    }).map((f) => downscaleFrame(f, 220, true));

    const mini = sliceFrames(jpgImg, GASPIRITAMON_JPG_MINI_RECTS, {
      chroma: 'border-green',
      trim: 'tight',
      isolateMainBody: true,
    });

    const set: CharacterSpriteSet = {
      id: GASPIRITAMON_META.id,
      directionOrder: DIRECTIONS_8,
      groups: { idle, walk, battle, battleLarge, hd, mini },
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

/** Synchronous cache lookup (returns `null` until `loadGaspiritamon` resolves). */
export function getGaspiritamonSync(
  baseUrl = GASPIRITAMON_DEFAULT_ASSET_BASE
): CharacterSpriteSet | null {
  return spriteCache.get(`${baseUrl}::full`) ?? spriteCache.get(`${baseUrl}::overworld`) ?? null;
}

/** Clears cached Gaspiritamon sprite canvases. */
export function clearGaspiritamonCache(): void {
  spriteCache.clear();
}

/** Creates an engine-agnostic 8-direction animator for Gaspiritamon. */
export function createGaspiritamonAnimator(
  sprites: CharacterSpriteSet
): CharacterAnimator<GaspiritamonActionId> {
  return new CharacterAnimator(
    sprites,
    GASPIRITAMON_IDLE_CLIP,
    GASPIRITAMON_WALK_CLIP,
    GASPIRITAMON_ACTIONS
  );
}
