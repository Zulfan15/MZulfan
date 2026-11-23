import type { ActionClip, DirectionalClip } from '../_shared/types';
import { RAGNALOARDMON_WALK_STEPS_PER_DIR } from './ragnaloardmon.frames';

/**
 * Pure animation timeline definitions for Ragnaloardmon (data only).
 */
export const RAGNALOARDMON_IDLE_CLIP: DirectionalClip = {
  group: 'idle',
  framesPerDirection: 1,
  fps: 1,
};

export const RAGNALOARDMON_WALK_CLIP: DirectionalClip = {
  group: 'walk',
  framesPerDirection: RAGNALOARDMON_WALK_STEPS_PER_DIR,
  fps: 7,
};

export type RagnaloardmonActionId = 'slashLeft' | 'slashRight' | 'directSmasher';

export const RAGNALOARDMON_ACTIONS: Record<RagnaloardmonActionId, ActionClip> = {
  slashLeft: { group: 'battle', frames: [3, 0, 1, 2], fps: 9, loop: false },
  slashRight: { group: 'battle', frames: [4, 5, 6, 7], fps: 9, loop: false },
  directSmasher: { group: 'battle', frames: [0, 1, 2, 6, 7], fps: 8, loop: false },
};
