/**
 * Standalone, engine-agnostic entrypoint for the Holloknightmon character module.
 * Portfolio-specific wiring lives separately in `./adapters/portfolioDigimon.ts`.
 */
export { HOLLOKNIGHTMON_META, type HolloknightmonMeta } from './holloknightmon.meta';
export {
  HOLLOKNIGHTMON_DEFAULT_ASSET_BASE,
  HOLLOKNIGHTMON_ASSET_FILES,
  resolveHolloknightmonAssets,
} from './holloknightmon.assets';
export {
  HOLLOKNIGHTMON_ACTIONS,
  HOLLOKNIGHTMON_IDLE_CLIP,
  HOLLOKNIGHTMON_WALK_CLIP,
  type HolloknightmonActionId,
} from './holloknightmon.animations';
export {
  loadHolloknightmon,
  getHolloknightmonSync,
  clearHolloknightmonCache,
  createHolloknightmonAnimator,
} from './holloknightmon.loader';
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
