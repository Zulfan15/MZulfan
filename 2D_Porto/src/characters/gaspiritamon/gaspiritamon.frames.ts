import type { Direction8, FrameRect } from '../_shared/types';

/**
 * Pure pixel-coordinate tables for all 3 Gaspiritamon source sheets.
 * Data only — zero Canvas or engine imports. Edit only these numbers if assets change.
 */

// ── 1. walk-cycle.jpg & battle.jpg shared 8x4 grid (2752x1536) ─────────────
const GRID_8X4_COLS: readonly [number, number][] = [
  [9, 328],
  [354, 326],
  [697, 326],
  [1041, 326],
  [1385, 326],
  [1729, 326],
  [2072, 326],
  [2415, 328],
];

const GRID_8X4_ROWS: readonly [number, number][] = [
  [6, 367],
  [390, 370],
  [776, 370],
  [1162, 367],
];

export const gridCell8x4 = (row: number, col: number): FrameRect => ({
  x: GRID_8X4_COLS[col][0],
  y: GRID_8X4_ROWS[row][0],
  w: GRID_8X4_COLS[col][1],
  h: GRID_8X4_ROWS[row][1],
});

export const GASPIRITAMON_WALK_STEPS_PER_DIR = 4;

export interface CellStep {
  row: number;
  col: number;
  flipX?: boolean;
}

/**
 * Verified (row, col) sequences per direction in `walk-cycle.jpg`:
 * - col 0: S (front)
 * - col 1: SW (3/4 front-left stepping toward viewer)
 * - col 6: W (profile left)
 * - col 5: NW (3/4 back-left)
 * - col 4: N (back)
 * - col 2: E (profile right)
 * - NE / SE mirror NW / SW cleanly.
 */
export const GASPIRITAMON_WALK_STEPS_BY_DIR: Record<Direction8, readonly CellStep[]> = {
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
    { row: 0, col: 6 },
    { row: 1, col: 6 },
    { row: 2, col: 6 },
    { row: 3, col: 6 },
  ],
  NW: [
    { row: 0, col: 5 },
    { row: 1, col: 5 },
    { row: 2, col: 5 },
    { row: 3, col: 5 },
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
    { row: 2, col: 5, flipX: true },
    { row: 3, col: 5, flipX: true },
  ],
  E: [
    { row: 0, col: 2 },
    { row: 1, col: 2 },
    { row: 2, col: 2 },
    { row: 3, col: 2 },
  ],
  SE: [
    { row: 0, col: 1, flipX: true },
    { row: 1, col: 1, flipX: true },
    { row: 2, col: 1, flipX: true },
    { row: 3, col: 1, flipX: true },
  ],
};

// ── 2. battle.jpg Fenrir Maelstrom hammer & spectral wolf slashes ───────────
export const GASPIRITAMON_BATTLE_RECTS: readonly FrameRect[] = [
  gridCell8x4(1, 1), // 0: front low cyan-white hammer cleave
  gridCell8x4(2, 1), // 1: glacial wolf spirit lunge & runic hammer smash
  gridCell8x4(2, 2), // 2: rising crescent maelstrom arc
  gridCell8x4(1, 2), // 3: wide profile frost sweep
  gridCell8x4(1, 6), // 4: sweeping runic hammer follow-through
  gridCell8x4(2, 6), // 5: blazing cyan crescent uppercut
  gridCell8x4(2, 5), // 6: reverse vortex spin slash
  gridCell8x4(2, 7), // 7: emerald rune surge strike
];

// ── 3. gaspirita­mon.jpg (2400x1792: icon + 8 HD portraits + 8 mini thumbs) ─
export const GASPIRITAMON_JPG_ICON_RECT: FrameRect = {
  x: 16,
  y: 12,
  w: 194,
  h: 192,
};

/** 8 HD portraits ordered canonically as `DIRECTIONS_8` (`S, SW, W, NW, N, NE, E, SE`). */
export const GASPIRITAMON_JPG_HD_RECTS: readonly FrameRect[] = [
  { x: 16, y: 940, w: 636, h: 602 },   // S
  { x: 664, y: 945, w: 545, h: 598 },  // SW
  { x: 1285, y: 940, w: 470, h: 602 }, // W
  { x: 1830, y: 960, w: 560, h: 582 }, // NW
  { x: 42, y: 204, w: 630, h: 638 },   // N
  { x: 735, y: 250, w: 545, h: 592 },  // NE
  { x: 1345, y: 248, w: 416, h: 594 }, // E
  { x: 1761, y: 255, w: 605, h: 588 }, // SE
];

const MINI_SPANS: readonly [number, number][] = [
  [270, 180],
  [532, 170],
  [786, 154],
  [1032, 148],
  [1262, 145],
  [1486, 155],
  [1726, 168],
  [1980, 156],
];

export const GASPIRITAMON_JPG_MINI_RECTS: readonly FrameRect[] = MINI_SPANS.map(([x, w]) => ({
  x,
  y: 1635,
  w,
  h: 150,
}));
