/**
 * Single place to configure where Malgadramon's sprite sheets are served from.
 * Override via `loadMalgadramon('/custom/path')` when embedding in another app.
 *
 * Once generated after quota reset, set `idle: 'idle-cycle.webp'`,
 * `walk: 'walk-cycle.webp'`, and `battle: 'battle.webp'`.
 */
export const MALGADRAMON_DEFAULT_ASSET_BASE = '/assets/characters/malgadramon';

export const MALGADRAMON_ASSET_FILES: {
  sheet: string;
  idle: string | null;
  walk: string | null;
  battle: string | null;
} = {
  sheet: 'malgadramon.webp',
  idle: 'idle-cycle.webp',
  walk: 'walk-cycle.webp',
  battle: null,
};

export function resolveMalgadramonAssets(baseUrl = MALGADRAMON_DEFAULT_ASSET_BASE) {
  const clean = baseUrl.replace(/\/+$/, '');
  return {
    sheet: `${clean}/${MALGADRAMON_ASSET_FILES.sheet}`,
    idle: MALGADRAMON_ASSET_FILES.idle ? `${clean}/${MALGADRAMON_ASSET_FILES.idle}` : null,
    walk: MALGADRAMON_ASSET_FILES.walk ? `${clean}/${MALGADRAMON_ASSET_FILES.walk}` : null,
    battle: MALGADRAMON_ASSET_FILES.battle ? `${clean}/${MALGADRAMON_ASSET_FILES.battle}` : null,
  };
}
