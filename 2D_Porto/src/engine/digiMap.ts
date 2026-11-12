import { Tile, type Dir, type Lamp, type Sign, type TownData, type TownMap } from './types';

export const DIGI_COLS = 40;
export const DIGI_ROWS = 45;

export const DIGI_SPAWN = {
  x: 20,
  y: 6,
  dir: 'down' as Dir,
};

export const DIGI_RETURN_GATE = {
  xMin: 19,
  xMax: 21,
  yMin: 3,
  yMax: 4,
  terraceXMin: 18,
  terraceXMax: 22,
  terraceYMin: 3,
  terraceYMax: 6,
} as const;

export const DIGI_PLAZA_CONSOLE = {
  id: 'digidex-console',
  x: 19,
  y: 20,
  w: 2,
  h: 2,
} as const;

export const DIGI_ZONES = {
  flameDragon: { id: 'flame-dragon', name: 'Flame & Dragon Canyon', xMin: 4, xMax: 16, yMin: 7, yMax: 17 },
  cyberSteel: { id: 'cyber-steel', name: 'Cyber & Steel Dome', xMin: 24, xMax: 36, yMin: 7, yMax: 17 },
  aquaCryo: { id: 'aqua-cryo', name: 'Aqua & Cryo Bay', xMin: 4, xMax: 16, yMin: 27, yMax: 38 },
  verdantHoly: { id: 'verdant-holy', name: 'Verdant & Holy Sanctuary', xMin: 24, xMax: 36, yMin: 27, yMax: 38 },
  plaza: { id: 'digi-plaza', name: 'Central Digi-Plaza', xMin: 15, xMax: 25, yMin: 18, yMax: 26 },
} as const;

/**
 * Generates the collision, door warp, interactive sign, and lighting map
 * for Digi-Sanctuary Island (/digimon) — 40x45 tiles, zero hardcoded Digimon.
 */
export function createDigiMap(_data: TownData): TownMap {
  const w = DIGI_COLS;
  const h = DIGI_ROWS;
  const ground = new Uint8Array(w * h);
  const collision = new Uint8Array(w * h);

  // Default entire map to Digital Data Ocean (blocked water)
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

  // North Data Cliff / Forest framing (blocking border backdrop)
  fillRect(3, 1, 16, 2, Tile.TREE, 1);
  fillRect(24, 1, 36, 2, Tile.TREE, 1);

  // 1. North Return Gate Terrace (X: 18..22, Y: 3..6)
  fillRect(
    DIGI_RETURN_GATE.terraceXMin,
    DIGI_RETURN_GATE.terraceYMin,
    DIGI_RETURN_GATE.terraceXMax,
    DIGI_RETURN_GATE.terraceYMax,
    Tile.PLAZA,
    0
  );

  // 2. Central Digi-Plaza (X: 15..25, Y: 18..26)
  fillRect(DIGI_ZONES.plaza.xMin, DIGI_ZONES.plaza.yMin, DIGI_ZONES.plaza.xMax, DIGI_ZONES.plaza.yMax, Tile.PLAZA, 0);

  // 3. Four Elemental Habitat Zones (Open & 100% Town Editor customizable)
  fillRect(
    DIGI_ZONES.flameDragon.xMin,
    DIGI_ZONES.flameDragon.yMin,
    DIGI_ZONES.flameDragon.xMax,
    DIGI_ZONES.flameDragon.yMax,
    Tile.SAND,
    0
  );
  fillRect(
    DIGI_ZONES.cyberSteel.xMin,
    DIGI_ZONES.cyberSteel.yMin,
    DIGI_ZONES.cyberSteel.xMax,
    DIGI_ZONES.cyberSteel.yMax,
    Tile.PLAZA,
    0
  );
  fillRect(
    DIGI_ZONES.aquaCryo.xMin,
    DIGI_ZONES.aquaCryo.yMin,
    DIGI_ZONES.aquaCryo.xMax,
    DIGI_ZONES.aquaCryo.yMax,
    Tile.SAND,
    0
  );
  fillRect(
    DIGI_ZONES.verdantHoly.xMin,
    DIGI_ZONES.verdantHoly.yMin,
    DIGI_ZONES.verdantHoly.xMax,
    DIGI_ZONES.verdantHoly.yMax,
    Tile.GRASS,
    0
  );

  // 4. Interconnecting Cyber Bridges (all 3 tiles wide for smooth movement)
  fillRect(19, 7, 21, 17, Tile.PATH, 0);   // North Spinal Bridge (Return Gate <-> Plaza)
  fillRect(17, 11, 23, 13, Tile.PATH, 0);  // Upper Horizontal Bridge (Zona 1 <-> Spine <-> Zona 2)
  fillRect(9, 18, 11, 26, Tile.PATH, 0);   // West Lateral Bridge (Zona 1 <-> Zona 3)
  fillRect(12, 21, 14, 23, Tile.PATH, 0);  // West Plaza Connector
  fillRect(29, 18, 31, 26, Tile.PATH, 0);  // East Lateral Bridge (Zona 2 <-> Zona 4)
  fillRect(26, 21, 28, 23, Tile.PATH, 0);  // East Plaza Connector
  fillRect(19, 27, 21, 37, Tile.PATH, 0);  // South Spinal Bridge + Ocean Overlook Pier
  fillRect(17, 31, 23, 33, Tile.PATH, 0);  // Lower Horizontal Bridge (Zona 3 <-> South Spine <-> Zona 4)

  // 5. DigiDex Master Console (2x2 solid centerpiece at Central Digi-Plaza X: 19..20, Y: 20..21)
  fillRect(
    DIGI_PLAZA_CONSOLE.x,
    DIGI_PLAZA_CONSOLE.y,
    DIGI_PLAZA_CONSOLE.x + DIGI_PLAZA_CONSOLE.w - 1,
    DIGI_PLAZA_CONSOLE.y + DIGI_PLAZA_CONSOLE.h - 1,
    Tile.FENCE,
    1
  );

  // 6. Warp Trigger Doors back to Zulfan's Town at (22, 58) facing 'up'
  const doors = new Map<number, string>();
  for (let y = DIGI_RETURN_GATE.yMin; y <= DIGI_RETURN_GATE.yMax; y++) {
    for (let x = DIGI_RETURN_GATE.xMin; x <= DIGI_RETURN_GATE.xMax; x++) {
      doors.set(y * w + x, '/?from=digimon');
    }
  }

  // 7. Interactive Signs (DigiDex Master Console + 4 Habitat Zone Info Terminals)
  const signs: Sign[] = [
    {
      id: 'digidex-console',
      name: '📟 DigiDex Master Console',
      x: 19,
      y: 21,
      style: 'board',
      lines: [
        'DIGIDEX MASTER CONSOLE — Node: Digi-Sanctuary Island (40×45).',
        'Status Katalog Fase 4: Auto Sprite Slicer (Chroma-Key) aktif untuk 40 Digimon Tier 1–4, 4-Direction Patrol AI & Sistem Companion Jalan Bersama!',
        'Gunakan Town Editor 2.0 (Tekan E → + Tambah Objek → 👾 Dunia Digimon) untuk memasang Digimon di zona manapun & Ctrl+S ke digimonLayout.json!',
      ],
    },
    {
      id: 'sign-zone-flame',
      name: '🔥 Flame & Dragon Canyon',
      x: 15,
      y: 10,
      style: 'post',
      lines: [
        'ZONA I: FLAME & DRAGON CANYON (X: 4..16, Y: 7..17)',
        'Kawah batu vulkanik & kristal naga purba — dirancang khusus untuk Greymon-line, Guilmon, Gallantmon & Agumon.',
      ],
    },
    {
      id: 'sign-zone-cyber',
      name: '⚙️ Cyber & Steel Dome',
      x: 25,
      y: 10,
      style: 'post',
      lines: [
        'ZONA II: CYBER & STEEL DOME (X: 24..36, Y: 7..17)',
        'Dek sirkuit neon & baja digital — rumah ideal untuk Omegamon, Machinedramon, MetalGarurumon & cyber partners.',
      ],
    },
    {
      id: 'sign-zone-aqua',
      name: '❄️ Aqua & Cryo Bay',
      x: 15,
      y: 30,
      style: 'post',
      lines: [
        'ZONA III: AQUA & CRYO BAY (X: 4..16, Y: 27..38)',
        'Teluk data kristal es & lautan biru — habitat untuk Gomamon, Vikemon, Seadramon & Digimon elemen air/es.',
      ],
    },
    {
      id: 'sign-zone-verdant',
      name: '🌿 Verdant & Holy Sanctuary',
      x: 25,
      y: 30,
      style: 'post',
      lines: [
        'ZONA IV: VERDANT & HOLY SANCTUARY (X: 24..36, Y: 27..38)',
        'Padang suci dengan altar marmer & cahaya surgawi — ruang bagi Patamon, Seraphimon, Angewomon & Plant/Holy Digimon.',
      ],
    },
  ];

  for (const s of signs) {
    collision[s.y * w + s.x] = 1;
  }

  // 8. Ambient Cyber Lights for Sunset/Night Atmosphere (radius in pixels, named colors)
  const lamps: Lamp[] = [
    { x: 18, y: 5, radius: 56, color: 'cyan' },
    { x: 22, y: 5, radius: 56, color: 'cyan' },
    { x: 18, y: 12, radius: 46, color: 'cyan' },
    { x: 22, y: 12, radius: 46, color: 'cyan' },
    { x: 16, y: 19, radius: 54, color: 'gold' },
    { x: 24, y: 19, radius: 54, color: 'gold' },
    { x: 16, y: 25, radius: 54, color: 'cyan' },
    { x: 24, y: 25, radius: 54, color: 'cyan' },
    { x: 10, y: 12, radius: 58, color: 'amber' },
    { x: 30, y: 12, radius: 58, color: 'cyan' },
    { x: 10, y: 32, radius: 58, color: 'cyan' },
    { x: 30, y: 32, radius: 58, color: 'gold' },
    { x: 20, y: 36, radius: 46, color: 'cyan' },
  ];

  return {
    w,
    h,
    ground,
    collision,
    buildings: [], // ZERO hardcoded Digimon — customized strictly via digimonLayout.json
    npcs: [],
    signs,
    lamps,
    props: [],
    doors,
    spawns: {
      town: { ...DIGI_SPAWN },
      digimon: { ...DIGI_SPAWN },
      fromTown: { ...DIGI_SPAWN },
    },
  };
}
