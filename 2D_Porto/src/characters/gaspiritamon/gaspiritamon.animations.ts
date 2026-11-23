import type { ActionClip, DirectionalClip } from '../_shared/types';
import { GASPIRITAMON_WALK_STEPS_PER_DIR } from './gaspiritamon.frames';

/**
 * Pure animation timeline definitions for Gaspiritamon (data only).
 */
export const GASPIRITAMON_IDLE_CLIP: DirectionalClip = {
  group: 'idle',
  framesPerDirection: 1,
  fps: 4,
};

export const GASPIRITAMON_WALK_CLIP: DirectionalClip = {
  group: 'walk',
  framesPerDirection: GASPIRITAMON_WALK_STEPS_PER_DIR,
  fps: 7,
};

export type GaspiritamonActionId = 'fenrirMaelstrom' | 'wolfLunge' | 'runeSweep';

export const GASPIRITAMON_ACTIONS: Record<GaspiritamonActionId, ActionClip> = {
  fenrirMaelstrom: { group: 'battle', frames: [0, 1, 2, 3], fps: 8, loop: false },
  wolfLunge: { group: 'battle', frames: [0, 1, 7], fps: 8, loop: false },
  runeSweep: { group: 'battle', frames: [4, 5, 6, 7], fps: 8, loop: false },
};
