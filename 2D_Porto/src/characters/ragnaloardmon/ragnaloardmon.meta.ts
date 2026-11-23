/**
 * Pure character identity & gameplay profile for Ragnaloardmon.
 * Keep free of rendering or engine imports so external apps can read it anywhere.
 */
export const RAGNALOARDMON_META = {
  id: 'ragnaloardmon',
  name: 'Ragnaloardmon',
  title: 'Ragnaloardmon, Legend-Arms Sovereign',
  tier: 4 as const,
  iconEmoji: '🗡️',
  stage: 'Ultra' as const,
  attribute: 'Virus' as const,
  elementZone: 'flame' as const,
  signatureMove: 'Direct Smasher',
  lore:
    'The Legend-Arms fusion knight cloaked in living inferno flames, wielding both the golden sword Durandamon and red dragon shield Bryweludramon.',
  credit: 'Ragnaloardmon 5-Sheet 8-Directional Character Set',
  overworldTargetHeight: 36,
} as const;

export type RagnaloardmonMeta = typeof RAGNALOARDMON_META;
