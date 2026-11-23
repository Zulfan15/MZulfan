/**
 * Standalone, engine-agnostic entrypoint for the Ragnaloardmon character module.
 * Portfolio-specific wiring lives separately in `./adapters/portfolioDigimon.ts`.
 */
export { RAGNALOARDMON_META, type RagnaloardmonMeta } from './ragnaloardmon.meta';
export {
  RAGNALOARDMON_DEFAULT_ASSET_BASE,
  RAGNALOARDMON_ASSET_FILES,
  resolveRagnaloardmonAssets,
} from './ragnaloardmon.assets';
export {
  RAGNALOARDMON_ACTIONS,
  RAGNALOARDMON_IDLE_CLIP,
  RAGNALOARDMON_WALK_CLIP,
  type RagnaloardmonActionId,
} from './ragnaloardmon.animations';
export {
  loadRagnaloardmon,
  getRagnaloardmonSync,
  clearRagnaloardmonCache,
  createRagnaloardmonAnimator,
} from './ragnaloardmon.loader';
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
