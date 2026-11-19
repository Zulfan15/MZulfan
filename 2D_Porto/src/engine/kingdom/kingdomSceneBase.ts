import { TILE_SIZE } from '../sprites';
import { drawPixelText } from '../devScene';
import type { PokemonPMDAnimator } from '../pokemonPMDAnimator';
import { getDigimonById } from '../digimonCatalog';
import { requestDigimonSprites, selectDigimonOverworldFrame } from '../digiSpriteLoader';
import {
  KINGDOM_INTERIOR_COLS,
  KINGDOM_INTERIOR_ROWS,
  createKingdomInteriorBaseCollision,
} from '../kingdomInteriorShared';

export interface GuardianPlacement {
  kind: 'pmd' | 'digimon';
  id: string;
  tx: number;
  ty: number;
  facing?: 'down' | 'left' | 'right' | 'up';
  scaleFactor?: number;
  fallbackColor: string;
}

export interface KingdomRoomPalette {
  floorA: string;
  floorB: string;
  pitA: string;
  pitB: string;
  wallBg: string;
  wallBrick: string;
  trimGold: string;
  trimAccent: string;
  bannerColor: string;
  carpetColor: string;
  isWoodFloor?: boolean;
  isSandPit?: boolean;
  torchColor: string;
}

export interface KingdomWave {
  sceneId: string;
  text: string;
  color: string;
  radius: number;
  maxRadius: number;
  alpha: number;
}

const activeKingdomWaves: KingdomWave[] = [];

export function triggerKingdomWave(sceneId: string, text = 'AVALON BLESSING!', color = '#fbbf24'): void {
  activeKingdomWaves.push({
    sceneId,
    text,
    color,
    radius: 6,
    maxRadius: 72,
    alpha: 1,
  });
}

export function createStandardKingdomCollision(includeSidePillars = false): Uint8Array {
  const coll = createKingdomInteriorBaseCollision();
  const w = KINGDOM_INTERIOR_COLS;

  // North Tribune Altar (x: 6..8, y: 2)
  for (let x = 6; x <= 8; x++) {
    coll[2 * w + x] = 1;
  }

  // Four corner 2x2 station plinths
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

  // Flank Guardian Plinths (2, 6) & (12, 6)
  coll[6 * w + 2] = 1;
  coll[6 * w + 12] = 1;

  // Centerpiece Pedestal (7, 6) — unless open sand pit skips it
  if (!includeSidePillars) {
    coll[6 * w + 7] = 1;
  }

  // Four glowing corner torch braziers framing central pit
  coll[3 * w + 4] = 1;
  coll[3 * w + 10] = 1;
  coll[9 * w + 4] = 1;
  coll[9 * w + 10] = 1;

  return coll;
}

export function buildKingdomBackgroundCanvas(palette: KingdomRoomPalette): HTMLCanvasElement {
  const width = KINGDOM_INTERIOR_COLS * TILE_SIZE;
  const height = KINGDOM_INTERIOR_ROWS * TILE_SIZE;
  const off = document.createElement('canvas');
  off.width = width;
  off.height = height;
  const octx = off.getContext('2d');
  if (!octx) return off;

  // 1. Floor Grid (y >= 2)
  for (let y = 2; y < KINGDOM_INTERIOR_ROWS; y++) {
    for (let x = 0; x < KINGDOM_INTERIOR_COLS; x++) {
      const px = x * TILE_SIZE;
      const py = y * TILE_SIZE;
      const isBorder = x === 0 || x === KINGDOM_INTERIOR_COLS - 1 || y === KINGDOM_INTERIOR_ROWS - 1;

      if (isBorder) {
        octx.fillStyle = '#2b211a';
        octx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
        octx.fillStyle = palette.wallBrick;
        octx.fillRect(px + 1, py + 1, TILE_SIZE - 2, TILE_SIZE - 2);
        octx.fillStyle = palette.trimGold;
        octx.fillRect(px + 2, py + 2, 1, 1);
        octx.fillRect(px + TILE_SIZE - 3, py + TILE_SIZE - 3, 1, 1);
        continue;
      }

      const checker = (x + y) % 2 === 0;
      octx.fillStyle = checker ? palette.floorA : palette.floorB;
      octx.fillRect(px, py, TILE_SIZE, TILE_SIZE);

      if (palette.isWoodFloor) {
        octx.fillStyle = 'rgba(0,0,0,0.16)';
        octx.fillRect(px, py + 5, TILE_SIZE, 1);
        octx.fillRect(px, py + 11, TILE_SIZE, 1);
        octx.fillRect(px + (x % 2 === 0 ? 7 : 12), py, 1, TILE_SIZE);
      } else {
        octx.fillStyle = 'rgba(255,255,255,0.12)';
        octx.fillRect(px + 1, py + 1, TILE_SIZE - 2, 1);
        octx.fillStyle = 'rgba(0,0,0,0.15)';
        octx.fillRect(px, py + TILE_SIZE - 1, TILE_SIZE, 1);
        octx.fillRect(px + TILE_SIZE - 1, py, 1, TILE_SIZE);
      }
    }
  }

  // 2. North Stone Castle Wall (Rows 0..1)
  octx.fillStyle = palette.wallBg;
  octx.fillRect(0, 0, width, TILE_SIZE * 2);
  for (let row = 0; row < 4; row++) {
    const by = row * 8;
    const offset = row % 2 === 0 ? 0 : 8;
    for (let bx = -8; bx < width + 8; bx += 16) {
      octx.fillStyle = row % 2 === 0 ? palette.wallBrick : palette.wallBg;
      octx.fillRect(bx + offset + 1, by + 1, 14, 6);
      octx.fillStyle = 'rgba(255,255,255,0.1)';
      octx.fillRect(bx + offset + 1, by + 1, 14, 1);
    }
  }
  // Golden & Banner Trim along base of North wall
  octx.fillStyle = palette.trimAccent;
  octx.fillRect(0, TILE_SIZE * 2 - 2, width, 2);
  octx.fillStyle = palette.trimGold;
  octx.fillRect(0, TILE_SIZE * 2 - 2, width, 1);

  // Twin Stained-Glass / Castle Arched Windows + Heraldic Banners
  for (const wx of [2, 11]) {
    const px = wx * TILE_SIZE + 4;
    octx.fillStyle = '#0f172a';
    octx.fillRect(px, 4, 24, 22);
    octx.fillStyle = palette.trimGold;
    octx.fillRect(px + 1, 5, 22, 20);
    octx.fillStyle = palette.bannerColor;
    octx.fillRect(px + 3, 7, 18, 16);
    octx.fillStyle = 'rgba(255,255,255,0.3)';
    octx.fillRect(px + 5, 8, 5, 14);
  }
  for (const bx of [5, 9]) {
    const px = bx * TILE_SIZE + 3;
    octx.fillStyle = palette.bannerColor;
    octx.fillRect(px, 4, 10, 22);
    octx.fillStyle = palette.trimGold;
    octx.fillRect(px, 4, 10, 2);
    octx.fillRect(px + 4, 11, 2, 6);
  }

  // 3. Central Chamber Pit / Sand Colosseum Pit (x: 4..10, y: 4..9)
  const pitX = 4 * TILE_SIZE;
  const pitY = 4 * TILE_SIZE;
  const pitW = 7 * TILE_SIZE;
  const pitH = 6 * TILE_SIZE;
  for (let py = 4; py <= 9; py++) {
    for (let px = 4; px <= 10; px++) {
      const tx = px * TILE_SIZE;
      const ty = py * TILE_SIZE;
      const alt = (px + py) % 2 === 0;
      octx.fillStyle = alt ? palette.pitA : palette.pitB;
      octx.fillRect(tx, ty, TILE_SIZE, TILE_SIZE);
      if (palette.isSandPit) {
        // Subtle sand grains inside Jousting Arena pit
        octx.fillStyle = 'rgba(146, 64, 14, 0.22)';
        octx.fillRect(tx + 3, ty + 4, 2, 1);
        octx.fillRect(tx + 10, ty + 11, 2, 1);
      }
    }
  }

  // Pit Curb Border
  octx.strokeStyle = palette.trimAccent;
  octx.lineWidth = 2;
  octx.strokeRect(pitX + 1, pitY + 1, pitW - 2, pitH - 2);
  octx.strokeStyle = palette.trimGold;
  octx.lineWidth = 1;
  octx.strokeRect(pitX + 2.5, pitY + 2.5, pitW - 5, pitH - 5);

  // 4. Royal Red / Heraldic Walk-Up Carpet (column 7)
  if (!palette.isSandPit) {
    const carpX = 7 * TILE_SIZE + 3;
    octx.fillStyle = palette.carpetColor;
    octx.fillRect(carpX, 3 * TILE_SIZE, TILE_SIZE - 6, 3 * TILE_SIZE);
    octx.fillRect(carpX, 7 * TILE_SIZE, TILE_SIZE - 6, 4 * TILE_SIZE);
    octx.fillStyle = palette.trimGold;
    octx.fillRect(carpX, 3 * TILE_SIZE, 1, 3 * TILE_SIZE);
    octx.fillRect(carpX + TILE_SIZE - 7, 3 * TILE_SIZE, 1, 3 * TILE_SIZE);
    octx.fillRect(carpX, 7 * TILE_SIZE, 1, 4 * TILE_SIZE);
    octx.fillRect(carpX + TILE_SIZE - 7, 7 * TILE_SIZE, 1, 4 * TILE_SIZE);
  } else {
    // Sand arena approach carpet from Exit (7, 10)
    const carpX = 7 * TILE_SIZE + 3;
    octx.fillStyle = palette.carpetColor;
    octx.fillRect(carpX, 10 * TILE_SIZE, TILE_SIZE - 6, TILE_SIZE);
    octx.fillStyle = palette.trimGold;
    octx.fillRect(carpX, 10 * TILE_SIZE, 1, TILE_SIZE);
    octx.fillRect(carpX + TILE_SIZE - 7, 10 * TILE_SIZE, 1, TILE_SIZE);
  }

  // 5. Four Corner Stone Pedestals (2x2 stations) + North Tribune Stone Base
  const drawPedestal = (tx: number, ty: number, tw: number, th: number) => {
    const px = tx * TILE_SIZE + 2;
    const py = ty * TILE_SIZE + 2;
    const pw = tw * TILE_SIZE - 4;
    const ph = th * TILE_SIZE - 4;
    octx.fillStyle = '#3f342c';
    octx.fillRect(px, py, pw, ph);
    octx.fillStyle = '#5c4b3d';
    octx.fillRect(px + 1, py + 1, pw - 2, ph - 4);
    octx.strokeStyle = palette.trimGold;
    octx.lineWidth = 1;
    octx.strokeRect(px + 0.5, py + 0.5, pw - 1, ph - 1);
  };
  drawPedestal(1, 3, 2, 2);
  drawPedestal(12, 3, 2, 2);
  drawPedestal(1, 8, 2, 2);
  drawPedestal(12, 8, 2, 2);
  drawPedestal(6, 1, 3, 2);

  // 6. Exit Archway (7, 11)
  const ex = 7 * TILE_SIZE;
  const ey = 11 * TILE_SIZE;
  octx.fillStyle = '#451a03';
  octx.fillRect(ex + 1, ey + 1, TILE_SIZE - 2, TILE_SIZE - 2);
  octx.fillStyle = palette.trimGold;
  octx.fillRect(ex + 2, ey + 2, TILE_SIZE - 4, 2);
  drawPixelText(octx, 'EXIT', ex + 8, ey + 7, '#fef3c7', 1, 'center');

  return off;
}

export function drawKingdomTorch(ctx: CanvasRenderingContext2D, bx: number, by: number, tick: number, glowColor: string): void {
  const px = bx * TILE_SIZE;
  const py = by * TILE_SIZE;
  const flicker = 0.72 + 0.28 * Math.sin(tick * 0.2 + bx * 2.1 + by);

  ctx.fillStyle = glowColor;
  ctx.globalAlpha = 0.22 * flicker;
  ctx.beginPath();
  ctx.arc(px + 8, py + 8, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;

  // Stone sconce pedestal
  ctx.fillStyle = '#44403c';
  ctx.fillRect(px + 5, py + 8, 6, 6);
  ctx.fillStyle = '#d97706';
  ctx.fillRect(px + 4, py + 7, 8, 2);

  // Flame
  ctx.fillStyle = '#f97316';
  ctx.fillRect(px + 6, py + 3 + Math.round(flicker), 4, 5);
  ctx.fillStyle = '#fef08a';
  ctx.fillRect(px + 7, py + 4 + Math.round(flicker), 2, 3);
}

export function drawKingdomCenterpieceCrystal(ctx: CanvasRenderingContext2D, tick: number, color = '#fbbf24'): void {
  const px = 7 * TILE_SIZE;
  const py = 6 * TILE_SIZE;
  const bob = Math.round(Math.sin(tick * 0.08) * 1.5);

  ctx.fillStyle = '#44403c';
  ctx.fillRect(px + 3, py + 8, 10, 7);
  ctx.strokeStyle = '#d97706';
  ctx.lineWidth = 1;
  ctx.strokeRect(px + 3.5, py + 8.5, 9, 6);

  const cx = px + 8;
  const cy = py + 5 + bob;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(cx, cy - 4);
  ctx.lineTo(cx + 3.5, cy);
  ctx.lineTo(cx, cy + 4);
  ctx.lineTo(cx - 3.5, cy);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(cx - 1, cy - 1, 2, 2);
}

export function drawKingdomGuardians(
  ctx: CanvasRenderingContext2D,
  guardians: GuardianPlacement[],
  tick: number,
  pmdAnimator?: PokemonPMDAnimator,
): void {
  for (const g of guardians) {
    const cx = g.tx * TILE_SIZE + 8;
    const fy = g.ty * TILE_SIZE + 14;

    // Ground shadow
    ctx.fillStyle = 'rgba(0,0,0,0.42)';
    ctx.beginPath();
    ctx.ellipse(cx, fy, 7.5, 2.8, 0, 0, Math.PI * 2);
    ctx.fill();

    let drawn = false;
    if (g.kind === 'pmd') {
      drawn = Boolean(
        pmdAnimator?.draw(
          ctx,
          g.id,
          'idle',
          g.facing || 'down',
          cx,
          fy,
          tick,
          g.scaleFactor ?? 0.85,
        ),
      );
    } else {
      const entry = getDigimonById(g.id);
      const sprites = entry ? requestDigimonSprites(g.id) : null;
      if (entry && sprites) {
        const { frame, flipX } = selectDigimonOverworldFrame(
          entry,
          sprites,
          g.facing === 'right' ? 'E' : g.facing === 'left' ? 'W' : 'S',
          tick,
          false,
          false,
        );
        if (frame) {
          const targetH = Math.round((entry.overworldTargetHeight || 34) * (g.scaleFactor ?? 0.78));
          const scale = targetH / frame.height;
          const drawW = Math.max(12, Math.round(frame.width * scale));
          const drawH = Math.max(12, Math.round(frame.height * scale));
          ctx.save();
          ctx.translate(Math.round(cx), Math.round(fy));
          if (flipX) ctx.scale(-1, 1);
          ctx.imageSmoothingEnabled = false;
          ctx.drawImage(frame.canvas, -Math.round(drawW / 2), -drawH, drawW, drawH);
          ctx.restore();
          drawn = true;
        }
      }
    }

    if (!drawn) {
      const bob = Math.round(Math.sin(tick * 0.09 + g.tx));
      ctx.fillStyle = g.fallbackColor;
      ctx.fillRect(cx - 4, fy - 11 + bob, 8, 9);
      ctx.fillStyle = '#fef3c7';
      ctx.fillRect(cx - 2, fy - 9 + bob, 4, 3);
    }
  }
}

export function renderKingdomWaves(ctx: CanvasRenderingContext2D, sceneId: string): void {
  const cx = 7.5 * TILE_SIZE;
  const cy = 6.5 * TILE_SIZE;
  ctx.save();
  for (let i = activeKingdomWaves.length - 1; i >= 0; i--) {
    const wave = activeKingdomWaves[i];
    if (wave.sceneId !== sceneId) continue;

    wave.radius += 2.4;
    wave.alpha = Math.max(0, 1 - wave.radius / wave.maxRadius);

    ctx.strokeStyle = wave.color;
    ctx.globalAlpha = wave.alpha;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, wave.radius, 0, Math.PI * 2);
    ctx.stroke();

    if (wave.alpha > 0.2) {
      drawPixelText(
        ctx,
        wave.text,
        Math.floor(cx),
        Math.floor(cy - 18 - (1 - wave.alpha) * 14),
        wave.color,
        1,
        'center',
      );
    }

    if (wave.radius >= wave.maxRadius) {
      activeKingdomWaves.splice(i, 1);
    }
  }
  ctx.restore();
}
