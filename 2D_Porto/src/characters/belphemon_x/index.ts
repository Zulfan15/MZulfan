/**
 * Standalone, engine-agnostic entrypoint for the Belphemon (X Antibody) character module.
 * Portfolio-specific wiring lives separately in `./adapters/portfolioDigimon.ts`.
 */
export { BELPHEMON_X_META, type BelphemonXMeta } from './belphemon_x.meta';
export {
  BELPHEMON_X_DEFAULT_ASSET_BASE,
  BELPHEMON_X_ASSET_FILES,
  resolveBelphemonXAssets,
} from './belphemon_x.assets';
export {
  BELPHEMON_X_ACTIONS,
  BELPHEMON_X_IDLE_CLIP,
  BELPHEMON_X_WALK_CLIP,
  type BelphemonXActionId,
} from './belphemon_x.animations';
export {
  loadBelphemonX,
  getBelphemonXSync,
  clearBelphemonXCache,
  createBelphemonXAnimator,
} from './belphemon_x.loader';
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
