import type { Direction8, FrameRect } from '../_shared/types';

/**
 * Pure pixel-coordinate tables for Malgadramon's sheets.
 * Data only — zero Canvas or engine imports. Edit only these numbers if assets change.
 */

export interface CellStep {
  row: number;
  col: number;
  flipX?: boolean;
}

export interface OrientedRectSource {
  rect: FrameRect;
  flipX?: boolean;
}

// ── 1. Standard 4x4 grid helper (1024x1024) for future battle.webp ──────────
export function gridCell4x4(row: number, col: number, size = 256, pad = 6): FrameRect {
  return {
    x: col * size + pad,
    y: row * size + pad,
    w: size - pad * 2,
    h: size - pad * 2,
  };
}

// ── 1a. idle-cycle.webp (1024x1024, torso-aligned cells) ────────────────────
const IDLE_CELLS: readonly (readonly FrameRect[])[] = [
  // Row 0: S (front) — torsoCx aligned within < 0.7px
  [
    { x: 4, y: 10, w: 251, h: 245 },
    { x: 261, y: 10, w: 251, h: 245 },
    { x: 512, y: 10, w: 251, h: 245 },
    { x: 770, y: 10, w: 251, h: 245 },
  ],
  // Row 1: W (side profile facing strictly LEFT)
  [
    { x: 1, y: 266, w: 244, h: 244 },
    { x: 258, y: 266, w: 244, h: 244 },
    { x: 512, y: 266, w: 244, h: 244 },
    { x: 773, y: 266, w: 244, h: 244 },
  ],
  // Row 2: N (back)
  [
    { x: 12, y: 522, w: 236, h: 242 },
    { x: 265, y: 522, w: 236, h: 242 },
    { x: 522, y: 522, w: 236, h: 242 },
    { x: 775, y: 522, w: 236, h: 242 },
  ],
  // Row 3: E (side profile facing strictly RIGHT)
  [
    { x: 11, y: 778, w: 244, h: 244 },
    { x: 266, y: 778, w: 244, h: 244 },
    { x: 524, y: 778, w: 244, h: 244 },
    { x: 775, y: 778, w: 244, h: 244 },
  ],
];

export const idleCell = (row: number, col: number): FrameRect => IDLE_CELLS[row][col];

// ── 1b. walk-cycle.webp (1024x1024, torso-aligned 4-step gait cells) ────────
const WALK_CELLS: readonly (readonly FrameRect[])[] = [
  // Row 0: S (front)
  [
    { x: 4, y: 8, w: 251, h: 246 },
    { x: 258, y: 8, w: 251, h: 246 },
    { x: 512, y: 8, w: 251, h: 246 },
    { x: 770, y: 8, w: 251, h: 246 },
  ],
  // Row 1: W (side profile facing strictly LEFT)
  [
    { x: 0, y: 263, w: 246, h: 245 },
    { x: 260, y: 263, w: 246, h: 245 },
    { x: 519, y: 263, w: 246, h: 245 },
    { x: 771, y: 263, w: 246, h: 245 },
  ],
  // Row 2: N (back)
  [
    { x: 11, y: 518, w: 232, h: 245 },
    { x: 265, y: 518, w: 232, h: 245 },
    { x: 519, y: 518, w: 232, h: 245 },
    { x: 777, y: 518, w: 232, h: 245 },
  ],
  // Row 3: E (side profile facing strictly RIGHT)
  [
    { x: 9, y: 775, w: 246, h: 245 },
    { x: 261, y: 775, w: 246, h: 245 },
    { x: 514, y: 775, w: 246, h: 245 },
    { x: 774, y: 775, w: 246, h: 245 },
  ],
];

export const walkCell = (row: number, col: number): FrameRect => WALK_CELLS[row][col];

export const MALGADRAMON_IDLE_STEPS_PER_DIR = 4;
export const MALGADRAMON_WALK_STEPS_PER_DIR = 4;

/**
 * Smooth breathing wave order (`cols [1, 0, 2, 3]` -> low -> rising -> peak -> lowering)
 * for `idle-cycle.webp`:
 * - Row 0: South (front)
 * - Row 1: West (side profile facing left)
 * - Row 2: North (back)
 * - Row 3: East (side profile facing right)
 */
export const MALGADRAMON_IDLE_STEPS_BY_DIR: Record<Direction8, readonly CellStep[]> = {
  S: [
    { row: 0, col: 1 },
    { row: 0, col: 0 },
    { row: 0, col: 2 },
    { row: 0, col: 3 },
  ],
  SW: [
    { row: 1, col: 1 },
    { row: 1, col: 0 },
    { row: 1, col: 2 },
    { row: 1, col: 3 },
  ],
  W: [
    { row: 1, col: 1 },
    { row: 1, col: 0 },
    { row: 1, col: 2 },
    { row: 1, col: 3 },
  ],
  NW: [
    { row: 1, col: 1 },
    { row: 1, col: 0 },
    { row: 1, col: 2 },
    { row: 1, col: 3 },
  ],
  N: [
    { row: 2, col: 1 },
    { row: 2, col: 0 },
    { row: 2, col: 2 },
    { row: 2, col: 3 },
  ],
  NE: [
    { row: 3, col: 1 },
    { row: 3, col: 0 },
    { row: 3, col: 2 },
    { row: 3, col: 3 },
  ],
  E: [
    { row: 3, col: 1 },
    { row: 3, col: 0 },
    { row: 3, col: 2 },
    { row: 3, col: 3 },
  ],
  SE: [
    { row: 3, col: 1 },
    { row: 3, col: 0 },
    { row: 3, col: 2 },
    { row: 3, col: 3 },
  ],
};

/** Canonical 4-phase gait (`Left Stride -> Passing A -> Right Stride -> Passing B`) for `walk-cycle.webp`. */
export const MALGADRAMON_WALK_STEPS_BY_DIR: Record<Direction8, readonly CellStep[]> = {
  S: [
    { row: 0, col: 0 },
    { row: 0, col: 1 },
    { row: 0, col: 2 },
    { row: 0, col: 3 },
  ],
  SW: [
    { row: 1, col: 0 },
    { row: 1, col: 1 },
    { row: 1, col: 2 },
    { row: 1, col: 3 },
  ],
  W: [
    { row: 1, col: 0 },
    { row: 1, col: 1 },
    { row: 1, col: 2 },
    { row: 1, col: 3 },
  ],
  NW: [
    { row: 1, col: 0 },
    { row: 1, col: 1 },
    { row: 1, col: 2 },
    { row: 1, col: 3 },
  ],
  N: [
    { row: 2, col: 0 },
    { row: 2, col: 1 },
    { row: 2, col: 2 },
    { row: 2, col: 3 },
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

// Ready 8-frame grid rects for future 4x2 (1024x512) or 4x4 (1024x1024) `battle.webp`
export const MALGADRAMON_BATTLE_RECTS: readonly FrameRect[] = [
  gridCell4x4(0, 0),
  gridCell4x4(0, 1),
  gridCell4x4(0, 2),
  gridCell4x4(0, 3),
  gridCell4x4(1, 0),
  gridCell4x4(1, 1),
  gridCell4x4(1, 2),
  gridCell4x4(1, 3),
];

// ── 2. malgadramon.webp / Malgadramon.jpg (2400x1792: icon + HD poses + 8 mini sprites) ─
export const MALGADRAMON_JPG_ICON_RECT: FrameRect = {
  x: 46,
  y: 29,
  w: 188,
  h: 165,
};

const HD_N_RECT: FrameRect = { x: 91, y: 194, w: 608, h: 635 };
const HD_NE_RECT: FrameRect = { x: 807, y: 198, w: 696, h: 631 };
const HD_E_RECT: FrameRect = { x: 1589, y: 193, w: 760, h: 646 };
const HD_S_RECT: FrameRect = { x: 33, y: 921, w: 591, h: 633 };
const HD_SE_RECT: FrameRect = { x: 616, y: 945, w: 598, h: 609 };

/**
 * Canonical `DIRECTIONS_8` (`S, SW, W, NW, N, NE, E, SE`) HD portrait sources.
 * Source `Malgadramon.jpg` has SW/W/NW drawn facing right, so Westward views mirror E/NE/SE cleanly.
 */
export const MALGADRAMON_JPG_HD_SOURCES: Record<Direction8, OrientedRectSource> = {
  S: { rect: HD_S_RECT, flipX: false },
  SW: { rect: HD_SE_RECT, flipX: true },
  W: { rect: HD_E_RECT, flipX: true },
  NW: { rect: HD_NE_RECT, flipX: true },
  N: { rect: HD_N_RECT, flipX: false },
  NE: { rect: HD_NE_RECT, flipX: false },
  E: { rect: HD_E_RECT, flipX: false },
  SE: { rect: HD_SE_RECT, flipX: false },
};

/** 8 verified mini bottom-strip sprites in `Malgadramon.jpg` (ordered N, NE, E, SE, S, SW, W, NW visually -> mapped canonically by loader). */
export const MALGADRAMON_JPG_MINI_RECTS: readonly FrameRect[] = [
  { x: 101, y: 1635, w: 156, h: 153 },
  { x: 379, y: 1633, w: 163, h: 156 },
  { x: 668, y: 1634, w: 172, h: 155 },
  { x: 962, y: 1633, w: 172, h: 157 },
  { x: 1268, y: 1633, w: 171, h: 157 },
  { x: 1560, y: 1633, w: 171, h: 158 },
  { x: 1859, y: 1633, w: 163, h: 156 },
  { x: 2138, y: 1629, w: 159, h: 158 },
];
