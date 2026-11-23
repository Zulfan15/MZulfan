/**
 * Pure character identity & gameplay profile for Mastenamon.
 * Keep free of rendering or engine imports so external apps can read it anywhere.
 */
export const MASTENAMON_META = {
  id: 'mastenamon',
  name: 'Mastenamon',
  title: 'Mastenamon, Fallen & Holy Seraph',
  tier: 4 as const,
  iconEmoji: '🪽',
  stage: 'Mega' as const,
  attribute: 'Vaccine' as const,
  elementZone: 'holy' as const,
  signatureMove: 'Chaos Degradation & Dark Despair',
  lore:
    'An archangelic fusion knight uniting twelve asymmetric wings of radiant alabaster and obsidian darkness, opening dimensional rifts to banish chaos.',
  credit: 'Mastenamon Custom 8-Directional Character Set',
  overworldTargetHeight: 38,
} as const;

export type MastenamonMeta = typeof MASTENAMON_META;
