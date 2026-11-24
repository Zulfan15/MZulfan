import type { ActionClip, DirectionalClip } from '../_shared/types';
import {
  SAKUYAMON_X_IDLE_STEPS_PER_DIR,
  SAKUYAMON_X_WALK_STEPS_PER_DIR,
} from './sakuyamon_x.frames';

/**
 * Pure animation timeline definitions for Sakuyamon (X Antibody) (data only).
 */
export const SAKUYAMON_X_IDLE_CLIP: DirectionalClip = {
  group: 'idle',
  framesPerDirection: SAKUYAMON_X_IDLE_STEPS_PER_DIR,
  fps: 5,
};

export const SAKUYAMON_X_WALK_CLIP: DirectionalClip = {
  group: 'walk',
  framesPerDirection: SAKUYAMON_X_WALK_STEPS_PER_DIR,
  fps: 8,
};

export type SakuyamonXActionId =
  | 'izunaAmaterasu'
  | 'kitsuneFlameLeft'
  | 'kitsuneFlameRight';

export const SAKUYAMON_X_ACTIONS: Record<SakuyamonXActionId, ActionClip> = {
  izunaAmaterasu: { group: 'battle', frames: [0, 1, 2, 3], fps: 8, loop: false },
  kitsuneFlameLeft: { group: 'battle', frames: [4, 5, 6, 7], fps: 8, loop: false },
  kitsuneFlameRight: { group: 'battle', frames: [8, 9, 10, 11], fps: 8, loop: false },
};
