/**
 * Standalone, engine-agnostic entrypoint for the Plusiamon character module.
 * Portfolio-specific wiring lives separately in `./adapters/portfolioDigimon.ts`.
 */
export { PLUSIAMON_META, type PlusiamonMeta } from './plusiamon.meta';
export {
  PLUSIAMON_DEFAULT_ASSET_BASE,
  PLUSIAMON_ASSET_FILES,
  resolvePlusiamonAssets,
} from './plusiamon.assets';
export {
  PLUSIAMON_ACTIONS,
  PLUSIAMON_IDLE_CLIP,
  PLUSIAMON_WALK_CLIP,
  type PlusiamonActionId,
} from './plusiamon.animations';
export {
  loadPlusiamon,
  getPlusiamonSync,
  clearPlusiamonCache,
  createPlusiamonAnimator,
} from './plusiamon.loader';
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
