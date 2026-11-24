import type { Direction8, FrameRect } from '../_shared/types';

/**
 * Pure pixel-coordinate tables for all 4 Belphemon (X Antibody) source sheets.
 * Data only — zero Canvas or engine imports. Edit only these numbers if assets change.
 */

// ── 1. idle.jpg, walk-cycle.jpg & battle.jpg shared 8x4 variable grid (2752x1536) ──
const GRID_ROWS: readonly [number, number][] = [
  [4, 362],    // Row 0: y=4..365
  [372, 392],  // Row 1: y=372..763
  [771, 391],  // Row 2: y=771..1161
  [1169, 363], // Row 3: y=1169..1531
];

const GRID_COLS_BY_ROW: readonly (readonly [number, number][])[] = [
  // Row 0 dividers: 0..2 | 412..415 | 753..756 | 1062..1064 | 1374..1377 | 1806..1809 | 2097..2100 | 2406..2409 | 2749..2751
  [[4, 406], [417, 334], [758, 302], [1066, 306], [1379, 425], [1811, 284], [2102, 302], [2411, 336]],
  // Row 1 dividers: 0..2 | 383..386 | 753..756 | 1062..1064 | 1374..1377 | 1792..1795 | 2062..2065 | 2406..2409 | 2749..2751
  [[4, 377], [388, 363], [758, 302], [1066, 306], [1379, 411], [1797, 263], [2067, 337], [2411, 336]],
  // Row 2 dividers: 0..2 | 343..345 | 686..689 | 1030..1033 | 1374..1377 | 1719..1721 | 2062..2065 | 2406..2409 | 2749..2751
  [[4, 337], [347, 337], [691, 337], [1035, 337], [1379, 338], [1723, 337], [2067, 337], [2411, 336]],
  // Row 3 (identical to Row 2)
  [[4, 337], [347, 337], [691, 337], [1035, 337], [1379, 338], [1723, 337], [2067, 337], [2411, 336]],
];

export const gridCell = (row: number, col: number): FrameRect => ({
  x: GRID_COLS_BY_ROW[row][col][0],
  y: GRID_ROWS[row][0],
  w: GRID_COLS_BY_ROW[row][col][1],
  h: GRID_ROWS[row][1],
});

// ── 1b. walk-cycle-v2.jpg 4x4 generated bipedal stride sheet (1024x1024) ──
// Torso-aligned uniform-height cell rects per row so `trim: 'uniform'` stays rock-steady.
const WALK_CELLS: readonly (readonly FrameRect[])[] = [
  // Row 0: unused East duplicate (Row 2 has full green margins with zero left-border clipping)
  [
    { x: 0, y: 2, w: 255, h: 252 },
    { x: 256, y: 2, w: 255, h: 252 },
    { x: 514, y: 2, w: 254, h: 252 },
    { x: 768, y: 2, w: 255, h: 252 },
  ],
  // Row 1: S (front knee-lift march) — torsos aligned ~126.9px from cell left
  [
    { x: 0, y: 254, w: 255, h: 254 },
    { x: 256, y: 254, w: 256, h: 254 },
    { x: 513, y: 254, w: 254, h: 254 },
    { x: 767, y: 254, w: 257, h: 254 },
  ],
  // Row 2: E (right) & mirrored W — torsos aligned within 0.3px (~119.9px from cell left)
  [
    { x: 0, y: 508, w: 249, h: 253 },
    { x: 258, y: 508, w: 247, h: 253 },
    { x: 511, y: 508, w: 246, h: 253 },
    { x: 772, y: 508, w: 246, h: 253 },
  ],
  // Row 3: N (C0/C1 straight back) & NE/NW (C2/C3 3/4 back-right)
  [
    { x: 0, y: 760, w: 250, h: 259 },
    { x: 256, y: 760, w: 250, h: 259 },
    { x: 526, y: 760, w: 245, h: 259 },
    { x: 778, y: 760, w: 244, h: 259 },
  ],
];

export const walkCell = (row: number, col: number): FrameRect => WALK_CELLS[row][col];

export const BELPHEMON_X_IDLE_STEPS_PER_DIR = 4;
export const BELPHEMON_X_WALK_STEPS_PER_DIR = 4;

export interface CellStep {
  row: number;
  col: number;
  flipX?: boolean;
}

/**
 * Verified 4-step breathing/claw sequences per direction in `idle.jpg`.
 */
export const BELPHEMON_X_IDLE_STEPS_BY_DIR: Record<Direction8, readonly CellStep[]> = {
  S: [
    { row: 0, col: 0 },
    { row: 1, col: 0 },
    { row: 3, col: 0 },
    { row: 1, col: 0 },
  ],
  SW: [
    { row: 0, col: 1 },
    { row: 1, col: 1 },
    { row: 3, col: 1 },
    { row: 1, col: 1 },
  ],
  W: [
    { row: 0, col: 5 },
    { row: 1, col: 6 },
    { row: 0, col: 6 },
    { row: 1, col: 6 },
  ],
  NW: [
    { row: 3, col: 5 },
    { row: 3, col: 6 },
    { row: 3, col: 7 },
    { row: 3, col: 6 },
  ],
  N: [
    { row: 0, col: 4 },
    { row: 1, col: 4 },
    { row: 0, col: 4 },
    { row: 1, col: 4 },
  ],
  NE: [
    { row: 3, col: 5, flipX: true },
    { row: 3, col: 6, flipX: true },
    { row: 3, col: 7, flipX: true },
    { row: 3, col: 6, flipX: true },
  ],
  E: [
    { row: 0, col: 2 },
    { row: 1, col: 2 },
    { row: 0, col: 3 },
    { row: 1, col: 3 },
  ],
  SE: [
    { row: 0, col: 7 },
    { row: 1, col: 7 },
    { row: 0, col: 7 },
    { row: 1, col: 7 },
  ],
};

/**
 * Verified 4-step bipedal walking strides in generated `walk-cycle-v2.jpg` (4x4):
 * - `S`    : Row 1 `[c0, c1, c2, c3]` alternating left/right knee-lift march.
 * - `E/SE` : Row 2 `[c0, c1, c2, c3]` right-facing 4-step stride with full wing clearance.
 * - `W/SW` : horizontally mirrors Row 2 (`flipX: true`).
 * - `N`    : Row 3 `[c0, c1, c0, c1]` straight-North rear boots; `NE`/`NW` use Row 3 `[c2, c3]`.
 */
export const BELPHEMON_X_WALK_STEPS_BY_DIR: Record<Direction8, readonly CellStep[]> = {
  S: [
    { row: 1, col: 0 },
    { row: 1, col: 1 },
    { row: 1, col: 2 },
    { row: 1, col: 3 },
  ],
  SW: [
    { row: 2, col: 0, flipX: true },
    { row: 2, col: 1, flipX: true },
    { row: 2, col: 2, flipX: true },
    { row: 2, col: 3, flipX: true },
  ],
  W: [
    { row: 2, col: 0, flipX: true },
    { row: 2, col: 1, flipX: true },
    { row: 2, col: 2, flipX: true },
    { row: 2, col: 3, flipX: true },
  ],
  NW: [
    { row: 3, col: 2, flipX: true },
    { row: 3, col: 3, flipX: true },
    { row: 3, col: 2, flipX: true },
    { row: 3, col: 3, flipX: true },
  ],
  N: [
    { row: 3, col: 0 },
    { row: 3, col: 1 },
    { row: 3, col: 0 },
    { row: 3, col: 1 },
  ],
  NE: [
    { row: 3, col: 2 },
    { row: 3, col: 3 },
    { row: 3, col: 2 },
    { row: 3, col: 3 },
  ],
  E: [
    { row: 2, col: 0 },
    { row: 2, col: 1 },
    { row: 2, col: 2 },
    { row: 2, col: 3 },
  ],
  SE: [
    { row: 2, col: 0 },
    { row: 2, col: 1 },
    { row: 2, col: 2 },
    { row: 2, col: 3 },
  ],
};

// ── 2. battle.jpg sequential 4-frame Seventh Full Cluster claw combos ──────
export const BELPHEMON_X_BATTLE_COMBOS: readonly (readonly FrameRect[])[] = [
  // [0..3] South-West / Front (Col 1): claw windup -> slash crescent -> sweeping flare -> recover
  [gridCell(0, 1), gridCell(1, 1), gridCell(2, 1), gridCell(3, 1)],
  // [4..7] West (Col 6): left-facing crimson energy claw sweep
  [gridCell(0, 6), gridCell(1, 6), gridCell(2, 6), gridCell(0, 6)],
  // [8..11] East (Col 3): right-facing crimson energy claw sweep
  [gridCell(0, 3), gridCell(1, 3), gridCell(2, 3), gridCell(3, 3)],
];

// ── 3. belphemon-x.jpg (2400x1792: icon + 8 HD portraits + 8 mini thumbs) ─
export const BELPHEMON_X_ICON_RECT: FrameRect = {
  x: 18,
  y: 12,
  w: 158,
  h: 156,
};

/**
 * 8 HD portraits ordered canonically as `DIRECTIONS_8` (`S, SW, W, NW, N, NE, E, SE`).
 * Note: the source sheet has 3 top (`N, NE, E`) and 4 bottom (`S, SW, W, NW`) portraits,
 * so index 7 (`SE`) mirrors index 1 (`SW`) horizontally in `belphemon_x.loader.ts`.
 */
export const BELPHEMON_X_HD_RECTS: readonly FrameRect[] = [
  { x: 35, y: 910, w: 790, h: 652 },   // S
  { x: 855, y: 910, w: 615, h: 652 },  // SW
  { x: 1490, y: 910, w: 385, h: 652 }, // W
  { x: 1890, y: 910, w: 485, h: 652 }, // NW
  { x: 40, y: 184, w: 950, h: 648 },   // N
  { x: 1030, y: 184, w: 790, h: 648 }, // NE
  { x: 1840, y: 184, w: 520, h: 648 }, // E
  { x: 855, y: 910, w: 615, h: 652 },  // SE (horizontally flipped in loader)
];

const MINI_SPANS: readonly [number, number][] = [
  [302, 162],
  [544, 162],
  [779, 149],
  [1003, 158],
  [1239, 157],
  [1469, 157],
  [1705, 150],
  [1990, 135],
];

export const BELPHEMON_X_MINI_RECTS: readonly FrameRect[] = MINI_SPANS.map(([x, w]) => ({
  x,
  y: 1636,
  w,
  h: 154,
}));
