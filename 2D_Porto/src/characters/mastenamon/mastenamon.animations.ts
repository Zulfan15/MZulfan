import type { ActionClip, DirectionalClip } from '../_shared/types';
import { MASTENAMON_IDLE_STEPS_PER_DIR, MASTENAMON_WALK_STEPS_PER_DIR } from './mastenamon.frames';

/**
 * Pure animation timeline definitions for Mastenamon (data only).
 */
export const MASTENAMON_IDLE_CLIP: DirectionalClip = {
  group: 'idle',
  framesPerDirection: MASTENAMON_IDLE_STEPS_PER_DIR,
  fps: 4,
};

export const MASTENAMON_WALK_CLIP: DirectionalClip = {
  group: 'walk',
  framesPerDirection: MASTENAMON_WALK_STEPS_PER_DIR,
  fps: 7,
};

export type MastenamonActionId =
  | 'attack'
  | 'holyDesire'
  | 'chaosDegradation'
  | 'guard'
  | 'recover';

export const MASTENAMON_ACTIONS: Record<MastenamonActionId, ActionClip> = {
  attack: { group: 'battle', frames: [0, 1, 2, 3], fps: 8, loop: false },
  holyDesire: { group: 'battle', frames: [4, 7], fps: 5, loop: false },
  chaosDegradation: { group: 'battle', frames: [5, 7], fps: 5, loop: false },
  guard: { group: 'battle', frames: [6], fps: 4, loop: true },
  recover: { group: 'battle', frames: [7], fps: 4, loop: false },
};
