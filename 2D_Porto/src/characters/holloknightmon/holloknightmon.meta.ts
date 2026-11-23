/**
 * Pure character identity & gameplay profile for Holloknightmon.
 * Keep free of rendering or engine imports so external apps can read it anywhere.
 */
export const HOLLOKNIGHTMON_META = {
  id: 'holloknightmon',
  name: 'Holloknightmon',
  title: 'Holloknightmon, Sun-Winged Arbiter',
  tier: 4 as const,
  iconEmoji: '☀️',
  stage: 'Mega' as const,
  attribute: 'Vaccine' as const,
  elementZone: 'holy' as const,
  signatureMove: 'Radiance Decree',
  lore:
    'An ivory four-armed paladin crowned with solar spokes and glowing amber wings, delivering judgment with a silver greatsword.',
  credit: 'Holloknightmon 4-Sheet 8-Directional Character Set',
  overworldTargetHeight: 39,
} as const;

export type HolloknightmonMeta = typeof HOLLOKNIGHTMON_META;
