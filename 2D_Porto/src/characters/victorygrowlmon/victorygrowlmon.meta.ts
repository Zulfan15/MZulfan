/**
 * Pure character identity & gameplay profile for VictoryGrowlmon.
 * Keep free of rendering or engine imports so external apps can read it anywhere.
 */
export const VICTORYGROWLMON_META = {
  id: 'victorygrowlmon',
  name: 'VictoryGrowlmon',
  title: 'VictoryGrowlmon, Crimson Dramon Knight',
  tier: 4 as const,
  iconEmoji: '🛡️',
  stage: 'Mega' as const,
  attribute: 'Vaccine' as const,
  elementZone: 'flame' as const,
  signatureMove: 'Dramon Victory Slash',
  lore:
    'A fierce scarlet dragon warrior equipped with twin jet cannons, a chrome lance gauntlet, and a golden-edged shield blade.',
  credit: 'VictoryGrowlmon 4-Sheet 8-Directional Character Set',
  overworldTargetHeight: 36,
} as const;

export type VictoryGrowlmonMeta = typeof VICTORYGROWLMON_META;
