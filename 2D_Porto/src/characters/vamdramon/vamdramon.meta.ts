/**
 * Pure character identity & gameplay profile for Vamdramon.
 * Keep free of rendering or engine imports so external apps can read it anywhere.
 */
export const VAMDRAMON_META = {
  id: 'vamdramon',
  name: 'Vamdramon',
  title: 'Vamdramon, Abyssal Dread Sovereign',
  tier: 2 as const,
  iconEmoji: '🦇',
  stage: 'Ultimate' as const,
  attribute: 'Virus' as const,
  elementZone: 'cyber' as const,
  signatureMove: 'Crimson Nocturne',
  lore:
    'A nocturnal dragon-lord draped in a torn scarlet mantle, spreading violet wing-fins and obsidian claws through twilight ruins.',
  credit: 'Vamdramon Modular 8-Directional Character Set',
  overworldTargetHeight: 35,
} as const;

export type VamdramonMeta = typeof VAMDRAMON_META;
