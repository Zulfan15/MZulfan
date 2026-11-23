/**
 * Standalone, engine-agnostic entrypoint for the Mastenamon character module.
 * Portfolio-specific wiring lives separately in `./adapters/portfolioDigimon.ts`.
 */
export { MASTENAMON_META, type MastenamonMeta } from './mastenamon.meta';
export {
  MASTENAMON_DEFAULT_ASSET_BASE,
  MASTENAMON_ASSET_FILES,
  resolveMastenamonAssets,
} from './mastenamon.assets';
export {
  MASTENAMON_ACTIONS,
  MASTENAMON_IDLE_CLIP,
  MASTENAMON_WALK_CLIP,
  type MastenamonActionId,
} from './mastenamon.animations';
export {
  loadMastenamon,
  getMastenamonSync,
  clearMastenamonCache,
  createMastenamonAnimator,
} from './mastenamon.loader';
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
