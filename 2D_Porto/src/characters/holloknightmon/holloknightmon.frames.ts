import type { Direction8, FrameRect } from '../_shared/types';

/**
 * Pure pixel-coordinate tables for all 4 Holloknightmon source sheets.
 * Data only — zero Canvas or engine imports. Edit only these numbers if assets change.
 */

// ── 1. idle.jpg & battle.jpg shared 8x4 grid (2752x1536) ───────────────────
const GRID_8X4_COLS: readonly [number, number][] = [
  [9, 329],
  [352, 328],
  [695, 330],
  [1039, 330],
  [1383, 330],
  [1727, 329],
  [2071, 328],
  [2415, 328],
];

const GRID_8X4_ROWS: readonly [number, number][] = [
  [6, 368],
  [390, 371],
  [775, 372],
  [1165, 366],
];

export const gridCell8x4 = (row: number, col: number): FrameRect => ({
  x: GRID_8X4_COLS[col][0],
  y: GRID_8X4_ROWS[row][0],
  w: GRID_8X4_COLS[col][1],
  h: GRID_8X4_ROWS[row][1],
});

// ── 1b. walk-cycle-v2.jpg 4x4 generated bipedal stride sheet (1024x1024) ──
const WALK_GRID_COLS: readonly [number, number][] = [
  [2, 252],
  [258, 252],
  [514, 251],
  [770, 252],
];

const WALK_GRID_ROWS: readonly [number, number][] = [
  [2, 251],   // 0: S (front bipedal march on cols 1..3; col 0 hovering idle skipped)
  [259, 250], // 1: mixed W/E (unused; W mirrors Row 3)
  [514, 251], // 2: N (cols 0,2 straight back) & NE/NW (cols 1,3 3/4 back)
  [771, 251], // 3: E (full 4-frame right-facing bipedal stride with greatsword)
];

export const walkCell = (row: number, col: number): FrameRect => ({
  x: WALK_GRID_COLS[col][0],
  y: WALK_GRID_ROWS[row][0],
  w: WALK_GRID_COLS[col][1],
  h: WALK_GRID_ROWS[row][1],
});

export const HOLLOKNIGHTMON_STEPS_PER_DIR = 4;

export interface CellStep {
  row: number;
  col: number;
  flipX?: boolean;
}

/**
 * Verified (row, col) sequences per direction in `idle.jpg`:
 * - S : (2,0), (1,4), (2,4), (3,4) — cohesive 4-frame hovering South arbiter pose (excludes spread-leg (0,4))
 * - SW: (0,5)..(3,5) — 3/4 front-left
 * - W : horizontally mirrors Col 2 (0,2), (1,2), (2,2) so every West idle frame keeps full wings
 * - NW: (0,7)..(3,7) — back-left / back with shifting stance
 * - N : (0,0), (1,0) — symmetrical full-cape straight back
 * - NE: (0,1), (1,1) — 3/4 back-right
 * - E : (0,2), (1,2), (2,2), (1,2) — pure right profile with consistent full wings (avoids (3,2) sword pop-in)
 * - SE: (1,3), (2,3), (3,3) — 3/4 front-right (excludes (0,3) which is pure profile)
 */
export const HOLLOKNIGHTMON_IDLE_STEPS_BY_DIR: Record<Direction8, readonly CellStep[]> = {
  S: [
    { row: 2, col: 0 },
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
    { row: 0, col: 2, flipX: true },
    { row: 1, col: 2, flipX: true },
    { row: 2, col: 2, flipX: true },
    { row: 1, col: 2, flipX: true },
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
    { row: 0, col: 0 },
    { row: 1, col: 0 },
  ],
  NE: [
    { row: 0, col: 1 },
    { row: 1, col: 1 },
    { row: 0, col: 1 },
    { row: 1, col: 1 },
  ],
  E: [
    { row: 0, col: 2 },
    { row: 1, col: 2 },
    { row: 2, col: 2 },
    { row: 1, col: 2 },
  ],
  SE: [
    { row: 1, col: 3 },
    { row: 2, col: 3 },
    { row: 3, col: 3 },
    { row: 2, col: 3 },
  ],
};

/**
 * 4 high-res hovering South frames in `idle.jpg` for DigiDex Battle Idle showcase.
 */
export const HOLLOKNIGHTMON_LARGE_IDLE_RECTS: readonly FrameRect[] = [
  gridCell8x4(2, 0),
  gridCell8x4(1, 4),
  gridCell8x4(2, 4),
  gridCell8x4(3, 4),
];

/**
 * Verified (row, col) bipedal walk sequences in generated `walk-cycle-v2.jpg` (4x4):
 * - `S`    : Row 0 `[c1, c2, c3, c2]` alternating front knee/boot march (excludes hovering `c0`).
 * - `E/SE` : Row 3 `[c0, c1, c2, c3]` right-facing 4-step bipedal stride with silver greatsword.
 * - `W/SW` : horizontally mirrors Row 3 (`flipX: true`) since Row 1 mixes left/right.
 * - `N`    : Row 2 `[c0, c2, c0, c2]` straight-back boots & flowing cloak.
 * - `NE`   : Row 2 `[c1, c3, c1, c3]` 3/4 back-right stride; `NW` mirrors `NE` horizontally.
 */
export const HOLLOKNIGHTMON_WALK_STEPS_BY_DIR: Record<Direction8, readonly CellStep[]> = {
  S: [
    { row: 0, col: 1 },
    { row: 0, col: 2 },
    { row: 0, col: 3 },
    { row: 0, col: 2 },
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
    { row: 2, col: 1, flipX: true },
    { row: 2, col: 3, flipX: true },
    { row: 2, col: 1, flipX: true },
    { row: 2, col: 3, flipX: true },
  ],
  N: [
    { row: 2, col: 0 },
    { row: 2, col: 2 },
    { row: 2, col: 0 },
    { row: 2, col: 2 },
  ],
  NE: [
    { row: 2, col: 1 },
    { row: 2, col: 3 },
    { row: 2, col: 1 },
    { row: 2, col: 3 },
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

// ── 2. battle.jpg sequential Radiance Decree greatsword & solar slashes ─────
export const HOLLOKNIGHTMON_BATTLE_RECTS: readonly FrameRect[] = [
  gridCell8x4(2, 0), // 0: Row 2 wind-up lunge stance with silver greatsword
  gridCell8x4(2, 1), // 1: Row 2 greatsword ignites in golden solar flames
  gridCell8x4(2, 3), // 2: Row 2 sweeping golden solar crescent slash arc
  gridCell8x4(2, 4), // 3: Row 2 full Radiance Decree solar burst wave
  gridCell8x4(3, 0), // 4: Row 3 high greatsword guard wind-up
  gridCell8x4(3, 1), // 5: Row 3 mid diagonal greatsword thrust
  gridCell8x4(3, 2), // 6: Row 3 low diagonal greatsword cleave
  gridCell8x4(3, 5), // 7: Row 3 deep finishing cleave
];

// ── 3. holloknightmon.jpg (2400x1792: icon + 8 HD portraits + 8 mini thumbs) ─
export const HOLLOKNIGHTMON_JPG_ICON_RECT: FrameRect = {
  x: 16,
  y: 12,
  w: 230,
  h: 234,
};

/** 8 HD portraits ordered canonically as `DIRECTIONS_8` (`S, SW, W, NW, N, NE, E, SE`). */
export const HOLLOKNIGHTMON_JPG_HD_RECTS: readonly FrameRect[] = [
  { x: 25, y: 928, w: 660, h: 616 },   // S
  { x: 686, y: 928, w: 587, h: 616 },  // SW
  { x: 1274, y: 928, w: 480, h: 616 }, // W
  { x: 1795, y: 928, w: 575, h: 616 }, // NW
  { x: 38, y: 202, w: 636, h: 645 },   // N
  { x: 712, y: 202, w: 522, h: 645 },  // NE
  { x: 1320, y: 202, w: 310, h: 645 }, // E
  { x: 1850, y: 202, w: 530, h: 645 }, // SE
];

const MINI_SPANS: readonly [number, number][] = [
  [272, 176],
  [516, 184],
  [770, 185],
  [1006, 150],
  [1264, 150],
  [1474, 182],
  [1728, 182],
  [1984, 178],
];

export const HOLLOKNIGHTMON_JPG_MINI_RECTS: readonly FrameRect[] = MINI_SPANS.map(([x, w]) => ({
  x,
  y: 1630,
  w,
  h: 156,
}));
