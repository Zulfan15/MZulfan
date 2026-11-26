import type { TownEngine } from '../TownEngine';
import { DIGI_GATE_PORTAL, TOWN_OFFSET_X } from '../map';
import { SKY_CASTLE_LANDMARKS } from '../skyCastleMap';
import { getSkyInteriorConfig, isSkyInteriorScene } from '../sky/skyInteriorsRegistry';
import { KINGDOM_LANDMARKS } from '../kingdomMap';
import { getKingdomInteriorConfig, isKingdomInteriorScene } from '../kingdom/kingdomInteriorsRegistry';
import { HARBOUR_LANDMARKS } from '../harbourMap';
import { getHarbourInteriorConfig, isHarbourInteriorScene } from '../harbour/harbourInteriorsRegistry';
import { DARK_CASTLE_LANDMARKS } from '../darkCastleMap';
import { CATHEDRAL_PROPS } from '../cathedralScene';
import { FORGE_PROPS } from '../forgeScene';
import { MANOR_PROPS } from '../manorScene';
import { VAULT_PROPS } from '../vaultScene';
import { townConfig } from '../townConfig';
import { DEV_PROPS } from '../devScene';
import { LAB_PROPS } from '../labScene';
import { ARCADE_PROPS } from '../arcadeScene';
import { RECEPTION_PROPS } from '../receptionScene';
import { MART_PROPS } from '../martScene';
import { TOWER_PROPS } from '../towerScene';
import { CAFE_PROPS } from '../cafeScene';
import { ARENA_PROPS } from '../arenaScene';
import { GARDEN_PROPS } from '../gardenScene';
import { NEIGHBOUR_PROPS } from '../neighbourScene';

export function walkToObjectHelper(engine: TownEngine, id: string): void {
    if (
      engine.currentScene === 'dark-cathedral' ||
      engine.currentScene === 'dark-forge' ||
      engine.currentScene === 'dark-manor' ||
      engine.currentScene === 'dark-vault' ||
      isKingdomInteriorScene(engine.currentScene) ||
      isHarbourInteriorScene(engine.currentScene) ||
      isSkyInteriorScene(engine.currentScene)
    ) {
      engine.pendingTarget = id;
      const kingdomCfg = getKingdomInteriorConfig(engine.currentScene);
      const harbourCfg = getHarbourInteriorConfig(engine.currentScene);
      const skyCfg = getSkyInteriorConfig(engine.currentScene);
      const propsList = kingdomCfg
        ? kingdomCfg.props
        : harbourCfg
          ? harbourCfg.props
          : skyCfg
            ? skyCfg.props
            : engine.currentScene === 'dark-cathedral'
            ? CATHEDRAL_PROPS
            : engine.currentScene === 'dark-forge'
              ? FORGE_PROPS
              : engine.currentScene === 'dark-manor'
                ? MANOR_PROPS
                : VAULT_PROPS;
      const prop = propsList.find((p) => p.id === id);
      if (prop) {
        const candidates = [
          { x: prop.x + Math.floor(prop.w / 2), y: prop.y + prop.h },
          { x: prop.x + Math.floor(prop.w / 2), y: prop.y - 1 },
          { x: prop.x - 1, y: prop.y + Math.floor(prop.h / 2) },
          { x: prop.x + prop.w, y: prop.y + Math.floor(prop.h / 2) },
        ];
        const valid = candidates.find((c) => engine.canWalk(c.x, c.y)) || { x: 7, y: 6 };
        engine.walkTo(valid.x, valid.y);
      }
      return;
    }

    if (engine.currentScene === 'tower') {
      engine.pendingTarget = id;
      switch (id) {
        case 'xurkitree':
        case 'porygon':
          engine.walkTo(7, 6);
          break;
        case 'robotics-bay':
          engine.walkTo(2, 5);
          break;
        case 'server-rack':
          engine.walkTo(12, 6);
          break;
        case 'career-terminal':
          engine.walkTo(2, 9);
          break;
        case 'elevator':
          engine.walkTo(9, 9);
          break;
        case 'lounge':
          engine.walkTo(12, 8);
          break;
        case 'exit':
          engine.walkTo(7, 11);
          break;
        default:
          const prop = TOWER_PROPS.find((p) => p.id === id);
          if (prop) engine.walkTo(prop.x, prop.y + prop.h);
          break;
      }
      return;
    }

    if (engine.currentScene === 'mart') {
      engine.pendingTarget = id;
      switch (id) {
        case 'clerk':
          engine.walkTo(6, 6);
          break;
        case 'meowth':
          engine.walkTo(7, 6);
          break;
        case 'services-shelf':
          engine.walkTo(2, 5);
          break;
        case 'tech-tms':
          engine.walkTo(11, 5);
          break;
        case 'potions-shelf':
          engine.walkTo(2, 6);
          break;
        case 'key-showcase':
          engine.walkTo(11, 6);
          break;
        case 'drink-cooler':
          engine.walkTo(12, 4);
          break;
        case 'exit':
          engine.walkTo(7, 11);
          break;
        default:
          const prop = MART_PROPS.find((p) => p.id === id);
          if (prop) engine.walkTo(prop.x, prop.y + prop.h);
          break;
      }
      return;
    }

    if (engine.currentScene === 'cafe') {
      engine.pendingTarget = id;
      switch (id) {
        case 'barista':
          engine.walkTo(6, 6);
          break;
        case 'alcremie':
          engine.walkTo(7, 6);
          break;
        case 'vinyl-jukebox':
          engine.walkTo(2, 5);
          break;
        case 'pastry-case':
          engine.walkTo(11, 5);
          break;
        case 'roast-board':
          engine.walkTo(2, 6);
          break;
        case 'vip-booth':
          engine.walkTo(11, 6);
          break;
        case 'craft-tap':
          engine.walkTo(12, 4);
          break;
        case 'exit':
          engine.walkTo(7, 11);
          break;
        default:
          const prop = CAFE_PROPS.find((p) => p.id === id);
          if (prop) engine.walkTo(prop.x, prop.y + prop.h);
          break;
      }
      return;
    }

    if (engine.currentScene === 'arena') {
      engine.pendingTarget = id;
      switch (id) {
        case 'mewtwo-boss':
          engine.walkTo(7, 3);
          break;
        case 'lucario-coach':
          engine.walkTo(3, 6);
          break;
        case 'referee-dan':
          engine.walkTo(11, 6);
          break;
        case 'battle-terminal':
          engine.walkTo(2, 5);
          break;
        case 'algorithm-dojo':
          engine.walkTo(12, 5);
          break;
        case 'trophy-vault':
          engine.walkTo(2, 7);
          break;
        case 'stat-radar':
          engine.walkTo(12, 7);
          break;
        case 'exit':
          engine.walkTo(7, 11);
          break;
        default:
          const prop = ARENA_PROPS.find((p) => p.id === id);
          if (prop) engine.walkTo(prop.x, prop.y + prop.h);
          break;
      }
      return;
    }

    if (engine.currentScene === 'garden') {
      engine.pendingTarget = id;
      switch (id) {
        case 'gardevoir':
        case 'botanist-flora':
          engine.walkTo(6, 4);
          break;
        case 'celebi':
        case 'shaymin-npc':
          engine.walkTo(8, 4);
          break;
        case 'plot-oran':
          engine.walkTo(2, 5);
          break;
        case 'plot-sitrus':
          engine.walkTo(12, 5);
          break;
        case 'watering-well':
          engine.walkTo(5, 6);
          break;
        case 'plot-cheri':
          engine.walkTo(2, 9);
          break;
        case 'berry-blender':
          engine.walkTo(12, 9);
          break;
        case 'exit':
          engine.walkTo(7, 11);
          break;
        default:
          const prop = GARDEN_PROPS.find((p) => p.id === id);
          if (prop) engine.walkTo(prop.x, prop.y + prop.h);
          break;
      }
      return;
    }

    if (engine.currentScene === 'neighbour') {
      engine.pendingTarget = id;
      switch (id) {
        case 'neighbour-maya':
          engine.walkTo(6, 4);
          break;
        case 'eevee-companion':
          engine.walkTo(8, 4);
          break;
        case 'guestbook-board':
          engine.walkTo(2, 5);
          break;
        case 'coop-table':
          engine.walkTo(12, 5);
          break;
        case 'fireplace-hearth':
          engine.walkTo(5, 6);
          break;
        case 'retro-console':
          engine.walkTo(2, 9);
          break;
        case 'mentorship-shelf':
          engine.walkTo(12, 9);
          break;
        case 'exit':
          engine.walkTo(7, 11);
          break;
        default:
          const prop = NEIGHBOUR_PROPS.find((p) => p.id === id);
          if (prop) engine.walkTo(prop.x, prop.y + prop.h);
          break;
      }
      return;
    }

    if (engine.currentScene === 'reception') {
      engine.pendingTarget = id;
      switch (id) {
        case 'mira':
          engine.walkTo(7, 5);
          break;
        case 'chansey':
          engine.walkTo(9, 5);
          break;
        case 'healing-machine':
          engine.walkTo(11, 4);
          break;
        case 'pc-terminal':
          engine.walkTo(13, 6);
          break;
        case 'directory-board':
          engine.walkTo(2, 4);
          break;
        case 'waiting-couch':
          engine.walkTo(4, 7);
          break;
        case 'exit':
          engine.walkTo(7, 11);
          break;
        default:
          const prop = RECEPTION_PROPS.find((p) => p.id === id);
          if (prop) engine.walkTo(prop.x, prop.y + prop.h);
          break;
      }
      return;
    }

    if (engine.currentScene === 'arcade') {
      engine.pendingTarget = id;
      switch (id) {
        case 'robot':
          engine.walkTo(9, 6);
          break;
        case 'scoreboard':
          engine.walkTo(13, 2);
          break;
        case 'exit':
          engine.walkTo(9, 13);
          break;
        default:
          const prop = ARCADE_PROPS.find((p) => p.id === id);
          if (prop) engine.walkTo(prop.x, prop.y + prop.h);
          break;
      }
      return;
    }

    if (engine.currentScene === 'lab') {
      engine.pendingTarget = id;
      switch (id) {
        case 'lab-posters':
          engine.walkTo(3, 2);
          break;
        case 'lab-whiteboard':
          engine.walkTo(8, 2);
          break;
        case 'lab-bench':
          engine.walkTo(6, 9);
          break;
        case 'hood':
          engine.walkTo(10, 4);
          break;
        case 'fridge':
          engine.walkTo(10, 9);
          break;
        case 'book-aeroscan':
          engine.walkTo(1, 12);
          break;
        case 'book-spam':
          engine.walkTo(2, 12);
          break;
        case 'book-omr':
          engine.walkTo(3, 12);
          break;
        case 'plant':
          engine.walkTo(10, 12);
          break;
        case 'pheromosa':
          engine.walkTo(9, 5);
          break;
        case 'exit':
          engine.walkTo(6, 14);
          break;
        default:
          const prop = LAB_PROPS.find((p) => p.id === id);
          if (prop) engine.walkTo(prop.x, prop.y + prop.h);
          break;
      }
      return;
    }

    if (engine.currentScene === 'dev') {
      engine.pendingTarget = id;
      switch (id) {
        case 'timeline':
          engine.walkTo(7, 3);
          break;
        case 'radar':
          engine.walkTo(2, 5);
          break;
        case 'telemetry':
          engine.walkTo(12, 6);
          break;
        case 'lebronette':
        case 'snorlax':
          engine.walkTo(7, 15);
          break;
        case 'eternatus':
          engine.walkTo(10, 11);
          break;
        case 'console-wasm':
          engine.walkTo(3, 9);
          break;
        case 'console-edge':
          engine.walkTo(7, 9);
          break;
        case 'console-static':
          engine.walkTo(11, 9);
          break;
        case 'whiteboard':
          engine.walkTo(2, 11);
          break;
        case 'rack':
          engine.walkTo(12, 11);
          break;
        case 'coffee':
          engine.walkTo(12, 14);
          break;
        case 'plant':
          engine.walkTo(2, 16);
          break;
        case 'exit':
          engine.walkTo(7, 18);
          break;
        default:
          const prop = DEV_PROPS.find((p) => p.id === id);
          if (prop) engine.walkTo(prop.x, prop.y + prop.h);
          break;
      }
      return;
    }

    if (engine.currentScene === 'home') {
      engine.pendingTarget = id;
      switch (id) {
        case 'shop-posters':
          engine.walkTo(2, 2);
          break;
        case 'shop-polaroids':
          engine.walkTo(9, 2);
          break;
        case 'stairs-up':
          engine.switchHomeFloor('2F');
          break;
        case 'shop-jukebox':
          engine.walkTo(2, 5);
          break;
        case 'shop-closet':
          engine.walkTo(10, 6);
          break;
        case 'crates':
          engine.walkTo(6, 7);
          break;
        case 'decks':
          engine.walkTo(6, 10);
          break;
        case 'mirror':
          engine.walkTo(12, 8);
          break;
        case 'counter':
          engine.walkTo(2, 10);
          break;
        case 'plant':
          engine.walkTo(12, 12);
          break;
        case 'motorbike':
          engine.walkTo(10, 13);
          break;
        case 'exit':
          engine.walkTo(7, 14);
          break;
        case 'home2f-fridge':
          engine.walkTo(2, 3);
          break;
        case 'home2f-tv':
          engine.walkTo(6, 3);
          break;
        case 'home2f-twin':
          engine.walkTo(6, 5);
          break;
        case 'home2f-computer':
          engine.walkTo(11, 8);
          break;
        case 'home2f-couch':
          engine.walkTo(5, 5);
          break;
        case 'home2f-coffee':
          engine.walkTo(9, 5);
          break;
        case 'home2f-palm':
          engine.walkTo(2, 10);
          break;
        case 'home2f-bamboo':
          engine.walkTo(12, 10);
          break;
        case 'home2f-stairs-down':
          engine.switchHomeFloor('1F');
          break;
      }
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

    let cfg = townConfig.getBuilding(id);
    if (!cfg && ALIAS_MAP[id]) {
      for (const alias of ALIAS_MAP[id]) {
        cfg = townConfig.getBuilding(alias);
        if (cfg) break;
      }
    }

    if (cfg && cfg.doorX !== undefined && cfg.doorY !== undefined) {
      if (engine.currentScene === 'kingdom' && cfg.kind === 'building') {
        const frontY = cfg.doorY + 1;
        engine.pendingTarget = id;
        if (engine.playerPos.x === cfg.doorX && engine.playerPos.y === frontY) {
          engine.playerDir = 'up';
          engine.interactFacing(id);
          engine.wake();
        } else {
          engine.walkTo(cfg.doorX, frontY);
        }
        return;
      }
      if (cfg.kind === 'building' && cfg.id !== 'arena') {
        engine.pendingTarget = null;
      } else {
        engine.pendingTarget = id;
      }
      engine.walkTo(cfg.doorX, cfg.doorY);
      return;
    }

    // Dynamic fallback for custom/moved objects in town layout
    if (cfg) {
      if (cfg.kind === 'building') {
        if (engine.currentScene === 'kingdom') {
          const destX = cfg.x + Math.floor(cfg.w / 2);
          const destY = cfg.y + cfg.h;
          engine.pendingTarget = id;
          if (engine.playerPos.x === destX && engine.playerPos.y === destY) {
            engine.playerDir = 'up';
            engine.interactFacing(id);
            engine.wake();
          } else {
            engine.walkTo(destX, destY);
          }
        } else {
          engine.pendingTarget = null;
          engine.walkTo(cfg.x + Math.floor(cfg.w / 2), cfg.y + cfg.h);
        }
      } else if (cfg.kind === 'npc') {
        engine.pendingTarget = id;
        engine.walkTo(cfg.x, cfg.y + 1);
      } else {
        const destX = cfg.x + Math.floor(cfg.w / 2);
        const destY = cfg.y + cfg.h;
        engine.pendingTarget = id;
        if (engine.playerPos.x === destX && engine.playerPos.y === destY) {
          engine.playerDir = 'up';
          engine.interactFacing(id);
          engine.wake();
        } else {
          engine.walkTo(destX, destY);
        }
      }
      return;
    }

    const ox = TOWN_OFFSET_X;
    const walkToBuildingDoor = (bid: string, fallbackX: number, fallbackY: number, pending: string | null = null) => {
      engine.pendingTarget = pending;
      const cfg = townConfig.getBuilding(bid);
      if (cfg && !cfg.hidden) {
        const dx = cfg.doorX !== undefined ? cfg.doorX : cfg.x + Math.floor(cfg.w / 2);
        const dy = cfg.doorY !== undefined ? cfg.doorY : cfg.y + cfg.h;
        engine.walkTo(dx, dy);
      } else {
        engine.walkTo(fallbackX, fallbackY);
      }
    };

    switch (id) {
      case 'home':
        walkToBuildingDoor('home', 37 + ox, 24);
        break;
      case 'dev':
        walkToBuildingDoor('dev', 16 + ox, 11);
        break;
      case 'lab':
        walkToBuildingDoor('lab', 27 + ox, 6);
        break;
      case 'villa':
      case 'neighbour':
        walkToBuildingDoor('villa', 27 + ox, 24);
        break;
      case 'arcade':
        walkToBuildingDoor('arcade', 27 + ox, 16);
        break;
      case 'reception':
        walkToBuildingDoor('reception', 38 + ox, 16);
        break;
      case 'office':
      case 'tower':
        walkToBuildingDoor('office', 39 + ox, 7);
        break;
      case 'shop':
      case 'mart':
      case 'depop':
        walkToBuildingDoor('shop', 39 + ox, 32);
        break;
      case 'statue':
        walkToBuildingDoor('basin', 16 + ox, 17, 'statue');
        break;
      case 'fountain':
        walkToBuildingDoor('fountain', 6 + ox, 56, 'fountain');
        break;
      case 'twin':
        walkToBuildingDoor('twin', 12 + ox, 23, 'twin');
        break;
      case 'reshiram':
        walkToBuildingDoor('reshiram', 18 + ox, 33, 'reshiram');
        break;
      case 'zekrom':
        walkToBuildingDoor('zekrom', 12 + ox, 33, 'zekrom');
        break;
      case 'giratina':
        walkToBuildingDoor('giratina', 18 + ox, 27, 'giratina');
        break;
      case 'palkia':
        walkToBuildingDoor('palkia', 18 + ox, 30, 'palkia');
        break;
      case 'dialga':
        walkToBuildingDoor('dialga', 12 + ox, 30, 'dialga');
        break;
      case 'charizard':
      case 'lebron':
        walkToBuildingDoor('charizard', 18 + ox, 24, 'charizard');
        break;
      case 'kiosk':
        walkToBuildingDoor('kiosk', 29 + ox, 32, 'kiosk');
        break;
      case 'linkedin':
        engine.pendingTarget = 'linkedin';
        engine.walkTo(36 + ox, 48);
        break;
      case 'resume':
        engine.pendingTarget = 'resume';
        engine.walkTo(40 + ox, 48);
        break;
      case 'github':
        engine.pendingTarget = 'github';
        engine.walkTo(36 + ox, 52);
        break;
      case 'email':
        engine.pendingTarget = 'email';
        engine.walkTo(40 + ox, 52);
        break;
      case 'lookout':
        walkToBuildingDoor('telescope', 3 + ox, 45, 'lookout');
        break;
      case 'arena': {
        engine.pendingTarget = 'arena';
        const arenaCfg = townConfig.getBuilding('arena');
        const targetX = arenaCfg ? arenaCfg.x + Math.floor(arenaCfg.w / 2) : 38 + ox;
        const targetY = arenaCfg ? arenaCfg.y + arenaCfg.h - 1 : 43;
        engine.walkTo(targetX, targetY);
        break;
      }
      case 'ace': {
        engine.pendingTarget = 'ace';
        const arenaCfg = townConfig.getBuilding('arena');
        const targetX = arenaCfg ? arenaCfg.x + Math.floor(arenaCfg.w / 2) - 1 : 18 + ox;
        const targetY = arenaCfg ? arenaCfg.y + 2 : 46;
        engine.walkTo(targetX, targetY);
        break;
      }
      case 'berry': {
        engine.pendingTarget = 'berry';
        const gardenCfg = townConfig.getBuilding('garden');
        const targetX = gardenCfg ? gardenCfg.x + Math.floor(gardenCfg.w / 2) : 28 + ox;
        const targetY = gardenCfg ? gardenCfg.y + gardenCfg.h : 44;
        engine.walkTo(targetX, targetY);
        break;
      }
      case 'contest': {
        engine.pendingTarget = 'contest';
        const cCfg = townConfig.getBuilding('contest');
        if (cCfg && !cCfg.hidden) {
          engine.walkTo(cCfg.x + 3, cCfg.y + 5);
        } else {
          engine.walkTo(28 + ox, 53);
        }
        break;
      }
      case 'ranger':
      case 'tyranitar':
      case 'blastoise':
        walkToBuildingDoor('ranger', 12 + ox, 47, 'ranger');
        break;
      case 'hobby':
        walkToBuildingDoor('gazebo', 8 + ox, 31, 'hobby');
        break;
      case 'digi-gate':
        engine.pendingTarget = null;
        engine.walkTo(DIGI_GATE_PORTAL.xMin + 1, DIGI_GATE_PORTAL.triggerY);
        break;
      case 'digi-return':
        engine.pendingTarget = null;
        engine.walkTo(20, 4);
        break;
      case 'digidex-console':
        engine.pendingTarget = 'digidex-console';
        engine.walkTo(20, 24);
        break;
      case 'kingdom-gate':
        engine.pendingTarget = null;
        engine.walkTo(20, 40);
        break;
      case 'kingdom-return':
        engine.pendingTarget = null;
        engine.walkTo(22, 4);
        break;
      case 'harbour-gate':
        engine.pendingTarget = null;
        engine.walkTo(22, 59);
        break;
      case 'harbour-return':
        engine.pendingTarget = null;
        engine.walkTo(22, 0);
        break;
      case 'dark-castle-gate':
        engine.pendingTarget = null;
        engine.walkTo(5, 22);
        break;
      case 'dark-castle-return':
        engine.pendingTarget = null;
        engine.walkTo(22, 8);
        break;
      case 'sky-castle-gate':
        engine.pendingTarget = null;
        engine.walkTo(36, 22);
        break;
      case 'sky-castle-return':
        engine.pendingTarget = null;
        engine.walkTo(22, 59);
        break;
      default: {
        if (engine.currentScene === 'kingdom') {
          const lm = KINGDOM_LANDMARKS.find((item) => item.id === id);
          if (lm) {
            engine.pendingTarget = lm.id;
            if (engine.playerPos.x === lm.interactX && engine.playerPos.y === lm.interactY) {
              engine.playerDir = 'up';
              engine.interactFacing(lm.id);
              engine.wake();
            } else {
              engine.walkTo(lm.interactX, lm.interactY);
            }
          }
        } else if (engine.currentScene === 'harbour') {
          const lm = HARBOUR_LANDMARKS.find((item) => item.id === id);
          if (lm) {
            engine.pendingTarget = lm.id;
            if (engine.playerPos.x === lm.interactX && engine.playerPos.y === lm.interactY) {
              engine.playerDir = 'up';
              engine.interactFacing(lm.id);
              engine.wake();
            } else {
              engine.walkTo(lm.interactX, lm.interactY);
            }
          }
        } else if (engine.currentScene === 'sky-castle') {
          const lm = SKY_CASTLE_LANDMARKS.find((item) => item.id === id);
          if (lm) {
            engine.pendingTarget = lm.id;
            if (engine.playerPos.x === lm.interactX && engine.playerPos.y === lm.interactY) {
              engine.playerDir = 'up';
              engine.interactFacing(lm.id);
              engine.wake();
            } else {
              engine.walkTo(lm.interactX, lm.interactY);
            }
          }
        } else if (engine.currentScene === 'dark-castle') {
          const lm = DARK_CASTLE_LANDMARKS.find((item) => item.id === id);
          if (lm) {
            engine.pendingTarget = lm.id;
            if (engine.playerPos.x === lm.interactX && engine.playerPos.y === lm.interactY) {
              engine.playerDir = 'up';
              engine.interactFacing(lm.id);
              engine.wake();
            } else {
              engine.walkTo(lm.interactX, lm.interactY);
            }
          }
        }
        break;
      }
    }
  }
