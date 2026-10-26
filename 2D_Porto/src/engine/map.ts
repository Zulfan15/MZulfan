/**
 * The town layout. Built programmatically (not hand-typed ASCII) so it stays
 * consistent: change a rectangle here and collisions/paths follow.
 * All copy comes from profile.yaml via TownData.
 */
import { BLOCKING, Tile, type Building, type Npc, type Sign, type TownData, type TownMap } from './types';

export const MAP_W = 40;
export const MAP_H = 30;

export function hash2(x: number, y: number, seed = 0): number {
  let h = (x * 374761393 + y * 668265263 + seed * 2147483647) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
}

export function createTownMap(data: TownData): TownMap {
  const w = MAP_W;
  const h = MAP_H;
  const ground = new Uint8Array(w * h).fill(Tile.GRASS);
  const idx = (x: number, y: number) => y * w + x;
  const rect = (x: number, y: number, rw: number, rh: number, t: number) => {
    for (let j = y; j < y + rh; j++) for (let i = x; i < x + rw; i++) ground[idx(i, j)] = t;
  };
  const set = (x: number, y: number, t: number) => (ground[idx(x, y)] = t);

  // ── Terrain ──────────────────────────────────────────────
  rect(0, 0, w, 2, Tile.TREE);
  rect(0, h - 2, w, 2, Tile.TREE);
  rect(0, 0, 2, h, Tile.TREE);
  rect(w - 2, 0, 2, h, Tile.TREE);

  rect(2, 10, 36, 2, Tile.PATH); // Main Street
  rect(2, 20, 36, 2, Tile.PATH); // Garden Lane
  rect(19, 12, 2, 8, Tile.PATH); // connector
  rect(15, 13, 10, 6, Tile.PLAZA); // Town Square
  rect(18, 15, 4, 2, Tile.WATER); // fountain
  rect(27, 13, 10, 6, Tile.SAND); // pond beach
  rect(28, 14, 8, 4, Tile.WATER); // pond
  rect(3, 23, 14, 5, Tile.TALL); // tall grass
  for (let x = 3; x <= 16; x++) if (x !== 9 && x !== 10) set(x, 22, Tile.FENCE);

  // door walkways
  rect(6, 8, 1, 2, Tile.PATH);
  rect(19, 9, 2, 1, Tile.PATH);
  rect(32, 9, 1, 1, Tile.PATH);
  rect(7, 18, 1, 2, Tile.PATH);

  const trees: [number, number][] = [
    [11, 3], [11, 6], [27, 3], [28, 6], [37, 4], [2, 15], [12, 13], [13, 17],
    [24, 25], [30, 24], [34, 26], [20, 27], [36, 23], [26, 27], [2, 6], [37, 15],
  ];
  trees.forEach(([x, y]) => set(x, y, Tile.TREE));

  // flowers: scattered deterministically on plain grass
  for (let y = 2; y < h - 2; y++) {
    for (let x = 2; x < w - 2; x++) {
      if (ground[idx(x, y)] !== Tile.GRASS) continue;
      const meadow = x >= 22 && y >= 23;
      if (hash2(x, y, 7) < (meadow ? 0.35 : 0.06)) set(x, y, Tile.FLOWER);
    }
  }

  // ── Buildings ────────────────────────────────────────────
  const buildings: Building[] = [
    { id: 'about', name: 'Home', route: '/about', x: 3, y: 3, w: 7, h: 5, doors: [{ x: 6, y: 7 }], roof: '#e8473f', roofDark: '#a4302b', wall: '#fff3d6', sign: 'HOME' },
    { id: 'dev', name: 'Dev Center', route: '/dev', x: 13, y: 2, w: 14, h: 7, doors: [{ x: 19, y: 8 }, { x: 20, y: 8 }], roof: '#3b6fd8', roofDark: '#26489a', wall: '#e9eef7', sign: 'DEV CENTER' },
    { id: 'lab', name: 'Research Lab', route: '/lab', x: 29, y: 3, w: 8, h: 6, doors: [{ x: 32, y: 8 }], roof: '#2fae8f', roofDark: '#1d7360', wall: '#f1f6f3', sign: 'LAB' },
    { id: 'arcade', name: 'Arcade', route: '/arcade', x: 4, y: 13, w: 7, h: 5, doors: [{ x: 7, y: 17 }], roof: '#9b59d0', roofDark: '#673a8f', wall: '#fbeefc', sign: 'ARCADE' },
  ];

  // ── People & signs (copy from profile.yaml) ──────────────
  const npcs: Npc[] = [
    {
      id: 'mira', name: 'Mira', x: 23, y: 9, dir: 'down',
      palette: { skin: '#f2c9a0', hair: '#6b3fa0', shirt: '#2fae8f', pants: '#2d3a4a', shoes: '#1c1726', accent: '#f7c948' },
      lines: [`Welcome to the Dev Center! I'm Mira at the front desk.`, `I know everything about ${data.shortName} — projects, skills, research.`],
      action: { kind: 'navigate', route: '/reception', prompt: 'Chat with Mira?' },
    },
    {
      id: 'twin', name: `${data.shortName}'s Twin`, x: 35, y: 9, dir: 'down',
      palette: { skin: '#e0b48a', hair: '#1c1726', shirt: '#4cc9f0', pants: '#1d2b53', shoes: '#1c1726', cap: '#e8473f', holo: true },
      lines: [`Bzzt… hello! I'm ${data.shortName}'s digital twin.`, 'Ask me anything about my projects, research or skills.'],
      action: { kind: 'navigate', route: '/twin', prompt: 'Talk to the twin?' },
    },
    {
      id: 'ranger', name: 'Ranger Asep', x: 18, y: 23, dir: 'left',
      palette: { skin: '#d9a066', hair: '#3b2a1a', shirt: '#8a5a34', pants: '#4f6b3a', shoes: '#1c1726', cap: '#4f9a3e' },
      lines: [`Sampurasun! I'm Ranger Asep, keeper of Garden Lane.`, 'Wild critters hide in the tall grass — there are 12 to find.', `I've topped up your Poké Balls. Happy hunting, trainer!`],
      action: { kind: 'refill' },
    },
  ];

  const signs: Sign[] = [
    {
      id: 'board', name: 'Notice Board', x: 17, y: 12, style: 'board',
      lines: [`TOWN HALL · ${data.name}`, data.tagline, `NOW: ${data.now}`, `FEATURED: ${data.featured.join(' · ')}`, `TOOLBELT: ${data.toolbelt.join(', ')}`],
      action: { kind: 'navigate', route: '/', prompt: 'Open the full notice board?' },
    },
    {
      id: 'mailbox', name: 'Mailbox', x: 4, y: 8, style: 'mailbox',
      lines: [`📬 Mail for ${data.shortName}.`, `Write to ${data.email}.`, data.openTo],
      action: { kind: 'navigate', route: '/about', prompt: 'Step inside Home?' },
    },
    { id: 'arcade-post', name: 'Arcade', x: 9, y: 18, style: 'post', lines: ['ARCADE — Kalah vs. an Alpha-Beta bot.', 'Can you beat it on HARD?'], action: { kind: 'navigate', route: '/arcade', prompt: 'Enter the Arcade?' } },
    { id: 'lab-post', name: 'Research Lab', x: 30, y: 9, style: 'post', lines: ['RESEARCH LAB', 'Thesis, computer vision and what comes next.'], action: { kind: 'navigate', route: '/lab', prompt: 'Enter the Lab?' } },
    { id: 'garden-post', name: 'Garden Lane', x: 17, y: 22, style: 'post', lines: ['GARDEN LANE', 'Wild critters live in the tall grass. Talk to Ranger Asep for Poké Balls!'], action: { kind: 'open', target: 'dex' } },
    { id: 'pond-post', name: 'Pond', x: 27, y: 12, style: 'post', lines: ['⚠ Please do not feed the Kafkoi.', 'They never forget a message.'] },
  ];

  // ── Collision ────────────────────────────────────────────
  const collision = new Uint8Array(w * h);
  for (let i = 0; i < ground.length; i++) collision[i] = BLOCKING.has(ground[i]) ? 1 : 0;
  const doors = new Map<number, string>();
  for (const b of buildings) {
    for (let y = b.y; y < b.y + b.h; y++) for (let x = b.x; x < b.x + b.w; x++) collision[idx(x, y)] = 1;
    for (const d of b.doors) {
      collision[idx(d.x, d.y)] = 0;
      doors.set(idx(d.x, d.y), b.route);
    }
  }
  for (const e of [...npcs, ...signs]) collision[idx(e.x, e.y)] = 1;

  return {
    w, h, ground, collision, buildings, npcs, signs, doors,
    spawns: {
      town: { x: 18, y: 12, dir: 'left' },
      about: { x: 6, y: 8, dir: 'down' },
      dev: { x: 19, y: 9, dir: 'down' },
      lab: { x: 32, y: 9, dir: 'down' },
      arcade: { x: 7, y: 18, dir: 'down' },
      twin: { x: 35, y: 10, dir: 'up' },
      reception: { x: 23, y: 10, dir: 'up' },
    },
  };
}
