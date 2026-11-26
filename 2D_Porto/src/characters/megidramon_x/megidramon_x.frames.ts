import type { Direction8, FrameRect } from '../_shared/types';

/**
 * Pure pixel-coordinate tables for Megidramon (X Antibody)'s sheets.
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

export function gridCell4x4(row: number, col: number, size = 256, pad = 6): FrameRect {
  return {
    x: col * size + pad,
    y: row * size + pad,
    w: size - pad * 2,
    h: size - pad * 2,
  };
}

export const MEGIDRAMON_X_IDLE_STEPS_PER_DIR = 4;
export const MEGIDRAMON_X_WALK_STEPS_PER_DIR = 4;

export const MEGIDRAMON_X_IDLE_STEPS_BY_DIR: Record<Direction8, readonly CellStep[]> = {
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

export const MEGIDRAMON_X_WALK_STEPS_BY_DIR: Record<Direction8, readonly CellStep[]> =
  MEGIDRAMON_X_IDLE_STEPS_BY_DIR;

export const MEGIDRAMON_X_BATTLE_RECTS: readonly FrameRect[] = [
  gridCell4x4(0, 0),
  gridCell4x4(0, 1),
  gridCell4x4(0, 2),
  gridCell4x4(0, 3),
  gridCell4x4(1, 0),
  gridCell4x4(1, 1),
  gridCell4x4(1, 2),
  gridCell4x4(1, 3),
];

// ── megidramon_x.webp (2400x1792: icon + 8 HD poses + 6 mini sprites) ────────
export const MEGIDRAMON_X_JPG_ICON_RECT: FrameRect = {
  x: 2,
  y: 2,
  w: 161,
  h: 154,
};

const HD_SE_RECT: FrameRect = { x: 1781, y: 247, w: 591, h: 610 };

export const MEGIDRAMON_X_JPG_HD_SOURCES: Record<Direction8, OrientedRectSource> = {
  S: { rect: { x: 0, y: 964, w: 696, h: 619 }, flipX: false },
  SW: { rect: HD_SE_RECT, flipX: true },
  W: { rect: { x: 1335, y: 971, w: 479, h: 613 }, flipX: false },
  NW: { rect: { x: 1855, y: 983, w: 511, h: 602 }, flipX: false },
  N: { rect: { x: 0, y: 265, w: 711, h: 594 }, flipX: false },
  NE: { rect: { x: 697, y: 267, w: 497, h: 589 }, flipX: false },
  E: { rect: { x: 1272, y: 240, w: 451, h: 618 }, flipX: false },
  SE: { rect: HD_SE_RECT, flipX: false },
};

export const MEGIDRAMON_X_JPG_MINI_RECTS: readonly FrameRect[] = [
  { x: 577, y: 1617, w: 205, h: 169 },
  { x: 786, y: 1617, w: 204, h: 169 },
  { x: 994, y: 1617, w: 204, h: 169 },
  { x: 1202, y: 1617, w: 204, h: 169 },
  { x: 1410, y: 1617, w: 204, h: 169 },
  { x: 1618, y: 1617, w: 205, h: 169 },
];
