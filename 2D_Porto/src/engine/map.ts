/**
 * The town layout replicating si-dan.com Pokémon-style town aesthetics:
 * - Forest perimeter of dark rounded pixel trees
 * - 2-Story Home, Dev Center, Research Lab, Arcade, Striped Awning Shop
 * - Statues, pond, signposts cluster (LinkedIn, Résumé, GitHub, Email)
 * - Tall grass meadow with Ranger at the entrance
 * - Street lamps with warm radial glow pools
 */
import { BLOCKING, Tile, type Building, type Lamp, type Npc, type Prop, type Sign, type TownData, type TownMap } from './types';

export const MAP_W = 34;
export const MAP_H = 30;

export function createTownMap(_data: TownData): TownMap {
  const w = MAP_W;
  const h = MAP_H;
  const ground = new Uint8Array(w * h).fill(Tile.GRASS);
  const idx = (x: number, y: number) => y * w + x;
  const rect = (x: number, y: number, rw: number, rh: number, t: number) => {
    for (let j = y; j < y + rh; j++) for (let i = x; i < x + rw; i++) ground[idx(i, j)] = t;
  };
  const set = (x: number, y: number, t: number) => (ground[idx(x, y)] = t);

  // 1. Forest Tree Perimeter (2-3 tiles thick border around entire town)
  rect(0, 0, w, 2, Tile.TREE);
  rect(0, h - 2, w, 2, Tile.TREE);
  rect(0, 0, 2, h, Tile.TREE);
  rect(w - 2, 0, 2, h, Tile.TREE);

  // Additional perimeter trees for natural thick forest look
  for (let x = 2; x < w - 2; x++) {
    if (x % 3 === 0) set(x, 2, Tile.TREE);
    if ((x + 1) % 4 === 0) set(x, h - 3, Tile.TREE);
  }
  for (let y = 2; y < h - 2; y++) {
    if (y % 4 === 0) set(2, y, Tile.TREE);
    if ((y + 2) % 4 === 0) set(w - 3, y, Tile.TREE);
  }

  // 2. Light Dirt Pathways (connecting all buildings and town center)
  // Horizontal Main avenues
  rect(3, 10, 28, 2, Tile.PATH); // Top street between Home/Dev Center and Lab/Arcade
  rect(3, 18, 28, 2, Tile.PATH); // Middle street
  rect(13, 10, 4, 15, Tile.PATH); // Center vertical avenue

  // Walkways directly to doors
  rect(7, 9, 2, 1, Tile.PATH);   // Home door path
  rect(22, 9, 2, 1, Tile.PATH);  // Dev Center door path
  rect(8, 17, 2, 1, Tile.PATH);  // Research Lab door path
  rect(22, 17, 2, 1, Tile.PATH); // Arcade door path
  rect(7, 24, 2, 1, Tile.PATH);  // Shop door path

  // 3. Rectangular Water Pond (bottom center)
  rect(15, 21, 5, 3, Tile.WATER);

  // 4. Tall Grass Meadow (Bottom area spanning across)
  rect(3, 25, 28, 3, Tile.TALL);
  // Clear an entrance in the tall grass where Ranger stands
  set(16, 25, Tile.PATH);

  // 5. Buildings
  const buildings: Building[] = [
    // Top-Left: 2-Story Home
    {
      id: 'about',
      name: 'Home',
      badge: 'Home',
      route: '/about',
      x: 4,
      y: 3,
      w: 8,
      h: 6,
      doors: [{ x: 8, y: 8 }],
      roof: '#3b2a26',
      roofDark: '#231815',
      wall: '#fff5de',
      sign: 'HOME',
      style: 'mansion',
    },
    // Top-Right: Dev Center
    {
      id: 'dev',
      name: 'Dev Center',
      badge: 'Dev Center',
      route: '/dev',
      x: 18,
      y: 3,
      w: 11,
      h: 6,
      doors: [{ x: 22, y: 8 }, { x: 23, y: 8 }],
      roof: '#2654b8',
      roofDark: '#173678',
      wall: '#f1f5fa',
      sign: 'DEV CENTER',
      style: 'standard',
    },
    // Middle-Left: Research Lab
    {
      id: 'lab',
      name: 'Research Lab',
      badge: 'Research Lab',
      route: '/lab',
      x: 4,
      y: 12,
      w: 8,
      h: 5,
      doors: [{ x: 8, y: 16 }],
      roof: '#1b8a78',
      roofDark: '#105247',
      wall: '#f0f7f5',
      sign: 'LAB',
      style: 'lab',
    },
    // Middle-Right: Arcade
    {
      id: 'arcade',
      name: 'Arcade',
      badge: 'Arcade',
      route: '/arcade',
      x: 19,
      y: 12,
      w: 9,
      h: 5,
      doors: [{ x: 23, y: 16 }],
      roof: '#ba372b',
      roofDark: '#781f17',
      wall: '#fff2ea',
      sign: 'ARCADE',
      style: 'standard',
    },
    // Bottom-Left: Striped Awning Shop
    {
      id: 'shop',
      name: 'Depop',
      badge: 'Depop',
      route: '/about',
      x: 4,
      y: 20,
      w: 7,
      h: 4,
      doors: [{ x: 7, y: 23 }],
      roof: '#e8473f',
      roofDark: '#ffffff',
      wall: '#fff9e6',
      sign: 'DEPOP',
      style: 'shop',
    },
  ];

  // 6. Street Lamps with Warm Radial Glow Pools
  const lamps: Lamp[] = [
    { x: 6, y: 9, radius: 46 },    // Home front lamp
    { x: 13, y: 9, radius: 46 },   // North path lamp
    { x: 23, y: 9, radius: 52 },   // Dev Center entrance lamp
    { x: 13, y: 13, radius: 50 },  // Crossroads lamp
    { x: 6, y: 17, radius: 48 },   // Lab front lamp
    { x: 18, y: 17, radius: 48 },  // Arcade front lamp
    { x: 6, y: 24, radius: 46 },   // Depop shop front lamp
    { x: 21, y: 21, radius: 52 },  // Signpost cluster lamp
  ];

  // 7. Props (Statue / Pedestal)
  const props: Prop[] = [
    {
      id: 'statue',
      name: 'LeBron James Statue',
      badge: 'LeBron James',
      x: 14,
      y: 6,
      type: 'statue',
      lines: ['LEBRON JAMES STATUE', 'A monument to discipline, vision, and relentless execution.'],
    },
  ];

  // 8. NPCs
  const npcs: Npc[] = [
    {
      id: 'twin',
      name: 'Digital Twin',
      badge: 'Digital Twin',
      x: 13,
      y: 14,
      dir: 'down',
      palette: {
        skin: '#fedbb7',
        hair: '#1c1726',
        shirt: '#2fae8f',
        pants: '#1d2b53',
        shoes: '#1c1726',
        holo: true,
      },
      lines: [`Bzzt… I'm Zulfan's AI Digital Twin!`, 'Ask me anything about his projects, edge AI research, or CV.'],
      action: { kind: 'navigate', route: '/twin', prompt: 'Talk to the Digital Twin?' },
    },
    {
      id: 'lebron',
      name: 'LeBron',
      badge: 'LeBron',
      x: 16,
      y: 25,
      dir: 'down',
      palette: {
        skin: '#d9a066',
        hair: '#1c1726',
        shirt: '#e8a838',
        pants: '#4a2574',
        shoes: '#1c1726',
        cap: '#e8a838',
      },
      lines: [`LeBron says: Keep striving for greatness!`],
      action: { kind: 'event', name: 'lebron' },
    },
  ];

  // 9. Signposts (Including social runes cluster)
  const signs: Sign[] = [
    {
      id: 'linkedin',
      name: 'LinkedIn',
      x: 23,
      y: 20,
      style: 'post',
      lines: ['LINKEDIN RUNES', 'Connect with Muhammad Zulfan on LinkedIn.'],
      action: { kind: 'navigate', route: 'https://www.linkedin.com/in/muhammad-zulfan-anggadhiputra', prompt: 'Open LinkedIn profile?' },
    },
    {
      id: 'resume',
      name: 'Résumé',
      x: 27,
      y: 20,
      style: 'post',
      lines: ['CURRICULUM VITAE', 'Verified latest CV in PDF format.'],
      action: { kind: 'navigate', route: '/cv/CV_Zulfan.pdf', prompt: 'Download verified CV?' },
    },
    {
      id: 'github',
      name: 'GitHub',
      x: 23,
      y: 23,
      style: 'post',
      lines: ['GITHUB REPOSITORY', 'Explore open-source code and AI projects at github.com/Zulfan15.'],
      action: { kind: 'navigate', route: 'https://github.com/Zulfan15', prompt: 'Visit GitHub profile?' },
    },
    {
      id: 'email',
      name: 'Email',
      x: 27,
      y: 23,
      style: 'post',
      lines: ['DIRECT DISPATCH', 'Email: zulfanangga2908@gmail.com', 'Open to software engineering and AI roles.'],
      action: { kind: 'navigate', route: 'mailto:zulfanangga2908@gmail.com', prompt: 'Send email to Zulfan?' },
    },
  ];

  // 10. Collision Layer
  const collision = new Uint8Array(w * h);
  for (let i = 0; i < ground.length; i++) collision[i] = BLOCKING.has(ground[i]) ? 1 : 0;

  const doors = new Map<number, string>();
  for (const b of buildings) {
    for (let y = b.y; y < b.y + b.h; y++) {
      for (let x = b.x; x < b.x + b.w; x++) {
        collision[idx(x, y)] = 1;
      }
    }
    for (const d of b.doors) {
      collision[idx(d.x, d.y)] = 0;
      doors.set(idx(d.x, d.y), b.route);
    }
  }

  for (const l of lamps) collision[idx(l.x, l.y)] = 1;
  for (const p of props) collision[idx(p.x, p.y)] = 1;
  for (const n of npcs) collision[idx(n.x, n.y)] = 1;
  for (const s of signs) collision[idx(s.x, s.y)] = 1;

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
      town: { x: 15, y: 13, dir: 'down' },
      about: { x: 8, y: 9, dir: 'down' },
      dev: { x: 22, y: 9, dir: 'down' },
      lab: { x: 8, y: 17, dir: 'down' },
      arcade: { x: 23, y: 17, dir: 'down' },
      twin: { x: 14, y: 16, dir: 'up' },
      reception: { x: 22, y: 9, dir: 'down' },
    },
  };
}
