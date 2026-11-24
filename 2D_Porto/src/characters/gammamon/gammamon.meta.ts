/**
 * Pure character identity & gameplay profile for Gammamon.
 * Keep free of rendering or engine imports so external apps can read it anywhere.
 */
export const GAMMAMON_META = {
  id: 'gammamon',
  name: 'Gammamon',
  title: 'Gammamon, Heavy Panzer Dino',
  tier: 2 as const,
  iconEmoji: '🦕',
  stage: 'Ultimate' as const,
  attribute: 'Data' as const,
  elementZone: 'cyber' as const,
  signatureMove: 'Steam-Stack Cannon',
  lore:
    'A riveted steel sauropod venting turbine exhaust from six dorsal pipes and sweeping rivals with an axe-tipped armored tail.',
  credit: 'Gammamon 4-Sheet 8-Directional Character Set',
  overworldTargetHeight: 54,
} as const;

export type GammamonMeta = typeof GAMMAMON_META;
