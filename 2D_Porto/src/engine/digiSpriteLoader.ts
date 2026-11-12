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

const spriteCache = new Map<string, SlicedDigimonSprites>();
const inflightRequests = new Map<string, Promise<SlicedDigimonSprites | null>>();
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

function isOuterBgPixel(p: RgbaColor, outerBg: RgbaColor): boolean {
  if (p.a < 20) return true;
  if (outerBg.a >= 20 && colorDist(p, outerBg) <= 12) return true;
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
  outerBg: RgbaColor
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
    if (isOuterBgPixel(p, outerBg)) return false;
    const key = `${p.r},${p.g},${p.b}`;
    const prev = counts.get(key);
    if (prev) {
      prev.hits++;
    } else {
      counts.set(key, { color: p, hits: 1 });
    }
    return true;
  };

  const stepX = Math.max(1, Math.floor(sw / 24));
  const stepY = Math.max(1, Math.floor(sh / 24));

  for (let x = 0; x < sw; x += stepX) {
    for (let y = 0; y < sh; y++) {
      if (recordHit(x, y)) break;
    }
    for (let y = sh - 1; y >= 0; y--) {
      if (recordHit(x, y)) break;
    }
  }
  for (let y = 0; y < sh; y += stepY) {
    for (let x = 0; x < sw; x++) {
      if (recordHit(x, y)) break;
    }
    for (let x = sw - 1; x >= 0; x--) {
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
  edgeOnlyFlood = false
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

  // Step A: Erase edge-connected outer sheet padding (e.g. L-notch corners around uneven boxes)
  if (outerBg.a >= 20) {
    floodEraseFromBorder(d, sw, sh, (p) => colorDist(p, outerBg) <= 14);
  }

  if (edgeOnlyFlood) {
    const cornerBg = getPixelRgba(d, sw, 0, 0);
    if (cornerBg.a >= 20) {
      floodEraseFromBorder(d, sw, sh, (p) => colorDist(p, cornerBg) <= 18);
    }
  } else {
    const { localBg, isAlreadyTransparent } = detectFrameBackground(d, sw, sh, outerBg);
    if (isAlreadyTransparent) {
      for (let i = 0; i < d.length; i += 4) {
        if (d[i + 3] < 20) d[i + 3] = 0;
      }
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

        const icon = iconBox
          ? sliceAndCleanBox(ctx, img.width, img.height, iconBox, outerBg, true)
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
          .map((b) => sliceAndCleanBox(ctx, img.width, img.height, b, outerBg, false))
          .filter((f): f is ProcessedSpriteFrame => f !== null);

        const largeAttack = atkBoxes
          .map((b) => sliceAndCleanBox(ctx, img.width, img.height, b, outerBg, false))
          .filter((f): f is ProcessedSpriteFrame => f !== null);

        const overworld = owBoxes
          .map((b) => sliceAndCleanBox(ctx, img.width, img.height, b, outerBg, false))
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
    const entry = getDigimonById(id);
    if (!entry) return null;
    const req = loadAndSliceEntry(entry).finally(() => {
      inflightRequests.delete(id);
    });
    inflightRequests.set(id, req);
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
    const pool = pose.back.length ? pose.back : [0];
    const idx = pool[Math.floor(tick / stepDiv) % pool.length];
    return { frame: frames[idx] || frames[0], flipX: false };
  }

  if (orientation === 'E' || orientation === 'W') {
    const pool = pose.side.length ? pose.side : pose.front;
    const idx = pool[Math.floor(tick / (isWalking ? 9 : 24)) % pool.length];
    const shouldFlip =
      (orientation === 'E' && pose.nativeFacing === 'left') ||
      (orientation === 'W' && pose.nativeFacing === 'right');
    return { frame: frames[idx] || frames[0], flipX: shouldFlip };
  }

  // South / Front walk or idle animation
  const pool = isWalking
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

