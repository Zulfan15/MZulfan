/**
 * Pure character identity & gameplay profile for Vexatiamon Berserker.
 * Keep free of rendering or engine imports so external apps can read it anywhere.
 */
export const VEXATIAMON_BERSERKER_META = {
  id: 'vexatiamon_berserker',
  name: 'Vexatiamon: B',
  title: 'Vexatiamon Berserker, Dual-Cannon Drake',
  tier: 3 as const,
  iconEmoji: '💥',
  stage: 'Mega' as const,
  attribute: 'Virus' as const,
  elementZone: 'cyber' as const,
  signatureMove: 'Hyper Rail Salvo',
  lore:
    'A horned violet-winged dragon mounting dual jaw cannons on its shoulders that detonate solar plasma spheres at point-blank range.',
  credit: 'Vexatiamon Berserker Modular 8-Directional Character Set',
  overworldTargetHeight: 36,
} as const;

export type VexatiamonBerserkerMeta = typeof VEXATIAMON_BERSERKER_META;
