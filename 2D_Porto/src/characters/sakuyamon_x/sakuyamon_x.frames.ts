import type { Direction8, FrameRect } from '../_shared/types';

/**
 * Pure pixel-coordinate tables for all 4 Sakuyamon (X Antibody) source sheets.
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

// ── 1b. walk-cycle.jpg 4x4 generated trotting sheet (1200x896) ─────────────
const WALK_GRID_COLS: readonly [number, number][] = [
  [3, 294],
  [303, 294],
  [603, 294],
  [903, 294],
];

const WALK_GRID_ROWS: readonly [number, number][] = [
  [3, 217],   // 0: S (front)
  [226, 219], // 1: mixed W/E (unused; W mirrors Row 3)
  [451, 220], // 2: N (back)
  [676, 218], // 3: E (right, full 4-frame quadruped trot)
];

export const walkCell = (row: number, col: number): FrameRect => ({
  x: WALK_GRID_COLS[col][0],
  y: WALK_GRID_ROWS[row][0],
  w: WALK_GRID_COLS[col][1],
  h: WALK_GRID_ROWS[row][1],
});

export const SAKUYAMON_X_IDLE_STEPS_PER_DIR = 4;
export const SAKUYAMON_X_WALK_STEPS_PER_DIR = 4;

export interface CellStep {
  row: number;
  col: number;
  flipX?: boolean;
}

/**
 * Verified 4-step sequences per direction for `idle.png`.
 * In Row 4 (`N`), cols 2 & 3 pop in a stray trident tip on the right, so `N`
 * alternates cleanly between cols 0 and 1.
 */
export const SAKUYAMON_X_IDLE_STEPS_BY_DIR: Record<Direction8, readonly FrameRect[]> = {
  S: [gridCell(0, 0), gridCell(0, 1), gridCell(0, 2), gridCell(0, 3)],
  SW: [gridCell(1, 0), gridCell(1, 1), gridCell(1, 2), gridCell(1, 3)],
  W: [gridCell(2, 0), gridCell(2, 1), gridCell(2, 2), gridCell(2, 3)],
  NW: [gridCell(3, 0), gridCell(3, 1), gridCell(3, 2), gridCell(3, 3)],
  N: [gridCell(4, 0), gridCell(4, 1), gridCell(4, 0), gridCell(4, 1)],
  NE: [gridCell(5, 0), gridCell(5, 1), gridCell(5, 2), gridCell(5, 3)],
  E: [gridCell(6, 0), gridCell(6, 1), gridCell(6, 2), gridCell(6, 3)],
  SE: [gridCell(7, 0), gridCell(7, 1), gridCell(7, 2), gridCell(7, 3)],
};

/**
 * Verified 4-step trotting walk gait in generated `walk-cycle.jpg` (4x4):
 * - `S`: Row 0 `[c0, c2, c3, c1]` alternates lifted right paw & forward left paw with planted passes.
 * - `E`/`NE`/`SE`: Row 3 `[c0, c1, c2, c3]` full 4-frame quadruped trot (stride -> tuck -> stride -> push-off).
 * - `W`/`SW`/`NW`: mirrors Row 3 horizontally (Row 1 has mixed W/E poses).
 * - `N`: Row 2 `[c1, c2, c3, c2]` keeps tail & ponytail curved left while hind legs step smoothly.
 */
export const SAKUYAMON_X_WALK_STEPS_BY_DIR: Record<Direction8, readonly CellStep[]> = {
  S: [
    { row: 0, col: 0 },
    { row: 0, col: 2 },
    { row: 0, col: 3 },
    { row: 0, col: 1 },
  ],
  SW: [
    { row: 3, col: 0, flipX: true },
    { row: 3, col: 1, flipX: true },
    { row: 3, col: 2, flipX: true },
    { row: 3, col: 3, flipX: true },
  ],
  W: [
    { row: 3, col: 0, flipX: true },
    { row: 3, col: 1, flipX: true },
    { row: 3, col: 2, flipX: true },
    { row: 3, col: 3, flipX: true },
  ],
  NW: [
    { row: 3, col: 0, flipX: true },
    { row: 3, col: 1, flipX: true },
    { row: 3, col: 2, flipX: true },
    { row: 3, col: 3, flipX: true },
  ],
  N: [
    { row: 2, col: 1 },
    { row: 2, col: 2 },
    { row: 2, col: 3 },
    { row: 2, col: 2 },
  ],
  NE: [
    { row: 3, col: 0 },
    { row: 3, col: 1 },
    { row: 3, col: 2 },
    { row: 3, col: 3 },
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

// ── 2. battle.png sequential 4-frame Izuna Amaterasu combos ────────────────
export const SAKUYAMON_X_BATTLE_COMBOS: readonly (readonly FrameRect[])[] = [
  // [0..3] South (Row 0): shrine maiden poise -> cyan fox-fire aura -> blazing crescent & ofuda -> recover
  [gridCell(0, 0), gridCell(0, 1), gridCell(0, 2), gridCell(0, 3)],
  // [4..7] West (Row 2): left-facing fox-fire & floating crimson talisman volley
  [gridCell(2, 0), gridCell(2, 1), gridCell(2, 2), gridCell(2, 3)],
  // [8..11] East (Row 6): right-facing fox-fire crescent & ofuda storm
  [gridCell(6, 0), gridCell(6, 1), gridCell(6, 2), gridCell(6, 3)],
];

// ── 3. sakuyamon-x.jpg (2400x1792: icon + 8 HD portraits + 8 mini thumbs) ──
export const SAKUYAMON_X_ICON_RECT: FrameRect = {
  x: 24,
  y: 16,
  w: 200,
  h: 218,
};

/** 8 HD portraits ordered canonically as `DIRECTIONS_8` (`S, SW, W, NW, N, NE, E, SE`). */
export const SAKUYAMON_X_HD_RECTS: readonly FrameRect[] = [
  { x: 16, y: 928, w: 585, h: 638 },   // S
  { x: 612, y: 928, w: 576, h: 638 },  // SW
  { x: 1210, y: 928, w: 622, h: 638 }, // W
  { x: 1832, y: 928, w: 520, h: 638 }, // NW
  { x: 75, y: 238, w: 510, h: 616 },   // N
  { x: 645, y: 198, w: 500, h: 656 },  // NE
  { x: 1168, y: 198, w: 634, h: 656 }, // E
  { x: 1803, y: 198, w: 578, h: 656 }, // SE
];

const MINI_SPANS: readonly [number, number][] = [
  [590, 128],
  [748, 121],
  [897, 136],
  [1053, 138],
  [1208, 138],
  [1365, 137],
  [1530, 122],
  [1679, 130],
];

export const SAKUYAMON_X_MINI_RECTS: readonly FrameRect[] = MINI_SPANS.map(([x, w]) => ({
  x,
  y: 1650,
  w,
  h: 140,
}));
