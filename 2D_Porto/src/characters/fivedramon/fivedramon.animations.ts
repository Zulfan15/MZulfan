import type { ActionClip, DirectionalClip } from '../_shared/types';
import { FIVEDRAMON_WALK_STEPS_PER_DIR } from './fivedramon.frames';

/**
 * Pure animation timeline definitions for Fivedramon (data only).
 */
export const FIVEDRAMON_IDLE_CLIP: DirectionalClip = {
  group: 'idle',
  framesPerDirection: 1,
  fps: 1,
};

export const FIVEDRAMON_WALK_CLIP: DirectionalClip = {
  group: 'walk',
  framesPerDirection: FIVEDRAMON_WALK_STEPS_PER_DIR,
  fps: 7,
};

export type FivedramonActionId = 'elementalBreath' | 'grandCrossBreaker' | 'wingGuard';

export const FIVEDRAMON_ACTIONS: Record<FivedramonActionId, ActionClip> = {
  elementalBreath: { group: 'battle', frames: [1, 2, 3], fps: 7, loop: false },
  grandCrossBreaker: { group: 'battle', frames: [5, 6, 7], fps: 7, loop: false },
  wingGuard: { group: 'battle', frames: [4], fps: 4, loop: true },
};
