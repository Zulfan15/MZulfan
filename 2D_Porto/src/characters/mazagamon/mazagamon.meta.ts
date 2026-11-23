/**
 * Pure character identity & gameplay profile for Mazagamon.
 * Keep free of rendering or engine imports so external apps can read it anywhere.
 */
export const MAZAGAMON_META = {
  id: 'mazagamon',
  name: 'Mazagamon',
  title: 'Mazagamon, Violet Calamity Beast',
  tier: 3 as const,
  iconEmoji: '👾',
  stage: 'Mega' as const,
  attribute: 'Virus' as const,
  elementZone: 'cyber' as const,
  signatureMove: 'Abyssal Volt Overload',
  lore:
    'A horned abyssal titan whose chrome gauntlets crackle with dark violet lightning while crimson armor fins erupt down its spine.',
  credit: 'Mazagamon Custom 8-Directional Character Set',
  overworldTargetHeight: 36,
} as const;

export type MazagamonMeta = typeof MAZAGAMON_META;
