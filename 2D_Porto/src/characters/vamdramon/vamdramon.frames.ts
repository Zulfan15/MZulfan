import type { Direction8, FrameRect } from '../_shared/types';

/**
 * Pure pixel-coordinate tables for Vamdramon's sheets.
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

export const VAMDRAMON_IDLE_STEPS_PER_DIR = 4;
export const VAMDRAMON_WALK_STEPS_PER_DIR = 4;

export const VAMDRAMON_IDLE_STEPS_BY_DIR: Record<Direction8, readonly CellStep[]> = {
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

export const VAMDRAMON_WALK_STEPS_BY_DIR: Record<Direction8, readonly CellStep[]> =
  VAMDRAMON_IDLE_STEPS_BY_DIR;

export const VAMDRAMON_BATTLE_RECTS: readonly FrameRect[] = [
  gridCell4x4(0, 0),
  gridCell4x4(0, 1),
  gridCell4x4(0, 2),
  gridCell4x4(0, 3),
  gridCell4x4(1, 0),
  gridCell4x4(1, 1),
  gridCell4x4(1, 2),
  gridCell4x4(1, 3),
];

// ── vamdramon.webp (2388x1792: icon + 8 HD poses + 8 mini sprites) ───────────
export const VAMDRAMON_JPG_ICON_RECT: FrameRect = {
  x: 36,
  y: 38,
  w: 208,
  h: 206,
};

export const VAMDRAMON_JPG_HD_SOURCES: Record<Direction8, OrientedRectSource> = {
  S: { rect: { x: 19, y: 951, w: 559, h: 552 }, flipX: false },
  SW: { rect: { x: 654, y: 952, w: 523, h: 555 }, flipX: false },
  W: { rect: { x: 1262, y: 954, w: 528, h: 549 }, flipX: false },
  NW: { rect: { x: 1843, y: 952, w: 524, h: 541 }, flipX: false },
  N: { rect: { x: 19, y: 301, w: 559, h: 546 }, flipX: false },
  NE: { rect: { x: 618, y: 300, w: 523, h: 542 }, flipX: false },
  E: { rect: { x: 1195, y: 301, w: 526, h: 550 }, flipX: false },
  SE: { rect: { x: 1808, y: 300, w: 523, h: 554 }, flipX: false },
};

export const VAMDRAMON_JPG_MINI_RECTS: readonly FrameRect[] = [
  { x: 257, y: 1617, w: 171, h: 153 },
  { x: 511, y: 1617, w: 160, h: 157 },
  { x: 746, y: 1617, w: 172, h: 156 },
  { x: 973, y: 1617, w: 175, h: 154 },
  { x: 1240, y: 1617, w: 176, h: 154 },
  { x: 1480, y: 1617, w: 174, h: 154 },
  { x: 1707, y: 1617, w: 162, h: 156 },
  { x: 1970, y: 1617, w: 159, h: 152 },
];
