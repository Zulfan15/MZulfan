export interface SpriteBox {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface OverworldPoseMap {
  /** Frame indices within overworldBoxes for facing North/Up (back view) */
  back: number[];
  /** Frame indices within overworldBoxes for facing South/Down (front/default idle-walk) */
  front: number[];
  /** Frame indices within overworldBoxes for facing West/East (side walk) */
  side: number[];
  /** Overworld action/attack frame indices */
  action?: number[];
  /** Which horizontal direction the raw side/front sprite faces natively */
  nativeFacing: 'left' | 'right';
}

export interface DigimonCatalogEntry {
  id: string;
  name: string;
  title: string;
  tier: 1 | 2 | 3 | 4;
  iconEmoji: string;
  stage: 'Ultimate' | 'Mega' | 'Ultra';
  attribute: 'Vaccine' | 'Data' | 'Virus' | 'Free';
  elementZone: 'flame' | 'cyber' | 'aqua' | 'holy' | 'plaza';
  signatureMove: string;
  lore: string;
  credit: string;
  spriteSheetUrl: string;
  /** Target overworld height in world pixels (~32-36px fits 2x2 footprint cleanly) */
  overworldTargetHeight?: number;
  iconBox?: SpriteBox;
  largeIdleBoxes?: SpriteBox[];
  largeAttackBoxes?: SpriteBox[];
  overworldBoxes?: SpriteBox[];
  overworldPoseMap?: OverworldPoseMap;
}

export const DIGIMON_ZONE_COLORS: Record<
  DigimonCatalogEntry['elementZone'],
  { inner: string; rim: string }
> = {
  flame: { inner: 'rgba(249, 115, 22, 0.24)', rim: 'rgba(251, 146, 60, 0.72)' },
  cyber: { inner: 'rgba(139, 92, 246, 0.24)', rim: 'rgba(167, 139, 250, 0.72)' },
  aqua: { inner: 'rgba(34, 211, 238, 0.24)', rim: 'rgba(103, 232, 249, 0.72)' },
  holy: { inner: 'rgba(250, 204, 21, 0.24)', rim: 'rgba(253, 224, 71, 0.72)' },
  plaza: { inner: 'rgba(0, 240, 255, 0.22)', rim: 'rgba(56, 189, 248, 0.68)' },
};

const digiSheet = (fileName: string, stageFolder: 'Mega' | 'Ultimate' = 'Mega') =>
  `/assets/Digimon/DS _ DSi - Digimon World DS - ${stageFolder} Digimon - ${fileName}.png`;

export const DIGIMON_CATALOG: DigimonCatalogEntry[] = [
  // ═══════════════════════════════════════════════════════════════
  // TIER 1 — 5 ICONIC STARTERS
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'wargreymon',
    name: 'WarGreymon',
    title: 'WarGreymon Sang Ksatria Naga Api',
    tier: 1,
    iconEmoji: '🔥',
    stage: 'Mega',
    attribute: 'Vaccine',
    elementZone: 'flame',
    signatureMove: 'Terra Force & Great Tornado',
    lore:
      'Ksatria Naga berzirah Chrome Digizoid dengan cakar Dramon Killer di kedua lengan. Memusatkan energi panas matahari menjadi bola penghancur Terra Force.',
    credit: 'Ripped by A.J. Nitro & Dazz (Digimon World DS)',
    spriteSheetUrl: digiSheet('WarGreymon'),
    overworldTargetHeight: 33,
    iconBox: { x: 4, y: 4, w: 28, h: 26 },
    largeIdleBoxes: [
      { x: 4, y: 38, w: 128, h: 192 },
      { x: 140, y: 38, w: 128, h: 192 },
      { x: 276, y: 38, w: 128, h: 192 },
    ],
    largeAttackBoxes: [
      { x: 4, y: 238, w: 128, h: 192 },
      { x: 140, y: 238, w: 128, h: 192 },
    ],
    overworldBoxes: [
      { x: 4, y: 435, w: 32, h: 64 },
      { x: 38, y: 435, w: 32, h: 64 },
      { x: 72, y: 435, w: 32, h: 64 },
      { x: 106, y: 435, w: 32, h: 64 },
      { x: 140, y: 435, w: 32, h: 64 },
      { x: 174, y: 435, w: 32, h: 64 },
      { x: 208, y: 435, w: 32, h: 64 },
      { x: 242, y: 435, w: 32, h: 64 },
      { x: 276, y: 435, w: 32, h: 64 },
    ],
    overworldPoseMap: {
      back: [0, 1, 2],
      front: [3, 6],
      side: [3, 4, 5],
      action: [7, 8],
      nativeFacing: 'left',
    },
  },
  {
    id: 'omnimon',
    name: 'Omnimon',
    title: 'Omnimon (Omegamon) Sang Royal Knight Fusion',
    tier: 1,
    iconEmoji: '⚔️',
    stage: 'Mega',
    attribute: 'Vaccine',
    elementZone: 'plaza',
    signatureMove: 'Transcendent Sword & Garuru Cannon',
    lore:
      'Royal Knight legendaris hasil Jogress WarGreymon dan MetalGarurumon. Lengan kiri menghunus Grey Sword sementara lengan kanan menembakkan meriam es Garuru Cannon.',
    credit: 'Ripped by Dazz, arranged by Mighty Jetters (Digimon World DS)',
    spriteSheetUrl: digiSheet('Omnimon'),
    overworldTargetHeight: 35,
    iconBox: { x: 627, y: 156, w: 28, h: 26 },
    largeIdleBoxes: [
      { x: 1, y: 27, w: 117, h: 155 },
      { x: 119, y: 27, w: 117, h: 155 },
      { x: 237, y: 27, w: 117, h: 155 },
    ],
    largeAttackBoxes: [
      { x: 355, y: 1, w: 135, h: 181 },
      { x: 491, y: 1, w: 135, h: 181 },
    ],
    overworldBoxes: [
      { x: 1, y: 183, w: 32, h: 49 },
      { x: 34, y: 183, w: 32, h: 49 },
      { x: 67, y: 183, w: 32, h: 49 },
      { x: 100, y: 183, w: 32, h: 49 },
      { x: 133, y: 183, w: 32, h: 49 },
      { x: 166, y: 183, w: 32, h: 49 },
      { x: 199, y: 183, w: 32, h: 49 },
      { x: 232, y: 183, w: 32, h: 49 },
      { x: 265, y: 183, w: 32, h: 49 },
    ],
    overworldPoseMap: {
      back: [0, 1, 2],
      front: [3, 6],
      side: [3, 4, 5],
      action: [7, 8],
      nativeFacing: 'left',
    },
  },
  {
    id: 'gallantmon',
    name: 'Gallantmon',
    title: 'Gallantmon (Dukemon) Sang Tombak Suci',
    tier: 1,
    iconEmoji: '🛡️',
    stage: 'Mega',
    attribute: 'Virus',
    elementZone: 'holy',
    signatureMove: 'Lightning Joust & Shield of the Just',
    lore:
      'Ksatria Royal Knights berzirah Chrome Digizoid murni yang membawa tombak suci Gram dan perisai Aegis. Menyeimbangkan kekuatan Virus dengan hati ksatria sejati.',
    credit: 'Ripped by Dazz, arranged by Mighty Jetters (Digimon World DS)',
    spriteSheetUrl: digiSheet('Gallantmon'),
    overworldTargetHeight: 34,
    iconBox: { x: 298, y: 123, w: 28, h: 28 },
    largeIdleBoxes: [
      { x: 1, y: 8, w: 141, h: 114 },
      { x: 143, y: 8, w: 141, h: 114 },
      { x: 285, y: 8, w: 141, h: 114 },
    ],
    largeAttackBoxes: [
      { x: 427, y: 1, w: 160, h: 121 },
      { x: 588, y: 1, w: 160, h: 121 },
    ],
    overworldBoxes: [
      { x: 1, y: 123, w: 32, h: 48 },
      { x: 34, y: 123, w: 32, h: 48 },
      { x: 67, y: 123, w: 32, h: 48 },
      { x: 100, y: 123, w: 32, h: 48 },
      { x: 133, y: 123, w: 32, h: 48 },
      { x: 166, y: 123, w: 32, h: 48 },
      { x: 199, y: 123, w: 32, h: 48 },
      { x: 232, y: 123, w: 32, h: 48 },
      { x: 265, y: 123, w: 32, h: 48 },
    ],
    overworldPoseMap: {
      back: [0, 1, 2],
      front: [3, 6],
      side: [3, 4, 5],
      action: [7, 8],
      nativeFacing: 'left',
    },
  },
  {
    id: 'imp_fighter',
    name: 'Imperialdramon FM',
    title: 'Imperialdramon Fighter Mode',
    tier: 1,
    iconEmoji: '⚡',
    stage: 'Mega',
    attribute: 'Free',
    elementZone: 'cyber',
    signatureMove: 'Positron Laser & Giga Crusher',
    lore:
      'Wujud humanoid ksatria naga purba yang membebaskan seluruh daya tempur terpendam Imperialdramon, dengan meriam Positron Laser di lengan kanan.',
    credit: 'Ripped by redblueyellow, compiled by Radspyro & Dazz (Digimon World DS)',
    spriteSheetUrl: digiSheet('Imperialdramon Fighter Mode'),
    overworldTargetHeight: 35,
    iconBox: { x: 531, y: 408, w: 28, h: 28 },
    largeIdleBoxes: [
      { x: 4, y: 3, w: 192, h: 192 },
      { x: 204, y: 3, w: 192, h: 192 },
      { x: 404, y: 3, w: 192, h: 192 },
    ],
    largeAttackBoxes: [
      { x: 204, y: 203, w: 192, h: 192 },
      { x: 404, y: 203, w: 192, h: 192 },
    ],
    overworldBoxes: [
      { x: 7, y: 403, w: 32, h: 64 },
      { x: 41, y: 403, w: 32, h: 64 },
      { x: 75, y: 403, w: 32, h: 64 },
      { x: 109, y: 403, w: 32, h: 64 },
      { x: 143, y: 403, w: 32, h: 64 },
      { x: 177, y: 403, w: 32, h: 64 },
      { x: 211, y: 403, w: 32, h: 64 },
      { x: 245, y: 403, w: 32, h: 64 },
      { x: 279, y: 403, w: 32, h: 64 },
    ],
    overworldPoseMap: {
      back: [0, 1, 2],
      front: [3, 6],
      side: [3, 4, 5],
      action: [7, 8],
      nativeFacing: 'left',
    },
  },
  {
    id: 'beelzemon',
    name: 'Beelzemon',
    title: 'Beelzemon (Beelzebumon) Demon Lord',
    tier: 1,
    iconEmoji: '🔫',
    stage: 'Mega',
    attribute: 'Virus',
    elementZone: 'flame',
    signatureMove: 'Double Impact & Darkness Claw',
    lore:
      'Anggota Seven Great Demon Lords yang mengendarai Behemoth dengan sepasang shotgun Berenjena SDX. Cepat, liar, namun berjiwa ksatria saat melindungi rekan.',
    credit: 'Ripped by redblueyellow (Digimon World DS)',
    spriteSheetUrl: digiSheet('Beelzemon'),
    overworldTargetHeight: 33,
    iconBox: { x: 2, y: 2, w: 25, h: 28 },
    largeIdleBoxes: [
      { x: 2, y: 34, w: 176, h: 176 },
      { x: 180, y: 34, w: 176, h: 176 },
      { x: 358, y: 34, w: 176, h: 176 },
    ],
    largeAttackBoxes: [
      { x: 2, y: 212, w: 176, h: 176 },
      { x: 180, y: 212, w: 176, h: 176 },
    ],
    overworldBoxes: [
      { x: 547, y: 2, w: 32, h: 64 },
      { x: 581, y: 2, w: 32, h: 64 },
      { x: 615, y: 2, w: 32, h: 64 },
      { x: 547, y: 68, w: 32, h: 64 },
      { x: 581, y: 68, w: 32, h: 64 },
      { x: 615, y: 68, w: 32, h: 64 },
      { x: 547, y: 134, w: 32, h: 64 },
      { x: 581, y: 134, w: 32, h: 64 },
      { x: 615, y: 134, w: 32, h: 64 },
      { x: 547, y: 200, w: 32, h: 64 },
      { x: 581, y: 200, w: 32, h: 64 },
      { x: 615, y: 200, w: 32, h: 64 },
      { x: 547, y: 268, w: 32, h: 64 },
      { x: 581, y: 268, w: 32, h: 64 },
      { x: 615, y: 268, w: 32, h: 64 },
    ],
    overworldPoseMap: {
      back: [6, 7, 8],
      front: [12, 0],
      side: [0, 1, 2],
      action: [13, 14],
      nativeFacing: 'left',
    },
  },

  // ═══════════════════════════════════════════════════════════════
  // TIER 2 — 5 ROYAL KNIGHTS & POPULAR LEGENDS
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'blackwargreymon',
    name: 'BlackWarGreymon',
    title: 'BlackWarGreymon Ksatria Hitam',
    tier: 2,
    iconEmoji: '🖤',
    stage: 'Mega',
    attribute: 'Virus',
    elementZone: 'flame',
    signatureMove: 'Terra Destroyer & Black Tornado',
    lore:
      'Versi gelap WarGreymon yang lahir dari 100 Control Spires. Merenungi makna keberadaan jiwanya dengan kekuatan kehancuran Terra Destroyer.',
    credit: 'Digimon World DS Spritesheet Rip',
    spriteSheetUrl: digiSheet('BlackWarGreymon'),
    overworldTargetHeight: 33,
  },
  {
    id: 'seraphimon',
    name: 'Seraphimon',
    title: 'Seraphimon Malaikat Tertinggi',
    tier: 2,
    iconEmoji: '😇',
    stage: 'Mega',
    attribute: 'Vaccine',
    elementZone: 'holy',
    signatureMove: 'Strike of the Seven Stars & Testament',
    lore:
      'Salah satu Three Great Angels berzirah perak-biru dengan sepuluh sayap emas, menurunkan hujan tujuh bintang penghukum kejahatan.',
    credit: 'Digimon World DS Spritesheet Rip',
    spriteSheetUrl: digiSheet('Seraphimon'),
    overworldTargetHeight: 35,
  },
  {
    id: 'sakuyamon',
    name: 'Sakuyamon',
    title: 'Sakuyamon Pendeta Kitsune Emas',
    tier: 2,
    iconEmoji: '🦊',
    stage: 'Mega',
    attribute: 'Data',
    elementZone: 'holy',
    signatureMove: 'Spirit Strike & Amethyst Mandala',
    lore:
      'Bentuk evolusi Biomerge Renamon dan Rika yang mengenakan zirah kuil emas serta tongkat Shakujo disertai empat roh rubah Kuda-Gitsune.',
    credit: 'Digimon World DS Spritesheet Rip',
    spriteSheetUrl: digiSheet('Sakuyamon'),
    overworldTargetHeight: 34,
  },
  {
    id: 'gallantmon_cm',
    name: 'Gallantmon CM',
    title: 'Gallantmon Crimson Mode',
    tier: 2,
    iconEmoji: '🪽',
    stage: 'Mega',
    attribute: 'Virus',
    elementZone: 'holy',
    signatureMove: 'Quo Vadis & Invincible Sword',
    lore:
      'Wujud puncak Gallantmon bersayap malaikat bercahaya merah delima, memanggil tombak Gungnir dan pedang energi Blutgang.',
    credit: 'Ripped by Dazz, arranged by Mighty Jetters (Digimon World DS)',
    spriteSheetUrl: digiSheet('Gallantmon Crimson Mode'),
    overworldTargetHeight: 36,
  },
  {
    id: 'machinedramon',
    name: 'Machinedramon',
    title: 'Machinedramon (Mugendramon)',
    tier: 2,
    iconEmoji: '🤖',
    stage: 'Mega',
    attribute: 'Virus',
    elementZone: 'cyber',
    signatureMove: 'Infinity Cannon (Giga Cannon)',
    lore:
      'Master Dark Masters penguasa kota mesin. Merakit bagian tubuh berbagai Digimon Cyborg menjadi benteng baja dengan meriam Infinity Cannon.',
    credit: 'Digimon World DS Spritesheet Rip',
    spriteSheetUrl: digiSheet('Machinedramon'),
    overworldTargetHeight: 35,
  },

  // ═══════════════════════════════════════════════════════════════
  // TIER 3 — 7 ADVENTURE PARTNERS & DARK MASTERS / BOSSES
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'metalseadramon',
    name: 'MetalSeadramon',
    title: 'MetalSeadramon Penguasa Samudra Besi',
    tier: 3,
    iconEmoji: '🐍',
    stage: 'Mega',
    attribute: 'Data',
    elementZone: 'aqua',
    signatureMove: 'River of Power (Ultimate Stream)',
    lore:
      'Dark Masters penguasa lautan Digital World dengan tubuh sepenuhnya terlapis Chrome Digizoid dan meriam sinar hidung berdaya hancur tinggi.',
    credit: 'Digimon World DS Spritesheet Rip',
    spriteSheetUrl: digiSheet('MetalSeadramon'),
    overworldTargetHeight: 34,
  },
  {
    id: 'phoenixmon',
    name: 'Phoenixmon',
    title: 'Phoenixmon (Hououmon) Burung Suci',
    tier: 3,
    iconEmoji: '🪶',
    stage: 'Mega',
    attribute: 'Vaccine',
    elementZone: 'holy',
    signatureMove: 'Starlight Explosion & Crimson Flare',
    lore:
      'Raja seluruh Digimon burung yang memiliki empat sayap keemasan serta Holy Ring suci di kakinya, menyebarkan hujan debu bintang penyembuh.',
    credit: 'Digimon World DS Spritesheet Rip',
    spriteSheetUrl: digiSheet('Phoenixmon'),
    overworldTargetHeight: 34,
  },
  {
    id: 'vikemon',
    name: 'Vikemon',
    title: 'Vikemon Panglima Lautan Es',
    tier: 3,
    iconEmoji: '🔨',
    stage: 'Mega',
    attribute: 'Vaccine',
    elementZone: 'aqua',
    signatureMove: 'Arctic Blizzard & Mjolnir Thunder',
    lore:
      'Pemimpin suku Ikkakumon dan Zudomon di perairan beku utara. Mengayunkan gada berduri ganda Mjolnir dari Chrome Digizoid yang mampu memecah gunung es.',
    credit: 'Digimon World DS Spritesheet Rip',
    spriteSheetUrl: digiSheet('Vikemon'),
    overworldTargetHeight: 34,
  },
  {
    id: 'herculeskabuterimon',
    name: 'HerculesKabuterimon',
    title: 'HerculesKabuterimon Raksasa Petir',
    tier: 3,
    iconEmoji: '🪲',
    stage: 'Mega',
    attribute: 'Vaccine',
    elementZone: 'holy',
    signatureMove: 'Giga Blaster & Horn Buster',
    lore:
      'Evolusi Mega kumbang tanduk emas berkekuatan tak tertandingi, memadukan kekuatan listrik Kuwagamon dan zirah Kabuterimon.',
    credit: 'Ripped by Dazz, arranged by Mighty Jetters (Digimon World DS)',
    spriteSheetUrl: digiSheet('HerculesKabuterimon'),
    overworldTargetHeight: 34,
  },
  {
    id: 'megagargomon',
    name: 'MegaGargomon',
    title: 'MegaGargomon (SaintGargomon)',
    tier: 3,
    iconEmoji: '🚀',
    stage: 'Mega',
    attribute: 'Vaccine',
    elementZone: 'cyber',
    signatureMove: 'Giant Missile & Burst Shot',
    lore:
      'Mecha raksasa hasil Biomerge Terriermon dan Henry yang dipersenjatai penuh rudal balistik, laser bahu, dan meriam kembar.',
    credit: 'Digimon World DS Spritesheet Rip',
    spriteSheetUrl: digiSheet('MegaGargomon'),
    overworldTargetHeight: 35,
  },
  {
    id: 'malomyotismon',
    name: 'MaloMyotismon',
    title: 'MaloMyotismon (BelialVamdemon)',
    tier: 3,
    iconEmoji: '🦇',
    stage: 'Mega',
    attribute: 'Virus',
    elementZone: 'flame',
    signatureMove: 'Pandemonium Flame & Mental Illusion',
    lore:
      'Bentuk iblis terkuat dari Myotismon yang menyembunyikan meriam energi bahu Sodom & Gomorrah serta membakar musuh dalam api kegelapan.',
    credit: 'Digimon World DS Spritesheet Rip',
    spriteSheetUrl: digiSheet('MaloMyotismon'),
    overworldTargetHeight: 34,
  },
  {
    id: 'venommyotismon',
    name: 'VenomMyotismon',
    title: 'VenomMyotismon Monster Bintang Merah',
    tier: 3,
    iconEmoji: '🧛',
    stage: 'Mega',
    attribute: 'Virus',
    elementZone: 'flame',
    signatureMove: 'Venom Infusion & Chaos Flame',
    lore:
      'Raja vampir yang membangkitkan insting buas raksasa bersayap merah dan menembakkan sinar perusak dari inti dadanya.',
    credit: 'Digimon World DS Spritesheet Rip',
    spriteSheetUrl: digiSheet('VenomMyotismon'),
    overworldTargetHeight: 35,
  },

  // ═══════════════════════════════════════════════════════════════
  // TIER 4 — 23 SOVEREIGNS, DEMON LORDS, KNIGHTS & SPECIALISTS
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'azulongmon',
    name: 'Azulongmon',
    title: 'Azulongmon Sovereign Penjaga Timur',
    tier: 4,
    iconEmoji: '🐉',
    stage: 'Mega',
    attribute: 'Data',
    elementZone: 'cyber',
    signatureMove: 'Aurora Force & Lightning Whip',
    lore:
      'Salah satu Four Holy Beasts penjaga wilayah timur Digital World dengan tubuh naga petir berselubung awan badai dan empat mata biru.',
    credit: 'Ripped by Radspyro (Digimon World DS)',
    spriteSheetUrl: digiSheet('Azulongmon'),
    overworldTargetHeight: 36,
  },
  {
    id: 'baihumon',
    name: 'Baihumon',
    title: 'Baihumon Sovereign Macan Putih Barat',
    tier: 4,
    iconEmoji: '🐯',
    stage: 'Mega',
    attribute: 'Data',
    elementZone: 'cyber',
    signatureMove: 'Kongou & Iron Claw',
    lore:
      'Four Holy Beasts penjaga sisi barat yang mengenakan helm baja berduri serta memiliki aura besi yang mampu membatukan musuh.',
    credit: 'Digimon World DS Spritesheet Rip',
    spriteSheetUrl: digiSheet('Baihumon'),
    overworldTargetHeight: 35,
  },
  {
    id: 'zhuqiaomon',
    name: 'Zhuqiaomon',
    title: 'Zhuqiaomon Sovereign Phoenix Selatan',
    tier: 4,
    iconEmoji: '🦅',
    stage: 'Mega',
    attribute: 'Virus',
    elementZone: 'flame',
    signatureMove: 'Blazing Helix & Sonic Phoenix',
    lore:
      'Four Holy Beasts penjaga wilayah selatan yang terlahir kembali terus-menerus dari kobaran api suci abadi empat sayap phoenix.',
    credit: 'Digimon World DS Spritesheet Rip',
    spriteSheetUrl: digiSheet('Zhuqiaomon'),
    overworldTargetHeight: 36,
  },
  {
    id: 'imp_dragon',
    name: 'Imperialdramon DM',
    title: 'Imperialdramon Dragon Mode',
    tier: 4,
    iconEmoji: '🐲',
    stage: 'Mega',
    attribute: 'Free',
    elementZone: 'flame',
    signatureMove: 'Mega Death & Positron Laser',
    lore:
      'Naga purba bersayap raksasa berdaya tempur dahsyat yang dapat menembakkan meriam materi gelap Mega Death dari mulutnya.',
    credit: 'Digimon World DS Spritesheet Rip',
    spriteSheetUrl: digiSheet('Imperialdramon Dragon Mode'),
    overworldTargetHeight: 35,
  },
  {
    id: 'imp_paladin',
    name: 'Imperialdramon PM',
    title: 'Imperialdramon Paladin Mode',
    tier: 4,
    iconEmoji: '🤍',
    stage: 'Mega',
    attribute: 'Vaccine',
    elementZone: 'holy',
    signatureMove: 'Omni Blade (Omega Blade)',
    lore:
      'Pendiri legendaris ordo Royal Knights setelah menerima kekuatan pedang suci Omni Blade dari Omnimon di puncak kehancuran.',
    credit: 'Digimon World DS Spritesheet Rip',
    spriteSheetUrl: digiSheet('Imperialdramon Paladin Mode'),
    overworldTargetHeight: 35,
  },
  {
    id: 'black_imp',
    name: 'BlackImperialdramon',
    title: 'BlackImperialdramon Dragon',
    tier: 4,
    iconEmoji: '🕶️',
    stage: 'Mega',
    attribute: 'Virus',
    elementZone: 'flame',
    signatureMove: 'Dark Positron Laser & Giga Death',
    lore:
      'Varian Virus gelap Imperialdramon dengan zirah obsidan hitam pekat yang menguasai jurus penghancur dimensi gelap.',
    credit: 'Digimon World DS Spritesheet Rip',
    spriteSheetUrl: digiSheet('BlackImperialdramon'),
    overworldTargetHeight: 35,
  },
  {
    id: 'barbamon',
    name: 'Barbamon',
    title: 'Barbamon Demon Lord Keserakahan',
    tier: 4,
    iconEmoji: '🪄',
    stage: 'Mega',
    attribute: 'Virus',
    elementZone: 'flame',
    signatureMove: 'Pandemonium Lost & Death Lure',
    lore:
      'Demon Lord berjubah panjang yang menguasai Network gelap demi menimbun seluruh harta Digital World dengan tongkat tengkorak Death Lure.',
    credit: 'Digimon World DS Spritesheet Rip',
    spriteSheetUrl: digiSheet('Barbamon'),
    overworldTargetHeight: 34,
  },
  {
    id: 'belphemon',
    name: 'Belphemon',
    title: 'Belphemon Rage Mode',
    tier: 4,
    iconEmoji: '😈',
    stage: 'Mega',
    attribute: 'Virus',
    elementZone: 'flame',
    signatureMove: 'Gift of Darkness & Lampranthus',
    lore:
      'Demon Lord kemalasan yang mengamuk sekali setiap seribu tahun dengan rantai hitam melilit tubuh dan cakar apinya.',
    credit: 'Digimon World DS Spritesheet Rip',
    spriteSheetUrl: digiSheet('Belphemon'),
    overworldTargetHeight: 35,
  },
  {
    id: 'kentaurosmon',
    name: 'Kentaurosmon',
    title: 'Kentaurosmon (Sleipmon) Ksatria Utara',
    tier: 4,
    iconEmoji: '🏹',
    stage: 'Mega',
    attribute: 'Vaccine',
    elementZone: 'holy',
    signatureMove: 'Bifröst & Odin’s Breath',
    lore:
      'Royal Knight berwujud kentaur berkaki enam berzirah Red Digizoid yang menjaga segel es abadi di kutub utara Digital World.',
    credit: 'Ripped by Dazz, arranged by Mighty Jetters (Digimon World DS)',
    spriteSheetUrl: digiSheet('Kentaurosmon'),
    overworldTargetHeight: 35,
  },
  {
    id: 'guardiangemon',
    name: 'GuardiAngemon',
    title: 'GuardiAngemon (SlashAngemon)',
    tier: 4,
    iconEmoji: '🗡️',
    stage: 'Mega',
    attribute: 'Vaccine',
    elementZone: 'holy',
    signatureMove: 'Heaven’s Ripper & Holy Espada',
    lore:
      'Malaikat tempur dengan tubuh seluruhnya tersusun dari bilah pedang baja putih tajam yang membelah kejahatan secepat kilat.',
    credit: 'Ripped by Dazz, arranged by Mighty Jetters (Digimon World DS)',
    spriteSheetUrl: digiSheet('GuardiAngemon'),
    overworldTargetHeight: 34,
  },
  {
    id: 'valkyrimon',
    name: 'Valkyrimon',
    title: 'Valkyrimon Ksatria Angin Emas',
    tier: 4,
    iconEmoji: '🕊️',
    stage: 'Mega',
    attribute: 'Free',
    elementZone: 'holy',
    signatureMove: 'Feral Sword (Fenrir Sword) & Aurvandil',
    lore:
      'Digimon prajurit bersayap ditemani burung emas Freyja yang membekukan lawan lewat tebasan mutlak pedang Fenrir.',
    credit: 'Digimon World DS Spritesheet Rip',
    spriteSheetUrl: digiSheet('Valkyrimon'),
    overworldTargetHeight: 34,
  },
  {
    id: 'varodurumon',
    name: 'Varodurumon',
    title: 'Varodurumon Burung Cahaya Purba',
    tier: 4,
    iconEmoji: '🌟',
    stage: 'Mega',
    attribute: 'Vaccine',
    elementZone: 'holy',
    signatureMove: 'Aurora Undulation & Purge Shine',
    lore:
      'Burung mistis raksasa penguasa stratosfer tertinggi Digital World dengan bulu pelindung Aurora yang memurnikan kegelapan.',
    credit: 'Ripped by redblueyellow (Digimon World DS)',
    spriteSheetUrl: digiSheet('Varodurumon'),
    overworldTargetHeight: 35,
  },
  {
    id: 'crossmon',
    name: 'Crossmon',
    title: 'Crossmon (Eaglemon) Kaisar Emas',
    tier: 4,
    iconEmoji: '🔱',
    stage: 'Mega',
    attribute: 'Vaccine',
    elementZone: 'holy',
    signatureMove: 'Kaiser Phoenix & Mystic Break',
    lore:
      'Garudamon berzirah Gold Digizoid murni penguasa langit, menyinari arena dengan sayap logam suci.',
    credit: 'Ripped by Dazz, arranged by Mighty Jetters (Digimon World DS)',
    spriteSheetUrl: digiSheet('Crossmon'),
    overworldTargetHeight: 35,
  },
  {
    id: 'chaosgallantmon',
    name: 'ChaosGallantmon',
    title: 'ChaosGallantmon Ksatria Kekacauan',
    tier: 4,
    iconEmoji: '🟣',
    stage: 'Mega',
    attribute: 'Virus',
    elementZone: 'flame',
    signatureMove: 'Demonic Disaster & Judecca Prison',
    lore:
      'Sisi kelam Gallantmon berzirah ungu gelap dengan tombak iblis Balmung yang membawa energi kekacauan murni.',
    credit: 'Ripped by Dazz, arranged by Mighty Jetters (Digimon World DS)',
    spriteSheetUrl: digiSheet('ChaosGallantmon'),
    overworldTargetHeight: 34,
  },
  {
    id: 'chronomon_dm',
    name: 'Chronomon DM',
    title: 'Chronomon Destroy Mode',
    tier: 4,
    iconEmoji: '🕰️',
    stage: 'Mega',
    attribute: 'Vaccine',
    elementZone: 'plaza',
    signatureMove: 'Chronos Flare & Flare Nova',
    lore:
      'Pengendali waktu legendaris Digimon World DS yang bangun dalam wujud Destroy Mode ketika keseimbangan data mengalami kerusakan.',
    credit: 'Ripped by Dazz, arranged by Mighty Jetters (Digimon World DS)',
    spriteSheetUrl: digiSheet('Chronomon DM'),
    overworldTargetHeight: 36,
  },
  {
    id: 'darkdramon',
    name: 'Darkdramon',
    title: 'Darkdramon Pasukan Baja Hitam',
    tier: 4,
    iconEmoji: '💥',
    stage: 'Mega',
    attribute: 'Virus',
    elementZone: 'cyber',
    signatureMove: 'Dark Roar & Gigastick Lance',
    lore:
      'Digimon Cyborg rahasia Brigade D yang diciptakan dari data Tankdramon yang bangkit lewat Dark Matter bertegangan ekstrem.',
    credit: 'Ripped by Dazz, arranged by Mighty Jetters (Digimon World DS)',
    spriteSheetUrl: digiSheet('Darkdramon'),
    overworldTargetHeight: 35,
  },
  {
    id: 'dorugoramon',
    name: 'Dorugoramon',
    title: 'Dorugoramon Naga Imajinasi Terakhir',
    tier: 4,
    iconEmoji: '🐲',
    stage: 'Mega',
    attribute: 'Data',
    elementZone: 'flame',
    signatureMove: 'Brave Metal & Doru Din',
    lore:
      'Bentuk wujud naga X-Antibody yang mengkristalkan seluruh naluri bertarung purba Digital Core menjadi zirah putih perkasa.',
    credit: 'Digimon World DS Spritesheet Rip',
    spriteSheetUrl: digiSheet('Dorugoramon'),
    overworldTargetHeight: 35,
  },
  {
    id: 'cannondramon',
    name: 'Cannondramon',
    title: 'Cannondramon Benteng Meriam',
    tier: 4,
    iconEmoji: '💣',
    stage: 'Mega',
    attribute: 'Data',
    elementZone: 'cyber',
    signatureMove: 'Dynamo Cannon & Granite Burst',
    lore:
      'Dinosaurus Cyborg berat dengan sepasang meriam punggung super-kaliber yang melindungi garis depan Steel Dome.',
    credit: 'Digimon World DS Spritesheet Rip',
    spriteSheetUrl: digiSheet('Cannondramon'),
    overworldTargetHeight: 34,
  },
  {
    id: 'granlocomon',
    name: 'Granlocomon',
    title: 'Granlocomon Lokomotif Baja Raksasa',
    tier: 4,
    iconEmoji: '🚂',
    stage: 'Mega',
    attribute: 'Data',
    elementZone: 'cyber',
    signatureMove: 'Destroy Rush & Wheel Grinder',
    lore:
      'Digimon kereta raksasa berkecepatan supersonik yang menembus jalur jaringan data tanpa bisa dihentikan rintangan mana pun.',
    credit: 'Digimon World DS Spritesheet Rip',
    spriteSheetUrl: digiSheet('Granlocomon'),
    overworldTargetHeight: 34,
  },
  {
    id: 'blackmegagargomon',
    name: 'BlackMegaGargomon',
    title: 'BlackMegaGargomon Unit Stealth',
    tier: 4,
    iconEmoji: '🛸',
    stage: 'Mega',
    attribute: 'Virus',
    elementZone: 'cyber',
    signatureMove: 'Black Bazooka & Stealth Burst',
    lore:
      'Varian gelap MegaGargomon bersenjata lengkap untuk operasi tempur malam dengan roket siluman berpemandu panas.',
    credit: 'Digimon World DS Spritesheet Rip',
    spriteSheetUrl: digiSheet('BlackMegaGargomon'),
    overworldTargetHeight: 35,
  },
  {
    id: 'neptunemon',
    name: 'Neptunemon',
    title: 'Neptunemon Olympos XII Lautan',
    tier: 4,
    iconEmoji: '🔱',
    stage: 'Mega',
    attribute: 'Vaccine',
    elementZone: 'aqua',
    signatureMove: 'Vortex Penetrate & Wave of Depth',
    lore:
      'Dewa laut anggota Olympos XII bersisik Blue Digizoid paling ringan yang memegang tombak hidup King’s Bite.',
    credit: 'Digimon World DS Spritesheet Rip',
    spriteSheetUrl: digiSheet('Neptunemon'),
    overworldTargetHeight: 35,
  },
  {
    id: 'plesiomon',
    name: 'Plesiomon',
    title: 'Plesiomon Suara Mistis Laut Dalam',
    tier: 4,
    iconEmoji: '🐋',
    stage: 'Mega',
    attribute: 'Data',
    elementZone: 'aqua',
    signatureMove: 'Sorrow Blue & Shaking Pulse',
    lore:
      'Digimon laut purba langka berkilau putih perak yang membungkus diri dalam kabut tebal serta melumpuhkan lawan dengan nyanyian sedih.',
    credit: 'Digimon World DS Spritesheet Rip',
    spriteSheetUrl: digiSheet('Plesiomon'),
    overworldTargetHeight: 33,
  },
  {
    id: 'rizegreymon',
    name: 'RizeGreymon',
    title: 'RizeGreymon Cyborg Sayap Logam',
    tier: 4,
    iconEmoji: '🔥',
    stage: 'Ultimate',
    attribute: 'Vaccine',
    elementZone: 'flame',
    signatureMove: 'Trident Revolver & Solid Strike',
    lore:
      'Satu-satunya Digimon Ultimate dalam koleksi dengan separuh tubuh termekanisasi dan meriam Trident Revolver Chrome Digizoid.',
    credit: 'Digimon World DS Spritesheet Rip',
    spriteSheetUrl: digiSheet('RizeGreymon', 'Ultimate'),
    overworldTargetHeight: 33,
  },
];

const DIGIMON_MAP = new Map<string, DigimonCatalogEntry>(DIGIMON_CATALOG.map((d) => [d.id, d]));

export function getDigimonById(id: string): DigimonCatalogEntry | undefined {
  return DIGIMON_MAP.get(id);
}
