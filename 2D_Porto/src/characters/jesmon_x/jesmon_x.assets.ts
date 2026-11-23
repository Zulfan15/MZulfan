/**
 * Single place to configure where Jesmon (X Antibody)'s 5 image files are served from.
 * Override via `loadJesmonX('/custom/path')` when embedding in another app.
 */
export const JESMON_X_DEFAULT_ASSET_BASE = '/assets/characters/jesmon_x';

export const JESMON_X_ASSET_FILES = {
  idle: 'idle.jpg',
  walk: 'walk-cycle.jpg',
  battle: 'battle.jpg',
  sheet: 'jesmon-x.jpg',
  ds: 'jesmon-x-ds.jpg',
} as const;

export function resolveJesmonXAssets(baseUrl = JESMON_X_DEFAULT_ASSET_BASE) {
  const clean = baseUrl.replace(/\/+$/, '');
  return {
    idle: `${clean}/${JESMON_X_ASSET_FILES.idle}`,
    walk: `${clean}/${JESMON_X_ASSET_FILES.walk}`,
    battle: `${clean}/${JESMON_X_ASSET_FILES.battle}`,
    sheet: `${clean}/${JESMON_X_ASSET_FILES.sheet}`,
    ds: `${clean}/${JESMON_X_ASSET_FILES.ds}`,
  };
}
