/**
 * Single place to configure where Sakuyamon (X Antibody)'s 4 image files are served from.
 * Override via `loadSakuyamonX('/custom/path')` when embedding in another app.
 */
export const SAKUYAMON_X_DEFAULT_ASSET_BASE = '/assets/characters/sakuyamon_x';

export const SAKUYAMON_X_ASSET_FILES = {
  idle: 'idle.webp',
  walk: 'walk-cycle.webp',
  battle: 'battle.webp',
  sheet: 'sakuyamon-x.webp',
} as const;

export function resolveSakuyamonXAssets(baseUrl = SAKUYAMON_X_DEFAULT_ASSET_BASE) {
  const clean = baseUrl.replace(/\/+$/, '');
  return {
    idle: `${clean}/${SAKUYAMON_X_ASSET_FILES.idle}`,
    walk: `${clean}/${SAKUYAMON_X_ASSET_FILES.walk}`,
    battle: `${clean}/${SAKUYAMON_X_ASSET_FILES.battle}`,
    sheet: `${clean}/${SAKUYAMON_X_ASSET_FILES.sheet}`,
  };
}
