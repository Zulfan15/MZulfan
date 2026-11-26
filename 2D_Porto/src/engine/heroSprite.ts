import type { Dir } from './types';
import type { MountPosture } from './mountRigConfig';

export const HERO_SPRITE_URL =
  '/assets/main-character/DS%20_%20DSi%20-%20Digimon%20World%20DS%20-%20Characters%20-%20Hero%20Male.png';

const CELL_SIZE = 32;
const COL_X = [2, 36, 70] as const;
const ROW_Y: Record<Dir, number> = {
  down: 40,
  up: 74,
  left: 108,
  right: 142,
};

const BG_OUTER = [0, 128, 128] as const;
const BG_CELL = [0, 176, 104] as const;
const CHROMA_TOLERANCE = 6;

let processedSheet: HTMLCanvasElement | null = null;
let loadStarted = false;
const readyCallbacks: Array<() => void> = [];

function matchesColor(r: number, g: number, b: number, target: readonly [number, number, number]): boolean {
  return (
    Math.abs(r - target[0]) <= CHROMA_TOLERANCE &&
    Math.abs(g - target[1]) <= CHROMA_TOLERANCE &&
    Math.abs(b - target[2]) <= CHROMA_TOLERANCE
  );
}

/**
 * Lazily loads the Digimon World DS Hero Male sprite sheet and strips its
 * teal/green background colors onto an offscreen canvas.
 */
export function ensureHeroSpriteLoaded(onReady?: () => void): HTMLCanvasElement | null {
  if (processedSheet) {
    onReady?.();
    return processedSheet;
  }

  if (onReady) {
    readyCallbacks.push(onReady);
  }

  if (loadStarted || typeof Image === 'undefined' || typeof document === 'undefined') {
    return null;
  }

  loadStarted = true;
  const img = new Image();
  img.onload = () => {
    const offscreen = document.createElement('canvas');
    offscreen.width = img.naturalWidth || img.width;
    offscreen.height = img.naturalHeight || img.height;
    const octx = offscreen.getContext('2d', { willReadFrequently: true });
    if (!octx) return;

    octx.drawImage(img, 0, 0);
    const imgData = octx.getImageData(0, 0, offscreen.width, offscreen.height);
    const data = imgData.data;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      if (matchesColor(r, g, b, BG_OUTER) || matchesColor(r, g, b, BG_CELL)) {
        data[i + 3] = 0;
      }
    }

    octx.putImageData(imgData, 0, 0);
    processedSheet = offscreen;

    while (readyCallbacks.length > 0) {
      const cb = readyCallbacks.shift();
      cb?.();
    }
  };
  img.src = HERO_SPRITE_URL;
  return null;
}

export function drawHeroOverworld(
  ctx: CanvasRenderingContext2D,
  dir: Dir,
  stepFrame: number,
  x: number,
  y: number,
  scale = 1
): boolean {
  const sheet = ensureHeroSpriteLoaded();
  if (!sheet) return false;

  const walkCycle = ((stepFrame % 4) + 4) % 4;
  const colIdx = walkCycle === 1 ? 1 : walkCycle === 3 ? 2 : 0;
  const sx = COL_X[colIdx];
  const sy = ROW_Y[dir];

  const destX = Math.round(x - 8 * scale);
  const destY = Math.round(y - 14 * scale);
  const destSize = Math.round(CELL_SIZE * scale);

  ctx.save();
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(sheet, sx, sy, CELL_SIZE, CELL_SIZE, destX, destY, destSize, destSize);
  ctx.restore();
  return true;
}

export function drawHeroRider(
  ctx: CanvasRenderingContext2D,
  dir: Dir,
  cx: number,
  seatY: number,
  posture: MountPosture
): boolean {
  const sheet = ensureHeroSpriteLoaded();
  if (!sheet) return false;

  const sxBase = COL_X[0];
  const syBase = ROW_Y[dir];
  const cropX = dir === 'right' ? 9 : 8;
  const cropW = 15;

  const isStanding = posture === 'aura-platform';
  const cropY = 2;
  const cropH = 28;
  const dw = cropW;
  const dh = cropH;

  const destX = Math.round(cx - dw / 2);
  const destY = isStanding ? Math.round(seatY - dh + 1) : Math.round(seatY - 22);

  ctx.save();
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(sheet, sxBase + cropX, syBase + cropY, cropW, cropH, destX, destY, dw, dh);
  ctx.restore();
  return true;
}

export function drawHeroBackSprite(
  ctx: CanvasRenderingContext2D,
  destW: number,
  destH: number
): boolean {
  const sheet = ensureHeroSpriteLoaded();
  if (!sheet) return false;

  const sx = COL_X[0] + 8;
  const sy = ROW_Y.up + 2;
  const sw = 15;
  const sh = 27;

  ctx.clearRect(0, 0, destW, destH);
  const scale = Math.min(destW / sw, destH / sh);
  const dw = Math.round(sw * scale);
  const dh = Math.round(sh * scale);
  const dx = Math.round((destW - dw) / 2);
  const dy = Math.round((destH - dh) / 2);

  ctx.save();
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(sheet, sx, sy, sw, sh, dx, dy, dw, dh);
  ctx.restore();
  return true;
}
