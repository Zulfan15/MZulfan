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
  BELPHEMON_X_ACTIONS,
  BELPHEMON_X_IDLE_CLIP,
  BELPHEMON_X_WALK_CLIP,
  type BelphemonXActionId,
} from './belphemon_x.animations';
import {
  BELPHEMON_X_DEFAULT_ASSET_BASE,
  resolveBelphemonXAssets,
} from './belphemon_x.assets';
import {
  BELPHEMON_X_BATTLE_COMBOS,
  BELPHEMON_X_HD_RECTS,
  BELPHEMON_X_ICON_RECT,
  BELPHEMON_X_IDLE_STEPS_BY_DIR,
  BELPHEMON_X_MINI_RECTS,
  BELPHEMON_X_WALK_STEPS_BY_DIR,
  gridCell,
  walkCell,
} from './belphemon_x.frames';
import { BELPHEMON_X_META } from './belphemon_x.meta';

const spriteCache = new Map<string, CharacterSpriteSet>();
const inflightByBase = new Map<string, Promise<CharacterSpriteSet>>();

/** Pads all frames in a sequence to a shared bottom-centered canvas so scale stays uniform across steps. */
function padToUniformBottomCenter(frames: CharacterFrame[]): CharacterFrame[] {
  if (frames.length <= 1) return frames;
  const maxW = Math.max(1, ...frames.map((f) => f.width));
  const maxH = Math.max(1, ...frames.map((f) => f.height));
  return frames.map((f) => {
    if (f.width === maxW && f.height === maxH) return f;
    const canvas = document.createElement('canvas');
    canvas.width = maxW;
    canvas.height = maxH;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(f.canvas, Math.floor((maxW - f.width) / 2), maxH - f.height);
    }
    return { canvas, width: maxW, height: maxH };
  });
}

/**
 * Loads and cleanly slices all 4 Belphemon (X Antibody) sprite sheets into a cached `CharacterSpriteSet`.
 * Uses `trim: 'tight'` + uniform bottom-center padding across idle/battle because the 8x4 grid has variable column widths.
 */
export async function loadBelphemonX(
  baseUrl = BELPHEMON_X_DEFAULT_ASSET_BASE,
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
    const urls = resolveBelphemonXAssets(baseUrl);
    const [idleImg, walkImg] = await Promise.all([
      loadImage(urls.idle),
      loadImage(urls.walk),
    ]);
    const extraPromises =
      mode === 'full' ? Promise.all([loadImage(urls.battle), loadImage(urls.sheet)]) : null;

    const rawIdle: CharacterFrame[] = [];
    for (const dir of DIRECTIONS_8) {
      const steps = BELPHEMON_X_IDLE_STEPS_BY_DIR[dir];
      if (mode === 'overworld' && !CARDINAL_DIRECTIONS.has(dir)) {
        for (let i = 0; i < steps.length; i++) rawIdle.push(createEmptyFrame());
        continue;
      }
      const rects = steps.map((s) => gridCell(s.row, s.col));
      const frames = padToUniformBottomCenter(
        sliceFrames(idleImg, rects, {
          chroma: 'lossy-green',
          trim: 'tight',
          isolateMainBody: true,
        }).map((frame, i) => (steps[i].flipX ? flipFrame(frame) : frame))
      );
      rawIdle.push(...frames);
      await yieldToFrame();
    }
    const idle = rawIdle.map((f) => downscaleFrame(f, 96, true));

    const walk: CharacterFrame[] = [];
    for (const dir of DIRECTIONS_8) {
      const steps = BELPHEMON_X_WALK_STEPS_BY_DIR[dir];
      if (mode === 'overworld' && !CARDINAL_DIRECTIONS.has(dir)) {
        for (let i = 0; i < steps.length; i++) walk.push(createEmptyFrame());
        continue;
      }
      const rects = steps.map((s) => walkCell(s.row, s.col));
      const frames = sliceFrames(walkImg, rects, {
        chroma: 'lossy-green',
        trim: 'uniform',
        isolateMainBody: true,
      })
        .map((f) => downscaleFrame(f, 96, true))
        .map((frame, i) => (steps[i].flipX ? flipFrame(frame) : frame));
      walk.push(...frames);
      await yieldToFrame();
    }

    if (mode === 'overworld') {
      const set: CharacterSpriteSet = {
        id: BELPHEMON_X_META.id,
        directionOrder: DIRECTIONS_8,
        groups: {
          idle,
          idleLarge: [],
          walk,
          battle: [],
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

    const [battleImg, hdImg] = await extraPromises!;
    const idleLarge = rawIdle.slice(0, 4).map((f) => downscaleFrame(f, 220, true));

    const rawBattle = BELPHEMON_X_BATTLE_COMBOS.flatMap((combo) =>
      padToUniformBottomCenter(
        sliceFrames(battleImg, combo, {
          chroma: 'lossy-green',
          trim: 'tight',
          isolateMainBody: true,
        })
      )
    );
    const battle = rawBattle.map((f) => downscaleFrame(f, 112, true));
    const battleLarge = rawBattle.map((f) => downscaleFrame(f, 220, true));
    await yieldToFrame();

    const [icon = null] = sliceFrames(hdImg, [BELPHEMON_X_ICON_RECT], {
      chroma: 'lossy-green',
      trim: 'tight',
      isolateMainBody: true,
    });

    const hd = sliceFrames(hdImg, BELPHEMON_X_HD_RECTS, {
      chroma: 'lossy-green',
      trim: 'tight',
      isolateMainBody: true,
    })
      .map((f) => downscaleFrame(f, 220, true))
      .map((frame, idx) => (idx === 7 ? flipFrame(frame) : frame));

    const mini = sliceFrames(hdImg, BELPHEMON_X_MINI_RECTS, {
      chroma: 'lossy-green',
      trim: 'tight',
      isolateMainBody: true,
    });

    const set: CharacterSpriteSet = {
      id: BELPHEMON_X_META.id,
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

/** Synchronous cache lookup (returns `null` until `loadBelphemonX` resolves). */
export function getBelphemonXSync(
  baseUrl = BELPHEMON_X_DEFAULT_ASSET_BASE
): CharacterSpriteSet | null {
  return spriteCache.get(`${baseUrl}::full`) ?? spriteCache.get(`${baseUrl}::overworld`) ?? null;
}

/** Clears cached Belphemon (X Antibody) sprite canvases. */
export function clearBelphemonXCache(): void {
  spriteCache.clear();
}

/** Creates an engine-agnostic 8-direction animator for Belphemon (X Antibody). */
export function createBelphemonXAnimator(
  sprites: CharacterSpriteSet
): CharacterAnimator<BelphemonXActionId> {
  return new CharacterAnimator(
    sprites,
    BELPHEMON_X_IDLE_CLIP,
    BELPHEMON_X_WALK_CLIP,
    BELPHEMON_X_ACTIONS
  );
}
