/**
 * Standalone, engine-agnostic entrypoint for the Mazagamon character module.
 * Portfolio-specific wiring lives separately in `./adapters/portfolioDigimon.ts`.
 */
export { MAZAGAMON_META, type MazagamonMeta } from './mazagamon.meta';
export {
  MAZAGAMON_DEFAULT_ASSET_BASE,
  MAZAGAMON_ASSET_FILES,
  resolveMazagamonAssets,
} from './mazagamon.assets';
export {
  MAZAGAMON_ACTIONS,
  MAZAGAMON_IDLE_CLIP,
  MAZAGAMON_WALK_CLIP,
  type MazagamonActionId,
} from './mazagamon.animations';
export {
  loadMazagamon,
  getMazagamonSync,
  clearMazagamonCache,
  createMazagamonAnimator,
} from './mazagamon.loader';
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
