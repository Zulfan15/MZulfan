/**
 * Standalone, engine-agnostic entrypoint for the Vamdramon character module.
 */
export { VAMDRAMON_META, type VamdramonMeta } from './vamdramon.meta';
export {
  VAMDRAMON_DEFAULT_ASSET_BASE,
  VAMDRAMON_ASSET_FILES,
  resolveVamdramonAssets,
} from './vamdramon.assets';
export {
  VAMDRAMON_ACTIONS,
  VAMDRAMON_IDLE_CLIP,
  VAMDRAMON_WALK_CLIP,
  type VamdramonActionId,
} from './vamdramon.animations';
export {
  loadVamdramon,
  getVamdramonSync,
  clearVamdramonCache,
  createVamdramonAnimator,
} from './vamdramon.loader';
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
