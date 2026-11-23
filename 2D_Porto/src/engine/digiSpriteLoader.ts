import { adaptFivedramonForPortfolio } from '../characters/fivedramon/adapters/portfolioDigimon';
import { FIVEDRAMON_META } from '../characters/fivedramon/fivedramon.meta';
import { adaptGaspiritamonForPortfolio } from '../characters/gaspiritamon/adapters/portfolioDigimon';
import { GASPIRITAMON_META } from '../characters/gaspiritamon/gaspiritamon.meta';
import { adaptHolloknightmonForPortfolio } from '../characters/holloknightmon/adapters/portfolioDigimon';
import { HOLLOKNIGHTMON_META } from '../characters/holloknightmon/holloknightmon.meta';
import { adaptJesmonXForPortfolio } from '../characters/jesmon_x/adapters/portfolioDigimon';
import { JESMON_X_META } from '../characters/jesmon_x/jesmon_x.meta';
import { adaptMastenamonForPortfolio } from '../characters/mastenamon/adapters/portfolioDigimon';
import { MASTENAMON_META } from '../characters/mastenamon/mastenamon.meta';
import { adaptMazagamonForPortfolio } from '../characters/mazagamon/adapters/portfolioDigimon';
import { MAZAGAMON_META } from '../characters/mazagamon/mazagamon.meta';
import { adaptPlusiamonForPortfolio } from '../characters/plusiamon/adapters/portfolioDigimon';
import { PLUSIAMON_META } from '../characters/plusiamon/plusiamon.meta';
import { adaptRagnaloardmonForPortfolio } from '../characters/ragnaloardmon/adapters/portfolioDigimon';
import { RAGNALOARDMON_META } from '../characters/ragnaloardmon/ragnaloardmon.meta';
import { adaptShogunAlphamonForPortfolio } from '../characters/shogun_alphamon/adapters/portfolioDigimon';
import { SHOGUN_ALPHAMON_META } from '../characters/shogun_alphamon/shogun_alphamon.meta';
import {
  getDigimonById,
  type DigimonCatalogEntry,
  type OverworldPoseMap,
  type SpriteBox,
} from './digimonCatalog';

export interface ProcessedSpriteFrame {
  canvas: HTMLCanvasElement;
  width: number;
  height: number;
}

export interface SlicedDigimonSprites {
  id: string;
  icon: ProcessedSpriteFrame | null;
  iconDataUrl: string | null;
  largeIdle: ProcessedSpriteFrame[];
  largeAttack: ProcessedSpriteFrame[];
  overworld: ProcessedSpriteFrame[];
  loadedAt: number;
}

interface RgbaColor {
  r: number;
  g: number;
  b: number;
  a: number;
}

export type CustomDigimonSpriteLoader = () => Promise<SlicedDigimonSprites | null>;

const spriteCache = new Map<string, SlicedDigimonSprites>();
const inflightRequests = new Map<string, Promise<SlicedDigimonSprites | null>>();
const customLoaders = new Map<string, CustomDigimonSpriteLoader>();

/**
 * Registers a standalone multi-sheet character module loader for a catalog Digimon id.
 */
export function registerCustomDigimonSource(id: string, loader: CustomDigimonSpriteLoader) {
  customLoaders.set(id, loader);
}

registerCustomDigimonSource(FIVEDRAMON_META.id, adaptFivedramonForPortfolio);
registerCustomDigimonSource(GASPIRITAMON_META.id, adaptGaspiritamonForPortfolio);
registerCustomDigimonSource(HOLLOKNIGHTMON_META.id, adaptHolloknightmonForPortfolio);
registerCustomDigimonSource(JESMON_X_META.id, adaptJesmonXForPortfolio);
registerCustomDigimonSource(MASTENAMON_META.id, adaptMastenamonForPortfolio);
registerCustomDigimonSource(MAZAGAMON_META.id, adaptMazagamonForPortfolio);
registerCustomDigimonSource(PLUSIAMON_META.id, adaptPlusiamonForPortfolio);
registerCustomDigimonSource(RAGNALOARDMON_META.id, adaptRagnaloardmonForPortfolio);
registerCustomDigimonSource(SHOGUN_ALPHAMON_META.id, adaptShogunAlphamonForPortfolio);
const listeners = new Map<string, Set<() => void>>();

function notifyLoaded(id: string) {
  const subs = listeners.get(id);
  if (!subs) return;
  listeners.delete(id);
  for (const cb of subs) {
    try {
      cb();
    } catch {
      // Ignore callback errors
    }
  }
}

function getPixelRgba(data: Uint8ClampedArray, w: number, x: number, y: number): RgbaColor {
  const idx = (y * w + x) * 4;
  return {
    r: data[idx],
    g: data[idx + 1],
    b: data[idx + 2],
    a: data[idx + 3],
  };
}

function colorDist(a: RgbaColor, b: RgbaColor): number {
  return Math.abs(a.r - b.r) + Math.abs(a.g - b.g) + Math.abs(a.b - b.b);
}

/**
 * Checks whether a sampled corner background is an unambiguous chromatic chroma key
 * (Teal, Box Green, Light Border Green, Magenta, Neon Blue/Cyan, Lavender, or Red Box)
 * rather than neutral black/white/grey which can appear inside character outlines/highlights.
 */
function isSafeGlobalChromaColor(c: RgbaColor): boolean {
  if (c.a < 20) return true;
  const maxC = Math.max(c.r, c.g, c.b);
  const minC = Math.min(c.r, c.g, c.b);
  // Any strongly chromatic solid key color (spread >= 36) is safe outside neutrals
  if (maxC - minC >= 36) return true;
  return false;
}

function isOuterBgPixel(p: RgbaColor, outerBg: RgbaColor, tol = 12): boolean {
  if (p.a < 20) return true;
  if (outerBg.a >= 20 && colorDist(p, outerBg) <= tol) return true;
  return false;
}

/**
 * 4-way flood-fill starting from box edges (walking across already-transparent pixels)
 * to erase connected background regions without touching enclosed character details.
 */
function floodEraseFromBorder(
  d: Uint8ClampedArray,
  sw: number,
  sh: number,
  matches: (p: RgbaColor) => boolean
) {
  const visited = new Uint8Array(sw * sh);
  const queue = new Int32Array(sw * sh * 2);
  let head = 0;
  let tail = 0;

  const tryPush = (x: number, y: number) => {
    const idx = y * sw + x;
    if (visited[idx]) return;
    const p = getPixelRgba(d, sw, x, y);
    if (p.a < 20 || matches(p)) {
      visited[idx] = 1;
      queue[tail++] = x;
      queue[tail++] = y;
    }
  };

  for (let x = 0; x < sw; x++) {
    tryPush(x, 0);
    tryPush(x, sh - 1);
  }
  for (let y = 0; y < sh; y++) {
    tryPush(0, y);
    tryPush(sw - 1, y);
  }

  while (head < tail) {
    const cx = queue[head++];
    const cy = queue[head++];
    const off = (cy * sw + cx) * 4;
    if (d[off + 3] < 20) {
      d[off + 3] = 0;
    } else if (matches({ r: d[off], g: d[off + 1], b: d[off + 2], a: d[off + 3] })) {
      d[off + 3] = 0;
    }

    if (cx > 0) tryPush(cx - 1, cy);
    if (cx < sw - 1) tryPush(cx + 1, cy);
    if (cy > 0) tryPush(cx, cy - 1);
    if (cy < sh - 1) tryPush(cx, cy + 1);
  }
}

/**
 * Samples a sprite frame's true interior backdrop via inward boundary rays so
 * L-shaped frames (RizeGreymon, Neptunemon, Vikemon, Granlocomon, MaloMyotismon)
 * and corner-touched sprites (Chronomon DM) detect their exact chroma key,
 * while pre-transparent cutout sprites (Azulongmon) remain untouched.
 */
function detectFrameBackground(
  d: Uint8ClampedArray,
  sw: number,
  sh: number,
  outerBg: RgbaColor,
  outerTol = 12,
  inset = 0
): { localBg: RgbaColor; isAlreadyTransparent: boolean } {
  if (outerBg.a < 20) {
    let perimTotal = 0;
    let perimOpaque = 0;
    for (let x = 0; x < sw; x++) {
      perimTotal += 2;
      if (getPixelRgba(d, sw, x, 0).a >= 20) perimOpaque++;
      if (getPixelRgba(d, sw, x, sh - 1).a >= 20) perimOpaque++;
    }
    for (let y = 1; y < sh - 1; y++) {
      perimTotal += 2;
      if (getPixelRgba(d, sw, 0, y).a >= 20) perimOpaque++;
      if (getPixelRgba(d, sw, sw - 1, y).a >= 20) perimOpaque++;
    }
    if (perimTotal > 0 && perimOpaque / perimTotal < 0.45) {
      return { localBg: { r: 0, g: 0, b: 0, a: 0 }, isAlreadyTransparent: true };
    }
  }

  const counts = new Map<string, { color: RgbaColor; hits: number }>();
  const recordHit = (x: number, y: number): boolean => {
    const p = getPixelRgba(d, sw, x, y);
    if (isOuterBgPixel(p, outerBg, outerTol)) return false;
    const key = `${p.r},${p.g},${p.b}`;
    const prev = counts.get(key);
    if (prev) {
      prev.hits++;
    } else {
      counts.set(key, { color: p, hits: 1 });
    }
    return true;
  };

  const xMin = Math.min(sw - 1, Math.max(0, inset));
  const xMax = Math.max(xMin, sw - 1 - inset);
  const yMin = Math.min(sh - 1, Math.max(0, inset));
  const yMax = Math.max(yMin, sh - 1 - inset);
  const stepX = Math.max(1, Math.floor((xMax - xMin + 1) / 24));
  const stepY = Math.max(1, Math.floor((yMax - yMin + 1) / 24));

  for (let x = xMin; x <= xMax; x += stepX) {
    for (let y = yMin; y <= yMax; y++) {
      if (recordHit(x, y)) break;
    }
    for (let y = yMax; y >= yMin; y--) {
      if (recordHit(x, y)) break;
    }
  }
  for (let y = yMin; y <= yMax; y += stepY) {
    for (let x = xMin; x <= xMax; x++) {
      if (recordHit(x, y)) break;
    }
    for (let x = xMax; x >= xMin; x--) {
      if (recordHit(x, y)) break;
    }
  }

  let bestSafeChroma: { color: RgbaColor; hits: number } | null = null;
  let bestAny: { color: RgbaColor; hits: number } | null = null;

  for (const entry of counts.values()) {
    if (!bestAny || entry.hits > bestAny.hits) bestAny = entry;
    if (isSafeGlobalChromaColor(entry.color)) {
      if (!bestSafeChroma || entry.hits > bestSafeChroma.hits) {
        bestSafeChroma = entry;
      }
    }
  }

  if (bestSafeChroma) {
    return { localBg: bestSafeChroma.color, isAlreadyTransparent: false };
  }
  if (bestAny) {
    return { localBg: bestAny.color, isAlreadyTransparent: false };
  }
  return { localBg: getPixelRgba(d, sw, 0, 0), isAlreadyTransparent: outerBg.a < 20 };
}

/**
 * Extracts a cropped region from the full spritesheet, removes Teal/Green/Magenta
 * or edge-connected background safely, and trims outer transparent margins.
 */
function sliceAndCleanBox(
  sheetCtx: CanvasRenderingContext2D,
  sheetW: number,
  sheetH: number,
  box: SpriteBox,
  outerBg: RgbaColor,
  edgeOnlyFlood = false,
  excludeIconBox?: SpriteBox,
  isJpg = false
): ProcessedSpriteFrame | null {
  const sx = Math.max(0, Math.floor(box.x));
  const sy = Math.max(0, Math.floor(box.y));
  const sw = Math.min(sheetW - sx, Math.floor(box.w));
  const sh = Math.min(sheetH - sy, Math.floor(box.h));
  if (sw <= 1 || sh <= 1) return null;

  const work = document.createElement('canvas');
  work.width = sw;
  work.height = sh;
  const wctx = work.getContext('2d', { willReadFrequently: true });
  if (!wctx) return null;
  wctx.imageSmoothingEnabled = false;
  wctx.drawImage(sheetCtx.canvas, sx, sy, sw, sh, 0, 0, sw, sh);

  const imgData = wctx.getImageData(0, 0, sw, sh);
  const d = imgData.data;

  // Guard against top-left mugshot icon leaking into adjacent largeIdle[0] box
  if (excludeIconBox && !edgeOnlyFlood) {
    const ex0 = Math.max(0, Math.floor(excludeIconBox.x - 2) - sx);
    const ey0 = Math.max(0, Math.floor(excludeIconBox.y - 2) - sy);
    const ex1 = Math.min(sw, Math.ceil(excludeIconBox.x + excludeIconBox.w + 4) - sx);
    const ey1 = Math.min(sh, Math.ceil(excludeIconBox.y + excludeIconBox.h + 4) - sy);
    for (let py = ey0; py < ey1; py++) {
      for (let px = ex0; px < ex1; px++) {
        d[(py * sw + px) * 4 + 3] = 0;
      }
    }
  }

  // Step A: Erase edge-connected outer sheet padding (tolerant to JPG compression when needed)
  if (outerBg.a >= 20) {
    const outerTol = isJpg ? 54 : 14;
    floodEraseFromBorder(d, sw, sh, (p) => colorDist(p, outerBg) <= outerTol);
  }

  if (edgeOnlyFlood) {
    const cornerBg = getPixelRgba(d, sw, isJpg ? 4 : 0, isJpg ? 4 : 0);
    if (cornerBg.a >= 20) {
      floodEraseFromBorder(
        d,
        sw,
        sh,
        (p) =>
          colorDist(p, cornerBg) <= (isJpg ? 52 : 18) ||
          (isJpg && p.r <= 82 && p.g >= p.b - 4 && p.g >= p.r + 52 && p.g >= 100)
      );
    }
  } else {
    const { localBg, isAlreadyTransparent } = detectFrameBackground(
      d,
      sw,
      sh,
      outerBg,
      isJpg ? 48 : 12,
      isJpg ? 6 : 0
    );
    if (isAlreadyTransparent) {
      for (let i = 0; i < d.length; i += 4) {
        if (d[i + 3] < 20) d[i + 3] = 0;
      }
    } else if (isJpg && localBg.a >= 20) {
      // Lossy JPG DS sheets (e.g. dark teal outer + mint inner box + transition seam): flood border + interior + despill
      const isJpgKey = (p: RgbaColor, strict: boolean): boolean => {
        if (p.a < 20) return true;
        const dO = outerBg.a >= 20 ? colorDist(p, outerBg) : 999;
        const dM = colorDist(p, localBg);
        if (strict) {
          const teal = dO <= 42 && p.r <= 42 && p.g >= 88 && p.g <= 165 && Math.abs(p.g - p.b) <= 30;
          const mint = dM <= 48 && p.g > p.r + 65 && p.g > p.b + 16;
          return teal || mint;
        }
        const maxBgB = Math.max(outerBg.a >= 20 ? outerBg.b : 0, localBg.b) + 18;
        const seam =
          p.r <= 84 && p.b <= maxBgB && p.g >= p.b - 4 && p.g >= p.r + 50 && p.g >= 100;
        return (
          seam ||
          (dO <= 56 && p.r <= 54 && Math.abs(p.g - p.b) <= 36) ||
          (dM <= 64 && p.g > p.r + 48 && p.g > p.b + 12)
        );
      };
      floodEraseFromBorder(d, sw, sh, (p) => isJpgKey(p, false));
      const q = new Int32Array(sw * sh * 2);
      for (let py = 2; py < sh - 2; py += 2) {
        for (let px = 2; px < sw - 2; px += 2) {
          const idx = (py * sw + px) * 4;
          if (d[idx + 3] < 20) continue;
          const p = { r: d[idx], g: d[idx + 1], b: d[idx + 2], a: d[idx + 3] };
          if (!isJpgKey(p, true)) continue;
          let head = 0;
          let tail = 0;
          q[tail++] = px;
          q[tail++] = py;
          d[idx + 3] = 0;
          while (head < tail) {
            const cx = q[head++];
            const cy = q[head++];
            const seedN = (nx: number, ny: number) => {
              const noff = (ny * sw + nx) * 4;
              if (d[noff + 3] < 20) return;
              const np = { r: d[noff], g: d[noff + 1], b: d[noff + 2], a: d[noff + 3] };
              if (isJpgKey(np, true)) {
                d[noff + 3] = 0;
                q[tail++] = nx;
                q[tail++] = ny;
              }
            };
            if (cx > 0) seedN(cx - 1, cy);
            if (cx < sw - 1) seedN(cx + 1, cy);
            if (cy > 0) seedN(cx, cy - 1);
            if (cy < sh - 1) seedN(cx, cy + 1);
          }
        }
      }
      const despill: number[] = [];
      for (let py = 1; py < sh - 1; py++) {
        for (let px = 1; px < sw - 1; px++) {
          const idx = (py * sw + px) * 4;
          if (d[idx + 3] < 20) continue;
          const touchesEmpty =
            d[((py - 1) * sw + px) * 4 + 3] < 20 ||
            d[((py + 1) * sw + px) * 4 + 3] < 20 ||
            d[(py * sw + (px - 1)) * 4 + 3] < 20 ||
            d[(py * sw + (px + 1)) * 4 + 3] < 20;
          if (!touchesEmpty) continue;
          const p = { r: d[idx], g: d[idx + 1], b: d[idx + 2], a: d[idx + 3] };
          if (
            (colorDist(p, localBg) <= 95 && p.g > p.r + 30) ||
            (outerBg.a >= 20 && colorDist(p, outerBg) <= 80 && p.r < 55 && p.g > p.r + 24 && Math.abs(p.g - p.b) <= 34)
          ) {
            despill.push(idx);
          }
        }
      }
      for (const off of despill) d[off + 3] = 0;
    } else if (localBg.a >= 20 && isSafeGlobalChromaColor(localBg)) {
      const tol = 14;
      for (let i = 0; i < d.length; i += 4) {
        if (d[i + 3] < 20) {
          d[i + 3] = 0;
          continue;
        }
        const p: RgbaColor = { r: d[i], g: d[i + 1], b: d[i + 2], a: d[i + 3] };
        if (colorDist(p, localBg) <= tol) {
          d[i + 3] = 0;
        }
      }
    } else if (localBg.a >= 20) {
      floodEraseFromBorder(d, sw, sh, (p) => colorDist(p, localBg) <= 18);
    }
  }

  wctx.putImageData(imgData, 0, 0);

  // Tightly trim outer transparent pixels so feet sit cleanly on the ground tile
  let minX = sw;
  let minY = sh;
  let maxX = -1;
  let maxY = -1;
  for (let y = 0; y < sh; y++) {
    for (let x = 0; x < sw; x++) {
      if (d[(y * sw + x) * 4 + 3] > 16) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  if (maxX < minX || maxY < minY) return null;

  const tw = maxX - minX + 1;
  const th = maxY - minY + 1;
  const trimmed = document.createElement('canvas');
  trimmed.width = tw;
  trimmed.height = th;
  const tctx = trimmed.getContext('2d');
  if (!tctx) return null;
  tctx.imageSmoothingEnabled = false;
  tctx.drawImage(work, minX, minY, tw, th, 0, 0, tw, th);

  return { canvas: trimmed, width: tw, height: th };
}

/**
 * Automatic connected-components box detector for spritesheets without manual box metadata.
 * Separates head mugshot icon, battle idle/attack boxes, and overworld small frames.
 */
function autoDetectBoxes(sheetCtx: CanvasRenderingContext2D, w: number, h: number): {
  iconBox?: SpriteBox;
  largeIdleBoxes: SpriteBox[];
  largeAttackBoxes: SpriteBox[];
  overworldBoxes: SpriteBox[];
} {
  const imgData = sheetCtx.getImageData(0, 0, w, h);
  const d = imgData.data;
  const corner = getPixelRgba(d, w, 0, 0);
  const isTransparentSheet = corner.a < 32;

  const isOuter = (x: number, y: number): boolean => {
    const idx = (y * w + x) * 4;
    if (isTransparentSheet) return d[idx + 3] < 32;
    if (d[idx + 3] < 32) return true;
    return (
      Math.abs(d[idx] - corner.r) <= 8 &&
      Math.abs(d[idx + 1] - corner.g) <= 8 &&
      Math.abs(d[idx + 2] - corner.b) <= 8
    );
  };

  const vis = new Uint8Array(w * h);
  const qx = new Int16Array(w * h);
  const qy = new Int16Array(w * h);
  const rawBoxes: SpriteBox[] = [];

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (vis[y * w + x] || isOuter(x, y)) continue;
      let head = 0;
      let tail = 0;
      vis[y * w + x] = 1;
      qx[tail] = x;
      qy[tail] = y;
      tail++;
      let minX = x;
      let maxX = x;
      let minY = y;
      let maxY = y;

      while (head < tail) {
        const cx = qx[head];
        const cy = qy[head];
        head++;
        if (cx < minX) minX = cx;
        if (cx > maxX) maxX = cx;
        if (cy < minY) minY = cy;
        if (cy > maxY) maxY = cy;

        if (cx > 0 && !vis[cy * w + (cx - 1)] && !isOuter(cx - 1, cy)) {
          vis[cy * w + (cx - 1)] = 1;
          qx[tail] = cx - 1;
          qy[tail] = cy;
          tail++;
        }
        if (cx < w - 1 && !vis[cy * w + (cx + 1)] && !isOuter(cx + 1, cy)) {
          vis[cy * w + (cx + 1)] = 1;
          qx[tail] = cx + 1;
          qy[tail] = cy;
          tail++;
        }
        if (cy > 0 && !vis[(cy - 1) * w + cx] && !isOuter(cx, cy - 1)) {
          vis[(cy - 1) * w + cx] = 1;
          qx[tail] = cx;
          qy[tail] = cy - 1;
          tail++;
        }
        if (cy < h - 1 && !vis[(cy + 1) * w + cx] && !isOuter(cx, cy + 1)) {
          vis[(cy + 1) * w + cx] = 1;
          qx[tail] = cx;
          qy[tail] = cy + 1;
          tail++;
        }
      }

      const bw = maxX - minX + 1;
      const bh = maxY - minY + 1;
      if (bw >= 18 && bh >= 18 && tail >= 80) {
        rawBoxes.push({ x: minX, y: minY, w: bw, h: bh });
      }
    }
  }

  const large = rawBoxes
    .filter((b) => b.w >= 85 && b.h >= 85)
    .sort((a, b) => (Math.abs(a.y - b.y) > 25 ? a.y - b.y : a.x - b.x));

  const overworldRaw = rawBoxes
    .filter((b) => b.w >= 20 && b.w <= 68 && b.h >= 32 && b.h <= 80)
    .sort((a, b) => (Math.abs(a.y - b.y) > 12 ? a.y - b.y : a.x - b.x));

  // Keep consistent overworld sprite grid (filters out isolated stray credit sprites like Spyro)
  let overworld = overworldRaw;
  if (overworldRaw.length > 9) {
    const mid = overworldRaw[Math.floor(overworldRaw.length / 2)];
    const clustered = overworldRaw.filter(
      (b) => Math.abs(b.w - mid.w) <= 14 && Math.abs(b.h - mid.h) <= 14
    );
    if (clustered.length >= 6) {
      overworld = clustered;
    }
  }

  const iconCandidate = rawBoxes.find(
    (b) => b.w >= 18 && b.w <= 36 && b.h >= 18 && b.h <= 36
  );

  const idleCount = large.length === 4 ? 2 : 3;

  return {
    iconBox: iconCandidate,
    largeIdleBoxes: large.slice(0, idleCount),
    largeAttackBoxes: large.slice(idleCount, idleCount + 2),
    overworldBoxes: overworld,
  };
}

function trimAndResizeFrame(
  srcCanvas: HTMLCanvasElement,
  d: Uint8ClampedArray,
  sw: number,
  sh: number,
  maxHeight: number
): ProcessedSpriteFrame | null {
  let minX = sw;
  let minY = sh;
  let maxX = -1;
  let maxY = -1;
  for (let y = 0; y < sh; y++) {
    for (let x = 0; x < sw; x++) {
      if (d[(y * sw + x) * 4 + 3] > 16) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  if (maxX < minX || maxY < minY) return null;

  const tw = maxX - minX + 1;
  const th = maxY - minY + 1;
  const scale = th > maxHeight ? maxHeight / th : 1;
  const outW = Math.max(8, Math.round(tw * scale));
  const outH = Math.max(8, Math.round(th * scale));

  const out = document.createElement('canvas');
  out.width = outW;
  out.height = outH;
  const octx = out.getContext('2d');
  if (!octx) return null;
  octx.imageSmoothingEnabled = scale < 1;
  octx.drawImage(srcCanvas, minX, minY, tw, th, 0, 0, outW, outH);
  return { canvas: out, width: outW, height: outH };
}

function isHdChromaGreen(p: RgbaColor, bg: RgbaColor, strict = false): boolean {
  if (p.a < 20) return true;
  const dist = colorDist(p, bg);
  if (strict) {
    return dist <= 28 && p.g > p.r + 44 && p.g > p.b + 34;
  }
  if (dist <= 68 && p.g > p.r + 20 && p.g > p.b + 14) return true;
  return (
    p.g > p.r + 34 &&
    p.g > p.b + 26 &&
    Math.abs(p.g - bg.g) <= 82 &&
    p.r <= bg.r + 66 &&
    p.b <= bg.b + 66
  );
}

/**
 * Removes disconnected small caption glyphs ("NORTH (BACK)", "SOUTH-WEST (FRONT-LEFT)", etc.)
 * from an HD 8-directional cell without touching detached character effects/blades.
 */
function stripHdCaptionGlyphs(d: Uint8ClampedArray, sw: number, sh: number): void {
  const total = sw * sh;
  const compId = new Int32Array(total);
  const compStats: Array<{
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
    count: number;
    whiteCount: number;
    darkCount: number;
    satCount: number;
  }> = [];
  const queue = new Int32Array(total);
  let nextId = 0;

  for (let i = 0; i < total; i++) {
    if (d[i * 4 + 3] <= 16 || compId[i] !== 0) continue;
    nextId++;
    let head = 0;
    let tail = 0;
    compId[i] = nextId;
    queue[tail++] = i;

    const ix = i % sw;
    const iy = Math.floor(i / sw);
    let minX = ix;
    let maxX = ix;
    let minY = iy;
    let maxY = iy;
    let count = 0;
    let whiteCount = 0;
    let darkCount = 0;
    let satCount = 0;

    while (head < tail) {
      const idx = queue[head++];
      const x = idx % sw;
      const y = (idx - x) / sw;
      const off = idx * 4;
      count++;
      const r = d[off];
      const g = d[off + 1];
      const b = d[off + 2];
      if (r >= 185 && g >= 185 && b >= 185) whiteCount++;
      if (r <= 72 && g <= 72 && b <= 72) darkCount++;
      if (Math.max(r, g, b) - Math.min(r, g, b) > 40) satCount++;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;

      const tryNeighbor = (nIdx: number) => {
        if (compId[nIdx] === 0 && d[nIdx * 4 + 3] > 16) {
          compId[nIdx] = nextId;
          queue[tail++] = nIdx;
        }
      };
      if (x > 0) tryNeighbor(idx - 1);
      if (x < sw - 1) tryNeighbor(idx + 1);
      if (y > 0) tryNeighbor(idx - sw);
      if (y < sh - 1) tryNeighbor(idx + sw);
    }

    compStats.push({ minX, maxX, minY, maxY, count, whiteCount, darkCount, satCount });
  }

  let maxCompCount = 0;
  for (const s of compStats) {
    if (s.count > maxCompCount) maxCompCount = s.count;
  }
  const bodyThreshold = Math.max(5500, Math.floor(maxCompCount * 0.14));

  let bodyMinY = sh;
  let bodyMaxY = 0;
  let foundBody = false;
  for (const s of compStats) {
    const ch = s.maxY - s.minY + 1;
    if (s.count >= bodyThreshold || ch >= 145) {
      foundBody = true;
      if (s.minY < bodyMinY) bodyMinY = s.minY;
      if (s.maxY > bodyMaxY) bodyMaxY = s.maxY;
    }
  }
  if (!foundBody) {
    for (const s of compStats) {
      if (s.count >= 1600) {
        foundBody = true;
        if (s.minY < bodyMinY) bodyMinY = s.minY;
        if (s.maxY > bodyMaxY) bodyMaxY = s.maxY;
      }
    }
  }
  if (!foundBody) return;

  const removeComp = new Uint8Array(nextId + 1);
  for (let idIdx = 0; idIdx < compStats.length; idIdx++) {
    const s = compStats[idIdx];
    const cw = s.maxX - s.minX + 1;
    const ch = s.maxY - s.minY + 1;
    const whiteRatio = s.whiteCount / Math.max(1, s.count);
    const darkRatio = s.darkCount / Math.max(1, s.count);
    const bwRatio = (s.whiteCount + s.darkCount) / Math.max(1, s.count);
    const satRatio = s.satCount / Math.max(1, s.count);
    const inTopBand = s.maxY <= 215;
    const inBotBand = s.minY >= sh - 165;

    const isTinyGlyph = cw <= 56 && ch <= 52 && s.count <= 1150;
    const inCaptionEdge =
      s.maxY <= bodyMinY + 18 ||
      s.minY >= bodyMaxY - 18 ||
      (s.minY <= 185 && s.maxY <= 215 && whiteRatio >= 0.22 && bwRatio >= 0.68 && satRatio <= 0.12) ||
      s.maxY >= sh - 115;

    const isOutlinedWhiteBanner =
      ch <= 108 &&
      cw >= 20 &&
      cw <= 460 &&
      s.count <= 28000 &&
      s.count < maxCompCount * 0.35 &&
      (s.maxY <= bodyMinY - 2 || s.minY >= bodyMaxY + 2 || (satRatio <= 0.12 && (inTopBand || inBotBand))) &&
      whiteRatio >= 0.16 &&
      bwRatio >= 0.68;

    const isMergedBlackCaption =
      ch <= 48 &&
      s.count <= 4500 &&
      s.minY >= bodyMaxY + 4 &&
      s.minY >= sh - 125 &&
      darkRatio >= 0.65;

    const isTopMarginGlyph =
      cw <= 38 &&
      ch <= 36 &&
      s.count <= 500 &&
      s.maxY <= 52 &&
      bwRatio >= 0.72;

    if (
      (isTinyGlyph && inCaptionEdge && (whiteRatio >= 0.22 || ch <= 40)) ||
      isOutlinedWhiteBanner ||
      isMergedBlackCaption ||
      isTopMarginGlyph
    ) {
      removeComp[idIdx + 1] = 1;
    }
  }

  for (let i = 0; i < total; i++) {
    const cid = compId[i];
    if (cid > 0 && removeComp[cid]) {
      d[i * 4 + 3] = 0;
    }
  }
}

/**
 * Slices modern 2388/2400x1792 8-Directional Digimon Sprite Sheets:
 * - Row 1: North (Back), North-East, East (Right), South-East
 * - Row 2: South (Front), South-West, West (Left), North-West
 * - Top-Left: Mugshot Portrait Icon
 */
function sliceHd8DirSheet(
  id: string,
  sheetCtx: CanvasRenderingContext2D,
  w: number,
  h: number
): SlicedDigimonSprites | null {
  const fullData = sheetCtx.getImageData(0, 0, w, h).data;
  const sheetBg = getPixelRgba(fullData, w, 16, Math.floor(h * 0.35));

  const getRowBg = (y: number): RgbaColor => {
    const cy = Math.max(0, Math.min(h - 1, y));
    const left = getPixelRgba(fullData, w, 14, cy);
    if (left.g > left.r + 18 && left.g > left.b + 12) return left;
    const right = getPixelRgba(fullData, w, w - 15, cy);
    if (right.g > right.r + 18 && right.g > right.b + 12) return right;
    return sheetBg;
  };

  const rowNonBg = (y: number, xStart: number, xEnd: number, bgOverride?: RgbaColor, stepX = 8): number => {
    const rowBg = bgOverride ?? getRowBg(y);
    let hits = 0;
    for (let x = xStart; x < xEnd; x += stepX) {
      const p = getPixelRgba(fullData, w, x, y);
      if (!isHdChromaGreen(p, rowBg, false) && !isHdChromaGreen(p, sheetBg, false)) hits++;
    }
    return hits;
  };

  const findWidestGapMid = (yFrom: number, yTo: number, fallback: number): number => {
    const scan = (maxAllowedHits: number): { len: number; mid: number } => {
      let bestLen = 0;
      let bestMid = fallback;
      let curStart = -1;
      for (let y = yFrom; y <= yTo; y += 2) {
        if (rowNonBg(y, 20, w - 20, undefined, 2) <= maxAllowedHits) {
          if (curStart < 0) curStart = y;
        } else if (curStart >= 0) {
          const len = y - curStart;
          if (len > bestLen) {
            bestLen = len;
            bestMid = Math.floor((curStart + y) / 2);
          }
          curStart = -1;
        }
      }
      if (curStart >= 0) {
        const len = yTo - curStart;
        if (len > bestLen) {
          bestLen = len;
          bestMid = Math.floor((curStart + yTo) / 2);
        }
      }
      return { len: bestLen, mid: bestMid };
    };
    const strict = scan(0);
    if (strict.len >= 6) return strict.mid;
    return scan(2).mid;
  };

  // Detect Top-Left Mugshot width first (up to x=285) so title scan avoids wide circular icons
  let iconEndX = Math.min(246, Math.floor(w * 0.105));
  let bestGapHits = 999;
  for (let x = 128; x <= Math.min(285, w - 40); x += 2) {
    let colHits = 0;
    for (let y = 10; y <= Math.min(210, h - 10); y += 4) {
      const p = getPixelRgba(fullData, w, x, y);
      if (!isHdChromaGreen(p, sheetBg, false)) colHits++;
    }
    if (colHits < bestGapHits) {
      bestGapHits = colHits;
      iconEndX = x;
      if (colHits === 0 && x >= 142) break;
    }
  }

  const titleScanX = Math.max(275, iconEndX + 8);
  let headerEnd = 165;
  for (let y = 112; y <= 235; y += 2) {
    if (
      rowNonBg(y, titleScanX, w - 40, sheetBg, 4) <= 1 &&
      rowNonBg(Math.min(h - 1, y + 4), titleScanX, w - 40, sheetBg, 4) <= 2
    ) {
      headerEnd = y;
      break;
    }
  }

  // Detect exact vertical bottom of Top-Left Mugshot Icon (may extend below titleEnd into Col 0 top-left)
  let mugBottomY = headerEnd;
  for (let y = Math.max(112, headerEnd - 12); y <= Math.min(290, h - 20); y += 2) {
    let hits = 0;
    for (let x = 12; x <= iconEndX; x += 3) {
      const p = getPixelRgba(fullData, w, x, y);
      if (!isHdChromaGreen(p, sheetBg, false)) hits++;
    }
    if (hits === 0) {
      mugBottomY = y;
      break;
    }
  }

  const splitY = findWidestGapMid(820, 1015, Math.floor(h * 0.51));
  const stripStart = findWidestGapMid(1555, Math.min(h - 40, 1665), Math.floor(h * 0.895));

  const cleanHdChromaRegion = (
    d: Uint8ClampedArray,
    rw: number,
    rh: number,
    bgs: RgbaColor[],
    seedStep = 4,
    extraBorderMatch?: (p: RgbaColor) => boolean,
    interiorMaxDist = 28
  ) => {
    const isStrictInteriorGreen = (p: RgbaColor): boolean =>
      bgs.some(
        (bg) =>
          isHdChromaGreen(p, bg, true) ||
          (interiorMaxDist > 28 &&
            colorDist(p, bg) <= interiorMaxDist &&
            p.g > p.r + 36 &&
            p.g > p.b + 28)
      );

    // 1. Border flood-fill chroma erase
    floodEraseFromBorder(
      d,
      rw,
      rh,
      (p) => bgs.some((bg) => isHdChromaGreen(p, bg, false)) || Boolean(extraBorderMatch?.(p))
    );

    // 2. Interior trapped chroma-green loop erase (strict match so green bodies/scales remain untouched)
    const q = new Int32Array(rw * rh * 2);
    for (let py = 2; py < rh - 2; py += seedStep) {
      for (let px = 2; px < rw - 2; px += seedStep) {
        const idx = (py * rw + px) * 4;
        if (d[idx + 3] < 20) continue;
        const p = { r: d[idx], g: d[idx + 1], b: d[idx + 2], a: d[idx + 3] };
        if (!isStrictInteriorGreen(p)) continue;
        let head = 0;
        let tail = 0;
        q[tail++] = px;
        q[tail++] = py;
        d[idx + 3] = 0;
        while (head < tail) {
          const cx = q[head++];
          const cy = q[head++];
          const trySeed = (nx: number, ny: number) => {
            const noff = (ny * rw + nx) * 4;
            if (d[noff + 3] < 20) return;
            const np = { r: d[noff], g: d[noff + 1], b: d[noff + 2], a: d[noff + 3] };
            if (isStrictInteriorGreen(np)) {
              d[noff + 3] = 0;
              q[tail++] = nx;
              q[tail++] = ny;
            }
          };
          if (cx > 0) trySeed(cx - 1, cy);
          if (cx < rw - 1) trySeed(cx + 1, cy);
          if (cy > 0) trySeed(cx, cy - 1);
          if (cy < rh - 1) trySeed(cx, cy + 1);
        }
      }
    }

    // 3. Soft 1px outline green-halo despill around freshly erased borders
    const toDespill: number[] = [];
    for (let py = 1; py < rh - 1; py++) {
      for (let px = 1; px < rw - 1; px++) {
        const idx = (py * rw + px) * 4;
        if (d[idx + 3] < 20) continue;
        const touchesTransparent =
          d[((py - 1) * rw + px) * 4 + 3] < 20 ||
          d[((py + 1) * rw + px) * 4 + 3] < 20 ||
          d[(py * rw + (px - 1)) * 4 + 3] < 20 ||
          d[(py * rw + (px + 1)) * 4 + 3] < 20;
        if (!touchesTransparent) continue;
        const p = { r: d[idx], g: d[idx + 1], b: d[idx + 2], a: d[idx + 3] };
        if (p.g > p.r + 24 && p.g > p.b + 18 && bgs.some((bg) => colorDist(p, bg) <= 135)) {
          toDespill.push(idx);
        }
      }
    }
    for (const off of toDespill) {
      if (d[off + 1] > d[off] + 45 && d[off + 1] > d[off + 2] + 35) {
        d[off + 3] = 0;
      } else {
        d[off + 1] = Math.min(d[off + 1], Math.max(d[off], d[off + 2]) + 6);
      }
    }
  };

  const iconBox: SpriteBox = {
    x: 12,
    y: 4,
    w: Math.max(96, iconEndX - 12),
    h: Math.min(285, Math.max(150, mugBottomY + 8)),
  };
  let icon: ProcessedSpriteFrame | null = null;
  let iconDataUrl: string | null = null;
  {
    const iWork = document.createElement('canvas');
    iWork.width = iconBox.w;
    iWork.height = iconBox.h;
    const ictx = iWork.getContext('2d', { willReadFrequently: true });
    if (ictx) {
      ictx.drawImage(sheetCtx.canvas, iconBox.x, iconBox.y, iconBox.w, iconBox.h, 0, 0, iconBox.w, iconBox.h);
      const iData = ictx.getImageData(0, 0, iconBox.w, iconBox.h);
      const idArr = iData.data;
      const tlColor = getPixelRgba(idArr, iconBox.w, 2, 2);
      const brColor = getPixelRgba(idArr, iconBox.w, iconBox.w - 3, iconBox.h - 3);
      const iconBgs: RgbaColor[] = [sheetBg];
      if (tlColor.g > tlColor.r + 22 && tlColor.g > tlColor.b + 16) iconBgs.push(tlColor);
      if (brColor.g > brColor.r + 22 && brColor.g > brColor.b + 16) iconBgs.push(brColor);
      cleanHdChromaRegion(
        idArr,
        iconBox.w,
        iconBox.h,
        iconBgs,
        2,
        (p) => colorDist(p, tlColor) <= 28 || colorDist(p, brColor) <= 28,
        68
      );

      // Keep only the main mugshot component (drop any stray title fragments or noise specks)
      const iw = iconBox.w;
      const ih = iconBox.h;
      const iTotal = iw * ih;
      const iComp = new Int32Array(iTotal);
      const iQueue = new Int32Array(iTotal);
      let bestId = 0;
      let bestSize = 0;
      let curId = 0;
      for (let i = 0; i < iTotal; i++) {
        if (idArr[i * 4 + 3] <= 16 || iComp[i] !== 0) continue;
        curId++;
        let hIdx = 0;
        let tIdx = 0;
        iComp[i] = curId;
        iQueue[tIdx++] = i;
        while (hIdx < tIdx) {
          const idx = iQueue[hIdx++];
          const cx = idx % iw;
          const cy = (idx - cx) / iw;
          const pushN = (nIdx: number) => {
            if (iComp[nIdx] === 0 && idArr[nIdx * 4 + 3] > 16) {
              iComp[nIdx] = curId;
              iQueue[tIdx++] = nIdx;
            }
          };
          if (cx > 0) pushN(idx - 1);
          if (cx < iw - 1) pushN(idx + 1);
          if (cy > 0) pushN(idx - iw);
          if (cy < ih - 1) pushN(idx + iw);
        }
        if (tIdx > bestSize) {
          bestSize = tIdx;
          bestId = curId;
        }
      }
      if (bestId > 0) {
        for (let i = 0; i < iTotal; i++) {
          if (iComp[i] !== bestId) idArr[i * 4 + 3] = 0;
        }
      }

      ictx.putImageData(iData, 0, 0);
      const trimmedIcon = trimAndResizeFrame(iWork, idArr, iconBox.w, iconBox.h, 44);
      if (trimmedIcon) {
        const sqSize = 48;
        const sq = document.createElement('canvas');
        sq.width = sqSize;
        sq.height = sqSize;
        const sctx = sq.getContext('2d');
        if (sctx) {
          const fitScale = Math.min(44 / trimmedIcon.width, 44 / trimmedIcon.height);
          const dw = Math.max(8, Math.round(trimmedIcon.width * fitScale));
          const dh = Math.max(8, Math.round(trimmedIcon.height * fitScale));
          sctx.imageSmoothingEnabled = true;
          sctx.imageSmoothingQuality = 'high';
          sctx.drawImage(
            trimmedIcon.canvas,
            Math.round((sqSize - dw) / 2),
            Math.round((sqSize - dh) / 2),
            dw,
            dh
          );
          icon = { canvas: sq, width: sqSize, height: sqSize };
        } else {
          icon = trimmedIcon;
        }
        try {
          iconDataUrl = icon.canvas.toDataURL();
        } catch {
          iconDataUrl = null;
        }
      }
    }
  }

  // Extract 8 directional cells: Row 1 (N, NE, E, SE) + Row 2 (S, SW, W, NW)
  const overworld: ProcessedSpriteFrame[] = [];
  const largeFrames: ProcessedSpriteFrame[] = [];

  const detectRowColumnRanges = (y0: number, y1: number): Array<[number, number]> => {
    const rowH = Math.max(32, y1 - y0);
    const sy0 = y0 + Math.floor(rowH * 0.14);
    const sy1 = y1 - Math.floor(rowH * 0.16);
    const stepX = 8;
    const stepY = 12;
    const bins = Math.floor(w / stepX);
    const colHits = new Int32Array(bins);
    for (let bx = 0; bx < bins; bx++) {
      const x = bx * stepX;
      let hits = 0;
      for (let y = sy0; y < sy1; y += stepY) {
        const p = getPixelRgba(fullData, w, x, y);
        const rbg = getRowBg(y);
        if (!isHdChromaGreen(p, rbg, false) && !isHdChromaGreen(p, sheetBg, false)) hits++;
      }
      colHits[bx] = hits;
    }

    const gaps: Array<{ start: number; end: number; mid: number }> = [];
    let gStart = -1;
    for (let bx = 0; bx < bins; bx++) {
      if (colHits[bx] <= 1) {
        if (gStart < 0) gStart = bx;
      } else if (gStart >= 0) {
        const x0 = gStart * stepX;
        const x1 = bx * stepX;
        if (x1 - x0 >= 16 && x0 > 120 && x1 < w - 120) {
          gaps.push({ start: x0, end: x1, mid: Math.floor((x0 + x1) / 2) });
        }
        gStart = -1;
      }
    }

    if (gaps.length === 3) {
      return [
        [0, gaps[0].mid],
        [gaps[0].mid, gaps[1].mid],
        [gaps[1].mid, gaps[2].mid],
        [gaps[2].mid, w],
      ];
    }

    // Handle 3-column wide rows (e.g. massive wingspan where Row 1 holds N, NE, E only)
    if (gaps.length === 2 && gaps[0].mid > Math.floor(w * 0.34)) {
      const qBinStart = Math.max(0, Math.floor((w * 0.18) / stepX));
      const qBinEnd = Math.min(bins - 1, Math.floor((w * 0.31) / stepX));
      let minQHits = 999;
      for (let bx = qBinStart; bx <= qBinEnd; bx++) {
        if (colHits[bx] < minQHits) minQHits = colHits[bx];
      }
      if (minQHits >= 5) {
        return [
          [0, gaps[0].mid],
          [gaps[0].mid, gaps[1].mid],
          [gaps[1].mid, w],
        ];
      }
    }

    // Standard 4-column split refined to local minimum-occupancy valleys near k * w / 4
    const cuts = [0, 0, 0, 0, w];
    for (let k = 1; k <= 3; k++) {
      const nomX = Math.floor((k * w) / 4);
      const bFrom = Math.max(0, Math.floor((nomX - 140) / stepX));
      const bTo = Math.min(bins - 1, Math.floor((nomX + 140) / stepX));
      let bestBx = Math.floor(nomX / stepX);
      let bestScore = colHits[bestBx];
      for (let bx = bFrom; bx <= bTo; bx++) {
        if (colHits[bx] < bestScore) {
          bestScore = colHits[bx];
          bestBx = bx;
        }
      }
      cuts[k] = bestScore <= 3 ? bestBx * stepX : nomX;
    }
    return [
      [cuts[0], cuts[1]],
      [cuts[1], cuts[2]],
      [cuts[2], cuts[3]],
      [cuts[3], cuts[4]],
    ];
  };

  const flipFrameH = (src: ProcessedSpriteFrame): ProcessedSpriteFrame => {
    const fc = document.createElement('canvas');
    fc.width = src.width;
    fc.height = src.height;
    const fctx = fc.getContext('2d');
    if (fctx) {
      fctx.translate(src.width, 0);
      fctx.scale(-1, 1);
      fctx.drawImage(src.canvas, 0, 0);
    }
    return { canvas: fc, width: src.width, height: src.height };
  };

  const rowRanges: Array<[number, number]> = [
    [headerEnd, splitY],
    [splitY, stripStart],
  ];
  let row1ColCount = 4;

  for (let rIdx = 0; rIdx < rowRanges.length; rIdx++) {
    const [y0, y1] = rowRanges[rIdx];
    const ch = Math.max(16, y1 - y0);
    const colRanges = detectRowColumnRanges(y0, y1);
    if (rIdx === 0) row1ColCount = colRanges.length;

    for (const [x0, x1] of colRanges) {
      const cw = Math.max(16, x1 - x0);

      const work = document.createElement('canvas');
      work.width = cw;
      work.height = ch;
      const wctx = work.getContext('2d', { willReadFrequently: true });
      if (!wctx) continue;
      wctx.drawImage(sheetCtx.canvas, x0, y0, cw, ch, 0, 0, cw, ch);

      const imgData = wctx.getImageData(0, 0, cw, ch);
      const d = imgData.data;

      // Wipe any bottom overhang of the top-left mugshot icon inside Row 1 Col 0 (NORTH)
      if (rIdx === 0 && x0 === 0 && mugBottomY > y0) {
        const maskW = Math.min(cw, iconEndX + 8);
        const maskH = Math.min(ch, mugBottomY + 4 - y0);
        for (let py = 0; py < maskH; py++) {
          for (let px = 0; px < maskW; px++) {
            d[(py * cw + px) * 4 + 3] = 0;
          }
        }
      }

      // Collect local green shades across top/bottom/mid corners so gradient backdrops key evenly
      const cellBgs: RgbaColor[] = [sheetBg];
      const probePts: Array<[number, number]> = [
        [2, 2],
        [cw - 3, 2],
        [2, Math.floor(ch * 0.5)],
        [cw - 3, Math.floor(ch * 0.5)],
        [2, ch - 3],
        [cw - 3, ch - 3],
      ];
      for (const [px, py] of probePts) {
        const sp = getPixelRgba(d, cw, px, py);
        if (sp.a >= 200 && sp.g > sp.r + 18 && sp.g > sp.b + 12) {
          cellBgs.push(sp);
        }
      }

      cleanHdChromaRegion(d, cw, ch, cellBgs, 4);

      // 4. Remove white/black text labels ("NORTH (BACK)", "SOUTH-WEST (FRONT-LEFT)", etc.)
      stripHdCaptionGlyphs(d, cw, ch);

      wctx.putImageData(imgData, 0, 0);

      const owFrame = trimAndResizeFrame(work, d, cw, ch, 96);
      const lgFrame = trimAndResizeFrame(work, d, cw, ch, 220);
      if (owFrame) overworld.push(owFrame);
      if (lgFrame) largeFrames.push(lgFrame);
    }

    // If Row 1 only had 3 wide sprites (N, NE, E), push placeholder for SE (index 3) to mirror SW later
    if (rIdx === 0 && row1ColCount === 3 && overworld.length === 3) {
      overworld.push(flipFrameH(overworld[2]));
      if (largeFrames.length === 3) largeFrames.push(flipFrameH(largeFrames[2]));
    }
  }

  // Replace placeholder SE (index 3) with true mirrored SW (index 5) once Row 2 finishes
  if (row1ColCount === 3 && overworld.length >= 6) {
    overworld[3] = flipFrameH(overworld[5]);
    if (largeFrames.length >= 6) {
      largeFrames[3] = flipFrameH(largeFrames[5]);
    }
  }

  const largeIdle =
    largeFrames.length >= 6
      ? [largeFrames[5]]
      : largeFrames.slice(0, 1);
  const largeAttack =
    largeFrames.length >= 6
      ? [largeFrames[3], largeFrames[5]]
      : largeFrames.slice(0, 2);

  return {
    id,
    icon,
    iconDataUrl,
    largeIdle,
    largeAttack,
    overworld,
    loadedAt: performance.now(),
  };
}

function hasLossyOuterPadding(
  ctx: CanvasRenderingContext2D,
  sheetW: number,
  sheetH: number,
  outerBg: RgbaColor
): boolean {
  if (outerBg.a < 200) return false;
  const nearColors = new Set<string>();
  const sampleW = Math.min(sheetW, 320);
  const sampleH = Math.min(sheetH, 240);
  const topData = ctx.getImageData(0, 0, sampleW, Math.min(sheetH, 5)).data;
  for (let i = 0; i < topData.length; i += 8) {
    const p: RgbaColor = {
      r: topData[i],
      g: topData[i + 1],
      b: topData[i + 2],
      a: topData[i + 3],
    };
    const dist = colorDist(p, outerBg);
    if (dist > 0 && dist <= 28) {
      nearColors.add(`${p.r},${p.g},${p.b}`);
      if (nearColors.size >= 4) return true;
    }
  }
  const rightData = ctx.getImageData(Math.max(0, sheetW - 4), 0, Math.min(sheetW, 4), sampleH).data;
  for (let i = 0; i < rightData.length; i += 8) {
    const p: RgbaColor = {
      r: rightData[i],
      g: rightData[i + 1],
      b: rightData[i + 2],
      a: rightData[i + 3],
    };
    const dist = colorDist(p, outerBg);
    if (dist > 0 && dist <= 28) {
      nearColors.add(`${p.r},${p.g},${p.b}`);
      if (nearColors.size >= 4) return true;
    }
  }
  return false;
}

function loadAndSliceEntry(entry: DigimonCatalogEntry): Promise<SlicedDigimonSprites | null> {
  if (typeof window === 'undefined' || typeof Image === 'undefined') {
    return Promise.resolve(null);
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const fullCanvas = document.createElement('canvas');
        fullCanvas.width = img.width;
        fullCanvas.height = img.height;
        const ctx = fullCanvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) {
          resolve(null);
          return;
        }
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(img, 0, 0);

        if (entry.sheetFormat === 'hd_8dir' && !entry.overworldBoxes?.length) {
          const slicedHd = sliceHd8DirSheet(entry.id, ctx, img.width, img.height);
          if (slicedHd) {
            spriteCache.set(entry.id, slicedHd);
            notifyLoaded(entry.id);
            resolve(slicedHd);
            return;
          }
        }

        const cornerData = ctx.getImageData(0, 0, 1, 1).data;
        const outerBg: RgbaColor = {
          r: cornerData[0],
          g: cornerData[1],
          b: cornerData[2],
          a: cornerData[3],
        };

        const needsAutoDetect =
          !entry.largeIdleBoxes?.length || !entry.overworldBoxes?.length;
        const detected = needsAutoDetect
          ? autoDetectBoxes(ctx, img.width, img.height)
          : null;

        const iconBox = entry.iconBox || detected?.iconBox;
        const idleBoxes =
          entry.largeIdleBoxes && entry.largeIdleBoxes.length > 0
            ? entry.largeIdleBoxes
            : detected?.largeIdleBoxes || [];
        const atkBoxes =
          entry.largeAttackBoxes && entry.largeAttackBoxes.length > 0
            ? entry.largeAttackBoxes
            : detected?.largeAttackBoxes || [];
        const owBoxes =
          entry.overworldBoxes && entry.overworldBoxes.length > 0
            ? entry.overworldBoxes
            : detected?.overworldBoxes || [];

        const isJpg =
          /\.jpe?g(?:$|\?)/i.test(entry.spriteSheetUrl) ||
          hasLossyOuterPadding(ctx, img.width, img.height, outerBg);
        const icon = iconBox
          ? sliceAndCleanBox(ctx, img.width, img.height, iconBox, outerBg, true, undefined, isJpg)
          : null;
        let iconDataUrl: string | null = null;
        if (icon) {
          try {
            iconDataUrl = icon.canvas.toDataURL();
          } catch {
            iconDataUrl = null;
          }
        }

        const largeIdle = idleBoxes
          .map((b) => sliceAndCleanBox(ctx, img.width, img.height, b, outerBg, false, iconBox, isJpg))
          .filter((f): f is ProcessedSpriteFrame => f !== null);

        const largeAttack = atkBoxes
          .map((b) => sliceAndCleanBox(ctx, img.width, img.height, b, outerBg, false, iconBox, isJpg))
          .filter((f): f is ProcessedSpriteFrame => f !== null);

        const overworld = owBoxes
          .map((b) => sliceAndCleanBox(ctx, img.width, img.height, b, outerBg, false, iconBox, isJpg))
          .filter((f): f is ProcessedSpriteFrame => f !== null);

        const sliced: SlicedDigimonSprites = {
          id: entry.id,
          icon,
          iconDataUrl,
          largeIdle,
          largeAttack,
          overworld,
          loadedAt: performance.now(),
        };

        spriteCache.set(entry.id, sliced);
        notifyLoaded(entry.id);
        resolve(sliced);
      } catch {
        resolve(null);
      }
    };
    img.onerror = () => resolve(null);
    img.src = entry.spriteSheetUrl;
  });
}

/**
 * Synchronously retrieves cached Digimon sprites if already sliced, or null if not yet loaded.
 */
export function getDigimonSpritesSync(id: string): SlicedDigimonSprites | null {
  return spriteCache.get(id) || null;
}

/**
 * Lazily loads and slices a Digimon spritesheet into memory once, notifying subscribers on completion.
 * Never touches Digimon assets unless explicitly requested by /digimon or active entities.
 */
export function requestDigimonSprites(id: string, onReady?: () => void): SlicedDigimonSprites | null {
  const cached = spriteCache.get(id);
  if (cached) return cached;

  if (onReady) {
    let subs = listeners.get(id);
    if (!subs) {
      subs = new Set();
      listeners.set(id, subs);
    }
    subs.add(onReady);
  }

  if (!inflightRequests.has(id)) {
    const customLoader = customLoaders.get(id);
    if (customLoader) {
      const req = customLoader()
        .then((res) => {
          if (res) {
            spriteCache.set(id, res);
            notifyLoaded(id);
          }
          return res;
        })
        .finally(() => {
          inflightRequests.delete(id);
        });
      inflightRequests.set(id, req);
    } else {
      const entry = getDigimonById(id);
      if (!entry) return null;
      const req = loadAndSliceEntry(entry).finally(() => {
        inflightRequests.delete(id);
      });
      inflightRequests.set(id, req);
    }
  }

  return null;
}

function inferOverworldPoseMap(frameCount: number): OverworldPoseMap {
  if (frameCount >= 12) {
    // 3x4 or 3x5 right-side grid (Beelzemon, Seraphimon, Machinedramon, Baihumon, Zhuqiaomon, etc.)
    return {
      front: [0, 1, 2],
      side: [3, 4, 5],
      back: [6, 7, 8],
      action: frameCount >= 15 ? [13, 14] : [9, 10, 11],
      nativeFacing: 'left',
    };
  }
  if (frameCount >= 8) {
    // Standard 9-frame horizontal DS strip (3 back, 1 front, 2 walk, 1 idle, 2 action)
    return {
      back: [0, 1, 2],
      front: [3, 6],
      side: [3, 4, 5],
      action: [7, 8],
      nativeFacing: 'left',
    };
  }
  const indices = Array.from({ length: frameCount }, (_, i) => i);
  return {
    back: indices,
    front: indices,
    side: indices,
    action: indices,
    nativeFacing: 'left',
  };
}

/**
 * Selects the animated overworld frame and horizontal flip flag based on map orientation (N/S/W/E).
 */
export function selectDigimonOverworldFrame(
  entry: DigimonCatalogEntry,
  sprites: SlicedDigimonSprites,
  orientation: 'N' | 'S' | 'E' | 'W' = 'S',
  tick: number,
  inAction = false,
  isWalking = false
): { frame: ProcessedSpriteFrame | null; flipX: boolean } {
  const frames = sprites.overworld;
  if (!frames.length) {
    return {
      frame: sprites.largeIdle[0] || null,
      flipX: orientation === 'E',
    };
  }

  const pose = entry.overworldPoseMap || inferOverworldPoseMap(frames.length);
  const stepDiv = isWalking ? 10 : 28;

  if (inAction && pose.action && pose.action.length > 0) {
    const idx = pose.action[Math.floor(tick / 12) % pose.action.length];
    return {
      frame: frames[idx] || frames[0],
      flipX: orientation === 'E' && pose.nativeFacing === 'left',
    };
  }

  if (orientation === 'N') {
    if (!isWalking && pose.idle?.back?.length) {
      const idx = pose.idle.back[Math.floor(tick / stepDiv) % pose.idle.back.length];
      return { frame: frames[idx] || frames[0], flipX: false };
    }
    const pool = pose.back.length ? pose.back : [0];
    const idx = pool[Math.floor(tick / stepDiv) % pool.length];
    return { frame: frames[idx] || frames[0], flipX: false };
  }

  if (orientation === 'E') {
    if (!isWalking && pose.idle?.east?.length) {
      const idx = pose.idle.east[Math.floor(tick / 24) % pose.idle.east.length];
      return { frame: frames[idx] || frames[0], flipX: false };
    }
    if (pose.east && pose.east.length > 0) {
      const idx = pose.east[Math.floor(tick / (isWalking ? 9 : 24)) % pose.east.length];
      return { frame: frames[idx] || frames[0], flipX: false };
    }
    const pool = pose.side.length ? pose.side : pose.front;
    const idx = pool[Math.floor(tick / (isWalking ? 9 : 24)) % pool.length];
    return { frame: frames[idx] || frames[0], flipX: pose.nativeFacing === 'left' };
  }

  if (orientation === 'W') {
    if (!isWalking && pose.idle?.west?.length) {
      const idx = pose.idle.west[Math.floor(tick / 24) % pose.idle.west.length];
      return { frame: frames[idx] || frames[0], flipX: false };
    }
    if (pose.west && pose.west.length > 0) {
      const idx = pose.west[Math.floor(tick / (isWalking ? 9 : 24)) % pose.west.length];
      return { frame: frames[idx] || frames[0], flipX: false };
    }
    const pool = pose.side.length ? pose.side : pose.front;
    const idx = pool[Math.floor(tick / (isWalking ? 9 : 24)) % pool.length];
    return { frame: frames[idx] || frames[0], flipX: pose.nativeFacing === 'right' };
  }

  // South / Front walk or idle animation
  if (!isWalking && pose.idle?.front?.length) {
    const idx = pose.idle.front[Math.floor(tick / 34) % pose.idle.front.length];
    return { frame: frames[idx] || frames[0], flipX: false };
  }
  const hasExplicitEastWest = Boolean(pose.east?.length || pose.west?.length);
  const pool =
    isWalking && !hasExplicitEastWest
      ? pose.side.length
        ? pose.side
        : pose.front
      : pose.front.length
      ? pose.front
      : [3];
  const idx = pool[Math.floor(tick / (isWalking ? 10 : 34)) % pool.length];
  return { frame: frames[idx] || frames[0], flipX: false };
}

export function clearDigimonSpriteCache() {
  spriteCache.clear();
  inflightRequests.clear();
  listeners.clear();
}

