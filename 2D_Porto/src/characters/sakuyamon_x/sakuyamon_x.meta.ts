/**
 * Pure character identity & gameplay profile for Sakuyamon (X Antibody).
 * Keep free of rendering or engine imports so external apps can read it anywhere.
 */
export const SAKUYAMON_X_META = {
  id: 'sakuyamon_x',
  name: 'Sakuyamon X',
  title: 'Sakuyamon (X Antibody), Silver Fox Shrine',
  tier: 4 as const,
  iconEmoji: '🦊',
  stage: 'Mega' as const,
  attribute: 'Data' as const,
  elementZone: 'holy' as const,
  signatureMove: 'Izuna Amaterasu',
  lore:
    'A mystic shrine maiden riding an ethereal frost-blue kitsune wolf, conjuring dark spirit foxes and sacred golden rune ribbons.',
  credit: 'Sakuyamon (X Antibody) 4-Sheet 8-Directional Character Set',
  overworldTargetHeight: 39,
} as const;

export type SakuyamonXMeta = typeof SAKUYAMON_X_META;
