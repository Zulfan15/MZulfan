import type { Direction8, FrameRect } from '../_shared/types';

/**
 * Pure pixel-coordinate tables for all 5 Jesmon (X Antibody) source sheets.
 * Data only — zero Canvas or engine imports. Edit only these numbers if assets change.
 */

// ── 1. idle.webp, walk-cycle.webp & battle.webp shared 8x4 grid (2752x1536) ─
const GRID_8X4_COLS: readonly [number, number][] = [
  [10, 333],
  [354, 331],
  [697, 331],
  [1039, 331],
  [1382, 331],
  [1724, 331],
  [2067, 331],
  [2409, 333],
];

const GRID_8X4_ROWS: readonly [number, number][] = [
  [3, 374],
  [388, 374],
  [774, 374],
  [1160, 374],
];

export const gridCell8x4 = (row: number, col: number): FrameRect => ({
  x: GRID_8X4_COLS[col][0],
  y: GRID_8X4_ROWS[row][0],
  w: GRID_8X4_COLS[col][1],
  h: GRID_8X4_ROWS[row][1],
});

export const JESMON_X_STEPS_PER_DIR = 4;

export interface CellStep {
  row: number;
  col: number;
  flipX?: boolean;
}

/**
 * Verified (row, col) sequences per direction in `idle.jpg` & `walk-cycle.jpg`
 * so animations keep consistent facing cleanly across all 4 frames.
 */
export const JESMON_X_STEPS_BY_DIR: Record<Direction8, readonly CellStep[]> = {
  S: [
    { row: 0, col: 0 },
    { row: 1, col: 0 },
    { row: 3, col: 0 },
    { row: 1, col: 0 },
  ],
  SW: [
    { row: 0, col: 1 },
    { row: 1, col: 1 },
    { row: 0, col: 2 },
    { row: 1, col: 2 },
  ],
  W: [
    { row: 0, col: 3, flipX: true },
    { row: 1, col: 3, flipX: true },
    { row: 2, col: 3, flipX: true },
    { row: 3, col: 3, flipX: true },
  ],
  NW: [
    { row: 0, col: 5 },
    { row: 1, col: 5 },
    { row: 3, col: 5 },
    { row: 1, col: 5 },
  ],
  N: [
    { row: 0, col: 4 },
    { row: 1, col: 4 },
    { row: 2, col: 4 },
    { row: 3, col: 4 },
  ],
  NE: [
    { row: 0, col: 5, flipX: true },
    { row: 1, col: 5, flipX: true },
    { row: 3, col: 5, flipX: true },
    { row: 1, col: 5, flipX: true },
  ],
  E: [
    { row: 0, col: 3 },
    { row: 1, col: 3 },
    { row: 2, col: 3 },
    { row: 3, col: 3 },
  ],
  SE: [
    { row: 0, col: 1, flipX: true },
    { row: 1, col: 1, flipX: true },
    { row: 0, col: 2, flipX: true },
    { row: 1, col: 2, flipX: true },
  ],
};

// ── 2. battle.jpg blazing Tekken Seibai slash arcs ─────────────────────────
export const JESMON_X_BATTLE_RECTS: readonly FrameRect[] = [
  gridCell8x4(1, 1), // 0: cyan blade draw arc
  gridCell8x4(1, 2), // 1: sweeping cyan ground crescent
  gridCell8x4(2, 2), // 2: twin crimson-gold judgment slash burst
  gridCell8x4(2, 3), // 3: crimson blade wave sweep
  gridCell8x4(1, 5), // 4: left-angled cyan crescent slash
  gridCell8x4(1, 6), // 5: reverse cyan cross slash
  gridCell8x4(2, 5), // 6: reverse golden-white burst slash
  gridCell8x4(2, 6), // 7: reverse crimson-white twin cleave
];

// ── 3. jesmon-x-ds.jpg (2752x1536, 3 large DS Battle Idle frames) ──────────
export const JESMON_X_DS_IDLE_RECTS: readonly FrameRect[] = [
  { x: 6, y: 126, w: 767, h: 668 },
  { x: 778, y: 116, w: 768, h: 672 },
  { x: 1552, y: 116, w: 768, h: 672 },
];

// ── 4. jesmon-x.webp (2400x1792: icon + 8 HD portraits + 8 mini thumbs) ────
export const JESMON_X_JPG_ICON_RECT: FrameRect = {
  x: 20,
  y: 12,
  w: 204,
  h: 212,
};

/** 8 HD portraits ordered canonically as `DIRECTIONS_8` (`S, SW, W, NW, N, NE, E, SE`). */
export const JESMON_X_JPG_HD_RECTS: readonly FrameRect[] = [
  { x: 15, y: 938, w: 765, h: 694 },   // S
  { x: 785, y: 938, w: 565, h: 694 },  // SW
  { x: 1350, y: 938, w: 470, h: 694 }, // W
  { x: 1830, y: 938, w: 535, h: 694 }, // NW
  { x: 8, y: 212, w: 715, h: 670 },    // N
  { x: 740, y: 212, w: 630, h: 670 },  // NE (skips blurred gap between N and NE)
  { x: 1370, y: 212, w: 405, h: 670 }, // E
  { x: 1765, y: 212, w: 615, h: 670 }, // SE
];

const MINI_SPANS: readonly [number, number][] = [
  [18, 160],
  [186, 134],
  [326, 120],
  [452, 126],
  [586, 128],
  [724, 126],
  [860, 140],
  [1012, 160],
];

export const JESMON_X_JPG_MINI_RECTS: readonly FrameRect[] = MINI_SPANS.map(([x, w]) => ({
  x,
  y: 1635,
  w,
  h: 155,
}));
