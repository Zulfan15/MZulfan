import type { Direction8, FrameRect } from '../_shared/types';

/**
 * Pure pixel-coordinate tables for all 4 Karatiamon source sheets.
 * Data only — zero Canvas or engine imports. Edit only these numbers if assets change.
 */

// ── 1. idle.png & battle.png shared 4x8 grid (2730x1536) ───────────────────
const GRID_COLS: readonly [number, number][] = [
  [5, 675],
  [686, 675],
  [1368, 676],
  [2050, 675],
];

const GRID_ROWS: readonly [number, number][] = [
  [5, 185],    // 0: S
  [196, 185],  // 1: SW
  [387, 185],  // 2: W
  [579, 185],  // 3: NW
  [771, 185],  // 4: N
  [963, 185],  // 5: NE
  [1154, 185], // 6: E
  [1346, 184], // 7: SE
];

export const gridCell = (row: number, col: number): FrameRect => ({
  x: GRID_COLS[col][0],
  y: GRID_ROWS[row][0],
  w: GRID_COLS[col][1],
  h: GRID_ROWS[row][1],
});

// ── 1b. walk-cycle.jpg 4x4 generated bipedal stride sheet (1024x1024) ────
const WALK_CELLS: readonly (readonly FrameRect[])[] = [
  // Row 0: S (front) — torsos aligned within 0.8px (~121px from cell left)
  [
    { x: 6, y: 18, w: 252, h: 242 },
    { x: 261, y: 18, w: 252, h: 242 },
    { x: 517, y: 18, w: 252, h: 242 },
    { x: 772, y: 18, w: 252, h: 242 },
  ],
  // Row 1: mixed side frames (unused; E/W use cohesive Row 3 C1..C3)
  [
    { x: 2, y: 270, w: 248, h: 246 },
    { x: 254, y: 270, w: 250, h: 246 },
    { x: 522, y: 270, w: 247, h: 246 },
    { x: 769, y: 270, w: 250, h: 246 },
  ],
  // Row 2: N (straight back on C0, C2, C3; C1 3/4 back-right)
  [
    { x: 7, y: 523, w: 254, h: 244 },
    { x: 266, y: 523, w: 250, h: 244 },
    { x: 516, y: 523, w: 252, h: 244 },
    { x: 770, y: 523, w: 252, h: 244 },
  ],
  // Row 3: E (C1 wide stride -> C2 passing -> C3 opposite stride; torsos aligned within 1px)
  [
    { x: 6, y: 776, w: 254, h: 248 },
    { x: 262, y: 776, w: 250, h: 248 },
    { x: 518, y: 776, w: 257, h: 248 },
    { x: 775, y: 776, w: 249, h: 248 },
  ],
];

export const walkCell = (row: number, col: number): FrameRect => WALK_CELLS[row][col];

export const KARATIAMON_IDLE_STEPS_PER_DIR = 4;
export const KARATIAMON_WALK_STEPS_PER_DIR = 4;

export interface CellStep {
  row: number;
  col: number;
  flipX?: boolean;
}

const DIRECTION_STEPS: Record<Direction8, readonly CellStep[]> = {
  S: [
    { row: 0, col: 0 },
    { row: 0, col: 1 },
    { row: 0, col: 2, flipX: true },
    { row: 0, col: 3 },
  ],
  SW: [
    { row: 1, col: 1 },
    { row: 1, col: 3 },
    { row: 1, col: 1 },
    { row: 1, col: 3 },
  ],
  W: [
    { row: 2, col: 0 },
    { row: 2, col: 1 },
    { row: 2, col: 2 },
    { row: 2, col: 3 },
  ],
  NW: [
    { row: 3, col: 0 },
    { row: 3, col: 1 },
    { row: 3, col: 2 },
    { row: 3, col: 3 },
  ],
  N: [
    { row: 4, col: 1 },
    { row: 4, col: 2 },
    { row: 4, col: 3 },
    { row: 4, col: 2 },
  ],
  NE: [
    { row: 5, col: 1 },
    { row: 5, col: 3 },
    { row: 5, col: 1 },
    { row: 5, col: 3 },
  ],
  E: [
    { row: 6, col: 0 },
    { row: 6, col: 1 },
    { row: 6, col: 2 },
    { row: 6, col: 3 },
  ],
  SE: [
    { row: 7, col: 0 },
    { row: 7, col: 1 },
    { row: 7, col: 2 },
    { row: 7, col: 3 },
  ],
};

/** Verified weapon-side consistent sequences for `idle.png`. */
export const KARATIAMON_IDLE_STEPS_BY_DIR: Record<Direction8, readonly CellStep[]> =
  DIRECTION_STEPS;

/**
 * Verified 4-step bipedal walking strides in generated `walk-cycle.jpg` (4x4):
 * - `S`         : Row 0 `[c0, c1, c0, c3]` neutral -> left step -> neutral -> right step (skips right-turned `c2`).
 * - `E/NE/SE`   : Row 3 `[c1, c2, c3, c2]` right-facing 4-step stride (wide A -> pass -> wide B -> pass).
 * - `W/SW/NW`   : horizontally mirrors Row 3 `[c1, c2, c3, c2]` (`flipX: true`).
 * - `N`         : Row 2 `[c0, c2, c3, c2]` straight-North alternating rear boots (skips `c1`).
 */
export const KARATIAMON_WALK_STEPS_BY_DIR: Record<Direction8, readonly CellStep[]> = {
  S: [
    { row: 0, col: 0 },
    { row: 0, col: 1 },
    { row: 0, col: 0 },
    { row: 0, col: 3 },
  ],
  SW: [
    { row: 3, col: 1, flipX: true },
    { row: 3, col: 2, flipX: true },
    { row: 3, col: 3, flipX: true },
    { row: 3, col: 2, flipX: true },
  ],
  W: [
    { row: 3, col: 1, flipX: true },
    { row: 3, col: 2, flipX: true },
    { row: 3, col: 3, flipX: true },
    { row: 3, col: 2, flipX: true },
  ],
  NW: [
    { row: 3, col: 1, flipX: true },
    { row: 3, col: 2, flipX: true },
    { row: 3, col: 3, flipX: true },
    { row: 3, col: 2, flipX: true },
  ],
  N: [
    { row: 2, col: 0 },
    { row: 2, col: 2 },
    { row: 2, col: 3 },
    { row: 2, col: 2 },
  ],
  NE: [
    { row: 3, col: 1 },
    { row: 3, col: 2 },
    { row: 3, col: 3 },
    { row: 3, col: 2 },
  ],
  E: [
    { row: 3, col: 1 },
    { row: 3, col: 2 },
    { row: 3, col: 3 },
    { row: 3, col: 2 },
  ],
  SE: [
    { row: 3, col: 1 },
    { row: 3, col: 2 },
    { row: 3, col: 3 },
    { row: 3, col: 2 },
  ],
};

// ── 2. battle.png sequential 4-frame Violet Hex Blade combos ───────────────
export const KARATIAMON_BATTLE_COMBOS: readonly (readonly FrameRect[])[] = [
  // [0..3] South / Front: ready -> blazing violet ignition -> lunging crescent slash -> recover
  [gridCell(0, 0), gridCell(7, 1), gridCell(0, 2), gridCell(0, 3)],
  // [4..7] West (Row 2): left-facing phantom paw flame & crescent slash
  [gridCell(2, 0), gridCell(2, 1), gridCell(2, 2), gridCell(2, 3)],
  // [8..11] East (Row 6): right-facing violet broadsword cleave
  [gridCell(6, 0), gridCell(6, 1), gridCell(6, 2), gridCell(6, 3)],
];

// ── 3. karatiamon.png (2388x1792: icon + 8 HD portraits + 8 mini thumbs) ─
export const KARATIAMON_ICON_RECT: FrameRect = {
  x: 28,
  y: 14,
  w: 218,
  h: 196,
};

/** 8 HD portraits ordered canonically as `DIRECTIONS_8` (`S, SW, W, NW, N, NE, E, SE`). */
export const KARATIAMON_HD_RECTS: readonly FrameRect[] = [
  { x: 20, y: 1028, w: 580, h: 552 },   // S
  { x: 695, y: 1028, w: 485, h: 552 },  // SW
  { x: 1205, y: 1028, w: 570, h: 552 }, // W
  { x: 1790, y: 1028, w: 560, h: 552 }, // NW
  { x: 20, y: 336, w: 570, h: 550 },    // N
  { x: 635, y: 336, w: 560, h: 550 },   // NE
  { x: 1210, y: 336, w: 565, h: 550 },  // E
  { x: 1810, y: 336, w: 568, h: 550 },  // SE
];

const MINI_SPANS: readonly [number, number][] = [
  [369, 173],
  [587, 166],
  [792, 190],
  [1008, 174],
  [1206, 174],
  [1412, 173],
  [1633, 176],
  [1848, 171],
];

export const KARATIAMON_MINI_RECTS: readonly FrameRect[] = MINI_SPANS.map(([x, w]) => ({
  x,
  y: 1608,
  w,
  h: 182,
}));
