/**
 * Pure character identity & gameplay profile for Karatiamon.
 * Keep free of rendering or engine imports so external apps can read it anywhere.
 */
export const KARATIAMON_META = {
  id: 'karatiamon',
  name: 'Karatiamon',
  title: 'Karatiamon, Nocturne Rune Fang',
  tier: 2 as const,
  iconEmoji: '🐺',
  stage: 'Ultimate' as const,
  attribute: 'Virus' as const,
  elementZone: 'cyber' as const,
  signatureMove: 'Violet Hex Blade',
  lore:
    'A winged wolf swordsman cloaked in midnight tatters, swinging a rune-carved broadsword while phantom violet flames engulf its paw.',
  credit: 'Karatiamon 4-Sheet 8-Directional Character Set',
  overworldTargetHeight: 36,
} as const;

export type KaratiamonMeta = typeof KARATIAMON_META;
