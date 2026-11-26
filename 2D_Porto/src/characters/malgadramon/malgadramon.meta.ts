/**
 * Pure character identity & gameplay profile for Malgadramon.
 * Keep free of rendering or engine imports so external apps can read it anywhere.
 */
export const MALGADRAMON_META = {
  id: 'malgadramon',
  name: 'Malgadramon',
  title: 'Malgadramon, Cyber-Bone Reaver',
  tier: 3 as const,
  iconEmoji: '⚙️',
  stage: 'Mega' as const,
  attribute: 'Virus' as const,
  elementZone: 'cyber' as const,
  signatureMove: 'Bio-Rail Laceration',
  lore:
    'A biomechanical skull-beast fused with heavy hydraulic cables and an over-shoulder railgun built to tear through citadel gates.',
  credit: 'Malgadramon Modular 8-Directional Character Set',
  overworldTargetHeight: 35,
} as const;

export type MalgadramonMeta = typeof MALGADRAMON_META;
