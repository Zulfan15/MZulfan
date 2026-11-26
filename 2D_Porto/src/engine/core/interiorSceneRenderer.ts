import type { TownEngine } from '../TownEngine';
import { TILE_SIZE, drawCharacter } from '../sprites';
import {
  HOME_COLS,
  HOME_ROWS,
  HOME2F_COLS,
  HOME2F_ROWS,
  renderHomeFloor,
  renderHomeWalls,
  renderHomeProps,
  renderHome2FFloor,
  renderHome2FWalls,
  renderHome2FProps,
} from '../homeScene';
import { DEV_COLS, DEV_ROWS, createDevBackgroundCanvas, renderDevAnimations } from '../devScene';
import { LAB_COLS, LAB_ROWS, createLabBackgroundCanvas, renderLabAnimations } from '../labScene';
import { ARCADE_COLS, ARCADE_ROWS, createArcadeBackgroundCanvas, renderArcadeAnimations } from '../arcadeScene';
import { RECEPTION_COLS, RECEPTION_ROWS, createReceptionBackgroundCanvas, renderReceptionAnimations } from '../receptionScene';
import { MART_COLS, MART_ROWS, createMartBackgroundCanvas, renderMartAnimations } from '../martScene';
import { TOWER_COLS, TOWER_ROWS, createTowerBackgroundCanvas, renderTowerAnimations } from '../towerScene';
import { CAFE_COLS, CAFE_ROWS, createCafeBackgroundCanvas, renderCafeAnimations } from '../cafeScene';
import { ARENA_COLS, ARENA_ROWS, createArenaBackgroundCanvas, renderArenaAnimations } from '../arenaScene';
import { GARDEN_COLS, GARDEN_ROWS, createGardenBackgroundCanvas, renderGardenAnimations } from '../gardenScene';
import { NEIGHBOUR_COLS, NEIGHBOUR_ROWS, createNeighbourBackgroundCanvas, renderNeighbourAnimations } from '../neighbourScene';
import { renderCathedralScene } from '../cathedralScene';
import { renderForgeScene } from '../forgeScene';
import { renderManorScene } from '../manorScene';
import { renderVaultScene } from '../vaultScene';
import { getKingdomInteriorConfig, isKingdomInteriorScene } from '../kingdom/kingdomInteriorsRegistry';
import { getHarbourInteriorConfig, isHarbourInteriorScene } from '../harbour/harbourInteriorsRegistry';
import { getSkyInteriorConfig, isSkyInteriorScene } from '../sky/skyInteriorsRegistry';

const ROOM_DIMENSIONS: Record<string, { cols: number; rows: number }> = {
  home: { cols: HOME_COLS, rows: HOME_ROWS },
  dev: { cols: DEV_COLS, rows: DEV_ROWS },
  lab: { cols: LAB_COLS, rows: LAB_ROWS },
  arcade: { cols: ARCADE_COLS, rows: ARCADE_ROWS },
  reception: { cols: RECEPTION_COLS, rows: RECEPTION_ROWS },
  mart: { cols: MART_COLS, rows: MART_ROWS },
  tower: { cols: TOWER_COLS, rows: TOWER_ROWS },
  cafe: { cols: CAFE_COLS, rows: CAFE_ROWS },
  arena: { cols: ARENA_COLS, rows: ARENA_ROWS },
  garden: { cols: GARDEN_COLS, rows: GARDEN_ROWS },
  neighbour: { cols: NEIGHBOUR_COLS, rows: NEIGHBOUR_ROWS },
};

function isCastleStyleInterior(scene: string): boolean {
  return (
    scene === 'dark-cathedral' ||
    scene === 'dark-forge' ||
    scene === 'dark-manor' ||
    scene === 'dark-vault' ||
    isKingdomInteriorScene(scene) ||
    isHarbourInteriorScene(scene) ||
    isSkyInteriorScene(scene)
  );
}

/**
 * Computes defaultZoom and centered camera position for any interior room during resize.
 * Returns true if `engine.currentScene` is an interior scene.
 */
export function applyInteriorResizeZoom(engine: TownEngine, dpr: number): boolean {
  const scene = engine.currentScene;
  const std = ROOM_DIMENSIONS[scene];
  if (std) {
    const targetW = std.cols * TILE_SIZE * 1.05;
    const targetH = std.rows * TILE_SIZE * 1.05;
    const zoomW = engine.canvas.width / targetW;
    const zoomH = engine.canvas.height / targetH;
    engine.defaultZoom = Math.max(Math.min(zoomW, zoomH), 1.8 * dpr);
    engine.cameraX = (std.cols * TILE_SIZE) / 2;
    engine.cameraY = (std.rows * TILE_SIZE) / 2;
    return true;
  }

  if (isCastleStyleInterior(scene)) {
    const targetW = 17.5 * TILE_SIZE;
    const targetH = 14 * TILE_SIZE;
    const zoomW = engine.canvas.width / targetW;
    const zoomH = engine.canvas.height / targetH;
    engine.defaultZoom = Math.max(Math.min(zoomW, zoomH), 1.6 * dpr);
    engine.cameraX = (15 * TILE_SIZE) / 2;
    engine.cameraY = (12 * TILE_SIZE) / 2;
    return true;
  }

  return false;
}

function renderFramedInterior(
  engine: TownEngine,
  ctx: CanvasRenderingContext2D,
  cols: number,
  rows: number,
  backdropFill: string,
  drawRoom: () => void,
  compactPlayerScale = false
): void {
  engine.cameraX = (cols * TILE_SIZE) / 2;
  engine.cameraY = (rows * TILE_SIZE) / 2;

  ctx.save();
  ctx.clearRect(0, 0, engine.canvas.width, engine.canvas.height);
  ctx.fillStyle = backdropFill;
  ctx.fillRect(0, 0, engine.canvas.width, engine.canvas.height);

  ctx.translate(engine.canvas.width / 2, engine.canvas.height / 2);
  ctx.scale(engine.zoom, engine.zoom);
  ctx.translate(-engine.cameraX, -engine.cameraY);

  if (engine.cameraShakeTime > 0) {
    const shakeX = (Math.random() - 0.5) * engine.cameraShakeIntensity;
    const shakeY = (Math.random() - 0.5) * engine.cameraShakeIntensity;
    ctx.translate(shakeX, shakeY);
  }

  drawRoom();

  engine.renderPathAndMarker(ctx);

  const drawX =
    (engine.playerPos.x + (engine.playerTarget.x - engine.playerPos.x) * engine.moveProgress) * TILE_SIZE;
  const drawY =
    (engine.playerPos.y + (engine.playerTarget.y - engine.playerPos.y) * engine.moveProgress) * TILE_SIZE;
  const stepFrame = engine.isMoving ? Math.floor(engine.moveProgress * 4) : 0;

  if (compactPlayerScale) {
    ctx.save();
    ctx.translate(drawX + 8, drawY + 15);
    ctx.scale(0.68, 0.68);
    drawCharacter(ctx, engine.playerPalette, engine.playerDir, stepFrame, -8, -15, 1);
    ctx.restore();
  } else {
    drawCharacter(ctx, engine.playerPalette, engine.playerDir, stepFrame, drawX, drawY, 1);
  }

  ctx.restore();
  engine.updateDomLabels();
}

/**
 * Renders any interior room scene cleanly without duplicating camera/player framing boilerplate.
 * Returns true if the current scene was handled as an interior room.
 */
export function renderInteriorScene(engine: TownEngine, ctx: CanvasRenderingContext2D): boolean {
  const scene = engine.currentScene;

  if (scene === 'home') {
    const is2F = engine.homeFloor === '2F';
    const cols = is2F ? HOME2F_COLS : HOME_COLS;
    const rows = is2F ? HOME2F_ROWS : HOME_ROWS;
    renderFramedInterior(engine, ctx, cols, rows, '#1d1414', () => {
      if (is2F) {
        renderHome2FFloor(ctx);
        renderHome2FWalls(ctx, engine.tick);
        renderHome2FProps(ctx, engine.tick);
      } else {
        renderHomeFloor(ctx);
        renderHomeWalls(ctx, engine.tick);
        renderHomeProps(ctx, engine.tick);
      }
    });
    return true;
  }

  if (scene === 'dev') {
    renderFramedInterior(engine, ctx, DEV_COLS, DEV_ROWS, '#070a14', () => {
      if (!engine.devBackgroundCanvas) {
        engine.devBackgroundCanvas = createDevBackgroundCanvas();
      }
      ctx.drawImage(engine.devBackgroundCanvas, 0, 0);
      renderDevAnimations(ctx, performance.now());
    });
    return true;
  }

  if (scene === 'tower') {
    renderFramedInterior(engine, ctx, TOWER_COLS, TOWER_ROWS, '#090d16', () => {
      if (!engine.towerBackgroundCanvas) {
        engine.towerBackgroundCanvas = createTowerBackgroundCanvas();
      }
      ctx.drawImage(engine.towerBackgroundCanvas, 0, 0);
      renderTowerAnimations(ctx, engine.tick, engine.activeTowerFloor, engine.pmdAnimator);
    });
    return true;
  }

  if (scene === 'mart') {
    renderFramedInterior(engine, ctx, MART_COLS, MART_ROWS, '#0a1128', () => {
      if (!engine.martBackgroundCanvas) {
        engine.martBackgroundCanvas = createMartBackgroundCanvas();
      }
      ctx.drawImage(engine.martBackgroundCanvas, 0, 0);
      renderMartAnimations(ctx, engine.tick);
    });
    return true;
  }

  if (scene === 'cafe') {
    renderFramedInterior(engine, ctx, CAFE_COLS, CAFE_ROWS, '#140c08', () => {
      if (!engine.cafeBackgroundCanvas) {
        engine.cafeBackgroundCanvas = createCafeBackgroundCanvas();
      }
      ctx.drawImage(engine.cafeBackgroundCanvas, 0, 0);
      renderCafeAnimations(ctx, engine.tick);
    });
    return true;
  }

  if (scene === 'arena') {
    renderFramedInterior(engine, ctx, ARENA_COLS, ARENA_ROWS, '#271609', () => {
      if (!engine.arenaBackgroundCanvas) {
        engine.arenaBackgroundCanvas = createArenaBackgroundCanvas();
      }
      ctx.drawImage(engine.arenaBackgroundCanvas, 0, 0);
      renderArenaAnimations(ctx, engine.tick, engine.pmdAnimator);
    });
    return true;
  }

  if (scene === 'garden') {
    renderFramedInterior(engine, ctx, GARDEN_COLS, GARDEN_ROWS, '#0e2414', () => {
      if (!engine.gardenBackgroundCanvas) {
        engine.gardenBackgroundCanvas = createGardenBackgroundCanvas();
      }
      ctx.drawImage(engine.gardenBackgroundCanvas, 0, 0);
      renderGardenAnimations(ctx, engine.tick, engine.pmdAnimator);
    });
    return true;
  }

  if (isCastleStyleInterior(scene)) {
    renderFramedInterior(
      engine,
      ctx,
      15,
      12,
      '#000000',
      () => {
        if (scene === 'dark-cathedral') {
          renderCathedralScene(ctx, engine.tick, engine.pmdAnimator);
        } else if (scene === 'dark-forge') {
          renderForgeScene(ctx, engine.tick, engine.pmdAnimator);
        } else if (scene === 'dark-manor') {
          renderManorScene(ctx, engine.tick, engine.pmdAnimator);
        } else if (scene === 'dark-vault') {
          renderVaultScene(ctx, engine.tick, engine.pmdAnimator);
        } else if (isKingdomInteriorScene(scene)) {
          getKingdomInteriorConfig(scene)?.render(ctx, engine.tick, engine.pmdAnimator);
        } else if (isHarbourInteriorScene(scene)) {
          getHarbourInteriorConfig(scene)?.render(ctx, engine.tick, engine.pmdAnimator);
        } else {
          getSkyInteriorConfig(scene)?.render(ctx, engine.tick, engine.pmdAnimator);
        }
      },
      true
    );
    return true;
  }

  if (scene === 'neighbour') {
    renderFramedInterior(engine, ctx, NEIGHBOUR_COLS, NEIGHBOUR_ROWS, '#26170e', () => {
      if (!engine.neighbourBackgroundCanvas) {
        engine.neighbourBackgroundCanvas = createNeighbourBackgroundCanvas();
      }
      ctx.drawImage(engine.neighbourBackgroundCanvas, 0, 0);
      renderNeighbourAnimations(ctx, engine.tick);
    });
    return true;
  }

  if (scene === 'reception') {
    renderFramedInterior(engine, ctx, RECEPTION_COLS, RECEPTION_ROWS, '#0f172a', () => {
      if (!engine.receptionBackgroundCanvas) {
        engine.receptionBackgroundCanvas = createReceptionBackgroundCanvas();
      }
      ctx.drawImage(engine.receptionBackgroundCanvas, 0, 0);
      renderReceptionAnimations(ctx, engine.tick);
    });
    return true;
  }

  if (scene === 'arcade') {
    renderFramedInterior(engine, ctx, ARCADE_COLS, ARCADE_ROWS, '#151026', () => {
      if (!engine.arcadeBackgroundCanvas) {
        engine.arcadeBackgroundCanvas = createArcadeBackgroundCanvas();
      }
      ctx.drawImage(engine.arcadeBackgroundCanvas, 0, 0);
      renderArcadeAnimations(ctx, engine.tick, engine.pmdAnimator);
    });
    return true;
  }

  if (scene === 'lab') {
    renderFramedInterior(engine, ctx, LAB_COLS, LAB_ROWS, '#06110f', () => {
      if (!engine.labBackgroundCanvas) {
        engine.labBackgroundCanvas = createLabBackgroundCanvas();
      }
      ctx.drawImage(engine.labBackgroundCanvas, 0, 0);
      renderLabAnimations(ctx, performance.now(), engine.pmdAnimator, engine.tick);
    });
    return true;
  }

  return false;
}
