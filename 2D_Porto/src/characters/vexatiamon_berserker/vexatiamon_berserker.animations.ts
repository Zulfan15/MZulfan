import type { ActionClip, DirectionalClip } from '../_shared/types';
import {
  VEXATIAMON_BERSERKER_IDLE_STEPS_PER_DIR,
  VEXATIAMON_BERSERKER_WALK_STEPS_PER_DIR,
} from './vexatiamon_berserker.frames';

export const VEXATIAMON_BERSERKER_IDLE_CLIP: DirectionalClip = {
  group: 'idle',
  framesPerDirection: VEXATIAMON_BERSERKER_IDLE_STEPS_PER_DIR,
  fps: 4,
};

export const VEXATIAMON_BERSERKER_WALK_CLIP: DirectionalClip = {
  group: 'walk',
  framesPerDirection: VEXATIAMON_BERSERKER_WALK_STEPS_PER_DIR,
  fps: 7,
};

export type VexatiamonBerserkerActionId =
  | 'attack'
  | 'hyperRailSalvo'
  | 'plasmaBurst'
  | 'guard';

export const VEXATIAMON_BERSERKER_ACTIONS: Record<VexatiamonBerserkerActionId, ActionClip> = {
  attack: { group: 'battle', frames: [0, 1, 2, 3], fps: 8, loop: false },
  hyperRailSalvo: { group: 'battle', frames: [4, 5, 6], fps: 6, loop: false },
  plasmaBurst: { group: 'battle', frames: [1, 3, 5], fps: 8, loop: false },
  guard: { group: 'battle', frames: [7], fps: 4, loop: true },
};
