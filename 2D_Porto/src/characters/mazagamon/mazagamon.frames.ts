import type { FrameRect } from '../_shared/types';

/**
 * Pure pixel-coordinate tables for all 4 Mazagamon source sheets.
 * Data only — zero Canvas or engine imports. Edit only these numbers if assets change.
 */

// ── 1. idle.png (344x192, 4x2 grid inside 1px dark box borders) ───────────
const IDLE_COLS: readonly [number, number][] = [
  [4, 98],
  [106, 72],
  [182, 75],
  [261, 78],
];
const IDLE_ROWS: readonly [number, number][] = [
  [17, 73],
  [104, 75],
];

// Sheet order is Row0=[N, NE, E, SE], Row1=[S, SW, W, NW]; reorder to canonical DIRECTIONS_8
const RAW_IDLE_RECTS: readonly FrameRect[] = IDLE_ROWS.flatMap(([y, h]) =>
  IDLE_COLS.map(([x, w]) => ({ x, y, w, h }))
);

/** Ordered canonically as `DIRECTIONS_8` (`S, SW, W, NW, N, NE, E, SE`). */
export const MAZAGAMON_IDLE_RECTS: readonly FrameRect[] = [
  RAW_IDLE_RECTS[4], // S
  RAW_IDLE_RECTS[5], // SW
  RAW_IDLE_RECTS[6], // W
  RAW_IDLE_RECTS[7], // NW
  RAW_IDLE_RECTS[0], // N
  RAW_IDLE_RECTS[1], // NE
  RAW_IDLE_RECTS[2], // E
  RAW_IDLE_RECTS[3], // SE
];

// ── 2. walk-cycle.jpg (2752x1536, 4x2 high-res 8-directional sheet) ────────
const WALK_4X2_COLS: readonly [number, number][] = [
  [32, 783],
  [848, 575],
  [1456, 599],
  [2088, 631],
];

const WALK_ROWS: readonly [number, number][] = [
  [136, 591],
  [832, 607],
];

const RAW_WALK_RECTS: readonly FrameRect[] = WALK_ROWS.flatMap(([y, h]) =>
  WALK_4X2_COLS.map(([x, w]) => ({ x, y, w, h }))
);

/** Ordered canonically as `DIRECTIONS_8` (`S, SW, W, NW, N, NE, E, SE`). */
export const MAZAGAMON_WALK_RECTS: readonly FrameRect[] = [
  RAW_WALK_RECTS[4], // S
  RAW_WALK_RECTS[5], // SW
  RAW_WALK_RECTS[6], // W
  RAW_WALK_RECTS[7], // NW
  RAW_WALK_RECTS[0], // N
  RAW_WALK_RECTS[1], // NE
  RAW_WALK_RECTS[2], // E
  RAW_WALK_RECTS[3], // SE
];

// ── 3. battle.jpg (2752x835, 4x2 battle attack poses) ──────────────────────
const BATTLE_4X2_COLS: readonly [number, number][] = [
  [33, 781],
  [848, 575],
  [1457, 598],
  [2088, 630],
];

const BATTLE_ROWS: readonly [number, number][] = [
  [28, 384],
  [449, 373],
];

export const MAZAGAMON_BATTLE_RECTS: readonly FrameRect[] = BATTLE_ROWS.flatMap(([y, h]) =>
  BATTLE_4X2_COLS.map(([x, w]) => ({ x, y, w, h }))
);

// ── 4. mazagamon.jpg (2400x1792: icon + 8 HD portraits + 7 bottom thumbs) ─
export const MAZAGAMON_JPG_ICON_RECT: FrameRect = {
  x: 16,
  y: 6,
  w: 192,
  h: 198,
};

/** 8 HD portraits ordered canonically as `DIRECTIONS_8` (`S, SW, W, NW, N, NE, E, SE`). */
export const MAZAGAMON_JPG_HD_RECTS: readonly FrameRect[] = [
  { x: 5, y: 945, w: 755, h: 625 }, // S
  { x: 755, y: 945, w: 608, h: 625 }, // SW
  { x: 1363, y: 945, w: 426, h: 625 }, // W
  { x: 1789, y: 945, w: 576, h: 625 }, // NW
  { x: 10, y: 212, w: 805, h: 622 }, // N
  { x: 780, y: 212, w: 580, h: 622 }, // NE
  { x: 1350, y: 212, w: 455, h: 622 }, // E
  { x: 1795, y: 212, w: 590, h: 622 }, // SE
];

const MINI_SPANS: readonly [number, number][] = [
  [622, 190],
  [820, 190],
  [1018, 180],
  [1222, 160],
  [1402, 165],
  [1610, 155],
  [1792, 170],
];

export const MAZAGAMON_JPG_MINI_RECTS: readonly FrameRect[] = MINI_SPANS.map(([x, w]) => ({
  x,
  y: 1642,
  w,
  h: 148,
}));
