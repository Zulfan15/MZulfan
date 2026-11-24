import { Tile, type Dir, type Lamp, type Sign, type TownData, type TownMap } from './types';

export const DARK_CASTLE_COLS = 45;
export const DARK_CASTLE_ROWS = 64;

export const DARK_CASTLE_IMAGE_SRC = '/assets/Dark%20Castle/Gemini_Generated_Image_h4wa5uh4wa5uh4wa.webp';

export const DARK_CASTLE_SPAWN = {
  x: 22,
  y: 11,
  dir: 'down' as Dir,
};

export const DARK_CASTLE_BUILDING_DOORS = {
  cathedral: { x: 9, y: 20, route: '/dark-castle/cathedral', spawn: { x: 9, y: 21, dir: 'down' as Dir } },
  forge: { x: 33, y: 24, route: '/dark-castle/forge', spawn: { x: 33, y: 25, dir: 'down' as Dir } },
  manor: { x: 11, y: 51, route: '/dark-castle/manor', spawn: { x: 11, y: 52, dir: 'down' as Dir } },
  vault: { x: 34, y: 48, route: '/dark-castle/vault', spawn: { x: 34, y: 50, dir: 'down' as Dir } },
} as const;

export const DARK_CASTLE_RETURN_GATE = {
  xMin: 21,
  xMax: 23,
  yMin: 7,
  yMax: 8,
} as const;

export interface DarkCastleLandmark {
  id: string;
  name: string;
  x: number;
  y: number;
  w: number;
  h: number;
  interactX: number;
  interactY: number;
  title: string;
  lines: string[];
}

export const DARK_CASTLE_LANDMARKS: DarkCastleLandmark[] = [
  {
    id: 'shadow-cathedral',
    name: '⛪ Shadow Cathedral',
    x: 4,
    y: 12,
    w: 10,
    h: 9,
    interactX: 9,
    interactY: 21,
    title: 'Shadow Cathedral — Gothic Spire of Obsidian Glass',
    lines: [
      'SHADOW CATHEDRAL (NW Ward): Twin obsidian spires pierce the violet mist above glowing stained-glass arches.',
      'Legends tell that ancient digital echoes linger behind its iron-bound double doors.',
    ],
  },
  {
    id: 'crimson-forge',
    name: '🔥 Crimson Reactor Forge',
    x: 31,
    y: 14,
    w: 12,
    h: 10,
    interactX: 33,
    interactY: 25,
    title: 'Crimson Reactor Forge — Magitech Foundry',
    lines: [
      'CRIMSON REACTOR FORGE (NE Ward): Glowing neon-violet conduits feed blazing magma turbines deep inside the citadel cliffside.',
      'Pure geothermal dark-matter energy powers the glowing crystal bridges below.',
    ],
  },
  {
    id: 'obsidian-obelisk',
    name: '🔮 Obsidian Obelisk Ring',
    x: 21,
    y: 27,
    w: 3,
    h: 4,
    interactX: 22,
    interactY: 31,
    title: 'Central Obsidian Obelisk — Heart of the Rift',
    lines: [
      'OBSIDIAN OBELISK: An arcane monolithic crystal bound in hovering runes of amethyst light.',
      'It anchors the four glowing bridges suspended over the molten abyss.',
    ],
  },
  {
    id: 'blood-manor',
    name: '🏰 Demon Keep & Blood Manor',
    x: 6,
    y: 38,
    w: 12,
    h: 13,
    interactX: 11,
    interactY: 52,
    title: 'Demon Keep & Blood Manor — Crimson Carpet Hall',
    lines: [
      'BLOOD MANOR (SW Ward): Guarded by stone gargoyles perched along dark crenellated balconies above the crimson runner.',
      'The upper dark archway overlooks the entire southern abyssal boulevard.',
    ],
  },
  {
    id: 'chrono-vault',
    name: '⏳ Chained Chrono Vault',
    x: 29,
    y: 39,
    w: 10,
    h: 10,
    interactX: 34,
    interactY: 50,
    title: 'Chained Chrono Vault — Sealed Sanctum',
    lines: [
      'CHAINED CHRONO VAULT (SE Ward): Colossal iron chains anchor this gold-trimmed temple directly into the surrounding volcanic cliff.',
      'Its giant golden timepiece counts down an unknown epoch in total silence.',
    ],
  },
];

/**
 * Generates collision, doors warp, signs, and ambient torches mapped cleanly
 * onto the 45x64 Dark Castle artwork grid.
 */
export function createDarkCastleMap(_data: TownData): TownMap {
  const w = DARK_CASTLE_COLS;
  const h = DARK_CASTLE_ROWS;
  const ground = new Uint8Array(w * h);
  const collision = new Uint8Array(w * h);

  // Default entire canvas to abyssal chasm / cliffside (solid)
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

  // 1. North Abyssal Portal Terrace & Causeway (X: 20..24, Y: 7..15)
  fillRect(20, 9, 24, 15, Tile.PLAZA, 0);
  fillRect(21, 7, 23, 15, Tile.PATH, 0);
  // Twin northern pillar obelisks flanking terrace edges
  fillRect(20, 11, 20, 13, Tile.PLAZA, 1);
  fillRect(24, 11, 24, 13, Tile.PLAZA, 1);

  // 2. Upper Crystal Light Bridge (Y: 15..25)
  fillRect(21, 15, 23, 25, Tile.PATH, 0);

  // 3. Central Obsidian Obelisk Octagonal Platform (X: 17..27, Y: 25..33)
  fillRect(17, 25, 27, 33, Tile.PLAZA, 0);
  fillRect(21, 27, 23, 30, Tile.PLAZA, 1); // Obsidian Obelisk monument core
  // Corner chamfer / chain anchor blocks
  for (const [cx, cy] of [
    [17, 25],
    [18, 25],
    [26, 25],
    [27, 25],
    [17, 26],
    [27, 26],
    [17, 32],
    [27, 32],
    [17, 33],
    [18, 33],
    [26, 33],
    [27, 33],
  ]) {
    collision[cy * w + cx] = 1;
  }

  // 4. West Crystal Bridge -> NW Shadow Cathedral Courtyard
  fillRect(13, 29, 17, 30, Tile.PATH, 0);
  fillRect(5, 23, 13, 30, Tile.PLAZA, 0);
  fillRect(8, 20, 10, 23, Tile.PATH, 0); // Cathedral Grand Steps & Archway Threshold (y=20 walkable!)
  // Torch plinths in Cathedral Courtyard
  collision[26 * w + 6] = 1;
  collision[26 * w + 11] = 1;

  // 5. East Crystal Bridge -> NE Crimson Reactor Forge Yard
  fillRect(27, 29, 31, 30, Tile.PATH, 0);
  fillRect(31, 24, 38, 28, Tile.PLAZA, 0);
  fillRect(31, 28, 33, 30, Tile.PLAZA, 0);
  fillRect(33, 24, 34, 25, Tile.PATH, 0); // Doorway threshold to Crimson Forge

  // 6. South Crystal Bridge & South Abyssal Boulevard
  fillRect(21, 33, 23, 41, Tile.PATH, 0);
  fillRect(20, 41, 24, 63, Tile.PATH, 0);
  // Torch pillars flanking South Boulevard
  for (const [bx, by] of [
    [20, 44],
    [24, 44],
    [20, 58],
    [24, 58],
  ]) {
    collision[by * w + bx] = 1;
  }

  // 7. SW Lower Road -> Blood Manor / Demon Keep
  fillRect(10, 55, 20, 58, Tile.PATH, 0);
  fillRect(8, 52, 16, 55, Tile.PLAZA, 0);
  fillRect(11, 51, 12, 55, Tile.PATH, 0); // Crimson Carpet walkway to Manor doors (11..12, 51)

  // 8. SE Stone Bridge -> Chained Chrono Vault
  fillRect(24, 49, 30, 50, Tile.PATH, 0);
  fillRect(29, 51, 39, 54, Tile.PLAZA, 0);
  fillRect(33, 48, 35, 53, Tile.PATH, 0); // Chrono Vault Grand Steps up to door (34, 48)

  // 9. Return Portal Doors (North Abyssal Swirling Vortex -> /digimon?from=dark-castle at 8, 22)
  const doors = new Map<number, string>();
  for (let y = DARK_CASTLE_RETURN_GATE.yMin; y <= DARK_CASTLE_RETURN_GATE.yMax; y++) {
    for (let x = DARK_CASTLE_RETURN_GATE.xMin; x <= DARK_CASTLE_RETURN_GATE.xMax; x++) {
      doors.set(y * w + x, '/digimon?from=dark-castle');
    }
  }

  // 9b. 4 Interior Building Entrance Double Doors (all archway tiles walkable & mapped)
  for (const cx of [8, 9, 10]) {
    doors.set(DARK_CASTLE_BUILDING_DOORS.cathedral.y * w + cx, DARK_CASTLE_BUILDING_DOORS.cathedral.route);
  }
  for (const fx of [33, 34]) {
    doors.set(DARK_CASTLE_BUILDING_DOORS.forge.y * w + fx, DARK_CASTLE_BUILDING_DOORS.forge.route);
  }
  for (const mx of [11, 12]) {
    doors.set(DARK_CASTLE_BUILDING_DOORS.manor.y * w + mx, DARK_CASTLE_BUILDING_DOORS.manor.route);
  }
  for (const vx of [33, 34, 35]) {
    doors.set(DARK_CASTLE_BUILDING_DOORS.vault.y * w + vx, DARK_CASTLE_BUILDING_DOORS.vault.route);
  }
  doors.set(49 * w + 34, DARK_CASTLE_BUILDING_DOORS.vault.route);

  // 10. Interactive Landmarks & Signs
  const signs: Sign[] = DARK_CASTLE_LANDMARKS.map((lm) => ({
    id: lm.id,
    name: lm.name,
    x: lm.interactX,
    y: lm.interactY - 1,
    style: 'board',
    lines: lm.lines,
  }));

  // 11. Warm Crimson, Violet & Amber Lighting Pools across Dark Castle
  const lamps: Lamp[] = [
    { x: 22, y: 7, radius: 78, color: 'magenta' },
    { x: 20, y: 16, radius: 44, color: 'amber' },
    { x: 24, y: 16, radius: 44, color: 'amber' },
    { x: 22, y: 28, radius: 88, color: 'magenta' },
    { x: 6, y: 26, radius: 52, color: 'amber' },
    { x: 11, y: 26, radius: 52, color: 'amber' },
    { x: 9, y: 18, radius: 64, color: 'magenta' },
    { x: 34, y: 17, radius: 68, color: 'amber' },
    { x: 34, y: 26, radius: 46, color: 'amber' },
    { x: 20, y: 44, radius: 46, color: 'amber' },
    { x: 24, y: 44, radius: 46, color: 'amber' },
    { x: 20, y: 59, radius: 46, color: 'amber' },
    { x: 24, y: 59, radius: 46, color: 'amber' },
    { x: 11, y: 51, radius: 54, color: 'magenta' },
    { x: 34, y: 47, radius: 56, color: 'gold' },
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
      'dark-castle': { ...DARK_CASTLE_SPAWN },
      digimon: { ...DARK_CASTLE_SPAWN },
      town: { ...DARK_CASTLE_SPAWN },
    },
  };
}
