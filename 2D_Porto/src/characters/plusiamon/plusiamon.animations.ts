import type { ActionClip, DirectionalClip } from '../_shared/types';
import { PLUSIAMON_WALK_STEPS_PER_DIR } from './plusiamon.frames';

/**
 * Pure animation timeline definitions for Plusiamon (data only).
 */
export const PLUSIAMON_IDLE_CLIP: DirectionalClip = {
  group: 'idle',
  framesPerDirection: 1,
  fps: 1,
};

export const PLUSIAMON_WALK_CLIP: DirectionalClip = {
  group: 'walk',
  framesPerDirection: PLUSIAMON_WALK_STEPS_PER_DIR,
  fps: 7,
};

export type PlusiamonActionId = 'plasmaCannon' | 'thrusterFlare' | 'bladeSweep';

export const PLUSIAMON_ACTIONS: Record<PlusiamonActionId, ActionClip> = {
  plasmaCannon: { group: 'battle', frames: [0, 1, 6], fps: 7, loop: false },
  thrusterFlare: { group: 'battle', frames: [0, 4, 5], fps: 7, loop: false },
  bladeSweep: { group: 'battle', frames: [2, 3, 7], fps: 7, loop: false },
};
