/**
 * Standalone, engine-agnostic entrypoint for the Vexatiamon Berserker character module.
 */
export {
  VEXATIAMON_BERSERKER_META,
  type VexatiamonBerserkerMeta,
} from './vexatiamon_berserker.meta';
export {
  VEXATIAMON_BERSERKER_DEFAULT_ASSET_BASE,
  VEXATIAMON_BERSERKER_ASSET_FILES,
  resolveVexatiamonBerserkerAssets,
} from './vexatiamon_berserker.assets';
export {
  VEXATIAMON_BERSERKER_ACTIONS,
  VEXATIAMON_BERSERKER_IDLE_CLIP,
  VEXATIAMON_BERSERKER_WALK_CLIP,
  type VexatiamonBerserkerActionId,
} from './vexatiamon_berserker.animations';
export {
  loadVexatiamonBerserker,
  getVexatiamonBerserkerSync,
  clearVexatiamonBerserkerCache,
  createVexatiamonBerserkerAnimator,
} from './vexatiamon_berserker.loader';
export { directionFromVector, toCardinal } from '../_shared/direction';
export { CharacterAnimator, type DrawOptions } from '../_shared/CharacterAnimator';
export {
  DIRECTIONS_8,
  type ActionClip,
  type Cardinal,
  type CharacterFrame,
  type CharacterSpriteSet,
  type Direction8,
  type DirectionalClip,
  type FrameRect,
} from '../_shared/types';
