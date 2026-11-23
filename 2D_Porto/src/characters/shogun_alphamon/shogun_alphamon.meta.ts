/**
 * Pure character identity & gameplay profile for Shogun Alphamon.
 * Keep free of rendering or engine imports so external apps can read it anywhere.
 */
export const SHOGUN_ALPHAMON_META = {
  id: 'shogun_alphamon',
  name: 'Shogun Alphamon',
  title: 'Shogun Alphamon, Onyx Steed Samurai',
  tier: 4 as const,
  iconEmoji: '🐎',
  stage: 'Ultra' as const,
  attribute: 'Vaccine' as const,
  elementZone: 'holy' as const,
  signatureMove: 'Crimson Naginata Charge',
  lore:
    'A samurai warlord riding an armored ebony warhorse with blazing hooves, bearing dual battle standards and a golden naginata.',
  credit: 'Shogun Alphamon Custom 8-Directional Character Set',
  overworldTargetHeight: 38,
} as const;

export type ShogunAlphamonMeta = typeof SHOGUN_ALPHAMON_META;
