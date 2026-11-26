import type { Direction8, FrameRect } from '../_shared/types';

/**
 * Pure pixel-coordinate tables for all 4 Mastenamon source sheets.
 * Data only — zero Canvas or engine imports. Edit only these numbers if assets change.
 */

// ── 1. idle-cycle.webp (1024x1024, generated 4x4 hovering/standing idle sheet) ────
// Torso-aligned uniform-height cell rects per row so `trim: 'uniform'` stays rock-steady.
const IDLE_CELLS: readonly (readonly FrameRect[])[] = [
  // Row 0: S (front) — heads aligned within 0.7px (~120.4px from cell left)
  [
    { x: 3, y: 3, w: 244, h: 253 },
    { x: 260, y: 3, w: 244, h: 253 },
    { x: 516, y: 3, w: 244, h: 253 },
    { x: 772, y: 3, w: 244, h: 253 },
  ],
  // Row 1: black-wing side profile (mirrored via flipX for W/SW/NW) — heads aligned within 0.6px
  [
    { x: 5, y: 256, w: 180, h: 252 },
    { x: 261, y: 256, w: 180, h: 252 },
    { x: 518, y: 256, w: 180, h: 252 },
    { x: 774, y: 256, w: 180, h: 252 },
  ],
  // Row 2: N (canonical white-left / black-right back view on C0, C2)
  [
    { x: 11, y: 514, w: 245, h: 252 },
    { x: 267, y: 514, w: 245, h: 252 },
    { x: 523, y: 514, w: 245, h: 252 },
    { x: 779, y: 514, w: 245, h: 252 },
  ],
  // Row 3: E (white-wing side profile facing right) — heads aligned within 0.3px (~99.6px)
  [
    { x: 15, y: 768, w: 170, h: 252 },
    { x: 268, y: 768, w: 170, h: 252 },
    { x: 527, y: 768, w: 170, h: 252 },
    { x: 779, y: 768, w: 170, h: 252 },
  ],
];

export const idleCell = (row: number, col: number): FrameRect => IDLE_CELLS[row][col];

export const MASTENAMON_IDLE_STEPS_PER_DIR = 4;

/**
 * Verified 4-frame idle sequences in `idle-cycle.webp` (4x4):
 * - `S`: Row 0 `[c0, c1, c2, c3]` front calm poise.
 * - `W`/`SW`/`NW`: horizontally mirrors Row 1 `[c0, c1, c2, c3]` (black demon wings sweeping back right).
 * - `N`: Row 2 `[c0, c2, c0, c2]` canonical white-left / black-right back view (excludes swapped C1 / all-black C3).
 * - `E`/`NE`/`SE`: Row 3 `[c0, c1, c2, c3]` white angel wings sweeping back left.
 */
export const MASTENAMON_IDLE_STEPS_BY_DIR: Record<Direction8, readonly CellStep[]> = {
  S: [
    { row: 0, col: 0 },
    { row: 0, col: 1 },
    { row: 0, col: 2 },
    { row: 0, col: 3 },
  ],
  SW: [
    { row: 1, col: 0, flipX: true },
    { row: 1, col: 1, flipX: true },
    { row: 1, col: 2, flipX: true },
    { row: 1, col: 3, flipX: true },
  ],
  W: [
    { row: 1, col: 0, flipX: true },
    { row: 1, col: 1, flipX: true },
    { row: 1, col: 2, flipX: true },
    { row: 1, col: 3, flipX: true },
  ],
  NW: [
    { row: 1, col: 0, flipX: true },
    { row: 1, col: 1, flipX: true },
    { row: 1, col: 2, flipX: true },
    { row: 1, col: 3, flipX: true },
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

// ── 2. walk-cycle.jpg (1024x1024, generated 4x4 bipedal stride sheet) ───────
// Torso-aligned uniform-height cell rects per row so `trim: 'uniform'` stays rock-steady.
const WALK_CELLS: readonly (readonly FrameRect[])[] = [
  // Row 0: S (front) — torsos aligned ~131.1px from cell left
  [
    { x: 1, y: 8, w: 250, h: 251 },
    { x: 257, y: 8, w: 250, h: 251 },
    { x: 512, y: 8, w: 250, h: 251 },
    { x: 768, y: 8, w: 250, h: 251 },
  ],
  // Row 1: black-wing side profile (mirrored via flipX for W/SW/NW) — torsos aligned within 0.4px (~105.1px)
  [
    { x: 16, y: 261, w: 210, h: 249 },
    { x: 273, y: 261, w: 210, h: 249 },
    { x: 527, y: 261, w: 210, h: 249 },
    { x: 782, y: 261, w: 210, h: 249 },
  ],
  // Row 2: N (canonical white-left / black-right back view on C0, C2) — torsos aligned at 124.5px
  [
    { x: 8, y: 511, w: 250, h: 252 },
    { x: 260, y: 511, w: 250, h: 252 },
    { x: 513, y: 511, w: 254, h: 252 },
    { x: 769, y: 511, w: 250, h: 252 },
  ],
  // Row 3: E (white-wing side profile facing right) — torsos aligned within 0.1px (~99.9px)
  [
    { x: 15, y: 765, w: 200, h: 256 },
    { x: 266, y: 765, w: 200, h: 256 },
    { x: 527, y: 765, w: 200, h: 256 },
    { x: 778, y: 765, w: 200, h: 256 },
  ],
];

export const walkCell = (row: number, col: number): FrameRect => WALK_CELLS[row][col];

export interface CellStep {
  row: number;
  col: number;
  flipX?: boolean;
}

export const MASTENAMON_WALK_STEPS_PER_DIR = 4;

/**
 * Verified 4-step bipedal walk sequences in generated `walk-cycle.jpg` (4x4):
 * - `S`: Row 0 `[c0, c1, c2, c3]` alternating black/white leg march.
 * - `W`/`SW`/`NW`: horizontally mirrors Row 1 `[c0, c1, c2, c3]` (black demon wings sweeping back left).
 * - `N`: Row 2 `[c0, c2, c0, c2]` canonical white-left / black-right back steps (excludes all-black C1/C3).
 * - `E`/`NE`/`SE`: Row 3 `[c0, c2, c1, c3]` white angel wings sweeping back left.
 */
export const MASTENAMON_WALK_STEPS_BY_DIR: Record<Direction8, readonly CellStep[]> = {
  S: [
    { row: 0, col: 0 },
    { row: 0, col: 1 },
    { row: 0, col: 2 },
    { row: 0, col: 3 },
  ],
  SW: [
    { row: 1, col: 0, flipX: true },
    { row: 1, col: 1, flipX: true },
    { row: 1, col: 2, flipX: true },
    { row: 1, col: 3, flipX: true },
  ],
  W: [
    { row: 1, col: 0, flipX: true },
    { row: 1, col: 1, flipX: true },
    { row: 1, col: 2, flipX: true },
    { row: 1, col: 3, flipX: true },
  ],
  NW: [
    { row: 1, col: 0, flipX: true },
    { row: 1, col: 1, flipX: true },
    { row: 1, col: 2, flipX: true },
    { row: 1, col: 3, flipX: true },
  ],
  N: [
    { row: 2, col: 0 },
    { row: 2, col: 2 },
    { row: 2, col: 0 },
    { row: 2, col: 2 },
  ],
  NE: [
    { row: 3, col: 0 },
    { row: 3, col: 2 },
    { row: 3, col: 1 },
    { row: 3, col: 3 },
  ],
  E: [
    { row: 3, col: 0 },
    { row: 3, col: 2 },
    { row: 3, col: 1 },
    { row: 3, col: 3 },
  ],
  SE: [
    { row: 3, col: 0 },
    { row: 3, col: 2 },
    { row: 3, col: 1 },
    { row: 3, col: 3 },
  ],
};

// ── 3. battle.png (344x192, 4x2 grid inside 1..2px dark borders & corner dots) ──
const BATTLE_COL_SPANS: readonly { x: number; w: number }[] = [
  { x: 2, w: 83 },
  { x: 87, w: 83 },
  { x: 173, w: 84 },
  { x: 259, w: 83 },
];
const BATTLE_ROW_SPANS: readonly { y: number; h: number }[] = [
  { y: 1, h: 93 },
  { y: 98, h: 93 },
];

export const MASTENAMON_BATTLE_RECTS: readonly FrameRect[] = BATTLE_ROW_SPANS.flatMap(({ y, h }) =>
  BATTLE_COL_SPANS.map(({ x, w }) => ({ x, y, w, h }))
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
  // Row 2: S, SW, W, NW (y=888..1604 stays strictly below row-1 labels ending at y=887)
  { x: 25, y: 888, w: 638, h: 717 }, // S
  { x: 663, y: 888, w: 582, h: 717 }, // SW
  { x: 1245, y: 888, w: 439, h: 717 }, // W
  { x: 1790, y: 888, w: 585, h: 717 }, // NW
  // Row 1: N, NE, E, SE (y=174..847 stays above row-1 label band)
  { x: 45, y: 174, w: 623, h: 674 }, // N
  { x: 670, y: 174, w: 600, h: 674 }, // NE
  { x: 1280, y: 174, w: 415, h: 674 }, // E
  { x: 1765, y: 174, w: 595, h: 674 }, // SE
];

const MINI_XS: readonly number[] = [320, 555, 788, 1020, 1254, 1485, 1719, 1952];
export const MASTENAMON_JPG_MINI_RECTS: readonly FrameRect[] = MINI_XS.map((x) => ({
  x,
  y: 1678,
  w: 132,
  h: 110,
}));
