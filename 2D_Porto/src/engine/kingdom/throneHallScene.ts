import { TILE_SIZE } from '../sprites';
import { drawPixelText } from '../devScene';
import type { PokemonPMDAnimator } from '../pokemonPMDAnimator';
import {
  KINGDOM_INTERIOR_COLS,
  KINGDOM_INTERIOR_ROWS,
  KINGDOM_INTERIOR_SPAWN,
  getRoyalCrests,
  type KingdomInteriorProp,
} from '../kingdomInteriorShared';
import {
  createStandardKingdomCollision,
  drawKingdomGuardians,
  drawKingdomTorch,
  renderKingdomWaves,
  type GuardianPlacement,
} from './kingdomSceneBase';

export const THRONE_COLS = KINGDOM_INTERIOR_COLS;
export const THRONE_ROWS = KINGDOM_INTERIOR_ROWS;
export const THRONE_SPAWN = KINGDOM_INTERIOR_SPAWN;
export const THRONE_COLLISION = createStandardKingdomCollision(false);

export const THRONE_PROPS: KingdomInteriorProp[] = [
  {
    id: 'solgaleo',
    kind: 'npc',
    x: 7,
    y: 2,
    w: 1,
    h: 1,
    target: { type: 'event', name: 'solgaleo' },
    label: '🦁 Solgaleo',
    style: 'solgaleo',
    labelLift: 20,
    hint: 'Begin 3-Round Royal Audience with King Solgaleo 👑',
    scrollTarget: 'throne-audience-section',
  },
  {
    id: 'royal-throne',
    kind: 'prop',
    x: 6,
    y: 1,
    w: 3,
    h: 2,
    target: { type: 'event', name: 'royal-throne' },
    label: '👑 Sun Throne',
    style: 'throne',
    labelLift: 22,
    hint: 'Inspect the Golden Sun Lion Throne 👑',
    scrollTarget: 'throne-audience-section',
  },
  {
    id: 'royal-charter',
    kind: 'prop',
    x: 1,
    y: 3,
    w: 2,
    h: 2,
    target: { type: 'event', name: 'royal-charter' },
    label: '📜 Royal Charter',
    style: 'charter',
    labelLift: 12,
    hint: 'Read Illuminated Profile & Education Charter 📜',
    scrollTarget: 'throne-charter-section',
  },
  {
    id: 'treasury-coffer',
    kind: 'prop',
    x: 12,
    y: 3,
    w: 2,
    h: 2,
    target: { type: 'event', name: 'treasury-coffer' },
    label: '💎 Sovereign Chest',
    style: 'coffer',
    labelLift: 12,
    hint: 'Open Royal Treasury, Solar Buff & 7 Crests Registry 💎',
    scrollTarget: 'throne-relic-section',
  },
  {
    id: 'omnimon',
    kind: 'npc',
    x: 2,
    y: 6,
    w: 1,
    h: 1,
    target: { type: 'event', name: 'omnimon' },
    label: '⚔️ Omnimon',
    style: 'omnimon',
    labelLift: 18,
    hint: 'Consult Royal Knight Omnimon ⚔️',
    scrollTarget: 'throne-audience-section',
  },
  {
    id: 'gallantmon',
    kind: 'npc',
    x: 12,
    y: 6,
    w: 1,
    h: 1,
    target: { type: 'event', name: 'gallantmon' },
    label: '🛡️ Gallantmon',
    style: 'gallantmon',
    labelLift: 18,
    hint: 'Consult Crimson Paladin Gallantmon 🛡️',
    scrollTarget: 'throne-charter-section',
  },
  {
    id: 'sovereign-seal',
    kind: 'prop',
    x: 7,
    y: 6,
    w: 1,
    h: 1,
    target: { type: 'event', name: 'sovereign-seal' },
    label: '☀️ Sun Crest',
    style: 'pedestal',
    labelLift: 16,
    hint: 'Channel Central Solar Crest Pedestal ☀️',
    scrollTarget: 'throne-relic-section',
  },
  {
    id: 'vanguard-display',
    kind: 'prop',
    x: 1,
    y: 8,
    w: 2,
    h: 2,
    target: { type: 'event', name: 'vanguard-display' },
    label: '🛡️ Knight Armor',
    style: 'armor',
    labelLift: 12,
    hint: 'Inspect Ceremonial Lion-Crest Armor 🦁',
    scrollTarget: 'throne-charter-section',
  },
  {
    id: 'diplomacy-lectern',
    kind: 'prop',
    x: 12,
    y: 8,
    w: 2,
    h: 2,
    target: { type: 'event', name: 'diplomacy-lectern' },
    label: '✉️ Envoy Desk',
    style: 'desk',
    labelLift: 12,
    hint: 'Open Royal CV & Direct Contact Envoys ✉️',
    scrollTarget: 'throne-charter-section',
  },
  {
    id: 'exit',
    kind: 'exit',
    x: 7,
    y: 11,
    w: 1,
    h: 1,
    target: { type: 'place', id: 'kingdom' },
    label: 'Exit',
    style: 'exit',
    hideLabel: true,
  },
];

const GUARDIANS: GuardianPlacement[] = [
  { kind: 'pmd', id: 'solgaleo', tx: 7, ty: 2, facing: 'down', scaleFactor: 0.72, fallbackColor: '#fbbf24' },
  { kind: 'digimon', id: 'omnimon', tx: 2, ty: 6, facing: 'right', scaleFactor: 0.82, fallbackColor: '#e2e8f0' },
  { kind: 'digimon', id: 'gallantmon', tx: 12, ty: 6, facing: 'left', scaleFactor: 0.82, fallbackColor: '#dc2626' },
];

const SUNLIGHT_MOTES = Array.from({ length: 16 }, (_, i) => ({
  x: 16 + ((i * 37) % 208),
  y: 36 + ((i * 29) % 136),
  speed: 0.16 + (i % 4) * 0.05,
  phase: i * 1.15,
  color: i % 3 === 0 ? '#fef08a' : i % 3 === 1 ? '#fde047' : '#93c5fd',
}));

let cachedThroneBg: HTMLCanvasElement | null = null;

function createThroneHallBackground(): HTMLCanvasElement {
  const width = THRONE_COLS * TILE_SIZE;
  const height = THRONE_ROWS * TILE_SIZE;
  const off = document.createElement('canvas');
  off.width = width;
  off.height = height;
  const octx = off.getContext('2d');
  if (!octx) return off;

  // 1. Bright Warm Limestone Marble Floor Tiles (y >= 2)
  for (let y = 2; y < THRONE_ROWS; y++) {
    for (let x = 0; x < THRONE_COLS; x++) {
      const px = x * TILE_SIZE;
      const py = y * TILE_SIZE;
      const isBorder = x === 0 || x === THRONE_COLS - 1 || y === THRONE_ROWS - 1;

      if (isBorder) {
        octx.fillStyle = '#3b2f26';
        octx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
        octx.fillStyle = '#6b5a4b';
        octx.fillRect(px + 1, py + 1, TILE_SIZE - 2, TILE_SIZE - 2);
        octx.fillStyle = '#d97706';
        octx.fillRect(px + 2, py + 2, 1, 1);
        octx.fillRect(px + TILE_SIZE - 3, py + TILE_SIZE - 3, 1, 1);
        continue;
      }

      const checker = (x + y) % 2 === 0;
      octx.fillStyle = checker ? '#e9dfc9' : '#dcd0b6';
      octx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
      octx.fillStyle = checker ? '#f5eedc' : '#ebe1ca';
      octx.fillRect(px + 1, py + 1, TILE_SIZE - 2, 1);
      octx.fillStyle = '#bcae92';
      octx.fillRect(px, py + TILE_SIZE - 1, TILE_SIZE, 1);
      octx.fillRect(px + TILE_SIZE - 1, py, 1, TILE_SIZE);

      // Subtle gold rosette dots on corner marble tiles
      if ((x === 3 || x === 11) && y % 2 === 1) {
        octx.fillStyle = '#d4a017';
        octx.fillRect(px + 7, py + 7, 2, 2);
      }
    }
  }

  // 2. North Limestone Fortress Masonry Wall (Rows 0..1)
  octx.fillStyle = '#4a3d33';
  octx.fillRect(0, 0, width, TILE_SIZE * 2);
  for (let row = 0; row < 4; row++) {
    const by = row * 8;
    const offset = row % 2 === 0 ? 0 : 8;
    for (let bx = -8; bx < width + 8; bx += 16) {
      octx.fillStyle = row % 2 === 0 ? '#6e5c4c' : '#5e4e40';
      octx.fillRect(bx + offset + 1, by + 1, 14, 6);
      octx.fillStyle = '#8b7663';
      octx.fillRect(bx + offset + 1, by + 1, 14, 1);
    }
  }
  // Royal Gold Cornice Trim
  octx.fillStyle = '#b45309';
  octx.fillRect(0, TILE_SIZE * 2 - 2, width, 2);
  octx.fillStyle = '#fbbf24';
  octx.fillRect(0, TILE_SIZE * 2 - 2, width, 1);

  // Arched Royal Azure Stained-Glass Windows on NW & NE walls
  for (const wx of [2, 11]) {
    const px = wx * TILE_SIZE + 4;
    octx.fillStyle = '#1e293b';
    octx.fillRect(px, 3, 24, 24);
    octx.fillStyle = '#fbbf24';
    octx.fillRect(px + 1, 4, 22, 22);
    octx.fillStyle = '#1d4ed8';
    octx.fillRect(px + 3, 6, 18, 18);
    // Sunburst diamond inside window
    octx.fillStyle = '#93c5fd';
    octx.fillRect(px + 6, 8, 5, 14);
    octx.fillStyle = '#fef08a';
    octx.fillRect(px + 10, 11, 4, 6);
  }

  // Twin Crimson Lion Heraldic Tapestries flanking the Throne (cols 5 & 9)
  for (const bx of [5, 9]) {
    const px = bx * TILE_SIZE + 2;
    octx.fillStyle = '#991b1b';
    octx.fillRect(px, 3, 12, 24);
    octx.fillStyle = '#dc2626';
    octx.fillRect(px + 1, 4, 10, 20);
    octx.fillStyle = '#fbbf24';
    octx.fillRect(px, 3, 12, 2);
    octx.fillRect(px + 4, 10, 4, 6); // Golden lion crest emblem
    octx.fillRect(px + 5, 18, 2, 3);
  }

  // 3. Royal Cobalt Sapphire Sanctuary Pit (x: 4..10, y: 4..9 — walkable inlay dais)
  const pitX = 4 * TILE_SIZE;
  const pitY = 4 * TILE_SIZE;
  const pitW = 7 * TILE_SIZE;
  const pitH = 6 * TILE_SIZE;
  for (let py = 4; py <= 9; py++) {
    for (let px = 4; px <= 10; px++) {
      const tx = px * TILE_SIZE;
      const ty = py * TILE_SIZE;
      const alt = (px + py) % 2 === 0;
      octx.fillStyle = alt ? '#1e3a8a' : '#2546a8';
      octx.fillRect(tx, ty, TILE_SIZE, TILE_SIZE);
      octx.fillStyle = 'rgba(255,255,255,0.08)';
      octx.fillRect(tx + 1, ty + 1, TILE_SIZE - 2, 1);
    }
  }

  // Orthogonal Golden Sun-Ray Floor Inlays converging at Center Pedestal (7, 6)
  octx.fillStyle = '#b45309';
  octx.fillRect(pitX + 4, 6 * TILE_SIZE + 6, pitW - 8, 4);
  octx.fillRect(7 * TILE_SIZE + 6, pitY + 4, 4, pitH - 8);
  octx.fillStyle = '#fbbf24';
  octx.fillRect(pitX + 5, 6 * TILE_SIZE + 7, pitW - 10, 2);
  octx.fillRect(7 * TILE_SIZE + 7, pitY + 5, 2, pitH - 10);

  // Chiseled Gold-trimmed Pit Curb
  octx.strokeStyle = '#92400e';
  octx.lineWidth = 2;
  octx.strokeRect(pitX + 1, pitY + 1, pitW - 2, pitH - 2);
  octx.strokeStyle = '#fbbf24';
  octx.lineWidth = 1;
  octx.strokeRect(pitX + 2.5, pitY + 2.5, pitW - 5, pitH - 5);

  // Central Solar Medallion Ring under (7.5, 6.5)
  const cx = 7.5 * TILE_SIZE;
  const cy = 6.5 * TILE_SIZE;
  octx.strokeStyle = '#fbbf24';
  octx.lineWidth = 2;
  octx.beginPath();
  octx.arc(cx, cy, 22, 0, Math.PI * 2);
  octx.stroke();

  // 4. Imperial Crimson Walk-Up Carpet (col 7)
  const carpX = 7 * TILE_SIZE + 3;
  octx.fillStyle = '#991b1b';
  octx.fillRect(carpX, 3 * TILE_SIZE, TILE_SIZE - 6, 3 * TILE_SIZE);
  octx.fillRect(carpX, 7 * TILE_SIZE, TILE_SIZE - 6, 4 * TILE_SIZE);
  octx.fillStyle = '#dc2626';
  octx.fillRect(carpX + 1, 3 * TILE_SIZE, TILE_SIZE - 8, 3 * TILE_SIZE);
  octx.fillRect(carpX + 1, 7 * TILE_SIZE, TILE_SIZE - 8, 4 * TILE_SIZE);
  octx.fillStyle = '#fbbf24';
  octx.fillRect(carpX, 3 * TILE_SIZE, 1, 3 * TILE_SIZE);
  octx.fillRect(carpX + TILE_SIZE - 7, 3 * TILE_SIZE, 1, 3 * TILE_SIZE);
  octx.fillRect(carpX, 7 * TILE_SIZE, 1, 4 * TILE_SIZE);
  octx.fillRect(carpX + TILE_SIZE - 7, 7 * TILE_SIZE, 1, 4 * TILE_SIZE);

  // 5. Elevated Sun Dais Base (6..8, 1..2) & 4 Corner Pedestals
  const drawPedestal = (tx: number, ty: number, tw: number, th: number) => {
    const px = tx * TILE_SIZE + 2;
    const py = ty * TILE_SIZE + 2;
    const pw = tw * TILE_SIZE - 4;
    const ph = th * TILE_SIZE - 4;
    octx.fillStyle = '#57473a';
    octx.fillRect(px, py, pw, ph);
    octx.fillStyle = '#786352';
    octx.fillRect(px + 1, py + 1, pw - 2, ph - 4);
    octx.strokeStyle = '#fbbf24';
    octx.lineWidth = 1;
    octx.strokeRect(px + 0.5, py + 0.5, pw - 1, ph - 1);
  };
  drawPedestal(1, 3, 2, 2);
  drawPedestal(12, 3, 2, 2);
  drawPedestal(1, 8, 2, 2);
  drawPedestal(12, 8, 2, 2);

  // North Sun Throne Tribune
  octx.fillStyle = '#78350f';
  octx.fillRect(6 * TILE_SIZE + 1, 2 * TILE_SIZE, 3 * TILE_SIZE - 2, TILE_SIZE - 1);
  octx.fillStyle = '#fbbf24';
  octx.fillRect(6 * TILE_SIZE + 2, 2 * TILE_SIZE, 3 * TILE_SIZE - 4, 2);

  // 6. South Stone Archway Exit (7, 11)
  const ex = 7 * TILE_SIZE;
  const ey = 11 * TILE_SIZE;
  octx.fillStyle = '#451a03';
  octx.fillRect(ex + 1, ey + 1, TILE_SIZE - 2, TILE_SIZE - 2);
  octx.fillStyle = '#fbbf24';
  octx.fillRect(ex + 2, ey + 2, TILE_SIZE - 4, 2);
  drawPixelText(octx, 'EXIT', ex + 8, ey + 7, '#fef3c7', 1, 'center');

  return off;
}

// --- Animated Throne Hall Props ---

function drawGoldenSunThrone(ctx: CanvasRenderingContext2D, tick: number): void {
  const x = 6 * TILE_SIZE;
  const y = 0 * TILE_SIZE + 6;
  const w = 3 * TILE_SIZE;

  // Golden Sunburst Halo behind throne
  const pulse = 0.25 + 0.12 * Math.sin(tick * 0.06);
  ctx.fillStyle = `rgba(251, 191, 36, ${pulse})`;
  ctx.beginPath();
  ctx.arc(x + w / 2, y + 18, 19, 0, Math.PI * 2);
  ctx.fill();

  // Carved Gold Throne High Backrest
  ctx.fillStyle = '#92400e';
  ctx.fillRect(x + 12, y, w - 24, 24);
  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(x + 14, y + 2, w - 28, 20);
  // Crimson Velvet Cushion
  ctx.fillStyle = '#b91c1c';
  ctx.fillRect(x + 17, y + 5, w - 34, 15);
  // Crown Sun-Jewel at Peak
  ctx.fillStyle = '#fef08a';
  ctx.fillRect(x + w / 2 - 2, y + 1, 4, 3);
  // Armrests
  ctx.fillStyle = '#fbbf24';
  ctx.fillRect(x + 12, y + 15, 5, 7);
  octxLineArm(ctx, x + w - 17, y + 15);
}

function octxLineArm(ctx: CanvasRenderingContext2D, x: number, y: number): void {
  ctx.fillStyle = '#fbbf24';
  ctx.fillRect(x, y, 5, 7);
}

function drawRoyalCharterLectern(ctx: CanvasRenderingContext2D, tick: number): void {
  const x = 1 * TILE_SIZE;
  const y = 3 * TILE_SIZE;
  // Oak lectern stand
  ctx.fillStyle = '#78350f';
  ctx.fillRect(x + 6, y + 7, 20, 16);
  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 1;
  ctx.strokeRect(x + 6.5, y + 7.5, 19, 15);
  // Open illuminated parchment scroll
  ctx.fillStyle = '#fef3c7';
  ctx.fillRect(x + 8, y + 9, 16, 11);
  ctx.fillStyle = '#92400e';
  ctx.fillRect(x + 10, y + 11, 11, 1);
  ctx.fillRect(x + 10, y + 14, 9, 1);
  ctx.fillRect(x + 10, y + 17, 7, 1);
  // Pulsing Red Royal Wax Seal
  const gleam = tick % 40 < 20 ? '#dc2626' : '#ef4444';
  ctx.fillStyle = gleam;
  ctx.fillRect(x + 20, y + 16, 3, 3);
}

function drawTreasuryCoffer(ctx: CanvasRenderingContext2D, tick: number): void {
  const x = 12 * TILE_SIZE;
  const y = 3 * TILE_SIZE;
  const claimed = Boolean(getRoyalCrests().sovereignty);

  // Royal Chest Base & Filigree
  ctx.fillStyle = '#78350f';
  ctx.fillRect(x + 5, y + 9, 22, 15);
  ctx.strokeStyle = claimed ? '#fde047' : '#d97706';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(x + 5.5, y + 9.5, 21, 14);
  // Golden bands
  ctx.fillStyle = '#fbbf24';
  ctx.fillRect(x + 9, y + 9, 2, 15);
  ctx.fillRect(x + 21, y + 9, 2, 15);
  // Lid seam & center lock clasp
  ctx.fillStyle = '#451a03';
  ctx.fillRect(x + 6, y + 14, 20, 2);
  ctx.fillStyle = claimed ? '#4ade80' : '#fef08a';
  ctx.fillRect(x + 14, y + 13, 4, 4);

  if (claimed) {
    const sparkle = Math.sin(tick * 0.14);
    if (sparkle > 0) {
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(x + 10, y + 4, 2, 2);
      ctx.fillRect(x + 21, y + 5, 2, 2);
    }
  }
}

function drawVanguardArmorDisplay(ctx: CanvasRenderingContext2D): void {
  const x = 1 * TILE_SIZE;
  const y = 8 * TILE_SIZE;
  // Armor stand wooden cross
  ctx.fillStyle = '#78350f';
  ctx.fillRect(x + 14, y + 6, 4, 18);
  ctx.fillRect(x + 9, y + 11, 14, 3);
  // Polished Silver-Blue Plate & Helmet
  ctx.fillStyle = '#cbd5e1';
  ctx.fillRect(x + 11, y + 9, 10, 10);
  ctx.fillRect(x + 13, y + 4, 6, 5);
  ctx.fillStyle = '#1d4ed8';
  ctx.fillRect(x + 13, y + 12, 6, 6);
  ctx.fillStyle = '#fbbf24';
  ctx.fillRect(x + 15, y + 3, 2, 2);
}

function drawEnvoyDesk(ctx: CanvasRenderingContext2D, tick: number): void {
  const x = 12 * TILE_SIZE;
  const y = 8 * TILE_SIZE;
  // Royal oak correspondence table
  ctx.fillStyle = '#78350f';
  ctx.fillRect(x + 5, y + 9, 22, 14);
  ctx.fillStyle = '#92400e';
  ctx.fillRect(x + 7, y + 11, 18, 10);
  // Sealed Parchment Letters & Quill Inkpot
  ctx.fillStyle = '#fef3c7';
  ctx.fillRect(x + 9, y + 13, 9, 6);
  ctx.fillStyle = '#dc2626';
  ctx.fillRect(x + 13, y + 15, 2, 2);
  ctx.fillStyle = tick % 30 < 15 ? '#60a5fa' : '#93c5fd';
  ctx.fillRect(x + 20, y + 12, 3, 4);
}

function drawSunCrestPedestal(ctx: CanvasRenderingContext2D, tick: number): void {
  const px = 7 * TILE_SIZE;
  const py = 6 * TILE_SIZE;
  const bob = Math.round(Math.sin(tick * 0.08) * 1.5);

  ctx.fillStyle = '#57473a';
  ctx.fillRect(px + 3, py + 8, 10, 7);
  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 1;
  ctx.strokeRect(px + 3.5, py + 8.5, 9, 6);

  const cx = px + 8;
  const cy = py + 5 + bob;
  ctx.fillStyle = '#fbbf24';
  ctx.beginPath();
  ctx.moveTo(cx, cy - 4.5);
  ctx.lineTo(cx + 4, cy);
  ctx.lineTo(cx, cy + 4.5);
  ctx.lineTo(cx - 4, cy);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#fef08a';
  ctx.fillRect(cx - 1, cy - 1, 2, 2);
}

export function renderThroneHallScene(
  ctx: CanvasRenderingContext2D,
  tick: number,
  pmdAnimator?: PokemonPMDAnimator,
): void {
  if (!cachedThroneBg) {
    cachedThroneBg = createThroneHallBackground();
  }
  ctx.drawImage(cachedThroneBg, 0, 0);

  // Diagonal Warm Sunbeams from NW & NE Stained-Glass Windows
  const beamAlpha = 0.09 + 0.04 * Math.sin(tick * 0.05);
  ctx.save();
  ctx.fillStyle = `rgba(254, 240, 138, ${beamAlpha})`;
  for (const bx of [2.5 * TILE_SIZE, 11.5 * TILE_SIZE]) {
    ctx.beginPath();
    ctx.moveTo(bx, 1.8 * TILE_SIZE);
    ctx.lineTo(bx + 22, 1.8 * TILE_SIZE);
    ctx.lineTo(bx + 36, 7.5 * TILE_SIZE);
    ctx.lineTo(bx - 4, 7.5 * TILE_SIZE);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();

  // Four corner candelabra torches
  for (const [bx, by] of [[4, 3], [10, 3], [4, 9], [10, 9]]) {
    drawKingdomTorch(ctx, bx, by, tick, '#fbbf24');
  }

  // Animated Architectural Props & Stations
  drawGoldenSunThrone(ctx, tick);
  drawRoyalCharterLectern(ctx, tick);
  drawTreasuryCoffer(ctx, tick);
  drawVanguardArmorDisplay(ctx);
  drawEnvoyDesk(ctx, tick);
  drawSunCrestPedestal(ctx, tick);

  // Official Guardians: King Solgaleo (7,2), Omnimon (2,6), Gallantmon (12,6)
  drawKingdomGuardians(ctx, GUARDIANS, tick, pmdAnimator);

  // Floating Golden Sunlight Dust Motes
  ctx.save();
  for (const m of SUNLIGHT_MOTES) {
    const py = (m.y - tick * m.speed) % (9 * TILE_SIZE);
    const actualY = 2.5 * TILE_SIZE + ((py + 9 * TILE_SIZE) % (9 * TILE_SIZE));
    const floatX = m.x + Math.sin(tick * 0.04 + m.phase) * 3;
    ctx.fillStyle = m.color;
    ctx.globalAlpha = 0.3 + 0.25 * Math.sin(tick * 0.09 + m.phase);
    ctx.fillRect(Math.floor(floatX), Math.floor(actualY), 1.5, 1.5);
  }
  ctx.restore();

  renderKingdomWaves(ctx, 'kingdom-castle');
}
