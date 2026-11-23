/**
 * Standalone, engine-agnostic entrypoint for the Fivedramon character module.
 * Portfolio-specific wiring lives separately in `./adapters/portfolioDigimon.ts`.
 */
export { FIVEDRAMON_META, type FivedramonMeta } from './fivedramon.meta';
export {
  FIVEDRAMON_DEFAULT_ASSET_BASE,
  FIVEDRAMON_ASSET_FILES,
  resolveFivedramonAssets,
} from './fivedramon.assets';
export {
  FIVEDRAMON_ACTIONS,
  FIVEDRAMON_IDLE_CLIP,
  FIVEDRAMON_WALK_CLIP,
  type FivedramonActionId,
} from './fivedramon.animations';
export {
  loadFivedramon,
  getFivedramonSync,
  clearFivedramonCache,
  createFivedramonAnimator,
} from './fivedramon.loader';
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
