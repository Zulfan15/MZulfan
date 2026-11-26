import type { Direction8, FrameRect } from '../_shared/types';

/**
 * Pure pixel-coordinate tables for Vexatiamon Berserker's sheets.
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

export const VEXATIAMON_BERSERKER_IDLE_STEPS_PER_DIR = 4;
export const VEXATIAMON_BERSERKER_WALK_STEPS_PER_DIR = 4;

export const VEXATIAMON_BERSERKER_IDLE_STEPS_BY_DIR: Record<Direction8, readonly CellStep[]> = {
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

export const VEXATIAMON_BERSERKER_WALK_STEPS_BY_DIR: Record<Direction8, readonly CellStep[]> =
  VEXATIAMON_BERSERKER_IDLE_STEPS_BY_DIR;

export const VEXATIAMON_BERSERKER_BATTLE_RECTS: readonly FrameRect[] = [
  gridCell4x4(0, 0),
  gridCell4x4(0, 1),
  gridCell4x4(0, 2),
  gridCell4x4(0, 3),
  gridCell4x4(1, 0),
  gridCell4x4(1, 1),
  gridCell4x4(1, 2),
  gridCell4x4(1, 3),
];

// ── vexatiamon_berserker.webp (2388x1792: icon + 8 HD poses + 8 mini sprites) ─
export const VEXATIAMON_BERSERKER_JPG_ICON_RECT: FrameRect = {
  x: 40,
  y: 47,
  w: 226,
  h: 211,
};

export const VEXATIAMON_BERSERKER_JPG_HD_SOURCES: Record<Direction8, OrientedRectSource> = {
  S: { rect: { x: 17, y: 992, w: 568, h: 520 }, flipX: false },
  SW: { rect: { x: 634, y: 992, w: 545, h: 521 }, flipX: false },
  W: { rect: { x: 1236, y: 992, w: 530, h: 522 }, flipX: false },
  NW: { rect: { x: 1814, y: 992, w: 534, h: 510 }, flipX: false },
  N: { rect: { x: 18, y: 365, w: 565, h: 516 }, flipX: false },
  NE: { rect: { x: 640, y: 365, w: 535, h: 508 }, flipX: false },
  E: { rect: { x: 1221, y: 365, w: 531, h: 517 }, flipX: false },
  SE: { rect: { x: 1803, y: 365, w: 564, h: 522 }, flipX: false },
};

export const VEXATIAMON_BERSERKER_JPG_MINI_RECTS: readonly FrameRect[] = [
  { x: 36, y: 1617, w: 226, h: 160 },
  { x: 336, y: 1617, w: 216, h: 151 },
  { x: 630, y: 1617, w: 233, h: 152 },
  { x: 926, y: 1617, w: 227, h: 166 },
  { x: 1257, y: 1617, w: 185, h: 162 },
  { x: 1559, y: 1617, w: 186, h: 164 },
  { x: 1836, y: 1617, w: 217, h: 153 },
  { x: 2128, y: 1617, w: 223, h: 152 },
];
