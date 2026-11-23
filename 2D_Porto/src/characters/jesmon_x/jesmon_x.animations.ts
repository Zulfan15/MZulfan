import type { ActionClip, DirectionalClip } from '../_shared/types';
import { JESMON_X_STEPS_PER_DIR } from './jesmon_x.frames';

/**
 * Pure animation timeline definitions for Jesmon (X Antibody) (data only).
 */
export const JESMON_X_IDLE_CLIP: DirectionalClip = {
  group: 'idle',
  framesPerDirection: JESMON_X_STEPS_PER_DIR,
  fps: 5,
};

export const JESMON_X_WALK_CLIP: DirectionalClip = {
  group: 'walk',
  framesPerDirection: JESMON_X_STEPS_PER_DIR,
  fps: 8,
};

export type JesmonXActionId = 'tekkenSeibai' | 'bladeArc' | 'crossSlash';

export const JESMON_X_ACTIONS: Record<JesmonXActionId, ActionClip> = {
  tekkenSeibai: { group: 'battle', frames: [0, 1, 2, 3], fps: 9, loop: false },
  bladeArc: { group: 'battle', frames: [0, 1, 4], fps: 8, loop: false },
  crossSlash: { group: 'battle', frames: [4, 5, 6, 7], fps: 9, loop: false },
};
