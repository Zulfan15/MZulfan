import type { FrameRect } from '../_shared/types';

/**
 * Pure pixel-coordinate tables for all 4 Shogun Alphamon source sheets.
 * Data only — zero Canvas or engine imports. Edit only these numbers if assets change.
 */

// ── 1. idle.png, walk-cycle.png & battle.png shared 4x8 grid (2730x1536) ────
// Dark grid dividers live at X=0..3, 681..684, 1363..1366, 2046..2048, 2727..2729
// and Y=0..3, 191..194, 382..385, 574..577, 766..769, 958..961, 1150..1152, 1342..1344, 1532..1535.
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
  [1154, 186], // 6: E
  [1346, 184], // 7: SE
];

const gridCell = (row: number, col: number): FrameRect => ({
  x: GRID_COLS[col][0],
  y: GRID_ROWS[row][0],
  w: GRID_COLS[col][1],
  h: GRID_ROWS[row][1],
});

export const SHOGUN_ALPHAMON_IDLE_STEPS_PER_DIR = 4;
export const SHOGUN_ALPHAMON_WALK_STEPS_PER_DIR = 4;

/** 32 idle/walk frames ordered canonically: `dirIndex (0..7) * 4 + step (0..3)`. */
export const SHOGUN_ALPHAMON_GRID_RECTS: readonly FrameRect[] = GRID_ROWS.flatMap((_, row) =>
  GRID_COLS.map((__, col) => gridCell(row, col))
);

// ── 2. battle.png fiery naginata charge & crescent slash poses ─────────────
export const SHOGUN_ALPHAMON_BATTLE_RECTS: readonly FrameRect[] = [
  gridCell(0, 1), // 0: S naginata flame charge
  gridCell(0, 2), // 1: S blazing naginata crescent sweep
  gridCell(1, 2), // 2: SW forward fiery lance thrust
  gridCell(2, 2), // 3: W sweeping golden flame crescent
  gridCell(6, 2), // 4: E sweeping golden flame crescent
  gridCell(7, 2), // 5: SE forward fiery lance thrust
  gridCell(0, 3), // 6: S post-slash ember recover
  gridCell(5, 2), // 7: NE diagonal upward fire thrust
];

// ── 3. shogun-alphamon.png (2388x1792: icon + 8 HD portraits + 8 mini thumbs)
export const SHOGUN_ALPHAMON_JPG_ICON_RECT: FrameRect = {
  x: 35,
  y: 24,
  w: 178,
  h: 184,
};

/**
 * 8 HD portraits ordered canonically as `DIRECTIONS_8` (`S, SW, W, NW, N, NE, E, SE`).
 * Row Y bands start cleanly below the overhead direction captions (`y=336` and `y=1044`).
 */
export const SHOGUN_ALPHAMON_HD_RECTS: readonly FrameRect[] = [
  { x: 60, y: 1044, w: 540, h: 542 },  // S
  { x: 630, y: 1044, w: 550, h: 542 }, // SW
  { x: 1190, y: 1044, w: 610, h: 542 },// W
  { x: 1800, y: 1044, w: 575, h: 542 },// NW
  { x: 80, y: 336, w: 480, h: 544 },   // N
  { x: 590, y: 336, w: 595, h: 544 },  // NE
  { x: 1185, y: 336, w: 615, h: 544 }, // E
  { x: 1815, y: 336, w: 560, h: 544 }, // SE
];

const MINI_XS: readonly [number, number][] = [
  [445, 130],
  [640, 130],
  [814, 155],
  [995, 190],
  [1198, 190],
  [1402, 190],
  [1614, 160],
  [1786, 170],
];

export const SHOGUN_ALPHAMON_MINI_RECTS: readonly FrameRect[] = MINI_XS.map(([x, w]) => ({
  x,
  y: 1618,
  w,
  h: 172,
}));
