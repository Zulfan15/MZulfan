/**
 * Single place to configure where Jesmon (X Antibody)'s 5 image files are served from.
 * Override via `loadJesmonX('/custom/path')` when embedding in another app.
 */
export const JESMON_X_DEFAULT_ASSET_BASE = '/assets/characters/jesmon_x';

export const JESMON_X_ASSET_FILES = {
  idle: 'idle.webp',
  walk: 'walk-cycle.webp',
  battle: 'battle.webp',
  sheet: 'jesmon-x.webp',
  ds: 'jesmon-x-ds.webp',
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
