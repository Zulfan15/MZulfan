/**
 * Pure character identity & gameplay profile for Plusiamon.
 * Keep free of rendering or engine imports so external apps can read it anywhere.
 */
export const PLUSIAMON_META = {
  id: 'plusiamon',
  name: 'Plusiamon',
  title: 'Plusiamon, Twin-Armored Mecha Dragon',
  tier: 3 as const,
  iconEmoji: '✨',
  stage: 'Mega' as const,
  attribute: 'Vaccine' as const,
  elementZone: 'holy' as const,
  signatureMove: 'Plasma Cannon & Thruster Flare',
  lore:
    'A heavily armed cyborg dragon knight soaring on twin gold-rimmed wing binders, pairing a glowing cyan plasma cannon and energy blade with an inferno shoulder launcher.',
  credit: 'Plusiamon 5-Sheet 8-Directional Character Set',
  overworldTargetHeight: 35,
} as const;

export type PlusiamonMeta = typeof PLUSIAMON_META;
