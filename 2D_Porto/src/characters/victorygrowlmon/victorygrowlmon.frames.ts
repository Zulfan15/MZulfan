import type { Direction8, FrameRect } from '../_shared/types';

/**
 * Pure pixel-coordinate tables for all 4 VictoryGrowlmon source sheets.
 * Data only — zero Canvas or engine imports. Edit only these numbers if assets change.
 */

// ── 1. idle.png, walk-cycle.png & battle.png shared 4x8 grid (2730x1536) ────
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

export const VICTORYGROWLMON_IDLE_STEPS_PER_DIR = 4;
export const VICTORYGROWLMON_WALK_STEPS_PER_DIR = 4;

/** 4-step sequences per direction for `idle.png` and `walk-cycle.png`. */
export const VICTORYGROWLMON_STEPS_BY_DIR: Record<Direction8, readonly FrameRect[]> = {
  S: [gridCell(0, 0), gridCell(0, 1), gridCell(0, 2), gridCell(0, 3)],
  SW: [gridCell(1, 0), gridCell(1, 1), gridCell(1, 2), gridCell(1, 3)],
  W: [gridCell(2, 0), gridCell(2, 1), gridCell(2, 2), gridCell(2, 3)],
  NW: [gridCell(3, 0), gridCell(3, 1), gridCell(3, 2), gridCell(3, 3)],
  N: [gridCell(4, 0), gridCell(4, 1), gridCell(4, 2), gridCell(4, 3)],
  NE: [gridCell(5, 0), gridCell(5, 1), gridCell(5, 2), gridCell(5, 3)],
  E: [gridCell(6, 0), gridCell(6, 1), gridCell(6, 2), gridCell(6, 3)],
  SE: [gridCell(7, 0), gridCell(7, 1), gridCell(7, 2), gridCell(7, 3)],
};

// ── 2. battle.png sequential 4-frame directional Dramon Victory Slash combos ─
export const VICTORYGROWLMON_BATTLE_COMBOS: readonly (readonly FrameRect[])[] = [
  // [0..3] South (Row 0): ready stance -> weapons ignite -> Dramon Victory Slash + jet boost -> recover
  [gridCell(0, 0), gridCell(0, 1), gridCell(0, 2), gridCell(0, 3)],
  // [4..7] West (Row 2): left-facing jet lance & shield slash combo
  [gridCell(2, 0), gridCell(2, 1), gridCell(2, 2), gridCell(2, 3)],
  // [8..11] East (Row 6): right-facing jet lance & shield charge combo
  [gridCell(6, 0), gridCell(6, 1), gridCell(6, 2), gridCell(6, 3)],
];

// ── 3. victorygrowlmon.png (2388x1792: icon + 8 HD portraits + 8 mini thumbs)
export const VICTORYGROWLMON_ICON_RECT: FrameRect = {
  x: 24,
  y: 26,
  w: 192,
  h: 194,
};

/** 8 HD portraits ordered canonically as `DIRECTIONS_8` (`S, SW, W, NW, N, NE, E, SE`). */
export const VICTORYGROWLMON_HD_RECTS: readonly FrameRect[] = [
  { x: 16, y: 984, w: 564, h: 580 },   // S
  { x: 594, y: 984, w: 614, h: 580 },  // SW
  { x: 1252, y: 984, w: 544, h: 580 }, // W
  { x: 1816, y: 984, w: 552, h: 580 }, // NW
  { x: 26, y: 314, w: 500, h: 582 },   // N
  { x: 604, y: 314, w: 588, h: 582 },  // NE
  { x: 1194, y: 314, w: 484, h: 582 }, // E
  { x: 1786, y: 314, w: 572, h: 582 }, // SE
];

const MINI_SPANS: readonly [number, number][] = [
  [356, 178],
  [562, 176],
  [776, 186],
  [978, 200],
  [1212, 198],
  [1435, 190],
  [1650, 174],
  [1858, 186],
];

export const VICTORYGROWLMON_MINI_RECTS: readonly FrameRect[] = MINI_SPANS.map(([x, w]) => ({
  x,
  y: 1602,
  w,
  h: 186,
}));
