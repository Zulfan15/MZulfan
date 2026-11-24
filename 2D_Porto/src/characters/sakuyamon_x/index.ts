/**
 * Standalone, engine-agnostic entrypoint for the Sakuyamon (X Antibody) character module.
 * Portfolio-specific wiring lives separately in `./adapters/portfolioDigimon.ts`.
 */
export { SAKUYAMON_X_META, type SakuyamonXMeta } from './sakuyamon_x.meta';
export {
  SAKUYAMON_X_DEFAULT_ASSET_BASE,
  SAKUYAMON_X_ASSET_FILES,
  resolveSakuyamonXAssets,
} from './sakuyamon_x.assets';
export {
  SAKUYAMON_X_ACTIONS,
  SAKUYAMON_X_IDLE_CLIP,
  SAKUYAMON_X_WALK_CLIP,
  type SakuyamonXActionId,
} from './sakuyamon_x.animations';
export {
  loadSakuyamonX,
  getSakuyamonXSync,
  clearSakuyamonXCache,
  createSakuyamonXAnimator,
} from './sakuyamon_x.loader';
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
