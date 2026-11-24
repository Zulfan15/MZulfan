import type { Direction8, FrameRect } from '../_shared/types';

/**
 * Pure pixel-coordinate tables for all 4 Shogun Alphamon source sheets.
 * Data only — zero Canvas or engine imports. Edit only these numbers if assets change.
 */

// ── 1. idle.png & battle.png shared 4x8 grid (2730x1536) ───────────────────
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

export const gridCell = (row: number, col: number): FrameRect => ({
  x: GRID_COLS[col][0],
  y: GRID_ROWS[row][0],
  w: GRID_COLS[col][1],
  h: GRID_ROWS[row][1],
});

// ── 1b. walk-cycle.jpg 4x4 generated galloping/trotting sheet (1024x1024) ──
const WALK_CELLS: readonly (readonly FrameRect[])[] = [
  // Row 0: S (front) — uniform 240x250 cells centered with clean green margin
  [
    { x: 12, y: 8, w: 240, h: 250 },
    { x: 267, y: 8, w: 240, h: 250 },
    { x: 522, y: 8, w: 240, h: 250 },
    { x: 779, y: 8, w: 240, h: 250 },
  ],
  // Row 1: unused (faces East; Row 3 has clean full green gutters on all 4 sides)
  [
    { x: 0, y: 256, w: 253, h: 255 },
    { x: 253, y: 256, w: 257, h: 255 },
    { x: 510, y: 256, w: 258, h: 255 },
    { x: 768, y: 256, w: 256, h: 255 },
  ],
  // Row 2: N (back) — y=496..765 keeps full spearhead; `isolateMainBody: true` strips top seam specks
  [
    { x: 50, y: 496, w: 180, h: 270 },
    { x: 305, y: 496, w: 180, h: 270 },
    { x: 560, y: 496, w: 180, h: 270 },
    { x: 815, y: 496, w: 180, h: 270 },
  ],
  // Row 3: E (right) — uniform 256x248 cells aligned within 1px for C0..C2 pure profile gallop
  [
    { x: 2, y: 774, w: 256, h: 248 },
    { x: 258, y: 774, w: 256, h: 248 },
    { x: 514, y: 774, w: 256, h: 248 },
    { x: 770, y: 774, w: 252, h: 248 },
  ],
];

export const walkCell = (row: number, col: number): FrameRect => WALK_CELLS[row][col];

export interface CellStep {
  row: number;
  col: number;
  flipX?: boolean;
}

export const SHOGUN_ALPHAMON_IDLE_STEPS_PER_DIR = 4;
export const SHOGUN_ALPHAMON_WALK_STEPS_PER_DIR = 4;

/**
 * Verified 4-step sequences per direction for `idle.png`.
 * Note: In Row 7 (`SE`), cols 1 & 2 in the source sheet shift into pure side-profile (`E`),
 * so `SE` uses cols `0, 3, 0, 3` to keep its 3/4 front-right angle stable.
 */
export const SHOGUN_ALPHAMON_STEPS_BY_DIR: Record<Direction8, readonly FrameRect[]> = {
  S: [gridCell(0, 0), gridCell(0, 1), gridCell(0, 2), gridCell(0, 3)],
  SW: [gridCell(1, 0), gridCell(1, 1), gridCell(1, 2), gridCell(1, 3)],
  W: [gridCell(2, 0), gridCell(2, 1), gridCell(2, 2), gridCell(2, 3)],
  NW: [gridCell(3, 0), gridCell(3, 1), gridCell(3, 2), gridCell(3, 3)],
  N: [gridCell(4, 0), gridCell(4, 1), gridCell(4, 2), gridCell(4, 3)],
  NE: [gridCell(5, 0), gridCell(5, 1), gridCell(5, 2), gridCell(5, 3)],
  E: [gridCell(6, 0), gridCell(6, 1), gridCell(6, 2), gridCell(6, 3)],
  SE: [gridCell(7, 0), gridCell(7, 3), gridCell(7, 0), gridCell(7, 3)],
};

/**
 * Verified 4-step walk/gallop sequences in generated `walk-cycle.jpg` (4x4):
 * - `S`: Row 0 `[c2, c0, c1, c3]` front hoof lift & stride bob.
 * - `E`/`NE`/`SE`: Row 3 `[c0, c1, c2, c1]` pure side profile gallop (stride -> flying tuck -> reach -> tuck).
 * - `W`/`SW`/`NW`: horizontally mirrors Row 3 (`flipX: true`) since Row 1 faces right in source.
 * - `N`: Row 2 `[c2, c1, c2, c3]` alternating hind hoof steps (planted -> right lifted -> planted -> left lifted).
 */
export const SHOGUN_ALPHAMON_WALK_STEPS_BY_DIR: Record<Direction8, readonly CellStep[]> = {
  S: [
    { row: 0, col: 2 },
    { row: 0, col: 0 },
    { row: 0, col: 1 },
    { row: 0, col: 3 },
  ],
  SW: [
    { row: 3, col: 0, flipX: true },
    { row: 3, col: 1, flipX: true },
    { row: 3, col: 2, flipX: true },
    { row: 3, col: 1, flipX: true },
  ],
  W: [
    { row: 3, col: 0, flipX: true },
    { row: 3, col: 1, flipX: true },
    { row: 3, col: 2, flipX: true },
    { row: 3, col: 1, flipX: true },
  ],
  NW: [
    { row: 3, col: 0, flipX: true },
    { row: 3, col: 1, flipX: true },
    { row: 3, col: 2, flipX: true },
    { row: 3, col: 1, flipX: true },
  ],
  N: [
    { row: 2, col: 2 },
    { row: 2, col: 1 },
    { row: 2, col: 2 },
    { row: 2, col: 3 },
  ],
  NE: [
    { row: 3, col: 0 },
    { row: 3, col: 1 },
    { row: 3, col: 2 },
    { row: 3, col: 1 },
  ],
  E: [
    { row: 3, col: 0 },
    { row: 3, col: 1 },
    { row: 3, col: 2 },
    { row: 3, col: 1 },
  ],
  SE: [
    { row: 3, col: 0 },
    { row: 3, col: 1 },
    { row: 3, col: 2 },
    { row: 3, col: 1 },
  ],
};

/** 32 idle/walk frames ordered canonically: `dirIndex (0..7) * 4 + step (0..3)`. */
export const SHOGUN_ALPHAMON_GRID_RECTS: readonly FrameRect[] = (
  ['S', 'SW', 'W', 'NW', 'N', 'NE', 'E', 'SE'] as const
).flatMap((dir) => SHOGUN_ALPHAMON_STEPS_BY_DIR[dir]);

// ── 2. battle.png sequential 4-frame directional naginata slash combos ──────
// Each row in `battle.png` is a sequential 4-frame animation:
// col 0 (ready stance) -> col 1 (naginata ignites in golden fire) -> col 2 (blazing crescent slash) -> col 3 (recovery).
export const SHOGUN_ALPHAMON_BATTLE_COMBOS: readonly (readonly FrameRect[])[] = [
  // [0..3] South (Row 0): front naginata flame crescent combo
  [gridCell(0, 0), gridCell(0, 1), gridCell(0, 2), gridCell(0, 3)],
  // [4..7] West (Row 2): left-facing cavalry golden flame crescent combo
  [gridCell(2, 0), gridCell(2, 1), gridCell(2, 2), gridCell(2, 3)],
  // [8..11] East (Row 6): right-facing cavalry golden flame crescent combo
  [gridCell(6, 0), gridCell(6, 1), gridCell(6, 2), gridCell(6, 3)],
];

export const SHOGUN_ALPHAMON_BATTLE_RECTS: readonly FrameRect[] =
  SHOGUN_ALPHAMON_BATTLE_COMBOS.flatMap((combo) => combo);

// ── 3. shogun-alphamon.png (2388x1792: icon + 8 HD portraits + 8 mini thumbs)
export const SHOGUN_ALPHAMON_JPG_ICON_RECT: FrameRect = {
  x: 35,
  y: 24,
  w: 178,
  h: 184,
};

/**
 * 8 HD portraits ordered canonically as `DIRECTIONS_8` (`S, SW, W, NW, N, NE, E, SE`).
 * `N` starts at `y=280` to preserve the high naginata spearhead (`y=283..336`), while
 * `isolateMainBody: true` strips the floating overhead caption text automatically.
 */
export const SHOGUN_ALPHAMON_HD_RECTS: readonly FrameRect[] = [
  { x: 60, y: 1044, w: 540, h: 542 },  // S
  { x: 630, y: 1044, w: 550, h: 542 }, // SW
  { x: 1190, y: 1044, w: 610, h: 542 },// W
  { x: 1800, y: 1044, w: 575, h: 542 },// NW
  { x: 80, y: 280, w: 480, h: 600 },   // N (includes spearhead up to y=283)
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
