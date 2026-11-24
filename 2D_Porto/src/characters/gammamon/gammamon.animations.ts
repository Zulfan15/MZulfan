import type { ActionClip, DirectionalClip } from '../_shared/types';
import { GAMMAMON_STEPS_PER_DIR } from './gammamon.frames';

/**
 * Pure animation timeline definitions for Gammamon (data only).
 */
export const GAMMAMON_IDLE_CLIP: DirectionalClip = {
  group: 'idle',
  framesPerDirection: GAMMAMON_STEPS_PER_DIR,
  fps: 5,
};

export const GAMMAMON_WALK_CLIP: DirectionalClip = {
  group: 'walk',
  framesPerDirection: GAMMAMON_STEPS_PER_DIR,
  fps: 7,
};

export type GammamonActionId = 'steamStackCannon' | 'axeTailSweep' | 'thrusterRoar';

export const GAMMAMON_ACTIONS: Record<GammamonActionId, ActionClip> = {
  steamStackCannon: { group: 'battle', frames: [0, 1, 2, 3], fps: 8, loop: false },
  axeTailSweep: { group: 'battle', frames: [1, 2, 3], fps: 8, loop: false },
  thrusterRoar: { group: 'battle', frames: [4, 5, 6, 7], fps: 8, loop: false },
};
