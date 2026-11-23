import { DIRECTIONS_8, type Cardinal, type Direction8 } from './types';

/** Index of a direction inside a sheet's direction order (defaults to DIRECTIONS_8). */
export function directionIndex(dir: Direction8, order: readonly Direction8[] = DIRECTIONS_8): number {
  const idx = order.indexOf(dir);
  return idx < 0 ? 0 : idx;
}

/** Collapses 8 directions to the 4 cardinals used by grid engines (diagonals keep their horizontal part). */
export function toCardinal(dir: Direction8): Cardinal {
  switch (dir) {
    case 'N':
      return 'N';
    case 'S':
      return 'S';
    case 'E':
    case 'NE':
    case 'SE':
      return 'E';
    default:
      return 'W';
  }
}

/** Screen-space movement vector (y grows downward) → nearest of 8 directions. */
export function directionFromVector(dx: number, dy: number, fallback: Direction8 = 'S'): Direction8 {
  if (dx === 0 && dy === 0) return fallback;
  // 0 rad = East, counter-clockwise positive (flip y so "up" is positive)
  const angle = Math.atan2(-dy, dx);
  const sector = Math.round(angle / (Math.PI / 4));
  const bySector: Record<number, Direction8> = {
    0: 'E',
    1: 'NE',
    2: 'N',
    3: 'NW',
    4: 'W',
    [-4]: 'W',
    [-3]: 'SW',
    [-2]: 'S',
    [-1]: 'SE',
  };
  return bySector[sector] ?? fallback;
}
