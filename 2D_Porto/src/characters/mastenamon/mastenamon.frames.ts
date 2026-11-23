import type { Direction8, FrameRect } from '../_shared/types';

/**
 * Pure pixel-coordinate tables for all 4 Mastenamon source sheets.
 * Data only — zero Canvas or engine imports. Edit only these numbers if assets change.
 */

// ── 1. idle.png (344x192, 4x2 grid inside 2px dark cell borders) ───────────
const IDLE_COLS: readonly [number, number][] = [
  [4, 79],
  [89, 80],
  [175, 79],
  [261, 79],
];
const IDLE_ROWS: readonly [number, number][] = [
  [3, 90],
  [99, 90],
];

export const MASTENAMON_IDLE_RECTS: readonly FrameRect[] = IDLE_ROWS.flatMap(([y, h]) =>
  IDLE_COLS.map(([x, w]) => ({ x, y, w, h }))
);

/**
 * Maps canonical `DIRECTIONS_8` (`S, SW, W, NW, N, NE, E, SE`) onto raw cells
 * of `idle.png` with true visual symmetry:
 * - facing East (`E`) shows her right (black) wing closest to viewer (`raw[2]`)
 * - facing West (`W`) mirrors `raw[6]` so feet point left & left (white) wing faces viewer
 */
export const MASTENAMON_IDLE_DIRECTION_MAP: Record<
  Direction8,
  { rawIndex: number; flipX: boolean }
> = {
  S: { rawIndex: 0, flipX: false },
  SW: { rawIndex: 1, flipX: true },
  W: { rawIndex: 6, flipX: true },
  NW: { rawIndex: 4, flipX: false },
  N: { rawIndex: 5, flipX: false },
  NE: { rawIndex: 3, flipX: false },
  E: { rawIndex: 2, flipX: false },
  SE: { rawIndex: 1, flipX: false },
};

// ── 2. walk-cycle.png (344x192, 8 columns x 4 rows below y=0..8 label bar) ─
const WALK_COLS: readonly number[] = [1, 44, 87, 130, 173, 216, 259, 302];
const WALK_COL_WIDTH = 41;
const WALK_ROWS: readonly { y: number; h: number }[] = [
  { y: 9, h: 42 },
  { y: 52, h: 44 },
  { y: 99, h: 44 },
  { y: 145, h: 42 },
];

export const MASTENAMON_WALK_STEPS_PER_DIR = WALK_ROWS.length;

/**
 * NOTE: The generated sheet headers mislabeled horizontal headings:
 * columns 1..3 walk RIGHT (SE, E, NE) while columns 5..7 walk LEFT (NW, W, SW).
 * This table remaps raw columns into canonical `DIRECTIONS_8` (`S, SW, W, NW, N, NE, E, SE`).
 */
export const MASTENAMON_WALK_COL_BY_DIR: readonly number[] = [0, 7, 6, 5, 4, 3, 2, 1];

export const MASTENAMON_WALK_RECTS_BY_CANONICAL_DIR: readonly FrameRect[] =
  MASTENAMON_WALK_COL_BY_DIR.flatMap((colIdx) =>
    WALK_ROWS.map(({ y, h }) => ({
      x: WALK_COLS[colIdx],
      y,
      w: WALK_COL_WIDTH,
      h,
    }))
  );

// ── 3. battle.png (344x192, 4x2 grid inside 1..2px dark borders) ───────────
const BATTLE_COLS: readonly number[] = [1, 87, 173, 259];
const BATTLE_ROWS: readonly number[] = [1, 97];

export const MASTENAMON_BATTLE_RECTS: readonly FrameRect[] = BATTLE_ROWS.flatMap((y) =>
  BATTLE_COLS.map((x) => ({ x, y, w: 84, h: 94 }))
);

// ── 4. mastenamon.jpg (2400x1792: icon + 8 HD portraits + 8 bottom thumbs) ─
export const MASTENAMON_JPG_ICON_RECT: FrameRect = {
  x: 20,
  y: 15,
  w: 165,
  h: 176,
};

/** 8 HD portraits ordered canonically as `DIRECTIONS_8` (`S, SW, W, NW, N, NE, E, SE`). */
export const MASTENAMON_JPG_HD_RECTS: readonly FrameRect[] = [
  // Row 2: S, SW, W (y=895..1604 stays strictly between row-1 & row-2 text labels)
  { x: 25, y: 895, w: 638, h: 710 }, // S
  { x: 663, y: 895, w: 582, h: 710 }, // SW
  { x: 1245, y: 895, w: 439, h: 710 }, // W
  { x: 1790, y: 895, w: 585, h: 710 }, // NW
  // Row 1: N, NE, E, SE (y=180..847 stays above row-1 label band)
  { x: 45, y: 180, w: 623, h: 668 }, // N
  { x: 670, y: 180, w: 600, h: 668 }, // NE
  { x: 1280, y: 180, w: 415, h: 668 }, // E
  { x: 1765, y: 180, w: 595, h: 668 }, // SE
];

const MINI_XS: readonly number[] = [320, 555, 788, 1020, 1254, 1485, 1719, 1952];
export const MASTENAMON_JPG_MINI_RECTS: readonly FrameRect[] = MINI_XS.map((x) => ({
  x,
  y: 1678,
  w: 132,
  h: 110,
}));
