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
  MEGIDRAMON_X_ACTIONS,
  MEGIDRAMON_X_IDLE_CLIP,
  MEGIDRAMON_X_WALK_CLIP,
  type MegidramonXActionId,
} from './megidramon_x.animations';
import {
  MEGIDRAMON_X_DEFAULT_ASSET_BASE,
  resolveMegidramonXAssets,
} from './megidramon_x.assets';
import {
  gridCell4x4,
  MEGIDRAMON_X_BATTLE_RECTS,
  MEGIDRAMON_X_IDLE_STEPS_BY_DIR,
  MEGIDRAMON_X_IDLE_STEPS_PER_DIR,
  MEGIDRAMON_X_JPG_HD_SOURCES,
  MEGIDRAMON_X_JPG_ICON_RECT,
  MEGIDRAMON_X_JPG_MINI_RECTS,
  MEGIDRAMON_X_WALK_STEPS_BY_DIR,
  MEGIDRAMON_X_WALK_STEPS_PER_DIR,
} from './megidramon_x.frames';
import { MEGIDRAMON_X_META } from './megidramon_x.meta';

const spriteCache = new Map<string, CharacterSpriteSet>();
const inflightByBase = new Map<string, Promise<CharacterSpriteSet>>();

function sliceDirectionalSheet(
  img: HTMLImageElement,
  stepsByDir: typeof MEGIDRAMON_X_IDLE_STEPS_BY_DIR,
  mode: CharacterLoadMode
): CharacterFrame[] {
  const out: CharacterFrame[] = [];
  for (const dir of DIRECTIONS_8) {
    const steps = stepsByDir[dir];
    if (mode === 'overworld' && !CARDINAL_DIRECTIONS.has(dir)) {
      for (let i = 0; i < steps.length; i++) out.push(createEmptyFrame());
      continue;
    }
    const rects = steps.map((s) => gridCell4x4(s.row, s.col));
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

export async function loadMegidramonX(
  baseUrl = MEGIDRAMON_X_DEFAULT_ASSET_BASE,
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
    const urls = resolveMegidramonXAssets(baseUrl);
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
      const src = MEGIDRAMON_X_JPG_HD_SOURCES[dir];
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
      ? sliceDirectionalSheet(idleImg, MEGIDRAMON_X_IDLE_STEPS_BY_DIR, mode)
      : DIRECTIONS_8.flatMap((_, idx) =>
          fallbackOverworldForDir(idx, MEGIDRAMON_X_IDLE_STEPS_PER_DIR)
        );
    await yieldToFrame();

    const walk = walkImg
      ? sliceDirectionalSheet(walkImg, MEGIDRAMON_X_WALK_STEPS_BY_DIR, mode)
      : DIRECTIONS_8.flatMap((_, idx) =>
          fallbackOverworldForDir(idx, MEGIDRAMON_X_WALK_STEPS_PER_DIR)
        );
    await yieldToFrame();

    if (mode === 'overworld') {
      const overworldBattleFallback = [0, 6, 7, 1, 2, 3, 5, 4].map((dIdx) =>
        downscaleFrame(hdByDir[dIdx] ?? createEmptyFrame(), 96, true)
      );
      const set: CharacterSpriteSet = {
        id: MEGIDRAMON_X_META.id,
        directionOrder: DIRECTIONS_8,
        groups: { idle, walk, battle: overworldBattleFallback, battleLarge: [], hd: [], mini: [] },
        icon: null,
        iconDataUrl: null,
        loadedAt: performance.now(),
      };
      spriteCache.set(cacheKey, set);
      return set;
    }

    const rawBattle = battleImg
      ? sliceFrames(battleImg, MEGIDRAMON_X_BATTLE_RECTS, {
          chroma: 'lossy-green',
          trim: 'tight',
          isolateMainBody: true,
        })
      : [0, 6, 7, 1, 2, 3, 5, 4].map((dIdx) => hdByDir[dIdx] ?? createEmptyFrame());

    const battle = rawBattle.map((f) => downscaleFrame(f, 112, true));
    const battleLarge = rawBattle.map((f) => downscaleFrame(f, 220, true));

    const [icon = null] = sliceFrames(sheetImg, [MEGIDRAMON_X_JPG_ICON_RECT], {
      chroma: 'lossy-green',
      trim: 'tight',
      isolateMainBody: true,
    });

    const mini = sliceFrames(sheetImg, MEGIDRAMON_X_JPG_MINI_RECTS, {
      chroma: 'lossy-green',
      trim: 'tight',
      isolateMainBody: true,
    });

    const set: CharacterSpriteSet = {
      id: MEGIDRAMON_X_META.id,
      directionOrder: DIRECTIONS_8,
      groups: { idle, walk, battle, battleLarge, hd: hdByDir, mini },
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

export function getMegidramonXSync(
  baseUrl = MEGIDRAMON_X_DEFAULT_ASSET_BASE
): CharacterSpriteSet | null {
  return spriteCache.get(`${baseUrl}::full`) ?? spriteCache.get(`${baseUrl}::overworld`) ?? null;
}

export function clearMegidramonXCache(): void {
  spriteCache.clear();
}

export function createMegidramonXAnimator(
  sprites: CharacterSpriteSet
): CharacterAnimator<MegidramonXActionId> {
  return new CharacterAnimator(
    sprites,
    MEGIDRAMON_X_IDLE_CLIP,
    MEGIDRAMON_X_WALK_CLIP,
    MEGIDRAMON_X_ACTIONS
  );
}
