/**
 * Standalone, engine-agnostic entrypoint for the Karatiamon character module.
 * Portfolio-specific wiring lives separately in `./adapters/portfolioDigimon.ts`.
 */
export { KARATIAMON_META, type KaratiamonMeta } from './karatiamon.meta';
export {
  KARATIAMON_DEFAULT_ASSET_BASE,
  KARATIAMON_ASSET_FILES,
  resolveKaratiamonAssets,
} from './karatiamon.assets';
export {
  KARATIAMON_ACTIONS,
  KARATIAMON_IDLE_CLIP,
  KARATIAMON_WALK_CLIP,
  type KaratiamonActionId,
} from './karatiamon.animations';
export {
  loadKaratiamon,
  getKaratiamonSync,
  clearKaratiamonCache,
  createKaratiamonAnimator,
} from './karatiamon.loader';
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
