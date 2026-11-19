import { Tile, type Dir, type Lamp, type Sign, type TownData, type TownMap } from './types';

export const HARBOUR_COLS = 45;
export const HARBOUR_ROWS = 60;

export const HARBOUR_IMAGE_SRC = '/assets/Harbour/Gemini_Generated_Image_vtasc7vtasc7vtas.jpg';

export const HARBOUR_SPAWN = {
  x: 22,
  y: 3,
  dir: 'down' as Dir,
};

export const HARBOUR_RETURN_GATE = {
  xMin: 21,
  xMax: 24,
  yMin: 0,
  yMax: 1,
} as const;

export const HARBOUR_BUILDING_DOORS = {
  lighthouse: {
    xs: [10, 11, 12],
    y: 11,
    route: '/harbour/lighthouse',
    spawn: { x: 11, y: 13, dir: 'down' as Dir },
  },
  warehouse: {
    xs: [27, 28],
    y: 18,
    route: '/harbour/warehouse',
    spawn: { x: 27, y: 20, dir: 'down' as Dir },
  },
  inn: {
    xs: [10, 11],
    y: 29,
    route: '/harbour/inn',
    spawn: { x: 10, y: 30, dir: 'down' as Dir },
  },
  galleon: {
    xs: [30, 31],
    y: 38,
    altDoors: [
      { xs: [31, 32], y: 30 },
    ],
    route: '/harbour/galleon',
    spawn: { x: 30, y: 40, dir: 'down' as Dir },
  },
  market: {
    xs: [6, 7],
    y: 36,
    route: '/harbour/market',
    spawn: { x: 7, y: 34, dir: 'down' as Dir },
  },
} as const;

export interface HarbourLandmark {
  id: string;
  name: string;
  x: number;
  y: number;
  w: number;
  h: number;
  interactX: number;
  interactY: number;
  dialogue: string;
}

export const HARBOUR_LANDMARKS: HarbourLandmark[] = [
  {
    id: 'harbour_lighthouse',
    name: '🗼 Old Port Lighthouse',
    x: 9,
    y: 2,
    w: 4,
    h: 10,
    interactX: 11,
    interactY: 12,
    dialogue:
      'OLD PORT LIGHTHOUSE (NW Bluff): Its revolving beacon guides trading galleons safely past the shoals toward Avalon Bay.',
  },
  {
    id: 'harbour_warehouse',
    name: '📦 Customs & Cargo Warehouse',
    x: 24,
    y: 9,
    w: 8,
    h: 11,
    interactX: 27,
    interactY: 20,
    dialogue:
      'HARBOUR CUSTOMS WAREHOUSE: Timber crates, salted provisions, and royal trade ledgers stacked beside the North Stone Quay.',
  },
  {
    id: 'harbour_cottage',
    name: '🏡 Harbourmaster Inn',
    x: 6,
    y: 21,
    w: 10,
    h: 9,
    interactX: 10,
    interactY: 30,
    dialogue:
      'HARBOURMASTER TUDOR INN: Warm hearthsmoke rises over blooming garden beds—restored tea, sea-breeze bread, and captain charts await inside.',
  },
  {
    id: 'harbour_market',
    name: '⛵ Dockside Trade Bazaar',
    x: 5,
    y: 36,
    w: 12,
    h: 6,
    interactX: 8,
    interactY: 35,
    dialogue:
      'DOCKSIDE MARKET SQUARE: Blue-and-green striped merchant stalls beside picnic tables overlooking the southern golden beach.',
  },
  {
    id: 'harbour_galleon',
    name: '🏴‍☠️ Sovereign Brigantine',
    x: 26,
    y: 29,
    w: 15,
    h: 10,
    interactX: 30,
    interactY: 39,
    dialogue:
      'THE SOVEREIGN BRIGANTINE: Moored between the twin oak piers, twin white canvas sails stand ready for voyages beyond the Azure Sea.',
  },
];

/**
 * Generates pixel-aligned 45x60 collision, north Royal Kingdom return warp,
 * walkable piers/beach/bluff stairs, and lamps mapped onto Harbour Town.
 */
export function createHarbourMap(_data: TownData): TownMap {
  const w = HARBOUR_COLS;
  const h = HARBOUR_ROWS;
  const ground = new Uint8Array(w * h);
  const collision = new Uint8Array(w * h);

  // Default surrounding ocean, cliffs & forest blocked; carve exact walkable roads/piers/beach
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

  // 1. North Entry Road from Royal Kingdom (22, 59)
  fillRect(21, 0, 24, 18, Tile.PATH, 0);

  // 2. Central Cobbled Cargo Quay & Road Junction
  fillRect(18, 18, 32, 23, Tile.PLAZA, 0);
  // Crates & Barrels flanking Cargo Quay
  fillRect(24, 19, 25, 20, Tile.PLAZA, 1);
  fillRect(30, 19, 31, 20, Tile.PLAZA, 1);
  fillRect(31, 21, 34, 22, Tile.PLAZA, 1);

  // 3. NW Path, Stone Stairs & Bluff Summit to Old Port Lighthouse
  fillRect(11, 18, 18, 19, Tile.SAND, 0);
  fillRect(10, 15, 11, 18, Tile.PATH, 0); // Bluff staircase
  fillRect(9, 12, 13, 14, Tile.GRASS, 0); // Lighthouse bluff top

  // 4. Paths around Harbourmaster Tudor Inn & Garden
  fillRect(11, 19, 18, 21, Tile.SAND, 0);
  fillRect(16, 20, 22, 34, Tile.SAND, 0);
  collision[25 * w + 17] = 1; // Lamp post
  collision[27 * w + 17] = 1; // Wooden bench
  collision[28 * w + 17] = 1;
  fillRect(12, 30, 13, 33, Tile.PATH, 0); // Garden stairs
  fillRect(9, 30, 13, 30, Tile.GRASS, 0); // Inner garden path right up to Inn door (10, 29)

  // 5. Waterfront Cobble Causeway & Twin Oak Piers + Tall Brigantine Berth
  fillRect(18, 24, 22, 45, Tile.PLAZA, 0);
  collision[32 * w + 22] = 1; // Coastal bush/tree
  collision[36 * w + 21] = 1; // Barrels
  collision[39 * w + 21] = 1;
  fillRect(23, 27, 39, 29, Tile.PATH, 0); // North Wooden Pier
  fillRect(23, 39, 37, 41, Tile.PATH, 0); // South Wooden Pier

  // 6. SW Dockside Market Square, Retaining Stairs & Sandy Beach
  fillRect(5, 32, 17, 45, Tile.SAND, 0);
  // Stalls, Picnic Tables & Benches solid inside Market Square
  fillRect(5, 36, 7, 40, Tile.PLAZA, 1);   // Blue-White Stall
  fillRect(14, 36, 16, 40, Tile.PLAZA, 1); // Green-White Stall
  fillRect(9, 36, 12, 40, Tile.SAND, 1);   // Center picnic tables & lamp
  fillRect(6, 41, 8, 41, Tile.SAND, 1);
  fillRect(14, 41, 16, 41, Tile.SAND, 1);
  collision[38 * w + 17] = 1;
  collision[39 * w + 17] = 1;
  collision[40 * w + 17] = 1;
  collision[43 * w + 6] = 1; // Barrel
  // Stone Retaining Wall Stairs down to Golden Beach
  fillRect(9, 46, 11, 49, Tile.PATH, 0);
  fillRect(2, 49, 15, 51, Tile.SAND, 0);
  fillRect(2, 52, 9, 52, Tile.SAND, 0);

  // 7. North Return Portal back to Royal Kingdom (spawns at 22, 57, up) + 5 Interior Doors
  const doors = new Map<number, string>();
  for (let y = HARBOUR_RETURN_GATE.yMin; y <= HARBOUR_RETURN_GATE.yMax; y++) {
    for (let x = HARBOUR_RETURN_GATE.xMin; x <= HARBOUR_RETURN_GATE.xMax; x++) {
      doors.set(y * w + x, '/kingdom?from=harbour');
    }
  }

  for (const doorCfg of Object.values(HARBOUR_BUILDING_DOORS)) {
    for (const dx of doorCfg.xs) {
      const idx = doorCfg.y * w + dx;
      ground[idx] = Tile.PATH;
      collision[idx] = 0;
      doors.set(idx, doorCfg.route);
    }
    if ('altDoors' in doorCfg && doorCfg.altDoors) {
      for (const alt of doorCfg.altDoors) {
        for (const dx of alt.xs) {
          const idx = alt.y * w + dx;
          ground[idx] = Tile.PATH;
          collision[idx] = 0;
          doors.set(idx, doorCfg.route);
        }
      }
    }
  }

  // 8. Interactive Landmarks via HARBOUR_LANDMARKS in TownEngine
  const signs: Sign[] = [];

  // 9. Warm Harbour Lantern, Lighthouse & Wharf Lighting
  const lamps: Lamp[] = [
    { x: 11, y: 4, radius: 90, color: 'gold' },
    { x: 18, y: 5, radius: 52, color: 'amber' },
    { x: 26, y: 5, radius: 52, color: 'amber' },
    { x: 17, y: 24, radius: 54, color: 'amber' },
    { x: 12, y: 36, radius: 56, color: 'gold' },
    { x: 28, y: 27, radius: 54, color: 'amber' },
    { x: 30, y: 39, radius: 58, color: 'amber' },
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
      harbour: { ...HARBOUR_SPAWN },
      kingdom: { ...HARBOUR_SPAWN },
      town: { ...HARBOUR_SPAWN },
      lighthouse: { ...HARBOUR_BUILDING_DOORS.lighthouse.spawn },
      warehouse: { ...HARBOUR_BUILDING_DOORS.warehouse.spawn },
      inn: { ...HARBOUR_BUILDING_DOORS.inn.spawn },
      galleon: { ...HARBOUR_BUILDING_DOORS.galleon.spawn },
      market: { ...HARBOUR_BUILDING_DOORS.market.spawn },
    },
  };
}
