/**
 * Standalone, engine-agnostic entrypoint for the Gammamon character module.
 * Portfolio-specific wiring lives separately in `./adapters/portfolioDigimon.ts`.
 */
export { GAMMAMON_META, type GammamonMeta } from './gammamon.meta';
export {
  GAMMAMON_DEFAULT_ASSET_BASE,
  GAMMAMON_ASSET_FILES,
  resolveGammamonAssets,
} from './gammamon.assets';
export {
  GAMMAMON_ACTIONS,
  GAMMAMON_IDLE_CLIP,
  GAMMAMON_WALK_CLIP,
  type GammamonActionId,
} from './gammamon.animations';
export {
  loadGammamon,
  getGammamonSync,
  clearGammamonCache,
  createGammamonAnimator,
} from './gammamon.loader';
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
