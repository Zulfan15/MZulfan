import type { ActionClip, DirectionalClip } from '../_shared/types';

/**
 * Pure animation timeline definitions for Mazagamon (data only).
 */
export const MAZAGAMON_IDLE_CLIP: DirectionalClip = {
  group: 'idle',
  framesPerDirection: 1,
  fps: 1,
};

export const MAZAGAMON_WALK_CLIP: DirectionalClip = {
  group: 'walk',
  framesPerDirection: 4,
  fps: 7,
};

export type MazagamonActionId = 'scytheSlash' | 'spearLunge' | 'abyssalOverload';

export const MAZAGAMON_ACTIONS: Record<MazagamonActionId, ActionClip> = {
  scytheSlash: { group: 'battle', frames: [1, 2, 5, 6], fps: 8, loop: false },
  spearLunge: { group: 'battle', frames: [4, 3, 7], fps: 7, loop: false },
  abyssalOverload: { group: 'battle', frames: [0, 1, 2, 6, 7], fps: 8, loop: false },
};
