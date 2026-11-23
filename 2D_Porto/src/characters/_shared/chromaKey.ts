import type { ChromaMode } from './types';

interface ChromaProfile {
  /** Pixels where green leads red AND blue by more than this are always background. */
  hardLead: number;
  /** Softer "greenish" test used to grow the background into shadows / fringes. */
  softLeadR: number;
  softLeadB: number;
  /** Only pixels darker than this (r+g+b) may be grown into (protects bright glow effects). */
  softMaxLuma: number;
}

const PROFILES: Record<'flat-green' | 'lossy-green', ChromaProfile> = {
  'flat-green': { hardLead: 28, softLeadR: 10, softLeadB: 8, softMaxLuma: 330 },
  'lossy-green': { hardLead: 34, softLeadR: 16, softLeadB: 16, softMaxLuma: 765 },
};

const ALPHA_MIN = 16;

function isHardKey(r: number, g: number, b: number, p: ChromaProfile): boolean {
  return g > r + p.hardLead && g > b + p.hardLead;
}

function isSoftKey(r: number, g: number, b: number, p: ChromaProfile): boolean {
  return g > r + p.softLeadR && g > b + p.softLeadB && r + g + b <= p.softMaxLuma;
}

function colorDist(
  r1: number,
  g1: number,
  b1: number,
  r2: number,
  g2: number,
  b2: number
): number {
  const dr = r1 - r2;
  const dg = g1 - g2;
  const db = b1 - b2;
  return Math.sqrt(dr * dr + dg * dg + db * db);
}

function seedAndFloodBorder(
  data: Uint8ClampedArray,
  width: number,
  height: number,
  matches: (r: number, g: number, b: number, a: number) => boolean
): void {
  const total = width * height;
  const queue = new Int32Array(total);
  let tail = 0;

  const trySeed = (i: number) => {
    const o = i * 4;
    if (data[o + 3] === 0) return;
    if (data[o + 3] < ALPHA_MIN || matches(data[o], data[o + 1], data[o + 2], data[o + 3])) {
      data[o + 3] = 0;
      queue[tail++] = i;
    }
  };

  for (let x = 0; x < width; x++) {
    trySeed(x);
    if (height > 1) trySeed((height - 1) * width + x);
  }
  for (let y = 1; y < height - 1; y++) {
    trySeed(y * width);
    if (width > 1) trySeed(y * width + (width - 1));
  }

  let head = 0;
  while (head < tail) {
    const i = queue[head++];
    const x = i % width;
    const y = (i - x) / width;
    if (x > 0) trySeed(i - 1);
    if (x < width - 1) trySeed(i + 1);
    if (y > 0) trySeed(i - width);
    if (y < height - 1) trySeed(i + width);
  }
}

function despillEdges(data: Uint8ClampedArray, width: number, height: number, lead = 8): void {
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = y * width + x;
      const o = i * 4;
      if (data[o + 3] === 0) continue;
      const touchesEmpty =
        (x > 0 && data[o - 4 + 3] === 0) ||
        (x < width - 1 && data[o + 4 + 3] === 0) ||
        (y > 0 && data[o - width * 4 + 3] === 0) ||
        (y < height - 1 && data[o + width * 4 + 3] === 0);
      if (!touchesEmpty) continue;
      const cap = Math.max(data[o], data[o + 2]) + lead;
      if (data[o + 1] > cap) data[o + 1] = cap;
    }
  }
}

function applyLossyTealKey(data: Uint8ClampedArray, width: number, height: number): void {
  const isTealBorder = (r: number, g: number, b: number) =>
    r <= 92 &&
    g >= 95 &&
    g <= 185 &&
    g >= r + 34 &&
    g >= b + 10 &&
    b >= 70 &&
    b <= 150;

  const isStrictTealPocket = (r: number, g: number, b: number) =>
    r <= 74 &&
    g >= 115 &&
    g <= 165 &&
    g >= r + 52 &&
    g >= b + 16 &&
    b >= 92 &&
    b <= 135;

  seedAndFloodBorder(data, width, height, (r, g, b) => isTealBorder(r, g, b));

  // Clear closed interior teal pockets (e.g. gaps between sword/cape/legs) without touching cyan gems
  const total = width * height;
  const queue = new Int32Array(total);
  for (let y = 2; y < height - 2; y += 2) {
    for (let x = 2; x < width - 2; x += 2) {
      const start = y * width + x;
      const so = start * 4;
      if (data[so + 3] < ALPHA_MIN) continue;
      if (!isStrictTealPocket(data[so], data[so + 1], data[so + 2])) continue;
      let head = 0;
      let tail = 0;
      queue[tail++] = start;
      data[so + 3] = 0;
      while (head < tail) {
        const i = queue[head++];
        const cx = i % width;
        const cy = (i - cx) / width;
        const visit = (n: number) => {
          const no = n * 4;
          if (data[no + 3] < ALPHA_MIN) return;
          if (isTealBorder(data[no], data[no + 1], data[no + 2])) {
            data[no + 3] = 0;
            queue[tail++] = n;
          }
        };
        if (cx > 0) visit(i - 1);
        if (cx < width - 1) visit(i + 1);
        if (cy > 0) visit(i - width);
        if (cy < height - 1) visit(i + width);
      }
    }
  }

  despillEdges(data, width, height, 6);
}

function applyDsTealMintKey(data: Uint8ClampedArray, width: number, height: number): void {
  let outerR = 5;
  let outerG = 124;
  let outerB = 120;
  let mintR = 62;
  let mintG = 200;
  let mintB = 148;
  let foundOuter = false;
  const mintBuckets = new Map<string, { rSum: number; gSum: number; bSum: number; hits: number }>();
  const inset = Math.min(8, Math.floor(Math.min(width, height) / 4));
  const stepY = Math.max(1, Math.floor(height / 36));
  const stepX = Math.max(1, Math.floor(width / 36));
  for (let y = 0; y < height; y += stepY) {
    for (let x = 0; x < width; x += stepX) {
      const o = (y * width + x) * 4;
      const r = data[o];
      const g = data[o + 1];
      const b = data[o + 2];
      if (!foundOuter && r <= 30 && g >= 90 && g <= 160 && Math.abs(g - b) <= 28) {
        outerR = r;
        outerG = g;
        outerB = b;
        foundOuter = true;
      }
      if (
        x >= inset &&
        x < width - inset &&
        y >= inset &&
        y < height - inset &&
        g >= 165 &&
        r <= 85 &&
        g > r + 60 &&
        g > b + 14
      ) {
        const key = `${r >> 3},${g >> 3},${b >> 3}`;
        const prev = mintBuckets.get(key);
        if (prev) {
          prev.rSum += r;
          prev.gSum += g;
          prev.bSum += b;
          prev.hits++;
        } else {
          mintBuckets.set(key, { rSum: r, gSum: g, bSum: b, hits: 1 });
        }
      }
    }
  }
  let topMintHits = 0;
  for (const bucket of mintBuckets.values()) {
    if (bucket.hits > topMintHits) {
      topMintHits = bucket.hits;
      mintR = Math.round(bucket.rSum / bucket.hits);
      mintG = Math.round(bucket.gSum / bucket.hits);
      mintB = Math.round(bucket.bSum / bucket.hits);
    }
  }

  const maxBgB = Math.max(outerB, mintB) + 18;
  const isSeam = (r: number, g: number, b: number) =>
    r <= 84 && b <= maxBgB && g >= b - 4 && g >= r + 50 && g >= 100;
  const isOuter = (r: number, g: number, b: number, strict: boolean) =>
    colorDist(r, g, b, outerR, outerG, outerB) <= (strict ? 42 : 56) &&
    r <= (strict ? 42 : 54) &&
    Math.abs(g - b) <= (strict ? 30 : 36);
  const isMint = (r: number, g: number, b: number, strict: boolean) =>
    colorDist(r, g, b, mintR, mintG, mintB) <= (strict ? 48 : 64) &&
    g > r + (strict ? 65 : 48) &&
    g > b + (strict ? 16 : 12);

  seedAndFloodBorder(
    data,
    width,
    height,
    (r, g, b) => isSeam(r, g, b) || isOuter(r, g, b, false) || isMint(r, g, b, false)
  );

  const total = width * height;
  const queue = new Int32Array(total);
  for (let y = 2; y < height - 2; y += 2) {
    for (let x = 2; x < width - 2; x += 2) {
      const start = y * width + x;
      const so = start * 4;
      if (data[so + 3] < ALPHA_MIN) continue;
      if (!isOuter(data[so], data[so + 1], data[so + 2], true) && !isMint(data[so], data[so + 1], data[so + 2], true)) {
        continue;
      }
      let head = 0;
      let tail = 0;
      queue[tail++] = start;
      data[so + 3] = 0;
      while (head < tail) {
        const i = queue[head++];
        const cx = i % width;
        const cy = (i - cx) / width;
        const visit = (n: number) => {
          const no = n * 4;
          if (data[no + 3] < ALPHA_MIN) return;
          if (
            isSeam(data[no], data[no + 1], data[no + 2]) ||
            isOuter(data[no], data[no + 1], data[no + 2], false) ||
            isMint(data[no], data[no + 1], data[no + 2], false)
          ) {
            data[no + 3] = 0;
            queue[tail++] = n;
          }
        };
        if (cx > 0) visit(i - 1);
        if (cx < width - 1) visit(i + 1);
        if (cy > 0) visit(i - width);
        if (cy < height - 1) visit(i + width);
      }
    }
  }

  despillEdges(data, width, height, 6);
}

function applyBorderGreenKey(data: Uint8ClampedArray, width: number, height: number): void {
  // Sample the dominant green backdrop color strictly along the cell perimeter
  const buckets = new Map<string, { rSum: number; gSum: number; bSum: number; hits: number }>();
  const record = (x: number, y: number) => {
    const o = (y * width + x) * 4;
    if (data[o + 3] < ALPHA_MIN) return;
    const r = data[o];
    const g = data[o + 1];
    const b = data[o + 2];
    if (g > r + 20 && g > b + 20) {
      const k = `${r >> 3},${g >> 3},${b >> 3}`;
      const prev = buckets.get(k);
      if (prev) {
        prev.rSum += r;
        prev.gSum += g;
        prev.bSum += b;
        prev.hits++;
      } else {
        buckets.set(k, { rSum: r, gSum: g, bSum: b, hits: 1 });
      }
    }
  };
  for (let x = 0; x < width; x++) {
    record(x, 0);
    if (height > 1) record(x, height - 1);
  }
  for (let y = 1; y < height - 1; y++) {
    record(0, y);
    if (width > 1) record(width - 1, y);
  }

  let bgR = data[0];
  let bgG = data[1];
  let bgB = data[2];
  let bestHits = 0;
  for (const b of buckets.values()) {
    if (b.hits > bestHits) {
      bestHits = b.hits;
      bgR = Math.round(b.rSum / b.hits);
      bgG = Math.round(b.gSum / b.hits);
      bgB = Math.round(b.bSum / b.hits);
    }
  }

  // Ground shadow lives strictly in the bottom band under feet; everywhere else stay tight
  // within Euclidean distance <= 24 of the sampled backdrop so emerald scales & dark wings stay untouched.
  const shadowY = Math.floor(height * 0.76);
  const total = width * height;
  const queue = new Int32Array(total);
  let tail = 0;

  const isBgAt = (i: number): boolean => {
    const o = i * 4;
    if (data[o + 3] === 0) return false;
    if (data[o + 3] < ALPHA_MIN) return true;
    const r = data[o];
    const g = data[o + 1];
    const b = data[o + 2];
    if (!(g > r + 10 && g > b + 8)) return false;
    const dist = colorDist(r, g, b, bgR, bgG, bgB);
    if (dist <= 24) return true;
    const y = Math.floor(i / width);
    return y >= shadowY && dist <= 72 && r <= bgR + 12 && b <= bgB + 12;
  };

  const trySeed = (i: number) => {
    if (isBgAt(i)) {
      data[i * 4 + 3] = 0;
      queue[tail++] = i;
    }
  };
  for (let x = 0; x < width; x++) {
    trySeed(x);
    if (height > 1) trySeed((height - 1) * width + x);
  }
  for (let y = 1; y < height - 1; y++) {
    trySeed(y * width);
    if (width > 1) trySeed(y * width + (width - 1));
  }

  let head = 0;
  while (head < tail) {
    const i = queue[head++];
    const x = i % width;
    const y = (i - x) / width;
    if (x > 0) trySeed(i - 1);
    if (x < width - 1) trySeed(i + 1);
    if (y > 0) trySeed(i - width);
    if (y < height - 1) trySeed(i + width);
  }

  // Also clear strictly matching enclosed backdrop pockets between legs/tail without touching green scales
  for (let y = 2; y < height - 2; y += 2) {
    for (let x = 2; x < width - 2; x += 2) {
      const start = y * width + x;
      const so = start * 4;
      if (data[so + 3] < ALPHA_MIN) continue;
      if (colorDist(data[so], data[so + 1], data[so + 2], bgR, bgG, bgB) > 16) continue;
      let pHead = 0;
      let pTail = 0;
      queue[pTail++] = start;
      data[so + 3] = 0;
      while (pHead < pTail) {
        const i = queue[pHead++];
        const cx = i % width;
        const cy = (i - cx) / width;
        const visit = (n: number) => {
          const no = n * 4;
          if (data[no + 3] < ALPHA_MIN) return;
          if (colorDist(data[no], data[no + 1], data[no + 2], bgR, bgG, bgB) <= 22) {
            data[no + 3] = 0;
            queue[pTail++] = n;
          }
        };
        if (cx > 0) visit(i - 1);
        if (cx < width - 1) visit(i + 1);
        if (cy > 0) visit(i - width);
        if (cy < height - 1) visit(i + width);
      }
    }
  }
}

/**
 * Removes a green/teal backdrop in-place:
 * 1. hard key of clearly background pixels,
 * 2. grows the transparent area through matching edge pixels (shadows / fringes) —
 *    interior colours are protected by dark outlines,
 * 3. 1px despill on remaining edge pixels.
 */
export function applyChromaKey(
  data: Uint8ClampedArray,
  width: number,
  height: number,
  mode: ChromaMode
): void {
  if (mode === 'border-green') {
    applyBorderGreenKey(data, width, height);
    return;
  }
  if (mode === 'lossy-teal') {
    applyLossyTealKey(data, width, height);
    return;
  }
  if (mode === 'ds-teal-mint') {
    applyDsTealMintKey(data, width, height);
    return;
  }

  const p = PROFILES[mode];
  const total = width * height;
  const queue = new Int32Array(total);
  let tail = 0;

  for (let i = 0; i < total; i++) {
    const o = i * 4;
    if (data[o + 3] < ALPHA_MIN || isHardKey(data[o], data[o + 1], data[o + 2], p)) {
      data[o + 3] = 0;
      queue[tail++] = i;
    }
  }

  let head = 0;
  while (head < tail) {
    const i = queue[head++];
    const x = i % width;
    const y = (i - x) / width;
    const visit = (n: number) => {
      const o = n * 4;
      if (data[o + 3] === 0) return;
      if (isSoftKey(data[o], data[o + 1], data[o + 2], p)) {
        data[o + 3] = 0;
        queue[tail++] = n;
      }
    };
    if (x > 0) visit(i - 1);
    if (x < width - 1) visit(i + 1);
    if (y > 0) visit(i - width);
    if (y < height - 1) visit(i + width);
  }

  despillEdges(data, width, height, 8);
}
