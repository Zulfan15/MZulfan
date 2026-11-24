import type { ActionClip, DirectionalClip } from '../_shared/types';
import {
  VICTORYGROWLMON_IDLE_STEPS_PER_DIR,
  VICTORYGROWLMON_WALK_STEPS_PER_DIR,
} from './victorygrowlmon.frames';

/**
 * Pure animation timeline definitions for VictoryGrowlmon (data only).
 */
export const VICTORYGROWLMON_IDLE_CLIP: DirectionalClip = {
  group: 'idle',
  framesPerDirection: VICTORYGROWLMON_IDLE_STEPS_PER_DIR,
  fps: 5,
};

export const VICTORYGROWLMON_WALK_CLIP: DirectionalClip = {
  group: 'walk',
  framesPerDirection: VICTORYGROWLMON_WALK_STEPS_PER_DIR,
  fps: 8,
};

export type VictoryGrowlmonActionId =
  | 'dramonVictorySlash'
  | 'jetLanceLeft'
  | 'jetLanceRight';

export const VICTORYGROWLMON_ACTIONS: Record<VictoryGrowlmonActionId, ActionClip> = {
  dramonVictorySlash: { group: 'battle', frames: [0, 1, 2, 3], fps: 8, loop: false },
  jetLanceLeft: { group: 'battle', frames: [4, 5, 6, 7], fps: 8, loop: false },
  jetLanceRight: { group: 'battle', frames: [8, 9, 10, 11], fps: 8, loop: false },
};
