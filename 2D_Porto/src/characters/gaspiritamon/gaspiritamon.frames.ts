import type { Direction8, FrameRect } from '../_shared/types';

/**
 * Pure pixel-coordinate tables for all 3 Gaspiritamon source sheets.
 * Data only — zero Canvas or engine imports. Edit only these numbers if assets change.
 */

// ── 1. walk-cycle-v2.webp 4x4 grid (1024x1024) ──────────────────────────────────
// Curated torso/head-aligned cell rects so `trim: 'uniform'` keeps strides rock-steady.
const WALK_CELLS: readonly (readonly FrameRect[])[] = [
  // Row 0: S (front) — using cols 0, 2, 3 (each has full warhammer + spectral blue wolf)
  [
    { x: 2, y: 12, w: 249, h: 243 },
    { x: 258, y: 12, w: 249, h: 243 },
    { x: 511, y: 12, w: 249, h: 243 },
    { x: 775, y: 12, w: 249, h: 243 },
  ],
  // Row 1: reserved (Attempt 1 col 0 faces W while cols 1-3 face E; mirrored Row 3 is used for W)
  [
    { x: 8, y: 264, w: 240, h: 244 },
    { x: 264, y: 264, w: 240, h: 244 },
    { x: 520, y: 264, w: 240, h: 244 },
    { x: 776, y: 264, w: 240, h: 244 },
  ],
  // Row 2: N (straight back) — using clean single-shield cols 0, 2
  [
    { x: 0, y: 522, w: 256, h: 244 },
    { x: 256, y: 522, w: 256, h: 244 },
    { x: 512, y: 522, w: 256, h: 244 },
    { x: 768, y: 522, w: 256, h: 244 },
  ],
  // Row 3: E (side profile facing right; mirrored via flipX for W/SW/NW) — heads aligned within 0.6px
  [
    { x: 38, y: 778, w: 214, h: 246 },
    { x: 300, y: 778, w: 214, h: 246 },
    { x: 547, y: 778, w: 214, h: 246 },
    { x: 808, y: 778, w: 214, h: 246 },
  ],
];

export const walkCell = (row: number, col: number): FrameRect => WALK_CELLS[row][col];

// ── 1b. battle.webp shared 8x4 grid (2752x1536) ────────────────────────────
const GRID_8X4_COLS: readonly [number, number][] = [
  [6, 335],
  [351, 333],
  [693, 334],
  [1037, 334],
  [1381, 334],
  [1725, 334],
  [2068, 333],
  [2411, 335],
];

const GRID_8X4_ROWS: readonly [number, number][] = [
  [4, 373],
  [387, 376],
  [773, 376],
  [1159, 373],
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
 * Curated 4-step bipedal walk sequences from `walk-cycle-v2.webp` (4x4):
 * - `S`: Row 0 `[0, 2, 0, 3]` alternating strides (skips col 1 which lacked spectral wolf flame).
 * - `W`/`SW`/`NW`: horizontally mirrors Row 3 `[0, 1, 2, 3]` cleanly facing left.
 * - `N`: Row 2 `[0, 2, 0, 2]` (skips angled col 1 & double-shield col 3).
 * - `E`/`NE`/`SE`: Row 3 `[0, 1, 2, 3]` right-facing strides.
 */
export const GASPIRITAMON_WALK_STEPS_BY_DIR: Record<Direction8, readonly CellStep[]> = {
  S: [
    { row: 0, col: 0 },
    { row: 0, col: 2 },
    { row: 0, col: 0 },
    { row: 0, col: 3 },
  ],
  SW: [
    { row: 3, col: 0, flipX: true },
    { row: 3, col: 1, flipX: true },
    { row: 3, col: 2, flipX: true },
    { row: 3, col: 3, flipX: true },
  ],
  W: [
    { row: 3, col: 0, flipX: true },
    { row: 3, col: 1, flipX: true },
    { row: 3, col: 2, flipX: true },
    { row: 3, col: 3, flipX: true },
  ],
  NW: [
    { row: 3, col: 0, flipX: true },
    { row: 3, col: 1, flipX: true },
    { row: 3, col: 2, flipX: true },
    { row: 3, col: 3, flipX: true },
  ],
  N: [
    { row: 2, col: 0 },
    { row: 2, col: 2 },
    { row: 2, col: 0 },
    { row: 2, col: 2 },
  ],
  NE: [
    { row: 3, col: 0 },
    { row: 3, col: 1 },
    { row: 3, col: 2 },
    { row: 3, col: 3 },
  ],
  E: [
    { row: 3, col: 0 },
    { row: 3, col: 1 },
    { row: 3, col: 2 },
    { row: 3, col: 3 },
  ],
  SE: [
    { row: 3, col: 0 },
    { row: 3, col: 1 },
    { row: 3, col: 2 },
    { row: 3, col: 3 },
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

// ── 3. gaspiritamon.webp (2400x1792: icon + 8 HD portraits + 8 mini thumbs) ─
export const GASPIRITAMON_JPG_ICON_RECT: FrameRect = {
  x: 14,
  y: 12,
  w: 236,
  h: 230,
};

/** 8 HD portraits ordered canonically as `DIRECTIONS_8` (`S, SW, W, NW, N, NE, E, SE`). */
export const GASPIRITAMON_JPG_HD_RECTS: readonly FrameRect[] = [
  { x: 16, y: 940, w: 642, h: 608 },   // S
  { x: 660, y: 940, w: 580, h: 608 },  // SW
  { x: 1270, y: 940, w: 500, h: 608 }, // W
  { x: 1815, y: 940, w: 575, h: 608 }, // NW
  { x: 60, y: 247, w: 630, h: 604 },   // N (below title banner y=[244..251])
  { x: 700, y: 247, w: 610, h: 604 },  // NE
  { x: 1335, y: 247, w: 435, h: 604 }, // E
  { x: 1758, y: 247, w: 612, h: 604 }, // SE
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
