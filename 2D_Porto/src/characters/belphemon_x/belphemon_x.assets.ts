/**
 * Single place to configure where Belphemon (X Antibody)'s 4 image files are served from.
 * Override via `loadBelphemonX('/custom/path')` when embedding in another app.
 */
export const BELPHEMON_X_DEFAULT_ASSET_BASE = '/assets/characters/belphemon_x';

export const BELPHEMON_X_ASSET_FILES = {
  idle: 'idle.webp',
  walk: 'walk-cycle-v2.webp',
  battle: 'battle.webp',
  sheet: 'belphemon-x.webp',
} as const;

export function resolveBelphemonXAssets(baseUrl = BELPHEMON_X_DEFAULT_ASSET_BASE) {
  const clean = baseUrl.replace(/\/+$/, '');
  return {
    idle: `${clean}/${BELPHEMON_X_ASSET_FILES.idle}`,
    walk: `${clean}/${BELPHEMON_X_ASSET_FILES.walk}`,
    battle: `${clean}/${BELPHEMON_X_ASSET_FILES.battle}`,
    sheet: `${clean}/${BELPHEMON_X_ASSET_FILES.sheet}`,
  };
}
