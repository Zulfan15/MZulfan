import type { ActionClip, DirectionalClip } from '../_shared/types';
import { HOLLOKNIGHTMON_STEPS_PER_DIR } from './holloknightmon.frames';

/**
 * Pure animation timeline definitions for Holloknightmon (data only).
 */
export const HOLLOKNIGHTMON_IDLE_CLIP: DirectionalClip = {
  group: 'idle',
  framesPerDirection: HOLLOKNIGHTMON_STEPS_PER_DIR,
  fps: 5,
};

export const HOLLOKNIGHTMON_WALK_CLIP: DirectionalClip = {
  group: 'walk',
  framesPerDirection: HOLLOKNIGHTMON_STEPS_PER_DIR,
  fps: 7,
};

export type HolloknightmonActionId = 'radianceDecree' | 'solarThrust' | 'greatswordCleave';

export const HOLLOKNIGHTMON_ACTIONS: Record<HolloknightmonActionId, ActionClip> = {
  radianceDecree: { group: 'battle', frames: [0, 1, 2, 3], fps: 8, loop: false },
  solarThrust: { group: 'battle', frames: [0, 1, 2], fps: 8, loop: false },
  greatswordCleave: { group: 'battle', frames: [4, 5, 6, 7], fps: 8, loop: false },
};
