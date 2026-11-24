/**
 * Standalone, engine-agnostic entrypoint for the VictoryGrowlmon character module.
 * Portfolio-specific wiring lives separately in `./adapters/portfolioDigimon.ts`.
 */
export { VICTORYGROWLMON_META, type VictoryGrowlmonMeta } from './victorygrowlmon.meta';
export {
  VICTORYGROWLMON_DEFAULT_ASSET_BASE,
  VICTORYGROWLMON_ASSET_FILES,
  resolveVictoryGrowlmonAssets,
} from './victorygrowlmon.assets';
export {
  VICTORYGROWLMON_ACTIONS,
  VICTORYGROWLMON_IDLE_CLIP,
  VICTORYGROWLMON_WALK_CLIP,
  type VictoryGrowlmonActionId,
} from './victorygrowlmon.animations';
export {
  loadVictoryGrowlmon,
  getVictoryGrowlmonSync,
  clearVictoryGrowlmonCache,
  createVictoryGrowlmonAnimator,
} from './victorygrowlmon.loader';
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
