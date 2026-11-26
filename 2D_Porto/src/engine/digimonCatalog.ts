import { BELPHEMON_X_PORTFOLIO_ENTRY } from '../characters/belphemon_x/adapters/portfolioDigimon';
import { FIVEDRAMON_PORTFOLIO_ENTRY } from '../characters/fivedramon/adapters/portfolioDigimon';
import { GAMMAMON_PORTFOLIO_ENTRY } from '../characters/gammamon/adapters/portfolioDigimon';
import { GASPIRITAMON_PORTFOLIO_ENTRY } from '../characters/gaspiritamon/adapters/portfolioDigimon';
import { HOLLOKNIGHTMON_PORTFOLIO_ENTRY } from '../characters/holloknightmon/adapters/portfolioDigimon';
import { JESMON_X_PORTFOLIO_ENTRY } from '../characters/jesmon_x/adapters/portfolioDigimon';
import { KARATIAMON_PORTFOLIO_ENTRY } from '../characters/karatiamon/adapters/portfolioDigimon';
import { MALGADRAMON_PORTFOLIO_ENTRY } from '../characters/malgadramon/adapters/portfolioDigimon';
import { MASTENAMON_PORTFOLIO_ENTRY } from '../characters/mastenamon/adapters/portfolioDigimon';
import { MAZAGAMON_PORTFOLIO_ENTRY } from '../characters/mazagamon/adapters/portfolioDigimon';
import { MEGIDRAMON_X_PORTFOLIO_ENTRY } from '../characters/megidramon_x/adapters/portfolioDigimon';
import { PLUSIAMON_PORTFOLIO_ENTRY } from '../characters/plusiamon/adapters/portfolioDigimon';
import { RAGNALOARDMON_PORTFOLIO_ENTRY } from '../characters/ragnaloardmon/adapters/portfolioDigimon';
import { SAKUYAMON_X_PORTFOLIO_ENTRY } from '../characters/sakuyamon_x/adapters/portfolioDigimon';
import { SHOGUN_ALPHAMON_PORTFOLIO_ENTRY } from '../characters/shogun_alphamon/adapters/portfolioDigimon';
import { VAMDRAMON_PORTFOLIO_ENTRY } from '../characters/vamdramon/adapters/portfolioDigimon';
import { VEXATIAMON_BERSERKER_PORTFOLIO_ENTRY } from '../characters/vexatiamon_berserker/adapters/portfolioDigimon';
import { VICTORYGROWLMON_PORTFOLIO_ENTRY } from '../characters/victorygrowlmon/adapters/portfolioDigimon';

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
  /** Optional explicit East-facing frame indices (used by 8-dir sheets to avoid asymmetric flips) */
  east?: number[];
  /** Optional explicit West-facing frame indices (used by 8-dir sheets) */
  west?: number[];
  /** Overworld action/attack frame indices */
  action?: number[];
  /** Optional dedicated standing frames when `!isWalking` (falls back to `back`/`front`/`side`) */
  idle?: {
    back?: number[];
    front?: number[];
    east?: number[];
    west?: number[];
  };
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
  /** Layout parser preset ('ds' default classic DS spritesheets, 'hd_8dir' 8-directional sheets) */
  sheetFormat?: 'ds' | 'hd_8dir';
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

// Superseded at module init (lines 1446-1451) by pre-baked `/assets/Digimon_HD/<id>.png` sheets
const digiSheet2 = (_fileNameWithExt: string) => '';

const digiSheet21 = (_fileNameWithExt: string) => '';

const digiSheetHdClean = (id: string) => `/assets/Digimon_HD/${encodeURIComponent(id)}.png`;

const HD_CLEAN_SPRITE_BOXES = {
  iconBox: { x: 4, y: 4, w: 48, h: 48 },
  largeIdleBoxes: [{ x: 4, y: 60, w: 220, h: 220 }],
  largeAttackBoxes: [
    { x: 228, y: 60, w: 220, h: 220 },
    { x: 4, y: 60, w: 220, h: 220 },
  ],
  overworldBoxes: Array.from({ length: 8 }, (_, i) => ({
    x: 4 + i * 92,
    y: 288,
    w: 88,
    h: 88,
  })),
};

const HD_8DIR_POSE_MAP: OverworldPoseMap = {
  back: [0],
  front: [4],
  side: [6],
  west: [6],
  east: [2],
  action: [3, 2],
  nativeFacing: 'left',
};

export const DIGIMON_CATALOG: DigimonCatalogEntry[] = [
  // ═══════════════════════════════════════════════════════════════
  // TIER 1 — 5 ICONIC STARTERS
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'wargreymon',
    name: 'WarGreymon',
    title: 'WarGreymon, Flame Dragon Warrior',
    tier: 1,
    iconEmoji: '🔥',
    stage: 'Mega',
    attribute: 'Vaccine',
    elementZone: 'flame',
    signatureMove: 'Terra Force & Great Tornado',
    lore:
      'A Dragon Warrior clad in Chrome Digizoid armor wielding Dramon Killer gauntlets on both arms. Concentrates solar thermal energy into a devastating Terra Force sphere.',
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
    title: 'Omnimon (Omegamon), Fusion Royal Knight',
    tier: 1,
    iconEmoji: '⚔️',
    stage: 'Mega',
    attribute: 'Vaccine',
    elementZone: 'plaza',
    signatureMove: 'Transcendent Sword & Garuru Cannon',
    lore:
      'A legendary Royal Knight born from the Jogress of WarGreymon and MetalGarurumon. Wields the Grey Sword on its left arm and fires freezing blasts from the Garuru Cannon on its right.',
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
    title: 'Gallantmon (Dukemon), Crimson Holy Lance',
    tier: 1,
    iconEmoji: '🛡️',
    stage: 'Mega',
    attribute: 'Virus',
    elementZone: 'holy',
    signatureMove: 'Lightning Joust & Shield of the Just',
    lore:
      'A Royal Knight clad in pure Chrome Digizoid armor bearing the holy lance Gram and shield Aegis, balancing Virus power with a chivalrous heart.',
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
      'The humanoid dragon knight form that unleashes Imperialdramon’s latent combat might, armed with a Positron Laser cannon on its right arm.',
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
    title: 'Beelzemon (Beelzebumon), Demon Lord',
    tier: 1,
    iconEmoji: '🔫',
    stage: 'Mega',
    attribute: 'Virus',
    elementZone: 'flame',
    signatureMove: 'Double Impact & Darkness Claw',
    lore:
      'A member of the Seven Great Demon Lords who rides the Behemoth motorcycle wielding twin Berenjena SDX shotguns—fierce and untamed, yet fiercely loyal to allies.',
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
    title: 'BlackWarGreymon, Onyx Dragon Warrior',
    tier: 2,
    iconEmoji: '🖤',
    stage: 'Mega',
    attribute: 'Virus',
    elementZone: 'flame',
    signatureMove: 'Terra Destroyer & Black Tornado',
    lore:
      'A dark counterpart of WarGreymon born from 100 Control Spires, pondering the meaning of its existence while wielding the destructive Terra Destroyer.',
    credit: 'Digimon World DS Spritesheet Rip',
    spriteSheetUrl: digiSheet('BlackWarGreymon'),
    overworldTargetHeight: 33,
  },
  {
    id: 'seraphimon',
    name: 'Seraphimon',
    title: 'Seraphimon, Seraph of Light',
    tier: 2,
    iconEmoji: '😇',
    stage: 'Mega',
    attribute: 'Vaccine',
    elementZone: 'holy',
    signatureMove: 'Strike of the Seven Stars & Testament',
    lore:
      'One of the Three Great Angels clad in silver-blue armor with ten golden wings, calling down seven radiant stars to judge all evil.',
    credit: 'Digimon World DS Spritesheet Rip',
    spriteSheetUrl: digiSheet('Seraphimon'),
    overworldTargetHeight: 35,
  },
  {
    id: 'sakuyamon',
    name: 'Sakuyamon',
    title: 'Sakuyamon, Golden Kitsune Shrine Maiden',
    tier: 2,
    iconEmoji: '🦊',
    stage: 'Mega',
    attribute: 'Data',
    elementZone: 'holy',
    signatureMove: 'Spirit Strike & Amethyst Mandala',
    lore:
      'The Biomerge evolution of Renamon and Rika, wearing golden shrine armor and wielding a Shakujo staff accompanied by four Kuda-Gitsune fox spirits.',
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
      'The pinnacle form of Gallantmon bearing radiant crimson-winged angel armor, summoning the energy lance Gungnir and energy blade Blutgang.',
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
      'Master of the Dark Masters and ruler of the Machine City, assembled from Cyborg Digimon parts into a steel fortress armed with twin Infinity Cannons.',
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
    title: 'MetalSeadramon, Iron Ocean Sovereign',
    tier: 3,
    iconEmoji: '🐍',
    stage: 'Mega',
    attribute: 'Data',
    elementZone: 'aqua',
    signatureMove: 'River of Power (Ultimate Stream)',
    lore:
      'Dark Master ruling the Digital World’s oceans with a body fully plated in Chrome Digizoid and a high-powered energy cannon mounted in its snout.',
    credit: 'Digimon World DS Spritesheet Rip',
    spriteSheetUrl: digiSheet('MetalSeadramon'),
    overworldTargetHeight: 34,
  },
  {
    id: 'phoenixmon',
    name: 'Phoenixmon',
    title: 'Phoenixmon (Hououmon), Sacred Bird',
    tier: 3,
    iconEmoji: '🪶',
    stage: 'Mega',
    attribute: 'Vaccine',
    elementZone: 'holy',
    signatureMove: 'Starlight Explosion & Crimson Flare',
    lore:
      'Ruler of all Bird Digimon bearing four golden wings and a sacred Holy Ring, scattering showers of healing stardust.',
    credit: 'Digimon World DS Spritesheet Rip',
    spriteSheetUrl: digiSheet('Phoenixmon'),
    overworldTargetHeight: 34,
  },
  {
    id: 'vikemon',
    name: 'Vikemon',
    title: 'Vikemon, Frozen Sea Commander',
    tier: 3,
    iconEmoji: '🔨',
    stage: 'Mega',
    attribute: 'Vaccine',
    elementZone: 'aqua',
    signatureMove: 'Arctic Blizzard & Mjolnir Thunder',
    lore:
      'Chieftain of the Ikkakumon and Zudomon tribes in the frozen northern seas, swinging twin Chrome Digizoid spiked maces (Mjolnir) that shatter icebergs.',
    credit: 'Digimon World DS Spritesheet Rip',
    spriteSheetUrl: digiSheet('Vikemon'),
    overworldTargetHeight: 34,
  },
  {
    id: 'herculeskabuterimon',
    name: 'HerculesKabuterimon',
    title: 'HerculesKabuterimon, Thunder Titan',
    tier: 3,
    iconEmoji: '🪲',
    stage: 'Mega',
    attribute: 'Vaccine',
    elementZone: 'holy',
    signatureMove: 'Giga Blaster & Horn Buster',
    lore:
      'A Mega evolution of the golden horned beetle possessing unmatched power, combining Kuwagamon’s electric might with Kabuterimon’s armor.',
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
      'A colossal mecha born from the Biomerge of Terriermon and Henry, heavily armed with ballistic missiles, shoulder lasers, and twin cannons.',
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
      'The ultimate demonic form of Myotismon concealing twin shoulder energy cannons Sodom & Gomorrah and engulfing foes in dark flames.',
    credit: 'Digimon World DS Spritesheet Rip',
    spriteSheetUrl: digiSheet('MaloMyotismon'),
    overworldTargetHeight: 34,
  },
  {
    id: 'venommyotismon',
    name: 'VenomMyotismon',
    title: 'VenomMyotismon, Crimson Star Beast',
    tier: 3,
    iconEmoji: '🧛',
    stage: 'Mega',
    attribute: 'Virus',
    elementZone: 'flame',
    signatureMove: 'Venom Infusion & Chaos Flame',
    lore:
      'A vampire king that awakens primal beast instincts with crimson wings and fires destructive beams from the core in its chest.',
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
    title: 'Azulongmon, Sovereign of the East',
    tier: 4,
    iconEmoji: '🐉',
    stage: 'Mega',
    attribute: 'Data',
    elementZone: 'cyber',
    signatureMove: 'Aurora Force & Lightning Whip',
    lore:
      'One of the Four Holy Beasts guarding the eastern Digital World, a thunder dragon shrouded in storm clouds with four piercing blue eyes.',
    credit: 'Ripped by Radspyro (Digimon World DS)',
    spriteSheetUrl: digiSheet('Azulongmon'),
    overworldTargetHeight: 36,
  },
  {
    id: 'baihumon',
    name: 'Baihumon',
    title: 'Baihumon, White Tiger Sovereign',
    tier: 4,
    iconEmoji: '🐯',
    stage: 'Mega',
    attribute: 'Data',
    elementZone: 'cyber',
    signatureMove: 'Kongou & Iron Claw',
    lore:
      'Holy Beast guarding the western quadrant, wearing a spiked steel helm and projecting an iron aura capable of petrifying adversaries.',
    credit: 'Digimon World DS Spritesheet Rip',
    spriteSheetUrl: digiSheet('Baihumon'),
    overworldTargetHeight: 35,
  },
  {
    id: 'zhuqiaomon',
    name: 'Zhuqiaomon',
    title: 'Zhuqiaomon, Southern Phoenix Sovereign',
    tier: 4,
    iconEmoji: '🦅',
    stage: 'Mega',
    attribute: 'Virus',
    elementZone: 'flame',
    signatureMove: 'Blazing Helix & Sonic Phoenix',
    lore:
      'Holy Beast guarding the southern skies, eternally reborn from the sacred flames of its four blazing phoenix wings.',
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
      'A colossal winged ancient dragon of immense combat power capable of firing dark-matter blasts of Mega Death from its jaws.',
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
      'Legendary founder of the Royal Knights order, forged upon receiving the sacred Omni Blade from Omnimon at the brink of destruction.',
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
      'A dark Virus variant of Imperialdramon encased in pitch-black obsidian armor, commanding devastating dark-dimension energy.',
    credit: 'Digimon World DS Spritesheet Rip',
    spriteSheetUrl: digiSheet('BlackImperialdramon'),
    overworldTargetHeight: 35,
  },
  {
    id: 'barbamon',
    name: 'Barbamon',
    title: 'Barbamon, Demon Lord of Greed',
    tier: 4,
    iconEmoji: '🪄',
    stage: 'Mega',
    attribute: 'Virus',
    elementZone: 'flame',
    signatureMove: 'Pandemonium Lost & Death Lure',
    lore:
      'A long-robed Demon Lord manipulating the Dark Network to hoard every treasure in the Digital World with its skull staff Death Lure.',
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
      'The Demon Lord of Sloth, awakening in a furious rampage once every thousand years wrapped in black chains and blazing claws.',
    credit: 'Digimon World DS Spritesheet Rip',
    spriteSheetUrl: digiSheet('Belphemon'),
    overworldTargetHeight: 35,
  },
  {
    id: 'kentaurosmon',
    name: 'Kentaurosmon',
    title: 'Kentaurosmon (Sleipmon), Northern Knight',
    tier: 4,
    iconEmoji: '🏹',
    stage: 'Mega',
    attribute: 'Vaccine',
    elementZone: 'holy',
    signatureMove: 'Bifröst & Odin’s Breath',
    lore:
      'A six-legged centaur Royal Knight clad in Red Digizoid armor, guarding ancient frozen seals beneath the northern pole of the Digital World.',
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
      'A combat angel whose entire body is forged from razor-sharp white steel blades, cleaving through evil at blinding speed.',
    credit: 'Ripped by Dazz, arranged by Mighty Jetters (Digimon World DS)',
    spriteSheetUrl: digiSheet('GuardiAngemon'),
    overworldTargetHeight: 34,
  },
  {
    id: 'valkyrimon',
    name: 'Valkyrimon',
    title: 'Valkyrimon, Golden Wind Knight',
    tier: 4,
    iconEmoji: '🕊️',
    stage: 'Mega',
    attribute: 'Free',
    elementZone: 'holy',
    signatureMove: 'Feral Sword (Fenrir Sword) & Aurvandil',
    lore:
      'A winged warrior Digimon accompanied by the golden bird Freyja, freezing foes solid with absolute slashes of the Fenrir Sword.',
    credit: 'Digimon World DS Spritesheet Rip',
    spriteSheetUrl: digiSheet('Valkyrimon'),
    overworldTargetHeight: 34,
  },
  {
    id: 'varodurumon',
    name: 'Varodurumon',
    title: 'Varodurumon, Ancient Light Bird',
    tier: 4,
    iconEmoji: '🌟',
    stage: 'Mega',
    attribute: 'Vaccine',
    elementZone: 'holy',
    signatureMove: 'Aurora Undulation & Purge Shine',
    lore:
      'A giant mystical bird ruling the highest stratosphere of the Digital World with protective Aurora plumage that purifies darkness.',
    credit: 'Ripped by redblueyellow (Digimon World DS)',
    spriteSheetUrl: digiSheet('Varodurumon'),
    overworldTargetHeight: 35,
  },
  {
    id: 'crossmon',
    name: 'Crossmon',
    title: 'Crossmon (Eaglemon), Golden Emperor',
    tier: 4,
    iconEmoji: '🔱',
    stage: 'Mega',
    attribute: 'Vaccine',
    elementZone: 'holy',
    signatureMove: 'Kaiser Phoenix & Mystic Break',
    lore:
      'Ruler of the skies clad in pure Gold Digizoid armor, illuminating the battlefield with radiant sacred metal wings.',
    credit: 'Ripped by Dazz, arranged by Mighty Jetters (Digimon World DS)',
    spriteSheetUrl: digiSheet('Crossmon'),
    overworldTargetHeight: 35,
  },
  {
    id: 'chaosgallantmon',
    name: 'ChaosGallantmon',
    title: 'ChaosGallantmon, Knight of Chaos',
    tier: 4,
    iconEmoji: '🟣',
    stage: 'Mega',
    attribute: 'Virus',
    elementZone: 'flame',
    signatureMove: 'Demonic Disaster & Judecca Prison',
    lore:
      'The dark reflection of Gallantmon clad in deep violet armor, wielding the demonic lance Balmung infused with pure chaotic energy.',
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
      'The legendary time-keeper of Digimon World DS, awakening in Destroy Mode whenever the data balance of the world falls into ruin.',
    credit: 'Ripped by Dazz, arranged by Mighty Jetters (Digimon World DS)',
    spriteSheetUrl: digiSheet('Chronomon DM'),
    overworldTargetHeight: 36,
  },
  {
    id: 'darkdramon',
    name: 'Darkdramon',
    title: 'Darkdramon, Black Steel Brigade',
    tier: 4,
    iconEmoji: '💥',
    stage: 'Mega',
    attribute: 'Virus',
    elementZone: 'cyber',
    signatureMove: 'Dark Roar & Gigastick Lance',
    lore:
      'A secret D-Brigade Cyborg Digimon forged from Tankdramon data and awakened through extreme high-voltage Dark Matter.',
    credit: 'Ripped by Dazz, arranged by Mighty Jetters (Digimon World DS)',
    spriteSheetUrl: digiSheet('Darkdramon'),
    overworldTargetHeight: 35,
  },
  {
    id: 'dorugoramon',
    name: 'Dorugoramon',
    title: 'Dorugoramon, Dragon of Final Imagination',
    tier: 4,
    iconEmoji: '🐲',
    stage: 'Mega',
    attribute: 'Data',
    elementZone: 'flame',
    signatureMove: 'Brave Metal & Doru Din',
    lore:
      'An X-Antibody dragon form crystallizing the ancient primal combat instincts of a Digital Core into gleaming white armor.',
    credit: 'Digimon World DS Spritesheet Rip',
    spriteSheetUrl: digiSheet('Dorugoramon'),
    overworldTargetHeight: 35,
  },
  {
    id: 'cannondramon',
    name: 'Cannondramon',
    title: 'Cannondramon, Cannon Fortress',
    tier: 4,
    iconEmoji: '💣',
    stage: 'Mega',
    attribute: 'Data',
    elementZone: 'cyber',
    signatureMove: 'Dynamo Cannon & Granite Burst',
    lore:
      'A heavy Cyborg Dinosaur armed with twin super-caliber dorsal cannons defending the frontlines of the Steel Dome.',
    credit: 'Digimon World DS Spritesheet Rip',
    spriteSheetUrl: digiSheet('Cannondramon'),
    overworldTargetHeight: 34,
  },
  {
    id: 'granlocomon',
    name: 'Granlocomon',
    title: 'Granlocomon, Giant Steel Locomotive',
    tier: 4,
    iconEmoji: '🚂',
    stage: 'Mega',
    attribute: 'Data',
    elementZone: 'cyber',
    signatureMove: 'Destroy Rush & Wheel Grinder',
    lore:
      'A supersonic giant train Digimon tearing down data network rails, unstoppable by any physical barrier.',
    credit: 'Digimon World DS Spritesheet Rip',
    spriteSheetUrl: digiSheet('Granlocomon'),
    overworldTargetHeight: 34,
  },
  {
    id: 'blackmegagargomon',
    name: 'BlackMegaGargomon',
    title: 'BlackMegaGargomon, Stealth Unit',
    tier: 4,
    iconEmoji: '🛸',
    stage: 'Mega',
    attribute: 'Virus',
    elementZone: 'cyber',
    signatureMove: 'Black Bazooka & Stealth Burst',
    lore:
      'A dark variant of MegaGargomon outfitted for night-ops combat with heat-seeking stealth missiles.',
    credit: 'Digimon World DS Spritesheet Rip',
    spriteSheetUrl: digiSheet('BlackMegaGargomon'),
    overworldTargetHeight: 35,
  },
  {
    id: 'neptunemon',
    name: 'Neptunemon',
    title: 'Neptunemon, Olympos XII of the Seas',
    tier: 4,
    iconEmoji: '🔱',
    stage: 'Mega',
    attribute: 'Vaccine',
    elementZone: 'aqua',
    signatureMove: 'Vortex Penetrate & Wave of Depth',
    lore:
      'Sea deity of the Olympos XII clad in feather-light Blue Digizoid scales, wielding the living trident King’s Bite.',
    credit: 'Digimon World DS Spritesheet Rip',
    spriteSheetUrl: digiSheet('Neptunemon'),
    overworldTargetHeight: 35,
  },
  {
    id: 'plesiomon',
    name: 'Plesiomon',
    title: 'Plesiomon, Mystical Deep-Sea Voice',
    tier: 4,
    iconEmoji: '🐋',
    stage: 'Mega',
    attribute: 'Data',
    elementZone: 'aqua',
    signatureMove: 'Sorrow Blue & Shaking Pulse',
    lore:
      'A rare ancient sea Digimon shimmering in silver-white, cloaking itself in thick mist while subduing foes with a haunting song.',
    credit: 'Digimon World DS Spritesheet Rip',
    spriteSheetUrl: digiSheet('Plesiomon'),
    overworldTargetHeight: 33,
  },
  {
    id: 'rizegreymon',
    name: 'RizeGreymon',
    title: 'RizeGreymon, Metal-Winged Cyborg',
    tier: 4,
    iconEmoji: '🔥',
    stage: 'Ultimate',
    attribute: 'Vaccine',
    elementZone: 'flame',
    signatureMove: 'Trident Revolver & Solid Strike',
    lore:
      'The sole Ultimate Digimon in the roster, half-mechanized and wielding the Chrome Digizoid Trident Revolver cannon.',
    credit: 'Digimon World DS Spritesheet Rip',
    spriteSheetUrl: digiSheet('RizeGreymon', 'Ultimate'),
    overworldTargetHeight: 33,
  },

  // ═══════════════════════════════════════════════════════════════
  // DIGIMON 2 COLLECTION — 20 HD 8-DIRECTIONAL SOVEREIGNS & KNIGHTS
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'regulusmon',
    name: 'Regulusmon',
    title: 'Regulusmon, Dark Dragon Scourge',
    tier: 3,
    iconEmoji: '🦇',
    stage: 'Mega',
    attribute: 'Virus',
    elementZone: 'cyber',
    signatureMove: 'Caldead & Grantres',
    lore:
      'A ruthless dragon warrior cloaked in pitch-black wings and a spiked shield arm radiating corrupted magenta aura.',
    credit: 'Digimon 2 HD 8-Directional Sprite Collection',
    spriteSheetUrl: digiSheet2('Regulusmon.jpg'),
    sheetFormat: 'hd_8dir',
    overworldTargetHeight: 35,
    overworldPoseMap: HD_8DIR_POSE_MAP,
  },
  {
    id: 'omnimon_zwart_d',
    name: 'Omnimon Zwart D',
    title: 'Omnimon Zwart Defeat, Ruin Knight',
    tier: 2,
    iconEmoji: '🖤',
    stage: 'Ultra',
    attribute: 'Virus',
    elementZone: 'cyber',
    signatureMove: 'Supreme Cannon & Runic Greatsword',
    lore:
      'A shattered berserk form of Omnimon Zwart weeping dark crimson energy from cracked black Digizoid armor and tattered mantle.',
    credit: 'Digimon 2 HD 8-Directional Sprite Collection',
    spriteSheetUrl: digiSheet2('Omnimon Zwart Defeat.png'),
    sheetFormat: 'hd_8dir',
    overworldTargetHeight: 36,
    overworldPoseMap: HD_8DIR_POSE_MAP,
  },
  {
    id: 'omnimon_alter_b',
    name: 'Omnimon Alter-B',
    title: 'Omnimon Alter-B, Black Eclipse Knight',
    tier: 2,
    iconEmoji: '🌑',
    stage: 'Ultra',
    attribute: 'Virus',
    elementZone: 'cyber',
    signatureMove: 'Grey Cannon & Garuru Sword',
    lore:
      'A dark fusion of BlitzGreymon and CresGarurumon coated in obsidian alloy, reversing sword and cannon configurations.',
    credit: 'Digimon 2 HD 8-Directional Sprite Collection',
    spriteSheetUrl: digiSheet2('Omnimon Alter-B.png'),
    sheetFormat: 'hd_8dir',
    overworldTargetHeight: 36,
    overworldPoseMap: HD_8DIR_POSE_MAP,
  },
  {
    id: 'craniamon_x',
    name: 'Craniamon X',
    title: 'Craniamon (X-Antibody), Soul Guard',
    tier: 2,
    iconEmoji: '💀',
    stage: 'Mega',
    attribute: 'Vaccine',
    elementZone: 'cyber',
    signatureMove: 'End Waltz & Avalon Barrier',
    lore:
      'An X-Antibody Royal Knight clad in violet skeletal armor wielding the twin-headed spear Claíomh Solais.',
    credit: 'Digimon 2 HD 8-Directional Sprite Collection',
    spriteSheetUrl: digiSheet2('Craniamon X Antibody.png'),
    sheetFormat: 'hd_8dir',
    overworldTargetHeight: 35,
    overworldPoseMap: HD_8DIR_POSE_MAP,
  },
  {
    id: 'craniamon_enbarrmon',
    name: 'Craniamon Steed',
    title: 'Craniamon + Enbarrmon, Dullahan Cavalry',
    tier: 4,
    iconEmoji: '🐎',
    stage: 'Ultra',
    attribute: 'Vaccine',
    elementZone: 'cyber',
    signatureMove: 'Spectral Lance Charge',
    lore:
      'Craniamon mounted atop the ghostly armored steed Enbarrmon, charging through castle lists with an enormous tilting lance.',
    credit: 'Digimon 2 HD 8-Directional Sprite Collection',
    spriteSheetUrl: digiSheet2('Craniamon and Enbarrmon.png'),
    sheetFormat: 'hd_8dir',
    overworldTargetHeight: 36,
    overworldPoseMap: HD_8DIR_POSE_MAP,
  },
  {
    id: 'fenriloogamon_tm',
    name: 'Fenriloogamon T.',
    title: 'Fenriloogamon: Takemikazuchi',
    tier: 4,
    iconEmoji: '🐺',
    stage: 'Ultra',
    attribute: 'Virus',
    elementZone: 'aqua',
    signatureMove: 'Ragnarok & Lightning Blade Takemikazuchi',
    lore:
      'A mythical azure flame wolf-knight gripping the sacred thunder sword Takemikazuchi in its jaws.',
    credit: 'Digimon 2 HD 8-Directional Sprite Collection',
    spriteSheetUrl: digiSheet2('Fenriloogamon Takemikazuchi.jpg'),
    sheetFormat: 'hd_8dir',
    overworldTargetHeight: 35,
    overworldPoseMap: HD_8DIR_POSE_MAP,
  },
  {
    id: 'jupitermon_wm',
    name: 'Jupitermon WM',
    title: 'Jupitermon: Wrath Mode, Thunder King',
    tier: 4,
    iconEmoji: '⚡',
    stage: 'Ultra',
    attribute: 'Vaccine',
    elementZone: 'holy',
    signatureMove: 'Wide Plasment & Thunder Sword',
    lore:
      'Leader of the Olympos XII engulfed in golden lightning bolts, gripping a colossal thunder-forged greatsword.',
    credit: 'Digimon 2 HD 8-Directional Sprite Collection',
    spriteSheetUrl: digiSheet2('Jupitermon Wrath Mode.jpg'),
    sheetFormat: 'hd_8dir',
    overworldTargetHeight: 36,
    overworldPoseMap: HD_8DIR_POSE_MAP,
  },
  {
    id: 'bryweludramon',
    name: 'Bryweludramon',
    title: 'Bryweludramon, Scarlet Shield Dragon',
    tier: 2,
    iconEmoji: '🛡️',
    stage: 'Mega',
    attribute: 'Data',
    elementZone: 'flame',
    signatureMove: 'Red Flare & Blast Shield',
    lore:
      'An impenetrable red-armored fortress dragon bearing twin towering Chrome Digizoid shields and blue solar flames.',
    credit: 'Digimon 2 HD 8-Directional Sprite Collection',
    spriteSheetUrl: digiSheet2('Bryweludramon.png'),
    sheetFormat: 'hd_8dir',
    overworldTargetHeight: 35,
    overworldPoseMap: HD_8DIR_POSE_MAP,
  },
  {
    id: 'gracenovamon',
    name: 'GraceNovamon',
    title: 'GraceNovamon, Galactic Nova Colossus',
    tier: 4,
    iconEmoji: '🌌',
    stage: 'Ultra',
    attribute: 'Vaccine',
    elementZone: 'plaza',
    signatureMove: 'Caloris Tempest & Finger of Dawn',
    lore:
      'Jogress of Apollomon and Dianamon whose flowing cloak contains spinning nebulae and solar-lunar gauntlets.',
    credit: 'Digimon 2 HD 8-Directional Sprite Collection',
    spriteSheetUrl: digiSheet2('GraceNovamon.png'),
    sheetFormat: 'hd_8dir',
    overworldTargetHeight: 36,
    overworldPoseMap: HD_8DIR_POSE_MAP,
  },
  {
    id: 'gaiomon_itto',
    name: 'Gaiomon Itto',
    title: 'Gaiomon: Itto Mode, Crimson Ronin',
    tier: 3,
    iconEmoji: '⚔️',
    stage: 'Mega',
    attribute: 'Virus',
    elementZone: 'flame',
    signatureMove: 'Kikurin & Crimson Greatsword',
    lore:
      'A master draconic samurai clad in lacquered crimson armor wielding a colossal serrated war-blade.',
    credit: 'Digimon 2 HD 8-Directional Sprite Collection',
    spriteSheetUrl: digiSheet2('Gaiomon Itto Mode.png'),
    sheetFormat: 'hd_8dir',
    overworldTargetHeight: 36,
    overworldPoseMap: HD_8DIR_POSE_MAP,
  },
  {
    id: 'heavymetaldramon',
    name: 'HeavyMetaldramon',
    title: 'HeavyMetaldramon, Sonic Abyss Wyrm',
    tier: 3,
    iconEmoji: '🎸',
    stage: 'Mega',
    attribute: 'Virus',
    elementZone: 'cyber',
    signatureMove: 'Flying Destruction & Hellfire Chord',
    lore:
      'A serpentine cybernetic dragon sporting crystalline distortion wings and sub-zero bass-cannon shockwaves.',
    credit: 'Digimon 2 HD 8-Directional Sprite Collection',
    spriteSheetUrl: digiSheet2('HeavyMetaldramon.jpg'),
    sheetFormat: 'hd_8dir',
    overworldTargetHeight: 35,
    overworldPoseMap: HD_8DIR_POSE_MAP,
  },
  {
    id: 'kazuchimon',
    name: 'Kazuchimon',
    title: 'Kazuchimon, Emerald Lightning Shogun',
    tier: 3,
    iconEmoji: '⚡',
    stage: 'Mega',
    attribute: 'Vaccine',
    elementZone: 'plaza',
    signatureMove: 'Mighty Thunder Strike',
    lore:
      'A storm-forged warrior wrapped in sacred shimenawa ropes wielding twin emerald plasma katanas.',
    credit: 'Digimon 2 HD 8-Directional Sprite Collection',
    spriteSheetUrl: digiSheet2('Kazuchimon.jpg'),
    sheetFormat: 'hd_8dir',
    overworldTargetHeight: 35,
    overworldPoseMap: HD_8DIR_POSE_MAP,
  },
  {
    id: 'examon_x',
    name: 'Examon X',
    title: 'Examon (X-Antibody), Dragon Emperor',
    tier: 4,
    iconEmoji: '🐉',
    stage: 'Ultra',
    attribute: 'Data',
    elementZone: 'holy',
    signatureMove: 'Pendragon’s Glory & Ambrosius Blade',
    lore:
      'The supreme Dragon Emperor Royal Knight empowered by the X-Antibody, commanding radiant emerald energy lances.',
    credit: 'Digimon 2 HD 8-Directional Sprite Collection',
    spriteSheetUrl: digiSheet2('Examon X Antibody.png'),
    sheetFormat: 'hd_8dir',
    overworldTargetHeight: 37,
    overworldPoseMap: HD_8DIR_POSE_MAP,
  },
  {
    id: 'kentaurosmon_x',
    name: 'Kentaurosmon X',
    title: 'Kentaurosmon (X-Antibody), Radiant Bow',
    tier: 4,
    iconEmoji: '🏹',
    stage: 'Mega',
    attribute: 'Vaccine',
    elementZone: 'holy',
    signatureMove: 'Bifrost & Odin’s Breath',
    lore:
      'An evolved Sleipmon clad in scarlet draconic barding drawing an incandescent holy star-bow across the battlefield.',
    credit: 'Digimon 2 HD 8-Directional Sprite Collection',
    spriteSheetUrl: digiSheet2('Kentaurosmon X Antibody.png'),
    sheetFormat: 'hd_8dir',
    overworldTargetHeight: 36,
    overworldPoseMap: HD_8DIR_POSE_MAP,
  },
  {
    id: 'amaterasumon',
    name: 'Amaterasumon',
    title: 'Amaterasumon, Solar Radiance Sovereign',
    tier: 4,
    iconEmoji: '☀️',
    stage: 'Ultra',
    attribute: 'Vaccine',
    elementZone: 'holy',
    signatureMove: 'Heavenly Mirror of Dawn',
    lore:
      'A celestial sun goddess framed by twin golden wing-fans bearing sacred balance crests and radiant halos.',
    credit: 'Digimon 2 HD 8-Directional Sprite Collection',
    spriteSheetUrl: digiSheet2('Amaterasumon.png'),
    sheetFormat: 'hd_8dir',
    overworldTargetHeight: 36,
    overworldPoseMap: HD_8DIR_POSE_MAP,
  },
  {
    id: 'vortexdramon',
    name: 'Vortexdramon',
    title: 'Vortexdramon, Azure Tempest Wyrm',
    tier: 3,
    iconEmoji: '🌪️',
    stage: 'Mega',
    attribute: 'Data',
    elementZone: 'aqua',
    signatureMove: 'Cyclone Lance & Prism Gales',
    lore:
      'A sleek winged sea-sky dragon surfing high-altitude winds with iridescent crystal pinions and coiled storm tail.',
    credit: 'Digimon 2 HD 8-Directional Sprite Collection',
    spriteSheetUrl: digiSheet2('Vortexdramon.jpg'),
    sheetFormat: 'hd_8dir',
    overworldTargetHeight: 35,
    overworldPoseMap: HD_8DIR_POSE_MAP,
  },
  {
    id: 'fanglongmon_rm',
    name: 'Fanglongmon RM',
    title: 'Fanglongmon: Ruin Mode, Abyssal Wyrm',
    tier: 4,
    iconEmoji: '🐲',
    stage: 'Ultra',
    attribute: 'Virus',
    elementZone: 'cyber',
    signatureMove: 'Taiji Ruin & Blue Soul Orbs',
    lore:
      'The primordial Earth Sovereign Dragon tainted by dark ruin flames, crowned by four hovering azure spirit fires.',
    credit: 'Digimon 2 HD 8-Directional Sprite Collection',
    spriteSheetUrl: digiSheet2('Fanglongmon Ruin Mode.png'),
    sheetFormat: 'hd_8dir',
    overworldTargetHeight: 36,
    overworldPoseMap: HD_8DIR_POSE_MAP,
  },
  {
    id: 'titamon_skull',
    name: 'Titamon & SkullB.',
    title: 'Titamon + SkullBaluchimon, Bone Titan',
    tier: 4,
    iconEmoji: '🦴',
    stage: 'Ultra',
    attribute: 'Virus',
    elementZone: 'cyber',
    signatureMove: 'Soul Chopper & Abyssal Trample',
    lore:
      'The furious Titan commander riding the winged mechanical bone-steed SkullBaluchimon with the colossal Soul Chopper blade.',
    credit: 'Digimon 2 HD 8-Directional Sprite Collection',
    spriteSheetUrl: digiSheet2('Titamon and SkullBaluchimon.png'),
    sheetFormat: 'hd_8dir',
    overworldTargetHeight: 36,
    overworldPoseMap: HD_8DIR_POSE_MAP,
  },
  {
    id: 'shoutmon_ex6',
    name: 'Shoutmon EX6',
    title: 'Shoutmon EX6, Golden Winged Sovereign',
    tier: 4,
    iconEmoji: '🪽',
    stage: 'Ultra',
    attribute: 'Data',
    elementZone: 'holy',
    signatureMove: 'Meteor Buster & Six-Wing Judgement',
    lore:
      'A six-winged armored champion forged from united Digimon wills, gripping a radiant greatsword and plasma cannon.',
    credit: 'Digimon 2 HD 8-Directional Sprite Collection',
    spriteSheetUrl: digiSheet2('Shoutmon EX6.png'),
    sheetFormat: 'hd_8dir',
    overworldTargetHeight: 36,
    overworldPoseMap: HD_8DIR_POSE_MAP,
  },
  {
    id: 'fiery_biker_warrior',
    name: 'Nezhamon',
    title: 'Nezhamon, Multi-Armed Fiery Biker Warrior',
    tier: 3,
    iconEmoji: '🏍️',
    stage: 'Mega',
    attribute: 'Data',
    elementZone: 'flame',
    signatureMove: 'Lotus Turbo Wheel & Blazing Sabers',
    lore:
      'A six-armed warrior roaring across the road astride a flame-wheeled cyberbike, wielding twin fire blades, ice spear, and chain flail.',
    credit: 'Digimon 2 HD 8-Directional Sprite Collection',
    spriteSheetUrl: digiSheet2('Fiery Biker Warrior.png'),
    sheetFormat: 'hd_8dir',
    overworldTargetHeight: 34,
    overworldPoseMap: HD_8DIR_POSE_MAP,
  },
  {
    id: 'ignisdramon',
    name: 'Ignisdramon',
    title: 'Ignisdramon, Blazing Jet Dragon Sovereign',
    tier: 4,
    iconEmoji: '🔥',
    stage: 'Mega',
    attribute: 'Vaccine',
    elementZone: 'flame',
    signatureMove: 'Crimson Flare Scythe & Turbo Positron Lance',
    lore:
      'A cybernetic Dragon Warrior clad in black-and-white Chrome Digizoid armor with hot-rod flame decals. Soars with twin shoulder jet turbines and sweeps the field with a double-ended scythe-spear.',
    credit: 'Digimon 2 HD 8-Directional Sprite Collection',
    spriteSheetUrl: digiSheet2('Ignisdramon.png'),
    sheetFormat: 'hd_8dir',
    overworldTargetHeight: 36,
    overworldPoseMap: HD_8DIR_POSE_MAP,
  },
  // ── Digimoin 2.1 HD 8-Directional Collection (21 Digimon) ──────────────────
  JESMON_X_PORTFOLIO_ENTRY,
  FIVEDRAMON_PORTFOLIO_ENTRY,
  MAZAGAMON_PORTFOLIO_ENTRY,
  {
    id: 'hazardgrowlmon',
    name: 'HazardGrowlmon',
    title: 'HazardGrowlmon, Volatile Core Wyvern',
    tier: 2,
    iconEmoji: '☢️',
    stage: 'Ultimate',
    attribute: 'Virus',
    elementZone: 'flame',
    signatureMove: 'Digital Hazard Core',
    lore:
      'An unstable crimson cyborg wyvern venting hazard plasma from dorsal thrusters while sweeping targets with twin forearm blades.',
    credit: 'Digimon 2.1 HD 8-Directional Sprite Collection',
    spriteSheetUrl: digiSheet21('HazardGrowlmon.png'),
    sheetFormat: 'hd_8dir',
    overworldTargetHeight: 35,
    overworldPoseMap: HD_8DIR_POSE_MAP,
  },
  {
    id: 'titamon_berserker',
    name: 'Titamon: B',
    title: 'Titamon Berserker, Bone-Cleave Ogre',
    tier: 4,
    iconEmoji: '💀',
    stage: 'Mega',
    attribute: 'Virus',
    elementZone: 'flame',
    signatureMove: 'Phantom Pain Cleave',
    lore:
      'A rage-consumed warlord brandishing a jagged colossal bone cleaver while violet battle spirit erupts across its horned armor.',
    credit: 'Digimon 2.1 HD 8-Directional Sprite Collection',
    spriteSheetUrl: digiSheet21('Titamon Berserker.png'),
    sheetFormat: 'hd_8dir',
    overworldTargetHeight: 37,
    overworldPoseMap: HD_8DIR_POSE_MAP,
  },
  VAMDRAMON_PORTFOLIO_ENTRY,
  PLUSIAMON_PORTFOLIO_ENTRY,
  {
    id: 'neotitamon',
    name: 'NeoTitamon',
    title: 'NeoTitamon, Venomous War Titan',
    tier: 3,
    iconEmoji: '🪓',
    stage: 'Mega',
    attribute: 'Virus',
    elementZone: 'flame',
    signatureMove: 'Toxic Soul Shatter',
    lore:
      'An evolved warlord clad in spiked skull pauldrons, smashing through steel fortifications with a venomous battle axe.',
    credit: 'Digimon 2.1 HD 8-Directional Sprite Collection',
    spriteSheetUrl: digiSheet21('NeoTitamon.png'),
    sheetFormat: 'hd_8dir',
    overworldTargetHeight: 37,
    overworldPoseMap: HD_8DIR_POSE_MAP,
  },
  VICTORYGROWLMON_PORTFOLIO_ENTRY,
  BELPHEMON_X_PORTFOLIO_ENTRY,
  MEGIDRAMON_X_PORTFOLIO_ENTRY,
  GAMMAMON_PORTFOLIO_ENTRY,
  SAKUYAMON_X_PORTFOLIO_ENTRY,
  KARATIAMON_PORTFOLIO_ENTRY,
  VEXATIAMON_BERSERKER_PORTFOLIO_ENTRY,
  MALGADRAMON_PORTFOLIO_ENTRY,
  RAGNALOARDMON_PORTFOLIO_ENTRY,
  HOLLOKNIGHTMON_PORTFOLIO_ENTRY,
  SHOGUN_ALPHAMON_PORTFOLIO_ENTRY,
  MASTENAMON_PORTFOLIO_ENTRY,
  GASPIRITAMON_PORTFOLIO_ENTRY,
];

// Bind pre-baked transparent DS-style grid sheets for all 41 HD 8-dir Digimon (zero runtime slicing drift/text)
for (const entry of DIGIMON_CATALOG) {
  if (entry.sheetFormat === 'hd_8dir' && !entry.overworldBoxes?.length) {
    entry.spriteSheetUrl = digiSheetHdClean(entry.id);
    Object.assign(entry, HD_CLEAN_SPRITE_BOXES);
  }
}

const DIGIMON_MAP = new Map<string, DigimonCatalogEntry>(DIGIMON_CATALOG.map((d) => [d.id, d]));

export function getDigimonById(id: string): DigimonCatalogEntry | undefined {
  if (id === 'mastemon') return DIGIMON_MAP.get('mastenamon');
  if (id === 'plusnamon') return DIGIMON_MAP.get('plusiamon');
  return DIGIMON_MAP.get(id);
}
