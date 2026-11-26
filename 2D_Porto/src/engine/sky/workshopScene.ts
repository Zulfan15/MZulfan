import type { PokemonPMDAnimator } from '../pokemonPMDAnimator';
import {
  SKY_INTERIOR_COLS,
  SKY_INTERIOR_ROWS,
  SKY_INTERIOR_SPAWN,
  type SkyInteriorProp,
} from '../skyInteriorShared';
import {
  buildSkyBackgroundCanvas,
  createStandardSkyCollision,
  drawSkyCloudWindowDrift,
  drawSkyCrystalCenterpiece,
  drawSkyGuardians,
  drawSkyLantern,
  renderSkyWaves,
  type SkyGuardianPlacement,
} from './skySceneBase';
import { TILE_SIZE } from '../sprites';

export const WORKSHOP_COLS = SKY_INTERIOR_COLS;
export const WORKSHOP_ROWS = SKY_INTERIOR_ROWS;
export const WORKSHOP_SPAWN = SKY_INTERIOR_SPAWN;
export const WORKSHOP_COLLISION = createStandardSkyCollision(false);

export const WORKSHOP_PROPS: SkyInteriorProp[] = [
  {
    id: 'reshiram',
    kind: 'npc',
    x: 7,
    y: 2,
    w: 1,
    h: 1,
    target: { type: 'event', name: 'sky:workshop:reshiram' },
    label: '🔥 Reshiram · Thrust Core',
    style: 'sky-workshop',
    labelLift: 1.3,
    scrollTarget: 'workshop-trial',
    hint: 'Reshiram powers the sky-pier airship turbines! Wire all 4 ESP32 & Robotics Telemetry Stages to claim the Plume of Thrust.',
  },
  {
    id: 'airship-rig',
    kind: 'prop',
    x: 6,
    y: 1,
    w: 3,
    h: 1,
    target: { type: 'event', name: 'sky:workshop:rig' },
    label: '⚙️ Airship Thruster Rig',
    style: 'sky-workshop',
    labelLift: 0.95,
    scrollTarget: 'workshop-robotics',
    hint: 'Overhead brass hoist & propulsion manifold linking the Lower Sky-Pier airship berths to Zulfan’s Robotics Hangar.',
  },
  {
    id: 'esp32-bench',
    kind: 'prop',
    x: 1,
    y: 3,
    w: 2,
    h: 2,
    target: { type: 'event', name: 'sky:workshop:esp32' },
    label: '🔌 ESP32 & Motor Workbench',
    style: 'sky-workshop',
    labelLift: 0.55,
    scrollTarget: 'workshop-robotics',
    hint: 'RC Tank (IoT) bench — ESP32 firmware driving PWM motor controllers and reading ultrasonic/IMU onboard sensors.',
  },
  {
    id: 'robotics-rack',
    kind: 'prop',
    x: 12,
    y: 3,
    w: 2,
    h: 2,
    target: { type: 'event', name: 'sky:workshop:rack' },
    label: '🦾 ITENAS Robotics Archive',
    style: 'sky-workshop',
    labelLift: 0.55,
    scrollTarget: 'workshop-robotics',
    hint: 'Robotics Laboratory Assistant Coordinator (Feb–Jun 2026) & IoT Lab Assistant — kinematics, sensors, and student team mentoring.',
  },
  {
    id: 'plusiamon',
    kind: 'npc',
    x: 2,
    y: 6,
    w: 1,
    h: 1,
    target: { type: 'event', name: 'sky:workshop:plusiamon' },
    label: '🤖 Plusiamon',
    style: 'sky-workshop',
    labelLift: 1.05,
    scrollTarget: 'workshop-robotics',
    hint: 'Plasma-thruster Cyborg Chief — inspects C/Arduino microcontroller firmware, motor driver wiring, and telemetry packet timing.',
  },
  {
    id: 'crossmon',
    kind: 'npc',
    x: 12,
    y: 6,
    w: 1,
    h: 1,
    target: { type: 'event', name: 'sky:workshop:crossmon' },
    label: '🦅 Crossmon',
    style: 'sky-workshop',
    labelLift: 1.05,
    scrollTarget: 'workshop-trial',
    hint: 'Golden Sky-Frame Wingman — validates airship dock stability and dual Flutter + Web dashboard link latency.',
  },
  {
    id: 'circuit-core',
    kind: 'prop',
    x: 7,
    y: 6,
    w: 1,
    h: 1,
    target: { type: 'event', name: 'sky:workshop:core' },
    label: '🔋 Telemetry Relay Core',
    style: 'sky-workshop',
    labelLift: 1.0,
    scrollTarget: 'workshop-trial',
    hint: 'Central Telemetry Relay — engage all 4 hardware-to-cloud stages below to unlock the Plume of Thrust!',
  },
  {
    id: 'flutter-console',
    kind: 'prop',
    x: 1,
    y: 8,
    w: 2,
    h: 2,
    target: { type: 'event', name: 'sky:workshop:flutter' },
    label: '📱 Flutter & Web Cockpit',
    style: 'sky-workshop',
    labelLift: 0.5,
    scrollTarget: 'workshop-robotics',
    hint: 'Dual interface pairing a responsive Flutter mobile controller with a browser telemetry command dashboard.',
  },
  {
    id: 'sky-dock-log',
    kind: 'prop',
    x: 12,
    y: 8,
    w: 2,
    h: 2,
    target: { type: 'event', name: 'sky:workshop:log' },
    label: '🪵 Sky-Pier Mooring Log',
    style: 'sky-workshop',
    labelLift: 0.5,
    scrollTarget: 'workshop-plumes-ledger',
    hint: 'Cargo manifest & flight logs for the twin wooden sky-piers jutting out from the West Floating Island.',
  },
  {
    id: 'exit',
    kind: 'exit',
    x: 7,
    y: 11,
    w: 1,
    h: 1,
    target: { type: 'place', id: 'sky-castle' },
    label: 'Exit',
    style: 'sky-workshop',
    hideLabel: true,
  },
];

const GUARDIANS: SkyGuardianPlacement[] = [
  { kind: 'pmd', id: 'reshiram', tx: 7, ty: 2, facing: 'down', scaleFactor: 0.88, fallbackColor: '#f8fafc' },
  { kind: 'digimon', id: 'plusiamon', tx: 2, ty: 6, facing: 'right', scaleFactor: 0.82, fallbackColor: '#22d3ee' },
  { kind: 'digimon', id: 'crossmon', tx: 12, ty: 6, facing: 'left', scaleFactor: 0.8, fallbackColor: '#facc15' },
];

let bgCache: HTMLCanvasElement | null = null;

function drawStationDetails(ctx: CanvasRenderingContext2D, tick: number): void {
  const pulse = Math.sin(tick * 0.14) > 0;

  // North Thruster Ignition Rig (6..8, 1)
  const rx = 6 * TILE_SIZE + 8;
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(rx, 8, 32, 13);
  ctx.fillStyle = '#f97316';
  ctx.fillRect(rx + 4, 10, 24, 9);
  ctx.fillStyle = pulse ? '#22d3ee' : '#fef08a';
  ctx.fillRect(rx + 10, 12, 12, 5);

  // NW ESP32 Solder Bench (1..2, 3..4)
  const ex = 1 * TILE_SIZE + 5;
  const ey = 3 * TILE_SIZE + 5;
  ctx.fillStyle = '#064e3b';
  ctx.fillRect(ex, ey, 22, 20);
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(ex + 5, ey + 4, 12, 12);
  ctx.fillStyle = pulse ? '#22d3ee' : '#f97316';
  ctx.fillRect(ex + 8, ey + 7, 6, 4);

  // NE Robotics Archive (12..13, 3..4)
  const kx = 12 * TILE_SIZE + 5;
  const ky = 3 * TILE_SIZE + 5;
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(kx, ky, 22, 20);
  ctx.fillStyle = '#f97316';
  ctx.fillRect(kx + 4, ky + 5, 14, 3);
  ctx.fillStyle = '#38bdf8';
  ctx.fillRect(kx + 4, ky + 11, 14, 3);

  // SW Flutter Cockpit (1..2, 8..9)
  const fx = 1 * TILE_SIZE + 6;
  const fy = 8 * TILE_SIZE + 5;
  ctx.fillStyle = '#0c4a6e';
  ctx.fillRect(fx, fy, 20, 20);
  ctx.fillStyle = '#38bdf8';
  ctx.fillRect(fx + 3, fy + 4, 14, 10);
  ctx.fillStyle = '#fef08a';
  ctx.fillRect(fx + 5, fy + 16, 10, 2);

  // SE Sky-Pier Log (12..13, 8..9)
  const lx = 12 * TILE_SIZE + 5;
  const ly = 8 * TILE_SIZE + 6;
  ctx.fillStyle = '#78350f';
  ctx.fillRect(lx, ly, 22, 18);
  ctx.fillStyle = '#fef3c7';
  ctx.fillRect(lx + 4, ly + 4, 14, 10);
}

export function renderWorkshopScene(
  ctx: CanvasRenderingContext2D,
  tick: number,
  pmdAnimator?: PokemonPMDAnimator,
): void {
  if (!bgCache) {
    bgCache = buildSkyBackgroundCanvas({
      floorA: '#334155',
      floorB: '#293548',
      pitA: '#0f172a',
      pitB: '#1e293b',
      wallBg: '#1e293b',
      wallBrick: '#475569',
      trimGold: '#f97316',
      trimAccent: '#22d3ee',
      bannerColor: '#0e7490',
      carpetColor: '#0e7490',
      pedestalOuter: '#0f172a',
      pedestalInner: '#1e293b',
      isWoodDeck: true,
      lanternColor: '#22d3ee',
      windowSkyTop: '#38bdf8',
      windowCloudBottom: '#f1f5f9',
    });
  }

  ctx.drawImage(bgCache, 0, 0);
  drawSkyCloudWindowDrift(ctx, tick);
  drawStationDetails(ctx, tick);

  for (const [lx, ly] of [
    [4, 3],
    [10, 3],
    [4, 9],
    [10, 9],
  ]) {
    drawSkyLantern(ctx, lx, ly, tick, '#22d3ee');
  }

  drawSkyCrystalCenterpiece(ctx, tick, '#22d3ee');
  drawSkyGuardians(ctx, GUARDIANS, tick, pmdAnimator);
  renderSkyWaves(ctx, 'sky-workshop');
}
