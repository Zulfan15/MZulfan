import { Tile, type Dir, type Lamp, type Sign, type TownData, type TownMap } from './types';

export const KINGDOM_COLS = 45;
export const KINGDOM_ROWS = 60;

export const KINGDOM_IMAGE_SRC = '/assets/Royal%20Kingdom/Gemini_Generated_Image_v3217jv3217jv321.webp';

export const KINGDOM_SPAWN = {
  x: 22,
  y: 8,
  dir: 'down' as Dir,
};

export const KINGDOM_RETURN_GATE = {
  xMin: 21,
  xMax: 23,
  yMin: 4,
  yMax: 5,
  terraceXMin: 19,
  terraceXMax: 25,
  terraceYMin: 6,
  terraceYMax: 9,
} as const;

export const KINGDOM_HARBOUR_GATE = {
  xMin: 21,
  xMax: 23,
  yMin: 59,
  yMax: 59,
  centerX: 22,
  centerY: 59,
} as const;

export const KINGDOM_BUILDING_DOORS = {
  castle: { xs: [21, 22, 23], y: 19, route: '/kingdom/castle', spawn: { x: 22, y: 20, dir: 'down' as Dir } },
  blacksmith: { xs: [8, 9], y: 18, route: '/kingdom/blacksmith', spawn: { x: 8, y: 20, dir: 'down' as Dir } },
  tavern: { xs: [36, 37], y: 19, route: '/kingdom/tavern', spawn: { x: 36, y: 20, dir: 'down' as Dir } },
  'mage-tower': { xs: [7, 8], y: 35, route: '/kingdom/mage-tower', spawn: { x: 8, y: 36, dir: 'down' as Dir } },
  barracks: { xs: [36, 37], y: 30, route: '/kingdom/barracks', spawn: { x: 37, y: 31, dir: 'down' as Dir } },
  chapel: { xs: [33, 34], y: 49, route: '/kingdom/chapel', spawn: { x: 34, y: 50, dir: 'down' as Dir } },
  jousting: { xs: [11, 12], y: 43, route: '/kingdom/jousting', spawn: { x: 12, y: 45, dir: 'down' as Dir } },
} as const;

export const KINGDOM_ZONES = {
  northCourtyard: { xMin: 13, xMax: 31, yMin: 8, yMax: 9 },
  flankingWest: { xMin: 13, xMax: 15, yMin: 8, yMax: 20 },
  flankingEast: { xMin: 29, xMax: 31, yMin: 8, yMax: 20 },
  castlePromenade: { xMin: 3, xMax: 41, yMin: 20, yMax: 22 },
  excaliburPlaza: { xMin: 17, xMax: 27, yMin: 25, yMax: 34 },
  lowerCrossRoad: { xMin: 3, xMax: 41, yMin: 36, yMax: 38 },
  southCourtyardRoad: { xMin: 3, xMax: 41, yMin: 50, yMax: 52 },
} as const;

export interface KingdomLandmark {
  id: string;
  name: string;
  subType: string;
  x: number;
  y: number;
  w: number;
  h: number;
  interactX: number;
  interactY: number;
  dialogue: string;
}

export const KINGDOM_LANDMARKS: KingdomLandmark[] = [
  {
    id: 'royal_castle',
    name: 'Grand Royal Citadel',
    subType: 'royal_castle',
    x: 16,
    y: 10,
    w: 13,
    h: 10,
    interactX: 22,
    interactY: 20,
    dialogue:
      'GRAND ROYAL CITADEL OF AVALON: Twin-turret stone keep crowned with royal blue roofs and lion banners. Flanking courtyards connect North Drawbridge directly to the Promenade.',
  },
  {
    id: 'blacksmith_forge',
    name: 'Dragonflame Blacksmith',
    subType: 'blacksmith_forge',
    x: 5,
    y: 13,
    w: 8,
    h: 6,
    interactX: 8,
    interactY: 20,
    dialogue:
      'DRAGONFLAME BLACKSMITH & ARMORY: Sparks fly from the blazing stone furnace as Valyrian-grade blades and knightly shields are tempered on the anvil.',
  },
  {
    id: 'medieval_tavern',
    name: 'The Golden Griffin Inn',
    subType: 'medieval_tavern',
    x: 33,
    y: 13,
    w: 8,
    h: 7,
    interactX: 36,
    interactY: 20,
    dialogue:
      'THE GOLDEN GRIFFIN TAVERN & INN: Warm Tudor timber framing, glowing amber windows, hearty stew, and spiced oak-barrel cider for weary adventurers.',
  },
  {
    id: 'mage_tower',
    name: 'Astral Mage Sanctum',
    subType: 'mage_tower',
    x: 5,
    y: 24,
    w: 6,
    h: 12,
    interactX: 8,
    interactY: 36,
    dialogue:
      'ASTRAL MAGE SANCTUM & OBSERVATORY: Cylindrical tower crowned with glowing amethyst crystals harmonizing ley-lines between Kingdom and Digi-Sanctuary.',
  },
  {
    id: 'knights_barracks',
    name: "Knights' Order Barracks",
    subType: 'knights_barracks',
    x: 34,
    y: 26,
    w: 7,
    h: 5,
    interactX: 37,
    interactY: 31,
    dialogue:
      "ROYAL KNIGHTS' ORDER BARRACKS: Granite garrison hall and sand training yard complete with archery targets and halberd racks.",
  },
  {
    id: 'jousting_arena',
    name: 'Royal Jousting Arena',
    subType: 'jousting_arena',
    x: 5,
    y: 40,
    w: 13,
    h: 10,
    interactX: 12,
    interactY: 50,
    dialogue:
      'ROYAL JOUSTING ARENA & LISTS: Crimson-and-gold tournament pavilion overlooking the sand tilt yard where armored knights practice jousting.',
  },
  {
    id: 'royal_chapel',
    name: 'Stained-Glass Abbey',
    subType: 'royal_chapel',
    x: 29,
    y: 40,
    w: 9,
    h: 10,
    interactX: 34,
    interactY: 50,
    dialogue:
      'SAINT AVALON ABBEY: Gothic pointed stained-glass lancet arches, jewel Rose Window, and the bronze belfry tower of the Sacred East Ward.',
  },
  {
    id: 'excalibur_shrine',
    name: 'Excalibur Crystal Shrine',
    subType: 'excalibur_shrine',
    x: 20,
    y: 27,
    w: 5,
    h: 4,
    interactX: 22,
    interactY: 31,
    dialogue:
      'EXCALIBUR CRYSTAL SHRINE: A luminous azure crystal rises from the white octagonal fountain pedestal guarded by an armored stone sentinel.',
  },
];

/**
 * Generates pixel-aligned 45x60 collision, North Sapphire Vortex return warp,
 * interactive landmark triggers, and torch lighting mapped directly onto
 * the Royal Kingdom illustration.
 */
export function createKingdomMap(_data: TownData): TownMap {
  const w = KINGDOM_COLS;
  const h = KINGDOM_ROWS;
  const ground = new Uint8Array(w * h);
  const collision = new Uint8Array(w * h);

  // Default entire map to blocked perimeter/structures; carve exact walkable paths & yards
  ground.fill(Tile.WATER);
  collision.fill(1);

  const fillRect = (x0: number, y0: number, x1: number, y1: number, tile: number, blocked: 0 | 1) => {
    for (let y = Math.max(0, y0); y <= Math.min(h - 1, y1); y++) {
      for (let x = Math.max(0, x0); x <= Math.min(w - 1, x1); x++) {
        const idx = y * w + x;
        ground[idx] = tile;
        collision[idx] = blocked;
      }
    }
  };

  // 1. North Drawbridge Return Portal & Upper Flanking Courtyards (unobstructed bypass around Castle)
  fillRect(KINGDOM_RETURN_GATE.xMin, KINGDOM_RETURN_GATE.yMin, KINGDOM_RETURN_GATE.xMax, KINGDOM_RETURN_GATE.yMax, Tile.PATH, 0);
  fillRect(21, 6, 23, 7, Tile.PATH, 0);     // Wooden Drawbridge Span leading into North Courtyard
  fillRect(13, 8, 31, 9, Tile.PLAZA, 0);    // North Bypass Courtyard directly south of Drawbridge
  fillRect(13, 8, 15, 20, Tile.PATH, 0);    // West Flanking Courtyard beside Royal Castle
  fillRect(29, 8, 31, 20, Tile.PATH, 0);    // East Flanking Courtyard beside Royal Castle

  // Open side grass yards around Blacksmith & Tavern
  fillRect(3, 18, 13, 20, Tile.GRASS, 0);
  fillRect(31, 18, 41, 20, Tile.GRASS, 0);
  fillRect(3, 13, 4, 20, Tile.GRASS, 0);
  fillRect(40, 13, 41, 20, Tile.GRASS, 0);

  // 2. Main Castle Promenade (X: 3..41, Y: 20..22)
  fillRect(
    KINGDOM_ZONES.castlePromenade.xMin,
    KINGDOM_ZONES.castlePromenade.yMin,
    KINGDOM_ZONES.castlePromenade.xMax,
    KINGDOM_ZONES.castlePromenade.yMax,
    Tile.PATH,
    0
  );

  // 3. West & East Vertical District Loops (connecting Promenade -> Lower Cross Road -> South Boulevard)
  fillRect(11, 20, 13, 52, Tile.PATH, 0);
  fillRect(31, 20, 33, 52, Tile.PATH, 0);

  // Central Avenue north & south of Excalibur Fountain
  fillRect(21, 20, 23, 27, Tile.PATH, 0);
  fillRect(21, 31, 23, 38, Tile.PATH, 0);

  // 4. Excalibur Plaza Octagon Walkable Ring & Bazaar Lanes
  fillRect(17, 25, 27, 34, Tile.PLAZA, 0);
  fillRect(14, 23, 30, 24, Tile.GRASS, 0);
  fillRect(14, 29, 30, 29, Tile.PATH, 0);
  fillRect(14, 33, 30, 35, Tile.GRASS, 0);
  // Solid Fountain Centerpiece (X: 19..25, Y: 27..30) & 4 Symmetrical Market Stalls (use PLAZA/GRASS + blocked=1 so no iron fence renders)
  fillRect(19, 27, 25, 30, Tile.PLAZA, 1);
  fillRect(14, 25, 16, 27, Tile.GRASS, 1); // NW Stall
  fillRect(28, 25, 30, 27, Tile.GRASS, 1); // NE Stall
  fillRect(14, 30, 16, 32, Tile.GRASS, 1); // SW Stall
  fillRect(28, 30, 30, 32, Tile.GRASS, 1); // SE Stall

  // 5. Mage Tower Forecourt (West) & Barracks Sand Training Yard (East)
  fillRect(4, 34, 11, 36, Tile.GRASS, 0);
  fillRect(34, 31, 40, 36, Tile.SAND, 0);

  // 6. Lower Horizontal Cross Road (Y: 36..38)
  fillRect(
    KINGDOM_ZONES.lowerCrossRoad.xMin,
    KINGDOM_ZONES.lowerCrossRoad.yMin,
    KINGDOM_ZONES.lowerCrossRoad.xMax,
    KINGDOM_ZONES.lowerCrossRoad.yMax,
    Tile.PATH,
    0
  );

  // 7. South Earthen Dirt Path (X: 21..23, Y: 39..50) & Grove Clearings
  fillRect(21, 39, 23, 50, Tile.SAND, 0);
  fillRect(18, 39, 20, 50, Tile.GRASS, 0);
  fillRect(24, 39, 26, 50, Tile.GRASS, 0);

  // Walkable Interior of Jousting Arena Sand Pit (entered via south corral opening 11..13, 49)
  fillRect(6, 44, 17, 49, Tile.SAND, 0);

  // Royal Chapel South Front Approach & Side Lawn
  fillRect(28, 49, 40, 50, Tile.GRASS, 0);

  // 8. South Flagstone Boulevard (Y: 50..52)
  fillRect(
    KINGDOM_ZONES.southCourtyardRoad.xMin,
    KINGDOM_ZONES.southCourtyardRoad.yMin,
    KINGDOM_ZONES.southCourtyardRoad.xMax,
    KINGDOM_ZONES.southCourtyardRoad.yMax,
    Tile.PATH,
    0
  );

  // 8b. South Dirt Harbor Road (X: 21..23, Y: 53..59) leading directly to Harbour Town at (22, 59)
  fillRect(21, 53, 23, 59, Tile.SAND, 0);

  // Decorative grove trees beside south earthen avenue
  collision[40 * w + 18] = 1;
  collision[41 * w + 26] = 1;
  collision[47 * w + 26] = 1;

  // 9. Return Warp Trigger back to Digi-Sanctuary (20, 38, up) + South Harbour Warp at (22, 59)
  const doors = new Map<number, string>();
  for (let y = KINGDOM_RETURN_GATE.yMin; y <= KINGDOM_RETURN_GATE.yMax; y++) {
    for (let x = KINGDOM_RETURN_GATE.xMin; x <= KINGDOM_RETURN_GATE.xMax; x++) {
      doors.set(y * w + x, '/digimon?from=kingdom');
    }
  }
  for (let y = KINGDOM_HARBOUR_GATE.yMin; y <= KINGDOM_HARBOUR_GATE.yMax; y++) {
    for (let x = KINGDOM_HARBOUR_GATE.xMin; x <= KINGDOM_HARBOUR_GATE.xMax; x++) {
      doors.set(y * w + x, '/harbour');
    }
  }

  // 9b. Calibrated Building Entrances for all 7 Avalon Kingdom Interiors
  for (const door of Object.values(KINGDOM_BUILDING_DOORS)) {
    for (const dx of door.xs) {
      const idx = door.y * w + dx;
      collision[idx] = 0;
      if (ground[idx] === Tile.WATER) {
        ground[idx] = Tile.PATH;
      }
      doors.set(idx, door.route);
    }
  }

  // 10. Landmarks handled via KINGDOM_LANDMARKS in TownEngine for rich interactive actions
  const signs: Sign[] = [];

  // 11. Warm Medieval Torch, Furnace, Magic & Fountain Lighting
  const lamps: Lamp[] = [
    { x: 22, y: 6, radius: 70, color: 'cyan' },
    { x: 16, y: 19, radius: 52, color: 'amber' },
    { x: 28, y: 19, radius: 52, color: 'amber' },
    { x: 7, y: 16, radius: 48, color: 'amber' },
    { x: 18, y: 23, radius: 54, color: 'gold' },
    { x: 26, y: 23, radius: 54, color: 'gold' },
    { x: 8, y: 28, radius: 62, color: 'magenta' },
    { x: 22, y: 29, radius: 68, color: 'cyan' },
    { x: 20, y: 37, radius: 52, color: 'amber' },
    { x: 24, y: 37, radius: 52, color: 'amber' },
    { x: 20, y: 49, radius: 52, color: 'amber' },
    { x: 24, y: 49, radius: 52, color: 'amber' },
  ];

  return {
    w,
    h,
    ground,
    collision,
    buildings: [],
    npcs: [],
    signs,
    lamps,
    props: [],
    doors,
    spawns: {
      kingdom: { ...KINGDOM_SPAWN },
      harbour: { x: 22, y: 57, dir: 'up' },
      digimon: { ...KINGDOM_SPAWN },
      town: { ...KINGDOM_SPAWN },
    },
  };
}
