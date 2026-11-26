/**
 * Centralized configuration & persistence for town buildings & custom tile overrides.
 * Powers the interactive in-browser Town Editor.
 */
import canonicalLayout from '../data/townLayout.json';
import digimonCanonicalLayout from '../data/digimonLayout.json';
import kingdomCanonicalLayout from '../data/kingdomLayout.json';
import darkCastleCanonicalLayout from '../data/darkCastleLayout.json';
import harbourCanonicalLayout from '../data/harbourLayout.json';
import skyCastleCanonicalLayout from '../data/skyCastleLayout.json';
import { DIGIMON_CATALOG } from './digimonCatalog';

export type WorldTarget = 'town' | 'digimon' | 'kingdom' | 'dark-castle' | 'harbour' | 'sky-castle';

export interface BuildingLayout {
  id: string;
  name: string;
  x: number;
  y: number;
  w: number;
  h: number;
  kind?: 'building' | 'object' | 'lamp' | 'tree' | 'bush' | 'bench' | 'flowerbed' | 'npc' | 'sign' | 'digimon';
  subType?: string;
  orientation?: 'N' | 'E' | 'S' | 'W';
  labelX?: number;
  labelY?: number;
  doorX?: number;
  doorY?: number;
  locked?: boolean;
  zIndex?: number;
  dialogue?: string;
  link?: string;
  hidden?: boolean;
  behavior?: 'stationary' | 'look_around' | 'patrol_small';
  scaleMultiplier?: number;
}

export interface PrefabBlueprint {
  id: string;
  name: string;
  createdAt: string;
  items: Omit<BuildingLayout, 'id'>[];
}

export interface NamedLayoutSnapshot {
  slot: string;
  label: string;
  savedAt: string;
  buildingCount: number;
  tileCount: number;
  snapshot: TownStateSnapshot;
}

export interface LayoutDiffSummary {
  added: number;
  removed: number;
  moved: number;
  tileDiff: number;
  totalChanges: number;
}

export type EditorCategoryKey =
  | 'Foliage & Alam'
  | 'Perabot & Lampu'
  | 'Dunia Pokémon'
  | 'Dunia Digimon'
  | '🏰 Kerajaan Medieval'
  | 'Tech & AI'
  | 'Fasilitas & Kota';

export interface EditorCategoryMeta {
  id: string;
  label: EditorCategoryKey;
  shortLabel: string;
  icon: string;
  defaultKind: BuildingLayout['kind'];
}

export const EDITOR_CATEGORY_META: Record<string, EditorCategoryMeta> = {
  alam: { id: 'alam', label: 'Foliage & Alam', shortLabel: 'Alam', icon: '🌳', defaultKind: 'tree' },
  perabot: { id: 'perabot', label: 'Perabot & Lampu', shortLabel: 'Perabot & Lampu', icon: '🪑', defaultKind: 'bench' },
  pokemon: { id: 'pokemon', label: 'Dunia Pokémon', shortLabel: 'Pokémon', icon: '⚡', defaultKind: 'npc' },
  digimon: { id: 'digimon', label: 'Dunia Digimon', shortLabel: 'Digimon', icon: '👾', defaultKind: 'npc' },
  kingdom: { id: 'kingdom', label: '🏰 Kerajaan Medieval', shortLabel: 'Medieval', icon: '🏰', defaultKind: 'object' },
  tech: { id: 'tech', label: 'Tech & AI', shortLabel: 'Tech & AI', icon: '💻', defaultKind: 'object' },
  fasilitas: { id: 'fasilitas', label: 'Fasilitas & Kota', shortLabel: 'Fasilitas & Kota', icon: '⛲', defaultKind: 'object' },
};

export const SPAWNABLE_CATALOG_GROUPS: EditorCategoryKey[] = [
  'Foliage & Alam',
  'Perabot & Lampu',
  'Dunia Pokémon',
  'Dunia Digimon',
  '🏰 Kerajaan Medieval',
  'Tech & AI',
  'Fasilitas & Kota',
];

export type CatalogUnlockTrack =
  | 'badges'
  | 'sky_plumes'
  | 'royal_crests'
  | 'maritime_seals'
  | 'abyssal_seals';

export interface CatalogUnlockRule {
  track: CatalogUnlockTrack;
  required: number;
  label: string;
  hint: string;
}

export interface CatalogProgressSnapshot {
  badges: number;
  sky_plumes: number;
  royal_crests: number;
  maritime_seals: number;
  abyssal_seals: number;
}

export interface TemplateUnlockStatus {
  unlocked: boolean;
  current: number;
  required: number;
  rule?: CatalogUnlockRule;
}

export interface SpawnableTemplate {
  id: string;
  name: string;
  icon: string;
  category: EditorCategoryKey;
  w: number;
  h: number;
  kind: 'building' | 'tree' | 'bush' | 'bench' | 'lamp' | 'flowerbed' | 'object' | 'npc' | 'sign' | 'digimon';
  subType?: string;
  desc: string;
  defaultDialogue?: string;
  biomes?: WorldTarget[];
  unlockRule?: CatalogUnlockRule;
}

export const WORLD_BIOME_LABELS: Record<WorldTarget, string> = {
  town: "Zulfan's Town",
  digimon: 'Digi-Sanctuary',
  kingdom: 'Royal Kingdom',
  harbour: 'Harbour Town',
  'sky-castle': 'Sky Castle',
  'dark-castle': 'Dark Castle',
};

const HARBOUR_SUBTYPES = new Set([
  'tree_palm', 'reeds_clump', 'fence_water', 'lily_pond', 'natural_spring',
  'cafe_table', 'bench', 'lamp', 'wooden_cart', 'market_stall', 'watchtower',
  'cactus_saguaro', 'kyogre', 'gyarados', 'lugia', 'empoleon', 'samurott', 'urshifu',
]);

const KINGDOM_SUBTYPES = new Set([
  'tree_willow', 'tree_golden', 'tree_autumn', 'tree_pine', 'rose_bed',
  'lavender_bed', 'mossy_rock', 'tree_stump', 'fallen_log', 'mushroom_patch',
  'natural_spring', 'stone_lantern', 'torii_gate', 'statue',
  'royal_castle', 'royal_chapel', 'blacksmith_forge', 'knights_barracks',
  'mage_tower', 'medieval_tavern', 'jousting_arena', 'watchtower',
  'excalibur_shrine', 'royal_banner', 'medieval_brazier', 'weapon_rack',
  'market_stall', 'wooden_cart', 'royal_knight',
]);

const SKY_CASTLE_SUBTYPES = new Set([
  'tree_golden', 'tree_sakura', 'tree_willow', 'lavender_bed', 'rose_bed',
  'crystal_cluster', 'natural_spring', 'stone_lantern', 'ancient_pillar',
  'frost_shrine', 'alloy_beacon', 'rayquaza', 'latios', 'latias', 'lugia',
  'arceus', 'reshiram', 'lunala', 'solgaleo', 'salamence',
]);

const DARK_CASTLE_SUBTYPES = new Set([
  'tree_dead', 'mushroom_patch', 'crystal_cluster', 'mossy_rock', 'fallen_log',
  'tree_stump', 'volcanic_vent', 'ancient_pillar', 'medieval_brazier',
  'watchtower', 'darkrai', 'giratina', 'zekrom', 'mewtwo', 'kyurem',
  'eternatus', 'necrozma',
]);

const DIGIMON_BIOME_SUBTYPES = new Set([
  'crystal_cluster', 'mushroom_patch', 'lamp_cyber', 'server_rack',
  'holo_projector', 'drone_pad', 'sat_dish', 'rover_bot', 'alloy_beacon',
  'volcanic_vent', 'frost_shrine',
]);

const TOWN_BIOME_SUBTYPES = new Set([
  'tree_town', 'tree_sakura', 'tree_berry', 'tree_pine', 'tree_autumn',
  'tree_bamboo', 'hedge', 'flowerbed', 'sunflower_bed', 'lavender_bed',
  'bush_flower', 'berry_pot', 'lily_pond', 'rock_boulder', 'lamp',
  'stone_lantern', 'lamp_cyber', 'bench', 'cafe_table', 'picnic_set',
  'mailbox_red', 'trash_bin', 'kiosk', 'garden', 'pokestop', 'pokeball_item',
  'bike_rack', 'notice_board', 'jukebox', 'vending', 'torii_gate',
  'campfire', 'tent', 'sign',
]);

/** Returns deduplicated recommended world biomes for a spawnable catalog template. */
export function getRecommendedBiomesForTemplate(tpl: SpawnableTemplate): readonly WorldTarget[] {
  if (tpl.biomes && tpl.biomes.length > 0) return tpl.biomes;
  const sub = tpl.subType || tpl.id;
  const out = new Set<WorldTarget>();

  if (HARBOUR_SUBTYPES.has(sub)) out.add('harbour');
  if (KINGDOM_SUBTYPES.has(sub) || tpl.category === '🏰 Kerajaan Medieval') out.add('kingdom');
  if (SKY_CASTLE_SUBTYPES.has(sub)) out.add('sky-castle');
  if (DARK_CASTLE_SUBTYPES.has(sub)) out.add('dark-castle');
  if (tpl.category === 'Dunia Digimon' || DIGIMON_BIOME_SUBTYPES.has(sub)) out.add('digimon');
  if (
    TOWN_BIOME_SUBTYPES.has(sub) ||
    tpl.category === 'Tech & AI' ||
    tpl.category === 'Dunia Pokémon'
  ) {
    out.add('town');
  }

  return Array.from(out);
}

export const CATALOG_UNLOCK_RULES: Readonly<Record<string, CatalogUnlockRule>> = {
  tpl_jukebox: {
    track: 'badges',
    required: 1,
    label: '🏅 1 Tech Gym Badge',
    hint: 'Kunjungi 1 gedung portofolio di Zulfan’s Town untuk membuka Gym Badge pertama.',
  },
  tpl_holo_projector: {
    track: 'badges',
    required: 2,
    label: '🏅 2 Tech Gym Badges',
    hint: 'Kumpulkan 2 Tech Gym Badge dengan menjelajahi gedung-gedung Zulfan’s Town.',
  },
  tpl_frost_shrine: {
    track: 'badges',
    required: 3,
    label: '🏅 3 Tech Gym Badges',
    hint: 'Kumpulkan 3 Tech Gym Badge untuk membuka Kuil Es Kristal.',
  },
  tpl_ancient_pillar: {
    track: 'royal_crests',
    required: 1,
    label: '👑 1 Royal Crest',
    hint: 'Temukan 1 Royal Crest di bangunan Royal Kingdom.',
  },
  tpl_natural_spring: {
    track: 'royal_crests',
    required: 2,
    label: '👑 2 Royal Crests',
    hint: 'Kumpulkan 2 Royal Crest di Royal Kingdom untuk membuka Mata Air Batu Alami.',
  },
  tpl_tree_palm: {
    track: 'maritime_seals',
    required: 1,
    label: '⚓ 1 Maritime Seal',
    hint: 'Temukan 1 Maritime Seal di bangunan Harbour Town.',
  },
  tpl_crystal_cluster: {
    track: 'sky_plumes',
    required: 1,
    label: '🪶 1 Celestial Plume',
    hint: 'Temukan 1 Celestial Plume di bangunan Sky Castle.',
  },
  tpl_tree_golden: {
    track: 'sky_plumes',
    required: 2,
    label: '🪶 2 Celestial Plumes',
    hint: 'Kumpulkan 2 Celestial Plume di Sky Castle untuk membuka Pohon Emas Celestia.',
  },
  tpl_mushroom_patch: {
    track: 'abyssal_seals',
    required: 1,
    label: '🌑 1 Abyssal Seal',
    hint: 'Temukan 1 Abyssal Seal di bangunan Dark Castle.',
  },
  tpl_tree_dead: {
    track: 'abyssal_seals',
    required: 2,
    label: '🌑 2 Abyssal Seals',
    hint: 'Kumpulkan 2 Abyssal Seal di Dark Castle untuk membuka Pohon Kering Mistis.',
  },
};

export function getTemplateUnlockRule(tpl: SpawnableTemplate): CatalogUnlockRule | undefined {
  return tpl.unlockRule ?? CATALOG_UNLOCK_RULES[tpl.id];
}

export function getTemplateUnlockStatus(
  tpl: SpawnableTemplate,
  progress: CatalogProgressSnapshot,
  sandboxBypass = false
): TemplateUnlockStatus {
  const rule = getTemplateUnlockRule(tpl);
  if (!rule) {
    return { unlocked: true, current: 0, required: 0 };
  }
  const current = progress[rule.track] ?? 0;
  return {
    unlocked: sandboxBypass || current >= rule.required,
    current,
    required: rule.required,
    rule,
  };
}

export function getCatalogUnlockSummary(progress: CatalogProgressSnapshot): {
  unlocked: number;
  total: number;
} {
  let unlocked = 0;
  let total = 0;
  for (const tpl of SPAWNABLE_TEMPLATES) {
    const rule = getTemplateUnlockRule(tpl);
    if (!rule) continue;
    total++;
    if ((progress[rule.track] ?? 0) >= rule.required) {
      unlocked++;
    }
  }
  return { unlocked, total };
}

export interface ThemeBundleItem {
  templateId: string;
  dx: number;
  dy: number;
}

export interface ThemeBundle {
  id: string;
  name: string;
  icon: string;
  w: number;
  h: number;
  desc: string;
  biomes: WorldTarget[];
  items: readonly ThemeBundleItem[];
}

export const CATALOG_THEME_BUNDLES: readonly ThemeBundle[] = [
  {
    id: 'bundle_zen_corner',
    name: 'Pojok Taman Zen',
    icon: '🎋',
    w: 6,
    h: 5,
    desc: 'Rumpun bambu, kolam teratai Magikarp, lentera Tōrō, pohon sakura & batu lumut (6 item)',
    biomes: ['town', 'kingdom', 'sky-castle'],
    items: [
      { templateId: 'tpl_tree_bamboo', dx: 0, dy: 0 },
      { templateId: 'tpl_lily_pond', dx: 2, dy: 1 },
      { templateId: 'tpl_stone_lantern', dx: 5, dy: 0 },
      { templateId: 'tpl_tree_sakura', dx: 4, dy: 2 },
      { templateId: 'tpl_mossy_rock', dx: 0, dy: 3 },
      { templateId: 'tpl_reeds_clump', dx: 2, dy: 3 },
    ],
  },
  {
    id: 'bundle_tropical_oasis',
    name: 'Oasis Pesisir Tropis',
    icon: '🌴',
    w: 6,
    h: 5,
    desc: 'Sepasang pohon kelapa pantai, mata air alami, alang-alang, kaktus & meja payung (6 item)',
    biomes: ['harbour', 'town'],
    items: [
      { templateId: 'tpl_tree_palm', dx: 0, dy: 0 },
      { templateId: 'tpl_natural_spring', dx: 2, dy: 1 },
      { templateId: 'tpl_tree_palm', dx: 4, dy: 0 },
      { templateId: 'tpl_reeds_clump', dx: 1, dy: 2 },
      { templateId: 'tpl_cactus_saguaro', dx: 5, dy: 2 },
      { templateId: 'tpl_cafe_table', dx: 2, dy: 3 },
    ],
  },
  {
    id: 'bundle_royal_rose_garden',
    name: 'Taman Mawar Istana',
    icon: '🌹',
    w: 6,
    h: 5,
    desc: 'Dua pohon emas Celestia mengapit bedeng mawar kerajaan, lavender, bangku & lentera (7 item)',
    biomes: ['kingdom', 'sky-castle', 'town'],
    items: [
      { templateId: 'tpl_tree_golden', dx: 0, dy: 0 },
      { templateId: 'tpl_tree_golden', dx: 4, dy: 0 },
      { templateId: 'tpl_rose_bed', dx: 2, dy: 0 },
      { templateId: 'tpl_lavender_bed', dx: 2, dy: 2 },
      { templateId: 'tpl_bench', dx: 2, dy: 4 },
      { templateId: 'tpl_stone_lantern', dx: 0, dy: 3 },
      { templateId: 'tpl_stone_lantern', dx: 5, dy: 3 },
    ],
  },
  {
    id: 'bundle_misty_shroom_woods',
    name: 'Hutan Jamur Berkabut',
    icon: '🍄',
    w: 6,
    h: 5,
    desc: 'Pohon kering deadwood, batu lumut, kayu tumbang, jamur glowshroom & kristal (8 item)',
    biomes: ['dark-castle', 'kingdom', 'digimon'],
    items: [
      { templateId: 'tpl_tree_dead', dx: 0, dy: 0 },
      { templateId: 'tpl_mossy_rock', dx: 2, dy: 0 },
      { templateId: 'tpl_tree_dead', dx: 4, dy: 1 },
      { templateId: 'tpl_fallen_log', dx: 1, dy: 3 },
      { templateId: 'tpl_mushroom_patch', dx: 0, dy: 3 },
      { templateId: 'tpl_mushroom_patch', dx: 3, dy: 2 },
      { templateId: 'tpl_crystal_cluster', dx: 4, dy: 3 },
      { templateId: 'tpl_tree_stump', dx: 5, dy: 3 },
    ],
  },
  {
    id: 'bundle_pine_campsite',
    name: 'Perkemahan Hutan Pinus',
    icon: '🏕️',
    w: 6,
    h: 5,
    desc: 'Tenda kemah & api unggun dikelilingi pohon pinus, maple, kayu tumbang & hydrangea (7 item)',
    biomes: ['town', 'kingdom'],
    items: [
      { templateId: 'tpl_tree_pine', dx: 0, dy: 0 },
      { templateId: 'tpl_tree_autumn', dx: 4, dy: 0 },
      { templateId: 'tpl_tent', dx: 2, dy: 0 },
      { templateId: 'tpl_campfire', dx: 2, dy: 2 },
      { templateId: 'tpl_fallen_log', dx: 1, dy: 4 },
      { templateId: 'tpl_tree_stump', dx: 4, dy: 3 },
      { templateId: 'tpl_bush_flower', dx: 0, dy: 3 },
    ],
  },
  {
    id: 'bundle_cyber_research_post',
    name: 'Pos Riset Cyber & Kristal',
    icon: '💻',
    w: 6,
    h: 4,
    desc: 'Rak server AI, proyektor hologram, panel surya, robot penjelajah & kristal energi (7 item)',
    biomes: ['digimon', 'town'],
    items: [
      { templateId: 'tpl_server_rack', dx: 0, dy: 0 },
      { templateId: 'tpl_holo_projector', dx: 2, dy: 0 },
      { templateId: 'tpl_lamp_cyber', dx: 5, dy: 0 },
      { templateId: 'tpl_crystal_cluster', dx: 0, dy: 2 },
      { templateId: 'tpl_crystal_cluster', dx: 5, dy: 2 },
      { templateId: 'tpl_rover_bot', dx: 3, dy: 2 },
      { templateId: 'tpl_solar_panel', dx: 1, dy: 2 },
    ],
  },
];

export const SPAWNABLE_TEMPLATES: SpawnableTemplate[] = [
  // 🌳 1. Foliage & Alam (Nature & Flora)
  {
    id: 'tpl_tree_town',
    name: 'Pohon Hijau Kota',
    icon: '🌳',
    category: 'Foliage & Alam',
    w: 2,
    h: 2,
    kind: 'tree',
    subType: 'tree_town',
    desc: 'Pohon peneduh rindang khas kota Pokémon (2x2)',
    defaultDialogue: 'Pohon rindang kota yang rimbun dan asri. Memberikan keteduhan bagi pejalan kaki yang melintas.',
  },
  {
    id: 'tpl_tree_sakura',
    name: 'Pohon Sakura Pink',
    icon: '🌸',
    category: 'Foliage & Alam',
    w: 2,
    h: 2,
    kind: 'tree',
    subType: 'tree_sakura',
    desc: 'Pohon bunga sakura mekar nan anggun (2x2)',
    defaultDialogue: 'Pohon sakura yang mekar dengan kelopak merah muda lembut. Suasana terasa damai dan sejuk.',
  },
  {
    id: 'tpl_tree_pine',
    name: 'Pohon Pinus Sinnoh',
    icon: '🌲',
    category: 'Foliage & Alam',
    w: 2,
    h: 2,
    kind: 'tree',
    subType: 'tree_pine',
    desc: 'Pohon cemara jarum lebat khas dataran tinggi Sinnoh (2x2)',
    defaultDialogue: 'Pohon Pinus Sinnoh yang kokoh. Aroma khas getah pinus dan udara pegunungan terasa begitu menyegarkan.',
  },
  {
    id: 'tpl_tree_autumn',
    name: 'Pohon Maple Musim Gugur',
    icon: '🍁',
    category: 'Foliage & Alam',
    w: 2,
    h: 2,
    kind: 'tree',
    subType: 'tree_autumn',
    desc: 'Pohon kanopi hangat dengan gradasi jingga keemasan (2x2)',
    defaultDialogue: 'Pohon Maple Musim Gugur. Daun-daunnya memancarkan semburat jingga keemasan yang indah di bawah sinar mentari.',
  },
  {
    id: 'tpl_tree_berry',
    name: 'Pohon Buah Berry Lebat',
    icon: '🍒',
    category: 'Foliage & Alam',
    w: 2,
    h: 2,
    kind: 'tree',
    subType: 'tree_berry',
    desc: 'Pohon berbuah manis aneka Oran, Sitrus, & Pecha Berry (2x2)',
    defaultDialogue: 'Pohon buah Berry yang ranum dan manis! Terlihat buah Oran Berry dan Sitrus Berry bergantungan segar di dahannya.',
  },
  {
    id: 'tpl_bush',
    name: 'Semak Hias Boxwood',
    icon: '🌿',
    category: 'Foliage & Alam',
    w: 1,
    h: 1,
    kind: 'bush',
    subType: 'hedge',
    desc: 'Semak pangkas rapi pembatas taman (1x1)',
    defaultDialogue: 'Semak hias boxwood yang dipangkas rapi. Berfungsi sebagai partisi asri alami kota.',
  },
  {
    id: 'tpl_flowerbed_4x4',
    name: 'Taman Bunga Raya (4x4)',
    icon: '🌸',
    category: 'Foliage & Alam',
    w: 4,
    h: 4,
    kind: 'flowerbed',
    subType: 'flowerbed',
    desc: 'Petak taman bunga botani besar warna-warni (4x4)',
    defaultDialogue: 'Petak taman bunga botani yang luas dan asri. Berisi aneka ragam mawar merah, marigold emas, lavender ungu, dan aster putih mekar semerbak.',
  },
  {
    id: 'tpl_flowerbed_rect',
    name: 'Bedeng Bunga Panjang (4x2)',
    icon: '🌷',
    category: 'Foliage & Alam',
    w: 4,
    h: 2,
    kind: 'flowerbed',
    subType: 'flowerbed',
    desc: 'Bedeng bunga horizontal pembatas jalan & teras (4x2)',
    defaultDialogue: 'Bedeng bunga pembatas jalan beraroma harum dan segar.',
  },
  {
    id: 'tpl_flowerbed',
    name: 'Kotak Bunga Asri (2x2)',
    icon: '🌺',
    category: 'Foliage & Alam',
    w: 2,
    h: 2,
    kind: 'flowerbed',
    subType: 'flowerbed',
    desc: 'Taman bunga warna-warni yang asri (2x2)',
    defaultDialogue: 'Taman bunga warna-warni yang tertata apik. Menghadirkan wangi semerbak di sudut kota.',
  },
  {
    id: 'tpl_sunflower_bed',
    name: 'Petak Bunga Matahari',
    icon: '🌻',
    category: 'Foliage & Alam',
    w: 2,
    h: 2,
    kind: 'flowerbed',
    subType: 'sunflower_bed',
    desc: 'Petak bunga matahari kuning cerah menghadap selatan (2x2)',
    defaultDialogue: 'Petak bunga matahari mekar ceria menghadap ke arah cahaya. Memberikan energi positif bagi siapa saja yang lewat.',
  },
  {
    id: 'tpl_rock_boulder',
    name: 'Batu Strength / Boulder',
    icon: '🪨',
    category: 'Foliage & Alam',
    w: 1,
    h: 1,
    kind: 'object',
    subType: 'rock_boulder',
    desc: 'Batu cadas kokoh legendaris overworld Pokémon (1x1)',
    defaultDialogue: 'Batu cadas raksasa yang sangat kokoh. Tampaknya hanya Pokémon berkekuatan HM Strength yang bisa memindahkannya!',
  },
  {
    id: 'tpl_lily_pond',
    name: 'Kolam Teratai & Magikarp',
    icon: '🪷',
    category: 'Foliage & Alam',
    w: 2,
    h: 2,
    kind: 'object',
    subType: 'lily_pond',
    desc: 'Kolam batu mini dengan teratai dan siluet Magikarp (2x2)',
    defaultDialogue: 'Kolam teratai mini dengan air jernih berkilau. Jika diperhatikan seksama, ada siluet Magikarp yang berenang lincah di dasarnya!',
  },
  {
    id: 'tpl_berry_pot',
    name: 'Pot Berry Tanaman',
    icon: '🫐',
    category: 'Foliage & Alam',
    w: 1,
    h: 1,
    kind: 'object',
    subType: 'berry_pot',
    desc: 'Pot keramik buah berry langka (1x1)',
    defaultDialogue: 'Pot tanaman tanah liat berisi bibit berry berkualitas tinggi yang dirawat secara teliti.',
  },
  {
    id: 'tpl_tree_palm',
    name: 'Pohon Kelapa Pantai',
    icon: '🌴',
    category: 'Foliage & Alam',
    w: 2,
    h: 2,
    kind: 'tree',
    subType: 'tree_palm',
    desc: 'Pohon kelapa pesisir berpelepah tropis & buah kelapa (2x2)',
    defaultDialogue: 'Pohon kelapa pantai yang melambai diterpa angin laut. Buah kelapanya tampak segar di bawah pelepah hijau!',
  },
  {
    id: 'tpl_tree_willow',
    name: 'Pohon Dedalu Air (Willow)',
    icon: '🌿',
    category: 'Foliage & Alam',
    w: 2,
    h: 2,
    kind: 'tree',
    subType: 'tree_willow',
    desc: 'Pohon dedalu tepi air dengan tirai daun menjuntai anggun (2x2)',
    defaultDialogue: 'Pohon dedalu yang teduh dengan sulur-sulur daun hijau menjuntai lembut mengikuti hembusan angin.',
  },
  {
    id: 'tpl_tree_bamboo',
    name: 'Rumpun Bambu Zen',
    icon: '🎋',
    category: 'Foliage & Alam',
    w: 2,
    h: 2,
    kind: 'tree',
    subType: 'tree_bamboo',
    desc: 'Rumpun batang bambu hijau beruas khas taman kuil timur (2x2)',
    defaultDialogue: 'Rumpun bambu hijau yang menjulang rapi. Gemerisik daunnya menghadirkan ketenangan khas taman Zen.',
  },
  {
    id: 'tpl_tree_dead',
    name: 'Pohon Kering / Deadwood',
    icon: '🥀',
    category: 'Foliage & Alam',
    w: 2,
    h: 2,
    kind: 'tree',
    subType: 'tree_dead',
    desc: 'Pohon ranting tua tanpa daun bernuansa kastil kelam (2x2)',
    defaultDialogue: 'Pohon tua beranting kering yang berdiri kokoh menantang kabut malam. Cocok menghiasi kawasan Dark Castle.',
  },
  {
    id: 'tpl_tree_golden',
    name: 'Pohon Emas Celestia',
    icon: '✨',
    category: 'Foliage & Alam',
    w: 2,
    h: 2,
    kind: 'tree',
    subType: 'tree_golden',
    desc: 'Pohon suci berdaun emas bercahaya khas Sky Castle (2x2)',
    defaultDialogue: 'Pohon Celestia berdaun keemasan yang memancarkan kilau hangat bagaikan cahaya fajar di istana langit.',
  },
  {
    id: 'tpl_lavender_bed',
    name: 'Petak Bunga Lavender',
    icon: '💜',
    category: 'Foliage & Alam',
    w: 2,
    h: 2,
    kind: 'flowerbed',
    subType: 'lavender_bed',
    desc: 'Hamparan bunga lavender ungu harum bergaya Kalos (2x2)',
    defaultDialogue: 'Petak bunga lavender ungu yang mekar serempak. Aroma relaksasinya terbawa sepoi-sepoi ke seluruh penjuru taman.',
  },
  {
    id: 'tpl_rose_bed',
    name: 'Bedeng Mawar Kerajaan',
    icon: '🌹',
    category: 'Foliage & Alam',
    w: 2,
    h: 1,
    kind: 'flowerbed',
    subType: 'rose_bed',
    desc: 'Bedeng batu marmer berisi mawar merah & putih istana (2x1)',
    defaultDialogue: 'Bedeng mawar kerajaan dengan kelopak merah merona dan putih bersih yang dirawat bak taman istana.',
  },
  {
    id: 'tpl_bush_flower',
    name: 'Semak Bunga Hydrangea',
    icon: '🌺',
    category: 'Foliage & Alam',
    w: 1,
    h: 1,
    kind: 'object',
    subType: 'bush_flower',
    desc: 'Semak bulat rimbun bertabur bunga biru-ungu & merah muda (1x1)',
    defaultDialogue: 'Semak bunga hydrangea yang mekar padat dengan gradasi kelopak biru langit, ungu, dan merah muda.',
  },
  {
    id: 'tpl_mushroom_patch',
    name: 'Rumpun Jamur Glowshroom',
    icon: '🍄',
    category: 'Foliage & Alam',
    w: 1,
    h: 1,
    kind: 'object',
    subType: 'mushroom_patch',
    desc: 'Rumpun jamur hutan merah tutul putih & jamur pendar cyan (1x1)',
    defaultDialogue: 'Rumpun jamur hutan mungil! Tudung merah bertutul putihnya berdampingan dengan jamur spora berpendar biru lembut.',
  },
  {
    id: 'tpl_tree_stump',
    name: 'Tunggul Pohon Tua',
    icon: '🪵',
    category: 'Foliage & Alam',
    w: 1,
    h: 1,
    kind: 'object',
    subType: 'tree_stump',
    desc: 'Tunggul batang kayu bercincin usia dengan lumut & tunas (1x1)',
    defaultDialogue: 'Tunggul pohon tua dengan lingkar tahun yang jelas. Tunas daun hijau baru mulai tumbuh di sisinya.',
  },
  {
    id: 'tpl_fallen_log',
    name: 'Batang Kayu Tumbang',
    icon: '🪵',
    category: 'Foliage & Alam',
    w: 2,
    h: 1,
    kind: 'object',
    subType: 'fallen_log',
    desc: 'Kayu gelondongan tua berlumut hijau pembatas jalur hutan (2x1)',
    defaultDialogue: 'Batang kayu tumbang yang diselimuti lumut lembut dan jamur kecil di kulit kayunya.',
  },
  {
    id: 'tpl_reeds_clump',
    name: 'Rumpun Alang-Alang Air',
    icon: '🌾',
    category: 'Foliage & Alam',
    w: 1,
    h: 1,
    kind: 'object',
    subType: 'reeds_clump',
    desc: 'Rumpun tanaman tepi air & bunga cattail coklat alami (1x1)',
    defaultDialogue: 'Rumpun alang-alang air dan cattail yang bergoyang pelan di tepi perairan.',
  },
  {
    id: 'tpl_mossy_rock',
    name: 'Batu Lumut Hutan Besar',
    icon: '🪨',
    category: 'Foliage & Alam',
    w: 2,
    h: 2,
    kind: 'object',
    subType: 'mossy_rock',
    desc: 'Formasi bongkahan batu granit besar berselimut lumut hijau (2x2)',
    defaultDialogue: 'Bongkahan batu granit purba berukuran besar yang diselimuti lumut zamrud tebal dan pakis kecil.',
  },
  {
    id: 'tpl_crystal_cluster',
    name: 'Gugus Kristal Alam',
    icon: '💎',
    category: 'Foliage & Alam',
    w: 1,
    h: 1,
    kind: 'object',
    subType: 'crystal_cluster',
    desc: 'Gugus kristal kuarsa cyan-ungu berkilau energi alam (1x1)',
    defaultDialogue: 'Gugus kristal kuarsa alami yang membiaskan cahaya biru-ungu berkilauan.',
  },
  {
    id: 'tpl_natural_spring',
    name: 'Mata Air Batu Alami',
    icon: '♨️',
    category: 'Foliage & Alam',
    w: 2,
    h: 2,
    kind: 'object',
    subType: 'natural_spring',
    desc: 'Kolam mata air batu alam bertingkat berair jernih & hangat (2x2)',
    defaultDialogue: 'Mata air alami berbatu yang jernih dan menenangkan. Riak air hangatnya memulihkan semangat petualang!',
  },
  {
    id: 'tpl_cactus_saguaro',
    name: 'Kaktus Gurun Berbunga',
    icon: '🌵',
    category: 'Foliage & Alam',
    w: 1,
    h: 1,
    kind: 'object',
    subType: 'cactus_saguaro',
    desc: 'Kaktus hijau berlengan dua dengan mahkota bunga cerah (1x1)',
    defaultDialogue: 'Kaktus gurun tangguh yang sedang memekarkan bunga kuning dan merah muda di pucuknya.',
  },

  // 🪑 2. Perabot & Lampu Jalan (Streetscape & Furniture)
  {
    id: 'tpl_lamp',
    name: 'Lampu Jalan Klasik',
    icon: '💡',
    category: 'Perabot & Lampu',
    w: 1,
    h: 2,
    kind: 'lamp',
    subType: 'lamp',
    desc: 'Lampu jalan lentera hangat malam (1x2)',
    defaultDialogue: 'Lampu jalan tempa besi klasik. Menyinari langkah trainer saat malam tiba.',
  },
  {
    id: 'tpl_stone_lantern',
    name: 'Lentera Batu Tōrō',
    icon: '🏮',
    category: 'Perabot & Lampu',
    w: 1,
    h: 2,
    kind: 'lamp',
    subType: 'stone_lantern',
    desc: 'Lentera taman batu bergaya kuil Jepang tradisional (1x2)',
    defaultDialogue: 'Lentera batu Tōrō tradisional. Memancarkan cahaya temaram yang hangat dan damai saat senja tiba.',
  },
  {
    id: 'tpl_lamp_cyber',
    name: 'Lampu Taman LED Cyber',
    icon: '💠',
    category: 'Perabot & Lampu',
    w: 1,
    h: 2,
    kind: 'lamp',
    subType: 'lamp_cyber',
    desc: 'Pilar lampu neon cyan futuristik kawasan Lab & Tech (1x2)',
    defaultDialogue: 'Pilar lampu LED Cyber modern berteknologi hemat energi. Memancarkan pendaran neon cyan yang futuristik.',
  },
  {
    id: 'tpl_bench',
    name: 'Bangku Taman Kayu',
    icon: '🪑',
    category: 'Perabot & Lampu',
    w: 2,
    h: 1,
    kind: 'bench',
    subType: 'bench',
    desc: 'Bangku kayu santai warga kota (2x1)',
    defaultDialogue: 'Bangku taman kayu yang kokoh. Tempat yang nyaman untuk duduk melepas lelah.',
  },
  {
    id: 'tpl_cafe_table',
    name: 'Meja Payung Kafe Outdoor',
    icon: '⛱️',
    category: 'Perabot & Lampu',
    w: 2,
    h: 2,
    kind: 'object',
    subType: 'cafe_table',
    desc: 'Meja bistro bulat dengan payung bergaris & kursi santai (2x2)',
    defaultDialogue: 'Meja kafe terbuka dengan payung peneduh bergaris. Tempat sempurna untuk ngopi santai sambil coding dan diskusi arsitektur sistem.',
  },
  {
    id: 'tpl_picnic_set',
    name: 'Tikar & Keranjang Piknik',
    icon: '🧺',
    category: 'Perabot & Lampu',
    w: 2,
    h: 2,
    kind: 'object',
    subType: 'picnic_set',
    desc: 'Tikar kotak merah-putih dengan keranjang bekal piknik (2x2)',
    defaultDialogue: 'Set piknik santai di atas rumput. Keranjang rotan ini berisi roti lapis lezat dan teh herbal segar.',
  },
  {
    id: 'tpl_mailbox_red',
    name: 'Kotak Surat Pos Merah',
    icon: '📮',
    category: 'Perabot & Lampu',
    w: 1,
    h: 1,
    kind: 'object',
    subType: 'mailbox_red',
    desc: 'Kotak pos surat merah retro penghubung kontak (1x1)',
    defaultDialogue: 'Kotak surat pos klasik kota. Butuh kolaborasi atau penawaran proyek? Hubungi Zulfan via email di zulfan.ang@gmail.com!',
  },
  {
    id: 'tpl_trash_bin',
    name: 'Tempat Sampah & Daur Ulang',
    icon: '♻️',
    category: 'Perabot & Lampu',
    w: 1,
    h: 1,
    kind: 'object',
    subType: 'trash_bin',
    desc: 'Tempat sampah kota pemilah organik & anorganik (1x1)',
    defaultDialogue: 'Tempat pemilahan sampah organik dan anorganik. Menjaga kota tetap bersih, asri, dan ramah lingkungan.',
  },
  {
    id: 'tpl_kiosk',
    name: 'Kios Barista Café',
    icon: '☕',
    category: 'Perabot & Lampu',
    w: 5,
    h: 4,
    kind: 'object',
    subType: 'kiosk',
    desc: 'Kios barista kopi & es krim Castelia Cones (5x4)',
    defaultDialogue: 'Specialty roasts & Castelia Cones crafted fresh for devs & trainers! "Today\'s blend: Dark Roasted TypeScript with notes of React & zero runtime bugs!"',
  },
  {
    id: 'tpl_garden',
    name: 'Berry Garden & Sakura Grove',
    icon: '🌸',
    category: 'Foliage & Alam',
    w: 7,
    h: 9,
    kind: 'object',
    subType: 'garden',
    desc: 'Kebun botani buah berry organik & pohon sakura mekar (7x9)',
    defaultDialogue: 'Oran, Sitrus, dan Cheri berries tumbuh subur di kebun botani di bawah naungan pohon sakura. Tempat yang asri dan tenang untuk memulihkan stamina para trainer dan developer!',
  },

  // ⚡ 3. Dunia Pokémon & Trainer (Pokémon Overworld)
  {
    id: 'tpl_arceus',
    name: 'Arceus Sang Pencipta',
    icon: '🌟',
    category: 'Dunia Pokémon',
    w: 2,
    h: 2,
    kind: 'npc',
    subType: 'arceus',
    desc: 'Pokémon Legendaris Alpha Sang Pencipta semesta (2x2)',
    defaultDialogue: "ARCEUS: 'Dooo-oooonnn...!' ✨ Pendaran cahaya keemasan memancar dari cincin kosmik Arceus. Sang Alpha Pokémon mengawasi semesta dengan aura kebijaksanaan abadi.",
  },
  {
    id: 'tpl_reshiram',
    name: 'Reshiram Sang Naga Kebenaran',
    icon: '🤍',
    category: 'Dunia Pokémon',
    w: 2,
    h: 2,
    kind: 'npc',
    subType: 'reshiram',
    desc: 'Pokémon Legendaris Vast White Naga Api (2x2)',
    defaultDialogue: "RESHIRAM: 'Vaaa-zhooom...!' 🤍🔥 Ekor turbin Reshiram menyala terang dengan api kebenaran murni. Sang Vast White Pokémon mengamati lautan lepas Zulfan's Town dengan aura agung nan suci.",
  },
  {
    id: 'tpl_zekrom',
    name: 'Zekrom Sang Naga Idealisme',
    icon: '🖤',
    category: 'Dunia Pokémon',
    w: 2,
    h: 2,
    kind: 'npc',
    subType: 'zekrom',
    desc: 'Pokémon Legendaris Deep Black Naga Listrik (2x2)',
    defaultDialogue: "ZEKROM: 'Bzzzz-Vrrrooom...!' 🖤⚡ Ekor generator Zekrom berputar kencang memancarkan kilatan petir bertegangan tinggi. Sang Deep Black Pokémon mengamati semesta dengan aura idealisme abadi.",
  },
  {
    id: 'tpl_giratina',
    name: 'Giratina Sang Naga Distorsi',
    icon: '👻',
    category: 'Dunia Pokémon',
    w: 2,
    h: 2,
    kind: 'npc',
    subType: 'giratina',
    desc: 'Pokémon Legendaris Ghost/Dragon Penguasa Dunia Distorsi (2x2)',
    defaultDialogue: "GIRATINA: 'Gyaaa-shhhooo...!' 👻🌌 Kabut antimateri memancar dari sayap bayangan Giratina. Sang Penguasa Dunia Distorsi mengawasi keseimbangan alam semesta.",
  },
  {
    id: 'tpl_palkia',
    name: 'Palkia Sang Naga Ruang',
    icon: '🌌',
    category: 'Dunia Pokémon',
    w: 2,
    h: 2,
    kind: 'npc',
    subType: 'palkia',
    desc: 'Pokémon Legendaris Water/Dragon Penguasa Dimensi Ruang (2x2)',
    defaultDialogue: "PALKIA: 'Gyaaa-ooohhn...!' 🌌💧 Riak distorsi ruang memancar dari mutiara pundak Palkia. Sang Penguasa Dimensi Ruang menjaga keutuhan struktur alam semesta.",
  },
  {
  id: 'tpl_dialga',
    name: 'Dialga Sang Naga Waktu',
    icon: '⏳',
    category: 'Dunia Pokémon',
    w: 2,
    h: 2,
    kind: 'npc',
    subType: 'dialga',
    desc: 'Pokémon Legendaris Steel/Dragon Penguasa Dimensi Waktu (2x2)',
    defaultDialogue: "DIALGA: 'Gugyugubah...!' ⏳🔷 Denyut distorsi waktu memancar dari kristal dada Dialga. Sang Penguasa Dimensi Waktu menjaga kelancaran aliran masa lalu, kini, dan masa depan.",
  },
  {
    id: 'tpl_charizard',
    name: 'Charizard Sang Naga Api',
    icon: '🔥',
    category: 'Dunia Pokémon',
    w: 2,
    h: 2,
    kind: 'npc',
    subType: 'charizard',
    desc: 'Pokémon Api/Terbang Flame Dragon yang tangguh dan setia (2x2)',
    defaultDialogue: "CHARIZARD: 'GRAAAWWWRRR...!' 🔥 Ekor api Charizard berkobar cerah penuh semangat petualang. Sayap megahnya membentang siap mengarungi langit bersama sang Pelatih.",
  },
  {
    id: 'tpl_tyranitar',
    name: 'Tyranitar Sang Pelindung Zirah',
    icon: '🪨',
    category: 'Dunia Pokémon',
    w: 2,
    h: 2,
    kind: 'npc',
    subType: 'tyranitar',
    desc: 'Pokémon Armor Rock/Dark bertubuh zirah batu baja yang kokoh dan perkasa (2x2)',
    defaultDialogue: "TYRANITAR: 'Gwoooaaargh...!' 🪨 Badai pasir tipis berhembus di sekitar pijakan Tyranitar. Sang Armor Pokémon berdiri kokoh melindungi ketentraman Zulfan's Town.",
  },
  {
    id: 'tpl_garchomp',
    name: 'Garchomp Sang Predator Darat',
    icon: '🦈',
    category: 'Dunia Pokémon',
    w: 2,
    h: 2,
    kind: 'npc',
    subType: 'garchomp',
    desc: 'Pokémon Naga/Tanah Mach Pokémon secepat jet tempur supersonik (2x2)',
    defaultDialogue: "GARCHOMP: 'Gyaaa-shhh...!' 🦈🌪️ Sayap sirip tajam Garchomp berdesir membelah angin. Sang Mach Pokémon berdiri sigap dengan kecepatan supersonik menjaga ketertiban Zulfan's Town.",
  },
  {
    id: 'tpl_urshifu',
    name: 'Urshifu G-Max Rapid Strike',
    icon: '🥋',
    category: 'Dunia Pokémon',
    w: 2,
    h: 2,
    kind: 'npc',
    subType: 'urshifu',
    desc: 'Pokémon Wushu Petarung/Air Gigantamax dengan jurus Serbuan Beruntun tiada henti (2x2)',
    defaultDialogue: "URSHIFU: 'Hssshaaarrr-kwooo...!' 🥋🌊 Aliran deras jurus Rapid Strike bergemuruh di sekitar Urshifu Gigantamax. Sang Master Wushu berdiri tegak memancarkan energi petarung legendaris di Zulfan's Town.",
  },
  {
    id: 'tpl_rayquaza',
    name: 'Rayquaza Sang Naga Langit',
    icon: '🐉',
    category: 'Dunia Pokémon',
    w: 2,
    h: 2,
    kind: 'npc',
    subType: 'rayquaza',
    desc: 'Pokémon Legendaris Dragon/Flying Penguasa Lapisan Ozon (2x2)',
    defaultDialogue: "RAYQUAZA: 'Kyyyaaaarrrr-shooo...!' 🐉⚡ Aura zamrud naga langit berputar megah di angkasa. Rayquaza melayang gagah menjaga keseimbangan atmosfer dan kedamaian Zulfan's Town.",
  },
  {
    id: 'tpl_groudon',
    name: 'Groudon Sang Penguasa Daratan',
    icon: '🌋',
    category: 'Dunia Pokémon',
    w: 2,
    h: 2,
    kind: 'npc',
    subType: 'groudon',
    desc: 'Pokémon Legendaris Ground Penguasa Magma & Daratan Purba (2x2)',
    defaultDialogue: "GROUDON: 'Gwoooaaarrr-ghuuu...!' 🌋🔥 Kerak bumi bergetar saat sang Penguasa Magma melangkah. Groudon berdiri kokoh dengan aura kekeringan purba (Desolate Land), menjaga kestabilan benua dan kekuatan bumi di Zulfan's Town.",
  },
  {
    id: 'tpl_kyogre',
    name: 'Kyogre Sang Penguasa Samudra',
    icon: '🌊',
    category: 'Dunia Pokémon',
    w: 2,
    h: 2,
    kind: 'npc',
    subType: 'kyogre',
    desc: 'Pokémon Legendaris Water Penguasa Palung Laut & Hujan Purba (2x2)',
    defaultDialogue: "KYOGRE: 'Gyaaa-oooh-shuuu...!' 🌊💧 Deru ombak raksasa dan hujan lebat membuncah dari aura samudra purba (Primordial Sea). Kyogre melayang anggun menjaga kedalaman lautan dan kemurnian air di Zulfan's Town.",
  },
  {
    id: 'tpl_latios',
    name: 'Latios Sang Penjelajah Angkasa',
    icon: '✈️',
    category: 'Dunia Pokémon',
    w: 2,
    h: 2,
    kind: 'npc',
    subType: 'latios',
    desc: 'Pokémon Legendaris Dragon/Psychic Eon Berkecepatan Jet Supersonik (2x2)',
    defaultDialogue: "LATIOS: 'Shwiii-shooo...!' ✈️🔷 Latios melesat melebihi kecepatan suara dengan aerodinamika sayap jet kosmiknya. Sang Penjaga Jiwa dan Cahaya mengawasi Zulfan's Town dari ketinggian angkasa.",
  },
  {
    id: 'tpl_latias',
    name: 'Latias Sang Pelindung Hati',
    icon: '💖',
    category: 'Dunia Pokémon',
    w: 2,
    h: 2,
    kind: 'npc',
    subType: 'latias',
    desc: 'Pokémon Legendaris Dragon/Psychic Eon Berhati Murni (2x2)',
    defaultDialogue: "LATIAS: 'Kyuuu-wiiin...!' 💖✨ Latias melayang lincah dengan bulu halus pembias cahaya (Refract Light) yang dapat membuatnya tak kasat mata. Sang Pelindung Jiwa menyebarkan kedamaian dan kehangatan di Zulfan's Town.",
  },
  {
    id: 'tpl_darkrai',
    name: 'Darkrai Sang Penguasa Mimpi Buruk',
    icon: '🌑',
    category: 'Dunia Pokémon',
    w: 2,
    h: 2,
    kind: 'npc',
    subType: 'darkrai',
    desc: 'Pokémon Mistik Dark Pengendali Bayangan & Mimpi Buruk (2x2)',
    defaultDialogue: "DARKRAI: 'Zzzz-shhhwaaaddd...!' 🌑💤 Kabut bayangan hitam pekat berputar di bawah mantel Darkrai. Sang Penguasa Mimpi Buruk (Bad Dreams & Dark Void) mengawasi batas ilusi dan realitas demi melindungi Zulfan's Town dari balik kegelapan malam.",
  },
  {
    id: 'tpl_necrozma_dusk_mane',
    name: 'Necrozma (Dusk Mane)',
    icon: '🦁',
    category: 'Dunia Pokémon',
    w: 2,
    h: 2,
    kind: 'npc',
    subType: 'necrozma',
    desc: 'Pokémon Legendaris Prism Psychic/Steel Pengendali Cahaya Surya (2x2)',
    defaultDialogue: "NECROZMA: 'Ggg-rraaa-shhh-kzzzt...!' 🦁☀️ Prisma kristal hitam beresonansi dengan surya terang Solgaleo. Necrozma Dusk Mane memancarkan kekuatan cahaya murni (Sunsteel Strike), menyerap dan menerangi seluruh Zulfan's Town dengan energi kosmik tanpa batas.",
  },
  {
    id: 'tpl_lunala',
    name: 'Lunala Sang Utusan Rembulan',
    icon: '🌙',
    category: 'Dunia Pokémon',
    w: 2,
    h: 2,
    kind: 'npc',
    subType: 'lunala',
    desc: 'Pokémon Legendaris Moone Psychic/Ghost Penguasa Rembulan Malam (2x2)',
    defaultDialogue: "LUNALA: 'Mahaaalo-laaa...!' 🌙✨ Sayap bulan sabit membentang lebar menyerap cahaya malam. Lunala Sang Utusan Rembulan memasuki fase Full Moon (Moongeist Beam), menaburkan debu kosmik starlight yang melindungi kedamaian Zulfan's Town.",
  },
  {
    id: 'tpl_solgaleo',
    name: 'Solgaleo Sang Utusan Mentari',
    icon: '☀️',
    category: 'Dunia Pokémon',
    w: 2,
    h: 2,
    kind: 'npc',
    subType: 'solgaleo',
    desc: 'Pokémon Legendaris Sunne Psychic/Steel Penguasa Cahaya Surya (2x2)',
    defaultDialogue: "SOLGALEO: 'Laaa-lionnn-shooo...!' ☀️🦁 Surai keemasan Solgaleo berkobar terang benderang. Sang Utusan Mentari memasuki fase Radiant Sun (Sunsteel Strike), menyinari seluruh Zulfan's Town dengan kehangatan dan energi kehidupan surya tanpa batas.",
  },
  {
    id: 'tpl_samurott',
    name: 'Samurott Ahli Seamitar',
    icon: '⚔️',
    category: 'Dunia Pokémon',
    w: 2,
    h: 2,
    kind: 'npc',
    subType: 'samurott',
    desc: 'Pokémon Formidable Seamitar Unova dengan bilah pedang kerang berpresisi tinggi (2x2)',
    defaultDialogue: "SAMUROTT: 'Rrrwooon-kllliiinggg...!' ⚔️🌊 Samurott menghunus bilah pedang kerang Seamitar dari pelindung kakinya dengan kecepatan kilat. Sang Master Seamitar berdiri gagah membelah ombak dan menjaga kedaulatan Zulfan's Town.",
  },
  {
    id: 'tpl_empoleon',
    name: 'Empoleon Sang Kaisar Samudra',
    icon: '🐧',
    category: 'Dunia Pokémon',
    w: 2,
    h: 2,
    kind: 'npc',
    subType: 'empoleon',
    desc: 'Pokémon Emperor Water/Steel Sinnoh bermahkota trisula baja megah (2x2)',
    defaultDialogue: "EMPOLEON: 'Gwooon-piiinggg...!' 🐧👑 Sayap baja berkilau membelah ombak dingin lautan utara saat Empoleon mengangkat mahkota trisulanya. Sang Kaisar Samudra memimpin ketertiban dan pertahanan baja di Zulfan's Town.",
  },
  {
    id: 'tpl_regigigas',
    name: 'Regigigas Sang Penggerak Benua',
    icon: '🗿',
    category: 'Dunia Pokémon',
    w: 2,
    h: 2,
    kind: 'npc',
    subType: 'regigigas',
    desc: 'Pokémon Colossal Titan pencipta Trio Regi yang menggeser lempeng benua (2x2)',
    defaultDialogue: "REGIGIGAS: 'Zuuugii-giiigaaas...!' 🗿⚡ Enam bola mata rune kuno berpendar bergantian saat Sang Penggerak Benua melangkah mantap menjaga stabilitas fondasi Zulfan's Town.",
  },
  {
    id: 'tpl_koraidon',
    name: 'Koraidon Sang Raja Bersayap',
    icon: '🦖',
    category: 'Dunia Pokémon',
    w: 2,
    h: 2,
    kind: 'npc',
    subType: 'koraidon',
    desc: 'Pokémon Paradox Winged King Fighting/Dragon Paldea berkecepatan puncak (2x2)',
    defaultDialogue: "KORAIDON: 'Gyaaaas-krrrooo...!' 🦖🔥 Bulu emas bersinar dan energi Orichalcum Pulse menyala saat Koraidon menghentakkan kakinya siap melaju menembus batas.",
  },
  {
    id: 'tpl_eternatus',
    name: 'Eternatus Sang Naga Inti Kosmik',
    icon: '☄️',
    category: 'Dunia Pokémon',
    w: 2,
    h: 2,
    kind: 'npc',
    subType: 'eternatus',
    desc: 'Pokémon Raksasa Poison/Dragon sumber energi Dynamax Galar (2x2)',
    defaultDialogue: "ETERNATUS: 'Krrr-shhhwaaazzz...!' ☄️⚡ Inti plasma di dadanya berpendar menyalurkan energi Dynamax tak terbatas melindungi Zulfan's Town dari ketinggian.",
  },
  {
    id: 'tpl_gyarados',
    name: 'Gyarados Sang Naga Lautan',
    icon: '🐉',
    category: 'Dunia Pokémon',
    w: 2,
    h: 2,
    kind: 'npc',
    subType: 'gyarados',
    desc: 'Pokémon Atrocious Water/Flying Naga Samudra Penghancur Badai (2x2)',
    defaultDialogue: "GYARADOS: 'Gwoooaaargh... Roaaar!' 🌊🐉 Deru ombak raksasa dan badai air bergemuruh saat Gyarados meliuk gagah. Sang Naga Lautan pantang menyerah menembus arus dan menjaga perairan Zulfan's Town.",
  },
  {
    id: 'tpl_lucario',
    name: 'Lucario Sang Penjaga Aura',
    icon: '🌀',
    category: 'Dunia Pokémon',
    w: 1,
    h: 1,
    kind: 'npc',
    subType: 'lucario',
    desc: 'Pokémon Aura Fighting/Steel Penjaga Keseimbangan Rasa & Empati (1x1)',
    defaultDialogue: "LUCARIO: 'Aura Zulfan beresonansi kuat di sini!' 🌀 Gelombang aura biru berdenyut lembut dari cakar Lucario. Sang Pelindung Aura membaca niat murni dan menjaga harmoni di Zulfan's Town.",
  },
  {
    id: 'tpl_mewtwo',
    name: 'Mewtwo Sang Penantang',
    icon: '🔮',
    category: 'Dunia Pokémon',
    w: 1,
    h: 1,
    kind: 'npc',
    subType: 'mewtwo',
    desc: 'Pokémon Legendaris Psikis yang menguasai Battle Arena (1x1)',
    defaultDialogue: "MEWTWO: 'Saya tidak diciptakan untuk kalah. Pikiran manusia ini... menarik.' Buktikan ketajaman teknologimu di Battle Arena!",
  },
  {
    id: 'tpl_pokeball_item',
    name: 'Kapsul Item Poké Ball',
    icon: '🔴',
    category: 'Dunia Pokémon',
    w: 1,
    h: 1,
    kind: 'object',
    subType: 'pokeball_item',
    desc: 'Kapsul item legendaris yang tergeletak di tanah (1x1)',
    defaultDialogue: 'Sebuah Poké Ball tergeletak di tanah! Berisi catatan riset: "Gunakan arsitektur modular untuk skalabilitas aplikasi tingkat enterprise."',
  },
  {
    id: 'tpl_pokestop',
    name: 'Pilar Poké-Stop',
    icon: '📍',
    category: 'Dunia Pokémon',
    w: 1,
    h: 2,
    kind: 'object',
    subType: 'pokestop',
    desc: 'Pilar pemancar Poké-Stop dengan piringan berputar (1x2)',
    defaultDialogue: 'Poké-Stop Kota Zulfan! Memutar piringan foto untuk mengumpulkan item petualangan dan menyegarkan semangat eksplorasi.',
  },
  {
    id: 'tpl_snorlax',
    name: 'Snorlax Sang Raksasa Santai',
    icon: '😴',
    category: 'Dunia Pokémon',
    w: 2,
    h: 2,
    kind: 'npc',
    subType: 'snorlax',
    desc: 'Pokémon Normal Raksasa yang santai namun berkekuatan Body Slam dahsyat (2x2)',
    defaultDialogue: "SNORLAX: 'Yaaawnnn... Gaaarrr!' 😴💤 Snorlax menguap lebar sambil menepuk perutnya yang kenyang. Sang Raksasa Santai menjaga ketenangan dan stabilitas memori Zulfan's Town.",
  },
  {
    id: 'tpl_lugia',
    name: 'Lugia Sang Penjaga Samudra',
    icon: '🌊',
    category: 'Dunia Pokémon',
    w: 2,
    h: 2,
    kind: 'npc',
    subType: 'lugia',
    desc: 'Pokémon Legendaris Psychic/Flying Penjaga Samudra & Pengendali Badai (2x2)',
    defaultDialogue: "LUGIA: 'Gyaaa-oooor-shuuu...!' 🌊🌪️ [Tech Guardian: Full-Stack Calm in Storms, High-Traffic Sea Scale & Atmospheric Airflow] Kepakan sayap perak Lugia mampu meredakan badai dan menjaga kelancaran sistem di saat load tertinggi.",
  },
  {
    id: 'tpl_archaludon',
    name: 'Archaludon Sang Menara Electro Shot',
    icon: '⚡',
    category: 'Dunia Pokémon',
    w: 2,
    h: 2,
    kind: 'npc',
    subType: 'archaludon',
    desc: 'Pokémon Steel/Dragon Berbentuk Jembatan Railgun Penembak Electro Shot (2x2)',
    defaultDialogue: "ARCHALUDON: 'Zzzzt-CLANGGG...!' ⚡🌉 [Tech Guardian: Structural Steel Architecture & High-Voltage Data Pipelines] Mengisi daya railgun baja dan menembakkan Electro Shot berkecepatan tinggi melintasi jaringan.",
  },
  {
    id: 'tpl_gougingfire',
    name: 'Gouging Fire Sang Penguasa Api Purba',
    icon: '🔥',
    category: 'Dunia Pokémon',
    w: 2,
    h: 2,
    kind: 'npc',
    subType: 'gougingfire',
    desc: 'Pokémon Paradox Fire/Dragon Berpelindung Burning Bulwark Membara (2x2)',
    defaultDialogue: "GOUGING FIRE: 'Grrraa-OOOORRR!' 🔥🌋 [Tech Guardian: Hardened Firewall Bastion & Volcanic Compute Cores] Perisai api purba Burning Bulwark membakar tuntas setiap ancaman dan menjaga integritas sistem.",
  },
  {
    id: 'tpl_greattusk',
    name: 'Great Tusk Sang Raksasa Gading Purba',
    icon: '🐘',
    category: 'Dunia Pokémon',
    w: 2,
    h: 2,
    kind: 'npc',
    subType: 'greattusk',
    desc: 'Pokémon Paradox Ground/Fighting Penghancur Daratan dengan Headlong Rush (2x2)',
    defaultDialogue: "GREAT TUSK: 'Brrrooo-THUDDD!' 🐘🪨 [Tech Guardian: Heavy Data Ingestion & Unstoppable Throughput] Menerjang rintangan teknis tanpa henti dengan gading purba dan kekuatan seismik Headlong Rush!",
  },
  {
    id: 'tpl_kyurem',
    name: 'Kyurem Sang Naga Batas Es Absolut',
    icon: '❄️',
    category: 'Dunia Pokémon',
    w: 2,
    h: 2,
    kind: 'npc',
    subType: 'kyurem',
    desc: 'Pokémon Legendaris Dragon/Ice Penguasa Nol Absolut & Glaciate (2x2)',
    defaultDialogue: "KYUREM: 'Krrrr-SHHHOOO...!' ❄️💎 [Tech Guardian: Sub-Zero Latency Optimization & Immutable State Snapshots] Membekukan bottleneck seketika lewat hembusan kristal es Glaciate.",
  },
  {
    id: 'tpl_salamence',
    name: 'Salamence Sang Naga Sayap Merah',
    icon: '🐲',
    category: 'Dunia Pokémon',
    w: 2,
    h: 2,
    kind: 'npc',
    subType: 'salamence',
    desc: 'Pokémon Pseudo-Legendary Dragon/Flying Penguasa Langit & Draco Meteor (2x2)',
    defaultDialogue: "SALAMENCE: 'Gyaaa-RAAAHHH!' 🐲☄️ [Tech Guardian: Cloud Flight Orchestration & High-Altitude Scalability] Sayap merahnya membelah langit kota sambil menghujankan meteor energi Draco Meteor!",
  },
  {
    id: 'tpl_pikachu',
    name: 'Maskot Pikachu Ceria',
    icon: '⚡',
    category: 'Dunia Pokémon',
    w: 1,
    h: 1,
    kind: 'object',
    subType: 'pikachu',
    desc: 'Maskot Pikachu ramah dengan ekor kilat ceria (1x1)',
    defaultDialogue: 'Pikachu: "Pika-pika! Chaaarrr!" ⚡ Pikachu menyambutmu dengan lompatan gembira dan kilatan listrik kecil di pipi merahnya!',
  },
  {
    id: 'tpl_sub_doll',
    name: 'Boneka Substitute Latihan',
    icon: '🦖',
    category: 'Dunia Pokémon',
    w: 1,
    h: 1,
    kind: 'object',
    subType: 'sub_doll',
    desc: 'Boneka dinosaurus hijau decoy pengganti serangan (1x1)',
    defaultDialogue: 'Boneka Substitute (Migawari) untuk latihan battle! Siap menahan satu serangan telak demi menjaga fokus tim di arena.',
  },
  {
    id: 'tpl_egg_incubator',
    name: 'Inkubator Telur Pokémon',
    icon: '🥚',
    category: 'Dunia Pokémon',
    w: 1,
    h: 2,
    kind: 'object',
    subType: 'egg_incubator',
    desc: 'Kapsul laboratorium kaca penghangat telur Pokémon (1x2)',
    defaultDialogue: 'Inkubator Laboratorium Bio-Tech: Telur Pokémon misterius sedang dihangatkan. Detak jantung di dalamnya terdeteksi stabil dan sehat!',
  },
  {
    id: 'tpl_pc_terminal',
    name: 'Terminal PC Bill',
    icon: '💻',
    category: 'Dunia Pokémon',
    w: 1,
    h: 2,
    kind: 'object',
    subType: 'pc_terminal',
    desc: 'Terminal komputer cloud storage Pokémon luar ruangan (1x2)',
    defaultDialogue: 'Terminal PC Bill: "Someone\'s PC". Terhubung ke sistem cloud storage untuk mengelola daftar Pokémon dan artefak proyek.',
  },
  {
    id: 'tpl_poke_house',
    name: 'Rumah Mungil Pokémon',
    icon: '🏠',
    category: 'Dunia Pokémon',
    w: 2,
    h: 2,
    kind: 'object',
    subType: 'poke_house',
    desc: 'Pondok kayu mungil beratap genteng merah (2x2)',
    defaultDialogue: 'Rumah singgah mungil beratap merah untuk Pokémon pendamping. Sangat nyaman dan hangat setelah lelah berpetualang seharian.',
  },
  {
    id: 'tpl_ancient_pillar',
    name: 'Paradox Ancient Pillar',
    icon: '🏛️',
    category: 'Dunia Pokémon',
    w: 1,
    h: 2,
    kind: 'object',
    subType: 'ancient_pillar',
    desc: 'Pilar batu purba Area Zero berpendar rune solar keemasan (1x2)',
    defaultDialogue: 'Pilar Monolit Purba (Habitat Koraidon, Gouging Fire & Great Tusk): Rune surya berdenyut memancarkan energi Area Zero.',
  },
  {
    id: 'tpl_volcanic_vent',
    name: 'Volcanic Magma Vent',
    icon: '🌋',
    category: 'Dunia Pokémon',
    w: 1,
    h: 1,
    kind: 'object',
    subType: 'volcanic_vent',
    desc: 'Kawah mini lava berpijar untuk habitat Pokémon Api/Paradox (1x1)',
    defaultDialogue: 'Kawah Magma Aktif: Uap panas vulkanik menjaga suhu inti habitat Gouging Fire dan Charizard.',
  },
  {
    id: 'tpl_alloy_beacon',
    name: 'Alloy Skybridge Beacon',
    icon: '🗼',
    category: 'Dunia Pokémon',
    w: 1,
    h: 2,
    kind: 'object',
    subType: 'alloy_beacon',
    desc: 'Pilon menara baja konduktor elektro untuk habitat Archaludon & Salamence (1x2)',
    defaultDialogue: 'Menara Pilon Baja Elektro: Mengumpulkan muatan listrik atmosfer untuk Electro Shot milik Archaludon dan navigasi terbang Salamence.',
  },
  {
    id: 'tpl_frost_shrine',
    name: 'Boundary Frost Shrine',
    icon: '🧊',
    category: 'Dunia Pokémon',
    w: 2,
    h: 2,
    kind: 'object',
    subType: 'frost_shrine',
    desc: 'Kuil kristal es nol absolut untuk Tao Trio Plaza / Kyurem (2x2)',
    defaultDialogue: 'Kuil Kristal Batas Es (Habitat Kyurem & Tao Trio): Memancarkan hawa dingin abadi dan resonansi energi Unova.',
  },

  // 👾 3b. Dunia Digimon (Otomatis dari DIGIMON_CATALOG Tier 1+)
  ...DIGIMON_CATALOG.map((d) => ({
    id: `tpl_digi_${d.id}`,
    name: d.title,
    icon: d.iconEmoji,
    category: 'Dunia Digimon' as const,
    w: 2,
    h: 2,
    kind: 'digimon' as const,
    subType: d.id,
    desc: `${d.stage} • ${d.attribute} | Jurus: ${d.signatureMove} (2x2)`,
    defaultDialogue: `${d.name.toUpperCase()} (${d.stage} · ${d.attribute}): "${d.lore}" Jurus Khas: ${d.signatureMove}.`,
  })),

  // 💻 4. Teknologi, AI & Engineering (Tech & Dev Props)
  {
    id: 'tpl_server_rack',
    name: 'Kabinet Edge AI Server',
    icon: '🖥️',
    category: 'Tech & AI',
    w: 1,
    h: 2,
    kind: 'object',
    subType: 'server_rack',
    desc: 'Server rack outdoor tahan cuaca dengan lampu LED aktif (1x2)',
    defaultDialogue: 'Kabinet Edge AI Server: Didukung akselerasi GPU TensorRT untuk inferensi model YOLOv11 dengan latensi super rendah (~1.8 ms/frame).',
  },
  {
    id: 'tpl_solar_panel',
    name: 'Panel Surya Smart Grid',
    icon: '☀️',
    category: 'Tech & AI',
    w: 2,
    h: 2,
    kind: 'object',
    subType: 'solar_panel',
    desc: 'Array modul photovoltaic biru penyuplai energi bersih (2x2)',
    defaultDialogue: 'Array Panel Surya Smart Grid: Menyuplai energi bersih terbarukan untuk seluruh perangkat komputasi kota secara mandiri.',
  },
  {
    id: 'tpl_drone_pad',
    name: 'Landasan & Drone AeroScan',
    icon: '🚁',
    category: 'Tech & AI',
    w: 2,
    h: 2,
    kind: 'object',
    subType: 'drone_pad',
    desc: 'Helipad mini H dengan drone quadcopter otonom AeroScan (2x2)',
    defaultDialogue: 'Landasan AeroScan Aerial AI: Drone otonom siap lepas landas untuk patroli pengawasan udara dan deteksi pesawat militer berbasis computer vision.',
  },
  {
    id: 'tpl_holo_projector',
    name: 'Proyektor Hologram 3D',
    icon: '🌐',
    category: 'Tech & AI',
    w: 1,
    h: 2,
    kind: 'object',
    subType: 'holo_projector',
    desc: 'Pedestal pemancar kisi kubus hologram interaktif cyan (1x2)',
    defaultDialogue: 'Proyektor Hologram 3D: Menampilkan topologi arsitektur sistem multi-agent cerdas dan visualisasi graf data secara real-time.',
  },
  {
    id: 'tpl_bike_rack',
    name: 'Parkir Sepeda Acro/Mach',
    icon: '🚲',
    category: 'Tech & AI',
    w: 2,
    h: 1,
    kind: 'object',
    subType: 'bike_rack',
    desc: 'Rak sepeda tempa besi dengan Mach & Acro Bike (2x1)',
    defaultDialogue: 'Area Parkir Sepeda Kota: Ada Mach Bike untuk kecepatan tinggi di jalan lurus dan Acro Bike untuk melompati rintangan curam!',
  },
  {
    id: 'tpl_sat_dish',
    name: 'Parabola Satelit Telemetry',
    icon: '📡',
    category: 'Tech & AI',
    w: 2,
    h: 2,
    kind: 'object',
    subType: 'sat_dish',
    desc: 'Antena parabola telemetry stasiun bumi pengamat angkasa (2x2)',
    defaultDialogue: 'Stasiun Parabola Telemetry Satelit: Mengunduh citra satelit dan data geospasial real-time untuk pemetaan kawasan dan analisis GIS.',
  },
  {
    id: 'tpl_rover_bot',
    name: 'Robot Kurir LiDAR',
    icon: '🤖',
    category: 'Tech & AI',
    w: 1,
    h: 1,
    kind: 'object',
    subType: 'rover_bot',
    desc: 'Robot otonom 6 roda dengan sensor LiDAR & navigasi SLAM (1x1)',
    defaultDialogue: 'Robot Kurir Otonom LiDAR: Menggunakan algoritma SLAM & navigasi berbasis sensor jarak untuk mengantarkan paket ke seluruh penjuru kota.',
  },

  // ⛲ 5. Fasilitas & Dekorasi Kota (Civic & Landmarks)
  {
    id: 'tpl_torii_gate',
    name: 'Gerbang Torii Taman',
    icon: '⛩️',
    category: 'Fasilitas & Kota',
    w: 3,
    h: 2,
    kind: 'object',
    subType: 'torii_gate',
    desc: 'Gerbang merah vermilion megah khas kuil Shinto (3x2)',
    defaultDialogue: 'Gerbang Torii Tradisional: Menandai batas sakral dan jalan setapak menuju keindahan alam taman kota yang harmonis.',
  },
  {
    id: 'tpl_jukebox',
    name: 'Jukebox Musik Retro',
    icon: '🎵',
    category: 'Fasilitas & Kota',
    w: 1,
    h: 2,
    kind: 'object',
    subType: 'jukebox',
    desc: 'Jukebox neon vintage pemutar instrumen nostalgia (1x2)',
    defaultDialogue: 'Jukebox Musik Retro: Memutar melodi 8-bit nostalgia kota Jubilife dan Canalave City. Suasananya begitu menenangkan!',
  },
  {
    id: 'tpl_notice_board',
    name: 'Papan Buletin Kota',
    icon: '🪧',
    category: 'Fasilitas & Kota',
    w: 2,
    h: 1,
    kind: 'object',
    subType: 'notice_board',
    desc: 'Papan kayu beratap dengan lembar pengumuman kota (2x1)',
    defaultDialogue: 'Papan Buletin Kota Zulfan: "Selamat datang, penjelajah! Silakan kunjungi Dev Center di utara untuk melihat showcase proyek lengkap."',
  },
  {
    id: 'tpl_vending',
    name: 'Mesin Minuman Vending',
    icon: '🥤',
    category: 'Fasilitas & Kota',
    w: 1,
    h: 2,
    kind: 'object',
    subType: 'vending',
    desc: 'Mesin minuman dingin otomatis (1x2)',
    defaultDialogue: 'Mesin penjual otomatis retro. Tersedia Fresh Water, Soda Pop, dan Lemonade dingin untuk memulihkan energi!',
  },
  {
    id: 'tpl_statue',
    name: 'Patung Pahlawan',
    icon: '🗿',
    category: 'Fasilitas & Kota',
    w: 1,
    h: 1,
    kind: 'object',
    subType: 'statue',
    desc: 'Monumen patung perunggu bersejarah (1x1)',
    defaultDialogue: 'Monumen patung pahlawan kota yang berdiri megah menghormati perintis teknologi masa lalu.',
  },
  {
    id: 'tpl_telescope',
    name: 'Teleskop Pengamat',
    icon: '🔭',
    category: 'Fasilitas & Kota',
    w: 2,
    h: 2,
    kind: 'object',
    subType: 'telescope',
    desc: 'Teleskop pengamat pemandangan laut (2x2)',
    defaultDialogue: 'Teleskop pengamat laut lepas. Kamu bisa melihat cakrawala samudra luas dan mercusuar di kejauhan.',
  },
  {
    id: 'tpl_campfire',
    name: 'Api Unggun Berkemah',
    icon: '🔥',
    category: 'Fasilitas & Kota',
    w: 2,
    h: 2,
    kind: 'object',
    subType: 'campfire',
    desc: 'Api unggun hangat lingkar batu (2x2)',
    defaultDialogue: 'Api unggun hangat yang menyala ceria di dalam lingkar batu. Suara kayunya berderak menenangkan.',
  },
  {
    id: 'tpl_tent',
    name: 'Tenda Pos Ranger',
    icon: '⛺',
    category: 'Fasilitas & Kota',
    w: 3,
    h: 3,
    kind: 'object',
    subType: 'tent',
    desc: 'Tenda kanvas pos ekspedisi ranger (3x3)',
    defaultDialogue: 'Tenda pos ekspedisi Pokémon Ranger. Berisi peta topografi, kompas, dan perlengkapan survival lapangan.',
  },
  {
    id: 'tpl_sign_board',
    name: 'Papan Petunjuk Jalan',
    icon: '🪧',
    category: 'Fasilitas & Kota',
    w: 1,
    h: 1,
    kind: 'sign',
    subType: 'sign',
    desc: 'Papan petunjuk arah & catatan kota (1x1)',
    defaultDialogue: 'Papan petunjuk jalan: Utara menuju Dev Center & Lab AI, Barat menuju Pelabuhan Samudra, Timur menuju Battle Arena.',
  },
  {
    id: 'tpl_npc_trainer',
    name: 'Karakter Warga Kota',
    icon: '🚶',
    category: 'Fasilitas & Kota',
    w: 1,
    h: 1,
    kind: 'npc',
    subType: 'npc',
    desc: 'Karakter warga/trainer interaktif (1x1)',
    defaultDialogue: 'Warga Kota Zulfan: "Halo trainer! Kota ini dibangun dengan kombinasi kecintaan pada Pokémon dan rekayasa kecerdasan buatan."',
  },
  {
    id: 'tpl_fence_water',
    name: 'Pagar Pembatas Tepi Air',
    icon: '⚓',
    category: 'Fasilitas & Kota',
    w: 1,
    h: 1,
    kind: 'object',
    subType: 'fence_water',
    desc: 'Pagar pembatas besi & bibir batu tepi laut / dermaga (1x1)',
    defaultDialogue: 'Pagar pembatas tepi air yang kokoh di tepi laut. Melindungi pejalan kaki dari deburan ombak teluk.',
  },
  // 🏰 7. Kerajaan Medieval (7 Bangunan Utama + 8 Dekorasi & NPC Kerajaan)
  {
    id: 'tpl_royal_castle',
    name: 'Grand Royal Citadel',
    icon: '🏰',
    category: '🏰 Kerajaan Medieval',
    w: 11,
    h: 9,
    kind: 'building',
    subType: 'royal_castle',
    desc: 'Kastil batu megah bermenara kembar & portcullis (11×9)',
    defaultDialogue: 'Grand Royal Citadel of Avalon: Istana utama kerajaan bermahkota panji singa emas.',
  },
  {
    id: 'tpl_blacksmith_forge',
    name: 'Dragonflame Blacksmith',
    icon: '⚒️',
    category: '🏰 Kerajaan Medieval',
    w: 7,
    h: 6,
    kind: 'building',
    subType: 'blacksmith_forge',
    desc: 'Bengkel pandai besi dengan tungku menyala & cerobong batu (7×6)',
    defaultDialogue: 'Dragonflame Blacksmith: Pandai besi kerajaan menempa pedang baja dan perisai ksatria.',
  },
  {
    id: 'tpl_medieval_tavern',
    name: 'The Golden Griffin Inn',
    icon: '🍺',
    category: '🏰 Kerajaan Medieval',
    w: 8,
    h: 6,
    kind: 'building',
    subType: 'medieval_tavern',
    desc: 'Penginapan Tudor half-timbered berjendela lentera hangat (8×6)',
    defaultDialogue: 'The Golden Griffin Inn: Penginapan dan kedai hangat untuk para pengelana kerajaan.',
  },
  {
    id: 'tpl_mage_tower',
    name: 'Astral Mage Sanctum',
    icon: '📜',
    category: '🏰 Kerajaan Medieval',
    w: 6,
    h: 8,
    kind: 'building',
    subType: 'mage_tower',
    desc: 'Menara penyihir tinggi berkubah ungu & astrolab emas (6×8)',
    defaultDialogue: 'Astral Mage Sanctum: Menara perpustakaan sihir dan astrolab kuno.',
  },
  {
    id: 'tpl_knights_barracks',
    name: "Knights' Order Barracks",
    icon: '🛡️',
    category: '🏰 Kerajaan Medieval',
    w: 7,
    h: 7,
    kind: 'building',
    subType: 'knights_barracks',
    desc: 'Barak garnisun ksatria berlambang perisai perak-merah (7×7)',
    defaultDialogue: "Knights' Order Barracks: Markas garnisun ksatria pelindung benteng Avalon.",
  },
  {
    id: 'tpl_jousting_arena',
    name: 'Royal Jousting Arena',
    icon: '🏇',
    category: '🏰 Kerajaan Medieval',
    w: 11,
    h: 9,
    kind: 'building',
    subType: 'jousting_arena',
    desc: 'Lapangan turnamen berkuda dengan paviliun merah-emas (11×9)',
    defaultDialogue: 'Royal Jousting Arena: Arena turnamen ksatria dan adu ketangkasan berkuda.',
  },
  {
    id: 'tpl_royal_chapel',
    name: 'Stained-Glass Abbey',
    icon: '🔔',
    category: '🏰 Kerajaan Medieval',
    w: 10,
    h: 9,
    kind: 'building',
    subType: 'royal_chapel',
    desc: 'Katedral Gotik bermenara lonceng & jendela mawar warna-warni (10×9)',
    defaultDialogue: 'Saint Avalon Abbey: Katedral Gotik dengan kaca patri suci dan lonceng perunggu.',
  },
  {
    id: 'tpl_market_stall',
    name: 'Medieval Market Stall',
    icon: '🏪',
    category: '🏰 Kerajaan Medieval',
    w: 3,
    h: 2,
    kind: 'object',
    subType: 'market_stall',
    desc: 'Kios pasar abad pertengahan beratap kain belang (3×2)',
    defaultDialogue: 'Kios pedagang guild bazaar yang menjual zirah, ramuan, dan roti hangat.',
  },
  {
    id: 'tpl_watchtower',
    name: 'Battlement Watchtower',
    icon: '🗼',
    category: '🏰 Kerajaan Medieval',
    w: 3,
    h: 4,
    kind: 'object',
    subType: 'watchtower',
    desc: 'Menara pengawas sudut benteng batu beratap runcing (3×4)',
    defaultDialogue: 'Menara pengawal batu yang menjaga perimeter parit kastil.',
  },
  {
    id: 'tpl_excalibur_shrine',
    name: 'Excalibur Stone Pedestal',
    icon: '⚔️',
    category: '🏰 Kerajaan Medieval',
    w: 2,
    h: 2,
    kind: 'object',
    subType: 'excalibur_shrine',
    desc: 'Altar air mancur batu dengan pedang suci Excalibur tertancap (2×2)',
    defaultDialogue: 'Sword in the Stone: Pedang legendaris Excalibur berkilau di jantung Excalibur Plaza.',
  },
  {
    id: 'tpl_royal_banner',
    name: 'Heraldic Banner Pole',
    icon: '🚩',
    category: '🏰 Kerajaan Medieval',
    w: 1,
    h: 2,
    kind: 'object',
    subType: 'royal_banner',
    desc: 'Tiang panji kerajaan merah-emas berkibar (1×2)',
    defaultDialogue: 'Panji singa emas kebesaran Kerajaan Avalon.',
  },
  {
    id: 'tpl_medieval_brazier',
    name: 'Cast-Iron Fire Brazier',
    icon: '🔥',
    category: '🏰 Kerajaan Medieval',
    w: 1,
    h: 1,
    kind: 'object',
    subType: 'medieval_brazier',
    desc: 'Tungku obor besi menyala hangat khas kastil (1×1)',
    defaultDialogue: 'Tungku api besi menyala menerangi halaman kastil di malam hari.',
  },
  {
    id: 'tpl_weapon_rack',
    name: 'Knight Weapon Rack',
    icon: '🗡️',
    category: '🏰 Kerajaan Medieval',
    w: 2,
    h: 1,
    kind: 'object',
    subType: 'weapon_rack',
    desc: 'Rak pedang baja, perisai heraldik & perlengkapan ksatria (2×1)',
    defaultDialogue: 'Rak senjata ksatria berisi pedang tempa dan perisai kehormatan.',
  },
  {
    id: 'tpl_wooden_cart',
    name: 'Merchant Supply Cart',
    icon: '🛒',
    category: '🏰 Kerajaan Medieval',
    w: 2,
    h: 2,
    kind: 'object',
    subType: 'wooden_cart',
    desc: 'Gerobak kayu pedagang pengangkut jerami & tong kayu ek (2×2)',
    defaultDialogue: 'Gerobak logistik pedagang yang mengangkut perbekalan menuju bazaar dan penginapan.',
  },
  {
    id: 'tpl_royal_knight',
    name: 'Royal Citadel Guard',
    icon: '💂',
    category: '🏰 Kerajaan Medieval',
    w: 1,
    h: 1,
    kind: 'npc',
    subType: 'royal_knight',
    desc: 'NPC Ksatria berzirah perak-merah bersenjata tombak jaga (1×1)',
    defaultDialogue: "SIR KNIGHT: 'Salam hormat, Pengelana! Kerajaan Avalon senantiasa aman di bawah penjagaan kami.'",
  },
];

export interface TownStateSnapshot {
  buildings: BuildingLayout[];
  tiles: [string, TileTypeKey][];
}

export type TileTypeKey =
  | 'grass'
  | 'cobble'
  | 'lab_paver'
  | 'dev_paver'
  | 'cyber_grid'
  | 'lava_rock'
  | 'cryo_ice'
  | 'holy_marble'
  | 'castle_flagstone'
  | 'royal_carpet'
  | 'tudor_cobble'
  | 'drawbridge_wood'
  | 'water'
  | 'shallow_water'
  | 'sand'
  | 'cliff'
  | 'cliff_stairs'
  | 'bridge_wood'
  | 'ledge'
  | 'hedge'
  | 'fence'
  | 'fence_water'
  | 'tall_grass'
  | 'solid_override'
  | 'walkable_override';

export const TILE_BRUSH_TYPES: { id: TileTypeKey; name: string; icon: string; desc: string }[] = [
  { id: 'cobble', name: 'Jalan Batu', icon: '🪨', desc: 'Cobblestone Street' },
  { id: 'sand', name: 'Pasir Pantai', icon: '🏖️', desc: 'Golden Coastal & Lake Sand' },
  { id: 'shallow_water', name: 'Air Dangkal', icon: '💧', desc: 'Turquoise Coral Shallows' },
  { id: 'cliff', name: 'Tebing Batu', icon: '⛰️', desc: '2.5D Terraced Rock Cliff (Solid)' },
  { id: 'cliff_stairs', name: 'Tangga Batu', icon: '🪜', desc: 'Carved Limestone Cliff Stairs' },
  { id: 'bridge_wood', name: 'Jembatan Kayu', icon: '🌉', desc: 'Timber Footbridge & Sunset Pier' },
  { id: 'ledge', name: 'Gundukan Lompat', icon: '⤵️', desc: 'One-Way Pokémon Jump Ledge (Hop South)' },
  { id: 'castle_flagstone', name: 'Batu Benteng', icon: '🏰', desc: 'Medieval Citadel Flagstone Courtyard' },
  { id: 'royal_carpet', name: 'Karpet Kerajaan', icon: '🟥', desc: 'Royal Crimson & Gold Carpet' },
  { id: 'tudor_cobble', name: 'Cobble Medieval', icon: '🧱', desc: 'Tudor Warm Medieval Street' },
  { id: 'drawbridge_wood', name: 'Papan Jembatan', icon: '🪵', desc: 'Iron-Riveted Drawbridge Oak Planks' },
  { id: 'lab_paver', name: 'Paving Lab', icon: '🏢', desc: 'High-Tech Modern Pavers' },
  { id: 'dev_paver', name: 'Lantai Megah', icon: '🏛️', desc: 'Palace Manor Pavers' },
  { id: 'cyber_grid', name: 'Lantai Siber', icon: '🧩', desc: 'Cyber & Steel Dome Circuit Grid' },
  { id: 'lava_rock', name: 'Batu Vulkanik', icon: '🌋', desc: 'Flame & Dragon Canyon Magma Rock' },
  { id: 'cryo_ice', name: 'Kristal Es', icon: '🧊', desc: 'Aqua & Cryo Bay Ice Crystal Tile' },
  { id: 'holy_marble', name: 'Marmer Suci', icon: '🏛️', desc: 'Verdant & Holy Sanctuary Sacred Marble' },
  { id: 'grass', name: 'Rumput Hijau', icon: '🌿', desc: 'Lush Green Grass' },
  { id: 'tall_grass', name: 'Rumput Liar', icon: '🌾', desc: 'Tall Grass (Critterdex encounters)' },
  { id: 'hedge', name: 'Semak Hijau', icon: '🌳', desc: 'Boxwood Hedge' },
  { id: 'fence', name: 'Pagar Besi', icon: '🚧', desc: 'Wrought-Iron Fence' },
  { id: 'fence_water', name: 'Pagar Tepi Air', icon: '⚓', desc: 'Pagar Besi & Bibir Batu Tepi Air' },
  { id: 'water', name: 'Air / Laut', icon: '🌊', desc: 'Coastal Ocean / Water' },
  { id: 'solid_override', name: 'Tembok Tabrakan', icon: '🛑', desc: 'Batas Solid Kustom (Tidak bisa lewat)' },
  { id: 'walkable_override', name: 'Lantai Bebas', icon: '🟢', desc: 'Bebas Tabrakan (Bisa lewat)' },
];

export const DEFAULT_BUILDINGS: BuildingLayout[] = canonicalLayout.buildings as BuildingLayout[];

const STORAGE_KEY_TOWN = 'zulfan_town_custom_layout_100x100_v2';
const STORAGE_KEY_DIGIMON = 'zulfan_digimon_custom_layout_v1';
const STORAGE_KEY_KINGDOM = 'zulfan_kingdom_custom_layout_v1';
const STORAGE_KEY_DARK_CASTLE = 'zulfan_dark_castle_custom_layout_v1';
const STORAGE_KEY_HARBOUR = 'zulfan_harbour_custom_layout_v1';
const STORAGE_KEY_SKY_CASTLE = 'zulfan_sky_castle_custom_layout_v1';

const PURGED_LEGACY_IDS = new Set([
  'lamp_cafe_1',
  'lamp_cafe_2',
  'lamp_cafe_3',
  'lamp_cafe_4',
  'lamp_cafe_5',
  'lamp_cafe_6',
  'lamp_cafe_east_n',
  'lamp_cafe_east_s',
  'lamp_blvd_e2',
  'lamp_home',
  'lamp_civic_n',
  'lamp_prom_1',
  'lamp_prom_2',
  'lamp_prom_3',
  'lamp_prom_4',
  'lamp_prom_5',
  'lamp_bw_1',
  'lamp_bw_2',
  'lamp_bw_3',
  'lamp_gazebo',
  'lamp_cy_nw',
  'lamp_cy_ne',
  'lamp_cy_sw',
  'lamp_cy_se',
  'mastemon_mwnazxq0',
  'plusnamon_mwrx7e4k',
]);

class TownConfigManager {
  private activeWorld: WorldTarget = 'town';
  private buildings: Map<string, BuildingLayout> = new Map();
  private tileOverrides: Map<string, TileTypeKey> = new Map();
  private listeners: (() => void)[] = [];
  private historyStack: TownStateSnapshot[] = [];
  private redoStack: TownStateSnapshot[] = [];
  private maxHistory = 60;

  constructor() {
    this.populateDefaults();
  }

  public getActiveWorld(): WorldTarget {
    return this.activeWorld;
  }

  public getBounds(): { w: number; h: number } {
    if (this.activeWorld === 'digimon') return { w: 40, h: 45 };
    if (this.activeWorld === 'kingdom') return { w: 45, h: 60 };
    if (this.activeWorld === 'harbour') return { w: 45, h: 60 };
    if (this.activeWorld === 'sky-castle') return { w: 45, h: 60 };
    if (this.activeWorld === 'dark-castle') return { w: 45, h: 64 };
    return { w: 100, h: 100 };
  }

  private getStorageKey(): string {
    if (this.activeWorld === 'digimon') return STORAGE_KEY_DIGIMON;
    if (this.activeWorld === 'kingdom') return STORAGE_KEY_KINGDOM;
    if (this.activeWorld === 'harbour') return STORAGE_KEY_HARBOUR;
    if (this.activeWorld === 'sky-castle') return STORAGE_KEY_SKY_CASTLE;
    if (this.activeWorld === 'dark-castle') return STORAGE_KEY_DARK_CASTLE;
    return STORAGE_KEY_TOWN;
  }

  private getCanonicalSource(): { buildings: BuildingLayout[]; tiles: [string, TileTypeKey][] } {
    if (this.activeWorld === 'digimon') {
      return {
        buildings: (digimonCanonicalLayout.buildings || []) as BuildingLayout[],
        tiles: (digimonCanonicalLayout.tiles || []) as [string, TileTypeKey][],
      };
    }
    if (this.activeWorld === 'kingdom') {
      return {
        buildings: (kingdomCanonicalLayout.buildings || []) as BuildingLayout[],
        tiles: (kingdomCanonicalLayout.tiles || []) as [string, TileTypeKey][],
      };
    }
    if (this.activeWorld === 'harbour') {
      return {
        buildings: (harbourCanonicalLayout.buildings || []) as BuildingLayout[],
        tiles: (harbourCanonicalLayout.tiles || []) as [string, TileTypeKey][],
      };
    }
    if (this.activeWorld === 'sky-castle') {
      return {
        buildings: (skyCastleCanonicalLayout.buildings || []) as BuildingLayout[],
        tiles: (skyCastleCanonicalLayout.tiles || []) as [string, TileTypeKey][],
      };
    }
    if (this.activeWorld === 'dark-castle') {
      return {
        buildings: (darkCastleCanonicalLayout.buildings || []) as BuildingLayout[],
        tiles: (darkCastleCanonicalLayout.tiles || []) as [string, TileTypeKey][],
      };
    }
    return {
      buildings: (canonicalLayout.buildings || []) as BuildingLayout[],
      tiles: (canonicalLayout.tiles || []) as [string, TileTypeKey][],
    };
  }

  public setActiveWorld(world: WorldTarget) {
    if (this.activeWorld === world) return;
    this.activeWorld = world;
    this.historyStack = [];
    this.redoStack = [];
    this.populateDefaults();
    this.loadFromStorage();
    this.notify();
  }

  public populateDefaults() {
    this.buildings.clear();
    const { buildings: sourceBuildings, tiles: sourceTiles } = this.getCanonicalSource();
    for (const b of sourceBuildings) {
      this.buildings.set(b.id, { ...b });
    }
    this.tileOverrides.clear();
    if (Array.isArray(sourceTiles)) {
      for (const [k, v] of sourceTiles) {
        this.tileOverrides.set(k, v);
      }
    }
  }

  public subscribe(cb: () => void) {
    this.listeners.push(cb);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== cb);
    };
  }

  private notify() {
    for (const cb of this.listeners) {
      try { cb(); } catch (e) { console.error(e); }
    }
  }

  public getBuildings(includeHidden = false): BuildingLayout[] {
    const list = Array.from(this.buildings.values());
    if (includeHidden) return list;
    return list.filter((b) => !b.hidden);
  }

  public getBuilding(id: string): BuildingLayout | undefined {
    return this.buildings.get(id);
  }

  public deleteBuilding(id: string) {
    const b = this.buildings.get(id);
    if (!b || b.locked) return;
    this.pushSnapshot(this.captureSnapshot());
    b.hidden = true;
    this.saveToStorage();
    this.notify();
  }

  public purgeBuilding(id: string) {
    if (!this.buildings.has(id)) return;
    this.pushSnapshot(this.captureSnapshot());
    this.buildings.delete(id);
    this.saveToStorage();
    this.notify();
  }

  public purgeAllHiddenBuildings(): number {
    this.pushSnapshot(this.captureSnapshot());
    let count = 0;
    for (const [id, b] of this.buildings.entries()) {
      if (b.hidden) {
        this.buildings.delete(id);
        count++;
      }
    }
    if (count > 0) {
      this.saveToStorage();
      this.notify();
    }
    return count;
  }

  public deleteBuildings(ids: string[]) {
    const valid = ids.filter((id) => {
      const b = this.buildings.get(id);
      return b && !b.locked;
    });
    if (valid.length === 0) return;
    this.pushSnapshot(this.captureSnapshot());
    for (const id of valid) {
      const b = this.buildings.get(id);
      if (b) b.hidden = true;
    }
    this.saveToStorage();
    this.notify();
  }

  public toggleBuildingLock(id: string): boolean {
    const b = this.buildings.get(id);
    if (!b) return false;
    this.pushSnapshot(this.captureSnapshot());
    b.locked = !b.locked;
    this.saveToStorage();
    this.notify();
    return b.locked;
  }

  public setBuildingZIndex(id: string, delta: number): number {
    const b = this.buildings.get(id);
    if (!b) return 0;
    this.pushSnapshot(this.captureSnapshot());
    b.zIndex = (b.zIndex || 0) + delta;
    this.saveToStorage();
    this.notify();
    return b.zIndex;
  }

  public setBuildingDoorPos(id: string, x: number, y: number) {
    const b = this.buildings.get(id);
    if (!b) return;
    this.pushSnapshot(this.captureSnapshot());
    b.doorX = Math.round(x);
    b.doorY = Math.round(y);
    this.saveToStorage();
    this.notify();
  }

  public setBuildingLabelPos(id: string, x: number, y: number) {
    const b = this.buildings.get(id);
    if (!b) return;
    this.pushSnapshot(this.captureSnapshot());
    b.labelX = Number(x.toFixed(1));
    b.labelY = Number(y.toFixed(1));
    this.saveToStorage();
    this.notify();
  }

  public duplicateBuilding(id: string): BuildingLayout | null {
    const b = this.buildings.get(id);
    if (!b) return null;
    this.pushSnapshot(this.captureSnapshot());
    const prefix = b.subType || b.kind || 'obj';
    const count = Array.from(this.buildings.values()).filter((item) => item.id.startsWith(prefix)).length + 1;
    const newId = `${prefix}_copy_${Date.now().toString(36)}`;
    const newName = `${b.name} (Copy ${count})`;
    const { w: mapW, h: mapH } = this.getBounds();
    const clampedX = Math.max(0, Math.min(mapW - b.w, b.x + 1));
    const clampedY = Math.max(0, Math.min(mapH - b.h, b.y + 1));
    const clone: BuildingLayout = {
      ...b,
      id: newId,
      name: newName,
      x: clampedX,
      y: clampedY,
      doorX: b.doorX !== undefined ? b.doorX + 1 : undefined,
      doorY: b.doorY !== undefined ? b.doorY + 1 : undefined,
      labelX: b.labelX !== undefined ? b.labelX + 1 : undefined,
      labelY: b.labelY !== undefined ? b.labelY + 1 : undefined,
      locked: false,
    };
    this.buildings.set(newId, clone);
    this.saveToStorage();
    this.notify();
    return clone;
  }

  public duplicateBuildings(ids: string[]): BuildingLayout[] {
    if (ids.length === 0) return [];
    this.pushSnapshot(this.captureSnapshot());
    const cloned: BuildingLayout[] = [];
    const { w: mapW, h: mapH } = this.getBounds();
    for (const id of ids) {
      const b = this.buildings.get(id);
      if (!b) continue;
      const prefix = b.subType || b.kind || 'obj';
      const count = Array.from(this.buildings.values()).filter((item) => item.id.startsWith(prefix)).length + 1;
      const newId = `${prefix}_copy_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 5)}`;
      const newName = `${b.name} (Copy ${count})`;
      const clampedX = Math.max(0, Math.min(mapW - b.w, b.x + 1));
      const clampedY = Math.max(0, Math.min(mapH - b.h, b.y + 1));
      const clone: BuildingLayout = {
        ...b,
        id: newId,
        name: newName,
        x: clampedX,
        y: clampedY,
        doorX: b.doorX !== undefined ? b.doorX + 1 : undefined,
        doorY: b.doorY !== undefined ? b.doorY + 1 : undefined,
        labelX: b.labelX !== undefined ? b.labelX + 1 : undefined,
        labelY: b.labelY !== undefined ? b.labelY + 1 : undefined,
        locked: false,
      };
      this.buildings.set(newId, clone);
      cloned.push(clone);
    }
    this.saveToStorage();
    this.notify();
    return cloned;
  }

  public rotateBuilding(id: string): 'N' | 'E' | 'S' | 'W' {
    return this.rotateBuildingDirection(id, 'right');
  }

  public rotateBuildingDirection(id: string, dir: 'left' | 'right'): 'N' | 'E' | 'S' | 'W' {
    const b = this.buildings.get(id);
    if (!b) return 'N';
    const current = b.orientation || 'N';
    const nextMap: Record<'N' | 'E' | 'S' | 'W', 'N' | 'E' | 'S' | 'W'> =
      dir === 'right'
        ? { N: 'E', E: 'S', S: 'W', W: 'N' }
        : { N: 'W', W: 'S', S: 'E', E: 'N' };
    const next = nextMap[current];
    return this.setBuildingOrientation(id, next, true);
  }

  public setBuildingOrientation(
    id: string,
    orient: 'N' | 'E' | 'S' | 'W',
    pushSnap: boolean = true
  ): 'N' | 'E' | 'S' | 'W' {
    const b = this.buildings.get(id);
    if (!b) return 'N';
    if (pushSnap) {
      this.pushSnapshot(this.captureSnapshot());
    }
    const prevOrient = b.orientation || 'N';
    b.orientation = orient;

    // For benches, swap w and h when rotating between horizontal and vertical
    if (b.kind === 'bench') {
      const wasVertical = prevOrient === 'E' || prevOrient === 'W';
      const isVertical = orient === 'E' || orient === 'W';
      if (wasVertical !== isVertical) {
        const { w: mapW, h: mapH } = this.getBounds();
        const temp = b.w;
        b.w = b.h;
        b.h = temp;
        b.x = Math.max(0, Math.min(mapW - b.w, b.x));
        b.y = Math.max(0, Math.min(mapH - b.h, b.y));
      }
    }

    this.saveToStorage();
    this.notify();
    return orient;
  }

  public spawnObject(
    templateId: string,
    x: number,
    y: number,
    orientationOverride?: 'N' | 'E' | 'S' | 'W'
  ): BuildingLayout | null {
    const tpl = SPAWNABLE_TEMPLATES.find((t) => t.id === templateId);
    if (!tpl) return null;

    this.pushSnapshot(this.captureSnapshot());

    const prefix = tpl.subType || tpl.kind;
    const count = Array.from(this.buildings.values()).filter((b) => b.id.startsWith(prefix)).length + 1;
    const id = `${prefix}_${Date.now().toString(36)}`;
    const name = `${tpl.name} #${count}`;

    const { w: mapW, h: mapH } = this.getBounds();
    const clampedX = Math.max(0, Math.min(mapW - tpl.w, Math.round(x)));
    const clampedY = Math.max(0, Math.min(mapH - tpl.h, Math.round(y)));

    const newObj: BuildingLayout = {
      id,
      name,
      x: clampedX,
      y: clampedY,
      w: tpl.w,
      h: tpl.h,
      kind: tpl.kind,
      subType: tpl.subType,
      orientation:
        orientationOverride ??
        (tpl.kind === 'npc' ||
        tpl.kind === 'digimon' ||
        tpl.kind === 'building' ||
        tpl.category === 'Dunia Pokémon' ||
        tpl.category === 'Dunia Digimon'
          ? 'S'
          : 'N'),
      ...(tpl.kind === 'building'
        ? { doorX: clampedX + Math.floor(tpl.w / 2), doorY: clampedY + tpl.h - 1 }
        : {}),
      dialogue: tpl.defaultDialogue,
    };

    this.buildings.set(id, newObj);
    this.saveToStorage();
    this.notify();
    return newObj;
  }

  /** Spawns multiple catalog templates atomically (1 Undo snapshot + 1 storage write). */
  public spawnObjectsBatch(
    placements: readonly { templateId: string; x: number; y: number }[],
    recordSnapshot = true
  ): BuildingLayout[] {
    if (placements.length === 0) return [];
    if (recordSnapshot) {
      this.pushSnapshot(this.captureSnapshot());
    }

    const { w: mapW, h: mapH } = this.getBounds();
    const stamp = Date.now().toString(36);
    const created: BuildingLayout[] = [];

    placements.forEach((p, idx) => {
      const tpl = SPAWNABLE_TEMPLATES.find((t) => t.id === p.templateId);
      if (!tpl) return;
      const prefix = tpl.subType || tpl.kind;
      const count = Array.from(this.buildings.values()).filter((b) => b.id.startsWith(prefix)).length + 1;
      const id = `${prefix}_${stamp}_${idx}_${Math.random().toString(36).slice(2, 5)}`;
      const clampedX = Math.max(0, Math.min(mapW - tpl.w, Math.round(p.x)));
      const clampedY = Math.max(0, Math.min(mapH - tpl.h, Math.round(p.y)));

      const newObj: BuildingLayout = {
        id,
        name: `${tpl.name} #${count}`,
        x: clampedX,
        y: clampedY,
        w: tpl.w,
        h: tpl.h,
        kind: tpl.kind,
        subType: tpl.subType,
        orientation:
          tpl.kind === 'npc' ||
          tpl.kind === 'digimon' ||
          tpl.kind === 'building' ||
          tpl.category === 'Dunia Pokémon' ||
          tpl.category === 'Dunia Digimon'
            ? 'S'
            : 'N',
        ...(tpl.kind === 'building'
          ? { doorX: clampedX + Math.floor(tpl.w / 2), doorY: clampedY + tpl.h - 1 }
          : {}),
        dialogue: tpl.defaultDialogue,
      };
      this.buildings.set(id, newObj);
      created.push(newObj);
    });

    if (created.length > 0) {
      this.saveToStorage();
      this.notify();
    }
    return created;
  }

  /** Places all items of a curated catalog Theme Bundle around `(anchorX, anchorY)`. */
  public spawnThemeBundle(bundleId: string, anchorX: number, anchorY: number): BuildingLayout[] {
    const bundle = CATALOG_THEME_BUNDLES.find((b) => b.id === bundleId);
    if (!bundle) return [];
    const placements = bundle.items.map((item) => ({
      templateId: item.templateId,
      x: anchorX + item.dx,
      y: anchorY + item.dy,
    }));
    return this.spawnObjectsBatch(placements, true);
  }

  public setBuildingDialogue(id: string, dialogue: string) {
    const b = this.buildings.get(id);
    if (!b) return;
    this.pushSnapshot(this.captureSnapshot());
    b.dialogue = dialogue;
    this.saveToStorage();
    this.notify();
  }

  public setBuildingPos(id: string, x: number, y: number) {
    const b = this.buildings.get(id);
    if (!b || b.locked) return;
    const nx = Math.round(x);
    const ny = Math.round(y);
    const dx = nx - b.x;
    const dy = ny - b.y;
    b.x = nx;
    b.y = ny;
    if (b.labelX !== undefined) b.labelX = Number((b.labelX + dx).toFixed(1));
    if (b.labelY !== undefined) b.labelY = Number((b.labelY + dy).toFixed(1));
    if (b.doorX !== undefined) {
      b.doorX += dx;
    } else if (b.kind === 'building') {
      b.doorX = b.x + Math.floor(b.w / 2);
    }
    if (b.doorY !== undefined) {
      b.doorY += dy;
    } else if (b.kind === 'building') {
      b.doorY = b.y + b.h - 1;
    }
    if (b.kind === 'building' && b.doorX !== undefined && b.doorY !== undefined) {
      if (b.doorX < b.x - 1 || b.doorX > b.x + b.w || b.doorY < b.y || b.doorY > b.y + b.h) {
        b.doorX = b.x + Math.floor(b.w / 2);
        b.doorY = b.y + b.h - 1;
      }
    }
    this.saveToStorage();
    this.notify();
  }

  public moveBuildingsBatch(
    moves: {
      id: string;
      x: number;
      y: number;
      doorX?: number;
      doorY?: number;
      labelX?: number;
      labelY?: number;
    }[]
  ) {
    const { w: mapW, h: mapH } = this.getBounds();
    for (const m of moves) {
      const b = this.buildings.get(m.id);
      if (!b || b.locked) continue;
      const nx = Math.max(0, Math.min(mapW - b.w, Math.round(m.x)));
      const ny = Math.max(0, Math.min(mapH - b.h, Math.round(m.y)));
      const dx = nx - b.x;
      const dy = ny - b.y;
      b.x = nx;
      b.y = ny;

      if (m.labelX !== undefined) {
        b.labelX = m.labelX;
      } else if (b.labelX !== undefined) {
        b.labelX = Number((b.labelX + dx).toFixed(1));
      }

      if (m.labelY !== undefined) {
        b.labelY = m.labelY;
      } else if (b.labelY !== undefined) {
        b.labelY = Number((b.labelY + dy).toFixed(1));
      }

      if (m.doorX !== undefined) {
        b.doorX = m.doorX;
      } else if (b.doorX !== undefined) {
        b.doorX += dx;
      } else if (b.kind === 'building') {
        b.doorX = b.x + Math.floor(b.w / 2);
      }

      if (m.doorY !== undefined) {
        b.doorY = m.doorY;
      } else if (b.doorY !== undefined) {
        b.doorY += dy;
      } else if (b.kind === 'building') {
        b.doorY = b.y + b.h - 1;
      }

      if (b.kind === 'building' && b.doorX !== undefined && b.doorY !== undefined) {
        if (b.doorX < b.x - 1 || b.doorX > b.x + b.w || b.doorY < b.y || b.doorY > b.y + b.h) {
          b.doorX = b.x + Math.floor(b.w / 2);
          b.doorY = b.y + b.h - 1;
        }
      }
    }
    this.saveToStorage();
    this.notify();
  }

  public getTileOverride(x: number, y: number): TileTypeKey | undefined {
    return this.tileOverrides.get(`${x},${y}`);
  }

  public setTileOverride(x: number, y: number, tile: TileTypeKey) {
    this.tileOverrides.set(`${x},${y}`, tile);
    this.saveToStorage();
    this.notify();
  }

  public setTileOverridesBatch(tiles: { x: number; y: number; tile: TileTypeKey }[]) {
    for (const t of tiles) {
      this.tileOverrides.set(`${t.x},${t.y}`, t.tile);
    }
    this.saveToStorage();
    this.notify();
  }

  public removeTileOverride(x: number, y: number) {
    this.tileOverrides.delete(`${x},${y}`);
    this.saveToStorage();
    this.notify();
  }

  public removeTileOverridesBatch(coords: { x: number; y: number }[]) {
    for (const c of coords) {
      this.tileOverrides.delete(`${c.x},${c.y}`);
    }
    this.saveToStorage();
    this.notify();
  }

  public getAllTileOverrides(): Map<string, TileTypeKey> {
    return this.tileOverrides;
  }

  public clearAllTileOverrides() {
    this.tileOverrides.clear();
    this.saveToStorage();
    this.notify();
  }

  public captureSnapshot(): TownStateSnapshot {
    return {
      buildings: Array.from(this.buildings.values()).map((b) => ({ ...b })),
      tiles: Array.from(this.tileOverrides.entries()),
    };
  }

  public pushSnapshot(snap: TownStateSnapshot) {
    this.historyStack.push(snap);
    if (this.historyStack.length > this.maxHistory) {
      this.historyStack.shift();
    }
    this.redoStack = [];
    this.notify();
  }

  public restoreSnapshot(snap: TownStateSnapshot) {
    this.buildings.clear();
    for (const b of snap.buildings) {
      this.buildings.set(b.id, { ...b });
    }
    this.tileOverrides.clear();
    for (const [k, v] of snap.tiles) {
      this.tileOverrides.set(k, v);
    }
    this.saveToStorage();
    this.notify();
  }

  public canUndo(): boolean {
    return this.historyStack.length > 0;
  }

  public canRedo(): boolean {
    return this.redoStack.length > 0;
  }

  public cycleBuildingBehavior(id: string): 'stationary' | 'look_around' | 'patrol_small' | null {
    const b = this.buildings.get(id);
    if (!b) return null;
    this.pushSnapshot(this.captureSnapshot());
    const order: ('stationary' | 'look_around' | 'patrol_small')[] = ['stationary', 'look_around', 'patrol_small'];
    const cur = b.behavior || 'stationary';
    const next = order[(order.indexOf(cur) + 1) % order.length];
    b.behavior = next;
    this.saveToStorage();
    this.notify();
    return next;
  }

  public undo(): boolean {
    if (this.historyStack.length === 0) return false;
    const prev = this.historyStack.pop()!;
    const current = this.captureSnapshot();
    this.redoStack.push(current);
    this.restoreSnapshot(prev);
    return true;
  }

  public redo(): boolean {
    if (this.redoStack.length === 0) return false;
    const next = this.redoStack.pop()!;
    const current = this.captureSnapshot();
    this.historyStack.push(current);
    this.restoreSnapshot(next);
    return true;
  }

  public resetToDefaults(notify = true) {
    this.pushSnapshot(this.captureSnapshot());
    this.populateDefaults();
    if (typeof window !== 'undefined') {
      try { localStorage.removeItem(this.getStorageKey()); } catch {}
    }
    if (notify) this.notify();
  }

  public async saveToDisk(): Promise<{ success: boolean; message: string }> {
    const targetFile =
      this.activeWorld === 'digimon'
        ? 'src/data/digimonLayout.json'
        : this.activeWorld === 'kingdom'
          ? 'src/data/kingdomLayout.json'
          : this.activeWorld === 'harbour'
            ? 'src/data/harbourLayout.json'
            : this.activeWorld === 'sky-castle'
              ? 'src/data/skyCastleLayout.json'
              : this.activeWorld === 'dark-castle'
            ? 'src/data/darkCastleLayout.json'
            : 'src/data/townLayout.json';
    const data = {
      target: this.activeWorld,
      buildings: Array.from(this.buildings.values()).filter((b) => !b.hidden),
      tiles: Array.from(this.tileOverrides.entries()),
    };
    this.saveToStorage();
    try {
      const res = await fetch('/api/dev/save-town', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        return { success: true, message: `Tersimpan permanen ke ${targetFile}!` };
      }
      return { success: false, message: `Server error (${res.status}): Tersimpan di cadangan browser.` };
    } catch {
      return { success: false, message: 'Dev server endpoint tidak aktif. Tersimpan di cadangan browser.' };
    }
  }

  public saveToStorage() {
    if (typeof window === 'undefined') return;
    try {
      const data = {
        buildings: Array.from(this.buildings.values()),
        tiles: Array.from(this.tileOverrides.entries()),
      };
      localStorage.setItem(this.getStorageKey(), JSON.stringify(data));
    } catch (e) {
      console.warn('Failed to save town config to localStorage', e);
    }
  }

  public loadFromStorage() {
    if (typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem(this.getStorageKey());
      if (!raw) return;
      const parsed = JSON.parse(raw);

      if (
        this.activeWorld === 'digimon' ||
        this.activeWorld === 'kingdom' ||
        this.activeWorld === 'harbour' ||
        this.activeWorld === 'sky-castle' ||
        this.activeWorld === 'dark-castle'
      ) {
        let purgedLegacyFound = false;
        if (Array.isArray(parsed.buildings)) {
          for (const b of parsed.buildings) {
            if (!b.id) continue;
            if (PURGED_LEGACY_IDS.has(b.id)) {
              purgedLegacyFound = true;
              this.buildings.delete(b.id);
              continue;
            }
            this.buildings.set(b.id, b);
          }
        }
        if (Array.isArray(parsed.tiles)) {
          for (const [k, v] of parsed.tiles) {
            this.tileOverrides.set(k, v);
          }
        }
        if (purgedLegacyFound) {
          this.saveToStorage();
        }
        return;
      }

      let purgedLegacyFound = false;
      if (Array.isArray(parsed.buildings)) {
        for (const b of parsed.buildings) {
          if (!b.id) continue;
          if (PURGED_LEGACY_IDS.has(b.id)) {
            purgedLegacyFound = true;
            this.buildings.delete(b.id);
            continue;
          }
          const existing = this.buildings.get(b.id);
            if (existing) {
              if (b.id === 'arceus' && (Math.abs(b.x - 39.5) < 0.5 || Math.abs(b.x - 39) < 0.5)) {
                existing.x = 17;
                existing.y = 14;
                existing.labelX = 18;
                existing.labelY = 13.4;
              } else {
                existing.x = b.x;
                existing.y = b.y;
              }
              if (b.id === 'ace') {
                existing.name = 'Mewtwo';
                existing.subType = 'mewtwo';
              }
              if (b.id === 'ranger' && (b.name === 'Blastoise' || b.name === 'Pokémon Ranger Alex' || !b.name)) {
                existing.name = 'Tyranitar';
                existing.subType = 'tyranitar';
                existing.dialogue = "TYRANITAR: 'Gwoooaaargh!' 🪨 Tubuh zirah batu baja Tyranitar kokoh tak tergoyahkan. Siap melindungi perbatasan Zulfan's Town!";
              }
              if (b.id === 'shop' || b.id === 'depop') {
                existing.id = 'shop';
                existing.name = 'Poké Mart';
                if (!existing.link) existing.link = '/mart';
              }
              if (b.id === 'office') {
                existing.id = 'office';
                existing.name = 'Tech Tower';
                if (!existing.link) existing.link = '/tower';
              }
              if (b.labelX !== undefined && !(b.id === 'arceus' && Math.abs(b.x - 39.5) < 0.5)) {
                // If labelX was set to the left corner b.x on a multi-tile building, discard legacy uncentered coordinate
                if ((existing.w || 1) > 1 && Math.abs(b.labelX - b.x) < 0.1) {
                  existing.labelX = undefined;
                  existing.labelY = undefined;
                } else {
                  existing.labelX = b.labelX;
                  existing.labelY = b.labelY;
                }
              }
              if (b.doorX !== undefined) existing.doorX = b.doorX;
              if (b.doorY !== undefined) existing.doorY = b.doorY;
              if (existing.kind === 'building' && existing.doorX !== undefined && existing.doorY !== undefined) {
                if (
                  existing.doorX < existing.x - 1 ||
                  existing.doorX > existing.x + existing.w ||
                  existing.doorY < existing.y ||
                  existing.doorY > existing.y + existing.h
                ) {
                  existing.doorX = existing.x + Math.floor(existing.w / 2);
                  existing.doorY = existing.y + existing.h - 1;
                }
              }
              if (b.link !== undefined) existing.link = b.link;
              if (b.locked !== undefined) existing.locked = !!b.locked;
              if (b.zIndex !== undefined) existing.zIndex = b.zIndex;
              if (b.dialogue !== undefined) existing.dialogue = b.dialogue;
              existing.hidden = !!b.hidden;
              if (b.kind) existing.kind = b.kind;
              if (b.subType) existing.subType = b.subType;
              if ((b.id === 'giratina' || b.id === 'zekrom') && b.orientation === 'W') {
                existing.orientation = 'S';
                purgedLegacyFound = true;
              } else if (b.orientation) {
                existing.orientation = b.orientation;
              }
              if (b.name) existing.name = b.name;
              if (b.w !== undefined) existing.w = b.w;
              if (b.h !== undefined) existing.h = b.h;
              if (b.id === 'villa' || b.id === 'neighbour') {
                existing.id = 'villa';
                existing.name = "Neighbour's House";
                existing.link = '/neighbour';
                existing.doorX = existing.x + 2;
                existing.doorY = existing.y + (existing.h || 5) - 1;
              }
            } else {
              this.buildings.set(b.id, b);
            }
        }
      }
      if (Array.isArray(parsed.tiles)) {
        const contest = this.buildings.get('contest');
        for (const [k, v] of parsed.tiles) {
          const [xs, ys] = k.split(',');
          const x = parseInt(xs, 10);
          const y = parseInt(ys, 10);
          // Purge legacy corrupted grass/paver in South Civic Plaza & Cafe patio (X: 24..42, Y: 46..55)
          if (x >= 24 && x <= 42 && y >= 46 && y <= 55) {
            if (v === 'grass' || (x >= 34 && x <= 42 && y >= 48 && y <= 55)) {
              purgedLegacyFound = true;
              continue;
            }
          }
          // Purge legacy corrupted grass in East Dex Meadow tall grass reserve (X: 25..42, Y: 58..61)
          if (x >= 25 && x <= 42 && y >= 58 && y <= 61 && v === 'grass') {
            purgedLegacyFound = true;
            continue;
          }
          // Purge legacy corrupted paver in Contest Stage footprint
          if (contest && !contest.hidden && x >= contest.x && x < contest.x + contest.w && y >= contest.y && y < contest.y + contest.h) {
            purgedLegacyFound = true;
            continue;
          }
          this.tileOverrides.set(k, v);
        }
      }
      if (purgedLegacyFound) {
        this.saveToStorage();
      }
    } catch (e) {
      console.warn('Failed to load town config from localStorage', e);
    }
  }

  public updateObjectProperties(
    id: string,
    patch: {
      name?: string;
      dialogue?: string;
      link?: string;
      scaleMultiplier?: number;
      behavior?: 'stationary' | 'look_around' | 'patrol_small';
      x?: number;
      y?: number;
      zIndex?: number;
      doorX?: number;
      doorY?: number;
      labelX?: number;
      labelY?: number;
    },
    recordHistory = true
  ): boolean {
    const b = this.buildings.get(id);
    if (!b) return false;
    if (recordHistory) {
      this.pushSnapshot(this.captureSnapshot());
    }
    const { w: maxW, h: maxH } = this.getBounds();
    if (patch.name !== undefined && patch.name.trim()) b.name = patch.name.trim();
    if (patch.dialogue !== undefined) b.dialogue = patch.dialogue;
    if (patch.link !== undefined) {
      if (patch.link.trim()) b.link = patch.link.trim();
      else delete b.link;
    }
    if (patch.scaleMultiplier !== undefined && Number.isFinite(patch.scaleMultiplier)) {
      b.scaleMultiplier = Math.max(0.6, Math.min(1.6, Number(patch.scaleMultiplier)));
    }
    if (patch.behavior !== undefined) {
      b.behavior = patch.behavior;
    }
    if (patch.x !== undefined && Number.isFinite(patch.x)) {
      const nx = Math.max(0, Math.min(maxW - b.w, Math.round(patch.x)));
      const dx = nx - b.x;
      b.x = nx;
      if (b.doorX !== undefined && patch.doorX === undefined) b.doorX += dx;
      if (b.labelX !== undefined && patch.labelX === undefined) b.labelX = Number((b.labelX + dx).toFixed(1));
    }
    if (patch.y !== undefined && Number.isFinite(patch.y)) {
      const ny = Math.max(0, Math.min(maxH - b.h, Math.round(patch.y)));
      const dy = ny - b.y;
      b.y = ny;
      if (b.doorY !== undefined && patch.doorY === undefined) b.doorY += dy;
      if (b.labelY !== undefined && patch.labelY === undefined) b.labelY = Number((b.labelY + dy).toFixed(1));
    }
    if (patch.zIndex !== undefined && Number.isFinite(patch.zIndex)) {
      b.zIndex = Math.round(patch.zIndex);
    }
    if (patch.doorX !== undefined && Number.isFinite(patch.doorX)) {
      b.doorX = Math.max(0, Math.min(maxW - 1, Math.round(patch.doorX)));
    }
    if (patch.doorY !== undefined && Number.isFinite(patch.doorY)) {
      b.doorY = Math.max(0, Math.min(maxH - 1, Math.round(patch.doorY)));
    }
    if (patch.labelX !== undefined && Number.isFinite(patch.labelX)) {
      b.labelX = Number(patch.labelX.toFixed(1));
    }
    if (patch.labelY !== undefined && Number.isFinite(patch.labelY)) {
      b.labelY = Number(patch.labelY.toFixed(1));
    }
    this.saveToStorage();
    this.notify();
    return true;
  }

  public getDiffSummaryVsCanonical(): LayoutDiffSummary {
    const { buildings: canonBuildings, tiles: canonTiles } = this.getCanonicalSource();
    const canonBMap = new Map<string, BuildingLayout>();
    for (const cb of canonBuildings) {
      if (!cb.hidden) canonBMap.set(cb.id, cb);
    }

    const activeBuildings = this.getBuildings(false);
    let added = 0;
    let moved = 0;
    const seenIds = new Set<string>();

    for (const b of activeBuildings) {
      seenIds.add(b.id);
      const orig = canonBMap.get(b.id);
      if (!orig) {
        added++;
      } else if (
        orig.x !== b.x ||
        orig.y !== b.y ||
        orig.orientation !== b.orientation ||
        orig.behavior !== b.behavior ||
        orig.scaleMultiplier !== b.scaleMultiplier ||
        orig.dialogue !== b.dialogue
      ) {
        moved++;
      }
    }

    let removed = 0;
    for (const id of canonBMap.keys()) {
      if (!seenIds.has(id)) removed++;
    }

    const canonTileMap = new Map<string, TileTypeKey>(Array.isArray(canonTiles) ? canonTiles : []);
    let tileDiff = 0;
    for (const [k, v] of this.tileOverrides.entries()) {
      if (canonTileMap.get(k) !== v) tileDiff++;
    }
    for (const k of canonTileMap.keys()) {
      if (!this.tileOverrides.has(k)) tileDiff++;
    }

    return {
      added,
      removed,
      moved,
      tileDiff,
      totalChanges: added + removed + moved + tileDiff,
    };
  }

  private getPrefabsStorageKey(): string {
    return 'town:editor_prefabs';
  }

  public getPrefabs(): PrefabBlueprint[] {
    if (typeof window === 'undefined') return [];
    try {
      const raw = localStorage.getItem(this.getPrefabsStorageKey());
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  public savePrefab(name: string, ids: string[]): PrefabBlueprint | null {
    const selected = ids
      .map((id) => this.buildings.get(id))
      .filter((b): b is BuildingLayout => Boolean(b && !b.hidden));
    if (selected.length === 0) return null;

    const minX = Math.min(...selected.map((b) => b.x));
    const minY = Math.min(...selected.map((b) => b.y));
    const prefab: PrefabBlueprint = {
      id: `prefab_${Date.now().toString(36)}`,
      name: name.trim() || `Prefab (${selected.length} objek)`,
      createdAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      items: selected.map(({ id: _omit, ...rest }) => ({
        ...rest,
        x: rest.x - minX,
        y: rest.y - minY,
        labelX: rest.labelX !== undefined ? rest.labelX - minX : undefined,
        labelY: rest.labelY !== undefined ? rest.labelY - minY : undefined,
        doorX: rest.doorX !== undefined ? rest.doorX - minX : undefined,
        doorY: rest.doorY !== undefined ? rest.doorY - minY : undefined,
      })),
    };

    const existing = this.getPrefabs();
    existing.unshift(prefab);
    try {
      localStorage.setItem(this.getPrefabsStorageKey(), JSON.stringify(existing.slice(0, 20)));
    } catch {}
    return prefab;
  }

  public deletePrefab(prefabId: string) {
    const filtered = this.getPrefabs().filter((p) => p.id !== prefabId);
    try {
      localStorage.setItem(this.getPrefabsStorageKey(), JSON.stringify(filtered));
    } catch {}
  }

  public placePrefab(prefabId: string, anchorX: number, anchorY: number): BuildingLayout[] {
    const prefab = this.getPrefabs().find((p) => p.id === prefabId);
    if (!prefab || prefab.items.length === 0) return [];
    this.pushSnapshot(this.captureSnapshot());
    const placed: BuildingLayout[] = [];
    const stamp = Date.now().toString(36);

    const { w: maxW, h: maxH } = this.getBounds();
    prefab.items.forEach((item, idx) => {
      const id = `${item.subType || 'obj'}_${stamp}_${idx}`;
      const b: BuildingLayout = {
        ...item,
        id,
        x: Math.max(0, Math.min(maxW - (item.w || 1), anchorX + item.x)),
        y: Math.max(0, Math.min(maxH - (item.h || 1), anchorY + item.y)),
      };
      if (item.labelX !== undefined) b.labelX = b.x + (item.labelX - item.x);
      if (item.labelY !== undefined) b.labelY = b.y + (item.labelY - item.y);
      this.buildings.set(id, b);
      placed.push(b);
    });

    this.saveToStorage();
    this.notify();
    return placed;
  }

  private getSnapshotsStorageKey(): string {
    return `town:layout_snapshots:${this.activeWorld}`;
  }

  public getNamedSnapshots(): NamedLayoutSnapshot[] {
    if (typeof window === 'undefined') return [];
    try {
      const raw = localStorage.getItem(this.getSnapshotsStorageKey());
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  public saveNamedSnapshot(slot: string, label?: string): NamedLayoutSnapshot {
    const snap: NamedLayoutSnapshot = {
      slot,
      label: label?.trim() || `Slot ${slot}`,
      savedAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      buildingCount: this.getBuildings(false).length,
      tileCount: this.tileOverrides.size,
      snapshot: this.captureSnapshot(),
    };
    const list = this.getNamedSnapshots().filter((s) => s.slot !== slot);
    list.push(snap);
    list.sort((a, b) => a.slot.localeCompare(b.slot));
    try {
      localStorage.setItem(this.getSnapshotsStorageKey(), JSON.stringify(list));
    } catch {}
    return snap;
  }

  public loadNamedSnapshot(slot: string): boolean {
    const found = this.getNamedSnapshots().find((s) => s.slot === slot);
    if (!found) return false;
    this.pushSnapshot(this.captureSnapshot());
    this.restoreSnapshot(found.snapshot);
    return true;
  }

  public exportCode(): string {
    const bList = Array.from(this.buildings.values());
    const lines = [
      '// === HASIL DESAIN TATA LETAK KOTA (TOWN EDITOR 3.0 EXPORT) ===',
      '// Salin data koordinat bangunan & POI berikut ke map.ts / townBackground.ts:',
      'const BUILDINGS_LAYOUT = {',
    ];
    for (const b of bList) {
      const props: string[] = [
        `x: ${b.x}`,
        `y: ${b.y}`,
        `w: ${b.w}`,
        `h: ${b.h}`,
        `kind: '${b.kind || 'building'}'`,
      ];
      if (b.subType) props.push(`subType: '${b.subType}'`);
      if (b.orientation) props.push(`orientation: '${b.orientation}'`);
      if (b.doorX !== undefined) props.push(`doorX: ${b.doorX}`);
      if (b.doorY !== undefined) props.push(`doorY: ${b.doorY}`);
      if (b.labelX !== undefined) props.push(`labelX: ${b.labelX}`);
      if (b.labelY !== undefined) props.push(`labelY: ${b.labelY}`);
      if (b.locked) props.push(`locked: true`);
      if (b.zIndex) props.push(`zIndex: ${b.zIndex}`);
      if (b.dialogue) props.push(`dialogue: ${JSON.stringify(b.dialogue)}`);
      if (b.link) props.push(`link: '${b.link}'`);
      if (b.hidden) props.push(`hidden: true`);
      lines.push(`  ${b.id}: { ${props.join(', ')} }, // ${b.name}`);
    }
    lines.push('};');

    if (this.tileOverrides.size > 0) {
      lines.push('');
      lines.push(`// Custom Tile Overrides (${this.tileOverrides.size} petak):`);
      lines.push('const CUSTOM_TILES = [');
      for (const [coord, tile] of this.tileOverrides.entries()) {
        const [x, y] = coord.split(',');
        lines.push(`  { x: ${x}, y: ${y}, tile: '${tile}' },`);
      }
      lines.push('];');
    }

    return lines.join('\n');
  }

  public getExitRespawnForPlace(place: string): string {
    const clean = (place || '').replace(/^\/+|\/+$/g, '').toLowerCase();
    if (!clean || clean === 'town') return '48,28,down';
    if (clean === 'digimon') return '48,94,up';
    if (clean === 'kingdom') return '20,38,up';
    if (clean === 'harbour') return '22,57,up';
    if (clean === 'sky-castle') return '33,22,left';
    if (clean === 'dark-castle') return '8,22,right';
    if (clean === 'dark-cathedral' || clean === 'dark-castle/cathedral' || clean === 'cathedral') return '9,21,down';
    if (clean === 'dark-forge' || clean === 'dark-castle/forge' || clean === 'forge') return '33,25,down';
    if (clean === 'dark-manor' || clean === 'dark-castle/manor' || clean === 'manor') return '11,52,down';
    if (clean === 'dark-vault' || clean === 'dark-castle/vault' || clean === 'vault') return '34,50,down';

    if (clean === 'kingdom-castle' || clean === 'kingdom/castle') return '22,20,down';
    if (clean === 'kingdom-blacksmith' || clean === 'kingdom/blacksmith') return '8,20,down';
    if (clean === 'kingdom-tavern' || clean === 'kingdom/tavern') return '36,20,down';
    if (clean === 'kingdom-mage-tower' || clean === 'kingdom/mage-tower') return '8,36,down';
    if (clean === 'kingdom-barracks' || clean === 'kingdom/barracks') return '37,31,down';
    if (clean === 'kingdom-chapel' || clean === 'kingdom/chapel') return '34,50,down';
    if (clean === 'kingdom-jousting' || clean === 'kingdom/jousting') return '12,45,down';

    if (clean === 'harbour-lighthouse' || clean === 'harbour/lighthouse') return '11,13,down';
    if (clean === 'harbour-warehouse' || clean === 'harbour/warehouse') return '27,20,down';
    if (clean === 'harbour-inn' || clean === 'harbour/inn') return '10,30,down';
    if (clean === 'harbour-galleon' || clean === 'harbour/galleon') return '30,40,down';
    if (clean === 'harbour-market' || clean === 'harbour/market') return '7,34,down';

    if (clean === 'sky-citadel' || clean === 'sky-castle/citadel') return '22,15,down';
    if (clean === 'sky-windmill' || clean === 'sky-castle/windmill') return '8,25,down';
    if (clean === 'sky-workshop' || clean === 'sky-castle/workshop') return '6,40,down';
    if (clean === 'sky-inn' || clean === 'sky-castle/inn') return '15,46,down';
    if (clean === 'sky-observatory' || clean === 'sky-castle/observatory') return '38,27,down';
    if (clean === 'sky-chapel' || clean === 'sky-castle/chapel') return '37,47,down';

    const aliasToBuildingId: Record<string, string> = {
      dev: 'dev',
      lab: 'lab',
      about: 'home',
      home: 'home',
      reception: 'reception',
      mart: 'shop',
      shop: 'shop',
      arcade: 'arcade',
      tower: 'office',
      office: 'office',
      neighbour: 'villa',
      villa: 'villa',
      arena: 'arena',
      cafe: 'kiosk',
      kiosk: 'kiosk',
      garden: 'garden',
      berry: 'garden',
      twin: 'twin',
    };

    const fallbacks: Record<string, string> = {
      dev: '42,12,down',
      lab: '53,7,down',
      home: '63,25,down',
      reception: '64,17,down',
      shop: '65,33,down',
      arcade: '53,17,down',
      office: '65,8,down',
      villa: '53,25,down',
      arena: '64,40,down',
      kiosk: '55,32,down',
      garden: '54,44,down',
      twin: '38,23,down',
    };

    const buildingId = aliasToBuildingId[clean] || clean;
    if (this.activeWorld === 'town') {
      const targetRoute = clean === 'home' ? '/about' : `/${clean}`;
      const b =
        this.getBuilding(buildingId) ||
        this.getBuildings(true).find((item) => item.link === targetRoute || item.link === `/${clean}`);
      if (b && !b.hidden) {
        const dx = b.doorX !== undefined ? Math.round(b.doorX) : Math.round(b.x + Math.floor((b.w || 1) / 2));
        const dy = b.doorY !== undefined ? Math.round(b.doorY) + 1 : Math.round(b.y + (b.h || 1));
        return `${dx},${dy},down`;
      }
    }

    return fallbacks[buildingId] || '48,28,down';
  }
}

export const townConfig = new TownConfigManager();


