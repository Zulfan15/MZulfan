import type { Direction8, FrameRect } from '../_shared/types';

/**
 * Pure pixel-coordinate tables for all 4 Holloknightmon source sheets.
 * Data only — zero Canvas or engine imports. Edit only these numbers if assets change.
 */

// ── 1. idle.jpg, walk-cycle.jpg & battle.jpg shared 8x4 grid (2752x1536) ────
const GRID_8X4_COLS: readonly [number, number][] = [
  [9, 329],
  [352, 328],
  [695, 330],
  [1039, 330],
  [1383, 330],
  [1727, 329],
  [2071, 328],
  [2415, 328],
];

const GRID_8X4_ROWS: readonly [number, number][] = [
  [6, 368],
  [390, 371],
  [775, 372],
  [1165, 366],
];

export const gridCell8x4 = (row: number, col: number): FrameRect => ({
  x: GRID_8X4_COLS[col][0],
  y: GRID_8X4_ROWS[row][0],
  w: GRID_8X4_COLS[col][1],
  h: GRID_8X4_ROWS[row][1],
});

export const HOLLOKNIGHTMON_STEPS_PER_DIR = 4;

export interface CellStep {
  row: number;
  col: number;
  flipX?: boolean;
}

/**
 * Verified (row, col) sequences per direction in `idle.jpg`.
 */
export const HOLLOKNIGHTMON_IDLE_STEPS_BY_DIR: Record<Direction8, readonly CellStep[]> = {
  S: [
    { row: 0, col: 4 },
    { row: 1, col: 4 },
    { row: 2, col: 4 },
    { row: 3, col: 4 },
  ],
  SW: [
    { row: 0, col: 5 },
    { row: 1, col: 5 },
    { row: 2, col: 5 },
    { row: 3, col: 5 },
  ],
  W: [
    { row: 0, col: 6 },
    { row: 1, col: 6 },
    { row: 2, col: 6 },
    { row: 3, col: 6 },
  ],
  NW: [
    { row: 0, col: 7 },
    { row: 1, col: 7 },
    { row: 2, col: 7 },
    { row: 3, col: 7 },
  ],
  N: [
    { row: 0, col: 0 },
    { row: 1, col: 0 },
    { row: 0, col: 0 },
    { row: 1, col: 0 },
  ],
  NE: [
    { row: 0, col: 1 },
    { row: 1, col: 1 },
    { row: 0, col: 1 },
    { row: 1, col: 1 },
  ],
  E: [
    { row: 0, col: 2 },
    { row: 1, col: 2 },
    { row: 2, col: 2 },
    { row: 3, col: 2 },
  ],
  SE: [
    { row: 0, col: 3 },
    { row: 1, col: 3 },
    { row: 2, col: 3 },
    { row: 3, col: 3 },
  ],
};

/**
 * Verified (row, col) sequences per direction in `walk-cycle.jpg`:
 * - col 6: W (profile left across all 4 rows)
 * - col 2: E (profile right across all 4 rows)
 */
export const HOLLOKNIGHTMON_WALK_STEPS_BY_DIR: Record<Direction8, readonly CellStep[]> = {
  S: [
    { row: 0, col: 4 },
    { row: 1, col: 4 },
    { row: 2, col: 4 },
    { row: 1, col: 4 },
  ],
  SW: [
    { row: 0, col: 5 },
    { row: 1, col: 5 },
    { row: 2, col: 5 },
    { row: 1, col: 5 },
  ],
  W: [
    { row: 0, col: 6 },
    { row: 1, col: 6 },
    { row: 2, col: 6 },
    { row: 3, col: 6 },
  ],
  NW: [
    { row: 0, col: 7 },
    { row: 1, col: 7 },
    { row: 2, col: 7 },
    { row: 3, col: 7 },
  ],
  N: [
    { row: 0, col: 0 },
    { row: 1, col: 7 },
    { row: 2, col: 7 },
    { row: 3, col: 7 },
  ],
  NE: [
    { row: 0, col: 1 },
    { row: 1, col: 7, flipX: true },
    { row: 2, col: 7, flipX: true },
    { row: 3, col: 7, flipX: true },
  ],
  E: [
    { row: 0, col: 2 },
    { row: 1, col: 2 },
    { row: 2, col: 2 },
    { row: 3, col: 2 },
  ],
  SE: [
    { row: 0, col: 5, flipX: true },
    { row: 1, col: 5, flipX: true },
    { row: 2, col: 5, flipX: true },
    { row: 1, col: 5, flipX: true },
  ],
};

// ── 2. battle.jpg blazing Radiance Decree greatsword & solar slashes ───────
export const HOLLOKNIGHTMON_BATTLE_RECTS: readonly FrameRect[] = [
  gridCell8x4(3, 3), // 0: greatsword wind-up stance
  gridCell8x4(2, 1), // 1: blazing solar flame sword thrust
  gridCell8x4(2, 3), // 2: wide golden crescent sword cleave
  gridCell8x4(2, 4), // 3: radiant sun-burst judgment slash
  gridCell8x4(3, 4), // 4: upright blazing greatsword summon
  gridCell8x4(2, 2), // 5: forward silver blade lunge
  gridCell8x4(2, 5), // 6: twin-blade counter stance
  gridCell8x4(3, 5), // 7: diagonal heavy greatsword strike
];

// ── 3. holloknightmon.jpg (2400x1792: icon + 8 HD portraits + 8 mini thumbs) ─
export const HOLLOKNIGHTMON_JPG_ICON_RECT: FrameRect = {
  x: 16,
  y: 12,
  w: 230,
  h: 234,
};

/** 8 HD portraits ordered canonically as `DIRECTIONS_8` (`S, SW, W, NW, N, NE, E, SE`). */
export const HOLLOKNIGHTMON_JPG_HD_RECTS: readonly FrameRect[] = [
  { x: 25, y: 928, w: 660, h: 616 },   // S
  { x: 686, y: 928, w: 587, h: 616 },  // SW
  { x: 1274, y: 928, w: 480, h: 616 }, // W
  { x: 1795, y: 928, w: 575, h: 616 }, // NW
  { x: 38, y: 202, w: 636, h: 645 },   // N
  { x: 712, y: 202, w: 522, h: 645 },  // NE
  { x: 1320, y: 202, w: 310, h: 645 }, // E
  { x: 1850, y: 202, w: 530, h: 645 }, // SE
];

const MINI_SPANS: readonly [number, number][] = [
  [272, 176],
  [516, 184],
  [770, 185],
  [1006, 150],
  [1264, 150],
  [1474, 182],
  [1728, 182],
  [1984, 178],
];

export const HOLLOKNIGHTMON_JPG_MINI_RECTS: readonly FrameRect[] = MINI_SPANS.map(([x, w]) => ({
  x,
  y: 1630,
  w,
  h: 156,
}));
