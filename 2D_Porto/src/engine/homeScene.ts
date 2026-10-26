import type { Dir } from './types';

export const HOME_COLS = 15;
export const HOME_ROWS = 15;
export const HOME_SPAWN: { x: number; y: number; dir: Dir } = { x: 7, y: 13, dir: 'up' };

export interface RoomProp {
  id: string;
  name: string;
  x: number;
  y: number;
  w: number;
  h: number;
  lines: string[];
  action?: { label: string; href?: string; onClick?: () => void };
}

// 15x15 room collision map (0 = walkable, 1 = solid)
export const HOME_COLLISION: Uint8Array = new Uint8Array(HOME_COLS * HOME_ROWS);

// Populate solid walls
for (let y = 0; y < HOME_ROWS; y++) {
  for (let x = 0; x < HOME_COLS; x++) {
    // Back wall rows 0 & 1
    if (y < 2) HOME_COLLISION[y * HOME_COLS + x] = 1;
    // Left & Right border walls
    if (x === 0 || x === HOME_COLS - 1) HOME_COLLISION[y * HOME_COLS + x] = 1;
    // Bottom wall row 14, except exit door mat at (7, 14)
    if (y === HOME_ROWS - 1 && x !== 7) HOME_COLLISION[y * HOME_COLS + x] = 1;
  }
}

// Solid interior props
function markSolid(x: number, y: number, w: number, h: number) {
  for (let dy = 0; dy < h; dy++) {
    for (let dx = 0; dx < w; dx++) {
      const idx = (y + dy) * HOME_COLS + (x + dx);
      if (idx >= 0 && idx < HOME_COLLISION.length) {
        HOME_COLLISION[idx] = 1;
      }
    }
  }
}

// Mark props solid
markSolid(1, 3, 2, 2);   // Jukebox
// (12, 2) is walkable stairs to 2F
markSolid(9, 5, 3, 1);   // The Closet
markSolid(5, 6, 4, 1);   // Record crates
markSolid(13, 8, 1, 2);  // Mirror
markSolid(5, 9, 3, 1);   // DJ decks booth
markSolid(1, 11, 2, 1);  // Counter
markSolid(13, 12, 1, 1); // Plant
markSolid(10, 12, 2, 1); // Motorbike

export const HOME_PROPS: RoomProp[] = [
  {
    id: 'shop-posters',
    name: 'Gig posters',
    x: 1,
    y: 1,
    w: 4,
    h: 1,
    lines: [
      'Concert posters from classic live shows, indie gigs, and coding hackathons.',
      'A mix of synthwave, funk, lo-fi beats, and retro computer graphics.',
    ],
  },
  {
    id: 'shop-polaroids',
    name: 'Polaroids',
    x: 8,
    y: 1,
    w: 4,
    h: 1,
    lines: [
      'Snapshots from campus robotics workshops, tech competitions, and student festivals.',
      'Memories from ITENAS Bandung and IDEA FEST 2024!',
    ],
  },
  {
    id: 'shop-jukebox',
    name: 'Jukebox',
    x: 1,
    y: 3,
    w: 2,
    h: 2,
    lines: [
      'A vintage illuminated jukebox with bubbling rainbow light tubes.',
      'Pick a song on the right panel to set the vibe while browsing projects!',
    ],
  },
  {
    id: 'shop-closet',
    name: 'The Closet',
    x: 9,
    y: 5,
    w: 3,
    h: 1,
    lines: [
      'The Closet — vintage jackets, varsity coats, streetwear, and curated fashion pieces.',
      'Scroll down on the Home reading panel to check out the style gallery.',
    ],
  },
  {
    id: 'crates',
    name: 'Record crates',
    x: 5,
    y: 6,
    w: 4,
    h: 1,
    lines: [
      'Wooden crates packed with classic vinyl records.',
      'Dig through the crates to discover favorite artists, albums, and tracks.',
    ],
  },
  {
    id: 'mirror',
    name: 'Mirror',
    x: 13,
    y: 8,
    w: 1,
    h: 2,
    lines: [
      'A full-length mirror in an ornate gold frame.',
      'Looking sharp! Ready for software development and AI engineering.',
    ],
  },
  {
    id: 'decks',
    name: 'DJ booth',
    x: 5,
    y: 9,
    w: 3,
    h: 1,
    lines: [
      'Two direct-drive turntables and a 2-channel audio mixer.',
      'Call in a request or listen in as tracks blend together seamlessly.',
    ],
  },
  {
    id: 'counter',
    name: 'Counter',
    x: 1,
    y: 11,
    w: 2,
    h: 1,
    lines: [
      'The register counter. Nothing here is for sale, but Muhammad Zulfan is open for hire!',
      'Check out the CV download button and contact options on the right panel.',
    ],
  },
  {
    id: 'plant',
    name: 'Plant',
    x: 13,
    y: 12,
    w: 1,
    h: 1,
    lines: ['A lush green shop plant, thriving on a steady diet of lo-fi crackle and compiler logs.'],
  },
  {
    id: 'motorbike',
    name: 'Motorbike',
    x: 10,
    y: 12,
    w: 2,
    h: 1,
    lines: [
      'A custom vintage scooter. Reliable transportation for navigating Bandung and late-night coding runs.',
    ],
  },
  {
    id: 'stairs-up',
    name: 'Upstairs',
    x: 12,
    y: 2,
    w: 1,
    h: 1,
    lines: [
      "Stairs leading up to Zulfan's private place and digital twin workspace.",
      'Enjoy exploring 1F Crate & Closet first!',
    ],
  },
  {
    id: 'exit',
    name: 'Exit to Town Square',
    x: 7,
    y: 14,
    w: 1,
    h: 1,
    lines: ['Step on this mat with the down arrow [ ▼ ] to head back outside to Town Square.'],
  },
];

export function isHomeWalkable(x: number, y: number): boolean {
  if (x < 0 || x >= HOME_COLS || y < 0 || y >= HOME_ROWS) return false;
  return HOME_COLLISION[y * HOME_COLS + x] === 0;
}

// ─────────────────────────────────────────────────────────────────────────────
// Floor Rendering: Parquet wood tiles
// ─────────────────────────────────────────────────────────────────────────────
export function drawParquetTile(ctx: CanvasRenderingContext2D, x: number, y: number) {
  const rx = x * 16;
  const ry = y * 16;

  ctx.fillStyle = '#9a6236';
  ctx.fillRect(rx, ry, 16, 16);

  // Parquet plank slats
  for (let a = 0; a < 4; a++) {
    const py = ry + a * 4;
    ctx.fillStyle = '#7d4c28';
    ctx.fillRect(rx, py + 3, 16, 1);

    const hash = Math.sin(x * 12.9898 + y * 78.233 + a) * 43758.5453;
    const r1 = hash - Math.floor(hash);
    ctx.fillRect(rx + Math.floor(r1 * 15), py, 1, 3);

    const hash2 = Math.sin(x * 12.9898 + y * 78.233 + a + 9) * 43758.5453;
    const r2 = hash2 - Math.floor(hash2);
    if (r2 < 0.35) {
      ctx.fillStyle = '#b0743f';
      const hash3 = Math.sin(x * 12.9898 + y * 78.233 + a + 4) * 43758.5453;
      const r3 = hash3 - Math.floor(hash3);
      ctx.fillRect(rx + Math.floor(r3 * 12), py + 1, 3, 1);
    }
  }
}

export function renderHomeFloor(ctx: CanvasRenderingContext2D) {
  for (let y = 2; y < HOME_ROWS - 1; y++) {
    for (let x = 1; x < HOME_COLS - 1; x++) {
      drawParquetTile(ctx, x, y);
    }
  }

  // Cozy burgundy center rug
  ctx.fillStyle = '#5a2a3a';
  ctx.fillRect(68, 163, 72, 12);
  ctx.fillStyle = '#7a3a4e';
  ctx.fillRect(70, 165, 68, 8);
}

// ─────────────────────────────────────────────────────────────────────────────
// Wall Rendering: Burgundy slatted walls with gold molding and neon sign
// ─────────────────────────────────────────────────────────────────────────────
export function renderHomeWalls(ctx: CanvasRenderingContext2D, tick: number) {
  const totalW = HOME_COLS * 16; // 240

  // 1. Back Wall burgundy slats
  ctx.fillStyle = '#6b2a2a';
  ctx.fillRect(0, 0, totalW, 32);

  for (let n = 2; n < totalW; n += 6) {
    ctx.fillStyle = '#5f2525';
    ctx.fillRect(n, 0, 2, 26);
  }

  // Gold trim molding
  ctx.fillStyle = '#4a1b1b';
  ctx.fillRect(0, 0, totalW, 2);
  ctx.fillStyle = '#e0a526';
  ctx.fillRect(0, 26, totalW, 1);

  // Wall baseboard
  ctx.fillStyle = '#4a1b1b';
  ctx.fillRect(0, 27, totalW, 5);
  for (let n = 4; n < totalW; n += 8) {
    ctx.fillStyle = '#33110f';
    ctx.fillRect(n, 28, 1, 4);
  }

  // 2. Left & Right border walls
  for (let n = 2; n < HOME_ROWS; n++) {
    ctx.fillStyle = '#4a1b1b';
    ctx.fillRect(0, n * 16, 16, 16);
    ctx.fillRect(totalW - 16, n * 16, 16, 16);
  }
  ctx.fillStyle = '#33110f';
  ctx.fillRect(15, 32, 1, (HOME_ROWS - 3) * 16);
  ctx.fillRect(totalW - 16, 32, 1, (HOME_ROWS - 3) * 16);

  // 3. Bottom wall
  const bottomY = (HOME_ROWS - 1) * 16;
  ctx.fillStyle = '#4a1b1b';
  ctx.fillRect(0, bottomY, totalW, 16);
  ctx.fillStyle = '#33110f';
  ctx.fillRect(0, bottomY, totalW, 1);

  // 4. Glowing Neon Sign: CRATE & CLOSET
  const signX = 81;
  const signW = 46;
  ctx.fillStyle = '#1d1414';
  ctx.fillRect(signX - 1, 2, signW + 2, 22);
  ctx.fillStyle = '#1a1020';
  ctx.fillRect(signX, 3, signW, 20);

  // Hanging chains
  ctx.fillStyle = '#9a9aa8';
  ctx.fillRect(signX + 6, 0, 1, 3);
  ctx.fillRect(signX + signW - 7, 0, 1, 3);

  // Neon text
  ctx.save();
  ctx.font = 'bold 7px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const flicker = Math.sin(tick * 0.08) > 0.88;
  const neonColor = flicker ? '#ffd6ea' : '#ff6fae';
  const glow = flicker ? 'rgba(255, 111, 174, 0.9)' : 'rgba(255, 111, 174, 0.5)';

  ctx.shadowColor = glow;
  ctx.shadowBlur = 4;
  ctx.fillStyle = neonColor;
  ctx.fillText('CRATE &', signX + signW / 2, 9);
  ctx.fillText('CLOSET', signX + signW / 2, 18);
  ctx.restore();

  // 5. Wooden staircase leading up to 2F at x: 12, y: 1..3 (width: 32px, height: 42px)
  const stX = 12 * 16;
  ctx.fillStyle = '#100a06';
  ctx.fillRect(stX, 0, 32, 42);
  for (let s = 0; s < 5; s++) {
    const sy = 8 + s * 6;
    ctx.fillStyle = '#3a2214';
    ctx.fillRect(stX + 2, sy, 28, 5);
    ctx.fillStyle = '#6e4326';
    ctx.fillRect(stX + 2, sy, 28, 1);
  }
  // Handrail
  ctx.fillStyle = '#8a5530';
  ctx.fillRect(stX, 0, 2, 42);
  ctx.fillRect(stX + 30, 0, 2, 42);
  ctx.fillStyle = '#b07545';
  ctx.fillRect(stX, 0, 1, 42);
  ctx.fillRect(stX + 30, 0, 1, 42);
}

// ─────────────────────────────────────────────────────────────────────────────
// Props Rendering: Jukebox, Posters, Polaroids, Decks, Crates, Motorbike, Exit
// ─────────────────────────────────────────────────────────────────────────────
export function renderHomeProps(ctx: CanvasRenderingContext2D, tick: number) {
  // 1. Gig posters (x: 1, y: 1, w: 4, h: 1)
  const posterX = 1 * 16 + 2;
  const posterW = 4 * 16 - 4;
  const posters = [
    { bg: '#e0a526', ink: '#33110f', art: '#ff6fae' },
    { bg: '#3aa6a0', ink: '#f6e7c8', art: '#ff8a3d' },
    { bg: '#f6e7c8', ink: '#1d1414', art: '#4a7fd1' },
    { bg: '#ff6fae', ink: '#1d1414', art: '#f6e7c8' },
  ];
  const pw = Math.floor(posterW / posters.length);
  posters.forEach((p, idx) => {
    const px = posterX + idx * pw + 1;
    const py = 3 + (idx % 2) * 2;
    const width = pw - 2;
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.fillRect(px + 1, py + 1, width, 20);
    ctx.fillStyle = p.bg;
    ctx.fillRect(px, py, width, 20);
    ctx.fillStyle = p.art;
    ctx.fillRect(px + 3, py + 3, width - 6, 7);
    ctx.fillStyle = p.bg;
    ctx.fillRect(px + 5, py + 5, width - 10, 3);
    ctx.fillStyle = p.ink;
    ctx.fillRect(px + 2, py + 12, width - 4, 2);
    ctx.fillRect(px + 3, py + 16, width - 6, 1);
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.fillRect(px + width / 2 - 2, py - 1, 4, 2);
  });

  // 2. Polaroids on wire (x: 8, y: 1, w: 4, h: 1)
  const polaroidX = 8 * 16 + 2;
  const polaroidW = 4 * 16 - 4;
  ctx.fillStyle = '#9a9aa8';
  ctx.fillRect(polaroidX, 5, polaroidW, 1);
  const polaroidColors = ['#ff8a3d', '#3aa6a0', '#ff6fae', '#4a7fd1'];
  polaroidColors.forEach((col, idx) => {
    const px = polaroidX + 2 + idx * 15;
    const py = 6 + (idx % 2);
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.fillRect(px + 1, py + 1, 12, 15);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(px, py, 12, 15);
    ctx.fillStyle = col;
    ctx.fillRect(px + 1, py + 1, 10, 9);
    ctx.fillStyle = '#1d1414';
    ctx.fillRect(px + 5, py + 3, 2, 2);
    ctx.fillRect(px + 4, py + 5, 4, 5);
    ctx.fillStyle = '#e0a526';
    ctx.fillRect(px + 5, py - 1, 2, 2);
  });

  // 3. Stairs up (x: 12, y: 2)
  const stairX = 12 * 16;
  const stairY = 3 * 16;
  ctx.fillStyle = '#33110f';
  ctx.fillRect(stairX, 0, 32, stairY);
  const steps = ['#c4844f', '#b0743f', '#9a6236', '#8a5530', '#7d4c28', '#5e3a22'];
  steps.forEach((c, idx) => {
    const sy = stairY - (idx + 1) * 8;
    ctx.fillStyle = c;
    ctx.fillRect(stairX + 3, sy, 28, 6);
    ctx.fillStyle = 'rgba(0,0,0,0.35)';
    ctx.fillRect(stairX + 3, sy + 6, 28, 2);
  });
  ctx.fillStyle = '#1d1414';
  ctx.fillRect(stairX + 1, 0, 2, stairY);
  ctx.fillStyle = '#8a5530';
  ctx.fillRect(stairX + 1, 0, 1, stairY - 8);
  ctx.fillStyle = '#1d1414';
  ctx.fillRect(stairX, stairY - 11, 4, 11);
  ctx.fillStyle = '#e0a526';
  ctx.fillRect(stairX, stairY - 11, 4, 2);

  // 4. Jukebox (x: 1, y: 3, w: 2, h: 2)
  const jx = 1 * 16;
  const jy = 3 * 16 - 10;
  const jw = 2 * 16;
  const jh = 2 * 16 + 10;
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  ctx.fillRect(jx + 3, jy + jh, jw - 2, 3);
  ctx.fillStyle = '#1d1414';
  ctx.fillRect(jx + 5, jy, jw - 10, 2);
  ctx.fillRect(jx + 2, jy + 2, jw - 4, 2);
  ctx.fillRect(jx + 1, jy + 4, jw - 2, jh - 4);
  ctx.fillStyle = '#8a4a24';
  ctx.fillRect(jx + 3, jy + 3, jw - 6, jh - 4);
  ctx.fillStyle = '#a65e30';
  ctx.fillRect(jx + 6, jy + 1, jw - 12, 2);
  ctx.fillStyle = '#d8d8e0';
  ctx.fillRect(jx + 6, jy + 4, jw - 12, 1);
  ctx.fillRect(jx + 6, jy + jh - 3, jw - 12, 1);
  // Display window
  ctx.fillStyle = '#1d1414';
  ctx.fillRect(jx + 7, jy + 14, jw - 14, 9);
  ctx.fillStyle = '#f6e7c8';
  ctx.fillRect(jx + 8, jy + 15, jw - 16, 7);
  for (let t = 0; t < 3; t++) {
    ctx.fillStyle = '#a08060';
    ctx.fillRect(jx + 9, jy + 16 + t * 2, jw - 18, 1);
  }
  // Speaker grille
  ctx.fillStyle = '#3a2015';
  ctx.fillRect(jx + 7, jy + 26, jw - 14, 12);
  for (let t = 0; t < 5; t++) {
    ctx.fillStyle = '#9a9aa8';
    ctx.fillRect(jx + 9 + t * 3, jy + 27, 1, 10);
  }
  ctx.fillStyle = '#d8d8e0';
  ctx.fillRect(jx + jw / 2 - 3, jy + 24, 6, 1);

  // Animated jukebox neon tubes
  const neonPalette = ['#ff6fae', '#e0a526', '#3aa6a0', '#ff8a3d'];
  const tubeColor = neonPalette[Math.floor(tick * 0.05) % neonPalette.length];
  ctx.fillStyle = tubeColor;
  ctx.fillRect(jx + 7, jy + 6, jw - 14, 6);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(jx + 8, jy + 7, 4, 1);
  for (const lx of [jx + 3, jx + jw - 5]) {
    ctx.fillStyle = '#2a1a10';
    ctx.fillRect(lx, jy + 6, 2, 30);
    for (let s = 0; s < 4; s++) {
      const ly = jy + 34 - (Math.floor(tick * 0.05) * 3 + s * 8) % 28;
      ctx.fillStyle = neonPalette[(s + Math.floor(tick * 0.05)) % neonPalette.length];
      ctx.fillRect(lx, ly, 2, 2);
    }
  }

  // 5. The Closet (clothes rack at x: 9, y: 5, w: 3, h: 1)
  const cx = 9 * 16;
  const cy = 5 * 16;
  const cw = 3 * 16;
  ctx.fillStyle = 'rgba(0,0,0,0.2)';
  ctx.fillRect(cx + 2, cy + 15, cw - 2, 3);
  ctx.fillStyle = '#1d1414';
  ctx.fillRect(cx + 1, cy - 12, cw - 2, 3);
  ctx.fillStyle = '#d8d8e0';
  ctx.fillRect(cx + 2, cy - 11, cw - 4, 1);
  for (const leg of [cx + 2, cx + cw - 4]) {
    ctx.fillStyle = '#1d1414';
    ctx.fillRect(leg, cy - 12, 2, 28);
    ctx.fillStyle = '#9a9aa8';
    ctx.fillRect(leg, cy + 14, 3, 2);
  }
  const garments = [
    { c: '#e0a526', long: false },
    { c: '#3b5d8f', long: true },
    { c: '#ff6fae', long: false },
    { c: '#f6e7c8', long: false },
    { c: '#5a3a2a', long: true },
    { c: '#3aa6a0', long: false },
  ];
  garments.forEach((g, idx) => {
    const a = cx + 6 + idx * 6;
    const o = g.long ? 22 : 15;
    ctx.fillStyle = '#9a9aa8';
    ctx.fillRect(a + 2, cy - 10, 1, 2);
    ctx.fillStyle = '#1d1414';
    ctx.fillRect(a - 1, cy - 8, 7, o + 1);
    ctx.fillStyle = g.c;
    ctx.fillRect(a, cy - 7, 5, o - 1);
  });
  ctx.fillStyle = '#f6e7c8';
  ctx.fillRect(cx + cw - 9, cy - 6, 4, 5);
  ctx.fillStyle = '#6b2a2a';
  ctx.fillRect(cx + cw - 8, cy - 4, 2, 1);

  // 6. Record Crates (x: 5, y: 6, w: 4, h: 1)
  const rcX = 5 * 16;
  const rcY = 6 * 16;
  const rcW = 4 * 16;
  ctx.fillStyle = 'rgba(0,0,0,0.2)';
  ctx.fillRect(rcX + 2, rcY + 15, rcW, 3);
  const spineColors = ['#e0a526', '#3aa6a0', '#ff6fae', '#f6e7c8', '#4a7fd1', '#ff8a3d', '#8a6fbf', '#ffffff'];
  for (let t = 0; t < 3; t++) {
    const boxX = rcX + 1 + t * 21;
    for (let v = 0; v < 6; v++) {
      const o = 8 + ((t * 7 + v * 3) % 4);
      ctx.fillStyle = '#1d1414';
      ctx.fillRect(boxX + 1 + v * 3, rcY + 6 - o + 4, 3, o);
      ctx.fillStyle = spineColors[(t * 3 + v) % spineColors.length];
      ctx.fillRect(boxX + 1 + v * 3, rcY + 7 - o + 4, 2, o - 1);
    }
    ctx.fillStyle = '#1d1414';
    ctx.fillRect(boxX, rcY + 4, 20, 12);
    ctx.fillStyle = '#c98f5c';
    ctx.fillRect(boxX + 1, rcY + 5, 18, 10);
    ctx.fillStyle = '#9c6a3f';
    ctx.fillRect(boxX + 1, rcY + 9, 18, 1);
    ctx.fillRect(boxX + 1, rcY + 12, 18, 1);
    ctx.fillStyle = '#7a4f2a';
    ctx.fillRect(boxX + 7, rcY + 6, 6, 2);
  }

  // 7. Full-Length Mirror (x: 13, y: 8, w: 1, h: 2)
  const mx = 13 * 16 + 2;
  const my = 8 * 16 - 8;
  ctx.fillStyle = 'rgba(0,0,0,0.2)';
  ctx.fillRect(mx + 2, my + 40, 12, 3);
  ctx.fillStyle = '#1d1414';
  ctx.fillRect(mx, my, 12, 40);
  ctx.fillStyle = '#e0a526';
  ctx.fillRect(mx + 1, my + 1, 10, 38);
  ctx.fillStyle = '#bcd8e0';
  ctx.fillRect(mx + 2, my + 3, 8, 34);
  ctx.fillStyle = '#e6f4f7';
  ctx.fillRect(mx + 3, my + 5, 2, 10);
  ctx.fillRect(mx + 6, my + 8, 1, 4);

  // 8. DJ Booth Decks (x: 5, y: 9, w: 3, h: 1)
  const dx = 5 * 16;
  const dy = 9 * 16;
  const dw = 3 * 16;
  ctx.fillStyle = 'rgba(0,0,0,0.2)';
  ctx.fillRect(dx + 2, dy + 15, dw, 3);
  ctx.fillStyle = '#1d1414';
  ctx.fillRect(dx, dy - 4, dw, 20);
  ctx.fillStyle = '#2b2228';
  ctx.fillRect(dx + 1, dy - 3, dw - 2, 9);
  ctx.fillStyle = '#6b2a2a';
  ctx.fillRect(dx + 1, dy + 6, dw - 2, 9);
  ctx.fillStyle = '#e0a526';
  ctx.fillRect(dx + 1, dy + 6, dw - 2, 1);

  ctx.save();
  ctx.font = 'bold 7px monospace';
  ctx.fillStyle = '#f6e7c8';
  ctx.fillText('DJ', dx + dw / 2 - 5, dy + 13);
  ctx.restore();

  for (const tx of [dx + 3, dx + dw - 19]) {
    ctx.fillStyle = '#4a4048';
    ctx.fillRect(tx, dy - 3, 16, 9);
    ctx.fillStyle = '#9a9aa8';
    ctx.fillRect(tx + 13, dy - 2, 1, 6);
    ctx.fillStyle = '#141010';
    ctx.beginPath();
    ctx.arc(tx + 7, dy + 1.5, 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = tx === dx + 3 ? '#ff6fae' : '#e0a526';
    ctx.fillRect(tx + 6, dy + 1, 2, 2);
  }
  ctx.fillStyle = '#4a4048';
  ctx.fillRect(dx + 20, dy - 3, 8, 9);
  for (let s = 0; s < 3; s++) {
    ctx.fillStyle = s === 1 ? '#ff6fae' : '#f6e7c8';
    ctx.fillRect(dx + 21 + s * 2, dy - 1 + (s % 2) * 2, 1, 2);
  }

  // 9. Register Counter (x: 1, y: 11, w: 2, h: 1)
  const cntX = 1 * 16;
  const cntY = 11 * 16;
  const cntW = 2 * 16;
  ctx.fillStyle = 'rgba(0,0,0,0.2)';
  ctx.fillRect(cntX + 2, cntY + 15, cntW, 3);
  ctx.fillStyle = '#1d1414';
  ctx.fillRect(cntX, cntY - 2, cntW, 18);
  ctx.fillStyle = '#7a4f2a';
  ctx.fillRect(cntX + 1, cntY - 1, cntW - 2, 4);
  ctx.fillStyle = '#5c3a1e';
  ctx.fillRect(cntX + 1, cntY + 3, cntW - 2, 12);
  ctx.fillStyle = '#6e4626';
  ctx.fillRect(cntX + 4, cntY + 6, cntW - 8, 6);
  ctx.fillStyle = '#1d1414';
  ctx.fillRect(cntX + 4, cntY - 7, 10, 6);
  ctx.fillStyle = '#e0a526';
  ctx.fillRect(cntX + 5, cntY - 6, 8, 4);
  ctx.fillStyle = '#bfe6c0';
  ctx.fillRect(cntX + 6, cntY - 5, 6, 2);
  ctx.fillStyle = '#1d1414';
  ctx.fillRect(cntX + 20, cntY - 6, 8, 6);
  ctx.fillStyle = '#c9a46a';
  ctx.fillRect(cntX + 21, cntY - 5, 6, 5);

  // 10. Plant (x: 13, y: 12, w: 1, h: 1)
  const plX = 13 * 16;
  const plY = 12 * 16;
  ctx.fillStyle = '#2f8a55';
  ctx.fillRect(plX + 3, plY - 4, 10, 8);
  ctx.fillStyle = '#47b06f';
  ctx.fillRect(plX + 5, plY - 6, 6, 6);
  ctx.fillStyle = '#236b42';
  ctx.fillRect(plX + 2, plY + 1, 3, 3);
  ctx.fillRect(plX + 11, plY + 1, 3, 3);
  ctx.fillStyle = '#1d1414';
  ctx.fillRect(plX + 4, plY + 6, 8, 9);
  ctx.fillStyle = '#e0a526';
  ctx.fillRect(plX + 5, plY + 7, 6, 7);

  // 11. Motorbike (x: 10, y: 12, w: 2, h: 1)
  const mbX = 10 * 16;
  const mbY = 12 * 16;
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  ctx.fillRect(mbX + 2, mbY + 13, 26, 3);
  ctx.fillStyle = '#141010';
  ctx.fillRect(mbX + 3, mbY + 8, 6, 6);
  ctx.fillRect(mbX + 19, mbY + 8, 6, 6);
  ctx.fillStyle = '#d8d8e0';
  ctx.fillRect(mbX + 5, mbY + 10, 2, 2);
  ctx.fillRect(mbX + 21, mbY + 10, 2, 2);
  ctx.fillStyle = '#c4472a';
  ctx.fillRect(mbX + 7, mbY + 4, 14, 6);
  ctx.fillStyle = '#ff7a59';
  ctx.fillRect(mbX + 9, mbY + 2, 8, 4);
  ctx.fillStyle = '#2b1a10';
  ctx.fillRect(mbX + 8, mbY + 1, 6, 2);
  ctx.fillStyle = '#9a9aa8';
  ctx.fillRect(mbX + 19, mbY - 1, 2, 6);
  ctx.fillStyle = '#ffd166';
  ctx.fillRect(mbX + 22, mbY + 2, 3, 2);

  // 12. Door Exit Mat (x: 7, y: 14, w: 1, h: 1)
  const emX = 7 * 16;
  const emY = 14 * 16;
  ctx.fillStyle = '#9a6236';
  ctx.fillRect(emX, emY, 16, 16);
  ctx.fillStyle = '#33110f';
  ctx.fillRect(emX + 1, emY + 1, 14, 13);
  ctx.fillStyle = '#6b2a2a';
  ctx.fillRect(emX + 2, emY + 2, 12, 11);
  for (let t = 0; t < 4; t++) {
    ctx.fillStyle = '#e0a526';
    ctx.fillRect(emX + 4 + t, emY + 4 + t, 1, 2);
    ctx.fillRect(emX + 11 - t, emY + 4 + t, 1, 2);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// HOME 2F — ZULFAN'S PLACE (Lounge, Workstation, TV & Balcony)
// ─────────────────────────────────────────────────────────────────────────────

export const HOME2F_COLS = 15;
export const HOME2F_ROWS = 13;
export const HOME2F_SPAWN: { x: number; y: number; dir: Dir } = { x: 12, y: 4, dir: 'down' };

export const HOME2F_COLLISION: Uint8Array = new Uint8Array(HOME2F_COLS * HOME2F_ROWS);

// Populate 2F walls (Rows 0-1 are top wall, row 12 is bottom wall, col 0 & 14 are side borders)
for (let y = 0; y < HOME2F_ROWS; y++) {
  for (let x = 0; x < HOME2F_COLS; x++) {
    if (y < 2) HOME2F_COLLISION[y * HOME2F_COLS + x] = 1;
    if (x === 0 || x === HOME2F_COLS - 1) HOME2F_COLLISION[y * HOME2F_COLS + x] = 1;
    if (y === HOME2F_ROWS - 1) HOME2F_COLLISION[y * HOME2F_COLS + x] = 1;
  }
}

function mark2FSolid(x: number, y: number, w: number, h: number) {
  for (let dy = 0; dy < h; dy++) {
    for (let dx = 0; dx < w; dx++) {
      const idx = (y + dy) * HOME2F_COLS + (x + dx);
      if (idx >= 0 && idx < HOME2F_COLLISION.length) {
        HOME2F_COLLISION[idx] = 1;
      }
    }
  }
}

// Solid 2F furniture
mark2FSolid(1, 2, 1, 2);   // Fridge
mark2FSolid(5, 2, 3, 1);   // TV Media Console
// (12, 2) is walkable stairs down to 1F
mark2FSolid(4, 6, 5, 1);   // Couch & Twin
mark2FSolid(9, 6, 1, 1);   // Coffee Table
mark2FSolid(11, 9, 2, 1);  // Computer Desk
mark2FSolid(11, 10, 2, 1); // Swivel Chair
mark2FSolid(1, 11, 1, 1);  // Areca Palm Plant
mark2FSolid(13, 11, 1, 1); // Lucky Bamboo Plant

export const HOME2F_PROPS: RoomProp[] = [
  {
    id: 'home2f-fridge',
    name: 'Fridge',
    x: 1,
    y: 2,
    w: 1,
    h: 2,
    lines: [
      "Zulfan's fridge, covered in sticky notes, reminder memos, and campus project stickers.",
      'Leave a note on the fridge or check out the latest tech stack updates on the right panel!',
    ],
  },
  {
    id: 'home2f-tv',
    name: 'TV',
    x: 5,
    y: 2,
    w: 3,
    h: 1,
    lines: [
      'A retro CRT television hooked up to an old console.',
      'It works! Playing pixel-art demos, UAV detection recordings, and computer vision feeds.',
    ],
  },
  {
    id: 'home2f-twin',
    name: 'Digital Twin',
    x: 6,
    y: 6,
    w: 1,
    h: 1,
    lines: [
      "Zulfan's Digital Twin relaxing on the comfy couch.",
      'Say hi! He knows all about computer vision (YOLOv11), IoT, robotics, and cloud-native backends.',
    ],
  },
  {
    id: 'home2f-computer',
    name: 'Computer',
    x: 11,
    y: 9,
    w: 2,
    h: 1,
    lines: [
      "Zulfan's developer workstation running Linux and Neovim.",
      'Active session: TensorRT inference benchmark (1.8 ms/frame) & distributed Kafka event pipeline.',
    ],
  },
  {
    id: 'home2f-couch',
    name: 'Couch',
    x: 4,
    y: 6,
    w: 5,
    h: 1,
    lines: ['A comfy retro green sofa. The digital twin has claimed the middle seat with his laptop.'],
  },
  {
    id: 'home2f-coffee',
    name: 'Coffee',
    x: 9,
    y: 6,
    w: 1,
    h: 1,
    lines: ['A freshly brewed iced coffee in a glass mug. Fuel for late-night software engineering.'],
  },
  {
    id: 'home2f-palm',
    name: 'Areca Palm',
    x: 1,
    y: 11,
    w: 1,
    h: 1,
    lines: ['An areca palm plant in an indigo ceramic pot. It adds a peaceful touch to the workstation.'],
  },
  {
    id: 'home2f-bamboo',
    name: 'Lucky Bamboo',
    x: 13,
    y: 11,
    w: 1,
    h: 1,
    lines: ['Lucky bamboo in a decorative ceramic container, thriving beside the window.'],
  },
  {
    id: 'home2f-stairs-down',
    name: 'Downstairs',
    x: 12,
    y: 2,
    w: 2,
    h: 1,
    lines: [
      'Stairs leading back down to the Crate & Closet shop (1F).',
      'Take the stairs down to explore vinyl records, the DJ booth, and the exit mat.',
    ],
    action: { label: 'Go Downstairs' },
  },
];

/**
 * Render Home 2F Parquet Floor, Center Red Rug, and Bottom Baseboard
 */
export function renderHome2FFloor(ctx: CanvasRenderingContext2D) {
  // 1. Parquet tiles for walkable floor (rows 2 to 11)
  for (let r = 2; r < 12; r++) {
    for (let c = 1; c < HOME2F_COLS - 1; c++) {
      drawParquetTile(ctx, c, r);
    }
  }

  // 2. Large red living room rug in the center (bounds: 52, 50, 104, 42)
  ctx.fillStyle = '#e0b040';
  ctx.fillRect(52, 50, 104, 42); // Gold fringe
  ctx.fillStyle = '#a8322d';
  ctx.fillRect(54, 52, 100, 38); // Deep crimson border
  ctx.fillStyle = '#c4473d';
  ctx.fillRect(58, 56, 92, 30);  // Rich red center

  // Stitched fringe details
  ctx.fillStyle = '#e0b040';
  for (let t = 56; t < 152; t += 6) {
    ctx.fillRect(t, 53, 2, 1);
    ctx.fillRect(t, 88, 2, 1);
  }

  // 3. Bottom baseboard wall at row 12
  const botY = 12 * 16;
  const fullW = HOME2F_COLS * 16;
  ctx.fillStyle = '#5e3a22';
  ctx.fillRect(0, botY, fullW, 16);
  ctx.fillStyle = '#e9b949';
  ctx.fillRect(0, botY + 3, fullW, 10);
  ctx.fillStyle = '#7a4d2e';
  ctx.fillRect(0, botY, fullW, 1);

  // Decorative panel inserts on bottom wall
  for (const c of [3, 10]) {
    const px = c * 16;
    ctx.fillStyle = '#2b1d14';
    ctx.fillRect(px, botY + 2, 32, 12);
    ctx.fillStyle = '#bfe3ee';
    ctx.fillRect(px + 1, botY + 3, 30, 10);
    for (const subX of [px + 1, px + 16]) {
      ctx.fillStyle = '#2f6b4f';
      ctx.fillRect(subX, botY + 3, 15, 10);
      for (let s = 0; s < 4; s++) {
        ctx.fillStyle = '#22503a';
        ctx.fillRect(subX, botY + 4 + s * 2, 15, 1);
      }
    }
  }
}

/**
 * Render Home 2F Walls, Flags, Analogue Clock, Window, Lanterns & Stairwell
 */
export function renderHome2FWalls(ctx: CanvasRenderingContext2D, tick: number) {
  const fullW = HOME2F_COLS * 16;

  // 1. Top slatted wall (rows 0 & 1 = 32px height)
  ctx.fillStyle = '#e9b949';
  ctx.fillRect(0, 0, fullW, 32);

  // Horizontal wood plank slats
  for (let i = 0; i < 32 / 3; i++) {
    const rx = ((i * 37) % fullW);
    const ry = 5 + ((i * 19) % 20);
    ctx.fillStyle = '#d6a63c';
    ctx.fillRect(rx, ry, 2, 1);
  }
  ctx.fillStyle = '#5e3a22';
  ctx.fillRect(0, 0, fullW, 4);
  ctx.fillStyle = '#432817';
  ctx.fillRect(0, 4, fullW, 1);
  ctx.fillStyle = '#5e3a22';
  ctx.fillRect(0, 28, fullW, 4);
  ctx.fillStyle = '#7a4d2e';
  ctx.fillRect(0, 28, fullW, 1);

  // Left and right wall pillars
  for (let r = 2; r < HOME2F_ROWS - 1; r++) {
    ctx.fillStyle = '#5e3a22';
    ctx.fillRect(0, r * 16, 16, 16);
    ctx.fillRect(fullW - 16, r * 16, 16, 16);
    ctx.fillStyle = '#7a4d2e';
    ctx.fillRect(15, 32, 1, (HOME2F_ROWS - 3) * 16);
    ctx.fillRect(fullW - 16, 32, 1, (HOME2F_ROWS - 3) * 16);
  }

  // 2. Hanging Lanterns (x: 24, x: 84)
  for (const lx of [24, 84]) {
    ctx.fillStyle = '#2b1d14';
    ctx.fillRect(lx, 4, 1, 4);
    ctx.fillStyle = '#e0b040';
    ctx.fillRect(lx - 2, 8, 5, 1);
    ctx.fillStyle = '#c8322b';
    ctx.fillRect(lx - 4, 9, 9, 7);
    ctx.fillRect(lx - 3, 8, 7, 9);
    ctx.fillStyle = '#e85a3c';
    ctx.fillRect(lx - 2, 9, 2, 7);
    ctx.fillStyle = '#a8231c';
    ctx.fillRect(lx + 2, 9, 1, 7);
    ctx.fillStyle = '#e0b040';
    ctx.fillRect(lx - 2, 17, 5, 1);
    ctx.fillRect(lx, 18, 1, 4);

    // Warm ambient flicker
    const fAlpha = 0.12 + Math.sin(tick * 0.1 + lx) * 0.03;
    ctx.fillStyle = `rgba(255, 190, 90, ${fAlpha})`;
    ctx.fillRect(lx - 9, 4, 19, 20);
    ctx.fillRect(lx - 6, 1, 13, 26);
  }

  // 3. Indonesian Flag (Merah Putih) at x: 34, y: 7, w: 28, h: 18
  const f1X = 34;
  const f1Y = 7;
  // Rod and finials
  ctx.fillStyle = '#2b1d14';
  ctx.fillRect(f1X - 2, f1Y - 2, 32, 2);
  ctx.fillStyle = '#e0b040';
  ctx.fillRect(f1X - 3, f1Y - 2, 1, 2);
  ctx.fillRect(f1X + 30, f1Y - 2, 1, 2);
  // Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.18)';
  ctx.fillRect(f1X + 1, f1Y + 1, 28, 19);
  // Top half: Red
  ctx.fillStyle = '#da251d';
  ctx.fillRect(f1X, f1Y, 28, 9);
  // Bottom half: White
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(f1X, f1Y + 9, 28, 9);
  ctx.fillStyle = '#b81d16';
  ctx.fillRect(f1X, f1Y + 8, 28, 1);

  // 4. Analogue Wall Clock at (72, 15)
  const clkX = 72;
  const clkY = 15;
  for (let dy = -7; dy <= 7; dy++) {
    for (let dx = -7; dx <= 7; dx++) {
      const distSq = dx * dx + dy * dy;
      if (distSq <= 49) {
        if (distSq > 36) ctx.fillStyle = '#2b1d14';
        else if (distSq > 25) ctx.fillStyle = '#7a4d2e';
        else ctx.fillStyle = '#fffaf0';
        ctx.fillRect(clkX + dx, clkY + dy, 1, 1);
      }
    }
  }
  // Clock ticks at 12, 3, 6, 9
  ctx.fillStyle = '#2b1d14';
  ctx.fillRect(clkX, clkY - 4, 1, 1);
  ctx.fillRect(clkX + 4, clkY, 1, 1);
  ctx.fillRect(clkX, clkY + 4, 1, 1);
  ctx.fillRect(clkX - 4, clkY, 1, 1);

  // Clock hands (animated with real time)
  const now = new Date();
  const h = now.getHours();
  const m = now.getMinutes();
  const hourAngle = ((h % 12 + m / 60) / 12) * Math.PI * 2 - Math.PI / 2;
  const minAngle = (m / 60) * Math.PI * 2 - Math.PI / 2;
  // Hour hand (length 3)
  for (let i = 1; i <= 3; i++) {
    ctx.fillRect(clkX + Math.round(Math.cos(hourAngle) * i), clkY + Math.round(Math.sin(hourAngle) * i), 1, 1);
  }
  // Minute hand (length 5, crimson)
  ctx.fillStyle = '#da251d';
  for (let i = 1; i <= 5; i++) {
    ctx.fillRect(clkX + Math.round(Math.sin(minAngle + Math.PI / 2) * i), clkY + Math.round(Math.cos(minAngle - Math.PI / 2) * i), 1, 1);
  }
  ctx.fillStyle = '#2b1d14';
  ctx.fillRect(clkX, clkY, 1, 1);

  // 5. ITENAS / Robotics Pennant Flag at x: 130, y: 7
  const f2X = 130;
  const f2Y = 7;
  ctx.fillStyle = '#2b1d14';
  ctx.fillRect(f2X - 2, f2Y - 2, 32, 2);
  ctx.fillStyle = '#e0b040';
  ctx.fillRect(f2X - 3, f2Y - 2, 1, 2);
  ctx.fillRect(f2X + 30, f2Y - 2, 1, 2);
  ctx.fillStyle = 'rgba(0,0,0,0.18)';
  ctx.fillRect(f2X + 1, f2Y + 1, 28, 19);
  ctx.fillStyle = '#1d1160';
  ctx.fillRect(f2X, f2Y, 28, 18);
  ctx.fillStyle = '#00788c';
  ctx.fillRect(f2X, f2Y, 28, 2);
  ctx.fillRect(f2X, f2Y + 16, 28, 2);
  // Drone/Bee pixel graphic
  ctx.fillStyle = '#00a3ad';
  ctx.fillRect(f2X + 11, f2Y + 4, 6, 3);
  ctx.fillStyle = '#fed141';
  ctx.fillRect(f2X + 8, f2Y + 7, 12, 4);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(f2X + 5, f2Y + 5, 4, 2);
  ctx.fillRect(f2X + 19, f2Y + 5, 4, 2);

  // 6. Guild / Informatics Flag at x: 164, y: 7
  const f3X = 164;
  const f3Y = 7;
  ctx.fillStyle = '#2b1d14';
  ctx.fillRect(f3X - 2, f3Y - 2, 32, 2);
  ctx.fillStyle = '#e0b040';
  ctx.fillRect(f3X - 3, f3Y - 2, 1, 2);
  ctx.fillRect(f3X + 30, f3Y - 2, 1, 2);
  ctx.fillStyle = 'rgba(0,0,0,0.18)';
  ctx.fillRect(f3X + 1, f3Y + 1, 28, 19);
  ctx.fillStyle = '#0b4f8a';
  ctx.fillRect(f3X, f3Y, 28, 18);
  ctx.fillStyle = '#fed141';
  ctx.fillRect(f3X, f3Y + 16, 28, 1);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(f3X, f3Y + 17, 28, 1);
  // Pixel emblem (∑ X or IF)
  ctx.fillStyle = '#fed141';
  // Sigma / I
  ctx.fillRect(f3X + 7, f3Y + 5, 5, 1);
  ctx.fillRect(f3X + 7, f3Y + 6, 2, 1);
  ctx.fillRect(f3X + 9, f3Y + 7, 2, 1);
  ctx.fillRect(f3X + 7, f3Y + 8, 2, 1);
  ctx.fillRect(f3X + 7, f3Y + 9, 5, 1);
  // Chi / F
  ctx.fillRect(f3X + 15, f3Y + 5, 2, 2);
  ctx.fillRect(f3X + 19, f3Y + 5, 2, 2);
  ctx.fillRect(f3X + 16, f3Y + 7, 4, 2);
  ctx.fillRect(f3X + 15, f3Y + 9, 2, 2);
  ctx.fillRect(f3X + 19, f3Y + 9, 2, 2);

  // 7. Window with Night View at x: 198, y: 7, w: 20, h: 16
  const winX = 198;
  const winY = 7;
  // Wooden frame
  ctx.fillStyle = '#432817';
  ctx.fillRect(winX - 2, winY - 2, 24, 20);
  // Night sky background
  ctx.fillStyle = '#141b3a';
  ctx.fillRect(winX, winY, 20, 8);
  ctx.fillStyle = '#2a3266';
  ctx.fillRect(winX, winY + 8, 20, 8);
  // Stars
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(winX + 2, winY + 2, 1, 1);
  ctx.fillRect(winX + 7, winY + 4, 1, 1);
  ctx.fillRect(winX + 11, winY + 1, 1, 1);
  ctx.fillRect(winX + 3, winY + 6, 1, 1);
  // Crescent moon
  ctx.fillStyle = '#fff3c4';
  ctx.fillRect(winX + 14, winY + 2, 3, 3);
  ctx.fillStyle = '#141b3a';
  ctx.fillRect(winX + 15, winY + 2, 2, 1);
  // Distant building rooftops with glowing windows
  ctx.fillStyle = '#2a2340';
  ctx.fillRect(winX + 1, winY + 10, 5, 6);
  ctx.fillStyle = '#352c4f';
  ctx.fillRect(winX + 7, winY + 8, 6, 8);
  ctx.fillStyle = '#2a2340';
  ctx.fillRect(winX + 14, winY + 11, 5, 5);
  ctx.fillStyle = '#ffd166';
  ctx.fillRect(winX + 9, winY + 10, 1, 1);
  ctx.fillRect(winX + 9, winY + 13, 1, 1);
  // Window mullions
  ctx.fillStyle = '#432817';
  ctx.fillRect(winX + 9, winY, 2, 16);
  ctx.fillRect(winX, winY + 7, 20, 1);
  // Green side curtains
  ctx.fillStyle = '#24533d';
  ctx.fillRect(winX - 6, winY - 2, 5, 20);
  ctx.fillRect(winX + 21, winY - 2, 5, 20);
  ctx.fillStyle = '#3f8a64';
  for (let cy = winY; cy < winY + 16; cy += 2) {
    ctx.fillRect(winX - 5, cy, 3, 1);
    ctx.fillRect(winX + 22, cy, 3, 1);
  }
  // Terracotta flower planter underneath
  ctx.fillStyle = '#7a4d2e';
  ctx.fillRect(winX - 4, winY + 18, 28, 2);
  ctx.fillStyle = '#4f9d4a';
  ctx.fillRect(winX + 1, winY + 16, 4, 2);
  ctx.fillRect(winX + 15, winY + 16, 4, 2);
  ctx.fillStyle = '#c9786a';
  ctx.fillRect(winX + 1, winY + 18, 4, 1);
  ctx.fillRect(winX + 15, winY + 18, 4, 1);

  // 8. Stairwell Down at x: 192 (Col 12), y: 32 (Row 2), w: 32, h: 32
  const swX = 12 * 16;
  const swY = 2 * 16;
  const swH = 32;
  ctx.fillStyle = '#2b1d14';
  ctx.fillRect(swX, swY, 32, swH);
  // Wooden steps descending
  const stepColors = ['#c4844f', '#b0703f', '#965a30', '#7a4d2e', '#5e3a22'];
  stepColors.forEach((color, idx) => {
    const sy = swY + swH - (idx + 1) * 6;
    ctx.fillStyle = color;
    ctx.fillRect(swX + 3, sy, 28, 4);
    ctx.fillStyle = 'rgba(0,0,0,0.4)';
    ctx.fillRect(swX + 3, sy + 4, 28, 2);
  });
  // Handrail
  ctx.fillStyle = '#432817';
  ctx.fillRect(swX, swY, 3, swH);
  ctx.fillStyle = '#7a4d2e';
  ctx.fillRect(swX + 1, swY, 1, swH - 2);
  ctx.fillStyle = '#432817';
  ctx.fillRect(swX - 1, swY + swH - 9, 4, 9);
  ctx.fillStyle = '#e0b040';
  ctx.fillRect(swX, swY + swH - 9, 2, 1);
}

/**
 * Render Home 2F Props (Fridge, TV & Console, Couch, Digital Twin, Desk, Swivel Chair, Plants)
 */
export function renderHome2FProps(ctx: CanvasRenderingContext2D, _tick: number) {
  // 1. Fridge at x: 1, y: 2 (w: 1, h: 2)
  const frX = 1 * 16;
  const frY = 2 * 16 - 8;
  const frH = 2 * 16 + 6;
  // Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  ctx.fillRect(frX + 2, frY + frH, 14, 2);
  // Main body
  ctx.fillStyle = '#2b1d14';
  ctx.fillRect(frX + 1, frY, 14, frH);
  ctx.fillStyle = '#9fd3c7';
  ctx.fillRect(frX + 2, frY + 1, 12, frH - 2);
  ctx.fillStyle = '#d4f0e8';
  ctx.fillRect(frX + 2, frY + 1, 1, frH - 2);
  ctx.fillStyle = '#7fb8ab';
  ctx.fillRect(frX + 13, frY + 1, 1, frH - 2);
  ctx.fillStyle = '#2b1d14';
  ctx.fillRect(frX + 2, frY + 11, 12, 1); // Split line
  // Handles
  ctx.fillStyle = '#c0c6cc';
  ctx.fillRect(frX + 11, frY + 4, 1, 5);
  ctx.fillRect(frX + 11, frY + 14, 1, 7);
  // Sticky notes (Yellow, Pink, Blue, Ivory)
  const notes = [
    { dx: 3, dy: 3, bg: '#fff6b8', pin: '#da251d' },
    { dx: 4, dy: 15, bg: '#ffd1dc', pin: '#e0b040' },
    { dx: 7, dy: 22, bg: '#cfe8ff', pin: '#6aa89f' },
    { dx: 3, dy: 28, bg: '#fff6b8', pin: '#2f6db5' },
  ];
  for (const n of notes) {
    ctx.fillStyle = n.bg;
    ctx.fillRect(frX + n.dx, frY + n.dy, 5, 5);
    ctx.fillStyle = '#7fb8ab';
    ctx.fillRect(frX + n.dx + 1, frY + n.dy + 2, 3, 1);
    ctx.fillStyle = n.pin;
    ctx.fillRect(frX + n.dx + 2, frY + n.dy, 1, 1);
  }

  // 2. Media Console & Retro CRT TV at x: 5, y: 2 (w: 3, h: 1)
  const tvX = 5 * 16;
  const tvY = 2 * 16;
  // Wooden Console
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  ctx.fillRect(tvX + 3, tvY + 14, 44, 3);
  ctx.fillStyle = '#2b1d14';
  ctx.fillRect(tvX + 1, tvY + 1, 46, 15);
  ctx.fillStyle = '#b0703f';
  ctx.fillRect(tvX + 2, tvY + 2, 44, 12);
  ctx.fillStyle = '#965a30';
  ctx.fillRect(tvX + 2, tvY + 8, 44, 1);
  ctx.fillRect(tvX + 23, tvY + 2, 1, 12);
  // Brass drawer handles
  ctx.fillStyle = '#e0b040';
  ctx.fillRect(tvX + 20, tvY + 5, 2, 1);
  ctx.fillRect(tvX + 26, tvY + 5, 2, 1);
  ctx.fillRect(tvX + 20, tvY + 11, 2, 1);
  ctx.fillRect(tvX + 26, tvY + 11, 2, 1);

  // CRT TV on top of console
  const crtX = tvX + 8;
  const crtY = tvY - 20;
  ctx.fillStyle = '#2b1d14';
  ctx.fillRect(crtX, crtY, 32, 22);
  ctx.fillStyle = '#cfc6b4';
  ctx.fillRect(crtX + 1, crtY + 1, 30, 20);
  ctx.fillStyle = '#2b1d14';
  ctx.fillRect(crtX + 3, crtY + 3, 20, 16);
  ctx.fillStyle = '#22303f';
  ctx.fillRect(crtX + 4, crtY + 4, 18, 14);
  // Screen reflection
  ctx.fillStyle = '#3d5266';
  ctx.fillRect(crtX + 5, crtY + 5, 3, 1);
  ctx.fillRect(crtX + 5, crtY + 6, 1, 2);
  // Glowing play button ▶ in center
  ctx.fillStyle = '#ffffff';
  for (let t = -3; t <= 3; t++) {
    ctx.fillRect(crtX + 11, crtY + 11 + t, 4 - Math.abs(t), 1);
  }
  // Dial knobs
  ctx.fillStyle = '#2b1d14';
  ctx.fillRect(crtX + 25, crtY + 4, 3, 3);
  ctx.fillStyle = '#e0b040';
  ctx.fillRect(crtX + 26, crtY + 5, 1, 1);
  ctx.fillStyle = '#2b1d14';
  ctx.fillRect(crtX + 25, crtY + 9, 3, 3);
  ctx.fillStyle = '#e0b040';
  ctx.fillRect(crtX + 26, crtY + 10, 1, 1);
  // Speaker grille
  ctx.fillStyle = '#9a917f';
  for (let s = 0; s < 3; s++) {
    ctx.fillRect(crtX + 24, crtY + 14 + s * 2, 5, 1);
  }
  // V-shape antenna
  const antX = crtX + 16;
  ctx.fillStyle = '#2b1d14';
  ctx.fillRect(antX - 3, crtY - 2, 6, 2);
  for (let a = 1; a <= 9; a++) {
    ctx.fillRect(antX - 2 - a, crtY - 2 - a, 1, 1);
    ctx.fillRect(antX + 1 + a, crtY - 2 - a, 1, 1);
  }
  ctx.fillStyle = '#c0c6cc';
  ctx.fillRect(antX - 12, crtY - 12, 2, 2);
  ctx.fillRect(antX + 10, crtY - 12, 2, 2);

  // 3. Comfy Teal Sofa & Digital Twin at x: 4, y: 6 (w: 5, h: 1)
  const couchX = 65;
  const couchW = 78;
  const couchY = 96;
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  ctx.fillRect(couchX + 2, couchY + 13, couchW, 3);
  // Throw pillows
  ctx.fillStyle = '#2b1d14';
  ctx.fillRect(couchX + 12, couchY - 5, 8, 6);
  ctx.fillStyle = '#c4473d';
  ctx.fillRect(couchX + 13, couchY - 4, 6, 5);
  ctx.fillStyle = '#2b1d14';
  ctx.fillRect(couchX + couchW - 20, couchY - 5, 8, 6);
  ctx.fillStyle = '#e0b040';
  ctx.fillRect(couchX + couchW - 19, couchY - 4, 6, 5);

  // Couch back & cushions
  const cInX = couchX + 4;
  const cInW = couchW - 8;
  ctx.fillStyle = '#2b1d14';
  ctx.fillRect(cInX, couchY - 1, cInW, 15);
  ctx.fillStyle = '#2e6b5a';
  ctx.fillRect(cInX + 1, couchY, cInW - 2, 13);
  ctx.fillStyle = '#3f8a74';
  ctx.fillRect(cInX + 1, couchY, cInW - 2, 2);
  ctx.fillStyle = '#22503f';
  ctx.fillRect(cInX + 1, couchY + 12, cInW - 2, 1);
  // Cushion dividers
  for (const div of [1, 2]) {
    ctx.fillStyle = '#22503f';
    ctx.fillRect(cInX + Math.round((cInW * div) / 3), couchY + 2, 1, 10);
  }
  // Couch feet
  ctx.fillStyle = '#2b1d14';
  ctx.fillRect(cInX + 4, couchY + 14, 2, 2);
  ctx.fillRect(cInX + cInW - 6, couchY + 14, 2, 2);
  // Couch armrests
  for (const armX of [couchX, couchX + couchW - 8]) {
    ctx.fillStyle = '#2b1d14';
    ctx.fillRect(armX, couchY - 4, 8, 18);
    ctx.fillStyle = '#22503f';
    ctx.fillRect(armX + 1, couchY - 3, 6, 16);
    ctx.fillStyle = '#2e6b5a';
    ctx.fillRect(armX + 1, couchY - 3, 6, 3);
    ctx.fillStyle = '#3f8a74';
    ctx.fillRect(armX + 2, couchY - 3, 4, 1);
  }

  // Digital Twin sitting on the couch in the middle (x: 104)
  const twX = 104;
  const twY = couchY - 15;
  // Hair
  ctx.fillStyle = '#141218';
  ctx.fillRect(twX - 3, twY, 7, 2);
  ctx.fillRect(twX - 4, twY + 1, 9, 2);
  // Face skin
  ctx.fillStyle = '#efc19c';
  ctx.fillRect(twX - 3, twY + 3, 7, 5);
  // Eyes
  ctx.fillStyle = '#141218';
  ctx.fillRect(twX - 2, twY + 4, 1, 2);
  ctx.fillRect(twX + 2, twY + 4, 1, 2);
  // Jacket / Torso
  ctx.fillStyle = '#e8473f';
  ctx.fillRect(twX - 4, twY + 8, 9, 5);
  ctx.fillStyle = '#2bb3a3';
  ctx.fillRect(twX - 2, twY + 8, 5, 5);
  ctx.fillStyle = '#f6e7c8';
  ctx.fillRect(twX - 1, twY + 8, 3, 5);
  // Legs / blue jeans
  ctx.fillStyle = '#1d2b53';
  ctx.fillRect(twX - 4, twY + 13, 9, 4);
  // Laptop on lap (silver shell with glowing screen)
  ctx.fillStyle = '#2b1d14';
  ctx.fillRect(twX + 2, twY + 7, 9, 8);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(twX + 3, twY + 8, 7, 6);
  ctx.fillStyle = '#2bb3a3';
  ctx.fillRect(twX + 4, twY + 10, 1, 1);
  ctx.fillRect(twX + 6, twY + 10, 1, 1);
  ctx.fillRect(twX + 8, twY + 10, 1, 1);

  // 4. Coffee Side Table / Phin at x: 9, y: 6
  const cfX = 9 * 16;
  const cfY = 6 * 16;
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  ctx.fillRect(cfX + 4, cfY + 14, 10, 2);
  ctx.fillStyle = '#2b1d14';
  ctx.fillRect(cfX + 1, cfY + 2, 14, 3);
  ctx.fillStyle = '#b0703f';
  ctx.fillRect(cfX + 2, cfY + 2, 12, 2);
  ctx.fillStyle = '#5e3a22';
  ctx.fillRect(cfX + 7, cfY + 5, 2, 9);
  ctx.fillRect(cfX + 4, cfY + 13, 8, 2);
  // Coffee mug with steam
  ctx.fillStyle = '#2b1d14';
  ctx.fillRect(cfX + 2, cfY - 7, 5, 9);
  ctx.fillStyle = '#5a3420';
  ctx.fillRect(cfX + 3, cfY - 6, 3, 4);
  ctx.fillStyle = '#f2e6cc';
  ctx.fillRect(cfX + 3, cfY - 2, 3, 3);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(cfX + 3, cfY - 6, 1, 1);
  // Metal coffee dripper (Phin)
  ctx.fillStyle = '#fffaf0';
  ctx.fillRect(cfX + 9, cfY - 2, 5, 4);
  ctx.fillStyle = '#c0c6cc';
  ctx.fillRect(cfX + 9, cfY - 7, 5, 5);
  ctx.fillStyle = '#8a929a';
  ctx.fillRect(cfX + 10, cfY - 8, 3, 1);

  // 5. Developer Workstation (Computer Desk) at x: 11, y: 9
  const dskX = 11 * 16;
  const dskY = 9 * 16;
  // Desk shadow & wood top
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  ctx.fillRect(dskX + 3, dskY + 14, 28, 2);
  ctx.fillStyle = '#2b1d14';
  ctx.fillRect(dskX + 1, dskY - 4, 30, 5);
  ctx.fillStyle = '#b0703f';
  ctx.fillRect(dskX + 2, dskY - 4, 28, 3);
  ctx.fillStyle = '#965a30';
  ctx.fillRect(dskX + 2, dskY - 1, 28, 1);
  // Desk legs and drawer unit
  ctx.fillStyle = '#2b1d14';
  ctx.fillRect(dskX + 3, dskY + 1, 2, 14);
  ctx.fillRect(dskX + 27, dskY + 1, 2, 14);
  ctx.fillStyle = '#965a30';
  ctx.fillRect(dskX + 19, dskY + 1, 8, 6);
  ctx.fillStyle = '#e0b040';
  ctx.fillRect(dskX + 22, dskY + 3, 2, 1);

  // Workstation CRT Monitor with Code Editor
  ctx.fillStyle = '#2b1d14';
  ctx.fillRect(dskX + 5, dskY - 24, 22, 16);
  ctx.fillStyle = '#0d1b14';
  ctx.fillRect(dskX + 6, dskY - 23, 20, 13);
  // Code lines in green, cyan, and gold
  const codeLines = [
    { dy: 1, w: 7, col: '#7dffb0' },
    { dy: 3, w: 14, col: '#59f0d0' },
    { dy: 5, w: 11, col: '#7dffb0' },
    { dy: 7, w: 13, col: '#ffd166' },
    { dy: 9, w: 4, col: '#7dffb0' },
  ];
  for (const cl of codeLines) {
    ctx.fillStyle = cl.col;
    ctx.fillRect(dskX + 8, dskY - 23 + cl.dy, cl.w, 1);
  }
  // Monitor stand
  ctx.fillStyle = '#2b1d14';
  ctx.fillRect(dskX + 15, dskY - 8, 2, 4);
  ctx.fillRect(dskX + 12, dskY - 5, 8, 1);
  // Keyboard & mouse
  ctx.fillStyle = '#d5dde8';
  ctx.fillRect(dskX + 8, dskY - 4, 12, 1);
  ctx.fillStyle = '#fffaf0';
  ctx.fillRect(dskX + 24, dskY - 7, 3, 3);
  ctx.fillStyle = '#c4605a';
  ctx.fillRect(dskX + 24, dskY - 6, 3, 1); // Mug coaster

  // 6. Ergonomic Desk Chair at x: 11, y: 10
  const chrX = 11 * 16 + 8;
  const chrY = 10 * 16;
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  ctx.fillRect(chrX + 1, chrY + 12, 14, 3);
  ctx.fillStyle = '#3a3a44';
  ctx.fillRect(chrX + 7, chrY + 9, 2, 4);
  ctx.fillRect(chrX + 2, chrY + 12, 12, 1);
  // Chair base wheels
  for (const wx of [chrX + 1, chrX + 7, chrX + 13]) {
    ctx.fillStyle = '#2b1d14';
    ctx.fillRect(wx, chrY + 13, 2, 2);
  }
  // Seat cushion & backrest
  ctx.fillStyle = '#2b1d14';
  ctx.fillRect(chrX + 1, chrY + 1, 14, 6);
  ctx.fillStyle = '#4a4a58';
  ctx.fillRect(chrX + 2, chrY + 2, 12, 4);
  ctx.fillStyle = '#2b1d14';
  ctx.fillRect(chrX + 3, chrY - 4, 10, 13);
  ctx.fillStyle = '#2f2f3a';
  ctx.fillRect(chrX + 4, chrY - 3, 8, 11);
  ctx.fillStyle = '#4a4a58';
  ctx.fillRect(chrX + 5, chrY - 2, 6, 1);
  ctx.fillStyle = '#3d3d4a';
  ctx.fillRect(chrX + 5, chrY + 4, 6, 2);

  // 7. Areca Palm Plant at x: 1, y: 11
  const pl1X = 1 * 16;
  const pl1Y = 11 * 16;
  const palmFronds = [
    { dx: 1, dy: -7, w: 5 },
    { dx: 10, dy: -7, w: 5 },
    { dx: 3, dy: -10, w: 4 },
    { dx: 9, dy: -10, w: 4 },
    { dx: 6, dy: -12, w: 4 },
    { dx: 0, dy: -3, w: 5 },
    { dx: 11, dy: -3, w: 5 },
  ];
  for (const f of palmFronds) {
    ctx.fillStyle = f.dy < -8 ? '#6dbb5b' : '#4f9d4a';
    ctx.fillRect(pl1X + f.dx, pl1Y + f.dy, f.w, 3);
  }
  ctx.fillStyle = '#3a7a3a';
  ctx.fillRect(pl1X + 7, pl1Y - 9, 2, 12);
  // Indigo ceramic pot
  ctx.fillStyle = '#2b1d14';
  ctx.fillRect(pl1X + 4, pl1Y + 4, 8, 10);
  ctx.fillStyle = '#2f6db5';
  ctx.fillRect(pl1X + 5, pl1Y + 5, 6, 8);
  ctx.fillStyle = '#fffaf0';
  ctx.fillRect(pl1X + 5, pl1Y + 7, 6, 1);
  ctx.fillRect(pl1X + 7, pl1Y + 9, 2, 2);

  // 8. Lucky Bamboo Plant at x: 13, y: 11
  const pl2X = 13 * 16;
  const pl2Y = 11 * 16;
  const bambooStalks = [
    { dx: 5, dy: -10 },
    { dx: 8, dy: -13 },
    { dx: 11, dy: -8 },
  ];
  for (const b of bambooStalks) {
    ctx.fillStyle = '#7cb342';
    ctx.fillRect(pl2X + b.dx, pl2Y + b.dy, 2, 14 - b.dy - 10);
    for (let sy = pl2Y + b.dy + 3; sy < pl2Y + 4; sy += 4) {
      ctx.fillStyle = '#558b2f';
      ctx.fillRect(pl2X + b.dx, sy, 2, 1);
    }
    ctx.fillStyle = '#8bc34a';
    ctx.fillRect(pl2X + b.dx + 2, pl2Y + b.dy + 1, 3, 1);
  }
  // Indigo pot
  ctx.fillStyle = '#2b1d14';
  ctx.fillRect(pl2X + 4, pl2Y + 4, 8, 10);
  ctx.fillStyle = '#2f6db5';
  ctx.fillRect(pl2X + 5, pl2Y + 5, 6, 8);
  ctx.fillStyle = '#fffaf0';
  ctx.fillRect(pl2X + 5, pl2Y + 7, 6, 1);
  ctx.fillRect(pl2X + 7, pl2Y + 9, 2, 2);
}

