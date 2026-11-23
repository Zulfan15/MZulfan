import type { FrameRect } from '../_shared/types';

/**
 * Pure pixel-coordinate tables for all 5 Plusiamon source sheets.
 * Data only — zero Canvas or engine imports. Edit only these numbers if assets change.
 */

// ── 1. idle.png (344x192, 4x2 grid inside 1px dark borders, captions below each row)
const IDLE_COLS: readonly [number, number][] = [
  [5, 82],
  [96, 77],
  [183, 71],
  [264, 75],
];
const IDLE_ROWS: readonly [number, number][] = [
  [4, 77],
  [102, 77],
];

// Raw sheet order: Row0=[N, NE, E, SE], Row1=[S, SW, W, NW]; reorder to canonical DIRECTIONS_8
const RAW_IDLE_RECTS: readonly FrameRect[] = IDLE_ROWS.flatMap(([y, h]) =>
  IDLE_COLS.map(([x, w]) => ({ x, y, w, h }))
);

/** Ordered canonically as `DIRECTIONS_8` (`S, SW, W, NW, N, NE, E, SE`). */
export const PLUSIAMON_IDLE_RECTS: readonly FrameRect[] = [
  RAW_IDLE_RECTS[4], // S
  RAW_IDLE_RECTS[5], // SW
  RAW_IDLE_RECTS[6], // W
  RAW_IDLE_RECTS[7], // NW
  RAW_IDLE_RECTS[0], // N
  RAW_IDLE_RECTS[1], // NE
  RAW_IDLE_RECTS[2], // E
  RAW_IDLE_RECTS[3], // SE
];

// ── 2. walk-cycle.png & battle.png shared 4x8 grid (2730x1536, rows already S..SE)
const GRID_COLS: readonly [number, number][] = [
  [4, 677],
  [686, 677],
  [1368, 677],
  [2050, 676],
];
const GRID_ROWS: readonly [number, number][] = [
  [5, 186],   // 0: S
  [196, 186], // 1: SW
  [388, 186], // 2: W
  [579, 186], // 3: NW
  [771, 186], // 4: N
  [963, 186], // 5: NE
  [1154, 186], // 6: E
  [1346, 186], // 7: SE
];

const gridCell = (row: number, col: number): FrameRect => ({
  x: GRID_COLS[col][0],
  y: GRID_ROWS[row][0],
  w: GRID_COLS[col][1],
  h: GRID_ROWS[row][1],
});

export const PLUSIAMON_WALK_STEPS_PER_DIR = 4;

/** 32 walk frames ordered canonically: `dirIndex (0..7) * 4 + step (0..3)`. */
export const PLUSIAMON_WALK_RECTS: readonly FrameRect[] = GRID_ROWS.flatMap((_, row) =>
  GRID_COLS.map((__, col) => gridCell(row, col))
);

// ── 3. battle.png key attack poses (taken from matching directional rows) ───
export const PLUSIAMON_BATTLE_RECTS: readonly FrameRect[] = [
  gridCell(0, 1), // 0: S thruster ignition charge
  gridCell(0, 2), // 1: S dual cyan plasma cannon + thruster blast
  gridCell(1, 2), // 2: SW sweeping energy blade + thruster burst
  gridCell(2, 2), // 3: W dual cyan plasma beam
  gridCell(6, 2), // 4: E twin thruster + plasma blast
  gridCell(7, 2), // 5: SE flare + laser burst
  gridCell(0, 3), // 6: S post-blast spark recover
  gridCell(5, 2), // 7: NE reverse thruster flare + slash
];

// ── 4. plusiamon-ds.png (2730x1536, 3 large DS Battle Idle frames) ─────────
export const PLUSIAMON_DS_IDLE_RECTS: readonly FrameRect[] = [
  { x: 10, y: 155, w: 730, h: 670 },
  { x: 750, y: 175, w: 734, h: 653 },
  { x: 1498, y: 140, w: 738, h: 682 },
];

// ── 5. plusiamon.jpg (2400x1792: icon + 8 HD portraits + 8 bottom thumbs) ─
export const PLUSIAMON_JPG_ICON_RECT: FrameRect = {
  x: 20,
  y: 8,
  w: 190,
  h: 198,
};

/** 8 HD portraits ordered canonically as `DIRECTIONS_8` (`S, SW, W, NW, N, NE, E, SE`). */
export const PLUSIAMON_JPG_HD_RECTS: readonly FrameRect[] = [
  { x: 35, y: 935, w: 698, h: 636 },  // S
  { x: 733, y: 935, w: 615, h: 636 }, // SW
  { x: 1348, y: 935, w: 460, h: 636 }, // W
  { x: 1808, y: 935, w: 560, h: 636 }, // NW
  { x: 45, y: 208, w: 685, h: 626 },  // N
  { x: 735, y: 208, w: 575, h: 626 }, // NE
  { x: 1310, y: 208, w: 430, h: 626 }, // E
  { x: 1740, y: 208, w: 630, h: 626 }, // SE
];

const MINI_XS: readonly number[] = [205, 470, 735, 1002, 1265, 1518, 1792, 2050];
export const PLUSIAMON_JPG_MINI_RECTS: readonly FrameRect[] = MINI_XS.map((x) => ({
  x,
  y: 1638,
  w: 142,
  h: 150,
}));
