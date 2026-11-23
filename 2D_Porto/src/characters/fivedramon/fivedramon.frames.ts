import type { Direction8, FrameRect } from '../_shared/types';

/**
 * Pure pixel-coordinate tables for all 4 Fivedramon source sheets.
 * Data only — zero Canvas or engine imports. Edit only these numbers if assets change.
 */

// ── 1. idle.png (344x192, 4x2 grid inside 1px dark borders) ──────────────
const IDLE_COLS: readonly number[] = [1, 87, 173, 259];
const IDLE_ROWS: readonly number[] = [1, 97];

const RAW_IDLE_RECTS: readonly FrameRect[] = IDLE_ROWS.flatMap((y) =>
  IDLE_COLS.map((x) => ({ x, y, w: 84, h: 94 }))
);

/** Ordered canonically as `DIRECTIONS_8` (`S, SW, W, NW, N, NE, E, SE`). */
export const FIVEDRAMON_IDLE_RECTS: readonly FrameRect[] = [
  RAW_IDLE_RECTS[0], // S
  RAW_IDLE_RECTS[7], // SW
  RAW_IDLE_RECTS[6], // W
  RAW_IDLE_RECTS[5], // NW
  RAW_IDLE_RECTS[4], // N
  RAW_IDLE_RECTS[3], // NE
  RAW_IDLE_RECTS[2], // E
  RAW_IDLE_RECTS[1], // SE
];

// ── 2. walk-cycle.png (344x192, 8x4 cells inside dark dividers) ────────────
const walkCell = (row: number, col: number): FrameRect => ({
  x: 1 + col * 43,
  y: 1 + row * 48,
  w: 41,
  h: 46,
});

export const FIVEDRAMON_WALK_STEPS_PER_DIR = 4;

export interface WalkCellStep {
  row: number;
  col: number;
  flipX?: boolean;
}

/**
 * Layout inside `walk-cycle.png`:
 * - r0 c0..3: South walk (4 frames)
 * - r0 c4..7: North walk (4 frames)
 * - r1 c1..3: South-East walk
 * - r1 c4..6: West walk
 * - r2 c0..3: East walk (4 frames)
 */
export const FIVEDRAMON_WALK_STEPS_BY_DIR: Record<Direction8, readonly WalkCellStep[]> = {
  S: [
    { row: 0, col: 0 },
    { row: 0, col: 1 },
    { row: 0, col: 2 },
    { row: 0, col: 3 },
  ],
  SW: [
    { row: 1, col: 1, flipX: true },
    { row: 1, col: 2, flipX: true },
    { row: 1, col: 3, flipX: true },
    { row: 1, col: 2, flipX: true },
  ],
  W: [
    { row: 1, col: 4 },
    { row: 1, col: 5 },
    { row: 1, col: 6 },
    { row: 1, col: 5 },
  ],
  NW: [
    { row: 0, col: 6, flipX: true },
    { row: 1, col: 7, flipX: true },
    { row: 0, col: 7, flipX: true },
    { row: 1, col: 7, flipX: true },
  ],
  N: [
    { row: 0, col: 4 },
    { row: 0, col: 5 },
    { row: 0, col: 6 },
    { row: 0, col: 7 },
  ],
  NE: [
    { row: 0, col: 6 },
    { row: 1, col: 7 },
    { row: 0, col: 7 },
    { row: 1, col: 7 },
  ],
  E: [
    { row: 2, col: 0 },
    { row: 2, col: 1 },
    { row: 2, col: 2 },
    { row: 2, col: 3 },
  ],
  SE: [
    { row: 1, col: 1 },
    { row: 1, col: 2 },
    { row: 1, col: 3 },
    { row: 1, col: 2 },
  ],
};

export const fivedramonWalkRect = walkCell;

// ── 3. battle.png (344x192, 4x2 grid) ──────────────────────────────────────
const BATTLE_COLS: readonly number[] = [2, 88, 173, 259];
const BATTLE_ROWS: readonly number[] = [1, 97];

export const FIVEDRAMON_BATTLE_RECTS: readonly FrameRect[] = BATTLE_ROWS.flatMap((y) =>
  BATTLE_COLS.map((x) => ({ x, y, w: 83, h: 93 }))
);

// ── 4. fivedramon.jpg (2400x1792: icon + 8 HD portraits + 6 bottom thumbs) ─
export const FIVEDRAMON_JPG_ICON_RECT: FrameRect = {
  x: 24,
  y: 6,
  w: 150,
  h: 150,
};

/** 8 HD portraits ordered canonically as `DIRECTIONS_8` (`S, SW, W, NW, N, NE, E, SE`). */
export const FIVEDRAMON_JPG_HD_RECTS: readonly FrameRect[] = [
  { x: 10, y: 905, w: 730, h: 658 },  // S
  { x: 740, y: 905, w: 602, h: 658 }, // SW
  { x: 1342, y: 905, w: 457, h: 658 },// W
  { x: 1799, y: 905, w: 560, h: 658 },// NW
  { x: 10, y: 195, w: 705, h: 645 },  // N
  { x: 715, y: 195, w: 605, h: 645 }, // NE
  { x: 1320, y: 195, w: 453, h: 645 },// E
  { x: 1773, y: 195, w: 615, h: 645 },// SE
];

const MINI_XS: readonly number[] = [598, 810, 1034, 1226, 1422, 1638];
export const FIVEDRAMON_JPG_MINI_RECTS: readonly FrameRect[] = MINI_XS.map((x) => ({
  x,
  y: 1640,
  w: 165,
  h: 150,
}));
