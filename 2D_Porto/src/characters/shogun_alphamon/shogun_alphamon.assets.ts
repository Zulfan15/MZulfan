/**
 * Single place to configure where Shogun Alphamon's 4 image files are served from.
 * Override via `loadShogunAlphamon('/custom/path')` when embedding in another app.
 */
export const SHOGUN_ALPHAMON_DEFAULT_ASSET_BASE = '/assets/characters/shogun_alphamon';

export const SHOGUN_ALPHAMON_ASSET_FILES = {
  idle: 'idle.webp',
  walk: 'walk-cycle.webp',
  battle: 'battle.webp',
  sheet: 'shogun-alphamon.webp',
} as const;

export function resolveShogunAlphamonAssets(baseUrl = SHOGUN_ALPHAMON_DEFAULT_ASSET_BASE) {
  const clean = baseUrl.replace(/\/+$/, '');
  return {
    idle: `${clean}/${SHOGUN_ALPHAMON_ASSET_FILES.idle}`,
    walk: `${clean}/${SHOGUN_ALPHAMON_ASSET_FILES.walk}`,
    battle: `${clean}/${SHOGUN_ALPHAMON_ASSET_FILES.battle}`,
    sheet: `${clean}/${SHOGUN_ALPHAMON_ASSET_FILES.sheet}`,
  };
}
