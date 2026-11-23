/**
 * Standalone, engine-agnostic entrypoint for the Gaspiritamon character module.
 * Portfolio-specific wiring lives separately in `./adapters/portfolioDigimon.ts`.
 */
export { GASPIRITAMON_META, type GaspiritamonMeta } from './gaspiritamon.meta';
export {
  GASPIRITAMON_DEFAULT_ASSET_BASE,
  GASPIRITAMON_ASSET_FILES,
  resolveGaspiritamonAssets,
} from './gaspiritamon.assets';
export {
  GASPIRITAMON_ACTIONS,
  GASPIRITAMON_IDLE_CLIP,
  GASPIRITAMON_WALK_CLIP,
  type GaspiritamonActionId,
} from './gaspiritamon.animations';
export {
  loadGaspiritamon,
  getGaspiritamonSync,
  clearGaspiritamonCache,
  createGaspiritamonAnimator,
} from './gaspiritamon.loader';
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
