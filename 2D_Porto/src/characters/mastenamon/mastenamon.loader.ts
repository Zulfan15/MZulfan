import { CharacterAnimator } from '../_shared/CharacterAnimator';
import {
  flipFrame,
  frameToDataUrl,
  loadImage,
  sliceFrames,
} from '../_shared/sheetSlicer';
import {
  DIRECTIONS_8,
  type CharacterFrame,
  type CharacterSpriteSet,
} from '../_shared/types';
import {
  MASTENAMON_ACTIONS,
  MASTENAMON_IDLE_CLIP,
  MASTENAMON_WALK_CLIP,
  type MastenamonActionId,
} from './mastenamon.animations';
import {
  MASTENAMON_DEFAULT_ASSET_BASE,
  resolveMastenamonAssets,
} from './mastenamon.assets';
import {
  MASTENAMON_BATTLE_RECTS,
  MASTENAMON_IDLE_DIRECTION_MAP,
  MASTENAMON_IDLE_RECTS,
  MASTENAMON_JPG_HD_RECTS,
  MASTENAMON_JPG_ICON_RECT,
  MASTENAMON_JPG_MINI_RECTS,
  MASTENAMON_WALK_RECTS_BY_CANONICAL_DIR,
} from './mastenamon.frames';
import { MASTENAMON_META } from './mastenamon.meta';

const spriteCache = new Map<string, CharacterSpriteSet>();
const inflightByBase = new Map<string, Promise<CharacterSpriteSet>>();

function downscaleHdFrame(frame: CharacterFrame, maxH = 220): CharacterFrame {
  if (frame.height <= maxH) return frame;
  const scale = maxH / frame.height;
  const w = Math.max(1, Math.round(frame.width * scale));
  const h = Math.max(1, Math.round(frame.height * scale));
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(frame.canvas, 0, 0, w, h);
  }
  return { canvas, width: w, height: h };
}

/**
 * Loads and cleanly slices all 4 Mastenamon sprite sheets into a cached `CharacterSpriteSet`.
 * Deduplicates concurrent requests and caches per `baseUrl`.
 */
export async function loadMastenamon(
  baseUrl = MASTENAMON_DEFAULT_ASSET_BASE
): Promise<CharacterSpriteSet> {
  const cached = spriteCache.get(baseUrl);
  if (cached) return cached;

  const existing = inflightByBase.get(baseUrl);
  if (existing) return existing;

  const task = (async () => {
    const urls = resolveMastenamonAssets(baseUrl);
    const [idleImg, walkImg, battleImg, jpgImg] = await Promise.all([
      loadImage(urls.idle),
      loadImage(urls.walk),
      loadImage(urls.battle),
      loadImage(urls.sheet),
    ]);

    const rawIdle = sliceFrames(idleImg, MASTENAMON_IDLE_RECTS, {
      chroma: 'flat-green',
      trim: 'tight',
    });
    const idle = DIRECTIONS_8.map((dir) => {
      const mapping = MASTENAMON_IDLE_DIRECTION_MAP[dir];
      const base = rawIdle[mapping.rawIndex] ?? rawIdle[0];
      return mapping.flipX ? flipFrame(base) : base;
    });

    const walk = sliceFrames(walkImg, MASTENAMON_WALK_RECTS_BY_CANONICAL_DIR, {
      chroma: 'flat-green',
      trim: 'uniform',
    });

    const battle = sliceFrames(battleImg, MASTENAMON_BATTLE_RECTS, {
      chroma: 'flat-green',
      trim: 'tight',
    });

    const [icon = null] = sliceFrames(jpgImg, [MASTENAMON_JPG_ICON_RECT], {
      chroma: 'lossy-green',
      trim: 'tight',
      isolateMainBody: true,
    });

    const hd = sliceFrames(jpgImg, MASTENAMON_JPG_HD_RECTS, {
      chroma: 'lossy-green',
      trim: 'tight',
      isolateMainBody: true,
    }).map((f) => downscaleHdFrame(f, 220));

    const mini = sliceFrames(jpgImg, MASTENAMON_JPG_MINI_RECTS, {
      chroma: 'lossy-green',
      trim: 'tight',
      isolateMainBody: true,
    });

    const set: CharacterSpriteSet = {
      id: MASTENAMON_META.id,
      directionOrder: DIRECTIONS_8,
      groups: { idle, walk, battle, hd, mini },
      icon,
      iconDataUrl: frameToDataUrl(icon),
      loadedAt: performance.now(),
    };

    spriteCache.set(baseUrl, set);
    return set;
  })().finally(() => {
    inflightByBase.delete(baseUrl);
  });

  inflightByBase.set(baseUrl, task);
  return task;
}

/** Synchronous cache lookup (returns `null` until `loadMastenamon` resolves). */
export function getMastenamonSync(
  baseUrl = MASTENAMON_DEFAULT_ASSET_BASE
): CharacterSpriteSet | null {
  return spriteCache.get(baseUrl) ?? null;
}

/** Clears cached Mastenamon sprite canvases. */
export function clearMastenamonCache(): void {
  spriteCache.clear();
}

/** Creates an engine-agnostic 8-direction animator for Mastenamon. */
export function createMastenamonAnimator(
  sprites: CharacterSpriteSet
): CharacterAnimator<MastenamonActionId> {
  return new CharacterAnimator(
    sprites,
    MASTENAMON_IDLE_CLIP,
    MASTENAMON_WALK_CLIP,
    MASTENAMON_ACTIONS
  );
}
