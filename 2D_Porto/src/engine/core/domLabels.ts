import type { TownEngine } from '../TownEngine';
import { DIGI_GATE_PORTAL, TOWN_OFFSET_X } from '../map';
import { DIGI_DARK_CASTLE_GATE, DIGI_KINGDOM_GATE, DIGI_PLAZA_CONSOLE, DIGI_RETURN_GATE, DIGI_SKY_CASTLE_GATE } from '../digiMap';
import { SKY_CASTLE_LANDMARKS, SKY_CASTLE_RETURN_GATE } from '../skyCastleMap';
import { getSkyInteriorConfig, isSkyInteriorScene } from '../sky/skyInteriorsRegistry';
import { KINGDOM_HARBOUR_GATE, KINGDOM_LANDMARKS, KINGDOM_RETURN_GATE } from '../kingdomMap';
import { getKingdomInteriorConfig, isKingdomInteriorScene } from '../kingdom/kingdomInteriorsRegistry';
import { HARBOUR_LANDMARKS, HARBOUR_RETURN_GATE } from '../harbourMap';
import { getHarbourInteriorConfig, isHarbourInteriorScene } from '../harbour/harbourInteriorsRegistry';
import { DARK_CASTLE_LANDMARKS, DARK_CASTLE_RETURN_GATE } from '../darkCastleMap';
import { TILE_SIZE } from '../sprites';
import { townConfig } from '../townConfig';

export function updateDomLabelsHelper(engine: TownEngine, force = false): void {
    const container = document.querySelector('[data-town-labels]');
    if (!container) return;

    const selectedBuilding =
      engine.editor && engine.editor.isEnabled() && !engine.editor.isPlaytesting()
        ? engine.editor.getSelectedBuilding()
        : null;
    const labelKey = [
      engine.currentScene,
      engine.currentScene === 'home' ? engine.homeFloor : '',
      Math.round(engine.cameraX * 2),
      Math.round(engine.cameraY * 2),
      Math.round(engine.zoom * 100),
      engine.canvas.width,
      engine.canvas.height,
      engine.editor?.isEnabled() ? 1 : 0,
      engine.editor?.isPlaytesting() ? 1 : 0,
      selectedBuilding
        ? `${selectedBuilding.id}:${selectedBuilding.x},${selectedBuilding.y},${selectedBuilding.orientation || ''}`
        : '',
    ].join('|');
    if (!force && labelKey === engine.lastDomLabelKey) return;
    engine.lastDomLabelKey = labelKey;

    const dpr = window.devicePixelRatio || 1;
    const rect = engine.canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    if (engine.currentScene === 'home') {
      const is2F = engine.homeFloor === '2F';
      const home1FLabels: Record<string, { x: number; y: number; w: number; h: number; lift?: number }> = {
        'shop-posters': { x: 1, y: 1, w: 4, h: 1, lift: 0 },
        'shop-polaroids': { x: 8, y: 1, w: 4, h: 1, lift: 0 },
        'stairs-up': { x: 12, y: 2, w: 2, h: 1, lift: 0.5 },
        'shop-jukebox': { x: 1, y: 3, w: 2, h: 2, lift: 0 },
        'shop-closet': { x: 9, y: 5, w: 3, h: 1, lift: 0 },
      };

      const home2FLabels: Record<string, { x: number; y: number; w: number; h: number; lift?: number }> = {
        'home2f-fridge': { x: 1, y: 2, w: 1, h: 2, lift: 1 },
        'home2f-tv': { x: 5, y: 2, w: 3, h: 1, lift: 2 },
        'home2f-twin': { x: 6, y: 6, w: 1, h: 1, lift: 1 },
        'home2f-computer': { x: 11, y: 9, w: 2, h: 1, lift: 1.5 },
        'home2f-stairs-down': { x: 12, y: 2, w: 2, h: 1, lift: 0.5 },
      };

      const activeLabels = is2F ? home2FLabels : home1FLabels;
      const inactiveLabels = is2F ? home1FLabels : home2FLabels;

      const buttons = container.querySelectorAll<HTMLButtonElement>('.town-label');
      buttons.forEach((btn) => {
        const id = btn.getAttribute('data-id');
        if (!id) return;
        if (inactiveLabels[id]) {
          btn.style.visibility = 'hidden';
          btn.style.display = 'none';
          return;
        }
        if (!activeLabels[id]) return;

        btn.style.display = '';
        const obj = activeLabels[id];
        const worldX = (obj.x + obj.w / 2) * TILE_SIZE;
        const worldY = (obj.y - (obj.lift ?? 0)) * TILE_SIZE;

        const canvasX = engine.canvas.width / 2 + (worldX - engine.cameraX) * engine.zoom;
        const canvasY = engine.canvas.height / 2 + (worldY - engine.cameraY) * engine.zoom;

        const cssX = canvasX / dpr;
        const cssY = canvasY / dpr;

        btn.style.left = `${Math.round(cssX)}px`;
        btn.style.top = `${Math.round(cssY)}px`;
        btn.style.transform = '';
        btn.style.visibility = 'visible';
      });
      return;
    }

    if (engine.currentScene === 'tower') {
      const towerLabels: Record<string, { x: number; y: number; w: number; h: number; lift?: number }> = {
        xurkitree: { x: 7, y: 3, w: 1, h: 1, lift: 1.1 },
        porygon: { x: 7, y: 3, w: 1, h: 1, lift: 1.1 },
        'robotics-bay': { x: 1, y: 3, w: 3, h: 2, lift: 0.75 },
        'server-rack': { x: 11, y: 3, w: 3, h: 3, lift: 0.75 },
        'career-terminal': { x: 1, y: 7, w: 3, h: 2, lift: 0.75 },
        elevator: { x: 8, y: 7, w: 3, h: 2, lift: 0.75 },
        lounge: { x: 13, y: 7, w: 1, h: 3, lift: 0.75 },
      };

      const buttons = container.querySelectorAll<HTMLButtonElement>('.town-label');
      buttons.forEach((btn) => {
        const id = btn.getAttribute('data-id');
        if (!id || !towerLabels[id]) {
          btn.style.visibility = 'hidden';
          btn.style.display = 'none';
          return;
        }

        btn.style.display = '';
        const obj = towerLabels[id];
        const worldX = (obj.x + obj.w / 2) * TILE_SIZE;
        const worldY = (obj.y - (obj.lift ?? 0)) * TILE_SIZE;

        const canvasX = engine.canvas.width / 2 + (worldX - engine.cameraX) * engine.zoom;
        const canvasY = engine.canvas.height / 2 + (worldY - engine.cameraY) * engine.zoom;

        const cssX = canvasX / dpr;
        const cssY = canvasY / dpr;

        btn.style.left = `${Math.round(cssX)}px`;
        btn.style.top = `${Math.round(cssY)}px`;
        btn.style.transform = '';
        btn.style.visibility = 'visible';
      });
      return;
    }

    if (engine.currentScene === 'mart') {
      const martLabels: Record<string, { x: number; y: number; w: number; h: number; lift?: number }> = {
        clerk: { x: 6, y: 3, w: 1, h: 1, lift: 1.1 },
        meowth: { x: 7, y: 3, w: 1, h: 1, lift: 1.1 },
        'services-shelf': { x: 1, y: 3, w: 3, h: 2, lift: 0.75 },
        'tech-tms': { x: 10, y: 3, w: 3, h: 2, lift: 0.75 },
        'potions-shelf': { x: 1, y: 7, w: 3, h: 2, lift: 0.75 },
        'key-showcase': { x: 10, y: 7, w: 3, h: 2, lift: 0.75 },
        'drink-cooler': { x: 13, y: 3, w: 1, h: 3, lift: 0.5 },
      };

      const buttons = container.querySelectorAll<HTMLButtonElement>('.town-label');
      buttons.forEach((btn) => {
        const id = btn.getAttribute('data-id');
        if (!id || !martLabels[id]) {
          btn.style.visibility = 'hidden';
          btn.style.display = 'none';
          return;
        }

        btn.style.display = '';
        const obj = martLabels[id];
        const worldX = (obj.x + obj.w / 2) * TILE_SIZE;
        const worldY = (obj.y - (obj.lift ?? 0)) * TILE_SIZE;

        const canvasX = engine.canvas.width / 2 + (worldX - engine.cameraX) * engine.zoom;
        const canvasY = engine.canvas.height / 2 + (worldY - engine.cameraY) * engine.zoom;

        const dpr = window.devicePixelRatio || 1;
        const cssX = canvasX / dpr;
        const cssY = canvasY / dpr;

        btn.style.left = `${Math.round(cssX)}px`;
        btn.style.top = `${Math.round(cssY)}px`;
        btn.style.transform = '';
        btn.style.visibility = 'visible';
      });
      return;
    }

    if (engine.currentScene === 'cafe') {
      const cafeLabels: Record<string, { x: number; y: number; w: number; h: number; lift?: number }> = {
        barista: { x: 6, y: 3, w: 1, h: 1, lift: 1.1 },
        alcremie: { x: 7, y: 3, w: 1, h: 1, lift: 1.1 },
        'vinyl-jukebox': { x: 1, y: 3, w: 3, h: 2, lift: 0.75 },
        'pastry-case': { x: 10, y: 3, w: 3, h: 2, lift: 0.75 },
        'roast-board': { x: 1, y: 7, w: 3, h: 2, lift: 0.75 },
        'vip-booth': { x: 10, y: 7, w: 3, h: 2, lift: 0.75 },
        'craft-tap': { x: 13, y: 3, w: 1, h: 3, lift: 0.5 },
      };

      const buttons = container.querySelectorAll<HTMLButtonElement>('.town-label');
      buttons.forEach((btn) => {
        const id = btn.getAttribute('data-id');
        if (!id || !cafeLabels[id]) {
          btn.style.visibility = 'hidden';
          btn.style.display = 'none';
          return;
        }

        btn.style.display = '';
        const obj = cafeLabels[id];
        const worldX = (obj.x + obj.w / 2) * TILE_SIZE;
        const worldY = (obj.y - (obj.lift ?? 0)) * TILE_SIZE;

        const canvasX = engine.canvas.width / 2 + (worldX - engine.cameraX) * engine.zoom;
        const canvasY = engine.canvas.height / 2 + (worldY - engine.cameraY) * engine.zoom;

        const dpr = window.devicePixelRatio || 1;
        const cssX = canvasX / dpr;
        const cssY = canvasY / dpr;

        btn.style.left = `${Math.round(cssX)}px`;
        btn.style.top = `${Math.round(cssY)}px`;
        btn.style.transform = '';
        btn.style.visibility = 'visible';
      });
      return;
    }

    if (engine.currentScene === 'arena') {
      const arenaLabels: Record<string, { x: number; y: number; w: number; h: number; lift?: number }> = {
        'mewtwo-boss': { x: 7, y: 2, w: 1, h: 1, lift: 1.05 },
        'lucario-coach': { x: 2, y: 6, w: 1, h: 1, lift: 0.9 },
        'referee-dan': { x: 12, y: 6, w: 1, h: 1, lift: 0.9 },
        'battle-terminal': { x: 1, y: 3, w: 2, h: 2, lift: 0.5 },
        'algorithm-dojo': { x: 12, y: 3, w: 2, h: 2, lift: 0.5 },
        'trophy-vault': { x: 1, y: 8, w: 2, h: 2, lift: 0.35 },
        'stat-radar': { x: 12, y: 8, w: 2, h: 2, lift: 0.35 },
      };

      const buttons = container.querySelectorAll<HTMLButtonElement>('.town-label');
      buttons.forEach((btn) => {
        const id = btn.getAttribute('data-id');
        if (!id || !arenaLabels[id]) {
          btn.style.visibility = 'hidden';
          btn.style.display = 'none';
          return;
        }

        btn.style.display = '';
        const obj = arenaLabels[id];
        const worldX = (obj.x + obj.w / 2) * TILE_SIZE;
        const worldY = (obj.y - (obj.lift ?? 0)) * TILE_SIZE;

        const canvasX = engine.canvas.width / 2 + (worldX - engine.cameraX) * engine.zoom;
        const canvasY = engine.canvas.height / 2 + (worldY - engine.cameraY) * engine.zoom;

        const dpr = window.devicePixelRatio || 1;
        const cssX = canvasX / dpr;
        const cssY = canvasY / dpr;

        btn.style.left = `${Math.round(cssX)}px`;
        btn.style.top = `${Math.round(cssY)}px`;
        btn.style.transform = '';
        btn.style.visibility = 'visible';
      });
      return;
    }

    if (engine.currentScene === 'garden') {
      const gardenLabels: Record<string, { x: number; y: number; w: number; h: number; lift?: number }> = {
        gardevoir: { x: 6, y: 3, w: 1, h: 1, lift: 1.1 },
        celebi: { x: 8, y: 3, w: 1, h: 1, lift: 0.45 },
        'botanist-flora': { x: 6, y: 3, w: 1, h: 1, lift: 1.1 },
        'shaymin-npc': { x: 8, y: 3, w: 1, h: 1, lift: 0.45 },
        'plot-oran': { x: 1, y: 3, w: 3, h: 2, lift: 0.55 },
        'plot-sitrus': { x: 11, y: 3, w: 3, h: 2, lift: 0.55 },
        'watering-well': { x: 4, y: 6, w: 1, h: 1, lift: 0.85 },
        'plot-cheri': { x: 1, y: 7, w: 3, h: 2, lift: 0.45 },
        'berry-blender': { x: 11, y: 7, w: 3, h: 2, lift: 0.45 },
      };

      const buttons = container.querySelectorAll<HTMLButtonElement>('.town-label');
      buttons.forEach((btn) => {
        const id = btn.getAttribute('data-id');
        if (!id || !gardenLabels[id]) {
          btn.style.visibility = 'hidden';
          btn.style.display = 'none';
          return;
        }

        btn.style.display = '';
        const obj = gardenLabels[id];
        const worldX = (obj.x + obj.w / 2) * TILE_SIZE;
        const worldY = (obj.y - (obj.lift ?? 0)) * TILE_SIZE;

        const canvasX = engine.canvas.width / 2 + (worldX - engine.cameraX) * engine.zoom;
        const canvasY = engine.canvas.height / 2 + (worldY - engine.cameraY) * engine.zoom;

        const dpr = window.devicePixelRatio || 1;
        const cssX = canvasX / dpr;
        const cssY = canvasY / dpr;

        btn.style.left = `${Math.round(cssX)}px`;
        btn.style.top = `${Math.round(cssY)}px`;
        btn.style.transform = '';
        btn.style.visibility = 'visible';
      });
      return;
    }

    if (
      engine.currentScene === 'dark-cathedral' ||
      engine.currentScene === 'dark-forge' ||
      engine.currentScene === 'dark-manor' ||
      engine.currentScene === 'dark-vault' ||
      isKingdomInteriorScene(engine.currentScene) ||
      isHarbourInteriorScene(engine.currentScene) ||
      isSkyInteriorScene(engine.currentScene)
    ) {
      const cathedralLabels: Record<string, { x: number; y: number; w: number; h: number; lift?: number }> = {
        'pipe-organ': { x: 6, y: 1, w: 3, h: 1, lift: 0.95 },
        lunala: { x: 7, y: 2, w: 1, h: 1, lift: 1.35 },
        'war-stories-grimoire': { x: 1, y: 3, w: 2, h: 2, lift: 0.55 },
        'confession-shrine': { x: 12, y: 3, w: 2, h: 2, lift: 0.55 },
        necrozma: { x: 2, y: 6, w: 1, h: 1, lift: 1.05 },
        gardevoir: { x: 12, y: 6, w: 1, h: 1, lift: 1.05 },
        'stained-rose': { x: 7, y: 6, w: 1, h: 1, lift: 1.05 },
        'west-pews': { x: 1, y: 8, w: 2, h: 2, lift: 0.5 },
        'east-pews': { x: 12, y: 8, w: 2, h: 2, lift: 0.5 },
      };

      const forgeLabels: Record<string, { x: number; y: number; w: number; h: number; lift?: number }> = {
        machinedramon: { x: 7, y: 2, w: 1, h: 1, lift: 0.72 },
        'magma-core': { x: 6, y: 1, w: 3, h: 2, lift: 0.88 },
        'tech-anvil': { x: 1, y: 3, w: 2, h: 2, lift: 0.55 },
        'telemetry-terminal': { x: 12, y: 3, w: 2, h: 2, lift: 0.55 },
        charizard: { x: 2, y: 6, w: 1, h: 1, lift: 0.68 },
        groudon: { x: 12, y: 6, w: 1, h: 1, lift: 0.68 },
        'forge-altar': { x: 7, y: 6, w: 1, h: 1, lift: 0.6 },
        'coolant-valves': { x: 1, y: 8, w: 2, h: 2, lift: 0.55 },
        'plasma-batteries': { x: 12, y: 8, w: 2, h: 2, lift: 0.55 },
      };

      const manorLabels: Record<string, { x: number; y: number; w: number; h: number; lift?: number }> = {
        'darkrai-throne': { x: 6, y: 1, w: 3, h: 1, lift: 0.95 },
        darkrai: { x: 7, y: 2, w: 1, h: 1, lift: 1.35 },
        'bug-gallery-1': { x: 1, y: 3, w: 2, h: 2, lift: 0.55 },
        'bug-gallery-2': { x: 12, y: 3, w: 2, h: 2, lift: 0.55 },
        giratina: { x: 2, y: 6, w: 1, h: 1, lift: 1.15 },
        urshifu: { x: 12, y: 6, w: 1, h: 1, lift: 1.05 },
        'crimson-altar': { x: 7, y: 6, w: 1, h: 1, lift: 1.05 },
        'blood-fireplace': { x: 1, y: 8, w: 2, h: 2, lift: 0.5 },
        'demon-crenellations': { x: 12, y: 8, w: 2, h: 2, lift: 0.5 },
      };

      const vaultLabels: Record<string, { x: number; y: number; w: number; h: number; lift?: number }> = {
        'clockwork-face': { x: 6, y: 1, w: 3, h: 1, lift: 0.95 },
        dialga: { x: 7, y: 2, w: 1, h: 1, lift: 1.35 },
        'gear-pedestal-1': { x: 1, y: 3, w: 2, h: 2, lift: 0.55 },
        'gear-pedestal-2': { x: 12, y: 3, w: 2, h: 2, lift: 0.55 },
        celebi: { x: 2, y: 6, w: 1, h: 1, lift: 1.05 },
        chronomon: { x: 12, y: 6, w: 1, h: 1, lift: 1.15 },
        'time-capsule': { x: 7, y: 6, w: 1, h: 1, lift: 1.05 },
        'chrono-pendulum': { x: 1, y: 8, w: 2, h: 2, lift: 0.5 },
        'temporal-coffer': { x: 12, y: 8, w: 2, h: 2, lift: 0.5 },
      };

      const kingdomLabelsCfg = getKingdomInteriorConfig(engine.currentScene);
      const harbourLabelsCfg = getHarbourInteriorConfig(engine.currentScene);
      const skyLabelsCfg = getSkyInteriorConfig(engine.currentScene);
      const currentDarkLabels = kingdomLabelsCfg
        ? kingdomLabelsCfg.labels
        : harbourLabelsCfg
          ? harbourLabelsCfg.labels
          : skyLabelsCfg
            ? skyLabelsCfg.labels
            : engine.currentScene === 'dark-cathedral'
            ? cathedralLabels
            : engine.currentScene === 'dark-forge'
              ? forgeLabels
              : engine.currentScene === 'dark-manor'
                ? manorLabels
                : vaultLabels;

      const buttons = container.querySelectorAll<HTMLButtonElement>('.town-label');
      buttons.forEach((btn) => {
        const id = btn.getAttribute('data-id');
        if (!id || !currentDarkLabels[id]) {
          btn.style.visibility = 'hidden';
          btn.style.display = 'none';
          return;
        }

        btn.style.display = '';
        const obj = currentDarkLabels[id];
        const worldX = (obj.x + obj.w / 2) * TILE_SIZE;
        const worldY = (obj.y - (obj.lift ?? 0)) * TILE_SIZE;

        const canvasX = engine.canvas.width / 2 + (worldX - engine.cameraX) * engine.zoom;
        const canvasY = engine.canvas.height / 2 + (worldY - engine.cameraY) * engine.zoom;

        const cssX = canvasX / dpr;
        const cssY = canvasY / dpr;

        btn.style.left = String(Math.round(cssX)) + 'px';
        btn.style.top = String(Math.round(cssY)) + 'px';
        btn.style.transform = '';
        btn.style.visibility = 'visible';
      });
      return;
    }

    if (engine.currentScene === 'neighbour') {
      const neighbourLabels: Record<string, { x: number; y: number; w: number; h: number; lift?: number }> = {
        'neighbour-maya': { x: 6, y: 3, w: 1, h: 1, lift: 1.45 },
        'eevee-companion': { x: 8, y: 3, w: 1, h: 1, lift: 0.45 },
        'guestbook-board': { x: 1, y: 3, w: 3, h: 2, lift: 0.55 },
        'coop-table': { x: 11, y: 3, w: 3, h: 2, lift: 0.55 },
        'fireplace-hearth': { x: 4, y: 6, w: 1, h: 1, lift: 0.85 },
        'retro-console': { x: 1, y: 7, w: 3, h: 2, lift: 0.45 },
        'mentorship-shelf': { x: 11, y: 7, w: 3, h: 2, lift: 0.45 },
      };

      const buttons = container.querySelectorAll<HTMLButtonElement>('.town-label');
      buttons.forEach((btn) => {
        const id = btn.getAttribute('data-id');
        if (!id || !neighbourLabels[id]) {
          btn.style.visibility = 'hidden';
          btn.style.display = 'none';
          return;
        }

        btn.style.display = '';
        const obj = neighbourLabels[id];
        const worldX = (obj.x + obj.w / 2) * TILE_SIZE;
        const worldY = (obj.y - (obj.lift ?? 0)) * TILE_SIZE;

        const canvasX = engine.canvas.width / 2 + (worldX - engine.cameraX) * engine.zoom;
        const canvasY = engine.canvas.height / 2 + (worldY - engine.cameraY) * engine.zoom;

        const dpr = window.devicePixelRatio || 1;
        const cssX = canvasX / dpr;
        const cssY = canvasY / dpr;

        btn.style.left = `${Math.round(cssX)}px`;
        btn.style.top = `${Math.round(cssY)}px`;
        btn.style.transform = '';
        btn.style.visibility = 'visible';
      });
      return;
    }

    if (engine.currentScene === 'reception') {
      const receptionLabels: Record<string, { x: number; y: number; w: number; h: number; lift?: number }> = {
        mira: { x: 7, y: 3, w: 1, h: 1, lift: 1.1 },
        chansey: { x: 9, y: 3, w: 1, h: 1, lift: 1.1 },
        'healing-machine': { x: 10, y: 2, w: 3, h: 2, lift: 0.75 },
        'pc-terminal': { x: 13, y: 4, w: 1, h: 2, lift: 0.5 },
        'directory-board': { x: 1, y: 3, w: 2, h: 1, lift: 1.25 },
        'waiting-couch': { x: 1, y: 6, w: 3, h: 2, lift: 0.25 },
      };

      const buttons = container.querySelectorAll<HTMLButtonElement>('.town-label');
      buttons.forEach((btn) => {
        const id = btn.getAttribute('data-id');
        if (!id || !receptionLabels[id]) {
          btn.style.visibility = 'hidden';
          btn.style.display = 'none';
          return;
        }

        btn.style.display = '';
        const obj = receptionLabels[id];
        const worldX = (obj.x + obj.w / 2) * TILE_SIZE;
        const worldY = (obj.y - (obj.lift ?? 0)) * TILE_SIZE;

        const canvasX = engine.canvas.width / 2 + (worldX - engine.cameraX) * engine.zoom;
        const canvasY = engine.canvas.height / 2 + (worldY - engine.cameraY) * engine.zoom;

        const dpr = window.devicePixelRatio || 1;
        const cssX = canvasX / dpr;
        const cssY = canvasY / dpr;

        btn.style.left = `${Math.round(cssX)}px`;
        btn.style.top = `${Math.round(cssY)}px`;
        btn.style.transform = '';
        btn.style.visibility = 'visible';
      });
      return;
    }

    if (engine.currentScene === 'arcade') {
      const arcadeLabels: Record<string, { x: number; y: number; w: number; h: number; lift?: number }> = {
        robot: { x: 8, y: 4, w: 3, h: 3, lift: 1.375 },
      };

      const buttons = container.querySelectorAll<HTMLButtonElement>('.town-label');
      buttons.forEach((btn) => {
        const id = btn.getAttribute('data-id');
        if (!id || !arcadeLabels[id]) {
          btn.style.visibility = 'hidden';
          btn.style.display = 'none';
          return;
        }

        btn.style.display = '';
        const obj = arcadeLabels[id];
        const worldX = (obj.x + obj.w / 2) * TILE_SIZE;
        const worldY = (obj.y - (obj.lift ?? 0)) * TILE_SIZE;

        const canvasX = engine.canvas.width / 2 + (worldX - engine.cameraX) * engine.zoom;
        const canvasY = engine.canvas.height / 2 + (worldY - engine.cameraY) * engine.zoom;

        const dpr = window.devicePixelRatio || 1;
        const cssX = canvasX / dpr;
        const cssY = canvasY / dpr;

        btn.style.left = `${Math.round(cssX)}px`;
        btn.style.top = `${Math.round(cssY)}px`;
        btn.style.transform = '';
        btn.style.visibility = 'visible';
      });
      return;
    }

    if (engine.currentScene === 'lab') {
      const labLabels: Record<string, { x: number; y: number; w: number; h: number; lift?: number }> = {
        'lab-posters': { x: 1, y: 1, w: 4, h: 1, lift: 0.8 },
        'lab-whiteboard': { x: 6, y: 1, w: 5, h: 1, lift: 0.8 },
        'lab-bench': { x: 4, y: 7, w: 5, h: 2, lift: 0.1 },
        pheromosa: { x: 9, y: 4, w: 1, h: 1, lift: 1.3 },
      };

      const buttons = container.querySelectorAll<HTMLButtonElement>('.town-label');
      buttons.forEach((btn) => {
        const id = btn.getAttribute('data-id');
        if (!id || !labLabels[id]) {
          btn.style.visibility = 'hidden';
          btn.style.display = 'none';
          return;
        }

        btn.style.display = '';
        const obj = labLabels[id];
        const worldX = (obj.x + obj.w / 2) * TILE_SIZE;
        const worldY = (obj.y - (obj.lift ?? 0)) * TILE_SIZE;

        const canvasX = engine.canvas.width / 2 + (worldX - engine.cameraX) * engine.zoom;
        const canvasY = engine.canvas.height / 2 + (worldY - engine.cameraY) * engine.zoom;

        const dpr = window.devicePixelRatio || 1;
        const cssX = canvasX / dpr;
        const cssY = canvasY / dpr;

        btn.style.left = `${Math.round(cssX)}px`;
        btn.style.top = `${Math.round(cssY)}px`;
        btn.style.transform = '';
        btn.style.visibility = 'visible';
      });
      return;
    }

    if (engine.currentScene === 'dev') {
      const devLabels: Record<string, { x: number; y: number; w: number; h: number; lift?: number }> = {
        timeline: { x: 4, y: 1, w: 7, h: 1, lift: 0.8 },
        radar: { x: 1, y: 3, w: 2, h: 2, lift: 0.1 },
        telemetry: { x: 12, y: 3, w: 2, h: 3, lift: -0.3 },
        snorlax: { x: 6, y: 13, w: 3, h: 2, lift: -1.45 },
        lebronette: { x: 6, y: 13, w: 3, h: 2, lift: -1.45 },
        coffee: { x: 13, y: 14, w: 1, h: 1, lift: 0.7 },
        rack: { x: 13, y: 11, w: 1, h: 2, lift: 0.6 },
      };

      const buttons = container.querySelectorAll<HTMLButtonElement>('.town-label');
      buttons.forEach((btn) => {
        const id = btn.getAttribute('data-id');
        if (!id || !devLabels[id]) {
          btn.style.visibility = 'hidden';
          btn.style.display = 'none';
          return;
        }

        btn.style.display = '';
        const obj = devLabels[id];
        const worldX = (obj.x + obj.w / 2) * TILE_SIZE;
        const worldY = (obj.y - (obj.lift ?? 0)) * TILE_SIZE;

        const canvasX = engine.canvas.width / 2 + (worldX - engine.cameraX) * engine.zoom;
        const canvasY = engine.canvas.height / 2 + (worldY - engine.cameraY) * engine.zoom;

        const cssX = canvasX / dpr;
        const cssY = canvasY / dpr;

        btn.style.left = `${Math.round(cssX)}px`;
        btn.style.top = `${Math.round(cssY)}px`;
        btn.style.transform = '';
        btn.style.visibility = 'visible';
      });
      return;
    }

    if (engine.currentScene === 'digimon') {
      const digiLabels: Record<string, { x: number; y: number; w: number; h: number; lift?: number }> = {
        'digi-return': { x: DIGI_RETURN_GATE.xMin, y: DIGI_RETURN_GATE.yMin, w: 3, h: 2, lift: 0.35 },
        'digidex-console': { x: DIGI_PLAZA_CONSOLE.x, y: DIGI_PLAZA_CONSOLE.y, w: DIGI_PLAZA_CONSOLE.w, h: DIGI_PLAZA_CONSOLE.h, lift: 0.4 },
        'kingdom-gate': { x: DIGI_KINGDOM_GATE.xMin, y: DIGI_KINGDOM_GATE.yMin, w: 3, h: 2, lift: 0.45 },
        'dark-castle-gate': { x: DIGI_DARK_CASTLE_GATE.xMin, y: DIGI_DARK_CASTLE_GATE.yMin, w: 3, h: 3, lift: 0.35 },
        'sky-castle-gate': { x: DIGI_SKY_CASTLE_GATE.xMin, y: DIGI_SKY_CASTLE_GATE.yMin, w: 3, h: 3, lift: 0.35 },
      };

      const buttons = container.querySelectorAll<HTMLButtonElement>('.town-label');
      buttons.forEach((btn) => {
        const id = btn.getAttribute('data-id');
        if (!id || !digiLabels[id]) {
          btn.style.visibility = 'hidden';
          btn.style.display = 'none';
          return;
        }

        btn.style.display = '';
        const obj = digiLabels[id];
        const worldX = (obj.x + obj.w / 2) * TILE_SIZE;
        const worldY = (obj.y - (obj.lift ?? 0)) * TILE_SIZE;

        const canvasX = engine.canvas.width / 2 + (worldX - engine.cameraX) * engine.zoom;
        const canvasY = engine.canvas.height / 2 + (worldY - engine.cameraY) * engine.zoom;

        const cssX = canvasX / dpr;
        let cssY = canvasY / dpr;
        if (cssY < 24) cssY = 24;

        const visible = cssX > -60 && cssX < rect.width + 60 && cssY > -40 && cssY < rect.height + 40;
        btn.style.left = `${Math.round(cssX)}px`;
        btn.style.top = `${Math.round(cssY)}px`;
        btn.style.transform = '';
        btn.style.visibility = visible ? 'visible' : 'hidden';
      });

      updateTransformBubble(engine, dpr, rect);
      return;
    }

    if (engine.currentScene === 'kingdom') {
      const kingdomLabels: Record<string, { x: number; y: number; w: number; h: number; lift?: number }> = {
        'kingdom-return': { x: KINGDOM_RETURN_GATE.xMin, y: KINGDOM_RETURN_GATE.yMin, w: 3, h: 2, lift: 0.9 },
        'harbour-gate': { x: KINGDOM_HARBOUR_GATE.xMin, y: KINGDOM_HARBOUR_GATE.yMin, w: 3, h: 1, lift: 1.0 },
      };
      for (const lm of KINGDOM_LANDMARKS) {
        kingdomLabels[lm.id] = { x: lm.x, y: lm.y, w: lm.w, h: lm.h, lift: 0.35 };
      }

      const buttons = container.querySelectorAll<HTMLButtonElement>('.town-label');
      buttons.forEach((btn) => {
        const id = btn.getAttribute('data-id');
        if (!id || !kingdomLabels[id]) {
          btn.style.visibility = 'hidden';
          btn.style.display = 'none';
          return;
        }

        btn.style.display = '';
        btn.style.opacity = '';
        btn.style.pointerEvents = '';
        const obj = kingdomLabels[id];
        const worldX = (obj.x + obj.w / 2) * TILE_SIZE;
        const worldY = (obj.y - (obj.lift ?? 0)) * TILE_SIZE;

        const canvasX = engine.canvas.width / 2 + (worldX - engine.cameraX) * engine.zoom;
        const canvasY = engine.canvas.height / 2 + (worldY - engine.cameraY) * engine.zoom;

        const cssX = canvasX / dpr;
        let cssY = canvasY / dpr;
        if (cssY < 24) cssY = 24;

        const visible = cssX > -60 && cssX < rect.width + 60 && cssY > -40 && cssY < rect.height + 40;
        btn.style.left = `${Math.round(cssX)}px`;
        btn.style.top = `${Math.round(cssY)}px`;
        btn.style.transform = '';
        btn.style.visibility = visible ? 'visible' : 'hidden';
      });

      updateTransformBubble(engine, dpr, rect);
      return;
    }

    if (engine.currentScene === 'harbour') {
      const harbourLabels: Record<string, { x: number; y: number; w: number; h: number; lift?: number }> = {
        'harbour-return': { x: HARBOUR_RETURN_GATE.xMin, y: HARBOUR_RETURN_GATE.yMin + 1, w: 4, h: 2, lift: 0.3 },
      };
      for (const lm of HARBOUR_LANDMARKS) {
        harbourLabels[lm.id] = { x: lm.x, y: lm.y, w: lm.w, h: lm.h, lift: 0.3 };
      }

      const buttons = container.querySelectorAll<HTMLButtonElement>('.town-label');
      buttons.forEach((btn) => {
        const id = btn.getAttribute('data-id');
        if (!id || !harbourLabels[id]) {
          btn.style.visibility = 'hidden';
          btn.style.display = 'none';
          return;
        }

        btn.style.display = '';
        const obj = harbourLabels[id];
        const worldX = (obj.x + obj.w / 2) * TILE_SIZE;
        const worldY = (obj.y - (obj.lift ?? 0)) * TILE_SIZE;

        const canvasX = engine.canvas.width / 2 + (worldX - engine.cameraX) * engine.zoom;
        const canvasY = engine.canvas.height / 2 + (worldY - engine.cameraY) * engine.zoom;

        const cssX = canvasX / dpr;
        let cssY = canvasY / dpr;
        if (cssY < 24) cssY = 24;

        const visible = cssX > -60 && cssX < rect.width + 60 && cssY > -40 && cssY < rect.height + 40;
        btn.style.left = `${Math.round(cssX)}px`;
        btn.style.top = `${Math.round(cssY)}px`;
        btn.style.transform = '';
        btn.style.visibility = visible ? 'visible' : 'hidden';
      });

      updateTransformBubble(engine, dpr, rect);
      return;
    }

    if (engine.currentScene === 'sky-castle') {
      const skyLabels: Record<string, { x: number; y: number; w: number; h: number; lift?: number }> = {
        'sky-castle-return': { x: SKY_CASTLE_RETURN_GATE.xMin, y: SKY_CASTLE_RETURN_GATE.yMin - 1, w: 3, h: 2, lift: 0.2 },
      };
      for (const lm of SKY_CASTLE_LANDMARKS) {
        skyLabels[lm.id] = { x: lm.x, y: lm.y, w: lm.w, h: lm.h, lift: 0.3 };
      }

      const buttons = container.querySelectorAll<HTMLButtonElement>('.town-label');
      buttons.forEach((btn) => {
        const id = btn.getAttribute('data-id');
        if (!id || !skyLabels[id]) {
          btn.style.visibility = 'hidden';
          btn.style.display = 'none';
          return;
        }

        btn.style.display = '';
        const obj = skyLabels[id];
        const worldX = (obj.x + obj.w / 2) * TILE_SIZE;
        const worldY = (obj.y - (obj.lift ?? 0)) * TILE_SIZE;

        const canvasX = engine.canvas.width / 2 + (worldX - engine.cameraX) * engine.zoom;
        const canvasY = engine.canvas.height / 2 + (worldY - engine.cameraY) * engine.zoom;

        const cssX = canvasX / dpr;
        let cssY = canvasY / dpr;
        if (cssY < 24) cssY = 24;

        const visible = cssX > -60 && cssX < rect.width + 60 && cssY > -40 && cssY < rect.height + 40;
        btn.style.left = `${Math.round(cssX)}px`;
        btn.style.top = `${Math.round(cssY)}px`;
        btn.style.transform = '';
        btn.style.visibility = visible ? 'visible' : 'hidden';
      });

      updateTransformBubble(engine, dpr, rect);
      return;
    }

    if (engine.currentScene === 'dark-castle') {
      const darkLabels: Record<string, { x: number; y: number; w: number; h: number; lift?: number }> = {
        'dark-castle-return': { x: DARK_CASTLE_RETURN_GATE.xMin, y: DARK_CASTLE_RETURN_GATE.yMin - 3, w: 3, h: 3, lift: 0.2 },
      };
      for (const lm of DARK_CASTLE_LANDMARKS) {
        darkLabels[lm.id] = { x: lm.x, y: lm.y, w: lm.w, h: lm.h, lift: -0.25 };
      }

      const buttons = container.querySelectorAll<HTMLButtonElement>('.town-label');
      buttons.forEach((btn) => {
        const id = btn.getAttribute('data-id');
        if (!id || !darkLabels[id]) {
          btn.style.visibility = 'hidden';
          btn.style.display = 'none';
          return;
        }

        btn.style.display = '';
        const obj = darkLabels[id];
        const worldX = (obj.x + obj.w / 2) * TILE_SIZE;
        const worldY = (obj.y - (obj.lift ?? 0)) * TILE_SIZE;

        const canvasX = engine.canvas.width / 2 + (worldX - engine.cameraX) * engine.zoom;
        const canvasY = engine.canvas.height / 2 + (worldY - engine.cameraY) * engine.zoom;

        const cssX = canvasX / dpr;
        let cssY = canvasY / dpr;
        if (cssY < 24) cssY = 24;

        const visible = cssX > -60 && cssX < rect.width + 60 && cssY > -40 && cssY < rect.height + 40;
        btn.style.left = `${Math.round(cssX)}px`;
        btn.style.top = `${Math.round(cssY)}px`;
        btn.style.transform = '';
        btn.style.visibility = visible ? 'visible' : 'hidden';
      });

      updateTransformBubble(engine, dpr, rect);
      return;
    }

    const ALIAS_MAP: Record<string, string[]> = {
      depop: ['shop'],
      shop: ['depop'],
      berry: ['garden'],
      garden: ['berry'],
      neighbour: ['villa'],
      villa: ['neighbour'],
      lookout: ['telescope', 'sign_lookout'],
      hobby: ['gazebo', 'sign_hobby'],
      ranger: ['ranger', 'camp'],
      contest: ['contest', 'podium'],
      kiosk: ['cafe', 'bar'],
    };

    const STATIC_LABELS = new Set(['linkedin', 'resume', 'github', 'email', 'digi-gate']);
    const POKEMON_LABEL_IDS = new Set([
      'charizard',
      'lebron',
      'reshiram',
      'zekrom',
      'giratina',
      'palkia',
      'dialga',
      'rayquaza',
      'groudon',
      'kyogre',
      'latios',
      'latias',
      'darkrai',
      'necrozma',
      'necrozma_dusk_mane',
      'lunala',
      'solgaleo',
      'samurott',
      'empoleon',
      'regigigas',
      'koraidon',
      'eternatus',
      'lugia',
      'archaludon',
      'gougingfire',
      'greattusk',
      'kyurem',
      'salamence',
      'arceus',
      'ranger',
      'tyranitar',
      'gyarados',
      'snorlax',
      'garchomp',
      'urshifu',
      'urshifu_gmax',
      'blastoise',
      'ace',
      'mewtwo',
      'twin',
    ]);

    const ox = TOWN_OFFSET_X;
    const labelDefs: Record<string, { x: number; y: number; w: number; h: number; kind: string; lift?: number }> = {
      dev: { x: 10 + ox, y: 1, w: 12, h: 11, kind: 'building', lift: 0.1 },
      lab: { x: 24 + ox, y: 3, w: 7, h: 6, kind: 'building', lift: 0.1 },
      villa: { x: 25 + ox, y: 20, w: 6, h: 5, kind: 'building', lift: 0.1 },
      neighbour: { x: 25 + ox, y: 20, w: 6, h: 5, kind: 'building', lift: 0.1 },
      home: { x: 33 + ox, y: 18, w: 10, h: 7, kind: 'building', lift: 0.5 },
      reception: { x: 35 + ox, y: 11, w: 7, h: 6, kind: 'building', lift: 0.05 },
      office: { x: 36 + ox, y: 0, w: 6, h: 8, kind: 'building', lift: 0.1 },
      arcade: { x: 24 + ox, y: 10, w: 8, h: 7, kind: 'building', lift: 0.1 },
      shop: { x: 36 + ox, y: 27, w: 6, h: 6, kind: 'building', lift: 0.08 },
      depop: { x: 36 + ox, y: 27, w: 6, h: 6, kind: 'building', lift: 0.08 },
      fountain: { x: 4 + ox, y: 52, w: 4, h: 4, kind: 'fountain', lift: 0.2 },
      statue: { x: 16 + ox, y: 16, w: 1, h: 1, kind: 'statue', lift: 0.1 },
      twin: { x: 12 + ox, y: 22, w: 1, h: 1, kind: 'npc', lift: 0.35 },
      kiosk: { x: 27 + ox, y: 28, w: 5, h: 4, kind: 'board', lift: 0.15 },
      linkedin: { x: 34.5 + ox, y: 49, w: 1, h: 1, kind: 'board', lift: 0.1 },
      resume: { x: 41.5 + ox, y: 49, w: 1, h: 1, kind: 'resume', lift: 0.1 },
      github: { x: 34.5 + ox, y: 53.5, w: 1, h: 1, kind: 'signpost', lift: 0.1 },
      email: { x: 41.5 + ox, y: 53.5, w: 1, h: 1, kind: 'mailbox', lift: 0.1 },
      lookout: { x: 3 + ox, y: 43, w: 2, h: 2, kind: 'statue', lift: 0.1 },
      arena: { x: 33 + ox, y: 35, w: 10, h: 9, kind: 'statue', lift: 0.1 },
      berry: { x: 25 + ox, y: 35, w: 7, h: 9, kind: 'statue', lift: 0.1 },
      contest: { x: 25 + ox, y: 48, w: 7, h: 8, kind: 'statue', lift: 0.1 },
      hobby: { x: 6 + ox, y: 29, w: 3, h: 3, kind: 'board', lift: 0.25 },
      'digi-gate': { x: DIGI_GATE_PORTAL.xMin, y: DIGI_GATE_PORTAL.yMin, w: 3, h: 2, kind: 'statue', lift: 0.3 },
    };

    const buttons = container.querySelectorAll<HTMLButtonElement>('.town-label');
    buttons.forEach((btn) => {
      const id = btn.getAttribute('data-id');
      if (!id) return;
      if (POKEMON_LABEL_IDS.has(id)) {
        btn.style.visibility = 'hidden';
        btn.style.display = 'none';
        return;
      }
      if (!labelDefs[id]) return;

      const obj = { ...labelDefs[id] };

      // 1. Resolve dynamic building config (with alias fallback)
      let bConfig = townConfig.getBuilding(id);
      if (!bConfig && ALIAS_MAP[id]) {
        for (const alias of ALIAS_MAP[id]) {
          bConfig = townConfig.getBuilding(alias);
          if (bConfig) break;
        }
      }

      // If this is a managed town object and it has been deleted or hidden, hide its DOM tag
      if (!STATIC_LABELS.has(id)) {
        if (!bConfig || bConfig.hidden) {
          btn.style.visibility = 'hidden';
          btn.style.display = 'none';
          return;
        }
      }

      // Special check for Ace Trainer when tied to Arena
      if (id === 'ace') {
        const arenaCfg = townConfig.getBuilding('arena');
        if (bConfig && bConfig.hidden) {
          btn.style.visibility = 'hidden';
          btn.style.display = 'none';
          return;
        }
        if (arenaCfg && arenaCfg.hidden) {
          btn.style.visibility = 'hidden';
          btn.style.display = 'none';
          return;
        }
      }

      btn.style.display = '';

      // 2. Compute dynamic world coordinates (centered horizontally and anchored above roof)
      let worldX: number;
      let worldY: number;

      const hasCustomPin =
        bConfig &&
        bConfig.labelX !== undefined &&
        bConfig.labelY !== undefined &&
        (bConfig.w <= 1 || Math.abs(bConfig.labelX - bConfig.x) > 0.1);

      if (hasCustomPin && bConfig) {
        worldX = bConfig.labelX! * TILE_SIZE;
        worldY = (bConfig.labelY! - (obj.lift ?? 0)) * TILE_SIZE;
      } else if (bConfig) {
        worldX = (bConfig.x + bConfig.w / 2) * TILE_SIZE;
        worldY = (bConfig.y - (obj.lift ?? 0)) * TILE_SIZE;
      } else {
        worldX = (obj.x + obj.w / 2) * TILE_SIZE;
        worldY = (obj.y - (obj.lift ?? 0)) * TILE_SIZE;
      }

      const canvasX = engine.canvas.width / 2 + (worldX - engine.cameraX) * engine.zoom;
      const canvasY = engine.canvas.height / 2 + (worldY - engine.cameraY) * engine.zoom;

      const cssX = canvasX / dpr;
      let cssY = canvasY / dpr;

      if (obj.kind === 'npc') {
        cssY -= 12;
      } else if (obj.kind === 'statue') {
        cssY -= 4;
      } else {
        cssY -= 2;
      }

      // Clamping to ensure top-edge badges (e.g. Dev Center) are never cut off by viewport
      if (cssY < 24) cssY = 24;

      const visible = cssX > -60 && cssX < rect.width + 60 && cssY > -40 && cssY < rect.height + 40;
      btn.style.left = `${Math.round(cssX)}px`;
      btn.style.top = `${Math.round(cssY)}px`;
      btn.style.transform = '';
      btn.style.visibility = visible ? 'visible' : 'hidden';
    });

    // Update Floating Transform Action Bubble position in editor mode
    updateTransformBubble(engine, dpr, rect);
  }

function updateTransformBubble(engine: TownEngine, dpr: number, rect: DOMRect): void {
    const transformBubble = document.getElementById('town-transform-bubble');
    if (!transformBubble) return;

    if (
      engine.isWorldScene() &&
      engine.editor &&
      engine.editor.isEnabled() &&
      !engine.editor.isPlaytesting()
    ) {
      const selected = engine.editor.getSelectedBuilding();
      if (selected) {
        const worldX = (selected.x + selected.w / 2) * TILE_SIZE;
        const worldY = selected.y * TILE_SIZE;
        const pt = engine.worldToScreen(worldX, worldY);
        const isTopClipped = pt.y < 85;
        const topPos = isTopClipped
          ? pt.y + (selected.h * TILE_SIZE * engine.zoom) / dpr + 32
          : pt.y - 14;
        transformBubble.style.left = `${Math.round(
          Math.max(120, Math.min(rect.width - 120, pt.x))
        )}px`;
        transformBubble.style.top = `${Math.round(topPos)}px`;
        transformBubble.style.display = 'block';
        transformBubble.classList.remove('hidden');

        const titleEl = document.getElementById('transform-bubble-title');
        const badgeEl = document.getElementById(
          'transform-bubble-orient-badge'
        );
        if (titleEl) titleEl.textContent = selected.name;
        if (badgeEl) {
          const orient = selected.orientation || 'N';
          const orientLabels: Record<'N' | 'E' | 'S' | 'W', string> = {
            W: '⬅️ Hadap Kiri',
            E: '➡️ Hadap Kanan',
            S: '⬇️ Hadap Depan',
            N: '⬆️ Hadap Belakang',
          };
          badgeEl.textContent = orientLabels[orient as 'N' | 'E' | 'S' | 'W'] || orient;
        }
      } else {
        transformBubble.style.display = 'none';
        transformBubble.classList.add('hidden');
      }
    } else {
      transformBubble.style.display = 'none';
      transformBubble.classList.add('hidden');
    }
  }
