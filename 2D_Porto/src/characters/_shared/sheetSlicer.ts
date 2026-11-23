import { applyChromaKey } from './chromaKey';
import type { CharacterFrame, FrameRect, SliceOptions } from './types';

const ALPHA_VISIBLE = 16;

interface Bounds {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}

interface CleanCell {
  data: ImageData;
  bounds: Bounds | null;
}

/** Loads an image once (CORS-safe for same-origin assets). */
export function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.decoding = 'async';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load sprite sheet: ${url}`));
    img.src = url;
  });
}

function createCanvas(w: number, h: number): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = Math.max(1, w);
  c.height = Math.max(1, h);
  return c;
}

function alphaBounds(d: Uint8ClampedArray, w: number, h: number): Bounds | null {
  let x0 = w;
  let y0 = h;
  let x1 = -1;
  let y1 = -1;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (d[(y * w + x) * 4 + 3] > ALPHA_VISIBLE) {
        if (x < x0) x0 = x;
        if (x > x1) x1 = x;
        if (y < y0) y0 = y;
        if (y > y1) y1 = y;
      }
    }
  }
  return x1 < 0 ? null : { x0, y0, x1, y1 };
}

/**
 * Keeps the largest 8-connected component plus any fragment that does NOT touch the
 * cell border (small detached details such as sparks). Border-touching fragments that
 * are not the main body (neighbour wings, sliced label text) are erased.
 */
function isolateMainBody(d: Uint8ClampedArray, w: number, h: number, minFragment = 6): void {
  const total = w * h;
  const labels = new Int32Array(total);
  const stack = new Int32Array(total);
  const areas: number[] = [0];
  const touchesBorder: boolean[] = [false];
  let next = 1;

  for (let start = 0; start < total; start++) {
    if (labels[start] !== 0 || d[start * 4 + 3] <= ALPHA_VISIBLE) continue;
    const id = next++;
    let area = 0;
    let border = false;
    let sp = 0;
    stack[sp++] = start;
    labels[start] = id;
    while (sp > 0) {
      const i = stack[--sp];
      area++;
      const x = i % w;
      const y = (i - x) / w;
      if (x === 0 || y === 0 || x === w - 1 || y === h - 1) border = true;
      for (let dy = -1; dy <= 1; dy++) {
        const ny = y + dy;
        if (ny < 0 || ny >= h) continue;
        for (let dx = -1; dx <= 1; dx++) {
          const nx = x + dx;
          if ((dx === 0 && dy === 0) || nx < 0 || nx >= w) continue;
          const n = ny * w + nx;
          if (labels[n] !== 0 || d[n * 4 + 3] <= ALPHA_VISIBLE) continue;
          labels[n] = id;
          stack[sp++] = n;
        }
      }
    }
    areas.push(area);
    touchesBorder.push(border);
  }

  if (next <= 2) return;
  let main = 1;
  for (let id = 2; id < next; id++) if (areas[id] > areas[main]) main = id;

  for (let i = 0; i < total; i++) {
    const id = labels[i];
    if (id === 0 || id === main) continue;
    if (touchesBorder[id] || areas[id] < minFragment) d[i * 4 + 3] = 0;
  }
}

function cleanCell(source: CanvasImageSource, rect: FrameRect, opts: SliceOptions): CleanCell {
  const canvas = createCanvas(rect.w, rect.h);
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('2D canvas context unavailable');
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(source, rect.x, rect.y, rect.w, rect.h, 0, 0, rect.w, rect.h);
  const data = ctx.getImageData(0, 0, rect.w, rect.h);
  applyChromaKey(data.data, rect.w, rect.h, opts.chroma);
  if (opts.isolateMainBody) isolateMainBody(data.data, rect.w, rect.h);
  return { data, bounds: alphaBounds(data.data, rect.w, rect.h) };
}

function cropToFrame(cell: CleanCell, b: Bounds | null, pad: number): CharacterFrame {
  if (!b) {
    const empty = createCanvas(1, 1);
    return { canvas: empty, width: 1, height: 1 };
  }
  const w = b.x1 - b.x0 + 1 + pad * 2;
  const h = b.y1 - b.y0 + 1 + pad * 2;
  const canvas = createCanvas(w, h);
  const ctx = canvas.getContext('2d');
  if (ctx) {
    // Dirty-rect copy: pixels outside the source cell simply stay transparent.
    const sx = Math.max(0, b.x0);
    const sy = Math.max(0, b.y0);
    const sw = Math.min(cell.data.width, b.x1 + 1) - sx;
    const sh = Math.min(cell.data.height, b.y1 + 1) - sy;
    if (sw > 0 && sh > 0) {
      ctx.putImageData(cell.data, pad - b.x0, pad - b.y0, sx, sy, sw, sh);
    }
  }
  return { canvas, width: w, height: h };
}

/**
 * Cuts `rects` out of `source`, removes the green backdrop and trims them.
 * With `trim: 'uniform'` all returned frames share the same size and anchor.
 */
export function sliceFrames(
  source: CanvasImageSource,
  rects: readonly FrameRect[],
  opts: SliceOptions
): CharacterFrame[] {
  const pad = opts.padding ?? 1;
  const cells = rects.map((r) => cleanCell(source, r, opts));

  if (opts.trim === 'tight') {
    return cells.map((c) => cropToFrame(c, c.bounds, pad));
  }

  let union: Bounds | null = null;
  for (const c of cells) {
    if (!c.bounds) continue;
    union = union
      ? {
          x0: Math.min(union.x0, c.bounds.x0),
          y0: Math.min(union.y0, c.bounds.y0),
          x1: Math.max(union.x1, c.bounds.x1),
          y1: Math.max(union.y1, c.bounds.y1),
        }
      : { ...c.bounds };
  }
  return cells.map((c) => cropToFrame(c, union, pad));
}

/** Returns a horizontally mirrored copy of a frame. */
export function flipFrame(frame: CharacterFrame): CharacterFrame {
  const canvas = createCanvas(frame.width, frame.height);
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.translate(frame.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(frame.canvas, 0, 0);
  }
  return { canvas, width: frame.width, height: frame.height };
}

/** Scales down a frame proportionally when its height exceeds `maxHeight`. */
export function downscaleFrame(
  frame: CharacterFrame,
  maxHeight: number,
  smoothing = true
): CharacterFrame {
  if (frame.height <= maxHeight) return frame;
  const scale = maxHeight / frame.height;
  const w = Math.max(1, Math.round(frame.width * scale));
  const h = Math.max(1, Math.round(frame.height * scale));
  const canvas = createCanvas(w, h);
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.imageSmoothingEnabled = smoothing;
    if (smoothing) ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(frame.canvas, 0, 0, w, h);
  }
  return { canvas, width: w, height: h };
}

/** Safe `toDataURL` (returns null on tainted canvases). */
export function frameToDataUrl(frame: CharacterFrame | null): string | null {
  if (!frame) return null;
  try {
    return frame.canvas.toDataURL();
  } catch {
    return null;
  }
}
