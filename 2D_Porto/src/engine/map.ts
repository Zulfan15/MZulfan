/**
 * Pokémon Sinnoh/Unova style coastal town map (Expanded 100x100 Master Edition):
 * - 100x100 tile layout with Town Core preserved intact at X offset +26
 * - Ocean coast with granite seawall on the far West (x: 0..8, y: 0..26)
 * - Expansive buildable meadows & scenic boulevards on the West, East, and South
 * - South Digital Portal at (47..49, 95..96) connecting to Digi-Sanctuary
 */
import { Tile, type Building, type Lamp, type Npc, type Prop, type Sign, type TownData, type TownMap } from './types';
import { applyLivingWorldGeography } from './world/townGeography';

export const MAP_W = 100;
export const MAP_H = 100;
export const TOWN_OFFSET_X = 26;

export const DIGI_GATE_PORTAL = {
  xMin: 21 + TOWN_OFFSET_X, // 47
  xMax: 23 + TOWN_OFFSET_X, // 49
  yMin: 95,
  yMax: 96,
  triggerY: 96,
  route: '/digimon',
  returnSpawn: { x: 22 + TOWN_OFFSET_X, y: 94, dir: 'up' as const },
};

export function createTownMap(_data: TownData): TownMap {
  const w = MAP_W;
  const h = MAP_H;
  const OX = TOWN_OFFSET_X;
  const ground = new Uint8Array(w * h).fill(Tile.GRASS);
  const collision = new Uint8Array(w * h).fill(0); // 0 = walkable across all open town & meadow land
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

  // Stone foundation aprons & west promenade in Town Core (shifted by OX = +26)
  rectGround(9 + OX, 1, 13, 17, Tile.PATH);
  rectGround(23 + OX, 1, 11, 14, Tile.PATH);
  rectGround(3 + OX, 27, 2, 16, Tile.PATH);
  makeWalkable(3 + OX, 27, 2, 16);

  // Extended Central Grand Boulevard (X: 46..49, Y: 18..96 all the way to South Digi-Gate!)
  makeWalkable(20 + OX, 18, 4, 79);

  // 3. Preserved Town Core Streets & Plazas (shifted cleanly by +OX)
  makeWalkable(9 + OX, 13, 13, 5);
  makeWalkable(15 + OX, 11, 2, 2);
  makeWalkable(19 + OX, 16, 4, 2);
  makeWalkable(10 + OX, 18, 12, 2);

  makeWalkable(8 + OX, 20, 2, 7);
  makeWalkable(8 + OX, 27, 13, 2);
  makeWalkable(5 + OX, 27, 4, 1);
  makeWalkable(8 + OX, 28, 2, 2);
  makeWalkable(8 + OX, 35, 13, 2);
  makeWalkable(5 + OX, 37, 4, 1);
  makeWalkable(8 + OX, 38, 2, 2);
  makeWalkable(8 + OX, 43, 13, 2);
  makeWalkable(2 + OX, 43, 19, 13);
  makeWalkable(14 + OX, 26, 3, 18);

  makeWalkable(23 + OX, 9, 11, 7);
  makeWalkable(26 + OX, 8, 3, 2);
  makeWalkable(31 + OX, 8, 3, 2);

  makeWalkable(24 + OX, 16, 10, 9);
  makeWalkable(24 + OX, 25, 10, 3);
  makeWalkable(24 + OX, 28, 10, 8);
  makeWalkable(24 + OX, 36, 10, 7);
  makeWalkable(24 + OX, 43, 10, 4);

  makeWalkable(34 + OX, 6, 2, 49);

  makeWalkable(36 + OX, 2, 7, 6);
  makeWalkable(36 + OX, 8, 7, 1);
  makeWalkable(36 + OX, 9, 6, 6);
  makeWalkable(36 + OX, 15, 6, 1);
  makeWalkable(36 + OX, 16, 7, 1);
  makeWalkable(36 + OX, 17, 7, 9);
  makeWalkable(36 + OX, 26, 7, 2);
  makeWalkable(36 + OX, 28, 7, 8);
  makeWalkable(36 + OX, 36, 7, 2);
  makeWalkable(36 + OX, 38, 7, 8);
  makeWalkable(36 + OX, 46, 7, 2);

  makeWalkable(24 + OX, 46, 10, 10);
  makeWalkable(34 + OX, 48, 9, 8);
  makeWalkable(5 + OX, 27, 4, 16);

  // Outer 100x100 Perimeter Forest & Northern Civic Fence
  rectGround(9, 0, w - 9, 2, Tile.TREE);          // North forest ridge (X: 9..99, Y: 0..1)
  rectGround(9 + OX, 0, 35, 1, Tile.FENCE);       // Northern civic fence behind Town Core (X: 35..69, Y: 0)
  rectGround(0, 27, 2, h - 27, Tile.TREE);        // West boundary forest ridge (X: 0..1, Y: 27..99)
  rectGround(w - 2, 0, 2, h, Tile.TREE);          // East boundary forest ridge (X: 98..99, Y: 0..99)
  rectGround(0, h - 2, w, 2, Tile.TREE);          // South boundary forest ridge (X: 0..99, Y: 98..99)

  for (let x = 9; x < w; x++) {
    collision[idx(x, 0)] = 1;
    collision[idx(x, 1)] = 1;
  }
  for (let y = 27; y < h; y++) {
    collision[idx(0, y)] = 1;
    collision[idx(1, y)] = 1;
  }
  for (let y = 0; y < h; y++) {
    collision[idx(w - 2, y)] = 1;
    collision[idx(w - 1, y)] = 1;
  }
  for (let x = 0; x < w; x++) {
    collision[idx(x, h - 2)] = 1;
    collision[idx(x, h - 1)] = 1;
  }

  // 3b. Sculpt Natural 100x100 Living Pokémon World Biomes around Town Core
  const worldFeatures = applyLivingWorldGeography(w, h, ground, collision);

  // 4. Interactive Buildings (fallback defaults aligned with shifted Town Core)
  const buildings: Building[] = [
    {
      id: 'dev',
      name: 'Dev Center',
      badge: 'Dev Center',
      route: '/dev',
      x: 10 + OX,
      y: 1,
      w: 12,
      h: 11,
      doors: [{ x: 15 + OX, y: 11 }, { x: 16 + OX, y: 11 }],
      roof: '#4a5568',
      roofDark: '#2d3748',
      wall: '#d8cbba',
      sign: 'DEV CENTER',
      style: 'mansion',
    },
    {
      id: 'lab',
      name: 'Research Lab',
      badge: 'Research Lab',
      route: '/lab',
      x: 24 + OX,
      y: 3,
      w: 7,
      h: 6,
      doors: [{ x: 27 + OX, y: 8 }],
      roof: '#1b4332',
      roofDark: '#2d6a4f',
      wall: '#f8f9fa',
      sign: 'LAB',
      style: 'lab',
    },
    {
      id: 'home',
      name: 'Home',
      badge: 'Home',
      route: '/about',
      x: 33 + OX,
      y: 18,
      w: 10,
      h: 7,
      doors: [{ x: 37 + OX, y: 24 }],
      roof: '#2b2d42',
      roofDark: '#1d1e2c',
      wall: '#f3eee3',
      sign: 'HOME',
      style: 'mansion',
    },
    {
      id: 'reception',
      name: 'Poké Center',
      badge: 'Poké Center',
      route: '/reception',
      x: 35 + OX,
      y: 11,
      w: 7,
      h: 6,
      doors: [{ x: 38 + OX, y: 16 }],
      roof: '#d90429',
      roofDark: '#9b2226',
      wall: '#f8f9fa',
      sign: 'RECEPTION',
      style: 'standard',
    },
    {
      id: 'shop',
      name: 'Poké Mart',
      badge: 'Mart',
      route: '/mart',
      x: 36 + OX,
      y: 27,
      w: 6,
      h: 6,
      doors: [{ x: 39 + OX, y: 32 }],
      roof: '#1d3557',
      roofDark: '#0d1b2a',
      wall: '#f8fafc',
      sign: 'MART',
      style: 'shop',
    },
    {
      id: 'arcade',
      name: 'Arcade',
      badge: 'Arcade',
      route: '/arcade',
      x: 24 + OX,
      y: 10,
      w: 8,
      h: 7,
      doors: [{ x: 27 + OX, y: 16 }, { x: 28 + OX, y: 16 }],
      roof: '#1e293b',
      roofDark: '#0f172a',
      wall: '#334155',
      sign: 'ARCADE',
      style: 'standard',
    },
    {
      id: 'villa',
      name: "Neighbour's House",
      badge: 'Neighbour',
      route: '/neighbour',
      x: 25 + OX,
      y: 20,
      w: 6,
      h: 5,
      doors: [{ x: 27 + OX, y: 24 }, { x: 28 + OX, y: 24 }],
      roof: '#9a3412',
      roofDark: '#7c2d12',
      wall: '#fef3c7',
      sign: 'NEIGHBOUR',
      style: 'standard',
    },
    {
      id: 'office',
      name: 'Tech Tower',
      badge: 'Tech Tower',
      route: '/tower',
      x: 36 + OX,
      y: 0,
      w: 6,
      h: 8,
      doors: [{ x: 39 + OX, y: 7 }],
      roof: '#334155',
      roofDark: '#1e293b',
      wall: '#64748b',
      sign: 'TECH TOWER',
      style: 'standard',
    },
  ];

  // 5. Props
  const props: Prop[] = [
    {
      id: 'fountain',
      name: 'Town Fountain',
      badge: 'Fountain',
      x: 4 + OX,
      y: 52,
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
      x: 16 + OX,
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
      x: 3 + OX,
      y: 43,
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
      x: 38 + OX,
      y: 39,
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
      x: 28 + OX,
      y: 39,
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
      x: 28 + OX,
      y: 51,
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
      x: 8 + OX,
      y: 31,
      type: 'bench',
      lines: [
        "ZULFAN'S OFF-DUTY LOG",
        'When not training neural nets or architecting frontends:',
        '• Lo-fi beat production & indie synth tracks',
        '• Vintage handheld console modding & retro pixel art',
        '• Specialty pour-over coffee brewing & coastal cycling routes!',
      ],
    },
  ];

  // 6. NPCs
  const npcs: Npc[] = [
    {
      id: 'twin',
      name: 'Digital Twin',
      badge: 'Digital Twin',
      x: 12 + OX,
      y: 22,
      dir: 'down',
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
      x: 18 + OX,
      y: 22,
      dir: 'down',
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
      name: 'Tyranitar',
      badge: 'Armor Pokémon',
      x: 12 + OX,
      y: 46,
      dir: 'down',
      palette: {
        skin: '#84cc16',
        hair: '#15803d',
        shirt: '#3f6212',
        pants: '#1e293b',
        shoes: '#0f172a',
        cap: '#4d7c0f',
      },
      lines: [
        'TYRANITAR: "Gwoooaaargh!" 🪨',
        'Tyranitar adalah Pokémon armor tipe Rock/Dark bertubuh zirah sekuat baja.',
        "Dengan kemampuan Sand Stream dan pertahanan sekeras karang, Tyranitar menjaga perbatasan kota dan kestabilan alam di Zulfan's Town.",
      ],
    },
    {
      id: 'ace',
      name: 'Mewtwo',
      badge: 'Battle Arena',
      x: 18 + OX,
      y: 46,
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
      x: 15 + OX,
      y: 13,
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
        "Kehadirannya di Zulfan's Town membawa berkat kedamaian dan inspirasi kreativitas teknologi tanpa batas.",
      ],
    },
    {
      id: 'reshiram',
      name: 'Reshiram',
      badge: 'Vast White',
      x: 18 + OX,
      y: 31,
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
        'Naga Legendaris Putih (Vast White Pokémon) berdiri megah di koridor legenda.',
        "Ekor turbin Reshiram membara dengan api kebenaran murni (Fusion Flare), menghangatkan semilir angin laut Zulfan's Town.",
      ],
      action: { kind: 'event', name: 'reshiram' },
    },
    {
      id: 'zekrom',
      name: 'Zekrom',
      badge: 'Deep Black',
      x: 12 + OX,
      y: 31,
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
        'Naga Legendaris Hitam (Deep Black Pokémon) berdiri kokoh di koridor legenda.',
        'Ekor generator listriknya berputar kencang memancarkan kilatan petir bertegangan raksasa (Fusion Bolt).',
      ],
      action: { kind: 'event', name: 'zekrom' },
    },
    {
      id: 'giratina',
      name: 'Giratina',
      badge: 'Renegade',
      x: 18 + OX,
      y: 25,
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
        'Sang Naga Pemberontak (Renegade Pokémon) dari Dunia Distorsi mengawasi keseimbangan dimensi.',
      ],
      action: { kind: 'event', name: 'giratina' },
    },
    {
      id: 'palkia',
      name: 'Palkia',
      badge: 'Spatial',
      x: 18 + OX,
      y: 28,
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
        'Sang Naga Ruang (Spatial Pokémon) memancarkan gelombang distorsi ruang (Spacial Rend).',
      ],
      action: { kind: 'event', name: 'palkia' },
    },
    {
      id: 'dialga',
      name: 'Dialga',
      badge: 'Temporal',
      x: 12 + OX,
      y: 28,
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
        'Sang Naga Waktu (Temporal Pokémon) mengendalikan detak aliran waktu di seluruh semesta.',
      ],
      action: { kind: 'event', name: 'dialga' },
    },
  ];

  // 7. Social Signs at Café & Landmarks
  const signs: Sign[] = [
    {
      id: 'lookout-sign',
      name: 'Scenic Lookout',
      x: 4 + OX,
      y: 43,
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
      x: 7 + OX,
      y: 35,
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
      x: 8 + OX,
      y: 31,
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
      x: 29 + OX,
      y: 31,
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
      x: 36 + OX,
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
      x: 40 + OX,
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
      x: 36 + OX,
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
      x: 40 + OX,
      y: 53,
      style: 'post',
      lines: ['DIRECT DISPATCH TABLE', 'Email: zulfanangga2908@gmail.com', 'Open to software engineering and AI roles.'],
      action: {
        kind: 'navigate',
        route: 'mailto:zulfanangga2908@gmail.com',
        prompt: 'Send email to Zulfan?',
      },
    },
    ...worldFeatures.extraSigns,
  ];

  // 8. Street Lamps
  const lamps: Lamp[] = [
    { x: 12 + OX, y: 14, radius: 46 },
    { x: 20 + OX, y: 14, radius: 46 },
    { x: 12 + OX, y: 18, radius: 46 },
    { x: 20 + OX, y: 18, radius: 46 },
    { x: 27 + OX, y: 11, radius: 50 },
    { x: 10 + OX, y: 28, radius: 48 },
    { x: 11 + OX, y: 35, radius: 48 },
    { x: 9 + OX, y: 44, radius: 48 },
    { x: 14 + OX, y: 44, radius: 48 },
    { x: 9 + OX, y: 52, radius: 48 },
    { x: 15 + OX, y: 52, radius: 48 },
    { x: 25 + OX, y: 31, radius: 48 },
    { x: 32 + OX, y: 31, radius: 48 },
    { x: 28 + OX, y: 43, radius: 48 },
    { x: 19 + OX, y: 50, radius: 48 },
    { x: 25 + OX, y: 50, radius: 48 },
    { x: 19 + OX, y: 55, radius: 50 },
    { x: 25 + OX, y: 55, radius: 50 },
    { x: 19 + OX, y: 72, radius: 50 },
    { x: 25 + OX, y: 72, radius: 50 },
    { x: 19 + OX, y: 92, radius: 50 },
    { x: 25 + OX, y: 92, radius: 50 },
    { x: 31 + OX, y: 49, radius: 48 },
    { x: 31 + OX, y: 54, radius: 48 },
    { x: 42 + OX, y: 49, radius: 48 },
    { x: 42 + OX, y: 54, radius: 48 },
    { x: 34 + OX, y: 8, radius: 48 },
    { x: 34 + OX, y: 16, radius: 48 },
    { x: 34 + OX, y: 26, radius: 48 },
    { x: 34 + OX, y: 35, radius: 48 },
    { x: 34 + OX, y: 44, radius: 48 },
    { x: 5 + OX, y: 28, radius: 48 },
    { x: 5 + OX, y: 35, radius: 48 },
    { x: 5 + OX, y: 42, radius: 48 },
    ...worldFeatures.extraLamps,
  ];

  // 9. Doors Map & Collision Updates
  const doors = new Map<number, string>();
  for (const b of buildings) {
    for (const d of b.doors) {
      collision[idx(d.x, d.y)] = 0;
      doors.set(idx(d.x, d.y), b.route);
    }
  }

  // Ensure East Promenade (X: 34+OX .. 35+OX, Y: 6..54) is clear
  for (let y = 6; y <= 54; y++) {
    collision[idx(34 + OX, y)] = 0;
    collision[idx(35 + OX, y)] = 0;
    ground[idx(34 + OX, y)] = Tile.PATH;
    ground[idx(35 + OX, y)] = Tile.PATH;
  }

  // Digital Warp Gate corridor & pad at south end of Central Boulevard (X: 47..49, Y: 94..96)
  for (let y = DIGI_GATE_PORTAL.yMin - 1; y <= DIGI_GATE_PORTAL.yMax; y++) {
    for (let x = DIGI_GATE_PORTAL.xMin; x <= DIGI_GATE_PORTAL.xMax; x++) {
      collision[idx(x, y)] = 0;
      ground[idx(x, y)] = Tile.PATH;
    }
  }
  for (let x = DIGI_GATE_PORTAL.xMin; x <= DIGI_GATE_PORTAL.xMax; x++) {
    doors.set(idx(x, DIGI_GATE_PORTAL.triggerY), DIGI_GATE_PORTAL.route);
  }

  const defaultSpawn = { x: 22 + OX, y: 28, dir: 'down' as const };

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
    decorations: worldFeatures.decorations,
    spawns: {
      town: defaultSpawn,
      digimon: { ...DIGI_GATE_PORTAL.returnSpawn },
      about: defaultSpawn,
      home: defaultSpawn,
      dev: defaultSpawn,
      lab: defaultSpawn,
      arcade: defaultSpawn,
      reception: defaultSpawn,
      mart: defaultSpawn,
      shop: defaultSpawn,
      tower: defaultSpawn,
      office: defaultSpawn,
      twin: defaultSpawn,
    },
  };
}
