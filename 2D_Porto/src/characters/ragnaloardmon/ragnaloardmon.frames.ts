import type { Direction8, FrameRect } from '../_shared/types';

/**
 * Pure pixel-coordinate tables for all 5 Ragnaloardmon source sheets.
 * Data only — zero Canvas or engine imports. Edit only these numbers if assets change.
 */

// ── 1. idle.png (344x192, 4x2 grid inside 1..2px dark slate dividers) ─────
const IDLE_COLS: readonly number[] = [1, 87, 173, 259];
const IDLE_ROWS: readonly number[] = [1, 97];

export const RAGNALOARDMON_IDLE_RECTS: readonly FrameRect[] = IDLE_ROWS.flatMap((y) =>
  IDLE_COLS.map((x) => ({ x, y, w: 84, h: 94 }))
);

/**
 * Maps canonical `DIRECTIONS_8` (`S, SW, W, NW, N, NE, E, SE`) onto raw `idle.png` cells.
 * Cell [2] faces purely East (`E`); mirroring it produces a symmetric West (`W`) profile.
 */
export const RAGNALOARDMON_IDLE_DIRECTION_MAP: Record<
  Direction8,
  { rawIndex: number; flipX: boolean }
> = {
  S: { rawIndex: 0, flipX: false },
  SW: { rawIndex: 1, flipX: false },
  W: { rawIndex: 2, flipX: true },
  NW: { rawIndex: 5, flipX: false },
  N: { rawIndex: 4, flipX: false },
  NE: { rawIndex: 3, flipX: false },
  E: { rawIndex: 2, flipX: false },
  SE: { rawIndex: 7, flipX: false },
};

// ── 2. walk-cycle.jpg & battle.jpg shared 8x4 grid (2752x1536) ─────────────
const GRID_8X4_COLS: readonly { x: number; w: number }[] = [
  { x: 10, w: 329 },
  { x: 352, w: 329 },
  { x: 693, w: 331 },
  { x: 1036, w: 333 },
  { x: 1382, w: 333 },
  { x: 1727, w: 331 },
  { x: 2070, w: 330 },
  { x: 2412, w: 330 },
];

const GRID_8X4_ROWS: readonly { y: number; h: number }[] = [
  { y: 4, h: 371 },
  { y: 388, h: 373 },
  { y: 774, h: 373 },
  { y: 1160, h: 372 },
];

const gridCell = (row: number, col: number): FrameRect => ({
  x: GRID_8X4_COLS[col].x,
  y: GRID_8X4_ROWS[row].y,
  w: GRID_8X4_COLS[col].w,
  h: GRID_8X4_ROWS[row].h,
});

export const RAGNALOARDMON_WALK_STEPS_PER_DIR = 4;

export interface CellStep {
  row: number;
  col: number;
  flipX?: boolean;
}

/**
 * Hand-verified (row, col) sequences per direction in `walk-cycle.jpg` so every
 * frame in a direction faces consistently without sudden turning mid-stride.
 */
export const RAGNALOARDMON_WALK_STEPS_BY_DIR: Record<Direction8, readonly CellStep[]> = {
  S: [
    { row: 0, col: 0 },
    { row: 1, col: 0 },
    { row: 2, col: 0 },
    { row: 3, col: 0 },
  ],
  SW: [
    { row: 0, col: 1 },
    { row: 1, col: 1 },
    { row: 2, col: 1 },
    { row: 3, col: 1 },
  ],
  W: [
    { row: 0, col: 4, flipX: true },
    { row: 1, col: 4, flipX: true },
    { row: 3, col: 4, flipX: true },
    { row: 1, col: 4, flipX: true },
  ],
  NW: [
    { row: 0, col: 5 },
    { row: 1, col: 5 },
    { row: 2, col: 5 },
    { row: 3, col: 5 },
  ],
  N: [
    { row: 2, col: 4 },
    { row: 2, col: 5 },
    { row: 3, col: 5 },
    { row: 3, col: 7 },
  ],
  NE: [
    { row: 0, col: 5, flipX: true },
    { row: 1, col: 5, flipX: true },
    { row: 2, col: 5, flipX: true },
    { row: 3, col: 5, flipX: true },
  ],
  E: [
    { row: 0, col: 4 },
    { row: 1, col: 4 },
    { row: 3, col: 4 },
    { row: 1, col: 4 },
  ],
  SE: [
    { row: 0, col: 6 },
    { row: 1, col: 6 },
    { row: 2, col: 6 },
    { row: 3, col: 6 },
  ],
};

export const RAGNALOARDMON_WALK_CELL_RECT = gridCell;

// ── 3. battle.jpg signature slash frames (from 8x4 grid rows 1–2) ──────────
export const RAGNALOARDMON_BATTLE_RECTS: readonly FrameRect[] = [
  gridCell(2, 1), // 0: dramatic blazing Durandamon upward crescent sweep
  gridCell(2, 2), // 1: forward golden flame beam thrust (Direct Smasher)
  gridCell(2, 3), // 2: piercing golden diagonal strike
  gridCell(1, 1), // 3: wide blazing arc windup
  gridCell(1, 6), // 4: right-facing flame sword sweep
  gridCell(1, 7), // 5: right-facing high overhead slash
  gridCell(2, 5), // 6: heavy fiery burst cleave
  gridCell(2, 6), // 7: wide horizontal flame slash
];

// ── 4. ragnaloardmon-ds.jpg (2254x1410, 3 large Battle Idle frames) ───────
export const RAGNALOARDMON_DS_IDLE_RECTS: readonly FrameRect[] = [
  { x: 10, y: 10, w: 730, h: 660 },
  { x: 736, y: 10, w: 750, h: 660 },
  { x: 1520, y: 10, w: 726, h: 660 },
];

// ── 5. ragnaloardmon.jpg (2400x1792: icon + 8 HD portraits + 8 bottom thumbs)
export const RAGNALOARDMON_JPG_ICON_RECT: FrameRect = {
  x: 16,
  y: 12,
  w: 196,
  h: 154,
};

/** 8 HD portraits ordered canonically as `DIRECTIONS_8` (`S, SW, W, NW, N, NE, E, SE`). */
export const RAGNALOARDMON_JPG_HD_RECTS: readonly FrameRect[] = [
  { x: 60, y: 920, w: 545, h: 632 }, // S
  { x: 605, y: 920, w: 625, h: 632 }, // SW
  { x: 1230, y: 920, w: 530, h: 632 }, // W
  { x: 1790, y: 920, w: 608, h: 632 }, // NW
  { x: 10, y: 195, w: 605, h: 594 }, // N
  { x: 645, y: 195, w: 640, h: 594 }, // NE
  { x: 1290, y: 195, w: 510, h: 594 }, // E
  { x: 1835, y: 195, w: 560, h: 594 }, // SE
];

const MINI_SPANS: readonly [number, number][] = [
  [0, 295],
  [302, 293],
  [603, 385],
  [996, 200],
  [1203, 202],
  [1412, 384],
  [1804, 293],
  [2105, 294],
];

export const RAGNALOARDMON_JPG_MINI_RECTS: readonly FrameRect[] = MINI_SPANS.map(([x, w]) => ({
  x,
  y: 1612,
  w,
  h: 178,
}));
