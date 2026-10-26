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
markSolid(12, 2, 2, 1);  // Upstairs stairs
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
export function renderHomeFloor(ctx: CanvasRenderingContext2D) {
  for (let y = 2; y < HOME_ROWS - 1; y++) {
    for (let x = 1; x < HOME_COLS - 1; x++) {
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
