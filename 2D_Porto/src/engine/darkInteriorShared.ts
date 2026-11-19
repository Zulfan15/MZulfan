import { TILE_SIZE } from './sprites';
import type { Dir } from './types';

export const DARK_INTERIOR_COLS = 15;
export const DARK_INTERIOR_ROWS = 12;
export const DARK_INTERIOR_SPAWN: { x: number; y: number; dir: Dir } = { x: 7, y: 10, dir: 'up' };

export type AbyssalSealKey = 'echoes' | 'ember' | 'valor' | 'eternity';

export interface AbyssalSealsState {
  echoes: boolean;   // Shadow Cathedral: Echo Organ Memory
  ember: boolean;    // Crimson Reactor Forge: Magma Balancer
  valor: boolean;    // Blood Manor: Shadow Logic Duel vs Darkrai
  eternity: boolean; // Chained Chrono Vault: 4-Gear Clockwork Lock
  unlockedAt?: Record<AbyssalSealKey, string>;
}

export const ABYSSAL_SEALS_META: Record<
  AbyssalSealKey,
  { name: string; icon: string; ward: string; color: string; desc: string }
> = {
  echoes: {
    name: 'Seal of Echoes',
    icon: '🟣',
    ward: 'Shadow Cathedral (NW)',
    color: '#a855f7',
    desc: 'Unlocks ancient digital echoes resonant within gothic obsidian pipe organs.',
  },
  ember: {
    name: 'Seal of Ember',
    icon: '🔥',
    ward: 'Crimson Reactor Forge (NE)',
    color: '#f43f5e',
    desc: 'Harnesses raw geothermal plasma forged in deep abyssal magma chambers.',
  },
  valor: {
    name: 'Seal of Valor',
    icon: '🩸',
    ward: 'Demon Keep & Blood Manor (SW)',
    color: '#ef4444',
    desc: 'Conferred upon vanquishing architectural nightmares in Darkrai’s court.',
  },
  eternity: {
    name: 'Seal of Eternity',
    icon: '⏳',
    ward: 'Chained Chrono Vault (SE)',
    color: '#fbbf24',
    desc: 'Shatters temporal chains to reveal the chronological epochs of creation.',
  },
};

const SEALS_STORAGE_KEY = 'dark_castle:seals_v1';

export function getAbyssalSeals(): AbyssalSealsState {
  if (typeof window === 'undefined') {
    return { echoes: false, ember: false, valor: false, eternity: false };
  }
  try {
    const raw = window.localStorage.getItem(SEALS_STORAGE_KEY);
    if (!raw) return { echoes: false, ember: false, valor: false, eternity: false };
    const parsed = JSON.parse(raw);
    return {
      echoes: Boolean(parsed.echoes),
      ember: Boolean(parsed.ember),
      valor: Boolean(parsed.valor),
      eternity: Boolean(parsed.eternity),
      unlockedAt: parsed.unlockedAt || {},
    };
  } catch {
    return { echoes: false, ember: false, valor: false, eternity: false };
  }
}

export function awardAbyssalSeal(seal: AbyssalSealKey): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const current = getAbyssalSeals();
    if (current[seal]) return false; // Already awarded
    current[seal] = true;
    current.unlockedAt = current.unlockedAt || { echoes: '', ember: '', valor: '', eternity: '' };
    current.unlockedAt[seal] = new Date().toISOString();
    window.localStorage.setItem(SEALS_STORAGE_KEY, JSON.stringify(current));
    window.dispatchEvent(new CustomEvent('abyssal-seal-unlocked', { detail: { seal, state: current } }));
    return true;
  } catch {
    return false;
  }
}

export function countAbyssalSeals(state?: AbyssalSealsState): number {
  const s = state || getAbyssalSeals();
  return (s.echoes ? 1 : 0) + (s.ember ? 1 : 0) + (s.valor ? 1 : 0) + (s.eternity ? 1 : 0);
}

export function isAllSealsUnlocked(state?: AbyssalSealsState): boolean {
  const s = state || getAbyssalSeals();
  return s.echoes && s.ember && s.valor && s.eternity;
}

export interface DarkInteriorPropTarget {
  type: 'event' | 'note' | 'place' | 'url';
  name?: string;
  text?: string;
  id?: string;
  href?: string;
  cta?: string;
}

export interface DarkInteriorProp {
  id: string;
  kind: 'prop' | 'npc' | 'exit';
  x: number;
  y: number;
  w: number;
  h: number;
  target: DarkInteriorPropTarget;
  label: string;
  style: string;
  labelLift?: number;
  hint?: string;
  hideLabel?: boolean;
}

/**
 * Shared base room collision generator for 15x12 interior rooms.
 * Solid perimeter walls, top wall (y: 0..2) solid, exit door at x: 7, y: 11 walkable.
 */
export function createDarkInteriorBaseCollision(): Uint8Array {
  const w = DARK_INTERIOR_COLS;
  const h = DARK_INTERIOR_ROWS;
  const coll = new Uint8Array(w * h);

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      // Perimeter walls are blocked
      if (x === 0 || x === w - 1 || y === 0 || y === h - 1) {
        coll[y * w + x] = 1;
      }
      // Upper wall depth (rows 1 and 2)
      if (y <= 2) {
        coll[y * w + x] = 1;
      }
    }
  }

  // South door exit threshold is walkable
  coll[11 * w + 7] = 0;
  return coll;
}

/**
 * Shared rendering of the room walls, floor tiles, and south exit portal mat.
 */
export function renderDarkInteriorShell(
  ctx: CanvasRenderingContext2D,
  theme: {
    wallColor: string;
    wallTrim: string;
    floorA: string;
    floorB: string;
    accentGlow: string;
    carpetColor?: string;
    carpetTrim?: string;
  },
  tick: number
) {
  const w = DARK_INTERIOR_COLS;
  const h = DARK_INTERIOR_ROWS;

  // 1. Base floor checkered tiles (y: 3..11, x: 1..13)
  for (let y = 3; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      ctx.fillStyle = (x + y) % 2 === 0 ? theme.floorA : theme.floorB;
      ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);

      // Subtle tile bevel
      ctx.fillStyle = 'rgba(0, 0, 0, 0.22)';
      ctx.fillRect(x * TILE_SIZE, (y + 1) * TILE_SIZE - 1, TILE_SIZE, 1);
      ctx.fillRect((x + 1) * TILE_SIZE - 1, y * TILE_SIZE, 1, TILE_SIZE);
    }
  }

  // 2. Central Carpet Runner (x: 6..8, y: 3..10)
  if (theme.carpetColor) {
    const cx = 6 * TILE_SIZE;
    const cy = 3 * TILE_SIZE;
    const cw = 3 * TILE_SIZE;
    const ch = 8 * TILE_SIZE;

    ctx.fillStyle = theme.carpetColor;
    ctx.fillRect(cx, cy, cw, ch);

    if (theme.carpetTrim) {
      ctx.strokeStyle = theme.carpetTrim;
      ctx.lineWidth = 1;
      ctx.strokeRect(cx + 1, cy + 1, cw - 2, ch - 2);

      // Gold/accent tassels on bottom
      ctx.fillStyle = theme.carpetTrim;
      for (let tx = cx + 2; tx < cx + cw; tx += 4) {
        ctx.fillRect(tx, cy + ch - 1, 2, 2);
      }
    }
  }

  // 3. North Solid Wall & Arch Trim (y: 0..2)
  ctx.fillStyle = theme.wallColor;
  ctx.fillRect(0, 0, w * TILE_SIZE, 3 * TILE_SIZE);

  // Upper wall cornice
  ctx.fillStyle = theme.wallTrim;
  ctx.fillRect(0, 0, w * TILE_SIZE, 3);
  ctx.fillRect(0, 3 * TILE_SIZE - 2, w * TILE_SIZE, 2);

  // Gothic Wall Rib Pillars
  for (let px = 2; px < w; px += 3) {
    ctx.fillStyle = theme.wallTrim;
    ctx.fillRect(px * TILE_SIZE - 1, 3, 2, 3 * TILE_SIZE - 5);
    ctx.fillStyle = theme.accentGlow;
    ctx.fillRect(px * TILE_SIZE - 2, 3 * TILE_SIZE - 4, 4, 2);
  }

  // Left & Right perimeter solid walls
  ctx.fillStyle = theme.wallColor;
  ctx.fillRect(0, 3 * TILE_SIZE, TILE_SIZE, (h - 3) * TILE_SIZE);
  ctx.fillRect((w - 1) * TILE_SIZE, 3 * TILE_SIZE, TILE_SIZE, (h - 3) * TILE_SIZE);

  // Wall side trims
  ctx.fillStyle = theme.wallTrim;
  ctx.fillRect(TILE_SIZE - 1, 3 * TILE_SIZE, 1, (h - 3) * TILE_SIZE);
  ctx.fillRect((w - 1) * TILE_SIZE, 3 * TILE_SIZE, 1, (h - 3) * TILE_SIZE);

  // 4. South Wall & Exit Threshold (y: 11)
  ctx.fillStyle = theme.wallColor;
  ctx.fillRect(0, (h - 1) * TILE_SIZE, w * TILE_SIZE, TILE_SIZE);
  ctx.fillStyle = theme.wallTrim;
  ctx.fillRect(0, (h - 1) * TILE_SIZE, w * TILE_SIZE, 2);

  // Exit Door threshold at x: 7, y: 11
  const doorX = 7 * TILE_SIZE;
  const doorY = 11 * TILE_SIZE;

  // Luminous portal return mat
  const pulse = 0.4 + 0.25 * Math.sin(tick * 0.1);
  ctx.fillStyle = `rgba(168, 85, 247, ${pulse})`;
  ctx.fillRect(doorX - 2, doorY, TILE_SIZE + 4, TILE_SIZE);

  ctx.strokeStyle = '#c084fc';
  ctx.lineWidth = 1;
  ctx.strokeRect(doorX - 2, doorY, TILE_SIZE + 4, TILE_SIZE);

  // "EXIT" indicator glyph
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(doorX + 5, doorY + 6, 6, 2);
  ctx.fillRect(doorX + 7, doorY + 8, 2, 3);
}

/**
 * Draws an interactive NPC (Gengar, Machinedramon, Darkrai, Dialga) with hovering nameplate.
 */
export function drawDarkKeeperNPC(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  type: 'gengar' | 'machinedramon' | 'darkrai' | 'dialga',
  tick: number
) {
  const px = x * TILE_SIZE;
  const py = y * TILE_SIZE;
  const bob = Math.sin(tick * 0.1) * 2;

  ctx.save();
  ctx.translate(px, py + bob);

  if (type === 'gengar') {
    // Shadow Gengar (spooky violet blob with ruby eyes & devilish grin)
    ctx.fillStyle = 'rgba(147, 51, 234, 0.3)';
    ctx.beginPath();
    ctx.ellipse(8, 14, 10, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    // Body
    ctx.fillStyle = '#6b21a8';
    ctx.beginPath();
    ctx.arc(8, 8, 7, 0, Math.PI * 2);
    ctx.fill();

    // Spiky ears
    ctx.beginPath();
    ctx.moveTo(3, 4);
    ctx.lineTo(1, 0);
    ctx.lineTo(5, 3);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(13, 4);
    ctx.lineTo(15, 0);
    ctx.lineTo(11, 3);
    ctx.closePath();
    ctx.fill();

    // Glowing Red Eyes
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(4, 6, 2, 2);
    ctx.fillRect(10, 6, 2, 2);

    // Wide Grin
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(5, 10, 6, 1);
    ctx.fillRect(6, 11, 4, 1);
  } else if (type === 'machinedramon') {
    // Machinedramon Magitech Core (Chrome plated cyber-dragon turret with glowing red vents)
    ctx.fillStyle = 'rgba(239, 68, 68, 0.35)';
    ctx.beginPath();
    ctx.ellipse(8, 14, 11, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Steel Torso
    ctx.fillStyle = '#475569';
    ctx.fillRect(2, 3, 12, 10);
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(3, 4, 10, 3);

    // Red Core Eye
    ctx.fillStyle = tick % 10 < 5 ? '#f43f5e' : '#fb7185';
    ctx.fillRect(6, 5, 4, 3);

    // Twin Shoulder Cannons
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, 3, 6);
    ctx.fillRect(13, 0, 3, 6);
    ctx.fillStyle = '#f43f5e';
    ctx.fillRect(1, 0, 1, 2);
    ctx.fillRect(14, 0, 1, 2);
  } else if (type === 'darkrai') {
    // Darkrai (Ethereal shadow ghost with white spectral hair and crimson chest collar)
    ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
    ctx.beginPath();
    ctx.ellipse(8, 15, 9, 3, 0, 0, Math.PI * 2);
    ctx.fill();

    // Shadow mist torso
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.moveTo(8, 2);
    ctx.lineTo(2, 14);
    ctx.lineTo(14, 14);
    ctx.closePath();
    ctx.fill();

    // Crimson spiky jagged collar
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(4, 7, 8, 3);
    ctx.fillRect(3, 6, 2, 2);
    ctx.fillRect(11, 6, 2, 2);

    // White flowing spectral hair/plume
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.arc(8, 4, 4, Math.PI, 0);
    ctx.lineTo(12, 1);
    ctx.lineTo(8, 3);
    ctx.fill();

    // Blue piercing single eye
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(7, 5, 2, 2);
  } else if (type === 'dialga') {
    // Dialga Chrono-Warden (Metallic navy quadruped with crystal cobalt chest plate)
    ctx.fillStyle = 'rgba(56, 189, 248, 0.35)';
    ctx.beginPath();
    ctx.ellipse(8, 14, 11, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    // Diamond chest body
    ctx.fillStyle = '#1e3a8a';
    ctx.fillRect(3, 4, 10, 9);

    // Glowing Diamond Core
    ctx.fillStyle = '#67e8f9';
    ctx.beginPath();
    ctx.moveTo(8, 4);
    ctx.lineTo(11, 7);
    ctx.lineTo(8, 10);
    ctx.lineTo(5, 7);
    ctx.closePath();
    ctx.fill();

    // Silver Crest Fins
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(1, 1, 3, 4);
    ctx.fillRect(12, 1, 3, 4);
    ctx.fillRect(6, 0, 4, 3);
  }

  ctx.restore();
}
