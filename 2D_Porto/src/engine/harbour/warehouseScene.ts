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
  drawHarbourCompassCenterpiece,
  drawHarbourGuardians,
  drawHarbourLantern,
  drawHarbourSeaWindowShimmer,
  renderHarbourWaves,
  type HarbourGuardianPlacement,
} from './harbourSceneBase';
import { TILE_SIZE } from '../sprites';

export const WAREHOUSE_COLS = HARBOUR_INTERIOR_COLS;
export const WAREHOUSE_ROWS = HARBOUR_INTERIOR_ROWS;
export const WAREHOUSE_SPAWN = HARBOUR_INTERIOR_SPAWN;
export const WAREHOUSE_COLLISION = createStandardHarbourCollision(false);

export const WAREHOUSE_PROPS: HarbourInteriorProp[] = [
  {
    id: 'gyarados',
    kind: 'npc',
    x: 7,
    y: 2,
    w: 1,
    h: 1,
    target: { type: 'event', name: 'harbour:warehouse:gyarados' },
    label: '🐉 Gyarados · Quartermaster',
    style: 'harbour-cargo',
    labelLift: 1.3,
    scrollTarget: 'wh-crane-trial',
    hint: 'Quartermaster Gyarados oversees all shipborne datasets and ETL pipelines! Dispatch the 4 Imperial Crates in priority order to earn the Seal of the Quartermaster.',
  },
  {
    id: 'crane-beam',
    kind: 'prop',
    x: 6,
    y: 1,
    w: 3,
    h: 1,
    target: { type: 'event', name: 'harbour:warehouse:crane' },
    label: '🏗️ Iron Hoist Pulley',
    style: 'harbour-cargo',
    labelLift: 0.95,
    scrollTarget: 'wh-crane-trial',
    hint: 'Overhead Wrought-Iron Pulley — hoists heavy PostgreSQL/PostGIS and YOLOv11 training vaults directly onto royal transport barges.',
  },
  {
    id: 'manifest-ledger',
    kind: 'prop',
    x: 1,
    y: 3,
    w: 2,
    h: 2,
    target: { type: 'event', name: 'harbour:warehouse:ledger' },
    label: '📜 Data Manifest Ledger',
    style: 'harbour-cargo',
    labelLift: 0.55,
    scrollTarget: 'wh-datasets-section',
    hint: 'Royal Customs Data Ledger — inspect Zulfan’s ETL workflows converting 12 GB PASCAL VOC annotations (~8,400 images) and Apache Kafka outbox queues.',
  },
  {
    id: 'royal-crates',
    kind: 'prop',
    x: 12,
    y: 3,
    w: 2,
    h: 2,
    target: { type: 'event', name: 'harbour:warehouse:crates' },
    label: '📦 Imperial Cargo Crates',
    style: 'harbour-cargo',
    labelLift: 0.55,
    scrollTarget: 'wh-datasets-section',
    hint: 'Wax-sealed Oak Freight Crates — packed with YOLOv11s TensorRT engines, PostGIS GIST indices, and OMR bulk PDF extractors.',
  },
  {
    id: 'vikemon',
    kind: 'npc',
    x: 2,
    y: 6,
    w: 1,
    h: 1,
    target: { type: 'event', name: 'harbour:warehouse:vikemon' },
    label: '🧊 Vikemon',
    style: 'harbour-cargo',
    labelLift: 1.05,
    scrollTarget: 'wh-datasets-section',
    hint: 'Vikemon guards the Cold-Storage Archive: "Atomic PostgreSQL row locks + Redis 7 Lua mutexes prevent race conditions under peak merchant surges!"',
  },
  {
    id: 'regigigas',
    kind: 'npc',
    x: 12,
    y: 6,
    w: 1,
    h: 1,
    target: { type: 'event', name: 'harbour:warehouse:regigigas' },
    label: '🗿 Regigigas',
    style: 'harbour-cargo',
    labelLift: 1.05,
    scrollTarget: 'wh-crane-trial',
    hint: 'Regigigas moves multi-gigabyte datasets with continental strength! Verify crate tonnage in order on the Customs Scales below.',
  },
  {
    id: 'customs-scales',
    kind: 'prop',
    x: 7,
    y: 6,
    w: 1,
    h: 1,
    target: { type: 'event', name: 'harbour:warehouse:scales' },
    label: '⚖️ Brass Customs Scales',
    style: 'harbour-cargo',
    labelLift: 1.0,
    scrollTarget: 'wh-crane-trial',
    hint: 'Central Brass Customs Scales — weigh & clear all 4 Imperial Cargo Manifests in Priority Sequence 1 → 4.',
  },
  {
    id: 'spice-barrels',
    kind: 'prop',
    x: 1,
    y: 8,
    w: 2,
    h: 2,
    target: { type: 'event', name: 'harbour:warehouse:barrels' },
    label: '🛢️ Provisions Casks',
    style: 'harbour-cargo',
    labelLift: 0.5,
    scrollTarget: 'wh-datasets-section',
    hint: 'Bound Oak Casks — stocked for fleet dispatches bridging backend microservices and real-time OpenCV workers.',
  },
  {
    id: 'sluice-gate',
    kind: 'prop',
    x: 12,
    y: 8,
    w: 2,
    h: 2,
    target: { type: 'event', name: 'harbour:warehouse:sluice' },
    label: '🚪 Dockside Sluice Gate',
    style: 'harbour-cargo',
    labelLift: 0.5,
    scrollTarget: 'wh-seals-ledger',
    hint: 'Reinforced Harbor Sluice Door — connects warehouse logistics straight to the Sovereign Brigantine quay.',
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
    style: 'harbour-cargo',
    hideLabel: true,
  },
];

const GUARDIANS: HarbourGuardianPlacement[] = [
  { kind: 'pmd', id: 'gyarados', tx: 7, ty: 2, facing: 'down', scaleFactor: 0.88, fallbackColor: '#2563eb' },
  { kind: 'digimon', id: 'vikemon', tx: 2, ty: 6, facing: 'right', scaleFactor: 0.8, fallbackColor: '#cbd5e1' },
  { kind: 'pmd', id: 'regigigas', tx: 12, ty: 6, facing: 'left', scaleFactor: 0.85, fallbackColor: '#eab308' },
];

let bgCache: HTMLCanvasElement | null = null;

function drawWarehouseDetails(ctx: CanvasRenderingContext2D, tick: number): void {
  const hoistOffset = Math.round(Math.sin(tick * 0.06) * 1.5);

  // North Iron Crane Pulley (6..8, 1)
  const cx = 6 * TILE_SIZE + 8;
  ctx.fillStyle = '#334155';
  ctx.fillRect(cx + 4, 4, 24, 4);
  ctx.fillStyle = '#94a3b8';
  ctx.fillRect(cx + 15, 8, 2, 7 + hoistOffset);
  ctx.fillStyle = '#b45309';
  ctx.fillRect(cx + 10, 14 + hoistOffset, 12, 8);
  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 1;
  ctx.strokeRect(cx + 10.5, 14.5 + hoistOffset, 11, 7);

  // NW Manifest Ledger Desk (1..2, 3..4)
  const lx = 1 * TILE_SIZE + 6;
  const ly = 3 * TILE_SIZE + 7;
  ctx.fillStyle = '#78350f';
  ctx.fillRect(lx, ly, 20, 16);
  ctx.fillStyle = '#fef3c7';
  ctx.fillRect(lx + 4, ly + 3, 12, 10);
  ctx.fillStyle = '#b91c1c';
  ctx.fillRect(lx + 13, ly + 9, 2, 2);

  // NE Wax-Sealed Supply Crates (12..13, 3..4)
  const kx = 12 * TILE_SIZE + 5;
  const ky = 3 * TILE_SIZE + 5;
  ctx.fillStyle = '#92400e';
  ctx.fillRect(kx, ky + 6, 11, 14);
  ctx.fillRect(kx + 12, ky + 2, 10, 18);
  ctx.strokeStyle = '#d97706';
  ctx.strokeRect(kx + 0.5, ky + 6.5, 10, 13);
  ctx.strokeRect(kx + 12.5, ky + 2.5, 9, 17);

  // SW Provisions Barrels (1..2, 8..9)
  const bx = 1 * TILE_SIZE + 6;
  const by = 8 * TILE_SIZE + 7;
  ctx.fillStyle = '#7c2d12';
  ctx.fillRect(bx, by, 9, 16);
  ctx.fillRect(bx + 11, by + 2, 9, 14);
  ctx.fillStyle = '#94a3b8';
  ctx.fillRect(bx, by + 4, 9, 2);
  ctx.fillRect(bx + 11, by + 6, 9, 2);

  // SE Sluice Gate Iron Bars (12..13, 8..9)
  const sx = 12 * TILE_SIZE + 6;
  const sy = 8 * TILE_SIZE + 5;
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(sx, sy, 20, 20);
  ctx.fillStyle = '#64748b';
  for (let i = 3; i < 18; i += 5) {
    ctx.fillRect(sx + i, sy + 2, 2, 16);
  }
}

export function renderWarehouseScene(
  ctx: CanvasRenderingContext2D,
  tick: number,
  pmdAnimator?: PokemonPMDAnimator,
): void {
  if (!bgCache) {
    bgCache = buildHarbourBackgroundCanvas({
      floorA: '#c6bda9',
      floorB: '#b7ad98',
      pitA: '#5c4632',
      pitB: '#4f3b2a',
      wallBg: '#2c2620',
      wallBrick: '#443b31',
      trimBrass: '#d97706',
      trimAccent: '#64748b',
      bannerColor: '#334155',
      carpetColor: '#78350f',
      lanternColor: '#fb923c',
      windowSkyTop: '#93c5fd',
      windowSeaBottom: '#1d4ed8',
    });
  }

  ctx.drawImage(bgCache, 0, 0);
  drawHarbourSeaWindowShimmer(ctx, tick);
  drawWarehouseDetails(ctx, tick);
  drawHarbourLantern(ctx, 4, 3, tick, '#fb923c');
  drawHarbourLantern(ctx, 10, 3, tick, '#fb923c');
  drawHarbourLantern(ctx, 4, 9, tick, '#fbbf24');
  drawHarbourLantern(ctx, 10, 9, tick, '#fbbf24');
  drawHarbourCompassCenterpiece(ctx, tick, '#cbd5e1');
  drawHarbourGuardians(ctx, GUARDIANS, tick, pmdAnimator);
  renderHarbourWaves(ctx, 'harbour-warehouse');
}
