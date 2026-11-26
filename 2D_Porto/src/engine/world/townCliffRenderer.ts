/**
 * Elevation-aware Gen 4/5 Pokémon Mountain Cliff Renderer (Sinnoh / HGSS / Unova Style).
 *
 * Classifies every cliff tile by its surrounding plateau vs. valley elevation:
 *  - M_FACE   : South-facing 2-to-3 tile tall craggy rock wall (bold overhanging turf crown,
 *               polygonal vertical crag columns, mid-wall horizontal rock shelves, scalloped
 *               boulder base toes, and cast shadow + rubble onto the ground below)
 *  - M_OUTER  : Outer rocky flank of a 2-wide side cliff (stepped vertical rock strata & dark rim)
 *  - M_INNER  : Plateau grass edge above a side cliff (carved stone rim + scalloped turf overhang)
 *  - M_SINGLE : 1-wide side wall (half craggy rock flank, half overhanging plateau turf)
 *  - M_RIM    : North back edge of a plateau seen from above (sunlit rock rim + dark drop edge)
 */
import { TILE_SIZE } from '../sprites';
import { townConfig } from '../townConfig';
import { Tile, type TownMap } from '../types';
import { computeTownElevation } from './townGeography';

const M_FACE = 1;
const M_OUTER = 2;
const M_INNER = 3;
const M_SINGLE = 4;
const M_RIM = 5;
const M_TOP = 6;
const FAR = 99;

interface RockPalette {
  outline: string;
  crevice: string;
  deep: string;
  dark: string;
  mid: string;
  midWarm: string;
  light: string;
  hl: string;
}

const PAL_LIT: RockPalette = {
  outline: '#241409',
  crevice: '#38200f',
  deep: '#4f3018',
  dark: '#6e4928',
  mid: '#8f6239',
  midWarm: '#9d6d41',
  light: '#be8e5c',
  hl: '#e3be8c',
};

const PAL_SHADE: RockPalette = {
  outline: '#1d1007',
  crevice: '#2d1a0c',
  deep: '#3f2612',
  dark: '#59391f',
  mid: '#754e2d',
  midWarm: '#805734',
  light: '#9c6e45',
  hl: '#bd9266',
};

const PAL_WET: RockPalette = {
  outline: '#111923',
  crevice: '#1c2836',
  deep: '#263648',
  dark: '#344960',
  mid: '#455f7a',
  midWarm: '#4d6a87',
  light: '#6485a3',
  hl: '#8cb0cc',
};

interface CliffPrep {
  map: TownMap;
  w: number;
  h: number;
  cliff: Uint8Array;
  stairs: Uint8Array;
  ledge: Uint8Array;
  baseElev: Int8Array;
  elev: Int8Array;
  mode: Uint8Array;
  dir: Int8Array;
  row: Uint8Array;
  faceHeight: Uint8Array;
  lowN: Uint8Array;
  lowS: Uint8Array;
  lowW: Uint8Array;
  lowE: Uint8Array;
}

let prep: CliffPrep | null = null;

function hh(a: number, b: number): number {
  let n = (Math.imul(a, 374761393) + Math.imul(b, 668265263)) | 0;
  n = Math.imul(n ^ (n >>> 13), 1274126177);
  return (n ^ (n >>> 16)) >>> 0;
}

/** Elevation-tinted meadow green so Tier 1 & Tier 2 plateaus pop visually. */
export function getPlateauGrassColor(elevLevel: number, x: number, y: number): string {
  const isAlt = (x + y) % 2 === 0;
  if (elevLevel >= 3) return isAlt ? '#75c44e' : '#6ab743';
  if (elevLevel === 2) return isAlt ? '#6ebc48' : '#63b03e';
  return isAlt ? '#67b346' : '#5da83e';
}

export function getTownElevationAt(map: TownMap | null, x: number, y: number): number {
  const P = ensurePrep(map);
  if (!P || x < 0 || y < 0 || x >= P.w || y >= P.h) return 1;
  return P.baseElev[y * P.w + x];
}

/** Recomputes cliff classification for `map` + active `townConfig` overrides. */
export function prepareTownCliffs(map: TownMap): void {
  const { w, h } = map;
  const N = w * h;
  const cliff = new Uint8Array(N);
  const stairs = new Uint8Array(N);
  const ledge = new Uint8Array(N);

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = y * w + x;
      const ov = townConfig.getTileOverride(x, y);
      const g = map.ground[i];
      if (ov) {
        cliff[i] = ov === 'cliff' ? 1 : 0;
        stairs[i] = ov === 'cliff_stairs' ? 1 : 0;
        ledge[i] = ov === 'ledge' ? 1 : 0;
      } else {
        cliff[i] = g === Tile.CLIFF || g === Tile.WATERFALL ? 1 : 0;
        stairs[i] = g === Tile.CLIFF_STAIRS ? 1 : 0;
        ledge[i] = g === Tile.LEDGE ? 1 : 0;
      }
    }
  }

  const baseElev = computeTownElevation(w, h, map.ground);
  const elev = Int8Array.from(baseElev);

  // Cliff tiles inherit the raised plateau elevation; freestanding outcrops rise +1 above flat ground!
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = y * w + x;
      if (!cliff[i]) continue;
      let hi = -99;
      let lo = 99;
      for (let dy = -3; dy <= 3; dy++) {
        for (let dx = -3; dx <= 3; dx++) {
          const nx = x + dx;
          const ny = y + dy;
          if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
          const j = ny * w + nx;
          if (cliff[j] || stairs[j]) continue;
          if (baseElev[j] > hi) hi = baseElev[j];
          if (baseElev[j] < lo) lo = baseElev[j];
        }
      }
      if (hi < -50) {
        elev[i] = 2;
      } else if (hi === lo) {
        // Freestanding rock outcrop or custom editor cliff painted on flat terrain!
        elev[i] = hi + 1;
      } else {
        elev[i] = hi;
      }
    }
  }

  const scan = (x: number, y: number, dx: number, dy: number, self: number): number => {
    let d = 0;
    let cx = x + dx;
    let cy = y + dy;
    while (cx >= 0 && cy >= 0 && cx < w && cy < h) {
      const j = cy * w + cx;
      if (cliff[j]) {
        d++;
        if (d > 40) return FAR;
        cx += dx;
        cy += dy;
        continue;
      }
      if (stairs[j]) return FAR;
      return elev[j] < self ? d : FAR;
    }
    return FAR;
  };

  const mode = new Uint8Array(N);
  const dir = new Int8Array(N);
  const row = new Uint8Array(N);
  const faceHeight = new Uint8Array(N).fill(1);
  const lowN = new Uint8Array(N).fill(FAR);
  const lowS = new Uint8Array(N).fill(FAR);
  const lowW = new Uint8Array(N).fill(FAR);
  const lowE = new Uint8Array(N).fill(FAR);
  const cliffAt = (x: number, y: number) =>
    x >= 0 && y >= 0 && x < w && y < h && cliff[y * w + x] === 1;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = y * w + x;
      if (!cliff[i]) continue;
      const self = elev[i];
      const lS = scan(x, y, 0, 1, self);
      const lN = scan(x, y, 0, -1, self);
      const lW = scan(x, y, -1, 0, self);
      const lE = scan(x, y, 1, 0, self);
      lowS[i] = lS;
      lowN[i] = lN;
      lowW[i] = lW;
      lowE[i] = lE;

      if (lS <= 3 && (lS === 0 || cliffAt(x, y + 1))) {
        mode[i] = M_FACE;
        row[i] = lS;
      } else if (Math.min(lW, lE) <= 1) {
        const dd = lW <= lE ? -1 : 1;
        dir[i] = dd;
        const dist = Math.min(lW, lE);
        mode[i] = dist === 0 ? (cliffAt(x - dd, y) ? M_OUTER : M_SINGLE) : M_INNER;
      } else if (lN === 0) {
        mode[i] = M_RIM;
      } else if (lN <= 2) {
        mode[i] = M_TOP;
      } else {
        mode[i] = M_FACE;
        row[i] = 0;
      }
    }
  }

  // Compute total vertical stack height for every M_FACE column so mid-wall strata ledges align cleanly
  for (let x = 0; x < w; x++) {
    let y = 0;
    while (y < h) {
      if (mode[y * w + x] !== M_FACE) {
        y++;
        continue;
      }
      let yEnd = y;
      while (yEnd + 1 < h && mode[(yEnd + 1) * w + x] === M_FACE) yEnd++;
      const stackH = yEnd - y + 1;
      for (let yy = y; yy <= yEnd; yy++) {
        faceHeight[yy * w + x] = stackH;
      }
      y = yEnd + 1;
    }
  }

  prep = {
    map,
    w,
    h,
    cliff,
    stairs,
    ledge,
    baseElev,
    elev,
    mode,
    dir,
    row,
    faceHeight,
    lowN,
    lowS,
    lowW,
    lowE,
  };
}

function ensurePrep(map: TownMap | null): CliffPrep | null {
  if (map && (!prep || prep.map !== map)) prepareTownCliffs(map);
  return prep;
}

function cliffAtP(P: CliffPrep, x: number, y: number): boolean {
  return x >= 0 && y >= 0 && x < P.w && y < P.h && P.cliff[y * P.w + x] === 1;
}

function stairsAtP(P: CliffPrep, x: number, y: number): boolean {
  return x >= 0 && y >= 0 && x < P.w && y < P.h && P.stairs[y * P.w + x] === 1;
}

// ───────────────────────── Craggy Pokémon Rock Primitives ─────────────────────────

/**
 * Draws seamless world-aligned Sinnoh/Unova craggy rock facets (vertical polygonal columns +
 * stepped horizontal strata shelves, NOT flat brick masonry!).
 */
function drawCraggyRockRegion(
  ctx: CanvasRenderingContext2D,
  clipX: number,
  clipY: number,
  clipW: number,
  clipH: number,
  pal: RockPalette,
  verticalFlank: boolean
) {
  if (clipW <= 0 || clipH <= 0) return;
  ctx.save();
  ctx.beginPath();
  ctx.rect(clipX, clipY, clipW, clipH);
  ctx.clip();

  // Base mid-tone sienna rock
  ctx.fillStyle = pal.mid;
  ctx.fillRect(clipX, clipY, clipW, clipH);

  if (!verticalFlank) {
    // Tall craggy vertical rock columns (width 8px in world space, staggered heights 12px)
    const COL_W = 8;
    const BAND_H = 12;
    const b0 = Math.floor(clipY / BAND_H) - 1;
    const b1 = Math.floor((clipY + clipH) / BAND_H) + 1;

    for (let b = b0; b <= b1; b++) {
      const by = b * BAND_H;
      const xShift = (hh(b, 31) % 4) * 2;
      const c0 = Math.floor((clipX + xShift) / COL_W) - 1;
      const c1 = Math.floor((clipX + clipW + xShift) / COL_W) + 1;

      for (let c = c0; c <= c1; c++) {
        const hsh = hh(c, b);
        const cx = c * COL_W - xShift;
        const jitterY = (hsh % 3) - 1;
        const fy = by + jitterY;
        const fw = COL_W;
        const fh = BAND_H;

        // Column body tone variation
        ctx.fillStyle = hsh % 3 === 0 ? pal.midWarm : hsh % 3 === 1 ? pal.mid : pal.dark;
        ctx.fillRect(cx + 1, fy + 1, fw - 1, fh - 1);

        // Sunlit angled top-left facet (signature Pokémon 3D crag look!)
        ctx.fillStyle = pal.light;
        ctx.fillRect(cx + 1, fy + 1, fw - 2, 2);
        ctx.fillRect(cx + 1, fy + 3, 2, fh - 5);
        ctx.fillStyle = pal.hl;
        ctx.fillRect(cx + 2, fy + 1, Math.max(2, fw - 4), 1);
        ctx.fillRect(cx + 1, fy + 2, 1, 2);

        // Deep right & bottom rock shadow bevel
        ctx.fillStyle = pal.dark;
        ctx.fillRect(cx + fw - 2, fy + 2, 1, fh - 3);
        ctx.fillRect(cx + 2, fy + fh - 2, fw - 3, 1);

        // Craggy vertical fissure & stepped strata shelf
        ctx.fillStyle = pal.crevice;
        ctx.fillRect(cx, fy + 1, 1, fh - 2);
        ctx.fillRect(cx + 1, fy + fh - 1, fw - 1, 1);

        // Occasional diagonal rock crack or moss cushion
        if (hsh % 5 === 0) {
          ctx.fillStyle = pal.deep;
          ctx.fillRect(cx + 4, fy + 4, 1, 4);
          ctx.fillRect(cx + 5, fy + 7, 1, 3);
        } else if (hsh % 11 === 0) {
          ctx.fillStyle = '#4d8f2e';
          ctx.fillRect(cx + 2, fy + 1, 3, 2);
          ctx.fillStyle = '#78c952';
          ctx.fillRect(cx + 3, fy + 1, 2, 1);
        }
      }
    }
  } else {
    // Side flank rock strata: stepped overlapping cliff ribs going down the wall
    const RIB_H = 9;
    const r0 = Math.floor(clipY / RIB_H) - 1;
    const r1 = Math.floor((clipY + clipH) / RIB_H) + 1;
    for (let r = r0; r <= r1; r++) {
      const ry = r * RIB_H;
      const hsh = hh(r, 71);
      ctx.fillStyle = hsh % 2 === 0 ? pal.mid : pal.midWarm;
      ctx.fillRect(clipX, ry + 1, clipW, RIB_H - 2);

      // Sunlit upper shelf on each rib
      ctx.fillStyle = pal.light;
      ctx.fillRect(clipX + 1, ry + 1, Math.max(1, clipW - 2), 2);
      ctx.fillStyle = pal.hl;
      ctx.fillRect(clipX + 2, ry + 1, Math.max(1, clipW - 5), 1);

      // Deep horizontal strata shadow between ribs
      ctx.fillStyle = pal.dark;
      ctx.fillRect(clipX, ry + RIB_H - 2, clipW, 1);
      ctx.fillStyle = pal.crevice;
      ctx.fillRect(clipX, ry + RIB_H - 1, clipW, 1);

      // Vertical split inside rib
      const splitX = clipX + 4 + (hsh % Math.max(2, clipW - 6));
      ctx.fillStyle = pal.deep;
      ctx.fillRect(splitX, ry + 2, 1, RIB_H - 3);
    }
  }

  ctx.restore();
}

/** Thick Sinnoh-style overhanging plateau grass lip at the top of a front rock face. */
function drawTopLip(
  ctx: CanvasRenderingContext2D,
  px: number,
  py: number,
  x: number,
  y: number,
  x0: number,
  w: number,
  elevLevel: number
) {
  const g = getPlateauGrassColor(elevLevel, x, y);
  // Deep overhang shadow cast onto the rock wall directly below the turf crown
  ctx.fillStyle = 'rgba(20, 10, 3, 0.58)';
  ctx.fillRect(px + x0, py + 5, w, 3);

  // Plateau meadow turf body
  ctx.fillStyle = g;
  ctx.fillRect(px + x0, py, w, 5);

  // Sunlit bright rim along the cliff brow
  ctx.fillStyle = '#92e665';
  ctx.fillRect(px + x0, py + 3, w, 1);

  // Scalloped overhanging turf teeth + crisp dark outline under the lip!
  for (let i = 0; i < w; i += 4) {
    const drop = 1 + (hh(x * 16 + x0 + i, y) % 2);
    const segW = Math.min(4, w - i);
    ctx.fillStyle = '#529e34';
    ctx.fillRect(px + x0 + i, py + 4, segW, drop);
    ctx.fillStyle = '#244a17';
    ctx.fillRect(px + x0 + i, py + 4 + drop, segW, 1);
  }
}

/** Sunlit stone & turf rim at the north back edge of a plateau seen from above. */
function drawRimTop(
  ctx: CanvasRenderingContext2D,
  px: number,
  py: number,
  x: number,
  y: number,
  x0: number,
  w: number,
  pal: RockPalette,
  elevLevel: number
) {
  // Crisp dark outer cliff brow line against lower ground to the north
  ctx.fillStyle = pal.outline;
  ctx.fillRect(px + x0, py, w, 1);
  // Sunlit stone brow
  ctx.fillStyle = pal.hl;
  ctx.fillRect(px + x0, py + 1, w, 2);
  ctx.fillStyle = pal.light;
  ctx.fillRect(px + x0, py + 3, w, 2);
  ctx.fillStyle = '#356922';
  ctx.fillRect(px + x0, py + 5, w, 1);

  // Plateau grass creeping up over the stone brow
  const g = getPlateauGrassColor(elevLevel, x, y);
  ctx.fillStyle = g;
  for (let i = 0; i < w; i += 4) {
    const hsh = hh(x * 16 + i, y);
    ctx.fillRect(px + x0 + i + (hsh % 2), py + 4, 2, 2);
  }
}

// ───────────────────────── Tile Renderers ─────────────────────────

function renderFace(
  ctx: CanvasRenderingContext2D,
  P: CliffPrep,
  px: number,
  py: number,
  x: number,
  y: number
) {
  const i = y * P.w + x;
  const r = P.row[i];
  const stackH = P.faceHeight[i];
  const elevLevel = P.elev[i];

  // If r === 0 (bottom of cliff face), pre-fill bottom 3px with lower ground color so scalloped boulder toes sit naturally on the ground!
  if (r === 0 && y + 1 < P.h) {
    const belowTile = P.map.ground[(y + 1) * P.w + x];
    const belowElev = P.baseElev[(y + 1) * P.w + x];
    ctx.fillStyle =
      belowTile === Tile.WATER || belowTile === Tile.SHALLOW_WATER
        ? '#1e6498'
        : belowTile === Tile.SAND
          ? '#ecd18e'
          : belowTile === Tile.PATH
            ? '#dfd5c5'
            : getPlateauGrassColor(belowElev, x, y + 1);
    ctx.fillRect(px, py + 12, TILE_SIZE, 4);
  }

  drawCraggyRockRegion(ctx, px, py, TILE_SIZE, r === 0 ? 14 : TILE_SIZE, PAL_LIT, false);

  // Mid-cliff horizontal strata terrace ledge between upper & lower rock tiers!
  if (r > 0 && stackH >= 2) {
    ctx.fillStyle = PAL_LIT.crevice;
    ctx.fillRect(px, py + 14, TILE_SIZE, 1);
    ctx.fillStyle = PAL_LIT.hl;
    ctx.fillRect(px + 1, py + 15, TILE_SIZE - 2, 1);
  }

  if (r === 0) {
    // Grounded ambient shading & craggy scalloped boulder toes at bottom of wall!
    ctx.fillStyle = 'rgba(24, 12, 4, 0.22)';
    ctx.fillRect(px, py + 9, TILE_SIZE, 5);

    for (let k = 0; k < TILE_SIZE; k += 4) {
      const toeDrop = hh(x * 16 + k, y * 7) % 3; // 0..2px scalloped rock toe
      const botY = py + 13 + toeDrop;
      ctx.fillStyle = PAL_LIT.dark;
      ctx.fillRect(px + k, py + 12, 4, toeDrop + 1);
      ctx.fillStyle = PAL_LIT.outline;
      ctx.fillRect(px + k, botY, 4, 1);
    }
  }

  // Overhanging plateau grass crown at the top row of the cliff face
  const nCliff = cliffAtP(P, x, y - 1);
  const nIdx = (y - 1) * P.w + x;
  const nMode = y > 0 ? P.mode[nIdx] : 0;
  if (!nCliff || nMode === M_INNER || nMode === M_RIM || nMode === M_TOP) {
    drawTopLip(ctx, px, py, x, y, 0, TILE_SIZE, elevLevel);
  } else if (nMode === M_SINGLE) {
    if (P.dir[nIdx] === -1) drawTopLip(ctx, px, py, x, y, 8, 8, elevLevel);
    else drawTopLip(ctx, px, py, x, y, 0, 8, elevLevel);
  }

  // Crisp outer left/right corner silhouettes when bordering lower ground
  if (P.lowW[i] === 0) {
    ctx.fillStyle = PAL_LIT.outline;
    ctx.fillRect(px, py, 1, TILE_SIZE);
    ctx.fillStyle = PAL_LIT.hl;
    ctx.fillRect(px + 1, py + 2, 2, TILE_SIZE - 4);
  }
  if (P.lowE[i] === 0) {
    ctx.fillStyle = 'rgba(18, 9, 2, 0.34)';
    ctx.fillRect(px + 11, py, 4, TILE_SIZE);
    ctx.fillStyle = PAL_LIT.outline;
    ctx.fillRect(px + 15, py, 1, TILE_SIZE);
  }
}

function drawOuterSilhouette(
  ctx: CanvasRenderingContext2D,
  px: number,
  py: number,
  x: number,
  y: number,
  dir: number,
  pal: RockPalette
) {
  for (let j = 0; j < TILE_SIZE; j += 4) {
    const indent = hh(x * 3, y * 16 + j) % 2;
    const lowerGrass = getPlateauGrassColor(1, x + dir, y);
    if (indent > 0) {
      ctx.fillStyle = lowerGrass;
      ctx.fillRect(dir === -1 ? px : px + TILE_SIZE - indent, py + j, indent, 4);
    }
    ctx.fillStyle = pal.outline;
    ctx.fillRect(dir === -1 ? px + indent : px + TILE_SIZE - 1 - indent, py + j, 1, 4);
    if (dir === -1) {
      ctx.fillStyle = pal.hl;
      ctx.fillRect(px + indent + 1, py + j, 1, 3);
    }
  }
}

function drawSideRim(
  ctx: CanvasRenderingContext2D,
  px: number,
  py: number,
  x: number,
  y: number,
  edgeX: number,
  dir: number,
  pal: RockPalette,
  elevLevel: number
) {
  const g = getPlateauGrassColor(elevLevel, x, y);
  const rimX = dir === -1 ? edgeX : edgeX - 4;

  // Stone curb + dark undercut lip along side of plateau
  ctx.fillStyle = pal.outline;
  ctx.fillRect(dir === -1 ? rimX : rimX + 3, py, 1, TILE_SIZE);
  ctx.fillStyle = dir === -1 ? pal.hl : pal.light;
  ctx.fillRect(rimX + 1, py, 2, TILE_SIZE);

  // Scalloped grass tufts overhanging side rim
  for (let j = 0; j < TILE_SIZE; j += 4) {
    const tuft = 1 + (hh(x * 7 + j, y) % 2);
    ctx.fillStyle = '#8ee262';
    ctx.fillRect(dir === -1 ? rimX + 2 : rimX + 1, py + j, 1, 3);
    ctx.fillStyle = g;
    ctx.fillRect(dir === -1 ? rimX + 4 - tuft : rimX, py + j, tuft, 3);
  }
}

function renderOuter(
  ctx: CanvasRenderingContext2D,
  P: CliffPrep,
  px: number,
  py: number,
  x: number,
  y: number
) {
  const i = y * P.w + x;
  const dir = P.dir[i];
  const pal = dir === -1 ? PAL_LIT : PAL_SHADE;
  drawCraggyRockRegion(ctx, px, py, TILE_SIZE, TILE_SIZE, pal, true);
  drawOuterSilhouette(ctx, px, py, x, y, dir, pal);

  // Undercut shadow cast by the inner plateau rim onto the upper edge of the flank!
  ctx.fillStyle = 'rgba(20, 10, 2, 0.38)';
  ctx.fillRect(dir === -1 ? px + 13 : px, py, 3, TILE_SIZE);

  if (P.lowN[i] === 0) drawRimTop(ctx, px, py, x, y, 0, TILE_SIZE, pal, P.elev[i]);
}

function renderInner(
  ctx: CanvasRenderingContext2D,
  P: CliffPrep,
  px: number,
  py: number,
  x: number,
  y: number
) {
  const i = y * P.w + x;
  const dir = P.dir[i];
  const pal = dir === -1 ? PAL_LIT : PAL_SHADE;
  ctx.fillStyle = getPlateauGrassColor(P.elev[i], x, y);
  ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
  drawSideRim(ctx, px, py, x, y, dir === -1 ? px : px + TILE_SIZE, dir, pal, P.elev[i]);
  if (P.lowN[i] === 0) drawRimTop(ctx, px, py, x, y, 0, TILE_SIZE, pal, P.elev[i]);
}

function renderSingle(
  ctx: CanvasRenderingContext2D,
  P: CliffPrep,
  px: number,
  py: number,
  x: number,
  y: number
) {
  const i = y * P.w + x;
  const dir = P.dir[i];
  const pal = dir === -1 ? PAL_LIT : PAL_SHADE;
  ctx.fillStyle = getPlateauGrassColor(P.elev[i], x, y);
  ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
  const rockX = dir === -1 ? px : px + 8;
  drawCraggyRockRegion(ctx, rockX, py, 8, TILE_SIZE, pal, true);
  drawOuterSilhouette(ctx, px, py, x, y, dir, pal);
  drawSideRim(ctx, px, py, x, y, px + 8, dir, pal, P.elev[i]);
  if (P.lowN[i] === 0) drawRimTop(ctx, px, py, x, y, 0, TILE_SIZE, pal, P.elev[i]);
}

function renderRim(
  ctx: CanvasRenderingContext2D,
  P: CliffPrep,
  px: number,
  py: number,
  x: number,
  y: number
) {
  const i = y * P.w + x;
  ctx.fillStyle = getPlateauGrassColor(P.elev[i], x, y);
  ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
  drawRimTop(ctx, px, py, x, y, 0, TILE_SIZE, PAL_LIT, P.elev[i]);
  if (P.lowW[i] === 0) {
    ctx.fillStyle = PAL_LIT.outline;
    ctx.fillRect(px, py, 1, TILE_SIZE);
  }
  if (P.lowE[i] === 0) {
    ctx.fillStyle = PAL_SHADE.outline;
    ctx.fillRect(px + 15, py, 1, TILE_SIZE);
  }
}

function renderFallbackFace(
  ctx: CanvasRenderingContext2D,
  px: number,
  py: number,
  x: number,
  y: number
) {
  drawCraggyRockRegion(ctx, px, py, TILE_SIZE, TILE_SIZE, PAL_LIT, false);
  drawTopLip(ctx, px, py, x, y, 0, TILE_SIZE, 2);
  ctx.fillStyle = PAL_LIT.outline;
  ctx.fillRect(px, py + 15, TILE_SIZE, 1);
}

export function renderCliffTileV2(
  ctx: CanvasRenderingContext2D,
  map: TownMap | null,
  px: number,
  py: number,
  x: number,
  y: number
) {
  const P = ensurePrep(map);
  if (!P || x < 0 || y < 0 || x >= P.w || y >= P.h || !P.cliff[y * P.w + x]) {
    renderFallbackFace(ctx, px, py, x, y);
    return;
  }
  switch (P.mode[y * P.w + x]) {
    case M_OUTER:
      renderOuter(ctx, P, px, py, x, y);
      break;
    case M_INNER:
      renderInner(ctx, P, px, py, x, y);
      break;
    case M_SINGLE:
      renderSingle(ctx, P, px, py, x, y);
      break;
    case M_RIM:
      renderRim(ctx, P, px, py, x, y);
      break;
    case M_TOP:
      ctx.fillStyle = getPlateauGrassColor(P.elev[y * P.w + x], x, y);
      ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
      break;
    default:
      renderFace(ctx, P, px, py, x, y);
  }
}

export function renderCliffStairsTileV2(
  ctx: CanvasRenderingContext2D,
  px: number,
  py: number,
  x: number,
  y: number
) {
  const P = prep;
  const isSt = (xx: number, yy: number) => (P ? stairsAtP(P, xx, yy) : false);
  const isCl = (xx: number, yy: number) => (P ? cliffAtP(P, xx, yy) : false);

  let lx = x;
  while (isSt(lx - 1, y)) lx--;
  let rx = x;
  while (isSt(rx + 1, y)) rx++;
  const verticalTravel = !P || isCl(lx - 1, y) || isCl(rx + 1, y);

  ctx.fillStyle = '#8c8272';
  ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);

  if (verticalTravel) {
    for (let s = 0; s < 4; s++) {
      const sy = py + s * 4;
      ctx.fillStyle = '#f2ead9';
      ctx.fillRect(px, sy, TILE_SIZE, 2);
      ctx.fillStyle = '#c9beaa';
      ctx.fillRect(px, sy + 2, TILE_SIZE, 1);
      ctx.fillStyle = '#5c5245';
      ctx.fillRect(px, sy + 3, TILE_SIZE, 1);
    }
    if (isCl(x - 1, y)) {
      drawCraggyRockRegion(ctx, px, py, 3, TILE_SIZE, PAL_LIT, true);
      ctx.fillStyle = PAL_LIT.outline;
      ctx.fillRect(px + 3, py, 1, TILE_SIZE);
    }
    if (isCl(x + 1, y)) {
      drawCraggyRockRegion(ctx, px + 13, py, 3, TILE_SIZE, PAL_SHADE, true);
      ctx.fillStyle = PAL_SHADE.outline;
      ctx.fillRect(px + 12, py, 1, TILE_SIZE);
    }
    if (!isSt(x, y - 1) && !isCl(x, y - 1)) {
      ctx.fillStyle = '#faf5ea';
      ctx.fillRect(px, py, TILE_SIZE, 1);
    }
  } else {
    for (let s = 0; s < 4; s++) {
      const sx = px + s * 4;
      ctx.fillStyle = '#f2ead9';
      ctx.fillRect(sx, py, 2, TILE_SIZE);
      ctx.fillStyle = '#c9beaa';
      ctx.fillRect(sx + 2, py, 1, TILE_SIZE);
      ctx.fillStyle = '#5c5245';
      ctx.fillRect(sx + 3, py, 1, TILE_SIZE);
    }
    if (isCl(x, y - 1)) {
      drawCraggyRockRegion(ctx, px, py, TILE_SIZE, 3, PAL_LIT, false);
      ctx.fillStyle = PAL_LIT.outline;
      ctx.fillRect(px, py + 3, TILE_SIZE, 1);
    }
    if (isCl(x, y + 1)) {
      drawCraggyRockRegion(ctx, px, py + 13, TILE_SIZE, 3, PAL_SHADE, false);
      ctx.fillStyle = PAL_SHADE.outline;
      ctx.fillRect(px, py + 12, TILE_SIZE, 1);
    }
  }
}

export function renderWaterfallTileV2(
  ctx: CanvasRenderingContext2D,
  px: number,
  py: number,
  x: number,
  y: number
) {
  const P = prep;
  const wfAt = (xx: number, yy: number) =>
    !!P &&
    xx >= 0 &&
    yy >= 0 &&
    xx < P.w &&
    yy < P.h &&
    P.map.ground[yy * P.w + xx] === Tile.WATERFALL;
  const isCl = (xx: number, yy: number) => (P ? cliffAtP(P, xx, yy) : false);

  drawCraggyRockRegion(ctx, px, py, TILE_SIZE, TILE_SIZE, PAL_WET, false);

  const leftEdge = !wfAt(x - 1, y);
  const rightEdge = !wfAt(x + 1, y);
  const x0 = leftEdge ? 3 : 0;
  const x1 = rightEdge ? 13 : 16;

  // Wet dark slate buttress rim framing the waterfall chute
  if (leftEdge) {
    ctx.fillStyle = PAL_WET.outline;
    ctx.fillRect(px + 2, py, 1, TILE_SIZE);
    ctx.fillStyle = PAL_WET.hl;
    ctx.fillRect(px + 1, py + 2, 1, TILE_SIZE - 4);
  }
  if (rightEdge) {
    ctx.fillStyle = PAL_WET.outline;
    ctx.fillRect(px + 13, py, 1, TILE_SIZE);
  }

  // Rushing turquoise-azure water sheet with crisp vertical foam ribbons
  ctx.fillStyle = '#1479be';
  ctx.fillRect(px + x0, py, x1 - x0, TILE_SIZE);
  for (let sx = px + x0; sx < px + x1; sx++) {
    if (sx % 4 === 0) {
      ctx.fillStyle = '#4ec3f7';
      ctx.fillRect(sx, py, 2, TILE_SIZE);
    } else if (sx % 6 === 2) {
      ctx.fillStyle = '#e0f7ff';
      ctx.fillRect(sx, py, 1, TILE_SIZE);
    }
  }

  // Spillover lip crest at top of waterfall
  if (!wfAt(x, y - 1)) {
    ctx.fillStyle = '#e0f7ff';
    ctx.fillRect(px + x0, py, x1 - x0, 3);
    ctx.fillStyle = '#ffffff';
    for (let i = x0; i < x1; i += 3) ctx.fillRect(px + i, py + 2, 2, 2);
  }
  // Boiling plunge foam at bottom of waterfall
  if (!isCl(x, y + 1)) {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(px + Math.max(0, x0 - 1), py + 12, Math.min(TILE_SIZE, x1 - x0 + 2), 4);
    ctx.fillStyle = '#bae6fd';
    for (let i = 1; i < TILE_SIZE - 1; i += 4) ctx.fillRect(px + i, py + 14, 2, 2);
  }
}

export function renderLedgeTileV2(
  ctx: CanvasRenderingContext2D,
  px: number,
  py: number,
  x: number,
  y: number
) {
  const P = prep;
  const isL = (xx: number, yy: number) =>
    !P || (xx >= 0 && yy >= 0 && xx < P.w && yy < P.h && P.ledge[yy * P.w + xx] === 1);
  const g = getPlateauGrassColor(1, x, y);
  ctx.fillStyle = g;
  ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);

  const L = !isL(x - 1, y);
  const R = !isL(x + 1, y);
  const x0 = L ? 2 : 0;
  const x1 = R ? 14 : 16;
  const wd = x1 - x0;

  // Ground drop shadow below ledge
  ctx.fillStyle = 'rgba(18, 38, 10, 0.28)';
  ctx.fillRect(px + x0, py + 13, wd, 3);

  // Sunlit grass brow + sculpted earth embankment (classic Pokémon jump ledge!)
  ctx.fillStyle = '#9be86c';
  ctx.fillRect(px + x0, py + 6, wd, 2);
  ctx.fillStyle = '#4c9632';
  ctx.fillRect(px + x0, py + 8, wd, 2);
  ctx.fillStyle = '#7d532d';
  ctx.fillRect(px + x0, py + 10, wd, 2);
  ctx.fillStyle = '#36200f';
  ctx.fillRect(px + x0, py + 12, wd, 1);

  for (let i = x0 + 1; i < x1 - 1; i += 4) {
    ctx.fillStyle = '#5eb03e';
    ctx.fillRect(px + i, py + 9, 2, 2);
  }

  // Rounded end-caps
  if (L) {
    ctx.fillStyle = '#36200f';
    ctx.fillRect(px + 1, py + 8, 1, 4);
  }
  if (R) {
    ctx.fillStyle = '#36200f';
    ctx.fillRect(px + 14, py + 8, 1, 4);
  }
}

/**
 * Second pass (after roads & custom tile overrides are painted): casts soft 3D cliff
 * shadows and occasional fallen talus pebbles onto lower ground below & east of cliffs.
 */
export function renderCliffCastShadows(ctx: CanvasRenderingContext2D, map: TownMap) {
  const P = ensurePrep(map);
  if (!P) return;
  for (let y = 0; y < P.h; y++) {
    for (let x = 0; x < P.w; x++) {
      const i = y * P.w + x;
      if (!P.cliff[i] || P.map.ground[i] === Tile.WATERFALL) continue;
      const px = x * TILE_SIZE;
      const py = y * TILE_SIZE;
      const m = P.mode[i];

      if (
        m === M_FACE &&
        P.row[i] === 0 &&
        y + 1 < P.h &&
        !P.cliff[i + P.w] &&
        !P.stairs[i + P.w]
      ) {
        const by = py + TILE_SIZE;
        ctx.fillStyle = 'rgba(16, 26, 12, 0.30)';
        ctx.fillRect(px, by, TILE_SIZE, 4);
        ctx.fillStyle = 'rgba(16, 26, 12, 0.14)';
        ctx.fillRect(px, by + 4, TILE_SIZE, 3);

        const hsh = hh(x * 3, y * 5);
        const below = P.map.ground[i + P.w];
        if (
          hsh % 4 === 0 &&
          (below === Tile.GRASS || below === Tile.SAND) &&
          !townConfig.getTileOverride(x, y + 1)
        ) {
          const rx = px + 3 + (hsh % 9);
          ctx.fillStyle = '#3a2210';
          ctx.fillRect(rx, by + 2, 4, 3);
          ctx.fillStyle = '#9c6e44';
          ctx.fillRect(rx + 1, by + 2, 2, 2);
          ctx.fillStyle = '#d9b282';
          ctx.fillRect(rx + 1, by + 2, 1, 1);
        }
      }

      const castsEast =
        ((m === M_OUTER || m === M_SINGLE) && P.dir[i] === 1) ||
        (m === M_FACE && P.lowE[i] === 0);
      if (castsEast && x + 1 < P.w && !P.cliff[i + 1] && !P.stairs[i + 1]) {
        ctx.fillStyle = 'rgba(16, 26, 12, 0.25)';
        ctx.fillRect(px + TILE_SIZE, py, 3, TILE_SIZE);
        ctx.fillStyle = 'rgba(16, 26, 12, 0.11)';
        ctx.fillRect(px + TILE_SIZE + 3, py, 2, TILE_SIZE);
      }
    }
  }
}
