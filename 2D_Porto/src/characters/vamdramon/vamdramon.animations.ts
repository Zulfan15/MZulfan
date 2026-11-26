import type { ActionClip, DirectionalClip } from '../_shared/types';
import {
  VAMDRAMON_IDLE_STEPS_PER_DIR,
  VAMDRAMON_WALK_STEPS_PER_DIR,
} from './vamdramon.frames';

export const VAMDRAMON_IDLE_CLIP: DirectionalClip = {
  group: 'idle',
  framesPerDirection: VAMDRAMON_IDLE_STEPS_PER_DIR,
  fps: 4,
};

export const VAMDRAMON_WALK_CLIP: DirectionalClip = {
  group: 'walk',
  framesPerDirection: VAMDRAMON_WALK_STEPS_PER_DIR,
  fps: 7,
};

export type VamdramonActionId = 'attack' | 'crimsonNocturne' | 'wingSlash' | 'guard';

export const VAMDRAMON_ACTIONS: Record<VamdramonActionId, ActionClip> = {
  attack: { group: 'battle', frames: [0, 1, 2, 3], fps: 8, loop: false },
  crimsonNocturne: { group: 'battle', frames: [4, 5, 6], fps: 6, loop: false },
  wingSlash: { group: 'battle', frames: [1, 3, 5], fps: 8, loop: false },
  guard: { group: 'battle', frames: [7], fps: 4, loop: true },
};
