import type { Direction8, FrameRect } from '../_shared/types';

/**
 * Pure pixel-coordinate tables for all 4 Gammamon source sheets.
 * Data only — zero Canvas or engine imports. Edit only these numbers if assets change.
 */

// ── 1. idle.jpg, walk-cycle.jpg & battle.jpg shared 8x4 grid (2752x1536) ────
const GRID_8X4_COLS: readonly [number, number][] = [
  [8, 331],
  [351, 331],
  [694, 332],
  [1038, 332],
  [1381, 333],
  [1726, 331],
  [2069, 332],
  [2413, 330],
];

const GRID_8X4_ROWS: readonly [number, number][] = [
  [6, 370],
  [388, 374],
  [773, 374],
  [1161, 369],
];

export const gridCell8x4 = (row: number, col: number): FrameRect => ({
  x: GRID_8X4_COLS[col][0],
  y: GRID_8X4_ROWS[row][0],
  w: GRID_8X4_COLS[col][1],
  h: GRID_8X4_ROWS[row][1],
});

export const GAMMAMON_STEPS_PER_DIR = 4;

export interface CellStep {
  row: number;
  col: number;
  flipX?: boolean;
  source?: 'idle' | 'walk';
}

/**
 * Verified (row, col) sequences per direction in `idle.jpg`.
 */
export const GAMMAMON_IDLE_STEPS_BY_DIR: Record<Direction8, readonly CellStep[]> = {
  S: [
    { row: 0, col: 4 },
    { row: 1, col: 4 },
    { row: 2, col: 4 },
    { row: 3, col: 4 },
  ],
  SW: [
    { row: 0, col: 5 },
    { row: 1, col: 5 },
    { row: 2, col: 5 },
    { row: 3, col: 5 },
  ],
  W: [
    { row: 0, col: 6 },
    { row: 1, col: 6 },
    { row: 2, col: 6 },
    { row: 3, col: 6 },
  ],
  NW: [
    { row: 0, col: 7 },
    { row: 1, col: 7 },
    { row: 2, col: 7 },
    { row: 3, col: 7 },
  ],
  N: [
    { row: 0, col: 0 },
    { row: 1, col: 0 },
    { row: 2, col: 0 },
    { row: 1, col: 0 },
  ],
  NE: [
    { row: 0, col: 1 },
    { row: 1, col: 1 },
    { row: 2, col: 1 },
    { row: 3, col: 1 },
  ],
  E: [
    { row: 1, col: 2 },
    { row: 2, col: 2 },
    { row: 3, col: 2 },
    { row: 2, col: 2 },
  ],
  SE: [
    { row: 0, col: 3 },
    { row: 1, col: 3 },
    { row: 2, col: 3 },
    { row: 3, col: 3 },
  ],
};

/** 4 South idle frames from `idle.jpg` col 4 for DigiDex Battle Idle showcase. */
export const GAMMAMON_LARGE_IDLE_RECTS: readonly FrameRect[] = [
  gridCell8x4(0, 4),
  gridCell8x4(1, 4),
  gridCell8x4(2, 4),
  gridCell8x4(3, 4),
];

/**
 * Verified (row, col) sequences per direction in `walk-cycle.jpg` selecting the true
 * 4-step stepping legs with consistent raised axe-tail:
 * - E: (2,1) wide stride -> (2,2) passing -> (3,3) lifted knee -> (2,3) opposite contact
 * - W: horizontal mirror of E so both legs step cleanly without tail teleportation
 * - SW/SE, NE/NW: active raised-tail diagonal strides (symmetrical mirror pairs)
 * - N: reuses `idle.jpg` col 0 (`source: 'idle'`) for steady straight-back stride & steam exhaust.
 */
export const GAMMAMON_WALK_STEPS_BY_DIR: Record<Direction8, readonly CellStep[]> = {
  S: [
    { row: 0, col: 4 },
    { row: 1, col: 4 },
    { row: 2, col: 4 },
    { row: 3, col: 4 },
  ],
  SW: [
    { row: 1, col: 0 },
    { row: 2, col: 6 },
    { row: 2, col: 5 },
    { row: 2, col: 6 },
  ],
  W: [
    { row: 2, col: 1, flipX: true },
    { row: 2, col: 2, flipX: true },
    { row: 3, col: 3, flipX: true },
    { row: 2, col: 3, flipX: true },
  ],
  NW: [
    { row: 1, col: 1, flipX: true },
    { row: 2, col: 0, flipX: true },
    { row: 3, col: 0, flipX: true },
    { row: 3, col: 1, flipX: true },
  ],
  N: [
    { row: 0, col: 0, source: 'idle' },
    { row: 1, col: 0, source: 'idle' },
    { row: 2, col: 0, source: 'idle' },
    { row: 1, col: 0, source: 'idle' },
  ],
  NE: [
    { row: 1, col: 1 },
    { row: 2, col: 0 },
    { row: 3, col: 0 },
    { row: 3, col: 1 },
  ],
  E: [
    { row: 2, col: 1 },
    { row: 2, col: 2 },
    { row: 3, col: 3 },
    { row: 2, col: 3 },
  ],
  SE: [
    { row: 1, col: 0, flipX: true },
    { row: 2, col: 6, flipX: true },
    { row: 2, col: 5, flipX: true },
    { row: 2, col: 6, flipX: true },
  ],
};

// ── 2. battle.jpg Steam-Stack Cannon & Fiery Axe-Tail Sweeps ───────────────
export const GAMMAMON_BATTLE_RECTS: readonly FrameRect[] = [
  gridCell8x4(1, 2), // 0: thruster ignite crouch
  gridCell8x4(2, 0), // 1: winding armored tail swing
  gridCell8x4(2, 1), // 2: blazing axe-tail crescent sweep
  gridCell8x4(2, 3), // 3: full turbine flame axe arc
  gridCell8x4(3, 4), // 4: front steam-stack cannon stance
  gridCell8x4(1, 5), // 5: thruster flare kickback
  gridCell8x4(1, 0), // 6: dual exhaust ignition
  gridCell8x4(2, 2), // 7: boosted side panzer charge
];

// ── 3. gammamon.jpg (2400x1792: icon + 8 HD portraits + 8 mini thumbs) ─────
export const GAMMAMON_JPG_ICON_RECT: FrameRect = {
  x: 24,
  y: 20,
  w: 156,
  h: 132,
};

/** 8 HD portraits ordered canonically as `DIRECTIONS_8` (`S, SW, W, NW, N, NE, E, SE`). */
export const GAMMAMON_JPG_HD_RECTS: readonly FrameRect[] = [
  { x: 176, y: 974, w: 430, h: 650 },   // S
  { x: 642, y: 974, w: 615, h: 650 },   // SW
  { x: 1258, y: 974, w: 572, h: 650 },  // W
  { x: 1838, y: 974, w: 486, h: 650 },  // NW
  { x: 48, y: 214, w: 512, h: 668 },    // N
  { x: 640, y: 214, w: 525, h: 668 },   // NE
  { x: 1176, y: 214, w: 589, h: 668 },  // E
  { x: 1766, y: 214, w: 604, h: 668 },  // SE
];

const MINI_SPANS: readonly [number, number][] = [
  [816, 84],
  [906, 92],
  [1001, 91],
  [1097, 90],
  [1195, 94],
  [1295, 91],
  [1391, 91],
  [1494, 83],
];

export const GAMMAMON_JPG_MINI_RECTS: readonly FrameRect[] = MINI_SPANS.map(([x, w]) => ({
  x,
  y: 1690,
  w,
  h: 100,
}));
