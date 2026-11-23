/**
 * Pure character identity & gameplay profile for Jesmon (X Antibody).
 * Keep free of rendering or engine imports so external apps can read it anywhere.
 */
export const JESMON_X_META = {
  id: 'jesmon_x',
  name: 'Jesmon (X Antibody)',
  title: 'Jesmon (X Antibody), Judgment Blade',
  tier: 4 as const,
  iconEmoji: '⚔️',
  stage: 'Ultra' as const,
  attribute: 'Data' as const,
  elementZone: 'holy' as const,
  signatureMove: 'Tekken Seibai',
  lore:
    'An unbreakable Royal Knight awakened by the X-Antibody, sheathing itself in crimson and chrome blades that strike before malice can act.',
  credit: 'Jesmon (X Antibody) 5-Sheet 8-Directional Character Set',
  overworldTargetHeight: 40,
} as const;

export type JesmonXMeta = typeof JESMON_X_META;
