/**
 * Pokémon Sinnoh/Unova style coastal town map:
 * - 45x64 tile layout perfectly calibrated to the authentic Pokémon town map illustration (town_map.jpg)
 * - Ocean coast with cliffs on the left
 * - Grand Manor (Dev Center) at the north square
 * - Green-roof Research Lab at north-east
 * - Two-story Slate Manor (Home) at middle-west
 * - Iconic Pokémon Center (Front Desk / Reception) with red roof
 * - Poké Mart (Depop / Store) with blue roof
 * - Central circular sparkling water fountain
 * - Modern Tech Hub (Arcade) beside the fountain plaza
 * - Charming Outdoor Café with parasols (LinkedIn, Résumé, GitHub, Email)
 * - Charizard and AI Digital Twin NPCs
 */
import { Tile, type Building, type Lamp, type Npc, type Prop, type Sign, type TownData, type TownMap } from './types';

export const MAP_W = 45;
export const MAP_H = 64;

export function createTownMap(_data: TownData): TownMap {
  const w = MAP_W;
  const h = MAP_H;
  const ground = new Uint8Array(w * h).fill(Tile.GRASS);
  const collision = new Uint8Array(w * h).fill(0); // 0 = walkable by default across town land
  const idx = (x: number, y: number) => y * w + x;

  const rectGround = (x: number, y: number, rw: number, rh: number, t: number) => {
    for (let j = y; j < y + rh; j++) {
      for (let i = x; i < x + rw; i++) {
        if (i >= 0 && i < w && j >= 0 && j < h) {
          ground[idx(i, j)] = t;
        }
      }
    }
  };

  const makeWalkable = (x: number, y: number, rw: number, rh: number) => {
    for (let j = y; j < y + rh; j++) {
      for (let i = x; i < x + rw; i++) {
        if (i >= 0 && i < w && j >= 0 && j < h) {
          collision[idx(i, j)] = 0;
          ground[idx(i, j)] = Tile.PATH;
        }
      }
    }
  };

  const makeWalkableGrass = (x: number, y: number, rw: number, rh: number) => {
    for (let j = y; j < y + rh; j++) {
      for (let i = x; i < x + rw; i++) {
        if (i >= 0 && i < w && j >= 0 && j < h) {
          collision[idx(i, j)] = 0;
          ground[idx(i, j)] = Tile.GRASS;
        }
      }
    }
  };

  const makeWalkableTallGrass = (x: number, y: number, rw: number, rh: number) => {
    for (let j = y; j < y + rh; j++) {
      for (let i = x; i < x + rw; i++) {
        if (i >= 0 && i < w && j >= 0 && j < h) {
          collision[idx(i, j)] = 0;
          ground[idx(i, j)] = Tile.TALL;
        }
      }
    }
  };

  // 1. Ocean Coast on Left (x: 0 to 8, y: 0 to 26; x: 0 to 2, y: 27 to 32)
  rectGround(0, 0, 9, 27, Tile.WATER);  // Deep ocean bay above coastal seawall
  rectGround(0, 27, 3, 6, Tile.WATER);  // Coastal water buffer west of cycling track
  for (let j = 0; j < 27; j++) {
    for (let i = 0; i < 9; i++) collision[idx(i, j)] = 1;
  }
  for (let j = 27; j < 33; j++) {
    for (let i = 0; i < 3; i++) collision[idx(i, j)] = 1;
  }

  // Stone foundation aprons around key civic structures
  rectGround(9, 1, 13, 17, Tile.PATH);   // 1-tile stone apron around Dev Center & Courtyard (X: 9..21, Y: 1..17)
  rectGround(23, 1, 11, 14, Tile.PATH);  // Stone apron around Research Lab & Annex campus (X: 23..33, Y: 1..14)
  rectGround(3, 27, 2, 16, Tile.PATH);   // Brick cycling & jogging track (X: 3..4, Y: 27..42)
  makeWalkable(3, 27, 2, 16);            // Walkable cycling track

  // 2. South Pokémon Dex Catching Reserve & Meadows (X: 3..18 & X: 25..42, Y: 56..61)
  // A. West Dex Meadow:
  makeWalkableGrass(3, 56, 16, 1);       // Walkable lawn gateway path from West Plaza
  makeWalkableTallGrass(3, 57, 16, 5);   // X: 3..18, Y: 57..61 (Expansive wild tall grass reserve for Dex encounters!)

  // B. East Dex Meadow:
  makeWalkableGrass(25, 56, 18, 1);      // Walkable lawn gateway path from Café & Promenade
  makeWalkableTallGrass(25, 57, 18, 5);  // X: 25..42, Y: 57..61 (Expansive wild tall grass reserve for Dex encounters!)

  // 3. Walkable Streets & Plazas (Master-Planned 3-Zone Urban Grid)
  // A. Central Boulevard (North-South grand avenue at X: 21..23, completely unblocked!)
  makeWalkable(20, 18, 4, 44); // X: 20..23, Y: 18..61 (Stops at Y: 61 before south border forest wall)

  // B. Grand Manor Courtyard at North (Dev Center: X: 9..21, Y: 13..17)
  makeWalkable(9, 13, 13, 5);   // X: 9..21, Y: 13..17 (Courtyard opened west to X: 9 with vertical hedge at X: 8)
  makeWalkable(15, 11, 2, 2);   // Direct approach to Dev door at (15..16, 11)
  makeWalkable(19, 16, 4, 2);   // Gateway connecting Courtyard to Central Boulevard
  makeWalkable(10, 18, 12, 2);  // X: 10..21, Y: 18..19 (Clean 2-tile paved street above Home Manor!)

  // C. West Wing Commercial & Civic Street (Aligned along Door Axis X = 15)
  makeWalkable(8, 20, 2, 7);   // X: 8..9, Y: 20..26 (Scenic Oceanview Promenade along granite sea wall)
  makeWalkable(8, 27, 13, 2);  // X: 8..20, Y: 27..28 (Clean 2-tile cross-street between Home Manor and Poké Center)
  makeWalkable(5, 27, 4, 1);   // X: 5..8, Y: 27 (Seaside connection north of Reshiram)
  makeWalkable(8, 28, 2, 2);   // X: 8..9, Y: 28..29 (Approach to Reshiram)
  makeWalkable(8, 35, 13, 2);  // X: 8..20, Y: 35..36 (Clean 2-tile cross-street between Poké Center and Poké Mart)
  makeWalkable(5, 37, 4, 1);   // X: 5..8, Y: 37 (Seaside connection north of Zekrom)
  makeWalkable(8, 38, 2, 2);   // X: 8..9, Y: 38..39 (Approach to Zekrom)
  makeWalkable(8, 43, 13, 2);  // X: 8..20, Y: 43..44 (Clean cross-street below Poké Mart to West Plaza)
  makeWalkable(2, 43, 19, 13); // X: 2..20, Y: 43..55 (Grand West Plaza, Tech Tower forecourt & flowerbed park)
  makeWalkable(14, 26, 3, 18); // X: 14..16, Y: 26..43 (Continuous paved door avenue along Axis X=15!)

  // D. Center Wing: Research Lab Compound (X: 23..33, Y: 1..15)
  makeWalkable(23, 9, 11, 7);  // X: 23..33, Y: 9..15 (Completely open, seamless courtyard and avenue!)
  makeWalkable(26, 8, 3, 2);   // Approach to lab door at (27, 8)
  makeWalkable(31, 8, 3, 2);   // Approach to Observatory Annex door at (32, 8)

  // E. Center Wing: Battle Arena (X: 24..33, Y: 16..24)
  makeWalkable(24, 16, 10, 9); // X: 24..33, Y: 16..24 (Clean regulation sand court, zero obstacles!)

  // F. Center Wing: Promenade, Digital Twin & Fountain Plaza (X: 24..33, Y: 25..35)
  makeWalkable(24, 25, 10, 3); // X: 24..33, Y: 25..27 (Open paved promenade below Arena)
  makeWalkable(24, 28, 10, 8); // X: 24..33, Y: 28..35 (Civic Fountain Plaza surrounding fountain at (28.5, 31))

  // G. Center Wing: Arcade Below Fountain (X: 25..32, Y: 36..42)
  makeWalkable(24, 36, 10, 7); // Forecourt and approaches around Arcade
  makeWalkable(24, 43, 10, 4); // X: 24..33, Y: 43..46 (Arcade South Apron connecting to Boulevard & Kiosk)

  // H. Unbroken East Promenade (X: 34..35, Y: 6..54 - 2-tile wide straight unobstructed stone avenue!)
  makeWalkable(34, 6, 2, 49);  // X: 34..35, Y: 6..54 (100% collision-free straight corridor!)

  // I. East Wing 5 Districts (X: 36..42)
  // 1) 🔭 Scenic Lookout (X: 36..42, Y: 2..7)
  makeWalkable(36, 2, 7, 6);   // X: 36..42, Y: 2..7 (Observation terrace)
  makeWalkable(36, 8, 7, 1);   // Y: 8 (1-tile buffer below Scenic Lookout)
  // 2) 🏡 Studio Villa (X: 36..41, Y: 9..14, door at 38, 13)
  makeWalkable(36, 9, 6, 6);   // X: 36..41, Y: 9..14 (Villa estate, door at 38, 13)
  makeWalkable(36, 15, 6, 1);  // Y: 15 (Front gate approach at 38, 15)
  makeWalkable(36, 16, 7, 1);  // Y: 16 (1-tile walkway buffer below Villa fence)
  // 3) 🌸 Berry Garden (X: 36..42, Y: 17..25)
  makeWalkable(36, 17, 7, 9);  // X: 36..42, Y: 17..25 (Orchard with entrance at 36, 21)
  makeWalkable(36, 26, 7, 2);  // Y: 26..27 (2-tile walkway buffer below Berry Garden)
  // 4) 🎪 Contest Stage (X: 36..42, Y: 28..35)
  makeWalkable(36, 28, 7, 8);  // X: 36..42, Y: 28..35 (Amphitheater & stage)
  makeWalkable(36, 36, 7, 2);  // Y: 36..37 (2-tile walkway buffer below Contest Stage)
  // 5) 🏕️ Ranger Camp (X: 36..42, Y: 38..45)
  makeWalkable(36, 38, 7, 8);  // X: 36..42, Y: 38..45 (Woodland clearing & outpost)
  makeWalkable(36, 46, 7, 2);  // Y: 46..47 (Buffer below Ranger Camp to Café)

  // J. South Civic Plaza, Contest Stage, Kiosk & Café Terrace (X: 24..42, Y: 46..56)
  makeWalkable(24, 46, 10, 10); // X: 24..33, Y: 46..55 (Seamless South Civic Plaza, Contest Stage & Barista grounds)
  makeWalkable(34, 48, 9, 8);   // Shifted Café Terrace (Socials tables at X: 34..42, Y: 48..55)
  makeWalkable(20, 56, 23, 1);  // South gate connecting road (Y: 56)

  // Block the fountain pool inside the fountain plaza (center 28.5, 31)
  for (let j = 30; j <= 32; j++) {
    for (let i = 27; i <= 30; i++) {
      collision[idx(i, j)] = 1;
      ground[idx(i, j)] = Tile.WATER;
    }
  }

  // Block the small water basin in Dev Manor courtyard (16, 16)
  collision[idx(16, 16)] = 1;
  ground[idx(16, 16)] = Tile.WATER;

  // Set Tile.TREE on perimeter forest grounds (strictly unbroken lines along all 4 boundaries)
  rectGround(0, 0, 45, 2, Tile.TREE);  // North ridge (strictly 1 row of trees, Y: 0..1)
  rectGround(9, 0, 35, 1, Tile.FENCE); // Unified northern boundary fence (X: 9..43, Y: 0)
  rectGround(36, 2, 8, 1, Tile.FENCE); // Scenic Lookout terrace north railing (X: 36..43, Y: 2)
  rectGround(44, 0, 1, 64, Tile.TREE); // East woods (strictly 1 column of trees, at X: 44)
  rectGround(0, 33, 2, 31, Tile.TREE); // Western boundary tree line (x: 0..1, down to y=63)
  rectGround(0, 62, 45, 2, Tile.TREE); // South boundary unbroken forest ridge (y: 62..63, strictly impassable)
  for (let x = 0; x < 45; x++) {
    collision[idx(x, 62)] = 1;
    collision[idx(x, 63)] = 1;
  }
  for (let j = 0; j < 2; j++) {
    for (let i = 0; i < 45; i++) collision[idx(i, j)] = 1;
  }
  for (let j = 0; j < 64; j++) collision[idx(44, j)] = 1;
  for (let j = 33; j < 64; j++) {
    collision[idx(0, j)] = 1;
    collision[idx(1, j)] = 1;
  }

  // Fences & Barriers for South Dex Meadow (enclosing reserve with open gates for player entry)
  // West Plaza bottom fence (X: 2..13 & X: 17..18 at Y: 56, leaves X: 14..16 as open gate)
  for (let x = 2; x <= 13; x++) { collision[idx(x, 56)] = 1; ground[idx(x, 56)] = Tile.FENCE; }
  for (let x = 17; x <= 18; x++) { collision[idx(x, 56)] = 1; ground[idx(x, 56)] = Tile.FENCE; }
  // West road flanking fence & corner (X: 19, Y: 56..61)
  for (let y = 56; y <= 61; y++) { collision[idx(19, y)] = 1; ground[idx(19, y)] = Tile.FENCE; }
  // Western boundary fence line (X: 2, Y: 28..61)
  for (let y = 28; y <= 61; y++) { collision[idx(2, y)] = 1; ground[idx(2, y)] = Tile.FENCE; }

  // East road flanking fence & corner (X: 25, Y: 56..61)
  for (let y = 56; y <= 61; y++) { collision[idx(25, y)] = 1; ground[idx(25, y)] = Tile.FENCE; }
  // South fence in front of Kiosk Forecourt (X: 25..32 at Y: 56)
  for (let x = 25; x <= 32; x++) { collision[idx(x, 56)] = 1; ground[idx(x, 56)] = Tile.FENCE; }
  // South Café fence wings (X: 34..36 and X: 39..42 at Y: 56, leaves X: 37..38 as open south entrance)
  for (let x = 34; x <= 36; x++) { collision[idx(x, 56)] = 1; ground[idx(x, 56)] = Tile.FENCE; }
  for (let x = 39; x <= 42; x++) { collision[idx(x, 56)] = 1; ground[idx(x, 56)] = Tile.FENCE; }
  // Eastern boundary fence line (X: 43, Y: 0..61 flanking eastern tree line)
  for (let y = 0; y <= 61; y++) { collision[idx(43, y)] = 1; ground[idx(43, y)] = Tile.FENCE; }
  for (let x = 36; x <= 42; x++) { collision[idx(x, 2)] = 1; ground[idx(x, 2)] = Tile.FENCE; } // Lookout north railing

  // Studio Villa Side Fences (framing front garden at X: 36, 41 along Y: 13..14)
  for (let y = 13; y <= 14; y++) {
    collision[idx(36, y)] = 1; ground[idx(36, y)] = Tile.FENCE;
    collision[idx(41, y)] = 1; ground[idx(41, y)] = Tile.FENCE;
  }
  // Berry Garden entrance fence wings flanking gate at (36, 21)
  for (let y = 17; y <= 20; y++) { collision[idx(36, y)] = 1; ground[idx(36, y)] = Tile.FENCE; }
  for (let y = 22; y <= 25; y++) { collision[idx(36, y)] = 1; ground[idx(36, y)] = Tile.FENCE; }

  // Front fence along Y: 15 with gate at (38, 15)
  for (let i = 36; i <= 41; i++) {
    if (i === 38) continue; // Gate opening at (38, 15)
    collision[idx(i, 15)] = 1;
    ground[idx(i, 15)] = Tile.FENCE;
  }
  // Unified North Boundary Perimeter Fence & Single Divider Hedge Column
  for (let x = 9; x <= 43; x++) collision[idx(x, 0)] = 1; // Continuous north fence along Y: 0
  for (let y = 1; y <= 17; y++) collision[idx(22, y)] = 1; // Single divider hedge column at X: 22 (Y: 1..17, shifted 1 tile west!)
  for (let y = 13; y <= 17; y++) collision[idx(8, y)] = 1; // West courtyard boundary hedge shifted to X: 8

  // West Seaside Boardwalk (X: 5..8, Y: 27..42) - clean walkable promenade ground
  makeWalkable(5, 27, 4, 16);

  // 4. Interactive Buildings
  const buildings: Building[] = [
    // Grand Manor at North-West: Dev Center
    {
      id: 'dev',
      name: 'Dev Center',
      badge: 'Dev Center',
      route: '/dev',
      x: 10,
      y: 1,
      w: 12,
      h: 11,
      doors: [{ x: 15, y: 11 }, { x: 16, y: 11 }],
      roof: '#4a5568',
      roofDark: '#2d3748',
      wall: '#d8cbba',
      sign: 'DEV CENTER',
      style: 'mansion',
    },
    // Green-roof Building at North-East: Research Lab (Shifted to X: 24, Y: 3)
    {
      id: 'lab',
      name: 'Research Lab',
      badge: 'Research Lab',
      route: '/lab',
      x: 24,
      y: 3,
      w: 7,
      h: 6,
      doors: [{ x: 27, y: 8 }],
      roof: '#1b4332',
      roofDark: '#2d6a4f',
      wall: '#f8f9fa',
      sign: 'LAB',
      style: 'lab',
    },
    // Slate Manor at Middle-West: Home
    {
      id: 'home',
      name: 'Home',
      badge: 'Home',
      route: '/about',
      x: 10,
      y: 20,
      w: 10,
      h: 7,
      doors: [{ x: 15, y: 26 }],
      roof: '#2b2d42',
      roofDark: '#1d1e2c',
      wall: '#f3eee3',
      sign: 'HOME',
      style: 'mansion',
    },
    // Pokémon Center (Red Roof with Pokéball symbol): Front Desk / Reception (Aligned to Axis X=15)
    {
      id: 'reception',
      name: 'Poké Center',
      badge: 'Poké Center',
      route: '/reception',
      x: 12,
      y: 29,
      w: 7,
      h: 6,
      doors: [{ x: 15, y: 34 }],
      roof: '#d90429',
      roofDark: '#9b2226',
      wall: '#f8f9fa',
      sign: 'RECEPTION',
      style: 'standard',
    },
    // Poké Mart (Blue Roof with Shop symbol): Poké Mart Store (Aligned to Axis X=15)
    {
      id: 'shop',
      name: 'Poké Mart',
      badge: 'Mart',
      route: '/mart',
      x: 12,
      y: 37,
      w: 6,
      h: 6,
      doors: [{ x: 15, y: 42 }],
      roof: '#1d3557',
      roofDark: '#0d1b2a',
      wall: '#f8fafc',
      sign: 'MART',
      style: 'shop',
    },
    // Modern Building at Middle-East: Arcade (Centered on Axis X=28.5 below Fountain)
    {
      id: 'arcade',
      name: 'Arcade',
      badge: 'Arcade',
      route: '/arcade',
      x: 25,
      y: 36,
      w: 8,
      h: 7,
      doors: [{ x: 28, y: 42 }, { x: 29, y: 42 }],
      roof: '#1e293b',
      roofDark: '#0f172a',
      wall: '#334155',
      sign: 'ARCADE',
      style: 'standard',
    },
    // Storybook Pokémon Villa (Shifted to ABOVE Berry Garden: X: 36, Y: 9)
    {
      id: 'villa',
      name: "Studio Villa",
      badge: 'Studio',
      route: '/about',
      x: 36,
      y: 9,
      w: 6,
      h: 5,
      doors: [{ x: 38, y: 13 }],
      roof: '#9a3412',
      roofDark: '#7c2d12',
      wall: '#fef3c7',
      sign: 'STUDIO',
      style: 'standard',
    },
    // Multi-Story Urban Office Tower (South-West Commercial Plaza)
    {
      id: 'office',
      name: 'Tech Tower',
      badge: 'Tech Tower',
      route: '/tower',
      x: 3,
      y: 44,
      w: 6,
      h: 8,
      doors: [{ x: 5, y: 51 }, { x: 6, y: 51 }],
      roof: '#334155',
      roofDark: '#1e293b',
      wall: '#64748b',
      sign: 'TECH TOWER',
      style: 'standard',
    },
  ];

  // 5. Props (Statue & Fountain & East POIs)
  const props: Prop[] = [
    {
      id: 'fountain',
      name: 'Town Fountain',
      badge: 'Fountain',
      x: 28,
      y: 31,
      type: 'fountain',
      lines: [
        'TOWN FOUNTAIN',
        'Pure crystal-clear water sparkles under the sunlight.',
        'A coin was tossed in: "May models converge quickly and latency stay under 2ms!"',
      ],
    },
    {
      id: 'statue',
      name: 'Courtyard Basin',
      badge: 'Courtyard Basin',
      x: 16,
      y: 16,
      type: 'statue',
      lines: [
        'MANOR FOUNTAIN BASIN',
        'Clear mountain spring water feeding the courtyard of the Dev Center.',
      ],
    },
    {
      id: 'lookout',
      name: 'Scenic Lookout',
      badge: 'Lookout Point',
      x: 39,
      y: 3,
      type: 'statue',
      lines: [
        'SCENIC LOOKOUT POINT',
        'Overlooking the breathtaking coast and distant horizon of Sinnoh.',
        'High elevation, crystal-clear panorama, zero inference latency!',
      ],
    },
    {
      id: 'arena',
      name: 'Battle Arena',
      badge: 'Battle Arena',
      x: 28,
      y: 20,
      type: 'statue',
      lines: [
        'POKÉMON BATTLE ARENA',
        'Regulation sand court where AI models and algorithms test their mettle.',
        '"May accuracy soar and loss reach the global minimum!"',
      ],
    },
    {
      id: 'berry',
      name: 'Berry Garden',
      badge: 'Berry Garden',
      x: 39,
      y: 20,
      type: 'bench',
      lines: [
        'ORGANIC BERRY ORCHARD & SAKURA GROVE',
        'Oran, Sitrus, and Cheri berries thrive here under pink cherry blossoms.',
        'A tranquil oasis that restores stamina and clears the mind.',
      ],
    },
    {
      id: 'contest',
      name: 'Contest Stage',
      badge: 'Contest Stage',
      x: 39,
      y: 30,
      type: 'statue',
      lines: [
        'POKÉMON CONTEST HALL STAGE',
        'A sparkling spotlight stage celebrating creativity, elegance, and design.',
        'Spectators cheer from the amphitheater seating!',
      ],
    },
    {
      id: 'hobby',
      name: 'Off-Duty Gazebo',
      badge: 'Seaside Plaza',
      x: 8,
      y: 34,
      type: 'bench',
      lines: [
        "ZULFAN'S OFF-DUTY LOG",
        "When not training neural nets or architecting frontends:",
        "• Lo-fi beat production & indie synth tracks",
        "• Vintage handheld console modding & retro pixel art",
        "• Specialty pour-over coffee brewing & coastal cycling routes!",
      ],
    },
  ];

  // 6. NPCs (Charizard in Plaza & Digital Twin at Crossroads & Ranger Alex & Ace Trainer)
  const npcs: Npc[] = [
    {
      id: 'twin',
      name: 'Digital Twin',
      badge: 'Digital Twin',
      x: 25,
      y: 26,
      dir: 'right',
      palette: {
        skin: '#fedbb7',
        hair: '#1c1726',
        shirt: '#2fae8f',
        pants: '#1d2b53',
        shoes: '#1c1726',
        holo: true,
      },
      lines: [
        `Bzzt… The Aura is with us! I'm Zulfan's AI Digital Twin (Lucario)!`,
        'Ask me anything about his projects, edge AI research, or CV.',
      ],
      action: { kind: 'navigate', route: '/twin', prompt: 'Talk to the Digital Twin?' },
    },
    {
      id: 'charizard',
      name: 'Charizard',
      badge: 'Charizard',
      x: 25,
      y: 33,
      dir: 'right',
      palette: {
        skin: '#f08030',
        hair: '#209888',
        shirt: '#f8e8a0',
        pants: '#b04010',
        shoes: '#181820',
        cap: '#ff7a59',
      },
      lines: [`GRAAWR! Charizard flares its wings warmly in the plaza!`],
      action: { kind: 'event', name: 'charizard' },
    },
    {
      id: 'ranger',
      name: 'Blastoise',
      badge: 'Nature Reserve',
      x: 37,
      y: 42,
      dir: 'down',
      palette: {
        skin: '#38bdf8',
        hair: '#1e3a8a',
        shirt: '#2563eb',
        pants: '#1e3a8a',
        shoes: '#0f172a',
        cap: '#0284c7',
      },
      lines: [
        'BLASTOISE: "Gaaa-oohhh!" 🌊',
        'Blastoise adalah Pokémon starter air legendaris dari wilayah Kanto.',
        'Meriam air ganda di bahunya menyemprotkan uap air sejuk untuk menyuburkan Berry Garden dan menyejukkan kawasan cagar alam kota.',
      ],
    },
    {
      id: 'ace',
      name: 'Mewtwo',
      badge: 'Battle Arena',
      x: 28,
      y: 17,
      dir: 'down',
      palette: {
        skin: '#f3e8ff',
        hair: '#9333ea',
        shirt: '#ffffff',
        pants: '#7e22ce',
        shoes: '#3b0764',
        cap: '#a855f7',
      },
      lines: [
        'MEWTWO: "Saya tidak diciptakan untuk kalah. Pikiran manusia ini... menarik."',
        'Mewtwo berdiri di arena pertempuran menantang siapapun yang berani menguji ketajaman logika dan wawasan teknologinya.',
        'Selesaikan Tech Challenge Quiz untuk membuktikan kemampuanmu dan merebut Arena Frontier Badge!',
      ],
      action: { kind: 'event', name: 'arena-quiz' },
    },
    {
      id: 'arceus',
      name: 'Arceus',
      badge: 'Alpha Pokémon',
      x: 17,
      y: 14,
      dir: 'down',
      palette: {
        skin: '#ffffff',
        hair: '#facc15',
        shirt: '#ffffff',
        pants: '#1e293b',
        shoes: '#facc15',
      },
      lines: [
        'ARCEUS: "Dooo-oooonnn...!" ✨',
        'Sang Alpha Pokémon berdiri anggun di pelataran Dev Center.',
        'Konon dalam mitologi Sinnoh, Arceus lahir sebelum alam semesta terbentuk dan menciptakan ruang serta waktu dengan 1.000 lengannya.',
        'Kehadirannya di Zulfan\'s Town membawa berkat kedamaian dan inspirasi kreativitas teknologi tanpa batas.',
      ],
    },
    {
      id: 'reshiram',
      name: 'Reshiram',
      badge: 'Vast White',
      x: 6,
      y: 28,
      dir: 'down',
      palette: {
        skin: '#ffffff',
        hair: '#f97316',
        shirt: '#ffffff',
        pants: '#fed7aa',
        shoes: '#ea580c',
      },
      lines: [
        'RESHIRAM: "Vaaa-zhooom...!" 🤍🔥',
        'Naga Legendaris Putih (Vast White Pokémon) berdiri megah di tebing pesisir pantai barat.',
        'Ekor turbin Reshiram membara dengan api kebenaran murni (Fusion Flare), menghangatkan semilir angin laut Zulfan\'s Town.',
        'Menurut legenda wilayah Unova, Reshiram mendampingi para visioner yang memperjuangkan dunia yang dipenuhi kebenaran dan cita-cita luhur.',
      ],
      action: { kind: 'event', name: 'reshiram' },
    },
    {
      id: 'zekrom',
      name: 'Zekrom',
      badge: 'Deep Black',
      x: 6,
      y: 38,
      dir: 'down',
      palette: {
        skin: '#1e293b',
        hair: '#38bdf8',
        shirt: '#0f172a',
        pants: '#0284c7',
        shoes: '#0369a1',
      },
      lines: [
        'ZEKROM: "Bzzzz-Vrrrooom...!" 🖤⚡',
        'Naga Legendaris Hitam (Deep Black Pokémon) berdiri kokoh di pelataran pesisir selatan pantai.',
        'Ekor generator listriknya berputar kencang memancarkan kilatan petir bertegangan raksasa (Fusion Bolt).',
        'Menurut legenda wilayah Unova, Zekrom mendampingi para pejuang yang teguh merealisasikan cita-cita dan idealisme tinggi demi masa depan yang lebih baik.',
      ],
      action: { kind: 'event', name: 'zekrom' },
    },
    {
      id: 'giratina',
      name: 'Giratina',
      badge: 'Renegade',
      x: 32,
      y: 26,
      dir: 'down',
      palette: {
        skin: '#71717a',
        hair: '#dc2626',
        shirt: '#18181b',
        pants: '#451a03',
        shoes: '#ca8a04',
      },
      lines: [
        'GIRATINA: "Gyaaa-shhhooo...!" 👻🌌',
        'Sang Naga Pemberontak (Renegade Pokémon) dari Dunia Distorsi berdiri dalam bayang-bayang promenade.',
        'Enam sayap hitam berhiaskan cakar merah keemasan mengepak dalam heningnya dimensi antimateri.',
        'Menurut legenda Sinnoh, Giratina diasingkan karena kekuatannya yang dahsyat, namun ia senantiasa menjaga keseimbangan dimensi di balik realitas dunia kita.',
      ],
      action: { kind: 'event', name: 'giratina' },
    },
    {
      id: 'palkia',
      name: 'Palkia',
      badge: 'Spatial',
      x: 32,
      y: 33,
      dir: 'down',
      palette: {
        skin: '#f5d0fe',
        hair: '#e879f9',
        shirt: '#ffffff',
        pants: '#c026d3',
        shoes: '#701a75',
      },
      lines: [
        'PALKIA: "Gyaaa-ooohhn...!" 🌌💧',
        'Sang Naga Ruang (Spatial Pokémon) berdiri anggun di pelataran timur Fountain Plaza.',
        'Mutiara di pundak Palkia memancarkan gelombang distorsi ruang (Spacial Rend) yang menembus batas dimensi.',
        'Menurut legenda Sinnoh, Palkia mengendalikan luas dan bentuk ruang di seluruh alam semesta, memungkinkannya berpindah ke dimensi mana pun dalam sekejap.',
      ],
      action: { kind: 'event', name: 'palkia' },
    },
    {
      id: 'dialga',
      name: 'Dialga',
      badge: 'Temporal',
      x: 39,
      y: 36,
      dir: 'down',
      palette: {
        skin: '#38bdf8',
        hair: '#0284c7',
        shirt: '#0f172a',
        pants: '#1e293b',
        shoes: '#0369a1',
      },
      lines: [
        'DIALGA: "Gugyugubah...!" ⏳🔷',
        'Sang Naga Waktu (Temporal Pokémon) berdiri kokoh di pelataran timur.',
        'Berlian di dadanya memancarkan gelombang distorsi waktu (Roar of Time) yang mengendalikan detak aliran waktu di seluruh semesta.',
        'Menurut legenda Sinnoh, waktu mulai mengalir saat Dialga lahir dari kehendak Arceus, menjadikannya pilar waktu yang abadi.',
      ],
      action: { kind: 'event', name: 'dialga' },
    },
  ];

  // 7. Social Signs at Café & East Quarter
  const signs: Sign[] = [
    {
      id: 'lookout-sign',
      name: 'Scenic Lookout',
      x: 39,
      y: 3,
      style: 'post',
      lines: [
        'SCENIC LOOKOUT POINT',
        'Overlooking the distant mountain ranges of Sinnoh.',
        '"High altitude clarity for high-performance edge vision architectures!"',
      ],
    },
    {
      id: 'ranger-sign',
      name: 'Ranger Notice',
      x: 41,
      y: 41,
      style: 'board',
      lines: [
        'RANGER ADVENTURE LOG',
        'Dex Tip: Tall grass at the southern edge of town contains 12 rare critters.',
        'Approach quietly, throw a Poké Ball, and build your ultimate collection!',
      ],
      action: { kind: 'open', target: 'dex' },
    },
    {
      id: 'hobby-sign',
      name: 'Off-Duty Board',
      x: 8,
      y: 34,
      style: 'board',
      lines: [
        "ZULFAN'S OFF-DUTY LOG",
        'When not training neural nets or architecting frontends:',
        '• Lo-fi beat production & indie synth tracks',
        '• Vintage handheld console modding & retro pixel art',
        '• Specialty pour-over coffee brewing & coastal cycling routes!',
      ],
    },
    {
      id: 'kiosk',
      name: 'Poké-Café Bar',
      x: 28,
      y: 51,
      style: 'post',
      lines: [
        'POKÉ-CAFÉ BARISTA STAND ☕',
        'Specialty roasts & Castelia Cones crafted fresh for devs & trainers!',
        '"Today\'s blend: Dark Roasted TypeScript with notes of React & zero runtime bugs!"',
      ],
      action: {
        kind: 'event',
        name: 'cafe-coffee',
      },
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      x: 36,
      y: 49,
      style: 'post',
      lines: ['LINKEDIN TABLE', 'Connect with Muhammad Zulfan on LinkedIn.'],
      action: {
        kind: 'navigate',
        route: 'https://www.linkedin.com/in/muhammad-zulfan-anggadhiputra',
        prompt: 'Open LinkedIn profile?',
      },
    },
    {
      id: 'resume',
      name: 'Résumé',
      x: 40,
      y: 49,
      style: 'post',
      lines: ['CURRICULUM VITAE TABLE', 'Verified latest CV in PDF format.'],
      action: {
        kind: 'navigate',
        route: '/cv/CV_Zulfan.pdf',
        prompt: 'Download verified CV?',
      },
    },
    {
      id: 'github',
      name: 'GitHub',
      x: 36,
      y: 53,
      style: 'post',
      lines: ['GITHUB REPOSITORY TABLE', 'Explore open-source code and AI projects at github.com/Zulfan15.'],
      action: {
        kind: 'navigate',
        route: 'https://github.com/Zulfan15',
        prompt: 'Visit GitHub profile?',
      },
    },
    {
      id: 'email',
      name: 'Email',
      x: 40,
      y: 53,
      style: 'post',
      lines: ['DIRECT DISPATCH TABLE', 'Email: zulfanangga2908@gmail.com', 'Open to software engineering and AI roles.'],
      action: {
        kind: 'navigate',
        route: 'mailto:zulfanangga2908@gmail.com',
        prompt: 'Send email to Zulfan?',
      },
    },
  ];

  // 8. Street Lamps
  const lamps: Lamp[] = [
    { x: 12, y: 14, radius: 46 }, // Manor courtyard NW
    { x: 20, y: 14, radius: 46 }, // Manor courtyard NE
    { x: 12, y: 18, radius: 46 }, // Manor courtyard SW
    { x: 20, y: 18, radius: 46 }, // Manor courtyard SE
    { x: 27, y: 11, radius: 50 }, // Lab compound entrance
    { x: 10, y: 28, radius: 48 }, // Home frontage
    { x: 11, y: 35, radius: 48 }, // Poké Center frontage
    { x: 9, y: 44, radius: 48 },  // West Plaza Tech Tower corner
    { x: 14, y: 44, radius: 48 }, // West Plaza East of Flowerbed
    { x: 9, y: 52, radius: 48 },  // West Plaza SW
    { x: 15, y: 52, radius: 48 }, // West Plaza SE
    { x: 25, y: 31, radius: 48 }, // Fountain Plaza West
    { x: 32, y: 31, radius: 48 }, // Fountain Plaza East
    { x: 28, y: 43, radius: 48 }, // Arcade entrance
    // Central Boulevard, Kiosk & Shifted Café Lamps
    { x: 19, y: 50, radius: 48 }, // Boulevard West
    { x: 25, y: 50, radius: 48 }, // Boulevard East (flanking kiosk approach)
    { x: 19, y: 55, radius: 50 }, // South Gate West
    { x: 25, y: 55, radius: 50 }, // South Gate East
    { x: 31, y: 49, radius: 48 }, // Promenade Lamp (between Kiosk & Café)
    { x: 31, y: 54, radius: 48 },
    { x: 42, y: 49, radius: 48 }, // Shifted Café East Lamp
    { x: 42, y: 54, radius: 48 },
    // East Promenade Street Lamps (STEP 3: X=34, Y=8, 16, 26, 35, 44)
    { x: 34, y: 8, radius: 48 },
    { x: 34, y: 16, radius: 48 },
    { x: 34, y: 26, radius: 48 },
    { x: 34, y: 35, radius: 48 },
    { x: 34, y: 44, radius: 48 },
    // East Quarter Lamps
    { x: 39, y: 5, radius: 48 },  // Lookout Point terrace
    { x: 38, y: 15, radius: 48 }, // Studio Villa gate
    { x: 28, y: 24, radius: 48 }, // Battle Arena entrance
    { x: 36, y: 21, radius: 48 }, // Berry Garden gate
    { x: 38, y: 28, radius: 48 }, // Contest Stage entrance
    { x: 37, y: 42, radius: 48 }, // Ranger Station lamp
    // West Seaside Boardwalk & Rest Plaza Lamps (Curb lamps along X: 5 and Gazebo approach at X: 10)
    { x: 5, y: 28, radius: 48 },  // Boardwalk North Curb
    { x: 5, y: 35, radius: 48 },  // Boardwalk Center Curb
    { x: 5, y: 42, radius: 48 },  // Boardwalk South Curb
    { x: 10, y: 34, radius: 48 }, // Gazebo Promenade Approach
  ];

  // 9. Doors Map & Collision Updates
  const doors = new Map<number, string>();
  for (const b of buildings) {
    for (const d of b.doors) {
      collision[idx(d.x, d.y)] = 0;
      doors.set(idx(d.x, d.y), b.route);
    }
  }

  // Ensure door step points are clear and walkable
  collision[idx(15, 11)] = 0; collision[idx(16, 11)] = 0; // Dev Center Doors
  collision[idx(15, 12)] = 0; collision[idx(16, 12)] = 0; // Dev Center Apron Step
  collision[idx(15, 26)] = 0; collision[idx(15, 27)] = 0; // Home Manor
  collision[idx(15, 34)] = 0; collision[idx(15, 35)] = 0; // Poké Center
  collision[idx(15, 42)] = 0; collision[idx(15, 43)] = 0; // Poké Mart
  collision[idx(27, 8)] = 0; collision[idx(27, 9)] = 0; // Research Lab
  collision[idx(32, 8)] = 0; collision[idx(32, 9)] = 0; // Observatory Annex
  collision[idx(28, 42)] = 0; collision[idx(28, 43)] = 0; // Arcade Left Door
  collision[idx(29, 42)] = 0; collision[idx(29, 43)] = 0; // Arcade Right Door
  collision[idx(38, 13)] = 0; collision[idx(38, 14)] = 0; // Studio Villa
  collision[idx(38, 15)] = 0;                             // Villa gate

  // Paved entryway directly leading to Tech Tower double doors
  ground[idx(5, 51)] = Tile.PATH;
  ground[idx(6, 51)] = Tile.PATH;
  ground[idx(5, 52)] = Tile.PATH;
  ground[idx(6, 52)] = Tile.PATH;
  collision[idx(5, 52)] = 0;
  collision[idx(6, 52)] = 0;

  // STEP 3: Ensure East Promenade (X: 34..35, Y: 6..54) is 100% straight and unobstructed
  for (let y = 6; y <= 54; y++) {
    collision[idx(34, y)] = 0;
    collision[idx(35, y)] = 0;
    ground[idx(34, y)] = Tile.PATH;
    ground[idx(35, y)] = Tile.PATH;
  }

  return {
    w,
    h,
    ground,
    collision,
    buildings,
    npcs,
    signs,
    lamps,
    props,
    doors,
    spawns: {
      town: { x: 21, y: 48, dir: 'down' },
      about: { x: 15, y: 27, dir: 'down' },
      home: { x: 15, y: 27, dir: 'down' },
      dev: { x: 16, y: 12, dir: 'down' },
      lab: { x: 27, y: 9, dir: 'down' },
      arcade: { x: 28, y: 43, dir: 'down' },
      reception: { x: 15, y: 35, dir: 'down' },
      mart: { x: 15, y: 43, dir: 'down' },
      shop: { x: 15, y: 43, dir: 'down' },
      tower: { x: 6, y: 52, dir: 'down' },
      office: { x: 6, y: 52, dir: 'down' },
      twin: { x: 25, y: 27, dir: 'up' },
    },
  };
}
