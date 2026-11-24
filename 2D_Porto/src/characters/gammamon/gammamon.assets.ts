/**
 * Single place to configure where Gammamon's 4 image files are served from.
 * Override via `loadGammamon('/custom/path')` when embedding in another app.
 */
export const GAMMAMON_DEFAULT_ASSET_BASE = '/assets/characters/gammamon';

export const GAMMAMON_ASSET_FILES = {
  idle: 'idle.webp',
  walk: 'walk-cycle.webp',
  battle: 'battle.webp',
  sheet: 'gammamon.webp',
} as const;

export function resolveGammamonAssets(baseUrl = GAMMAMON_DEFAULT_ASSET_BASE) {
  const clean = baseUrl.replace(/\/+$/, '');
  return {
    idle: `${clean}/${GAMMAMON_ASSET_FILES.idle}`,
    walk: `${clean}/${GAMMAMON_ASSET_FILES.walk}`,
    battle: `${clean}/${GAMMAMON_ASSET_FILES.battle}`,
    sheet: `${clean}/${GAMMAMON_ASSET_FILES.sheet}`,
  };
}
