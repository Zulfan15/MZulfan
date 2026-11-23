/**
 * Pure character identity & gameplay profile for Gaspiritamon.
 * Keep free of rendering or engine imports so external apps can read it anywhere.
 */
export const GASPIRITAMON_META = {
  id: 'gaspiritamon',
  name: 'Gaspiritamon',
  title: 'Gaspiritamon, Rune-Wolf Valkyrie',
  tier: 3 as const,
  iconEmoji: '🔨',
  stage: 'Mega' as const,
  attribute: 'Data' as const,
  elementZone: 'aqua' as const,
  signatureMove: 'Fenrir Maelstrom',
  lore:
    'A frost-clad runic knight wielding a glowing hammer and round shield beside an ethereal wolf forged from glacial spirit flames.',
  credit: 'Gaspiritamon 3-Sheet 8-Directional Character Set',
  overworldTargetHeight: 36,
} as const;

export type GaspiritamonMeta = typeof GASPIRITAMON_META;
