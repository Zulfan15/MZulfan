import type { ActionClip, DirectionalClip } from '../_shared/types';
import {
  MALGADRAMON_IDLE_STEPS_PER_DIR,
  MALGADRAMON_WALK_STEPS_PER_DIR,
} from './malgadramon.frames';

/**
 * Pure animation timeline definitions for Malgadramon (data only).
 */
export const MALGADRAMON_IDLE_CLIP: DirectionalClip = {
  group: 'idle',
  framesPerDirection: MALGADRAMON_IDLE_STEPS_PER_DIR,
  fps: 4,
};

export const MALGADRAMON_WALK_CLIP: DirectionalClip = {
  group: 'walk',
  framesPerDirection: MALGADRAMON_WALK_STEPS_PER_DIR,
  fps: 7,
};

export type MalgadramonActionId = 'attack' | 'railgun' | 'clawSlash' | 'guard';

export const MALGADRAMON_ACTIONS: Record<MalgadramonActionId, ActionClip> = {
  attack: { group: 'battle', frames: [0, 1, 2, 3], fps: 8, loop: false },
  railgun: { group: 'battle', frames: [4, 5, 6], fps: 6, loop: false },
  clawSlash: { group: 'battle', frames: [1, 3, 5], fps: 8, loop: false },
  guard: { group: 'battle', frames: [7], fps: 4, loop: true },
};
