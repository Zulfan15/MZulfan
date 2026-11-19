import { Tile, type Dir, type Lamp, type Sign, type TownData, type TownMap } from './types';

export const SKY_CASTLE_COLS = 45;
export const SKY_CASTLE_ROWS = 60;

export const SKY_CASTLE_IMAGE_SRC = '/assets/Sky%20Castle/Gemini_Generated_Image_w5r3eow5r3eow5r3.jpg';

export const SKY_CASTLE_SPAWN = {
  x: 22,
  y: 55,
  dir: 'up' as Dir,
};

export const SKY_CASTLE_RETURN_GATE = {
  xMin: 21,
  xMax: 23,
  yMin: 58,
  yMax: 59,
} as const;

export interface SkyCastleLandmark {
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

export const SKY_CASTLE_LANDMARKS: SkyCastleLandmark[] = [
  {
    id: 'sky_citadel',
    name: '👑 White Marble Sky Citadel',
    x: 13,
    y: 2,
    w: 18,
    h: 12,
    interactX: 22,
    interactY: 14,
    dialogue:
      'WHITE MARBLE SKY CITADEL (North Island): Sapphire-spired cloud fortress floating above the cumulus sea, connected to the Crystal Plaza across the arched brick bridge.',
  },
  {
    id: 'sky_crystal_plaza',
    name: '💎 Azure Crystal Fountain',
    x: 20,
    y: 27,
    w: 5,
    h: 4,
    interactX: 22,
    interactY: 31,
    dialogue:
      'CELESTIAL CRYSTAL PLAZA: Four cherry-blossom sakura trees and cloud-market booths encircle the levitating sky-crystal fountain.',
  },
  {
    id: 'sky_windmills',
    name: '🌬️ Twin Cloud Windmills',
    x: 6,
    y: 19,
    w: 5,
    h: 5,
    interactX: 8,
    interactY: 24,
    dialogue:
      'TWIN CLOUD WINDMILLS & SKY-DOCKS (West Island): Catching stratospheric trade winds beside wooden airship docks overlooking the abyssal sky.',
  },
  {
    id: 'sky_tavern',
    name: '🏠 Cloudhaven Timber Inn',
    x: 12,
    y: 39,
    w: 7,
    h: 6,
    interactX: 15,
    interactY: 46,
    dialogue:
      'CLOUDHAVEN TIMBER INN (SW Island): Smoke curls gently above the pitched oak roof—warm herbal broth and sky-berry pastries await weary travellers.',
  },
  {
    id: 'sky_observatory',
    name: '🔭 Golden Astral Observatory',
    x: 35,
    y: 19,
    w: 6,
    h: 7,
    interactX: 38,
    interactY: 26,
    dialogue:
      'GOLDEN ASTRAL OBSERVATORY (NE Island): Brushed-gold starlight dome ringed with resonant amethyst crystals beside a cascading sky-waterfall.',
  },
  {
    id: 'sky_chapel',
    name: '⛪ Radiant Sky Chapel',
    x: 34,
    y: 38,
    w: 7,
    h: 8,
    interactX: 37,
    interactY: 47,
    dialogue:
      'RADIANT SKY CHAPEL (SE Island): White timber & sapphire-roofed sanctuary overlooking the twin southern cloud waterfalls.',
  },
];

/**
 * Generates pixel-aligned 45x60 collision, south bridge return warp back to
 * Digi-Sanctuary (36, 22), walkable floating islands/bridges/sky-docks, and lamps.
 */
export function createSkyCastleMap(_data: TownData): TownMap {
  const w = SKY_CASTLE_COLS;
  const h = SKY_CASTLE_ROWS;
  const ground = new Uint8Array(w * h);
  const collision = new Uint8Array(w * h);

  // Default open sky backdrop solid; carve exact floating islands, marble plazas & bridges
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

  // 1. South Grand Sky-Bridge & Return Gate back to Digi-Sanctuary (36, 22)
  fillRect(21, 35, 23, 59, Tile.PATH, 0);
  // Horizontal Cross Causeway bridging SW Inn Island <-> Spine <-> SE Sky Chapel Island
  fillRect(19, 45, 31, 47, Tile.PATH, 0);

  // 2. Central White Marble Crystal Plaza (X: 14..30, Y: 24..35)
  fillRect(14, 24, 30, 35, Tile.PLAZA, 0);
  // Solid Central Crystal Fountain centerpiece
  fillRect(21, 28, 23, 30, Tile.PLAZA, 1);
  // Solid Sakura Trees & Perimeter Market Booths/Benches
  fillRect(15, 23, 16, 25, Tile.GRASS, 1);
  fillRect(28, 23, 29, 25, Tile.GRASS, 1);
  fillRect(15, 33, 16, 34, Tile.GRASS, 1);
  fillRect(28, 33, 29, 34, Tile.GRASS, 1);
  fillRect(17, 25, 19, 26, Tile.PLAZA, 1);
  fillRect(25, 25, 27, 26, Tile.PLAZA, 1);
  fillRect(15, 26, 16, 27, Tile.PLAZA, 1);
  fillRect(28, 26, 29, 27, Tile.PLAZA, 1);
  fillRect(15, 31, 16, 32, Tile.PLAZA, 1);
  fillRect(28, 31, 29, 32, Tile.PLAZA, 1);
  fillRect(18, 35, 20, 35, Tile.PLAZA, 1);
  fillRect(24, 35, 26, 35, Tile.PLAZA, 1);

  // 3. North Brick Sky-Bridge -> White Marble Citadel Courtyard
  fillRect(21, 18, 23, 24, Tile.PATH, 0);
  fillRect(21, 14, 23, 18, Tile.PATH, 0);
  fillRect(14, 14, 30, 16, Tile.GRASS, 0); // Front Castle Lawns inside battlement

  // 4. West Floating Island — Twin Windmills, Wood Sky-Docks, Garden & Cloudhaven Inn
  fillRect(10, 29, 14, 30, Tile.PATH, 0); // West Marble Carpet Bridge
  fillRect(8, 24, 9, 46, Tile.SAND, 0);   // North-South Dirt Spine
  fillRect(7, 24, 9, 25, Tile.GRASS, 0);  // North Windmill approach
  fillRect(1, 28, 8, 30, Tile.PATH, 0);   // North Floating Wood Sky-Pier
  fillRect(5, 38, 8, 40, Tile.SAND, 0);   // Lower Windmill yard
  fillRect(9, 45, 19, 47, Tile.SAND, 0);  // Inn Forecourt <-> South Cross Bridge
  fillRect(6, 46, 9, 48, Tile.SAND, 0);   // Path to South Wood Sky-Pier
  fillRect(2, 46, 5, 48, Tile.PATH, 0);   // South Floating Wood Sky-Pier
  fillRect(9, 47, 17, 49, Tile.GRASS, 0); // Southern meadow beside waterfall

  // 5. NE Floating Island — Golden Astral Observatory
  fillRect(30, 29, 39, 30, Tile.PATH, 0); // East Marble Bridge <-> Observatory Walk
  fillRect(37, 26, 39, 30, Tile.PLAZA, 0);

  // 6. SE Floating Island — Radiant Sky Chapel Courtyard
  fillRect(30, 42, 35, 47, Tile.PLAZA, 0);
  fillRect(35, 46, 39, 48, Tile.PLAZA, 0);

  // 7. South Return Portal back to Digi-Sanctuary (33, 22, left)
  const doors = new Map<number, string>();
  for (let y = SKY_CASTLE_RETURN_GATE.yMin; y <= SKY_CASTLE_RETURN_GATE.yMax; y++) {
    for (let x = SKY_CASTLE_RETURN_GATE.xMin; x <= SKY_CASTLE_RETURN_GATE.xMax; x++) {
      doors.set(y * w + x, '/digimon?from=sky-castle');
    }
  }

  // 8. Interactive Landmarks via SKY_CASTLE_LANDMARKS in TownEngine
  const signs: Sign[] = [];

  // 9. Warm Cloud-Lantern, Crystal & Citadel Lighting
  const lamps: Lamp[] = [
    { x: 22, y: 12, radius: 74, color: 'gold' },
    { x: 19, y: 26, radius: 52, color: 'gold' },
    { x: 25, y: 26, radius: 52, color: 'gold' },
    { x: 22, y: 29, radius: 80, color: 'cyan' },
    { x: 38, y: 23, radius: 66, color: 'magenta' },
    { x: 15, y: 44, radius: 54, color: 'amber' },
    { x: 37, y: 44, radius: 60, color: 'cyan' },
    { x: 22, y: 56, radius: 52, color: 'gold' },
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
      'sky-castle': { ...SKY_CASTLE_SPAWN },
      digimon: { ...SKY_CASTLE_SPAWN },
      town: { ...SKY_CASTLE_SPAWN },
    },
  };
}
