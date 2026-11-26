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
  DIRECTIONS_8,
  CARDINAL_DIRECTIONS,
  type CharacterFrame,
  type CharacterLoadMode,
  type CharacterSpriteSet,
  type FrameRect,
} from '../_shared/types';
import {
  MALGADRAMON_ACTIONS,
  MALGADRAMON_IDLE_CLIP,
  MALGADRAMON_WALK_CLIP,
  type MalgadramonActionId,
} from './malgadramon.animations';
import {
  MALGADRAMON_DEFAULT_ASSET_BASE,
  resolveMalgadramonAssets,
} from './malgadramon.assets';
import {
  idleCell,
  MALGADRAMON_BATTLE_RECTS,
  MALGADRAMON_IDLE_STEPS_BY_DIR,
  MALGADRAMON_IDLE_STEPS_PER_DIR,
  MALGADRAMON_JPG_HD_SOURCES,
  MALGADRAMON_JPG_ICON_RECT,
  MALGADRAMON_JPG_MINI_RECTS,
  MALGADRAMON_WALK_STEPS_BY_DIR,
  walkCell,
} from './malgadramon.frames';
import { MALGADRAMON_META } from './malgadramon.meta';

const spriteCache = new Map<string, CharacterSpriteSet>();
const inflightByBase = new Map<string, Promise<CharacterSpriteSet>>();

function sliceDirectionalSheet(
  img: HTMLImageElement,
  stepsByDir: typeof MALGADRAMON_IDLE_STEPS_BY_DIR,
  cellRectFn: (row: number, col: number) => FrameRect,
  mode: CharacterLoadMode
): CharacterFrame[] {
  const out: CharacterFrame[] = [];
  for (const dir of DIRECTIONS_8) {
    const steps = stepsByDir[dir];
    if (mode === 'overworld' && !CARDINAL_DIRECTIONS.has(dir)) {
      for (let i = 0; i < steps.length; i++) out.push(createEmptyFrame());
      continue;
    }
    const rects = steps.map((s) => cellRectFn(s.row, s.col));
    const frames = sliceFrames(img, rects, {
      chroma: 'lossy-green',
      trim: 'uniform',
      isolateMainBody: true,
    })
      .map((f) => downscaleFrame(f, 96, true))
      .map((frame, i) => (steps[i].flipX ? flipFrame(frame) : frame));
    out.push(...frames);
  }
  return out;
}

/**
 * Loads and slices Malgadramon's sheets into a cached `CharacterSpriteSet`.
 * Uses `malgadramon.webp` cleanly as fallback until dedicated `idle`, `walk`, and `battle` sheets are generated.
 */
export async function loadMalgadramon(
  baseUrl = MALGADRAMON_DEFAULT_ASSET_BASE,
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
    const urls = resolveMalgadramonAssets(baseUrl);
    const [sheetImg, idleImg, walkImg, battleImg] = await Promise.all([
      loadImage(urls.sheet),
      urls.idle ? loadImage(urls.idle) : Promise.resolve(null),
      urls.walk ? loadImage(urls.walk) : Promise.resolve(null),
      mode === 'full' && urls.battle ? loadImage(urls.battle) : Promise.resolve(null),
    ]);

    const hdByDir = DIRECTIONS_8.map((dir) => {
      if (mode === 'overworld' && !CARDINAL_DIRECTIONS.has(dir) && (idleImg || walkImg)) {
        return createEmptyFrame();
      }
      const src = MALGADRAMON_JPG_HD_SOURCES[dir];
      const [sliced] = sliceFrames(sheetImg, [src.rect], {
        chroma: 'lossy-green',
        trim: 'tight',
        isolateMainBody: true,
      });
      const base = sliced ? downscaleFrame(sliced, 220, true) : createEmptyFrame();
      return src.flipX ? flipFrame(base) : base;
    });
    await yieldToFrame();

    const fallbackOverworldForDir = (dirIdx: number, count: number): CharacterFrame[] => {
      const dir = DIRECTIONS_8[dirIdx];
      if (mode === 'overworld' && !CARDINAL_DIRECTIONS.has(dir)) {
        return Array.from({ length: count }, () => createEmptyFrame());
      }
      const base = downscaleFrame(hdByDir[dirIdx] ?? createEmptyFrame(), 96, true);
      return Array.from({ length: count }, () => base);
    };

    const idle = idleImg
      ? sliceDirectionalSheet(idleImg, MALGADRAMON_IDLE_STEPS_BY_DIR, idleCell, mode)
      : DIRECTIONS_8.flatMap((_, idx) =>
          fallbackOverworldForDir(idx, MALGADRAMON_IDLE_STEPS_PER_DIR)
        );
    await yieldToFrame();

    const walk = walkImg
      ? sliceDirectionalSheet(walkImg, MALGADRAMON_WALK_STEPS_BY_DIR, walkCell, mode)
      : idle.slice();
    await yieldToFrame();

    if (mode === 'overworld') {
      const overworldBattleFallback = [0, 6, 7, 1, 2, 3, 5, 4].map((dIdx) =>
        downscaleFrame(hdByDir[dIdx] ?? createEmptyFrame(), 96, true)
      );
      const set: CharacterSpriteSet = {
        id: MALGADRAMON_META.id,
        directionOrder: DIRECTIONS_8,
        groups: {
          idle,
          idleLarge: [],
          walk,
          battle: overworldBattleFallback,
          battleLarge: [],
          hd: [],
          mini: [],
        },
        icon: null,
        iconDataUrl: null,
        loadedAt: performance.now(),
      };
      spriteCache.set(cacheKey, set);
      return set;
    }

    const idleLarge = idleImg
      ? sliceFrames(
          idleImg,
          MALGADRAMON_IDLE_STEPS_BY_DIR.S.map((s) => idleCell(s.row, s.col)),
          {
            chroma: 'lossy-green',
            trim: 'uniform',
            isolateMainBody: true,
          }
        ).map((f) => downscaleFrame(f, 220, true))
      : [];

    const rawBattle = battleImg
      ? sliceFrames(battleImg, MALGADRAMON_BATTLE_RECTS, {
          chroma: 'lossy-green',
          trim: 'tight',
          isolateMainBody: true,
        })
      : [0, 6, 7, 1, 2, 3, 5, 4].map((dIdx) => hdByDir[dIdx] ?? createEmptyFrame());

    const battle = rawBattle.map((f) => downscaleFrame(f, 112, true));
    const battleLarge = battleImg ? rawBattle.map((f) => downscaleFrame(f, 220, true)) : [];

    const [icon = null] = sliceFrames(sheetImg, [MALGADRAMON_JPG_ICON_RECT], {
      chroma: 'lossy-green',
      trim: 'tight',
      isolateMainBody: true,
    });

    const mini = sliceFrames(sheetImg, MALGADRAMON_JPG_MINI_RECTS, {
      chroma: 'lossy-green',
      trim: 'tight',
      isolateMainBody: true,
    });

    const set: CharacterSpriteSet = {
      id: MALGADRAMON_META.id,
      directionOrder: DIRECTIONS_8,
      groups: { idle, idleLarge, walk, battle, battleLarge, hd: hdByDir, mini },
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

/** Synchronous cache lookup (returns `null` until `loadMalgadramon` resolves). */
export function getMalgadramonSync(
  baseUrl = MALGADRAMON_DEFAULT_ASSET_BASE
): CharacterSpriteSet | null {
  return spriteCache.get(`${baseUrl}::full`) ?? spriteCache.get(`${baseUrl}::overworld`) ?? null;
}

/** Clears cached Malgadramon sprite canvases. */
export function clearMalgadramonCache(): void {
  spriteCache.clear();
}

/** Creates an engine-agnostic 8-direction animator for Malgadramon. */
export function createMalgadramonAnimator(
  sprites: CharacterSpriteSet
): CharacterAnimator<MalgadramonActionId> {
  return new CharacterAnimator(
    sprites,
    MALGADRAMON_IDLE_CLIP,
    MALGADRAMON_WALK_CLIP,
    MALGADRAMON_ACTIONS
  );
}
