import type { ActionClip, DirectionalClip } from '../_shared/types';
import {
  BELPHEMON_X_IDLE_STEPS_PER_DIR,
  BELPHEMON_X_WALK_STEPS_PER_DIR,
} from './belphemon_x.frames';

/**
 * Pure animation timeline definitions for Belphemon (X Antibody) (data only).
 */
export const BELPHEMON_X_IDLE_CLIP: DirectionalClip = {
  group: 'idle',
  framesPerDirection: BELPHEMON_X_IDLE_STEPS_PER_DIR,
  fps: 5,
};

export const BELPHEMON_X_WALK_CLIP: DirectionalClip = {
  group: 'walk',
  framesPerDirection: BELPHEMON_X_WALK_STEPS_PER_DIR,
  fps: 7,
};

export type BelphemonXActionId =
  | 'seventhFullCluster'
  | 'crimsonClawLeft'
  | 'crimsonClawRight';

export const BELPHEMON_X_ACTIONS: Record<BelphemonXActionId, ActionClip> = {
  seventhFullCluster: { group: 'battle', frames: [0, 1, 2, 3], fps: 8, loop: false },
  crimsonClawLeft: { group: 'battle', frames: [4, 5, 6, 7], fps: 8, loop: false },
  crimsonClawRight: { group: 'battle', frames: [8, 9, 10, 11], fps: 8, loop: false },
};
