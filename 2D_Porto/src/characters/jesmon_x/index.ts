/**
 * Standalone, engine-agnostic entrypoint for the Jesmon (X Antibody) character module.
 * Portfolio-specific wiring lives separately in `./adapters/portfolioDigimon.ts`.
 */
export { JESMON_X_META, type JesmonXMeta } from './jesmon_x.meta';
export {
  JESMON_X_DEFAULT_ASSET_BASE,
  JESMON_X_ASSET_FILES,
  resolveJesmonXAssets,
} from './jesmon_x.assets';
export {
  JESMON_X_ACTIONS,
  JESMON_X_IDLE_CLIP,
  JESMON_X_WALK_CLIP,
  type JesmonXActionId,
} from './jesmon_x.animations';
export {
  loadJesmonX,
  getJesmonXSync,
  clearJesmonXCache,
  createJesmonXAnimator,
} from './jesmon_x.loader';
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
