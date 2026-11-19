import type { PokemonPMDAnimator } from '../pokemonPMDAnimator';
import {
  HARBOUR_INTERIOR_COLS,
  HARBOUR_INTERIOR_ROWS,
  HARBOUR_INTERIOR_SPAWN,
  type HarbourInteriorProp,
} from '../harbourInteriorShared';
import {
  buildHarbourBackgroundCanvas,
  createStandardHarbourCollision,
  drawHarbourGuardians,
  drawHarbourLantern,
  drawHarbourSeaWindowShimmer,
  renderHarbourWaves,
  type HarbourGuardianPlacement,
} from './harbourSceneBase';
import { TILE_SIZE } from '../sprites';

export const MARKET_COLS = HARBOUR_INTERIOR_COLS;
export const MARKET_ROWS = HARBOUR_INTERIOR_ROWS;
export const MARKET_SPAWN = HARBOUR_INTERIOR_SPAWN;
export const MARKET_COLLISION = createStandardHarbourCollision(true);

export const MARKET_PROPS: HarbourInteriorProp[] = [
  {
    id: 'celebi',
    kind: 'npc',
    x: 7,
    y: 2,
    w: 1,
    h: 1,
    target: { type: 'event', name: 'harbour:market:celebi' },
    label: '🌿 Celebi · Guild Envoy',
    style: 'harbour-market',
    labelLift: 1.3,
    scrollTarget: 'mkt-appraisal-trial',
    hint: 'Celebi balances Royal Maritime Commissions! Solve all 3 Guild Appraisal Contracts below to claim the Seal of the Guild.',
  },
  {
    id: 'guild-crest-arch',
    kind: 'prop',
    x: 6,
    y: 1,
    w: 3,
    h: 1,
    target: { type: 'event', name: 'harbour:market:arch' },
    label: '🏛️ Royal Maritime Arch',
    style: 'harbour-market',
    labelLift: 0.95,
    scrollTarget: 'mkt-credentials-section',
    hint: 'Marble Guild Pavilion Arch — welcomes clients, hiring leads, and Royal Envoys directly to Zulfan’s CV Charter & Honors.',
  },
  {
    id: 'cv-charter-stall',
    kind: 'prop',
    x: 1,
    y: 3,
    w: 2,
    h: 2,
    target: { type: 'event', name: 'harbour:market:charter' },
    label: '📜 CV & Credentials Stall',
    style: 'harbour-market',
    labelLift: 0.55,
    scrollTarget: 'mkt-credentials-section',
    hint: 'Royal Document Booth — inspect Zulfan’s S.Kom. degree (3.49 GPA), HCIA-Security V4.0, IDEA FEST 3 Bronze, and direct PDF Resume download!',
  },
  {
    id: 'pigeon-roost',
    kind: 'prop',
    x: 12,
    y: 3,
    w: 2,
    h: 2,
    target: { type: 'event', name: 'harbour:market:courier' },
    label: '🕊️ Courier Dispatch Roost',
    style: 'harbour-market',
    labelLift: 0.55,
    scrollTarget: 'mkt-credentials-section',
    hint: 'Express Pigeon Courier Desk — direct links to GitHub, LinkedIn, Email & Classic Portfolio.',
  },
  {
    id: 'sakuyamon',
    kind: 'npc',
    x: 2,
    y: 6,
    w: 1,
    h: 1,
    target: { type: 'event', name: 'harbour:market:sakuyamon' },
    label: '🦊 Sakuyamon',
    style: 'harbour-market',
    labelLift: 1.05,
    scrollTarget: 'mkt-credentials-section',
    hint: 'Sakuyamon validates verified credentials: Huawei Network Security + 6 Laboratory Instruction Commissions at ITENAS!',
  },
  {
    id: 'herculeskabuterimon',
    kind: 'npc',
    x: 12,
    y: 6,
    w: 1,
    h: 1,
    target: { type: 'event', name: 'harbour:market:hercules' },
    label: '🪲 HerculesKabuterimon',
    style: 'harbour-market',
    labelLift: 1.05,
    scrollTarget: 'mkt-appraisal-trial',
    hint: 'HerculesKabuterimon strikes with golden thunder: "Pair every engineering challenge with the strongest production stack on the Appraisal Scales!"',
  },
  {
    id: 'coral-tidepool',
    kind: 'prop',
    x: 7,
    y: 6,
    w: 1,
    h: 1,
    target: { type: 'event', name: 'harbour:market:tidepool' },
    label: '🐚 Golden Sand & Coral Pit',
    style: 'harbour-market',
    labelLift: 1.0,
    scrollTarget: 'mkt-appraisal-trial',
    hint: 'Central Golden Sand Pavilion & Coral Tide-Pool — walk straight through the sunlit beach courtyard!',
  },
  {
    id: 'pearl-counter',
    kind: 'prop',
    x: 1,
    y: 8,
    w: 2,
    h: 2,
    target: { type: 'event', name: 'harbour:market:pearls' },
    label: '🦪 Pearl & Relic Counter',
    style: 'harbour-market',
    labelLift: 0.5,
    scrollTarget: 'mkt-credentials-section',
    hint: 'Coastal Pearl Counter — showcases clean engineering craftsmanship from ESP32 robotics to Kubernetes clusters.',
  },
  {
    id: 'trade-ledger',
    kind: 'prop',
    x: 12,
    y: 8,
    w: 2,
    h: 2,
    target: { type: 'event', name: 'harbour:market:ledger' },
    label: '⚖️ Guild Appraisal Desk',
    style: 'harbour-market',
    labelLift: 0.5,
    scrollTarget: 'mkt-seals-ledger',
    hint: 'Balanced Brass Guild Ledger — records completed appraisals toward the Grand Admiral of Avalon title!',
  },
  {
    id: 'exit',
    kind: 'exit',
    x: 7,
    y: 11,
    w: 1,
    h: 1,
    target: { type: 'place', id: 'harbour' },
    label: 'Exit',
    style: 'harbour-market',
    hideLabel: true,
  },
];

const GUARDIANS: HarbourGuardianPlacement[] = [
  { kind: 'pmd', id: 'celebi', tx: 7, ty: 2, facing: 'down', scaleFactor: 0.88, fallbackColor: '#34d399' },
  { kind: 'digimon', id: 'sakuyamon', tx: 2, ty: 6, facing: 'right', scaleFactor: 0.8, fallbackColor: '#fbbf24' },
  { kind: 'digimon', id: 'herculeskabuterimon', tx: 12, ty: 6, facing: 'left', scaleFactor: 0.8, fallbackColor: '#f59e0b' },
];

let bgCache: HTMLCanvasElement | null = null;

function drawMarketDetails(ctx: CanvasRenderingContext2D): void {
  // North Marble Guild Archway Emblem (6..8, 1)
  const ax = 6 * TILE_SIZE + 8;
  ctx.fillStyle = '#065f46';
  ctx.fillRect(ax, 6, 32, 14);
  ctx.fillStyle = '#fbbf24';
  ctx.fillRect(ax + 10, 9, 12, 8);

  // NW Blue-White Striped CV & Credentials Stall (1..2, 3..4)
  const sx = 1 * TILE_SIZE + 4;
  const sy = 3 * TILE_SIZE + 5;
  ctx.fillStyle = '#0284c7';
  ctx.fillRect(sx, sy, 24, 8);
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(sx + 6, sy, 6, 8);
  ctx.fillRect(sx + 18, sy, 6, 8);
  ctx.fillStyle = '#fef3c7';
  ctx.fillRect(sx + 4, sy + 10, 16, 8);

  // NE Courier Pigeon Roost (12..13, 3..4)
  const rx = 12 * TILE_SIZE + 6;
  const ry = 3 * TILE_SIZE + 5;
  ctx.fillStyle = '#78350f';
  ctx.fillRect(rx, ry + 4, 20, 16);
  ctx.fillStyle = '#e0f2fe';
  ctx.fillRect(rx + 4, ry + 7, 5, 5);
  ctx.fillRect(rx + 11, ry + 7, 5, 5);

  // SW Emerald-Striped Pearl Stall (1..2, 8..9)
  const px = 1 * TILE_SIZE + 4;
  const py = 8 * TILE_SIZE + 5;
  ctx.fillStyle = '#059669';
  ctx.fillRect(px, py, 24, 8);
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(px + 6, py, 6, 8);
  ctx.fillRect(px + 18, py, 6, 8);
  ctx.fillStyle = '#f1f5f9';
  ctx.fillRect(px + 5, py + 11, 5, 5);
  ctx.fillRect(px + 14, py + 11, 5, 5);

  // SE Guild Appraisal Desk (12..13, 8..9)
  const tx = 12 * TILE_SIZE + 6;
  const ty = 8 * TILE_SIZE + 7;
  ctx.fillStyle = '#92400e';
  ctx.fillRect(tx, ty, 20, 14);
  ctx.fillStyle = '#fbbf24';
  ctx.fillRect(tx + 4, ty + 4, 12, 2);
  ctx.fillRect(tx + 9, ty + 2, 2, 8);
}

export function renderMarketScene(
  ctx: CanvasRenderingContext2D,
  tick: number,
  pmdAnimator?: PokemonPMDAnimator,
): void {
  if (!bgCache) {
    bgCache = buildHarbourBackgroundCanvas({
      floorA: '#e5dec9',
      floorB: '#d6cdb4',
      pitA: '#ebd09a',
      pitB: '#e0be7c',
      wallBg: '#1e3a34',
      wallBrick: '#2c5249',
      trimBrass: '#eab308',
      trimAccent: '#059669',
      bannerColor: '#047857',
      carpetColor: '#0284c7',
      isSandTidePool: true,
      lanternColor: '#34d399',
      windowSkyTop: '#7dd3fc',
      windowSeaBottom: '#0d9488',
    });
  }

  ctx.drawImage(bgCache, 0, 0);
  drawHarbourSeaWindowShimmer(ctx, tick);
  drawMarketDetails(ctx);

  // Shimmering coastal tide-pool oasis in the center of the golden sand courtyard
  const ripple = Math.sin(tick * 0.08) * 1.4;
  ctx.save();
  ctx.fillStyle = '#0ea5e9';
  ctx.globalAlpha = 0.68;
  ctx.beginPath();
  ctx.ellipse(7.5 * TILE_SIZE, 6.5 * TILE_SIZE, 16 + ripple, 9 + ripple * 0.4, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#fef3c7';
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.fillStyle = '#e0f2fe';
  ctx.globalAlpha = 0.7;
  ctx.fillRect(7.5 * TILE_SIZE - 5, 6.5 * TILE_SIZE - 2, 6, 1);
  ctx.fillRect(7.5 * TILE_SIZE + 2, 6.5 * TILE_SIZE + 2, 4, 1);
  ctx.restore();

  drawHarbourLantern(ctx, 4, 3, tick, '#34d399');
  drawHarbourLantern(ctx, 10, 3, tick, '#34d399');
  drawHarbourLantern(ctx, 4, 9, tick, '#fbbf24');
  drawHarbourLantern(ctx, 10, 9, tick, '#fbbf24');
  drawHarbourGuardians(ctx, GUARDIANS, tick, pmdAnimator);
  renderHarbourWaves(ctx, 'harbour-market');
}
