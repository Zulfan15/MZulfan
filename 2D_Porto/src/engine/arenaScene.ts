import type { Dir } from './types';
import { TILE_SIZE } from './sprites';

export const ARENA_COLS = 15;
export const ARENA_ROWS = 12;

export const ARENA_SPAWN: { x: number; y: number; dir: Dir } = {
  x: 7,
  y: 10,
  dir: 'up',
};

// 1 = blocked wall/prop, 0 = walkable stadium floor
// 15x12 Grand Battle Frontier Colosseum
export const ARENA_COLLISION: number[] = [
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, // y=0 North Jumbotron & Stadium Wall
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, // y=1 Spectator Stands & Champion Stage
  1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, // y=2 Podium Steps
  1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, // y=3 Battle Terminal (1..3), Lucario (5), Mewtwo (7), Algorithm Dojo (10..12)
  1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, // y=4 Front of upper consoles
  1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, // y=5 Upper Battle Court
  1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, // y=6 Center Poké Ball Line (Walkable!)
  1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, // y=7 Trophy Vault (1..3), Stat Radar (10..12)
  1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, // y=8 Lower props bottom
  1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, // y=9 Lower Battle Court
  1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, // y=10 Challenger Entrance Walkway
  1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, // y=11 Exit Gate at (7, 11)
];

export interface ArenaProp {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  target: {
    type: 'place' | 'event' | 'note';
    id?: string;
    name?: string;
    text?: string;
  };
}

export const ARENA_PROPS: ArenaProp[] = [
  {
    id: 'mewtwo-boss',
    x: 7,
    y: 3,
    w: 1,
    h: 1,
    label: 'Frontier Brain Mewtwo 🔮',
    target: {
      type: 'event',
      name: 'mewtwo-boss',
    },
  },
  {
    id: 'lucario-coach',
    x: 5,
    y: 3,
    w: 1,
    h: 1,
    label: 'Tactical Coach Lucario 🌀',
    target: {
      type: 'event',
      name: 'lucario-coach',
    },
  },
  {
    id: 'referee-dan',
    x: 8,
    y: 3,
    w: 1,
    h: 1,
    label: 'Chief Referee Victor 🏁',
    target: {
      type: 'event',
      name: 'referee-dan',
    },
  },
  {
    id: 'battle-terminal',
    x: 1,
    y: 3,
    w: 3,
    h: 2,
    label: 'Battle Simulator Deck ⚔️',
    target: {
      type: 'event',
      name: 'battle-terminal',
    },
  },
  {
    id: 'algorithm-dojo',
    x: 10,
    y: 3,
    w: 3,
    h: 2,
    label: 'Algorithm & AI Gauntlet 🧠',
    target: {
      type: 'event',
      name: 'algorithm-dojo',
    },
  },
  {
    id: 'trophy-vault',
    x: 1,
    y: 7,
    w: 3,
    h: 2,
    label: 'Championship Trophy Vault 🏆',
    target: {
      type: 'event',
      name: 'trophy-vault',
    },
  },
  {
    id: 'stat-radar',
    x: 10,
    y: 7,
    w: 3,
    h: 2,
    label: '6-Axis Stack IV Scanner 📊',
    target: {
      type: 'event',
      name: 'stat-radar',
    },
  },
  {
    id: 'exit',
    x: 7,
    y: 11,
    w: 1,
    h: 1,
    label: 'Exit to Town Square',
    target: {
      type: 'place',
      id: 'town',
    },
  },
];

interface ArenaBannerFx {
  text: string;
  color: string;
  startTick: number;
}

let activeArenaFx: ArenaBannerFx | null = null;
let latestTick = 0;

export function triggerArenaBattleAnimation(text = 'CRITICAL HIT! 100% EFFICIENCY', color = '#a855f7') {
  activeArenaFx = {
    text,
    color,
    startTick: latestTick,
  };
}

export function createArenaBackgroundCanvas(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = ARENA_COLS * TILE_SIZE;
  canvas.height = ARENA_ROWS * TILE_SIZE;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;

  const W = canvas.width;
  const H = canvas.height;

  // 1. Stadium Base Floor (Dark Slate Tech Colosseum)
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, W, H);

  for (let r = 2; r < ARENA_ROWS; r++) {
    for (let c = 1; c < ARENA_COLS - 1; c++) {
      const tx = c * TILE_SIZE;
      const ty = r * TILE_SIZE;
      const isAlt = (r + c) % 2 === 0;
      ctx.fillStyle = isAlt ? '#1e293b' : '#172033';
      ctx.fillRect(tx, ty, TILE_SIZE, TILE_SIZE);
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.08)';
      ctx.strokeRect(tx, ty, TILE_SIZE, TILE_SIZE);
    }
  }

  // 2. North Stadium Wall, Spectator Tier & Holographic Jumbotron (y=0..1)
  const wallGrad = ctx.createLinearGradient(0, 0, 0, TILE_SIZE * 2.2);
  wallGrad.addColorStop(0, '#090d16');
  wallGrad.addColorStop(0.6, '#1e1b4b');
  wallGrad.addColorStop(1, '#312e81');
  ctx.fillStyle = wallGrad;
  ctx.fillRect(0, 0, W, TILE_SIZE * 2.2);

  // Gold & Indigo Trim along top wall
  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(TILE_SIZE, TILE_SIZE * 2.1, W - TILE_SIZE * 2, 3);

  // Center Jumbotron Screen (x=4..10, y=0.2..1.8)
  const jx = 4 * TILE_SIZE;
  const jy = 5;
  const jw = 7 * TILE_SIZE;
  const jh = TILE_SIZE * 1.75;
  ctx.fillStyle = '#020617';
  ctx.fillRect(jx, jy, jw, jh);
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 2;
  ctx.strokeRect(jx, jy, jw, jh);

  // VS Graphic inside Jumbotron
  ctx.fillStyle = 'rgba(56, 189, 248, 0.15)';
  ctx.fillRect(jx + 3, jy + 3, jw / 2 - 3, jh - 6);
  ctx.fillStyle = 'rgba(244, 63, 94, 0.15)';
  ctx.fillRect(jx + jw / 2, jy + 3, jw / 2 - 3, jh - 6);

  ctx.font = 'bold 8px monospace';
  ctx.textAlign = 'center';
  ctx.fillStyle = '#38bdf8';
  ctx.fillText('CHALLENGER', jx + jw * 0.25, jy + 12);
  ctx.fillStyle = '#f43f5e';
  ctx.fillText('MEWTWO AI', jx + jw * 0.75, jy + 12);
  ctx.fillStyle = '#facc15';
  ctx.font = 'bold 9px monospace';
  ctx.fillText('⚔️ VS ⚔️', jx + jw * 0.5, jy + 21);

  // Stadium Spotlights Left & Right on North Wall
  for (const sx of [2 * TILE_SIZE, 12.5 * TILE_SIZE]) {
    ctx.fillStyle = '#334155';
    ctx.fillRect(sx - 8, 6, 16, 18);
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.arc(sx, 15, 5, 0, Math.PI * 2);
    ctx.fill();
  }

  // 3. Central Championship Battle Court (x=4..10, y=4..9)
  const courtX = 4 * TILE_SIZE + 2;
  const courtY = 4 * TILE_SIZE + 4;
  const courtW = 7 * TILE_SIZE - 4;
  const courtH = 6 * TILE_SIZE - 8;

  // Clay / Cyber-Turf Court Gradient
  const turfGrad = ctx.createLinearGradient(courtX, courtY, courtX, courtY + courtH);
  turfGrad.addColorStop(0, '#3b1d5e'); // Psychic North Half
  turfGrad.addColorStop(0.5, '#1e293b');
  turfGrad.addColorStop(1, '#1e3a5f'); // Challenger South Half
  ctx.fillStyle = turfGrad;
  ctx.fillRect(courtX, courtY, courtW, courtH);

  // White Stadium Court Boundary Lines
  ctx.strokeStyle = 'rgba(248, 250, 252, 0.85)';
  ctx.lineWidth = 2;
  ctx.strokeRect(courtX, courtY, courtW, courtH);

  // Center Midline
  const midY = courtY + courtH / 2;
  ctx.beginPath();
  ctx.moveTo(courtX, midY);
  ctx.lineTo(courtX + courtW, midY);
  ctx.stroke();

  // Center Poké Ball Emblem on Court Floor
  const centerX = 7.5 * TILE_SIZE;
  const centerY = midY;
  const ballR = 20;

  ctx.save();
  ctx.beginPath();
  ctx.arc(centerX, centerY, ballR, Math.PI, 0, false);
  ctx.fillStyle = '#ef4444';
  ctx.fill();
  ctx.beginPath();
  ctx.arc(centerX, centerY, ballR, 0, Math.PI, false);
  ctx.fillStyle = '#f8fafc';
  ctx.fill();

  ctx.lineWidth = 2.5;
  ctx.strokeStyle = '#0f172a';
  ctx.beginPath();
  ctx.arc(centerX, centerY, ballR, 0, Math.PI * 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(centerX - ballR, centerY);
  ctx.lineTo(centerX + ballR, centerY);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(centerX, centerY, 6, 0, Math.PI * 2);
  ctx.fillStyle = '#f8fafc';
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  // North Champion Box (Blue/Purple) & South Challenger Box (Red/Amber)
  ctx.fillStyle = '#6366f1';
  ctx.fillRect(centerX - 18, courtY + 5, 36, 10);
  ctx.strokeStyle = '#e0e7ff';
  ctx.lineWidth = 1;
  ctx.strokeRect(centerX - 18, courtY + 5, 36, 10);

  ctx.fillStyle = '#ef4444';
  ctx.fillRect(centerX - 18, courtY + courtH - 15, 36, 10);
  ctx.strokeStyle = '#fee2e2';
  ctx.strokeRect(centerX - 18, courtY + courtH - 15, 36, 10);

  // 4. Champion Podium at (5..9, y=2..3)
  const podX = 5 * TILE_SIZE;
  const podY = 2.3 * TILE_SIZE;
  const podW = 5 * TILE_SIZE;
  const podH = 1.6 * TILE_SIZE;
  ctx.fillStyle = '#312e81';
  ctx.fillRect(podX, podY, podW, podH);
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 2;
  ctx.strokeRect(podX, podY, podW, podH);

  // 5. Left Upper Prop: Battle Simulator Terminal (x=1..3, y=3..4)
  drawBattleSimulatorConsole(ctx, 1 * TILE_SIZE, 3 * TILE_SIZE);

  // 6. Right Upper Prop: Algorithm & AI Gauntlet Dojo (x=10..12, y=3..4)
  drawAlgorithmDojoStation(ctx, 10 * TILE_SIZE, 3 * TILE_SIZE);

  // 7. Left Lower Prop: Championship Trophy Vault (x=1..3, y=7..8)
  drawTrophyVaultCase(ctx, 1 * TILE_SIZE, 7 * TILE_SIZE);

  // 8. Right Lower Prop: 6-Axis Stack IV Scanner (x=10..12, y=7..8)
  drawStatRadarScanner(ctx, 10 * TILE_SIZE, 7 * TILE_SIZE);

  // 9. NPCs: Frontier Brain Mewtwo (7, 3), Lucario (5, 3), Referee (8, 3)
  drawLucarioCoach(ctx, 5 * TILE_SIZE, 3 * TILE_SIZE);
  drawMewtwoBoss(ctx, 7 * TILE_SIZE, 3 * TILE_SIZE);
  drawRefereeNpc(ctx, 8 * TILE_SIZE, 3 * TILE_SIZE);

  // 10. Outer Colosseum Walls & Exit Mat at (7, 11)
  ctx.fillStyle = '#090d16';
  ctx.fillRect(0, 0, TILE_SIZE, H);
  ctx.fillRect(W - TILE_SIZE, 0, TILE_SIZE, H);
  ctx.fillRect(0, H - TILE_SIZE, 7 * TILE_SIZE, TILE_SIZE);
  ctx.fillRect(8 * TILE_SIZE, H - TILE_SIZE, 7 * TILE_SIZE, TILE_SIZE);

  // Exit Gate Carpet at (7, 11)
  const ex = 7 * TILE_SIZE;
  const ey = 11 * TILE_SIZE;
  ctx.fillStyle = '#b91c1c';
  ctx.fillRect(ex + 2, ey + 2, TILE_SIZE - 4, TILE_SIZE - 2);
  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(ex + 2, ey + 2, TILE_SIZE - 4, TILE_SIZE - 2);
  ctx.fillStyle = '#fde68a';
  ctx.font = 'bold 6px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('EXIT', ex + TILE_SIZE / 2, ey + 14);

  return canvas;
}

function drawBattleSimulatorConsole(ctx: CanvasRenderingContext2D, x: number, y: number) {
  const w = 3 * TILE_SIZE;
  const h = 2 * TILE_SIZE;

  // Base desk
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(x + 2, y + 6, w - 4, h - 8);
  ctx.strokeStyle = '#ef4444';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(x + 2, y + 6, w - 4, h - 8);

  // Dual Tactical Screens
  ctx.fillStyle = '#020617';
  ctx.fillRect(x + 6, y + 10, 26, 18);
  ctx.fillRect(x + 36, y + 10, 26, 18);
  ctx.strokeStyle = '#38bdf8';
  ctx.strokeRect(x + 6, y + 10, 26, 18);
  ctx.strokeStyle = '#f43f5e';
  ctx.strokeRect(x + 36, y + 10, 26, 18);

  // HP bars inside screens
  ctx.fillStyle = '#22c55e';
  ctx.fillRect(x + 9, y + 14, 18, 3);
  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(x + 39, y + 14, 14, 3);

  // Arcade Joystick & Battle Buttons
  ctx.fillStyle = '#ef4444';
  ctx.beginPath();
  ctx.arc(x + 18, y + 36, 3.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#eab308';
  ctx.beginPath();
  ctx.arc(x + 28, y + 36, 3.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#38bdf8';
  ctx.beginPath();
  ctx.arc(x + 48, y + 36, 3.5, 0, Math.PI * 2);
  ctx.fill();
}

function drawAlgorithmDojoStation(ctx: CanvasRenderingContext2D, x: number, y: number) {
  const w = 3 * TILE_SIZE;
  const h = 2 * TILE_SIZE;

  ctx.fillStyle = '#1e1b4b';
  ctx.fillRect(x + 2, y + 6, w - 4, h - 8);
  ctx.strokeStyle = '#a855f7';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(x + 2, y + 6, w - 4, h - 8);

  // Holographic Brain / Matrix Screen
  ctx.fillStyle = '#090d16';
  ctx.fillRect(x + 8, y + 10, w - 16, 20);
  ctx.strokeStyle = '#c084fc';
  ctx.strokeRect(x + 8, y + 10, w - 16, 20);

  ctx.fillStyle = '#d8b4fe';
  ctx.font = 'bold 7px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('AI GAUNTLET', x + w / 2, y + 23);

  // Neural nodes
  ctx.fillStyle = '#38bdf8';
  for (let i = 0; i < 4; i++) {
    ctx.fillRect(x + 12 + i * 14, y + 34, 8, 5);
  }
}

function drawTrophyVaultCase(ctx: CanvasRenderingContext2D, x: number, y: number) {
  const w = 3 * TILE_SIZE;
  const h = 2 * TILE_SIZE;

  // Velvet & Gold Pedestal
  ctx.fillStyle = '#27171c';
  ctx.fillRect(x + 2, y + 6, w - 4, h - 8);
  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 2;
  ctx.strokeRect(x + 2, y + 6, w - 4, h - 8);

  // Glass Display Top
  ctx.fillStyle = 'rgba(254, 243, 199, 0.12)';
  ctx.fillRect(x + 6, y + 10, w - 12, 24);

  // 3 Trophies (Gold Cup, Cyber Shield, Academic Star)
  ctx.fillStyle = '#fbbf24';
  ctx.beginPath();
  ctx.arc(x + 18, y + 22, 6, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#38bdf8';
  ctx.beginPath();
  ctx.arc(x + 36, y + 22, 6, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#f43f5e';
  ctx.beginPath();
  ctx.arc(x + 54, y + 22, 6, 0, Math.PI * 2);
  ctx.fill();
}

function drawStatRadarScanner(ctx: CanvasRenderingContext2D, x: number, y: number) {
  const w = 3 * TILE_SIZE;
  const h = 2 * TILE_SIZE;

  ctx.fillStyle = '#0f2922';
  ctx.fillRect(x + 2, y + 6, w - 4, h - 8);
  ctx.strokeStyle = '#10b981';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(x + 2, y + 6, w - 4, h - 8);

  // Radar Hexagon Graphic
  const cx = x + w / 2;
  const cy = y + h / 2 + 2;
  ctx.strokeStyle = '#34d399';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i;
    const rx = cx + Math.cos(angle) * 14;
    const ry = cy + Math.sin(angle) * 11;
    if (i === 0) ctx.moveTo(rx, ry);
    else ctx.lineTo(rx, ry);
  }
  ctx.closePath();
  ctx.fillStyle = 'rgba(16, 185, 129, 0.28)';
  ctx.fill();
  ctx.stroke();
}

function drawMewtwoBoss(ctx: CanvasRenderingContext2D, x: number, y: number) {
  const cx = x + TILE_SIZE / 2;
  const cy = y + TILE_SIZE / 2;

  // Psychic Shadow
  ctx.fillStyle = 'rgba(168, 85, 247, 0.35)';
  ctx.beginPath();
  ctx.ellipse(cx, cy + 9, 9, 4, 0, 0, Math.PI * 2);
  ctx.fill();

  // Purple Tail
  ctx.strokeStyle = '#9333ea';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(cx, cy + 4);
  ctx.quadraticCurveTo(cx + 10, cy + 2, cx + 8, cy - 6);
  ctx.stroke();

  // Body & Chest
  ctx.fillStyle = '#e9d5ff';
  ctx.beginPath();
  ctx.ellipse(cx, cy + 1, 5.5, 7, 0, 0, Math.PI * 2);
  ctx.fill();

  // Head & Horns
  ctx.beginPath();
  ctx.arc(cx, cy - 6, 5.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillRect(cx - 5, cy - 12, 2.5, 4);
  ctx.fillRect(cx + 2.5, cy - 12, 2.5, 4);

  // Glowing Psychic Eyes
  ctx.fillStyle = '#c084fc';
  ctx.fillRect(cx - 3.5, cy - 7, 2, 2);
  ctx.fillRect(cx + 1.5, cy - 7, 2, 2);
}

function drawLucarioCoach(ctx: CanvasRenderingContext2D, x: number, y: number) {
  const cx = x + TILE_SIZE / 2;
  const cy = y + TILE_SIZE / 2;

  // Aura Shadow
  ctx.fillStyle = 'rgba(56, 189, 248, 0.3)';
  ctx.beginPath();
  ctx.ellipse(cx, cy + 9, 8, 3.5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Yellow Torso & Blue Limbs
  ctx.fillStyle = '#facc15';
  ctx.fillRect(cx - 4, cy - 2, 8, 7);
  ctx.fillStyle = '#2563eb';
  ctx.beginPath();
  ctx.arc(cx, cy - 6, 5, 0, Math.PI * 2);
  ctx.fill();

  // Ears
  ctx.fillRect(cx - 4.5, cy - 12, 2.5, 5);
  ctx.fillRect(cx + 2, cy - 12, 2.5, 5);

  // Red Eyes
  ctx.fillStyle = '#ef4444';
  ctx.fillRect(cx - 3, cy - 7, 2, 1.5);
  ctx.fillRect(cx + 1, cy - 7, 2, 1.5);
}

function drawRefereeNpc(ctx: CanvasRenderingContext2D, x: number, y: number) {
  const cx = x + TILE_SIZE / 2;
  const cy = y + TILE_SIZE / 2;

  // Striped Referee Shirt
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(cx - 4, cy - 1, 8, 8);
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(cx - 2, cy - 1, 2, 8);
  ctx.fillRect(cx + 1, cy - 1, 2, 8);

  // Head & Cap
  ctx.fillStyle = '#fde68a';
  ctx.beginPath();
  ctx.arc(cx, cy - 5, 4.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#dc2626';
  ctx.fillRect(cx - 5, cy - 9, 10, 3);

  // Signal Flags (Red & Green)
  ctx.fillStyle = '#ef4444';
  ctx.fillRect(cx - 9, cy - 3, 4, 4);
  ctx.fillStyle = '#22c55e';
  ctx.fillRect(cx + 5, cy - 3, 4, 4);
}

export function renderArenaAnimations(ctx: CanvasRenderingContext2D, tick: number) {
  latestTick = tick;

  // 1. Mewtwo Psychic Aura Rings & Levitating Orbs at (7, 3)
  const mx = 7.5 * TILE_SIZE;
  const my = 3.5 * TILE_SIZE;
  const pulse = Math.sin(tick * 0.08) * 3;

  ctx.save();
  ctx.strokeStyle = 'rgba(192, 132, 252, 0.55)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(mx, my - 2, 11 + pulse, 0, Math.PI * 2);
  ctx.stroke();

  // Two orbiting psychic spheres
  for (let i = 0; i < 2; i++) {
    const angle = tick * 0.07 + i * Math.PI;
    const ox = mx + Math.cos(angle) * 13;
    const oy = my - 2 + Math.sin(angle) * 7;
    ctx.fillStyle = '#d8b4fe';
    ctx.beginPath();
    ctx.arc(ox, oy, 2.5, 0, Math.PI * 2);
    ctx.fill();
  }

  // 2. Lucario Aura Sphere Pulse at (5, 3)
  const lx = 5.5 * TILE_SIZE;
  const ly = 3.5 * TILE_SIZE;
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.5)';
  ctx.beginPath();
  ctx.arc(lx, ly, 9 + Math.cos(tick * 0.1) * 2, 0, Math.PI * 2);
  ctx.stroke();

  // 3. Center Court Poké Ball Glow Pulse
  const centerX = 7.5 * TILE_SIZE;
  const centerY = 7 * TILE_SIZE;
  const glowAlpha = 0.15 + Math.abs(Math.sin(tick * 0.05)) * 0.2;
  ctx.strokeStyle = `rgba(250, 204, 21, ${glowAlpha.toFixed(2)})`;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(centerX, centerY, 23 + Math.sin(tick * 0.05) * 2, 0, Math.PI * 2);
  ctx.stroke();

  // 4. Active Battle / Action Shockwave & Banner FX
  if (activeArenaFx) {
    const elapsed = tick - activeArenaFx.startTick;
    if (elapsed < 110) {
      const progress = elapsed / 110;
      const radius = 12 + progress * 95;
      ctx.strokeStyle = activeArenaFx.color;
      ctx.globalAlpha = Math.max(0, 1 - progress);
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(centerX, centerY - 12, radius, 0, Math.PI * 2);
      ctx.stroke();

      // Floating Banner above Mewtwo & Center Court
      const fy = 2.4 * TILE_SIZE - progress * 16;
      ctx.globalAlpha = Math.min(1, (1 - progress) * 1.4);
      ctx.fillStyle = 'rgba(9, 13, 22, 0.9)';
      ctx.fillRect(centerX - 82, fy - 10, 164, 16);
      ctx.strokeStyle = activeArenaFx.color;
      ctx.lineWidth = 1.5;
      ctx.strokeRect(centerX - 82, fy - 10, 164, 16);

      ctx.fillStyle = '#fef08a';
      ctx.font = 'bold 7px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(activeArenaFx.text.slice(0, 28), centerX, fy + 1);
    } else {
      activeArenaFx = null;
    }
  }
  ctx.restore();
}
