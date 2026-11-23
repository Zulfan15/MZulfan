import type { ActionClip, DirectionalClip } from '../_shared/types';
import {
  SHOGUN_ALPHAMON_IDLE_STEPS_PER_DIR,
  SHOGUN_ALPHAMON_WALK_STEPS_PER_DIR,
} from './shogun_alphamon.frames';

/**
 * Pure animation timeline definitions for Shogun Alphamon (data only).
 */
export const SHOGUN_ALPHAMON_IDLE_CLIP: DirectionalClip = {
  group: 'idle',
  framesPerDirection: SHOGUN_ALPHAMON_IDLE_STEPS_PER_DIR,
  fps: 4,
};

export const SHOGUN_ALPHAMON_WALK_CLIP: DirectionalClip = {
  group: 'walk',
  framesPerDirection: SHOGUN_ALPHAMON_WALK_STEPS_PER_DIR,
  fps: 8,
};

export type ShogunAlphamonActionId =
  | 'naginataSweep'
  | 'chargeLeft'
  | 'chargeRight';

export const SHOGUN_ALPHAMON_ACTIONS: Record<ShogunAlphamonActionId, ActionClip> = {
  naginataSweep: { group: 'battle', frames: [0, 1, 6], fps: 8, loop: false },
  chargeLeft: { group: 'battle', frames: [2, 3], fps: 7, loop: false },
  chargeRight: { group: 'battle', frames: [4, 5, 7], fps: 7, loop: false },
};
