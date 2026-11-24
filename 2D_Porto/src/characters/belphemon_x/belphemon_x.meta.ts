/**
 * Pure character identity & gameplay profile for Belphemon (X Antibody).
 * Keep free of rendering or engine imports so external apps can read it anywhere.
 */
export const BELPHEMON_X_META = {
  id: 'belphemon_x',
  name: 'Belphemon X',
  title: 'Belphemon (X Antibody), Wrath Demon Lord',
  tier: 4 as const,
  iconEmoji: '😈',
  stage: 'Ultra' as const,
  attribute: 'Virus' as const,
  elementZone: 'flame' as const,
  signatureMove: 'Seventh Full Cluster',
  lore:
    'The Demon Lord of Sloth mutated by the X-Antibody, tearing the horizon with chained horns and blazing magenta gauntlet claws.',
  credit: 'Belphemon (X Antibody) 4-Sheet 8-Directional Character Set',
  overworldTargetHeight: 40,
} as const;

export type BelphemonXMeta = typeof BELPHEMON_X_META;
