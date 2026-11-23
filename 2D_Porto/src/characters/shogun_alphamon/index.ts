/**
 * Standalone, engine-agnostic entrypoint for the Shogun Alphamon character module.
 * Portfolio-specific wiring lives separately in `./adapters/portfolioDigimon.ts`.
 */
export { SHOGUN_ALPHAMON_META, type ShogunAlphamonMeta } from './shogun_alphamon.meta';
export {
  SHOGUN_ALPHAMON_DEFAULT_ASSET_BASE,
  SHOGUN_ALPHAMON_ASSET_FILES,
  resolveShogunAlphamonAssets,
} from './shogun_alphamon.assets';
export {
  SHOGUN_ALPHAMON_ACTIONS,
  SHOGUN_ALPHAMON_IDLE_CLIP,
  SHOGUN_ALPHAMON_WALK_CLIP,
  type ShogunAlphamonActionId,
} from './shogun_alphamon.animations';
export {
  loadShogunAlphamon,
  getShogunAlphamonSync,
  clearShogunAlphamonCache,
  createShogunAlphamonAnimator,
} from './shogun_alphamon.loader';
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
