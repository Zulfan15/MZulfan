/**
 * Standalone, engine-agnostic entrypoint for the Malgadramon character module.
 * Portfolio-specific wiring lives separately in `./adapters/portfolioDigimon.ts`.
 */
export { MALGADRAMON_META, type MalgadramonMeta } from './malgadramon.meta';
export {
  MALGADRAMON_DEFAULT_ASSET_BASE,
  MALGADRAMON_ASSET_FILES,
  resolveMalgadramonAssets,
} from './malgadramon.assets';
export {
  MALGADRAMON_ACTIONS,
  MALGADRAMON_IDLE_CLIP,
  MALGADRAMON_WALK_CLIP,
  type MalgadramonActionId,
} from './malgadramon.animations';
export {
  loadMalgadramon,
  getMalgadramonSync,
  clearMalgadramonCache,
  createMalgadramonAnimator,
} from './malgadramon.loader';
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
