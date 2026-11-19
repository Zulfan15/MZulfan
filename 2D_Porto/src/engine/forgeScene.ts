import { TILE_SIZE } from './sprites';
import { drawPixelText } from './devScene';
import type { PokemonPMDAnimator } from './pokemonPMDAnimator';
import { getDigimonById } from './digimonCatalog';
import { requestDigimonSprites, selectDigimonOverworldFrame } from './digiSpriteLoader';
import {
  DARK_INTERIOR_COLS,
  DARK_INTERIOR_ROWS,
  DARK_INTERIOR_SPAWN,
  createDarkInteriorBaseCollision,
  getAbyssalSeals,
  type DarkInteriorProp,
} from './darkInteriorShared';

export const FORGE_COLS = DARK_INTERIOR_COLS;
export const FORGE_ROWS = DARK_INTERIOR_ROWS;
export const FORGE_SPAWN = DARK_INTERIOR_SPAWN;

export const FORGE_PROPS: DarkInteriorProp[] = [
  {
    id: 'machinedramon',
    kind: 'npc',
    x: 7,
    y: 2,
    w: 1,
    h: 1,
    target: { type: 'event', name: 'machinedramon' },
    label: '🤖 Machinedramon',
    style: 'machinedramon',
    labelLift: 20,
    hint: 'Consult Forge Master Machinedramon 🤖',
  },
  {
    id: 'magma-core',
    kind: 'prop',
    x: 6,
    y: 1,
    w: 3,
    h: 2,
    target: { type: 'event', name: 'magma-core' },
    label: '🌋 Magma Core',
    style: 'magma-core',
    labelLift: 22,
    hint: 'Stabilize Geothermal Reactor Core ⚡',
  },
  {
    id: 'tech-anvil',
    kind: 'prop',
    x: 1,
    y: 3,
    w: 2,
    h: 2,
    target: { type: 'event', name: 'tech-anvil' },
    label: '🔨 Tech Anvil',
    style: 'anvil',
    labelLift: 12,
    hint: 'Forge Distributed Stack on Tech Anvil 🔨',
  },
  {
    id: 'telemetry-terminal',
    kind: 'prop',
    x: 12,
    y: 3,
    w: 2,
    h: 2,
    target: { type: 'event', name: 'telemetry-terminal' },
    label: '📊 Telemetry',
    style: 'terminal',
    labelLift: 12,
    hint: 'Inspect Reactor Thermal Telemetry 📊',
  },
  {
    id: 'charizard',
    kind: 'npc',
    x: 2,
    y: 6,
    w: 1,
    h: 1,
    target: { type: 'event', name: 'charizard' },
    label: '🔥 Charizard',
    style: 'charizard',
    labelLift: 16,
    hint: 'Stoke the Smelting Furnace with Charizard 🔥',
  },
  {
    id: 'groudon',
    kind: 'npc',
    x: 12,
    y: 6,
    w: 1,
    h: 1,
    target: { type: 'event', name: 'groudon' },
    label: '🌋 Groudon',
    style: 'groudon',
    labelLift: 16,
    hint: 'Channel Tectonic Pressure with Groudon 🌋',
  },
  {
    id: 'forge-altar',
    kind: 'prop',
    x: 7,
    y: 6,
    w: 1,
    h: 1,
    target: { type: 'event', name: 'forge-altar' },
    label: '⚙️ Core Pedestal',
    style: 'forge-altar',
    labelLift: 16,
    hint: 'Inspect Central Chaos Turbine Pedestal ⚙️',
  },
  {
    id: 'coolant-valves',
    kind: 'prop',
    x: 1,
    y: 8,
    w: 2,
    h: 2,
    target: { type: 'event', name: 'coolant-valves' },
    label: '❄️ Cryo Valves',
    style: 'valves',
    labelLift: 12,
    hint: 'Tune Liquid Nitrogen Coolant Conduits ❄️',
  },
  {
    id: 'plasma-batteries',
    kind: 'prop',
    x: 12,
    y: 8,
    w: 2,
    h: 2,
    target: { type: 'event', name: 'plasma-batteries' },
    label: '🔋 Relic Coffer',
    style: 'batteries',
    labelLift: 12,
    hint: 'Open Foundry Coffer & Overdrive Buff ⚡',
  },
  {
    id: 'exit',
    kind: 'exit',
    x: 7,
    y: 11,
    w: 1,
    h: 1,
    target: { type: 'place', id: 'dark-castle' },
    label: 'Exit',
    style: 'exit',
    hideLabel: true,
  },
];

export function createForgeCollision(): Uint8Array {
  const coll = createDarkInteriorBaseCollision();
  const w = FORGE_COLS;

  // Row 2: North Reactor Tribune (x: 6..8) blocked; flanks walkable
  for (let x = 6; x <= 8; x++) {
    coll[2 * w + x] = 1;
  }

  // Four corner 2x2 machinery stations
  for (let y = 3; y <= 4; y++) {
    coll[y * w + 1] = 1;
    coll[y * w + 2] = 1;
    coll[y * w + 12] = 1;
    coll[y * w + 13] = 1;
  }
  for (let y = 8; y <= 9; y++) {
    coll[y * w + 1] = 1;
    coll[y * w + 2] = 1;
    coll[y * w + 12] = 1;
    coll[y * w + 13] = 1;
  }

  // Side Guardian Plinths: Charizard (2, 6) & Groudon (12, 6)
  coll[6 * w + 2] = 1;
  coll[6 * w + 12] = 1;

  // Center Chaos Turbine Pedestal (7, 6)
  coll[6 * w + 7] = 1;

  // Four glowing corner magma braziers around Sunken Conduit Pit
  coll[3 * w + 4] = 1;
  coll[3 * w + 10] = 1;
  coll[9 * w + 4] = 1;
  coll[9 * w + 10] = 1;

  return coll;
}

export const FORGE_COLLISION = createForgeCollision();

// --- Interactive Magma Plasma Shockwave Effect ---
interface PlasmaWave {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  color: string;
  text: string;
  alpha: number;
}

const activePlasmaWaves: PlasmaWave[] = [];

export function triggerForgePlasmaWave(text = 'REACTOR STABILIZED!', color = '#fb923c'): void {
  activePlasmaWaves.push({
    x: 7.5 * TILE_SIZE,
    y: 6.5 * TILE_SIZE,
    radius: 5,
    maxRadius: 72,
    color,
    text,
    alpha: 1,
  });
}

// Rising ambient forge ember motes
const FORGE_MOTES = Array.from({ length: 18 }, (_, i) => ({
  x: ((i * 37 + 19) % 216) + 12,
  y: ((i * 29 + 11) % 140) + 32,
  speed: 0.25 + (i % 4) * 0.08,
  phase: i * 1.1,
  color: i % 3 === 0 ? '#fef08a' : i % 3 === 1 ? '#fb923c' : '#f87171',
}));

// --- Offscreen Static Foundry Architecture Cache ---
let cachedForgeBg: HTMLCanvasElement | null = null;

function createForgeBackgroundCanvas(): HTMLCanvasElement {
  const width = FORGE_COLS * TILE_SIZE;
  const height = FORGE_ROWS * TILE_SIZE;
  const off = document.createElement('canvas');
  off.width = width;
  off.height = height;
  const octx = off.getContext('2d');
  if (!octx) return off;

  // 1. Warm Volcanic Obsidian-Basalt Tile Floor (y >= 2)
  for (let y = 2; y < FORGE_ROWS; y++) {
    for (let x = 0; x < FORGE_COLS; x++) {
      const px = x * TILE_SIZE;
      const py = y * TILE_SIZE;
      const isBorder = x === 0 || x === FORGE_COLS - 1 || y === FORGE_ROWS - 1;

      if (isBorder) {
        octx.fillStyle = '#14060a';
        octx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
        octx.fillStyle = '#290d16';
        octx.fillRect(px + 1, py + 1, TILE_SIZE - 2, TILE_SIZE - 2);
        octx.fillStyle = '#b45309';
        octx.fillRect(px + 2, py + 2, 1, 1);
        octx.fillRect(px + TILE_SIZE - 3, py + TILE_SIZE - 3, 1, 1);
        continue;
      }

      const checker = (x + y) % 2 === 0;
      octx.fillStyle = checker ? '#261118' : '#301620';
      octx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
      octx.fillStyle = checker ? '#3a1b26' : '#45202d';
      octx.fillRect(px + 1, py + 1, TILE_SIZE - 2, 1);
      octx.fillStyle = '#17090e';
      octx.fillRect(px, py + TILE_SIZE - 1, TILE_SIZE, 1);
      octx.fillRect(px + TILE_SIZE - 1, py, 1, TILE_SIZE);

      // Subtle diamond-plate industrial rivets on outer aisles
      if (x <= 3 || x >= 11) {
        octx.fillStyle = '#532535';
        octx.fillRect(px + 3, py + 4, 2, 1);
        octx.fillRect(px + 11, py + 12, 2, 1);
      }
    }
  }

  // 2. North Industrial Volcanic Masonry Wall (Rows 0..1)
  octx.fillStyle = '#120609';
  octx.fillRect(0, 0, width, TILE_SIZE * 2);
  for (let row = 0; row < 4; row++) {
    const by = row * 8;
    const offset = row % 2 === 0 ? 0 : 8;
    for (let bx = -8; bx < width + 8; bx += 16) {
      octx.fillStyle = row % 2 === 0 ? '#291019' : '#220d14';
      octx.fillRect(bx + offset + 1, by + 1, 14, 6);
      octx.fillStyle = '#3d1825';
      octx.fillRect(bx + offset + 1, by + 1, 14, 1);
      octx.fillStyle = '#5c2419';
      octx.fillRect(bx + offset + 1, by + 6, 14, 1);
    }
  }
  // Brass cornice trim beam along base of North wall
  octx.fillStyle = '#b45309';
  octx.fillRect(0, TILE_SIZE * 2 - 2, width, 2);
  octx.fillStyle = '#fbbf24';
  octx.fillRect(0, TILE_SIZE * 2 - 2, width, 1);

  // Twin Wall-Mounted Heat-Exchange Vents on NW & NE walls
  const drawWallVent = (vx: number) => {
    const px = vx * TILE_SIZE + 2;
    const py = 5;
    octx.fillStyle = '#090305';
    octx.fillRect(px, py, TILE_SIZE * 2 - 4, 21);
    octx.strokeStyle = '#d97706';
    octx.lineWidth = 1;
    octx.strokeRect(px + 0.5, py + 0.5, TILE_SIZE * 2 - 5, 20);
    for (let ly = py + 4; ly < py + 19; ly += 4) {
      octx.fillStyle = '#450a0a';
      octx.fillRect(px + 3, ly, TILE_SIZE * 2 - 10, 2);
      octx.fillStyle = '#f97316';
      octx.fillRect(px + 4, ly, TILE_SIZE * 2 - 12, 1);
    }
  };
  drawWallVent(2);
  drawWallVent(11);

  // 3. Sunken Magma Conduit Pit (x: 4..10, y: 4..9 — walkable sanctuary pit)
  const pitX = 4 * TILE_SIZE;
  const pitY = 4 * TILE_SIZE;
  const pitW = 7 * TILE_SIZE;
  const pitH = 6 * TILE_SIZE;
  for (let py = 4; py <= 9; py++) {
    for (let px = 4; px <= 10; px++) {
      const tx = px * TILE_SIZE;
      const ty = py * TILE_SIZE;
      const alt = (px + py) % 2 === 0;
      octx.fillStyle = alt ? '#1b090f' : '#230d14';
      octx.fillRect(tx, ty, TILE_SIZE, TILE_SIZE);
      octx.fillStyle = '#36131f';
      octx.fillRect(tx + 1, ty + 1, TILE_SIZE - 2, 1);
    }
  }

  // Orthogonal molten magma channels converging at (7, 6)
  octx.fillStyle = '#7c2d12';
  octx.fillRect(pitX + 2, 6 * TILE_SIZE + 6, pitW - 4, 4);
  octx.fillRect(7 * TILE_SIZE + 6, pitY + 2, 4, pitH - 4);
  octx.fillStyle = '#ea580c';
  octx.fillRect(pitX + 3, 6 * TILE_SIZE + 7, pitW - 6, 2);
  octx.fillRect(7 * TILE_SIZE + 7, pitY + 3, 2, pitH - 6);

  // Gilded brass pit curb
  octx.strokeStyle = '#92400e';
  octx.lineWidth = 2;
  octx.strokeRect(pitX + 1, pitY + 1, pitW - 2, pitH - 2);
  octx.strokeStyle = '#f59e0b';
  octx.lineWidth = 1;
  octx.strokeRect(pitX + 2.5, pitY + 2.5, pitW - 5, pitH - 5);

  // Center Bronze Reactor Medallion Ring at (7.5, 6.5)
  const cx = 7.5 * TILE_SIZE;
  const cy = 6.5 * TILE_SIZE;
  octx.strokeStyle = '#b45309';
  octx.lineWidth = 2;
  octx.beginPath();
  octx.arc(cx, cy, 22, 0, Math.PI * 2);
  octx.stroke();
  octx.strokeStyle = '#fb923c';
  octx.lineWidth = 1;
  octx.beginPath();
  octx.arc(cx, cy, 17, 0, Math.PI * 2);
  octx.stroke();

  // 4. Crimson-Brass Walk-Up Catwalk Carpet (column 7)
  const carpX = 7 * TILE_SIZE + 3;
  octx.fillStyle = '#7f1d1d';
  octx.fillRect(carpX, 3 * TILE_SIZE, TILE_SIZE - 6, 3 * TILE_SIZE);
  octx.fillRect(carpX, 7 * TILE_SIZE, TILE_SIZE - 6, 4 * TILE_SIZE);
  octx.fillStyle = '#dc2626';
  octx.fillRect(carpX + 1, 3 * TILE_SIZE, TILE_SIZE - 8, 3 * TILE_SIZE);
  octx.fillRect(carpX + 1, 7 * TILE_SIZE, TILE_SIZE - 8, 4 * TILE_SIZE);
  octx.fillStyle = '#f59e0b';
  octx.fillRect(carpX, 3 * TILE_SIZE, 1, 3 * TILE_SIZE);
  octx.fillRect(carpX + TILE_SIZE - 7, 3 * TILE_SIZE, 1, 3 * TILE_SIZE);
  octx.fillRect(carpX, 7 * TILE_SIZE, 1, 4 * TILE_SIZE);
  octx.fillRect(carpX + TILE_SIZE - 7, 7 * TILE_SIZE, 1, 4 * TILE_SIZE);

  // 5. Exit Archway at Bottom Center (7, 11)
  const ex = 7 * TILE_SIZE;
  const ey = 11 * TILE_SIZE;
  octx.fillStyle = '#450a0a';
  octx.fillRect(ex + 1, ey + 1, TILE_SIZE - 2, TILE_SIZE - 2);
  octx.fillStyle = '#f97316';
  octx.fillRect(ex + 2, ey + 2, TILE_SIZE - 4, 2);
  drawPixelText(octx, 'EXIT', ex + TILE_SIZE / 2, ey + 7, '#fef3c7', 1, 'center');

  return off;
}

// --- Animated Props & Guardians ---

function drawMagmaCore(ctx: CanvasRenderingContext2D, tick: number): void {
  const x = 6 * TILE_SIZE;
  const y = 1 * TILE_SIZE;
  const w = 3 * TILE_SIZE;
  const h = 2 * TILE_SIZE;
  const pulse = Math.sin(tick * 0.08);

  // Floor thermal aura
  ctx.fillStyle = `rgba(249, 115, 22, ${0.22 + 0.12 * pulse})`;
  ctx.beginPath();
  ctx.ellipse(x + w / 2, y + h + 2, 26, 8, 0, 0, Math.PI * 2);
  ctx.fill();

  // Twin side steel turbine towers
  for (const offset of [1, w - 11]) {
    ctx.fillStyle = '#1f2937';
    octxBox(ctx, x + offset, y - 3, 10, h + 1);
    ctx.fillStyle = '#374151';
    ctx.fillRect(x + offset + 1, y - 2, 8, h - 1);
    ctx.fillStyle = '#d97706';
    ctx.fillRect(x + offset, y + 3, 10, 2);
    ctx.fillRect(x + offset, y + h - 7, 10, 2);
  }

  // Central Reactor Pressure Vessel
  const rx = x + 11;
  const rw = w - 22;
  ctx.fillStyle = '#18181b';
  ctx.fillRect(rx, y - 5, rw, h + 2);
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 1;
  ctx.strokeRect(rx + 0.5, y - 4.5, rw - 1, h + 1);

  // Pressurized Molten Plasma Glass Core
  const glassX = rx + 3;
  const glassY = y - 1;
  const glassW = rw - 6;
  const glassH = 19;
  ctx.fillStyle = '#450a0a';
  ctx.fillRect(glassX, glassY, glassW, glassH);

  const magmaGrad = ctx.createLinearGradient(glassX, glassY, glassX, glassY + glassH);
  magmaGrad.addColorStop(0, '#fef08a');
  magmaGrad.addColorStop(0.45, '#f97316');
  magmaGrad.addColorStop(1, '#dc2626');
  ctx.fillStyle = magmaGrad;
  ctx.globalAlpha = 0.78 + 0.2 * pulse;
  ctx.fillRect(glassX + 1, glassY + 1, glassW - 2, glassH - 2);
  ctx.globalAlpha = 1;

  // Spinning turbine bars
  const barOffset = Math.floor((tick * 0.35) % 5);
  ctx.fillStyle = 'rgba(255,255,255,0.48)';
  for (let by = glassY + barOffset; by < glassY + glassH - 1; by += 5) {
    ctx.fillRect(glassX + 1, by, glassW - 2, 1);
  }

  // Rising thermal sparks
  for (let i = 0; i < 3; i++) {
    const sy = y + h - ((tick * 0.45 + i * 9) % 28);
    const sx = x + w / 2 + Math.sin(tick * 0.09 + i * 2.1) * 7;
    ctx.fillStyle = i % 2 === 0 ? '#fde047' : '#fb923c';
    ctx.fillRect(Math.floor(sx), Math.floor(sy), 1, 1);
  }
}

function octxBox(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number): void {
  ctx.fillRect(x, y, w, h);
}

function drawMachinedramonGuardian(ctx: CanvasRenderingContext2D, tick: number): void {
  const centerX = 7 * TILE_SIZE + 8;
  const footY = 2 * TILE_SIZE + 14;

  // Shadow under Machinedramon
  ctx.fillStyle = 'rgba(0,0,0,0.52)';
  ctx.beginPath();
  ctx.ellipse(centerX, footY, 9, 3.5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Official Digimon World DS Machinedramon Spritesheet
  const entry = getDigimonById('machinedramon');
  const sprites = entry ? requestDigimonSprites('machinedramon') : null;
  if (entry && sprites) {
    const { frame, flipX } = selectDigimonOverworldFrame(entry, sprites, 'S', tick, false, false);
    if (frame) {
      const targetH = Math.round((entry.overworldTargetHeight || 35) * 0.78);
      const scale = targetH / frame.height;
      const drawW = Math.max(14, Math.round(frame.width * scale));
      const drawH = Math.max(14, Math.round(frame.height * scale));

      ctx.save();
      ctx.translate(Math.round(centerX), Math.round(footY));
      if (flipX) ctx.scale(-1, 1);
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(frame.canvas, -Math.round(drawW / 2), -drawH, drawW, drawH);
      ctx.restore();
      return;
    }
  }

  // Fallback while Machinedramon spritesheet loads
  const bob = Math.round(Math.sin(tick * 0.08));
  const px = 7 * TILE_SIZE;
  const py = 2 * TILE_SIZE + bob;
  ctx.fillStyle = '#64748b';
  ctx.fillRect(px + 3, py + 2, 10, 10);
  ctx.fillStyle = '#ef4444';
  ctx.fillRect(px + 5, py + 1, 6, 2);
}

function drawTechAnvil(ctx: CanvasRenderingContext2D, tick: number): void {
  const x = 1 * TILE_SIZE;
  const y = 3 * TILE_SIZE;
  const w = 2 * TILE_SIZE;
  const h = 2 * TILE_SIZE;

  // Heavy Oak-and-Brass Plinth
  ctx.fillStyle = '#451a03';
  ctx.fillRect(x + 4, y + 13, w - 8, h - 15);
  ctx.strokeStyle = '#b45309';
  ctx.lineWidth = 1;
  ctx.strokeRect(x + 4.5, y + 13.5, w - 9, h - 16);

  // Dark Mithril Forge Anvil
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(x + 7, y + 9, w - 14, 6);
  ctx.fillStyle = '#475569';
  ctx.fillRect(x + 5, y + 5, w - 10, 5);
  ctx.fillStyle = '#94a3b8';
  ctx.fillRect(x + 6, y + 6, w - 12, 1);
  ctx.fillStyle = '#64748b';
  ctx.fillRect(x + 3, y + 7, 3, 2);

  // Glowing hot ingot & sparks
  const hot = 0.7 + 0.3 * Math.sin(tick * 0.14);
  ctx.fillStyle = `rgba(251, 146, 60, ${hot})`;
  ctx.fillRect(x + 12, y + 3, 7, 2);
  if (tick % 36 < 10) {
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(x + 10 + (tick % 4), y + 1, 1, 1);
    ctx.fillRect(x + 18 - (tick % 3), y, 1, 1);
  }
}

function drawTelemetryTerminal(ctx: CanvasRenderingContext2D, tick: number): void {
  const x = 12 * TILE_SIZE;
  const y = 3 * TILE_SIZE;
  const w = 2 * TILE_SIZE;
  const h = 2 * TILE_SIZE;

  ctx.fillStyle = '#1e293b';
  ctx.fillRect(x + 2, y + 5, w - 4, h - 7);
  ctx.strokeStyle = '#d97706';
  ctx.lineWidth = 1;
  ctx.strokeRect(x + 2.5, y + 5.5, w - 5, h - 8);

  // CRT Screen
  ctx.fillStyle = '#042f2e';
  ctx.fillRect(x + 5, y + 8, w - 10, 12);
  for (let bx = 0; bx < 6; bx++) {
    const barH = 2 + Math.round((Math.sin(tick * 0.14 + bx * 0.9) + 1) * 3.5);
    ctx.fillStyle = bx === 3 ? '#fbbf24' : '#2dd4bf';
    ctx.fillRect(x + 7 + bx * 3, y + 18 - barH, 2, barH);
  }

  // Control console LEDs
  ctx.fillStyle = '#334155';
  ctx.fillRect(x + 5, y + 22, w - 10, 4);
  ctx.fillStyle = tick % 30 < 15 ? '#22c55e' : '#f59e0b';
  ctx.fillRect(x + 7, y + 23, 2, 2);
  ctx.fillStyle = '#38bdf8';
  ctx.fillRect(x + 11, y + 23, 2, 2);
}

function drawCoolantValves(ctx: CanvasRenderingContext2D, tick: number): void {
  const x = 1 * TILE_SIZE;
  const y = 8 * TILE_SIZE;
  const w = 2 * TILE_SIZE;
  const h = 2 * TILE_SIZE;

  ctx.fillStyle = '#0c4a6e';
  ctx.fillRect(x + 3, y + 10, w - 6, h - 12);
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 1;
  ctx.strokeRect(x + 3.5, y + 10.5, w - 7, h - 13);

  for (const offset of [5, 17]) {
    ctx.fillStyle = '#082f49';
    ctx.fillRect(x + offset, y + 3, 9, 18);
    ctx.fillStyle = '#7dd3fc';
    ctx.fillRect(x + offset + 1, y + 5, 7, 13);
    const bubbleY = y + 16 - ((tick * 0.25 + offset) % 10);
    ctx.fillStyle = '#f0f9ff';
    ctx.fillRect(x + offset + 3, Math.floor(bubbleY), 2, 2);
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(x + offset + 2, y + 1, 5, 2);
  }
}

function drawPlasmaBatteries(ctx: CanvasRenderingContext2D, tick: number): void {
  const x = 12 * TILE_SIZE;
  const y = 8 * TILE_SIZE;
  const w = 2 * TILE_SIZE;
  const h = 2 * TILE_SIZE;
  const unlocked = Boolean(getAbyssalSeals().ember);

  ctx.fillStyle = '#18181b';
  ctx.fillRect(x + 3, y + 5, w - 6, h - 7);
  ctx.strokeStyle = unlocked ? '#fbbf24' : '#ea580c';
  ctx.lineWidth = 1;
  ctx.strokeRect(x + 3.5, y + 5.5, w - 7, h - 8);

  for (const offset of [6, 17]) {
    ctx.fillStyle = '#27272a';
    ctx.fillRect(x + offset, y + 7, 8, 14);
    const pulse = 0.65 + 0.35 * Math.sin(tick * 0.1 + offset);
    ctx.fillStyle = unlocked
      ? `rgba(251, 191, 36, ${pulse})`
      : `rgba(249, 115, 22, ${pulse})`;
    ctx.fillRect(x + offset + 2, y + 9, 4, 10);
  }

  // Brass Relic Coffer chest front-center
  ctx.fillStyle = '#78350f';
  ctx.fillRect(x + 9, y + 19, 14, 8);
  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 1;
  ctx.strokeRect(x + 9.5, y + 19.5, 13, 7);
  ctx.fillStyle = unlocked ? '#4ade80' : '#f59e0b';
  ctx.fillRect(x + 15, y + 21, 2, 3);
}

function drawForgeAltar(ctx: CanvasRenderingContext2D, tick: number): void {
  const px = 7 * TILE_SIZE;
  const py = 6 * TILE_SIZE;
  const floatY = Math.round(Math.sin(tick * 0.08) * 1.5);

  ctx.fillStyle = '#27272a';
  ctx.fillRect(px + 3, py + 8, TILE_SIZE - 6, 7);
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 1;
  ctx.strokeRect(px + 3.5, py + 8.5, TILE_SIZE - 7, 6);

  const cx = px + 8;
  const cy = py + 5 + floatY;
  ctx.strokeStyle = '#fb923c';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.ellipse(cx, cy, 6, 2.5, tick * 0.05, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = '#f97316';
  ctx.beginPath();
  ctx.moveTo(cx, cy - 4);
  ctx.lineTo(cx + 3, cy);
  ctx.lineTo(cx, cy + 4);
  ctx.lineTo(cx - 3, cy);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#fef08a';
  ctx.fillRect(cx - 1, cy - 1, 2, 2);
}

function drawBrazier(ctx: CanvasRenderingContext2D, bx: number, by: number, tick: number): void {
  const px = bx * TILE_SIZE;
  const py = by * TILE_SIZE;
  const flicker = 0.72 + 0.28 * Math.sin(tick * 0.2 + bx * 2.3 + by);

  ctx.fillStyle = `rgba(249, 115, 22, ${0.24 * flicker})`;
  ctx.beginPath();
  ctx.arc(px + 8, py + 8, 9, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#18181b';
  ctx.fillRect(px + 5, py + 8, 6, 6);
  ctx.fillStyle = '#b45309';
  ctx.fillRect(px + 4, py + 7, 8, 2);

  ctx.fillStyle = '#ea580c';
  ctx.fillRect(px + 6, py + 3 + Math.round(flicker), 4, 5);
  ctx.fillStyle = '#fde047';
  ctx.fillRect(px + 7, py + 4 + Math.round(flicker), 2, 3);
}

function drawFallbackGuardian(
  ctx: CanvasRenderingContext2D,
  tx: number,
  ty: number,
  color: string,
  accent: string,
  tick: number,
): void {
  const bob = Math.round(Math.sin(tick * 0.1 + tx));
  const px = tx * TILE_SIZE;
  const py = ty * TILE_SIZE + bob;
  ctx.fillStyle = 'rgba(0,0,0,0.45)';
  ctx.beginPath();
  ctx.ellipse(px + 8, ty * TILE_SIZE + 14, 5, 2, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = color;
  ctx.fillRect(px + 4, py + 3, 8, 9);
  ctx.fillStyle = accent;
  ctx.fillRect(px + 5, py + 5, 6, 4);
}

export function renderForgeScene(
  ctx: CanvasRenderingContext2D,
  tick: number,
  pmdAnimator?: PokemonPMDAnimator,
): void {
  // 1. Static Cached Industrial Obsidian-Magma Background
  if (!cachedForgeBg) {
    cachedForgeBg = createForgeBackgroundCanvas();
  }
  ctx.drawImage(cachedForgeBg, 0, 0);

  // 2. Animated Ambient Magma Conduits & Corner Braziers
  const conduitAlpha = 0.28 + 0.15 * Math.sin(tick * 0.08);
  ctx.fillStyle = `rgba(253, 224, 71, ${conduitAlpha})`;
  ctx.fillRect(4 * TILE_SIZE + 6, 6 * TILE_SIZE + 7, 7 * TILE_SIZE - 12, 2);
  ctx.fillRect(7 * TILE_SIZE + 7, 4 * TILE_SIZE + 6, 2, 6 * TILE_SIZE - 12);

  drawBrazier(ctx, 4, 3, tick);
  drawBrazier(ctx, 10, 3, tick);
  drawBrazier(ctx, 4, 9, tick);
  drawBrazier(ctx, 10, 9, tick);

  // 3. Animated Forge Architecture & Machinery Stations
  drawMagmaCore(ctx, tick);
  drawTechAnvil(ctx, tick);
  drawTelemetryTerminal(ctx, tick);
  drawCoolantValves(ctx, tick);
  drawPlasmaBatteries(ctx, tick);
  drawForgeAltar(ctx, tick);

  // 4. Three Forge Guardians (Machinedramon + Charizard + Groudon)
  drawMachinedramonGuardian(ctx, tick);

  const drewCharizard = pmdAnimator?.draw(
    ctx,
    'charizard',
    'idle',
    'down',
    2 * TILE_SIZE + 8,
    6 * TILE_SIZE + 14,
    tick,
    0.85,
  );
  if (!drewCharizard) {
    drawFallbackGuardian(ctx, 2, 6, '#ea580c', '#fde047', tick);
  }

  const drewGroudon = pmdAnimator?.draw(
    ctx,
    'groudon',
    'idle',
    'down',
    12 * TILE_SIZE + 8,
    6 * TILE_SIZE + 14,
    tick,
    0.85,
  );
  if (!drewGroudon) {
    drawFallbackGuardian(ctx, 12, 6, '#b91c1c', '#fbbf24', tick);
  }

  // 5. Ambient Rising Forge Embers
  ctx.save();
  for (const m of FORGE_MOTES) {
    const py = (m.y - tick * m.speed) % (9 * TILE_SIZE);
    const actualY = 2.5 * TILE_SIZE + ((py + 9 * TILE_SIZE) % (9 * TILE_SIZE));
    const floatX = m.x + Math.sin(tick * 0.05 + m.phase) * 3;
    ctx.fillStyle = m.color;
    ctx.globalAlpha = 0.35 + 0.3 * Math.sin(tick * 0.1 + m.phase);
    ctx.fillRect(Math.floor(floatX), Math.floor(actualY), 1.5, 1.5);
  }
  ctx.restore();

  // 6. Interactive Thermal Plasma Shockwaves
  ctx.save();
  for (let i = activePlasmaWaves.length - 1; i >= 0; i--) {
    const wave = activePlasmaWaves[i];
    wave.radius += 2.4;
    wave.alpha = Math.max(0, 1 - wave.radius / wave.maxRadius);

    ctx.strokeStyle = wave.color;
    ctx.globalAlpha = wave.alpha;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(wave.x, wave.y, wave.radius, 0, Math.PI * 2);
    ctx.stroke();

    if (wave.alpha > 0.2) {
      drawPixelText(
        ctx,
        wave.text,
        Math.floor(wave.x),
        Math.floor(wave.y - 18 - (1 - wave.alpha) * 14),
        wave.color,
        1,
        'center',
      );
    }

    if (wave.radius >= wave.maxRadius) {
      activePlasmaWaves.splice(i, 1);
    }
  }
  ctx.restore();
}
