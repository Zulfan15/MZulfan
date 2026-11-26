/**
 * Standalone, engine-agnostic entrypoint for the Megidramon (X Antibody) character module.
 */
export { MEGIDRAMON_X_META, type MegidramonXMeta } from './megidramon_x.meta';
export {
  MEGIDRAMON_X_DEFAULT_ASSET_BASE,
  MEGIDRAMON_X_ASSET_FILES,
  resolveMegidramonXAssets,
} from './megidramon_x.assets';
export {
  MEGIDRAMON_X_ACTIONS,
  MEGIDRAMON_X_IDLE_CLIP,
  MEGIDRAMON_X_WALK_CLIP,
  type MegidramonXActionId,
} from './megidramon_x.animations';
export {
  loadMegidramonX,
  getMegidramonXSync,
  clearMegidramonXCache,
  createMegidramonXAnimator,
} from './megidramon_x.loader';
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
