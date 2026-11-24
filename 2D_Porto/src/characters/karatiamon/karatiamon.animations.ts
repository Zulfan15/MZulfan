import type { ActionClip, DirectionalClip } from '../_shared/types';
import {
  KARATIAMON_IDLE_STEPS_PER_DIR,
  KARATIAMON_WALK_STEPS_PER_DIR,
} from './karatiamon.frames';

/**
 * Pure animation timeline definitions for Karatiamon (data only).
 */
export const KARATIAMON_IDLE_CLIP: DirectionalClip = {
  group: 'idle',
  framesPerDirection: KARATIAMON_IDLE_STEPS_PER_DIR,
  fps: 5,
};

export const KARATIAMON_WALK_CLIP: DirectionalClip = {
  group: 'walk',
  framesPerDirection: KARATIAMON_WALK_STEPS_PER_DIR,
  fps: 7,
};

export type KaratiamonActionId =
  | 'violetHexBlade'
  | 'nocturneSlashLeft'
  | 'nocturneSlashRight';

export const KARATIAMON_ACTIONS: Record<KaratiamonActionId, ActionClip> = {
  violetHexBlade: { group: 'battle', frames: [0, 1, 2, 3], fps: 8, loop: false },
  nocturneSlashLeft: { group: 'battle', frames: [4, 5, 6, 7], fps: 8, loop: false },
  nocturneSlashRight: { group: 'battle', frames: [8, 9, 10, 11], fps: 8, loop: false },
};
