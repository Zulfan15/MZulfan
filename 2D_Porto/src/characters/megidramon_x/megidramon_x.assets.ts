/**
 * Single place to configure where Megidramon X's sprite sheets are served from.
 * Override via `loadMegidramonX('/custom/path')` when embedding in another app.
 *
 * Once generated after quota reset, set `idle: 'idle-cycle.webp'`,
 * `walk: 'walk-cycle.webp'`, and `battle: 'battle.webp'`.
 */
export const MEGIDRAMON_X_DEFAULT_ASSET_BASE = '/assets/characters/megidramon_x';

export const MEGIDRAMON_X_ASSET_FILES: {
  sheet: string;
  idle: string | null;
  walk: string | null;
  battle: string | null;
} = {
  sheet: 'megidramon_x.webp',
  idle: null,
  walk: null,
  battle: null,
};

export function resolveMegidramonXAssets(baseUrl = MEGIDRAMON_X_DEFAULT_ASSET_BASE) {
  const clean = baseUrl.replace(/\/+$/, '');
  return {
    sheet: `${clean}/${MEGIDRAMON_X_ASSET_FILES.sheet}`,
    idle: MEGIDRAMON_X_ASSET_FILES.idle ? `${clean}/${MEGIDRAMON_X_ASSET_FILES.idle}` : null,
    walk: MEGIDRAMON_X_ASSET_FILES.walk ? `${clean}/${MEGIDRAMON_X_ASSET_FILES.walk}` : null,
    battle: MEGIDRAMON_X_ASSET_FILES.battle ? `${clean}/${MEGIDRAMON_X_ASSET_FILES.battle}` : null,
  };
}
