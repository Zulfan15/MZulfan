/**
 * Pure character identity & gameplay profile for Fivedramon.
 * Keep free of rendering or engine imports so external apps can read it anywhere.
 */
export const FIVEDRAMON_META = {
  id: 'fivedramon',
  name: 'Fivedramon',
  title: 'Fivedramon, Five-Chromatic Drake',
  tier: 4 as const,
  iconEmoji: '🐉',
  stage: 'Ultra' as const,
  attribute: 'Virus' as const,
  elementZone: 'flame' as const,
  signatureMove: 'Grand Cross Breaker',
  lore:
    'A colossal armored dragon bearing five prismatic heads and elemental breath, unleashing devastation across sky and earth.',
  credit: 'Fivedramon Custom 8-Directional Character Set',
  overworldTargetHeight: 37,
} as const;

export type FivedramonMeta = typeof FIVEDRAMON_META;
