/**
 * Procedural Gen 4/5 Living Pokémon World Geography Generator (100x100 Overworld)
 * Shapes the natural outer biomes surrounding the preserved Town Core (X: 29..68, Y: 0..57):
 *  - West (X: 0..28): Crescent Coral Bay, Golden Beach, Wooden Pier, Coral Islet & Coastal Bluff
 *  - North-East (X: 69..97): 2-Tier Highland Cliff Terraces, Carved Stairs, Twin Waterfalls & Summit Shrine
 *  - South-East (X: 53..97): Mirror Lake, Sakura Sanctum Island, Bridges & Flower Meadows
 *  - South & South-West (X: 2..68, Y: 58..97): Winding Crystal River, 3 Bridges, One-Way Jump Ledges,
 *    Dense Pokémon Route Trees/Tall Grass, Hidden PokéBalls & Ancient Digi-Gate Sanctuary
 */
import { Tile, type Lamp, type Sign } from '../types';

export interface WorldDecoration {
  kind:
    | 'tree_oak'
    | 'tree_pine'
    | 'tree_sakura'
    | 'tree_palm'
    | 'tree_autumn'
    | 'tree_golden'
    | 'boulder'
    | 'sea_stack'
    | 'lily_pad'
    | 'reeds'
    | 'torii'
    | 'ruin_pillar'
    | 'bench'
    | 'picnic';
  x: number;
  y: number;
}

export interface HiddenPokeballItem {
  id: string;
  name: string;
  x: number;
  y: number;
  ballsReward: number;
  lore: string;
}

export const HIDDEN_POKEBALL_ITEMS: HiddenPokeballItem[] = [
  {
    id: 'loot_coral_islet',
    name: 'Mystic Coral Cache',
    x: 5,
    y: 48,
    ballsReward: 5,
    lore: 'Kamu menemukan 5× Dive/Poké Ball berkilau yang terdampar di Pulau Karang Barat!',
  },
  {
    id: 'loot_highland_summit',
    name: 'Sky Waterfall Relic',
    x: 91,
    y: 9,
    ballsReward: 5,
    lore: 'Kamu menemukan 5× Ultra/Poké Ball kuno di dekat mata air Air Terjun Kembar!',
  },
  {
    id: 'loot_sakura_island',
    name: 'Mirror Lake Treasure',
    x: 83,
    y: 61,
    ballsReward: 5,
    lore: 'Kamu menemukan 5× Cherish/Poké Ball di bawah naungan pohon Sakura Pulau Cermin!',
  },
  {
    id: 'loot_viridian_ledge',
    name: 'Ranger Ridge Supply',
    x: 16,
    y: 84,
    ballsReward: 5,
    lore: 'Kamu menemukan 5× Nest/Poké Ball milik Ranger di ujung tebing rute selatan!',
  },
];

export const SUMMIT_VISTA_POINT = {
  id: 'highland_vista',
  x: 85,
  y: 8,
  title: 'Highland Twin-Falls Overlook ⛰️✨',
  text: 'Dari puncak tebing timur ini, gemuruh Air Terjun Kembar mengalir jernih menuju Mirror Lake, melintasi jembatan batu kota hingga bermuara ke Teluk Karang di ufuk barat.',
};

export const FOUND_POKEBALLS_STORAGE_KEY = 'town:found_pokeballs_v1';

/**
 * Computes a per-tile elevation map used by the cliff renderer to know which side of each
 * cliff is the raised plateau and which side is the lower ground.
 *  1 = default ground level, 2 = Highland Tier 1 / Coastal Bluff top, 3 = Summit Tier 2,
 *  0 = sunken Ranger Ridge hollow.
 */
export function computeTownElevation(w: number, h: number, ground: Uint8Array): Int8Array {
  const elev = new Int8Array(w * h).fill(1);
  const isBarrier = (t: number) =>
    t === Tile.CLIFF || t === Tile.WATERFALL || t === Tile.CLIFF_STAIRS;

  const flood = (sx: number, sy: number, val: number) => {
    if (sx < 0 || sy < 0 || sx >= w || sy >= h) return;
    const start = sy * w + sx;
    if (isBarrier(ground[start])) return;
    const seen = new Uint8Array(w * h);
    const stack = [start];
    const filled: number[] = [];
    seen[start] = 1;
    while (stack.length > 0) {
      const i = stack.pop()!;
      filled.push(i);
      if (filled.length > 2500) return; // Leak guard: region is not enclosed, skip
      const x = i % w;
      const y = (i / w) | 0;
      const nbs = [
        x > 0 ? i - 1 : -1,
        x < w - 1 ? i + 1 : -1,
        y > 0 ? i - w : -1,
        y < h - 1 ? i + w : -1,
      ];
      for (const ni of nbs) {
        if (ni < 0 || seen[ni] || isBarrier(ground[ni])) continue;
        seen[ni] = 1;
        stack.push(ni);
      }
    }
    for (const i of filled) elev[i] = val;
  };

  flood(85, 30, 2); // Highland Tier 1 plateau
  flood(85, 12, 3); // Summit Tier 2 sanctuary

  // Coastal Bluff Terrace: Town promenade side (east of bluff, Y: 30..53) sits on raised coastal terrace
  for (let y = 30; y <= 53 && y < h; y++) {
    const bx = y < 35 ? 23 : y < 43 ? 24 : y < 51 ? 23 : 24;
    for (let x = bx + 2; x <= 28 && x < w; x++) {
      if (!isBarrier(ground[y * w + x])) elev[y * w + x] = 2;
    }
  }

  return elev;
}

export function getFoundHiddenPokeballs(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try {
    const raw = window.localStorage.getItem(FOUND_POKEBALLS_STORAGE_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? new Set(parsed.filter((x): x is string => typeof x === 'string')) : new Set();
  } catch {
    return new Set();
  }
}

export function markHiddenPokeballFound(id: string): void {
  if (typeof window === 'undefined') return;
  try {
    const cur = getFoundHiddenPokeballs();
    cur.add(id);
    window.localStorage.setItem(FOUND_POKEBALLS_STORAGE_KEY, JSON.stringify([...cur]));
  } catch {
    // ignore storage quota errors
  }
}

/**
 * Computes the curved West Coast shoreline X coordinate for a given Y (0..66).
 */
export function getWestCoastWaterEdgeX(y: number): number {
  if (y > 65) return -1;
  if (y >= 60) {
    // Taper smoothly into western forest cape below river mouth
    return Math.max(2, Math.round(10 - (y - 59) * 1.6));
  }
  return Math.round(10.5 + Math.sin(y * 0.11) * 2.4 + Math.cos(y * 0.05) * 1.2);
}

/**
 * Computes the center Y coordinate of the Winding Southern River for X in [8..75].
 */
export function getSouthRiverCenterY(x: number): number {
  return Math.round(71.5 + Math.sin((x - 10) * 0.105) * 2.3);
}

/**
 * Returns true if (x, y) is inside the untouched Town Core rectangle.
 */
export function isInsideTownCore(x: number, y: number): boolean {
  return x >= 29 && x <= 68 && y >= 0 && y <= 57;
}

export interface GeneratedWorldFeatures {
  decorations: WorldDecoration[];
  extraSigns: Sign[];
  extraLamps: Lamp[];
}

/**
 * Sculpts all outer biomes onto `ground` and `collision` arrays of the 100x100 TownMap,
 * and returns deterministic environmental decorations, signs, and lamps.
 */
export function applyLivingWorldGeography(
  w: number,
  h: number,
  ground: Uint8Array,
  collision: Uint8Array
): GeneratedWorldFeatures {
  const idx = (x: number, y: number) => y * w + x;
  const inBounds = (x: number, y: number) => x >= 0 && x < w && y >= 0 && y < h;

  const setTile = (x: number, y: number, tile: number, solid: boolean, allowCore = false) => {
    if (!inBounds(x, y)) return;
    if (!allowCore && isInsideTownCore(x, y)) return;
    ground[idx(x, y)] = tile;
    collision[idx(x, y)] = solid ? 1 : 0;
  };

  const fillRect = (
    x0: number,
    y0: number,
    rw: number,
    rh: number,
    tile: number,
    solid: boolean,
    allowCore = false
  ) => {
    for (let y = y0; y < y0 + rh; y++) {
      for (let x = x0; x < x0 + rw; x++) {
        setTile(x, y, tile, solid, allowCore);
      }
    }
  };

  // =========================================================================
  // 1. WEST ZONE: CRESCENT CORAL BAY, GOLDEN BEACH, PIER & COASTAL BLUFF
  // =========================================================================
  for (let y = 0; y <= 65; y++) {
    const waterEdge = getWestCoastWaterEdgeX(y);
    const shallowEdge = waterEdge + 2;
    const sandEdge = shallowEdge + 4 + Math.round(Math.sin(y * 0.17) * 1);

    for (let x = 0; x <= Math.min(28, sandEdge); x++) {
      if (x <= waterEdge) {
        setTile(x, y, Tile.WATER, true);
      } else if (x <= shallowEdge) {
        setTile(x, y, Tile.SHALLOW_WATER, true);
      } else if (y >= 2 && y <= 62) {
        setTile(x, y, Tile.SAND, false);
      }
    }
  }

  // Offshore Coral Treasure Islet (X: 3..7, Y: 46..51 — reachable by PokéRide Surf/Fly!)
  for (let y = 45; y <= 52; y++) {
    for (let x = 2; x <= 8; x++) {
      const dist = Math.hypot((x - 5) / 2.8, (y - 48.5) / 3.2);
      if (dist <= 0.82) {
        setTile(x, y, Tile.SAND, false);
      } else if (dist <= 1.18) {
        setTile(x, y, Tile.SHALLOW_WATER, true);
      }
    }
  }

  // Wooden Fishing & Sunset Pier jutting out over Crescent Bay (X: 7..16, Y: 36..37)
  fillRect(7, 36, 10, 2, Tile.BRIDGE, false);
  // Cobblestone beach boardwalk connecting Pier to West Coastal Stairs
  fillRect(17, 36, 6, 2, Tile.PATH, false);
  fillRect(19, 27, 10, 2, Tile.PATH, false);
  fillRect(19, 27, 2, 24, Tile.PATH, false);
  fillRect(19, 49, 10, 2, Tile.PATH, false);

  // Enclosed Coastal Cliff Bluff Terrace framing West side of Town Core (X: 23..28, Y: 29..55)
  // Top rim at Y=29, undulating 2-tile West rock flank, and 2-tile tall South cliff face at Y=54..55!
  for (let x = 23; x <= 28; x++) {
    setTile(x, 29, Tile.CLIFF, true);
  }
  for (let y = 30; y <= 53; y++) {
    const cliffX = y < 35 ? 23 : y < 43 ? 24 : y < 51 ? 23 : 24;
    setTile(cliffX, y, Tile.CLIFF, true);
    setTile(cliffX + 1, y, Tile.CLIFF, true);
  }
  fillRect(24, 54, 5, 2, Tile.CLIFF, true);

  // Carved Stone Staircases piercing the Coastal Bluff at Y=36..37 & Y=49..50 (clear of Telescope & Berry Tree!)
  fillRect(23, 36, 3, 2, Tile.CLIFF_STAIRS, false);
  fillRect(23, 49, 3, 2, Tile.CLIFF_STAIRS, false);
  fillRect(16, 36, 7, 2, Tile.PATH, false);
  fillRect(26, 36, 3, 2, Tile.PATH, false);
  fillRect(20, 49, 3, 2, Tile.PATH, false);
  fillRect(26, 49, 3, 2, Tile.PATH, false);

  // =========================================================================
  // 2. NORTH-EAST ZONE: ORGANIC 2-TIER HIGHLAND CLIFFS & TWIN WATERFALLS
  // =========================================================================
  // Tier 1 Stepped North Rim (Y=3..5), Undulating West Flank (X=71..74) & East Flank (X=94..96)
  for (let x = 73; x <= 95; x++) {
    const topY = x >= 79 && x <= 91 ? 3 : x >= 75 && x <= 93 ? 4 : 5;
    setTile(x, topY, Tile.CLIFF, true);
    if (topY === 3 && (x === 79 || x === 91)) setTile(x, 4, Tile.CLIFF, true);
    if (topY === 4 && (x === 75 || x === 93)) setTile(x, 5, Tile.CLIFF, true);
  }
  for (let y = 5; y <= 42; y++) {
    const westFaceX = y < 10 ? 73 : y < 18 ? 72 : y < 29 ? 71 : y < 37 ? 72 : 73;
    setTile(westFaceX, y, Tile.CLIFF, true);
    setTile(westFaceX + 1, y, Tile.CLIFF, true);
    if (y === 10 || y === 18 || y === 29 || y === 37) {
      setTile(westFaceX + 2, y, Tile.CLIFF, true);
    }

    const eastFaceX = y < 12 ? 94 : y < 31 ? 95 : 94;
    setTile(eastFaceX, y, Tile.CLIFF, true);
    setTile(eastFaceX + 1, y, Tile.CLIFF, true);
    if (y === 12 || y === 31) {
      setTile(94, y, Tile.CLIFF, true);
    }
  }
  // Tier 1 Monumental South Rock Face (2-to-3 tiles tall at Y=40..42 for dramatic mountain height!)
  for (let x = 73; x <= 95; x++) {
    if ((x >= 73 && x <= 75) || (x >= 83 && x <= 87) || (x >= 92 && x <= 95)) {
      setTile(x, 40, Tile.CLIFF, true);
    }
    setTile(x, 41, Tile.CLIFF, true);
    setTile(x, 42, Tile.CLIFF, true);
  }

  // Tier 1 Carved Stone Stairs: West Entrance (X: 71..72, Y: 25..26) & South Entrance (X: 76..78, Y: 41..42)
  fillRect(69, 25, 2, 2, Tile.PATH, false);
  fillRect(71, 25, 2, 2, Tile.CLIFF_STAIRS, false);
  fillRect(73, 25, 16, 2, Tile.PATH, false);
  fillRect(76, 41, 3, 2, Tile.CLIFF_STAIRS, false);
  fillRect(76, 27, 2, 14, Tile.PATH, false);

  // Tier 2 Summit Sanctuary Crowned Mesa (X: 78..93, Y: 6..20 with rounded natural corners!)
  for (let y = 7; y <= 19; y++) {
    const lx = y <= 7 ? 79 : 78;
    const rx = y <= 7 ? 92 : 93;
    setTile(lx, y, Tile.CLIFF, true);
    setTile(rx, y, Tile.CLIFF, true);
  }
  for (let x = 79; x <= 92; x++) {
    const ny = x >= 82 && x <= 89 ? 6 : 7;
    setTile(x, ny, Tile.CLIFF, true);
    if (ny === 6 && (x === 82 || x === 89)) setTile(x, 7, Tile.CLIFF, true);
  }
  for (let x = 78; x <= 93; x++) {
    if (x === 78 || x === 93) {
      setTile(x, 19, Tile.CLIFF, true);
    } else {
      setTile(x, 19, Tile.CLIFF, true);
      setTile(x, 20, Tile.CLIFF, true);
    }
  }
  // Summit Sacred Stone Plaza & Central Stairs (X: 84..86, Y: 19..20)
  fillRect(83, 8, 6, 8, Tile.PLAZA, false);
  fillRect(84, 19, 3, 2, Tile.CLIFF_STAIRS, false);
  fillRect(84, 21, 3, 6, Tile.PATH, false);

  // Twin Mountain Springs, Upper Streams & Cascading Waterfalls (X: 80..81 and X: 89..90)
  // Left Spring & Chute
  fillRect(80, 10, 2, 9, Tile.WATER, true);
  fillRect(80, 19, 2, 2, Tile.WATERFALL, true);
  fillRect(80, 21, 2, 20, Tile.WATER, true);
  fillRect(80, 41, 2, 2, Tile.WATERFALL, true);

  // Right Spring & Chute
  fillRect(89, 10, 2, 9, Tile.WATER, true);
  fillRect(89, 19, 2, 2, Tile.WATERFALL, true);
  fillRect(89, 21, 2, 20, Tile.WATER, true);
  fillRect(89, 41, 2, 2, Tile.WATERFALL, true);

  // Rustic Wooden Bridges on Tier 1 crossing the two waterfall streams at Y=25..26!
  fillRect(80, 25, 2, 2, Tile.BRIDGE, false);
  fillRect(89, 25, 2, 2, Tile.BRIDGE, false);
  fillRect(91, 25, 3, 2, Tile.PATH, false);

  // =========================================================================
  // 3. SOUTH-EAST ZONE: PLUNGE POOL, MIRROR LAKE & SAKURA ISLAND
  // =========================================================================
  // Plunge Pool beneath Twin Waterfalls (X: 79..91, Y: 43..50) flowing into Mirror Lake
  for (let y = 43; y <= 51; y++) {
    for (let x = 79; x <= 91; x++) {
      const edge = x === 79 || x === 91 || (y === 43 && x !== 80 && x !== 81 && x !== 89 && x !== 90);
      setTile(x, y, edge ? Tile.SHALLOW_WATER : Tile.WATER, true);
    }
  }

  // Mirror Lake Oval Basin (center ~83, 61, rx=10.5, ry=11.5)
  for (let y = 49; y <= 73; y++) {
    for (let x = 71; x <= 94; x++) {
      const d = Math.hypot((x - 83) / 10.8, (y - 61) / 11.5);
      if (d <= 0.84) {
        setTile(x, y, Tile.WATER, true);
      } else if (d <= 1.0) {
        setTile(x, y, Tile.SHALLOW_WATER, true);
      } else if (d <= 1.12 && ground[idx(x, y)] === Tile.GRASS) {
        setTile(x, y, Tile.SAND, false);
      }
    }
  }

  // Sakura Sanctum Island in the center of Mirror Lake (X: 80..86, Y: 58..64)
  for (let y = 58; y <= 64; y++) {
    for (let x = 80; x <= 86; x++) {
      const d = Math.hypot((x - 83) / 3.4, (y - 61) / 3.4);
      if (d <= 0.95) {
        setTile(x, y, Tile.GRASS, false);
      } else if (d <= 1.2) {
        setTile(x, y, Tile.SHALLOW_WATER, true);
      }
    }
  }
  fillRect(82, 60, 3, 3, Tile.PLAZA, false);

  // Arched Wooden Bridge from West Lake Shore to Sakura Island (X: 72..80, Y: 60..61)
  fillRect(72, 60, 9, 2, Tile.BRIDGE, false);

  // Scenic Lake Promenade Trail connecting Town Café Patio (X:68, Y:55) -> Mirror Lake Bridge -> South Route
  fillRect(69, 55, 5, 2, Tile.PATH, false);
  fillRect(70, 55, 2, 7, Tile.PATH, false);
  fillRect(63, 60, 9, 2, Tile.PATH, false);
  fillRect(63, 60, 3, 22, Tile.PATH, false);

  // =========================================================================
  // 4. WINDING SOUTHERN CRYSTAL RIVER & 3 ICONIC BRIDGES
  // =========================================================================
  for (let x = 8; x <= 75; x++) {
    const cy = getSouthRiverCenterY(x);
    setTile(x, cy - 2, Tile.SHALLOW_WATER, true);
    setTile(x, cy - 1, Tile.WATER, true);
    setTile(x, cy, Tile.WATER, true);
    setTile(x, cy + 1, Tile.WATER, true);
    setTile(x, cy + 2, Tile.SHALLOW_WATER, true);
  }

  // Bridge 1: West Coastal Timber Bridge (X: 21..23)
  {
    const cy = getSouthRiverCenterY(22);
    fillRect(21, cy - 3, 3, 7, Tile.BRIDGE, false);
    fillRect(21, 56, 3, cy - 58, Tile.PATH, false);
    fillRect(21, cy + 4, 3, 82 - (cy + 4), Tile.PATH, false);
  }

  // Bridge 2: Grand Central Boulevard Stone Arch Bridge (X: 46..49, carrying Main Digi-Gate Avenue!)
  fillRect(46, 58, 4, 37, Tile.PATH, false);
  {
    const cy = getSouthRiverCenterY(47);
    fillRect(46, cy - 3, 4, 7, Tile.BRIDGE, false);
  }

  // Bridge 3: East Botanical Timber Bridge (X: 63..65)
  {
    const cy = getSouthRiverCenterY(64);
    fillRect(63, cy - 3, 3, 7, Tile.BRIDGE, false);
  }

  // Winding Southern Adventure Trails connecting West, Center, and East bridges
  fillRect(21, 56, 8, 2, Tile.PATH, false); // Links West Stairs/Fountain gate to West Bridge trail
  fillRect(32, 58, 2, 7, Tile.PATH, false);  // Links West Fountain South Gate to Route
  fillRect(32, 63, 15, 2, Tile.PATH, false);
  fillRect(21, 82, 26, 2, Tile.PATH, false); // Lower South-West Adventure Trail to Central Boulevard
  fillRect(49, 82, 17, 2, Tile.PATH, false); // Lower South-East Adventure Trail to Central Boulevard

  // =========================================================================
  // 5. ANCIENT DIGI-WORLD SANCTUARY RUINS (X: 42..54, Y: 89..96)
  // =========================================================================
  fillRect(43, 90, 10, 7, Tile.PLAZA, false);
  fillRect(46, 88, 4, 9, Tile.PATH, false);

  // =========================================================================
  // 6. POKÉMON ONE-WAY JUMP LEDGES & ORGANIC TALL GRASS POCKETS
  // =========================================================================
  // South-West Ledge Terraces (Jump South for fast shortcut, or walk West/East path around!)
  for (let x = 25; x <= 43; x++) {
    if (x >= 31 && x <= 34) continue; // Gap for footpath
    setTile(x, 61, Tile.LEDGE, true);
  }
  for (let x = 14; x <= 43; x++) {
    if (x >= 20 && x <= 24) continue; // Gap for West Bridge road
    setTile(x, 78, Tile.LEDGE, true);
  }
  for (let x = 13; x <= 41; x++) {
    if (x >= 26 && x <= 29) continue; // Winding grass pass
    setTile(x, 86, Tile.LEDGE, true);
  }

  // Sculpted 3D Ranger Rock Outcrop sheltering the Hidden PokéBall Cove at South-West (X: 11..19, Y: 80..85)
  fillRect(11, 80, 9, 2, Tile.CLIFF, true);
  fillRect(11, 82, 2, 4, Tile.CLIFF, true);

  // South-East Ledge Terraces (X: 52..76)
  for (let x = 52; x <= 61; x++) {
    setTile(x, 64, Tile.LEDGE, true);
  }
  for (let x = 52; x <= 75; x++) {
    if (x >= 62 && x <= 66) continue; // Gap for East Bridge road
    setTile(x, 79, Tile.LEDGE, true);
  }
  for (let x = 54; x <= 78; x++) {
    if (x >= 65 && x <= 68) continue;
    setTile(x, 88, Tile.LEDGE, true);
  }

  // Organic Wild Pokémon Tall Grass Clusters (Critterdex Encounter Zones!)
  const tallGrassBlobs = [
    { cx: 18, cy: 16, rx: 3.5, ry: 2.8 }, // North-West Coastal Meadow
    { cx: 28, cy: 66, rx: 4.2, ry: 2.2 }, // Riverbank North-West
    { cx: 37, cy: 80, rx: 4.5, ry: 2.0 }, // South-West Ledge Meadow
    { cx: 34, cy: 92, rx: 5.5, ry: 2.6 }, // West Digi-Gate Reserve
    { cx: 60, cy: 92, rx: 5.5, ry: 2.6 }, // East Digi-Gate Reserve
    { cx: 57, cy: 67, rx: 3.8, ry: 2.2 }, // East Riverbank
    { cx: 73, cy: 84, rx: 4.8, ry: 2.5 }, // South-East Botanical Wilds
    { cx: 86, cy: 82, rx: 4.5, ry: 3.0 }, // Deep South-East Woods
    { cx: 85, cy: 33, rx: 3.5, ry: 2.4 }, // Tier 1 Highland Plateau Grass
  ];

  for (const blob of tallGrassBlobs) {
    const minY = Math.floor(blob.cy - blob.ry - 1);
    const maxY = Math.ceil(blob.cy + blob.ry + 1);
    const minX = Math.floor(blob.cx - blob.rx - 1);
    const maxX = Math.ceil(blob.cx + blob.rx + 1);
    for (let y = minY; y <= maxY; y++) {
      for (let x = minX; x <= maxX; x++) {
        if (!inBounds(x, y) || isInsideTownCore(x, y)) continue;
        if (ground[idx(x, y)] !== Tile.GRASS) continue;
        const d = Math.hypot((x - blob.cx) / blob.rx, (y - blob.cy) / blob.ry);
        if (d <= 1.0) {
          setTile(x, y, Tile.TALL, false);
        }
      }
    }
  }

  // =========================================================================
  // 7. WILDFLOWER MEADOW PATCHES (Tile.FLOWER)
  // =========================================================================
  const flowerPatches = [
    { cx: 23, cy: 10, rx: 3.2, ry: 2.2 },
    { cx: 24, cy: 22, rx: 2.8, ry: 2.0 },
    { cx: 76, cy: 14, rx: 2.4, ry: 2.4 },
    { cx: 92, cy: 28, rx: 2.4, ry: 3.0 },
    { cx: 68, cy: 64, rx: 2.8, ry: 2.2 },
    { cx: 90, cy: 74, rx: 3.5, ry: 2.5 },
    { cx: 25, cy: 90, rx: 3.5, ry: 2.2 },
    { cx: 72, cy: 92, rx: 4.0, ry: 2.2 },
  ];
  for (const fp of flowerPatches) {
    for (let y = Math.floor(fp.cy - fp.ry); y <= Math.ceil(fp.cy + fp.ry); y++) {
      for (let x = Math.floor(fp.cx - fp.rx); x <= Math.ceil(fp.cx + fp.rx); x++) {
        if (!inBounds(x, y) || isInsideTownCore(x, y)) continue;
        if (ground[idx(x, y)] !== Tile.GRASS) continue;
        if (Math.hypot((x - fp.cx) / fp.rx, (y - fp.cy) / fp.ry) <= 1.0) {
          setTile(x, y, Tile.FLOWER, false);
        }
      }
    }
  }

  // =========================================================================
  // 8. RE-ENFORCE OUTER 100x100 PERIMETER BORDER SO NO GAPS EXIST
  // =========================================================================
  for (let x = 14; x < w; x++) {
    if (!isInsideTownCore(x, 0)) setTile(x, 0, Tile.TREE, true);
    if (!isInsideTownCore(x, 1)) setTile(x, 1, Tile.TREE, true);
  }
  for (let y = 63; y < h; y++) {
    setTile(0, y, Tile.TREE, true);
    setTile(1, y, Tile.TREE, true);
  }
  for (let y = 0; y < h; y++) {
    setTile(w - 2, y, Tile.TREE, true);
    setTile(w - 1, y, Tile.TREE, true);
  }
  for (let x = 0; x < w; x++) {
    setTile(x, h - 2, Tile.TREE, true);
    setTile(x, h - 1, Tile.TREE, true);
  }

  // =========================================================================
  // 9. DENSE HANDCRAFTED POKÉMON ROUTE DECORATIONS, SIGNS & LAMPS
  // =========================================================================
  const decorations: WorldDecoration[] = [
    // Summit Shrine & Highland Landmarks
    { kind: 'torii', x: 85, y: 16 },
    { kind: 'tree_golden', x: 81, y: 7 },
    { kind: 'tree_golden', x: 88, y: 7 },
    { kind: 'tree_pine', x: 75, y: 7 },
    { kind: 'tree_pine', x: 75, y: 12 },
    { kind: 'tree_pine', x: 75, y: 31 },
    { kind: 'tree_pine', x: 75, y: 36 },
    { kind: 'tree_pine', x: 84, y: 30 },
    { kind: 'tree_pine', x: 92, y: 12 },
    { kind: 'tree_pine', x: 92, y: 22 },
    { kind: 'tree_pine', x: 92, y: 35 },
    { kind: 'boulder', x: 77, y: 22 },
    { kind: 'boulder', x: 91, y: 39 },

    // Beach Palms, Coastal Sea-Stacks & Coral Islet
    { kind: 'sea_stack', x: 4, y: 8 },
    { kind: 'sea_stack', x: 6, y: 19 },
    { kind: 'sea_stack', x: 3, y: 30 },
    { kind: 'sea_stack', x: 5, y: 56 },
    { kind: 'tree_palm', x: 16, y: 8 },
    { kind: 'tree_palm', x: 17, y: 19 },
    { kind: 'tree_palm', x: 16, y: 29 },
    { kind: 'tree_palm', x: 16, y: 42 },
    { kind: 'tree_palm', x: 15, y: 52 },
    { kind: 'tree_palm', x: 4, y: 46 }, // On Coral Islet!
    { kind: 'bench', x: 20, y: 34 },
    { kind: 'picnic', x: 16, y: 46 },

    // Mirror Lake, Sakura Island & Botanical South-East
    { kind: 'tree_sakura', x: 81, y: 59 }, // On Sakura Island!
    { kind: 'tree_sakura', x: 84, y: 59 },
    { kind: 'tree_sakura', x: 68, y: 51 },
    { kind: 'tree_sakura', x: 93, y: 52 },
    { kind: 'tree_autumn', x: 69, y: 69 },
    { kind: 'tree_autumn', x: 92, y: 69 },
    { kind: 'tree_autumn', x: 80, y: 78 },
    { kind: 'tree_autumn', x: 91, y: 80 },
    { kind: 'lily_pad', x: 76, y: 55 },
    { kind: 'lily_pad', x: 88, y: 56 },
    { kind: 'lily_pad', x: 77, y: 66 },
    { kind: 'lily_pad', x: 89, y: 65 },
    { kind: 'reeds', x: 73, y: 53 },
    { kind: 'reeds', x: 92, y: 63 },
    { kind: 'reeds', x: 75, y: 70 },
    { kind: 'picnic', x: 67, y: 58 },
    { kind: 'bench', x: 67, y: 62 },

    // Ancient Digi-Gate Sanctuary Pillars
    { kind: 'ruin_pillar', x: 43, y: 90 },
    { kind: 'ruin_pillar', x: 51, y: 90 },
    { kind: 'ruin_pillar', x: 43, y: 94 },
    { kind: 'ruin_pillar', x: 51, y: 94 },
    { kind: 'tree_golden', x: 40, y: 90 },
    { kind: 'tree_golden', x: 54, y: 90 },
  ];

  // Deterministic Dense Route Woodland Clusters along West Meadow, South-West & South-East Routes
  const candidateTreeSpots: Array<{ x: number; y: number; kind: WorldDecoration['kind'] }> = [
    // North-West Coastal Woods
    { x: 20, y: 4, kind: 'tree_oak' },
    { x: 25, y: 5, kind: 'tree_pine' },
    { x: 21, y: 13, kind: 'tree_oak' },
    { x: 26, y: 15, kind: 'tree_oak' },
    { x: 21, y: 22, kind: 'tree_sakura' },
    { x: 26, y: 23, kind: 'tree_oak' },
    // South-West Viridian Route Woods
    { x: 6, y: 64, kind: 'tree_pine' },
    { x: 10, y: 63, kind: 'tree_oak' },
    { x: 15, y: 60, kind: 'tree_oak' },
    { x: 16, y: 65, kind: 'tree_pine' },
    { x: 38, y: 64, kind: 'tree_oak' },
    { x: 42, y: 64, kind: 'tree_sakura' },
    { x: 6, y: 77, kind: 'tree_pine' },
    { x: 10, y: 80, kind: 'tree_oak' },
    { x: 6, y: 85, kind: 'tree_pine' },
    { x: 10, y: 88, kind: 'tree_oak' },
    { x: 15, y: 90, kind: 'tree_pine' },
    { x: 20, y: 92, kind: 'tree_oak' },
    { x: 28, y: 84, kind: 'tree_oak' },
    { x: 42, y: 84, kind: 'tree_sakura' },
    // South-East Woodland Groves
    { x: 54, y: 60, kind: 'tree_oak' },
    { x: 58, y: 60, kind: 'tree_sakura' },
    { x: 54, y: 76, kind: 'tree_oak' },
    { x: 59, y: 84, kind: 'tree_autumn' },
    { x: 68, y: 85, kind: 'tree_oak' },
    { x: 78, y: 89, kind: 'tree_pine' },
    { x: 84, y: 91, kind: 'tree_oak' },
    { x: 91, y: 88, kind: 'tree_pine' },
    { x: 93, y: 93, kind: 'tree_oak' },
    { x: 94, y: 46, kind: 'tree_pine' },
  ];

  const occupiedLoot = new Set(HIDDEN_POKEBALL_ITEMS.map((i) => `${i.x},${i.y}`));

  for (const spot of candidateTreeSpots) {
    if (isInsideTownCore(spot.x, spot.y) || isInsideTownCore(spot.x + 1, spot.y + 1)) continue;
    let clear = true;
    for (let dy = 0; dy < 2; dy++) {
      for (let dx = 0; dx < 2; dx++) {
        const tx = spot.x + dx;
        const ty = spot.y + dy;
        if (!inBounds(tx, ty) || ground[idx(tx, ty)] !== Tile.GRASS || collision[idx(tx, ty)] !== 0) {
          clear = false;
        }
        if (occupiedLoot.has(`${tx},${ty}`)) clear = false;
      }
    }
    if (clear) {
      decorations.push(spot);
      // Trunk collision on bottom row of 2x2 tree
      collision[idx(spot.x, spot.y + 1)] = 1;
      collision[idx(spot.x + 1, spot.y + 1)] = 1;
    }
  }

  // Solidify boulders, torii posts, and ruin pillars
  for (const dec of decorations) {
    if (dec.kind === 'boulder' || dec.kind === 'ruin_pillar') {
      if (inBounds(dec.x, dec.y)) collision[idx(dec.x, dec.y)] = 1;
    } else if (dec.kind === 'torii') {
      if (inBounds(dec.x - 1, dec.y)) collision[idx(dec.x - 1, dec.y)] = 1;
      if (inBounds(dec.x + 1, dec.y)) collision[idx(dec.x + 1, dec.y)] = 1;
    } else if (dec.kind === 'tree_palm' || dec.kind === 'tree_pine' || dec.kind === 'tree_sakura' || dec.kind === 'tree_autumn' || dec.kind === 'tree_golden') {
      if (inBounds(dec.x, dec.y + 1) && !isInsideTownCore(dec.x, dec.y + 1)) {
        collision[idx(dec.x, dec.y + 1)] = 1;
      }
    }
  }

  // Mark Hidden PokéBalls as solid interactable tiles on ground (unless already collected at runtime)
  for (const item of HIDDEN_POKEBALL_ITEMS) {
    if (inBounds(item.x, item.y)) {
      collision[idx(item.x, item.y)] = 1;
    }
  }

  const extraSigns: Sign[] = [
    {
      id: 'sign_coral_pier',
      name: 'Crescent Coral Pier',
      x: 18,
      y: 35,
      style: 'post',
      lines: [
        'CRESCENT CORAL PIER & GOLDEN BEACH 🏖️',
        'West: Wooden Sunset Pier & Offshore Coral Islet (Use PokéRide Surf/Sky!).',
        'East Stairs: Climb up to Zulfan Town Seaside Promenade.',
      ],
    },
    {
      id: 'sign_highland_trail',
      name: 'Highland Twin-Falls Trail',
      x: 70,
      y: 24,
      style: 'board',
      lines: [
        'MT. CORONET HIGHLAND TRAIL ⛰️💧',
        'Climb the carved limestone stairs to reach the Twin Cascading Waterfalls & Sky Shrine Overlook!',
      ],
    },
    {
      id: 'sign_mirror_lake',
      name: 'Mirror Lake & Sakura Island',
      x: 70,
      y: 59,
      style: 'post',
      lines: [
        'MIRROR LAKE & SAKURA SANCTUM  🌸🏞️',
        'Cross the arched timber footbridge to rest beneath the island cherry blossoms.',
      ],
    },
    {
      id: 'sign_south_bridge',
      name: 'Route 201 & Crystal Bridge',
      x: 45,
      y: 66,
      style: 'board',
      lines: [
        'CRYSTAL ARCH BRIDGE — SOUTH ROUTE 🌉',
        'South: Ancient Digi-World Sanctuary Portal (48, 96).',
        'Tip: Hop down grassy Ledges (↓) for a classic Pokémon shortcut!',
      ],
    },
  ];

  for (const s of extraSigns) {
    if (inBounds(s.x, s.y)) collision[idx(s.x, s.y)] = 1;
  }

  const extraLamps: Lamp[] = [
    { x: 16, y: 35, radius: 50, color: 'warm' },
    { x: 8, y: 36, radius: 52, color: 'amber' },
    { x: 20, y: 26, radius: 46, color: 'warm' },
    { x: 20, y: 48, radius: 46, color: 'warm' },
    { x: 71, y: 24, radius: 48, color: 'warm' },
    { x: 79, y: 24, radius: 48, color: 'warm' },
    { x: 88, y: 24, radius: 48, color: 'warm' },
    { x: 83, y: 17, radius: 52, color: 'gold' },
    { x: 87, y: 17, radius: 52, color: 'gold' },
    { x: 71, y: 59, radius: 48, color: 'warm' },
    { x: 81, y: 61, radius: 50, color: 'magenta' },
    { x: 45, y: 67, radius: 50, color: 'warm' },
    { x: 50, y: 67, radius: 50, color: 'warm' },
    { x: 45, y: 76, radius: 50, color: 'warm' },
    { x: 50, y: 76, radius: 50, color: 'warm' },
    { x: 20, y: 67, radius: 46, color: 'warm' },
    { x: 66, y: 67, radius: 46, color: 'warm' },
    { x: 44, y: 90, radius: 54, color: 'cyan' },
    { x: 51, y: 90, radius: 54, color: 'cyan' },
  ];

  return { decorations, extraSigns, extraLamps };
}
