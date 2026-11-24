import type { Direction8, FrameRect } from '../_shared/types';

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

// ── 2. walk-cycle.jpg (1024x1024, generated 4x4 bipedal stride sheet) ───────
// Torso-aligned uniform-height cell rects per row so `trim: 'uniform'` stays rock-steady.
const WALK_CELLS: readonly (readonly FrameRect[])[] = [
  // Row 0: S (front) — exact seam splits at x=272, 513, 778
  [
    { x: 0, y: 24, w: 272, h: 230 },
    { x: 273, y: 24, w: 240, h: 230 },
    { x: 514, y: 24, w: 264, h: 230 },
    { x: 779, y: 24, w: 245, h: 230 },
  ],
  // Row 1: W (left) — 100% isolated by green gutters; torsos aligned at relX=134.8
  [
    { x: 12, y: 266, w: 240, h: 244 },
    { x: 278, y: 266, w: 240, h: 244 },
    { x: 526, y: 266, w: 240, h: 244 },
    { x: 782, y: 266, w: 240, h: 244 },
  ],
  // Row 2: N (C0/C2 straight North) & NE/NW (C1/C3 3/4 back-right)
  [
    { x: 0, y: 540, w: 274, h: 215 },
    { x: 275, y: 540, w: 237, h: 215 },
    { x: 511, y: 540, w: 265, h: 215 },
    { x: 776, y: 540, w: 248, h: 215 },
  ],
  // Row 3: E (right) — 100% isolated by green gutters; torsos aligned at relX=114.7
  [
    { x: 10, y: 775, w: 260, h: 249 },
    { x: 263, y: 775, w: 260, h: 249 },
    { x: 526, y: 775, w: 260, h: 249 },
    { x: 768, y: 775, w: 256, h: 249 },
  ],
];

export const walkCell = (row: number, col: number): FrameRect => WALK_CELLS[row][col];

export interface CellStep {
  row: number;
  col: number;
  flipX?: boolean;
}

export const MAZAGAMON_WALK_STEPS_PER_DIR = 4;

/**
 * Verified 4-step bipedal walk sequences in generated `walk-cycle.jpg` (4x4):
 * - `S`: Row 0 `[c0, c1, c2, c3]` alternating knee lift & forward step.
 * - `W`/`SW`: Row 1 `[c0, c1, c2, c3]` pure left-facing 4-step stride.
 * - `N`: Row 2 `[c0, c2, c0, c2]` symmetric straight-North rear foot steps.
 * - `NE`: Row 2 `[c1, c3, c1, c3]` 3/4 back-right steps; `NW` mirrors `NE` horizontally.
 * - `E`/`SE`: Row 3 `[c0, c1, c2, c3]` pure right-facing 4-step stride.
 */
export const MAZAGAMON_WALK_STEPS_BY_DIR: Record<Direction8, readonly CellStep[]> = {
  S: [
    { row: 0, col: 0 },
    { row: 0, col: 1 },
    { row: 0, col: 2 },
    { row: 0, col: 3 },
  ],
  SW: [
    { row: 1, col: 0 },
    { row: 1, col: 1 },
    { row: 1, col: 2 },
    { row: 1, col: 3 },
  ],
  W: [
    { row: 1, col: 0 },
    { row: 1, col: 1 },
    { row: 1, col: 2 },
    { row: 1, col: 3 },
  ],
  NW: [
    { row: 2, col: 1, flipX: true },
    { row: 2, col: 3, flipX: true },
    { row: 2, col: 1, flipX: true },
    { row: 2, col: 3, flipX: true },
  ],
  N: [
    { row: 2, col: 0 },
    { row: 2, col: 2 },
    { row: 2, col: 0 },
    { row: 2, col: 2 },
  ],
  NE: [
    { row: 2, col: 1 },
    { row: 2, col: 3 },
    { row: 2, col: 1 },
    { row: 2, col: 3 },
  ],
  E: [
    { row: 3, col: 0 },
    { row: 3, col: 1 },
    { row: 3, col: 2 },
    { row: 3, col: 3 },
  ],
  SE: [
    { row: 3, col: 0 },
    { row: 3, col: 1 },
    { row: 3, col: 2 },
    { row: 3, col: 3 },
  ],
};

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
