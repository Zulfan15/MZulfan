/**
 * Pure character identity & gameplay profile for Megidramon (X Antibody).
 * Keep free of rendering or engine imports so external apps can read it anywhere.
 */
export const MEGIDRAMON_X_META = {
  id: 'megidramon_x',
  name: 'Megidramon X',
  title: 'Megidramon (X Antibody), Hellfire Seraph',
  tier: 4 as const,
  iconEmoji: '🌋',
  stage: 'Ultra' as const,
  attribute: 'Virus' as const,
  elementZone: 'flame' as const,
  signatureMove: 'Hell Howling Blaze',
  lore:
    'A calamitous dragon crowned with cerulean hazard flames, unfurling solar-fire wings above a coiled magma serpent body.',
  credit: 'Megidramon (X Antibody) Modular 8-Directional Character Set',
  overworldTargetHeight: 39,
} as const;

export type MegidramonXMeta = typeof MEGIDRAMON_X_META;
