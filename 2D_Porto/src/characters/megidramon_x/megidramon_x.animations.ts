import type { ActionClip, DirectionalClip } from '../_shared/types';
import {
  MEGIDRAMON_X_IDLE_STEPS_PER_DIR,
  MEGIDRAMON_X_WALK_STEPS_PER_DIR,
} from './megidramon_x.frames';

export const MEGIDRAMON_X_IDLE_CLIP: DirectionalClip = {
  group: 'idle',
  framesPerDirection: MEGIDRAMON_X_IDLE_STEPS_PER_DIR,
  fps: 4,
};

export const MEGIDRAMON_X_WALK_CLIP: DirectionalClip = {
  group: 'walk',
  framesPerDirection: MEGIDRAMON_X_WALK_STEPS_PER_DIR,
  fps: 7,
};

export type MegidramonXActionId = 'attack' | 'hellHowling' | 'magmaCoil' | 'guard';

export const MEGIDRAMON_X_ACTIONS: Record<MegidramonXActionId, ActionClip> = {
  attack: { group: 'battle', frames: [0, 1, 2, 3], fps: 8, loop: false },
  hellHowling: { group: 'battle', frames: [4, 5, 6], fps: 6, loop: false },
  magmaCoil: { group: 'battle', frames: [1, 3, 5], fps: 8, loop: false },
  guard: { group: 'battle', frames: [7], fps: 4, loop: true },
};
