import type { BubbleAction, TownEngine } from '../TownEngine';
import { DIRS } from '../types';
import { DIGI_PLAZA_CONSOLE } from '../digiMap';
import { SKY_CASTLE_LANDMARKS } from '../skyCastleMap';
import { getSkyInteriorConfig } from '../sky/skyInteriorsRegistry';
import { triggerSkyWave } from '../sky/skySceneBase';
import { awakenSkyCrystal, countSkyPlumes } from '../skyInteriorShared';
import { KINGDOM_LANDMARKS } from '../kingdomMap';
import { getKingdomInteriorConfig, isKingdomInteriorScene } from '../kingdom/kingdomInteriorsRegistry';
import { triggerKingdomWave } from '../kingdom/kingdomSceneBase';
import { HARBOUR_LANDMARKS } from '../harbourMap';
import { getHarbourInteriorConfig } from '../harbour/harbourInteriorsRegistry';
import { triggerHarbourWave } from '../harbour/harbourSceneBase';
import { DARK_CASTLE_LANDMARKS } from '../darkCastleMap';
import { CATHEDRAL_PROPS, triggerCathedralEchoWave } from '../cathedralScene';
import { FORGE_PROPS } from '../forgeScene';
import { MANOR_PROPS, triggerManorShadowWave } from '../manorScene';
import { VAULT_PROPS, triggerVaultChronoWave } from '../vaultScene';
import { isAllSealsUnlocked } from '../darkInteriorShared';
import { awakenExcalibur, countRoyalCrests } from '../kingdomInteriorShared';
import { awakenVoyage, countMaritimeSeals } from '../harbourInteriorShared';
import { DIGIMON_CATALOG, getDigimonById } from '../digimonCatalog';
import { requestDigimonSprites } from '../digiSpriteLoader';
import { sfx } from '../../game/sfx';
import { gameStore } from '../../game/store';
import { townConfig, SPAWNABLE_TEMPLATES } from '../townConfig';
import { HOME_PROPS, HOME2F_PROPS } from '../homeScene';
import { DEV_PROPS } from '../devScene';
import { LAB_PROPS } from '../labScene';
import { ARCADE_PROPS } from '../arcadeScene';
import { RECEPTION_PROPS, triggerHealAnimation } from '../receptionScene';
import { MART_PROPS, triggerCashRegisterAnimation } from '../martScene';
import { TOWER_PROPS } from '../towerScene';
import { CAFE_PROPS, triggerCafeBrewAnimation } from '../cafeScene';
import { ARENA_PROPS, triggerArenaBattleAnimation } from '../arenaScene';
import { GARDEN_PROPS, triggerGardenHarvestAnimation } from '../gardenScene';
import { NEIGHBOUR_PROPS, triggerNeighbourAnimation } from '../neighbourScene';
import { findGhostAtTile } from '../ghostTrainers';
import {
  getFoundHiddenPokeballs,
  HIDDEN_POKEBALL_ITEMS,
  markHiddenPokeballFound,
  SUMMIT_VISTA_POINT,
} from '../world/townGeography';

export function triggerPendingTargetHelper(engine: TownEngine, id: string): void {
    switch (id) {
      case 'statue':
        engine.playerDir = 'up';
        engine.interactFacing('statue');
        break;
      case 'twin':
        engine.playerDir = 'up';
        engine.interactFacing('twin');
        break;
      case 'reshiram':
        engine.playerDir = 'left';
        engine.interactFacing('reshiram');
        break;
      case 'zekrom':
        engine.playerDir = 'left';
        engine.interactFacing('zekrom');
        break;
      case 'giratina':
        engine.playerDir = 'right';
        engine.interactFacing('giratina');
        break;
      case 'palkia':
        engine.playerDir = 'right';
        engine.interactFacing('palkia');
        break;
      case 'dialga':
        engine.playerDir = 'right';
        engine.interactFacing('dialga');
        break;
      case 'charizard':
      case 'lebron':
        engine.playerDir = 'down';
        engine.interactFacing('charizard');
        break;
      case 'rayquaza':
        engine.playerDir = 'left';
        engine.interactFacing('rayquaza');
        break;
      case 'arceus':
        engine.playerDir = 'up';
        engine.interactFacing('arceus');
        break;
      case 'garchomp':
        engine.playerDir = 'up';
        engine.interactFacing('garchomp');
        break;
      case 'urshifu':
      case 'urshifu_gmax':
        engine.playerDir = 'up';
        engine.interactFacing('urshifu');
        break;
      case 'samurott':
        engine.playerDir = 'up';
        engine.interactFacing('samurott');
        break;
      case 'mewtwo':
        engine.playerDir = 'up';
        engine.interactFacing('mewtwo');
        break;
      case 'kiosk':
      case 'cafe':
      case 'bar':
        engine.playerDir = 'up';
        engine.interactFacing('kiosk');
        break;
      case 'linkedin':
        engine.playerDir = 'up';
        engine.interactFacing('linkedin');
        break;
      case 'resume':
        engine.playerDir = 'up';
        engine.interactFacing('resume');
        break;
      case 'github':
        engine.playerDir = 'down';
        engine.interactFacing('github');
        break;
      case 'email':
        engine.playerDir = 'down';
        engine.interactFacing('email');
        break;
      case 'shop':
      case 'mart':
      case 'depop':
        engine.playerDir = 'up';
        engine.interactFacing('depop');
        break;
      case 'lookout':
        engine.playerDir = 'up';
        engine.interactFacing('lookout');
        break;
      case 'arena':
        engine.playerDir = 'up';
        engine.interactFacing('arena');
        break;
      case 'berry':
      case 'garden':
        engine.playerDir = 'up';
        engine.interactFacing('berry');
        break;
      case 'contest':
        engine.playerDir = 'up';
        engine.interactFacing('contest');
        break;
      case 'ranger':
      case 'tyranitar':
      case 'blastoise':
        engine.playerDir = 'up';
        engine.interactFacing('ranger');
        break;
      case 'hobby':
        engine.playerDir = 'up';
        engine.interactFacing('hobby');
        break;
      case 'ace':
        engine.playerDir = 'up';
        engine.interactFacing('ace');
        break;
      // Home 1F props
      case 'shop-posters':
        engine.playerDir = 'up';
        engine.interactFacing('shop-posters');
        break;
      case 'shop-polaroids':
        engine.playerDir = 'up';
        engine.interactFacing('shop-polaroids');
        break;
      case 'shop-jukebox':
        engine.playerDir = 'up';
        engine.interactFacing('shop-jukebox');
        break;
      case 'shop-closet':
        engine.playerDir = 'up';
        engine.interactFacing('shop-closet');
        break;
      case 'crates':
      case 'decks':
      case 'mirror':
      case 'counter':
      case 'plant':
      case 'motorbike':
        engine.interactFacing(id);
        break;
      case 'stairs-up':
        engine.switchHomeFloor('2F');
        break;
      // Home 2F props
      case 'home2f-fridge':
        engine.playerDir = 'left';
        engine.interactFacing('home2f-fridge');
        break;
      case 'home2f-tv':
        engine.playerDir = 'up';
        engine.interactFacing('home2f-tv');
        break;
      case 'home2f-twin':
      case 'home2f-couch':
        engine.playerDir = 'down';
        engine.interactFacing('home2f-twin');
        break;
      case 'home2f-computer':
        engine.playerDir = 'down';
        engine.interactFacing('home2f-computer');
        break;
      case 'home2f-coffee':
        engine.playerDir = 'up';
        engine.interactFacing('home2f-coffee');
        break;
      case 'home2f-palm':
        engine.playerDir = 'left';
        engine.interactFacing('home2f-palm');
        break;
      case 'home2f-bamboo':
        engine.playerDir = 'right';
        engine.interactFacing('home2f-bamboo');
        break;
      case 'home2f-stairs-down':
        engine.switchHomeFloor('1F');
        break;
      // Reception props
      case 'mira':
        engine.playerDir = 'up';
        engine.interactFacing('mira');
        break;
      case 'healing-machine':
        engine.playerDir = 'up';
        engine.interactFacing('healing-machine');
        break;
      case 'pc-terminal':
        engine.playerDir = 'up';
        engine.interactFacing('pc-terminal');
        break;
      case 'directory-board':
        engine.playerDir = 'up';
        engine.interactFacing('directory-board');
        break;
      case 'waiting-couch':
        engine.playerDir = 'left';
        engine.interactFacing('waiting-couch');
        break;
      // Tech Tower props
      case 'xurkitree':
      case 'porygon':
        engine.playerDir = 'up';
        engine.interactFacing('xurkitree');
        break;
      case 'robotics-bay':
        engine.playerDir = 'up';
        engine.interactFacing('robotics-bay');
        break;
      case 'server-rack':
        engine.playerDir = 'up';
        engine.interactFacing('server-rack');
        break;
      case 'career-terminal':
        engine.playerDir = 'up';
        engine.interactFacing('career-terminal');
        break;
      case 'elevator':
        engine.playerDir = 'up';
        engine.interactFacing('elevator');
        break;
      case 'lounge':
        engine.playerDir = 'right';
        engine.interactFacing('lounge');
        break;
      // Poké Mart props
      case 'clerk':
        engine.playerDir = 'up';
        engine.interactFacing('clerk');
        break;
      case 'meowth':
        engine.playerDir = 'up';
        engine.interactFacing('meowth');
        break;
      case 'services-shelf':
        engine.playerDir = 'up';
        engine.interactFacing('services-shelf');
        break;
      case 'tech-tms':
        engine.playerDir = 'up';
        engine.interactFacing('tech-tms');
        break;
      case 'potions-shelf':
        engine.playerDir = 'up';
        engine.interactFacing('potions-shelf');
        break;
      case 'key-showcase':
        engine.playerDir = 'up';
        engine.interactFacing('key-showcase');
        break;
      case 'drink-cooler':
        engine.playerDir = 'right';
        engine.interactFacing('drink-cooler');
        break;
      // Poké-Café & Bar props
      case 'barista':
        engine.playerDir = 'up';
        engine.interactFacing('barista');
        break;
      case 'alcremie':
        engine.playerDir = 'up';
        engine.interactFacing('alcremie');
        break;
      case 'vinyl-jukebox':
        engine.playerDir = 'up';
        engine.interactFacing('vinyl-jukebox');
        break;
      case 'pastry-case':
        engine.playerDir = 'up';
        engine.interactFacing('pastry-case');
        break;
      case 'roast-board':
        engine.playerDir = 'up';
        engine.interactFacing('roast-board');
        break;
      case 'vip-booth':
        engine.playerDir = 'up';
        engine.interactFacing('vip-booth');
        break;
      case 'craft-tap':
        engine.playerDir = 'right';
        engine.interactFacing('craft-tap');
        break;
      // Gladiator Colosseum props
      case 'mewtwo-boss':
      case 'battle-terminal':
      case 'algorithm-dojo':
        engine.playerDir = 'up';
        engine.interactFacing(id);
        break;
      case 'lucario-coach':
        engine.playerDir = 'left';
        engine.interactFacing(id);
        break;
      case 'referee-dan':
        engine.playerDir = 'right';
        engine.interactFacing(id);
        break;
      case 'trophy-vault':
      case 'stat-radar':
        engine.playerDir = 'down';
        engine.interactFacing(id);
        break;
      // Botanical Berry Garden props
      case 'gardevoir':
      case 'celebi':
      case 'botanist-flora':
      case 'shaymin-npc':
      case 'plot-oran':
      case 'plot-sitrus':
      case 'plot-cheri':
      case 'berry-blender':
        engine.playerDir = 'up';
        engine.interactFacing(id);
        break;
      case 'watering-well':
        engine.playerDir = 'left';
        engine.interactFacing(id);
        break;
      // Research Lab props
      case 'pheromosa':
        engine.playerDir = 'up';
        engine.interactFacing('pheromosa');
        break;
      // Dev Center props
      case 'eternatus':
        engine.playerDir = 'right';
        engine.interactFacing('eternatus');
        break;
      case 'snorlax':
      case 'lebronette':
        engine.playerDir = 'up';
        engine.interactFacing('snorlax');
        break;
      case 'coffee':
        engine.playerDir = 'right';
        engine.interactFacing('coffee');
        break;
      case 'rack':
        engine.playerDir = 'right';
        engine.interactFacing('rack');
        break;
      case 'whiteboard':
        engine.playerDir = 'left';
        engine.interactFacing('whiteboard');
        break;
      case 'console-wasm':
      case 'console-edge':
      case 'console-static':
      case 'telemetry':
      case 'radar':
      case 'timeline':
      case 'digidex-console':
        engine.playerDir = 'up';
        engine.interactFacing(id);
        break;
      default:
        engine.interactFacing(id);
        break;
    }
  }

export function interactFacingHelper(engine: TownEngine, targetId?: string): void {
    const activeTarget = targetId || engine.pendingTarget;
    const activeKingdomInterior = getKingdomInteriorConfig(engine.currentScene);
    if (activeKingdomInterior) {
      const fx = engine.playerPos.x + (engine.playerDir === 'right' ? 1 : engine.playerDir === 'left' ? -1 : 0);
      const fy = engine.playerPos.y + (engine.playerDir === 'down' ? 1 : engine.playerDir === 'up' ? -1 : 0);
      const prop =
        activeKingdomInterior.props.find((p) => p.id === activeTarget) ||
        activeKingdomInterior.props.find((p) => fx >= p.x && fx < p.x + p.w && fy >= p.y && fy < p.y + p.h);

      if (prop) {
        sfx.select();
        triggerKingdomWave(activeKingdomInterior.id, prop.label.toUpperCase(), activeKingdomInterior.waveColor);
        const desc =
          prop.hint ||
          (prop.target.type === 'note' ? prop.target.text : `Interacted with ${prop.label}.`);
        if (engine.callbacks.onBubble) {
          engine.callbacks.onBubble(prop.label, desc, [
            {
              label: `${activeKingdomInterior.icon} Open Sanctum Section`,
              onClick: () => {
                const target = document.getElementById(prop.scrollTarget || 'content');
                target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              },
            },
          ]);
        } else {
          engine.callbacks.onDialogue(prop.label, [desc]);
        }
        engine.pendingTarget = null;
        engine.wake();
      }
      return;
    }

    const activeHarbourInterior = getHarbourInteriorConfig(engine.currentScene);
    if (activeHarbourInterior) {
      const fx = engine.playerPos.x + (engine.playerDir === 'right' ? 1 : engine.playerDir === 'left' ? -1 : 0);
      const fy = engine.playerPos.y + (engine.playerDir === 'down' ? 1 : engine.playerDir === 'up' ? -1 : 0);
      const prop =
        activeHarbourInterior.props.find((p) => p.id === activeTarget) ||
        activeHarbourInterior.props.find((p) => fx >= p.x && fx < p.x + p.w && fy >= p.y && fy < p.y + p.h);

      if (prop) {
        sfx.select();
        triggerHarbourWave(activeHarbourInterior.id, prop.label.toUpperCase(), activeHarbourInterior.waveColor);
        const desc =
          prop.hint ||
          (prop.target.type === 'note' ? prop.target.text : `Interacted with ${prop.label}.`);
        if (engine.callbacks.onBubble) {
          engine.callbacks.onBubble(prop.label, desc, [
            {
              label: `${activeHarbourInterior.icon} Open Sanctum Section`,
              onClick: () => {
                const target = document.getElementById(prop.scrollTarget || 'content');
                target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              },
            },
          ]);
        } else {
          engine.callbacks.onDialogue(prop.label, [desc]);
        }
        engine.pendingTarget = null;
        engine.wake();
      }
      return;
    }

    const activeSkyInterior = getSkyInteriorConfig(engine.currentScene);
    if (activeSkyInterior) {
      const fx = engine.playerPos.x + (engine.playerDir === 'right' ? 1 : engine.playerDir === 'left' ? -1 : 0);
      const fy = engine.playerPos.y + (engine.playerDir === 'down' ? 1 : engine.playerDir === 'up' ? -1 : 0);
      const prop =
        activeSkyInterior.props.find((p) => p.id === activeTarget) ||
        activeSkyInterior.props.find((p) => fx >= p.x && fx < p.x + p.w && fy >= p.y && fy < p.y + p.h);

      if (prop) {
        sfx.select();
        triggerSkyWave(activeSkyInterior.id, prop.label.toUpperCase(), activeSkyInterior.waveColor);
        const desc =
          prop.hint ||
          (prop.target.type === 'note' ? prop.target.text : `Interacted with ${prop.label}.`);
        if (engine.callbacks.onBubble) {
          engine.callbacks.onBubble(prop.label, desc, [
            {
              label: `${activeSkyInterior.icon} Open Sanctum Section`,
              onClick: () => {
                const target = document.getElementById(prop.scrollTarget || 'content');
                target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              },
            },
          ]);
        } else {
          engine.callbacks.onDialogue(prop.label, [desc]);
        }
        engine.pendingTarget = null;
        engine.wake();
      }
      return;
    }

    if (
      engine.currentScene === 'dark-cathedral' ||
      engine.currentScene === 'dark-forge' ||
      engine.currentScene === 'dark-manor' ||
      engine.currentScene === 'dark-vault' ||
      isKingdomInteriorScene(engine.currentScene)
    ) {
      const propsList =
        engine.currentScene === 'dark-cathedral'
          ? CATHEDRAL_PROPS
          : engine.currentScene === 'dark-forge'
            ? FORGE_PROPS
            : engine.currentScene === 'dark-manor'
              ? MANOR_PROPS
              : VAULT_PROPS;

      const fx = engine.playerPos.x + (engine.playerDir === 'right' ? 1 : engine.playerDir === 'left' ? -1 : 0);
      const fy = engine.playerPos.y + (engine.playerDir === 'down' ? 1 : engine.playerDir === 'up' ? -1 : 0);

      const prop =
        propsList.find((p) => p.id === activeTarget) ||
        propsList.find((p) => fx >= p.x && fx < p.x + p.w && fy >= p.y && fy < p.y + p.h);

      if (prop) {
        sfx.select();
        const actionMap: Record<string, { title: string; desc: string; buttonLabel: string; scrollTarget: string }> = {
          lunala: {
            title: '🌙 Lunala · Choir Matriarch',
            desc: '"Through moonlight harmonics, chaotic production logs sing in order. Synchronize all 3 rounds on the Grand Echo Organ to claim the Seal of Echoes!"',
            buttonLabel: '🎹 Play Echo Organ',
            scrollTarget: 'cathedral-echo-puzzle',
          },
          'pipe-organ': {
            title: '🎹 Grand Echoes Pipe Organ',
            desc: 'Resonant golden organ pipes tuned to four harmonic WebAudio frequencies (C4 · E4 · G4 · C5). Reproduce 3 sequences to earn the Seal of Echoes!',
            buttonLabel: '🎵 Play Echo Organ',
            scrollTarget: 'cathedral-echo-puzzle',
          },
          'stained-rose': {
            title: '🔮 Harmonic Rose Resonance Altar',
            desc: 'The luminous heart of the Sunken Choir Nave. Glows violet and gold when all four organ tones synchronize.',
            buttonLabel: '✨ Inspect Echo Puzzle',
            scrollTarget: 'cathedral-echo-puzzle',
          },
          necrozma: {
            title: '💠 Prism Necrozma · Nocturne Keeper',
            desc: '"Listen closely through the prism to the four celestial organ tones and mirror every sequence faithfully!"',
            buttonLabel: '🎵 Challenge Necrozma',
            scrollTarget: 'cathedral-echo-puzzle',
          },
          gardevoir: {
            title: '✨ Cantor Gardevoir · Keeper of Lore',
            desc: '"I chronicle Zulfan’s deepest production war stories in The Obsidian Grimoire—from Redis stampedes to OpenCV frame leaks."',
            buttonLabel: '📖 Read Grimoire',
            scrollTarget: 'cathedral-grimoire',
          },
          'war-stories-grimoire': {
            title: '📖 The Obsidian Grimoire (NW)',
            desc: 'Illuminated manuscript recording 4 battlefield software engineering rescues and architecture transformations.',
            buttonLabel: '📖 Open Grimoire',
            scrollTarget: 'cathedral-grimoire',
          },
          'confession-shrine': {
            title: '🕯️ Spirit Cleanse & Confession Shrine (NE)',
            desc: 'Cleanse cognitive stack traces and bestow a +50% speed blessing inside the Cathedral Relic Coffer!',
            buttonLabel: '🕯️ Open Spirit Shrine',
            scrollTarget: 'cathedral-relic-section',
          },
          'east-pews': {
            title: '🔔 Brass Cathedral Chimes (SE)',
            desc: 'Tuned cathedral chimes protecting the WebAudio Synthesis Blueprint and Dark Castle Seal Tracker.',
            buttonLabel: '🟣 Open Relic Coffer',
            scrollTarget: 'cathedral-relic-section',
          },
          'magma-core': {
            title: '🌋 Crimson Geothermal Reactor Core',
            desc: 'Overclocked dark-matter turbines threaten to melt the east ward. Balance all 3 valve sliders between 95%–100% for 5 seconds to claim the Seal of Ember!',
            buttonLabel: '⚡ Stabilize Reactor',
            scrollTarget: 'forge-reactor-game',
          },
          'tech-anvil': {
            title: '🔨 The Tech Stack Anvil (NW)',
            desc: 'Combine Core Engines and Target Realms to forge production architecture blueprints, latency budgets, and trade-offs.',
            buttonLabel: '🔨 Open Tech Anvil',
            scrollTarget: 'forge-tech-anvil',
          },
          machinedramon: {
            title: '🤖 Machinedramon · Forge Master',
            desc: '"SYSTEM ALERT: Geothermal pressure critical! Balance Coolant Flush, Magnetic Confinement, and Dampening Rods inside 95–100% Optimal Zone!"',
            buttonLabel: '⚡ Stabilize Core',
            scrollTarget: 'forge-reactor-game',
          },
          'telemetry-terminal': {
            title: '📊 Reactor Telemetry Console (NE)',
            desc: 'Streams live thermal flux waveforms, throughput ceilings, and forged memory latency budgets.',
            buttonLabel: '🔨 Forge Blueprint',
            scrollTarget: 'forge-tech-anvil',
          },
          charizard: {
            title: '🔥 Charizard · Smelting Ignition',
            desc: '"GRAAAH! Keep the blast furnace blazing hot—strike raw Rust & TensorRT code on the NW Tech Anvil!"',
            buttonLabel: '🔨 Ignite Anvil',
            scrollTarget: 'forge-tech-anvil',
          },
          groudon: {
            title: '🌋 Groudon · Tectonic Core Warden',
            desc: '"THE MAGMA PLATES RUMBLE! Channel geothermal output cleanly or summon +50% Overdrive Speed from the SE Relic Coffer."',
            buttonLabel: '🔋 Inspect Coffer',
            scrollTarget: 'forge-relic-section',
          },
          'forge-altar': {
            title: '⚙️ Chaos Turbine Core Pedestal',
            desc: 'Levitating geothermal gyroscope synchronizing every conduit across the Crimson Reactor Forge.',
            buttonLabel: '⚡ Tune Reactor',
            scrollTarget: 'forge-reactor-game',
          },
          'coolant-valves': {
            title: '❄️ Liquid Nitrogen Cryo Valves (SW)',
            desc: 'High-pressure cryogenic conduits feeding sub-zero coolant straight to the magma chamber.',
            buttonLabel: '⚡ Tune Coolants',
            scrollTarget: 'forge-reactor-game',
          },
          'plasma-batteries': {
            title: '🔋 Plasma Capacitor Vault & Coffer (SE)',
            desc: 'Activate +50% Geothermal Overdrive Sprint, unlock the Edge TensorRT Blueprint, and track your 4 Abyssal Seals.',
            buttonLabel: '🔋 Open Relic Coffer',
            scrollTarget: 'forge-relic-section',
          },
          'darkrai-throne': {
            title: '👑 Obsidian Nightmare Throne',
            desc: 'Darkrai awaits a challenger brave enough to resolve production system crises in tactical debugging combat.',
            buttonLabel: '⚔️ Start Shadow Trial',
            scrollTarget: 'manor-shadow-duel',
          },
          darkrai: {
            title: '🌑 Darkrai · Sovereign of Nightmares',
            desc: '"Show me your engineering resolve! Counter distributed locks, memory leaks, TensorRT bottlenecks, and cache stampedes to claim the Seal of Valor!"',
            buttonLabel: '⚔️ Duel Darkrai',
            scrollTarget: 'manor-shadow-duel',
          },
          giratina: {
            title: '🐉 Giratina · Distortion Rift Arbiter',
            desc: '"Through the Distortion World I witness every sub-pixel glitch and cache cascade. Inspect the Cursed Bug Gallery to purify the code!"',
            buttonLabel: '🖼️ View Bug Gallery',
            scrollTarget: 'manor-bug-gallery',
          },
          urshifu: {
            title: '🥋 Urshifu · Manor Sentinel of Valor',
            desc: '"Hmph! Channel Wicked Blow focus or claim my Valor Ward in the Relic Coffer to gain +50% movement speed across all Dark Castle wards!"',
            buttonLabel: '🥋 Open Relic Coffer',
            scrollTarget: 'manor-relic-section',
          },
          'crimson-altar': {
            title: '⚔️ Sunken Arena Duel Altar',
            desc: 'Crossed crimson blades consecrated for tactical system-design trials against Darkrai.',
            buttonLabel: '⚔️ Enter Duel',
            scrollTarget: 'manor-shadow-duel',
          },
          'bug-gallery-1': {
            title: '🖼️ Gallery of Cursed Bugs (NW)',
            desc: 'Exhibit I: The Floating-Point Phantom & Cache Stampede Hydra—complete with Cursed vs. Pure Code inspections.',
            buttonLabel: '🖼️ Inspect Exhibits',
            scrollTarget: 'manor-bug-gallery',
          },
          'bug-gallery-2': {
            title: '🖼️ The Render Ouroboros Exhibit (NE)',
            desc: 'Exhibit II: Unconditional 60fps render loops and zombie DOM listener leaks, fixed with Wake-on-Demand Governors.',
            buttonLabel: '🖼️ Inspect Code Diff',
            scrollTarget: 'manor-bug-gallery',
          },
          'blood-fireplace': {
            title: '🔥 Crimson Abyssal Hearth (SW)',
            desc: 'Spectral blue-crimson flames crackle softly beside the sanctuary hearth, restoring resolve for night debugging.',
            buttonLabel: '⚔️ Resume Shadow Duel',
            scrollTarget: 'manor-shadow-duel',
          },
          'demon-crenellations': {
            title: '🦇 Winged Gargoyle & Valor Safe (SE)',
            desc: 'A perched obsidian gargoyle guarding Darkrai’s Production Incident Runbook inside the sealed Valor vault.',
            buttonLabel: '🩸 Inspect Valor Relics',
            scrollTarget: 'manor-relic-section',
          },
          'clockwork-face': {
            title: '⏳ Grand Astronomical Chronometer',
            desc: 'Four interlocking brass gears bind this sapphire sanctum. Align all four to 12:00 to shatter the chains and earn the Seal of Eternity!',
            buttonLabel: '⚙️ Align Clockwork Gears',
            scrollTarget: 'vault-clockwork-section',
          },
          dialga: {
            title: '💎 Dialga · Sovereign of Time',
            desc: '"Temporal threads weave past launches into future systems. Align the four brass gears to unlock my Adamant Coffer, or explore the Time-Machine!"',
            buttonLabel: '⚙️ Synchronize Gears',
            scrollTarget: 'vault-clockwork-section',
          },
          celebi: {
            title: '🌿 Celebi · Time-Travel Envoy',
            desc: '"Bii! I drifted across the Forest of Time straight into the Grand Horologium! Step through Zulfan’s 4 Engineering Epochs with me!"',
            buttonLabel: '🕰️ Open Time-Machine',
            scrollTarget: 'vault-chronology-section',
          },
          chronomon: {
            title: '🕰️ Chronomon DM · Sovereign Time-Keeper',
            desc: '"Every epoch inside this vault is verified—from Huawei CyberSec & YOLOv11 Edge AI to custom 60 FPS TypeScript engines!"',
            buttonLabel: '🕰️ Inspect Chronology',
            scrollTarget: 'vault-chronology-section',
          },
          'time-capsule': {
            title: '🕰️ Celestial Orrery & Epoch Time-Capsule',
            desc: 'The glowing heart of the Sunken Astrolabe Pit, chronicling Muhammad Zulfan’s engineering eras across software, CV robotics, and 2D game worlds.',
            buttonLabel: '📜 Open Time-Capsule',
            scrollTarget: 'vault-chronology-section',
          },
          'gear-pedestal-1': {
            title: '⚙️ I. NW Sun-Gear Brass Foundry',
            desc: 'Steam-driven outer bronze ring that advances Gear I (+3h) and drives Gear II (+3h) in unison.',
            buttonLabel: '⚙️ Turn Sun Gear',
            scrollTarget: 'vault-clockwork-section',
          },
          'gear-pedestal-2': {
            title: '⏱️ II. NE Escapement Crystal Loom',
            desc: 'Synchronizes Escapement crystal oscillators cleanly across the orthogonal vault channels toward 12:00.',
            buttonLabel: '⚙️ Turn Escapement',
            scrollTarget: 'vault-clockwork-section',
          },
          'chrono-pendulum': {
            title: '🔔 SW Chronicle Library & Horologe',
            desc: 'Swings in sub-millisecond precision beside bound engineering journals, keeping temporal drift below 0.001ms.',
            buttonLabel: '📜 View Archives',
            scrollTarget: 'vault-chronology-section',
          },
          'temporal-coffer': {
            title: '🔐 SE Imperial Adamant Vault Safe',
            desc: 'Sealed by the 4-Gear Clockwork Lock. Unlock the Seal of Eternity to inspect Zulfan’s 2D Canvas Engine Blueprint & Time Relics!',
            buttonLabel: '🔓 Open Coffer',
            scrollTarget: 'vault-artifact-section',
          },
        };

        const item = actionMap[prop.id];
        if (engine.currentScene === 'dark-vault') {
          const waveColor =
            prop.id === 'celebi' ? '#34d399' : prop.id === 'clockwork-face' || prop.id === 'dialga' ? '#38bdf8' : '#fbbf24';
          triggerVaultChronoWave(
            prop.id === 'dialga'
              ? 'ROAR OF TIME!'
              : prop.id === 'celebi'
                ? 'TIME TRAVEL RIPPLE!'
                : 'CHRONO RESONANCE!',
            waveColor
          );
        } else if (engine.currentScene === 'dark-manor') {
          const waveColor =
            prop.id === 'giratina' ? '#a855f7' : prop.id === 'urshifu' ? '#fde047' : '#ef4444';
          triggerManorShadowWave(
            prop.id === 'darkrai'
              ? 'DARK VOID CHALLENGE!'
              : prop.id === 'giratina'
                ? 'SHADOW FORCE RIFT!'
                : prop.id === 'urshifu'
                  ? 'WICKED VALOR WARD!'
                  : 'VALOR RESONANCE!',
            waveColor
          );
        } else if (engine.currentScene === 'dark-cathedral') {
          const waveColor =
            prop.id === 'lunala' ? '#fde047' : prop.id === 'confession-shrine' ? '#38bdf8' : '#c084fc';
          triggerCathedralEchoWave(
            prop.id === 'lunala'
              ? 'MOONGEIST ECHO!'
              : prop.id === 'pipe-organ'
                ? 'HARMONIC CHORD!'
                : prop.id === 'confession-shrine'
                  ? 'SPIRIT CLEANSED!'
                  : 'ECHO RESONANCE!',
            waveColor
          );
        }
        if (item && engine.callbacks.onBubble) {
          engine.callbacks.onBubble(item.title, item.desc, [
            {
              label: item.buttonLabel,
              onClick: () => {
                const el = document.getElementById(item.scrollTarget);
                el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              },
            },
          ]);
        }
        engine.wake();
        return;
      }
    }

    if (engine.currentScene === 'tower') {
      const fx = engine.playerPos.x + DIRS[engine.playerDir].x;
      const fy = engine.playerPos.y + DIRS[engine.playerDir].y;
      const prop =
        (activeTarget ? TOWER_PROPS.find((p) => p.id === activeTarget) : undefined) ||
        TOWER_PROPS.find(
          (p) =>
            (fx >= p.x && fx < p.x + p.w && fy >= p.y && fy < p.y + p.h) ||
            (engine.playerPos.x >= p.x - 1 &&
              engine.playerPos.x <= p.x + p.w &&
              engine.playerPos.y >= p.y - 1 &&
              engine.playerPos.y <= p.y + p.h)
        );

      if (prop) {
        sfx.select();
        if (prop.id === 'lounge') {
          window.dispatchEvent(new CustomEvent('town:highlight-department', { detail: { id: 'lounge', floor: '4F' } }));
          if (engine.callbacks.onBubble) {
            engine.callbacks.onBubble(
              'Executive Sky Lounge Barista ☕',
              'A cozy artisan coffee lounge where engineers and lab assistants recharge! Select your handcrafted beverage:',
              [
                {
                  label: '☕ West Java Arabica Pour-Over (+50% Speed)',
                  onClick: () => {
                    engine.activateCoffeeBoost();
                  },
                },
                {
                  label: '⚡ ITENAS Nitro Cold Brew (+80% Turbo Speed)',
                  onClick: () => {
                    engine.activateCoffeeBoost(15000);
                    sfx.confirm();
                  },
                },
                {
                  label: '🍵 Uji Matcha Focus (Engineering Trivia)',
                  onClick: () => {
                    sfx.heal();
                    if (engine.callbacks.onBubble) {
                      engine.callbacks.onBubble(
                        'Matcha Focus · Engineering Milestone 🍵',
                        'Muhammad Zulfan graduated with a 3.49/4.00 GPA from ITENAS Bandung, coordinated the Robotics Laboratory, and earned Bronze at the National IDEA FEST 3 for smart embedded system design!'
                      );
                    }
                  },
                },
              ]
            );
          } else {
            engine.activateCoffeeBoost();
          }
        } else if (prop.target.type === 'event' && prop.target.name) {
          if (prop.target.name === 'xurkitree' || prop.target.name === 'porygon') {
            engine.setTowerFloor('1F');
            window.dispatchEvent(new CustomEvent('town:highlight-department', { detail: { id: 'xurkitree', floor: '1F' } }));
            if (engine.callbacks.onBubble) {
              engine.callbacks.onBubble(
                'Xurkitree AI Host ⚡ (UB-03 Lighting)',
                '⚡ BZZZZT-KZZT! Welcome to Tech Tower HQ! I am Xurkitree, the high-voltage AI Host managing Muhammad Zulfan\'s robotics research, high-security cloud NOC, and enterprise engineering track record. Which floor would you like to visit?',
                [
                  {
                    label: '🛗 Call Executive Elevator',
                    onClick: () => {
                      engine.openElevatorMenu();
                    },
                  },
                  {
                    label: '🤖 Visit Robotics Bay (2F)',
                    onClick: () => {
                      engine.setTowerFloor('2F');
                      engine.walkToObject('robotics-bay');
                    },
                  },
                  {
                    label: '🔒 Check Cloud & Security NOC (3F)',
                    onClick: () => {
                      engine.setTowerFloor('3F');
                      engine.walkToObject('server-rack');
                    },
                  },
                  {
                    label: '💼 Experience & Mentorship Kiosk (4F)',
                    onClick: () => {
                      engine.setTowerFloor('4F');
                      engine.walkToObject('career-terminal');
                    },
                  },
                ]
              );
            } else {
              engine.callbacks.onDialogue('Xurkitree AI Host ⚡', [
                '⚡ BZZZT-KZZT! Welcome to Tech Tower! This 4-story facility is Muhammad Zulfan\'s research hub for robotics, cloud infrastructure, and distributed AI.',
                'Use the Executive Elevator to explore floors 1F through 4F!',
              ]);
            }
          } else if (prop.target.name === 'robotics-bay') {
            engine.setTowerFloor('2F');
            window.dispatchEvent(new CustomEvent('town:highlight-department', { detail: { id: 'robotics-bay', floor: '2F' } }));
            if (engine.callbacks.onBubble) {
              engine.callbacks.onBubble(
                'Robotics & IoT Lab Bay 🤖 (2F)',
                'Hardware & IoT Research Facility: Track record as ITENAS Robotics Laboratory Coordinator (kinematics curriculum, multimodal sensors, microcontrollers) and the ESP32 Remote Control Tank prototype with live web telemetry.',
                [
                  {
                    label: '🎮 Launch ESP32 RC Tank Testbench',
                    onClick: () => {
                      window.dispatchEvent(new CustomEvent('tower:open-tank-sandbox'));
                    },
                  },
                  {
                    label: '📜 View 2F Robotics & RC Tank Details',
                    onClick: () => {
                      window.dispatchEvent(new CustomEvent('town:focus-department', { detail: { floor: '2F', propId: 'robotics-bay' } }));
                    },
                  },
                  {
                    label: '🛗 Switch Floor',
                    onClick: () => {
                      engine.openElevatorMenu();
                    },
                  },
                ]
              );
            }
          } else if (prop.target.name === 'server-rack') {
            engine.setTowerFloor('3F');
            window.dispatchEvent(new CustomEvent('town:highlight-department', { detail: { id: 'server-rack', floor: '3F' } }));
            if (engine.callbacks.onBubble) {
              engine.callbacks.onBubble(
                'Cloud & Network NOC 🖧 (3F)',
                'Network Operations Center & Security: Internationally certified in Huawei HCIA-Security V4.0 (Firewall policies, IPSec VPN, NAT traversal) & high-concurrency cloud architecture (Apache Kafka, Redis Lua Mutexes, Kubernetes).',
                [
                  {
                    label: '🛡️ Launch Huawei Firewall & NOC Monitor',
                    onClick: () => {
                      window.dispatchEvent(new CustomEvent('tower:open-noc-sandbox'));
                    },
                  },
                  {
                    label: '🔒 View 3F Security & Topology Details',
                    onClick: () => {
                      window.dispatchEvent(new CustomEvent('town:focus-department', { detail: { floor: '3F', propId: 'server-rack' } }));
                    },
                  },
                  {
                    label: '🛗 Switch Floor',
                    onClick: () => {
                      engine.openElevatorMenu();
                    },
                  },
                ]
              );
            }
          } else if (prop.target.name === 'career-terminal') {
            engine.setTowerFloor('4F');
            window.dispatchEvent(new CustomEvent('town:highlight-department', { detail: { id: 'career-terminal', floor: '4F' } }));
            if (engine.callbacks.onBubble) {
              engine.callbacks.onBubble(
                'Experience & Mentorship Terminal 💼 (4F)',
                'Professional Career Kiosk: 6x ITENAS Laboratory Assistant (Robotics, IoT, Computer Networks, OOP Java, SQL Database), Software Development Intern at PT Dwi Purwa Teknologi, and Bronze Medalist at IDEA FEST 3.',
                [
                  {
                    label: '🎓 Launch 6x Lab Assistant & Career Kiosk',
                    onClick: () => {
                      window.dispatchEvent(new CustomEvent('tower:open-career-kiosk'));
                    },
                  },
                  {
                    label: '🎓 Open 4F Career Track Record & CV',
                    onClick: () => {
                      window.dispatchEvent(new CustomEvent('town:focus-department', { detail: { floor: '4F', propId: 'career-terminal' } }));
                    },
                  },
                  {
                    label: '🛗 Switch Floor',
                    onClick: () => {
                      engine.openElevatorMenu();
                    },
                  },
                ]
              );
            }
          } else if (prop.target.name === 'elevator') {
            engine.openElevatorMenu();
          } else {
            document.dispatchEvent(new CustomEvent(`town:${prop.target.name}`));
          }
        } else if (prop.target.type === 'note' && prop.target.text) {
          if (engine.callbacks.onBubble) {
            engine.callbacks.onBubble(prop.label, prop.target.text);
          } else {
            engine.callbacks.onDialogue(prop.label, [prop.target.text]);
          }
        } else if (prop.target.type === 'place' && prop.target.id) {
          if (prop.target.id === 'town') {
            engine.exitCurrentSceneToTown();
          } else {
            sfx.door();
            engine.callbacks.onNavigate(`/${prop.target.id}`);
          }
        }
        engine.wake();
      }
      return;
    }

    if (engine.currentScene === 'cafe') {
      const fx = engine.playerPos.x + DIRS[engine.playerDir].x;
      const fy = engine.playerPos.y + DIRS[engine.playerDir].y;
      const prop =
        (activeTarget ? CAFE_PROPS.find((p) => p.id === activeTarget) : undefined) ||
        CAFE_PROPS.find(
          (p) =>
            (fx >= p.x && fx < p.x + p.w && fy >= p.y && fy < p.y + p.h) ||
            (engine.playerPos.x >= p.x - 1 &&
              engine.playerPos.x <= p.x + p.w &&
              engine.playerPos.y >= p.y - 1 &&
              engine.playerPos.y <= p.y + p.h)
        );

      if (prop) {
        sfx.select();
        if (prop.target.type === 'event' && prop.target.name) {
          if (prop.target.name === 'barista') {
            sfx.espressoBrew();
            triggerCafeBrewAnimation('WELCOME TO POKÉ-CAFÉ ☕');
            if (engine.callbacks.onBubble) {
              engine.callbacks.onBubble(
                'Master Barista Rio · Poké-Café & Bar ☕',
                'Welcome to the Poké-Café & Developer Roastery Bar! We craft specialty single-origin TypeScript espresso, TensorRT cold brews, and artisan Castelia Cones. Care to brew a custom blend or pull up a chair for a Coffee Chat with Zulfan?',
                [
                  {
                    label: '☕ Brew Custom Dev Blend (+100 Energy)',
                    onClick: () => {
                      sfx.espressoBrew();
                      engine.callbacks.onRefill();
                      triggerCafeBrewAnimation('DARK TYPESCRIPT ROAST! +100%');
                      const el = document.getElementById('cafe-custom-brewer');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    },
                  },
                  {
                    label: '📋 Browse Artisanal Menu',
                    onClick: () => {
                      const el = document.getElementById('cafe-menu-grid');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    },
                  },
                  {
                    label: '💬 Book VIP Coffee Chat',
                    onClick: () => {
                      engine.walkToObject('vip-booth');
                      const el = document.getElementById('cafe-vip-lounge');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    },
                  },
                ]
              );
            }
          } else if (prop.target.name === 'alcremie') {
            sfx.heal();
            triggerCafeBrewAnimation('ALCREMIE SWEET CHARM! 🍓✨');
            if (engine.callbacks.onBubble) {
              engine.callbacks.onBubble(
                'Alcremie · Pastry Mascot 🍓✨',
                '"Alcre-cremie~!" Alcremie twirls happily and tops your drink with whipped strawberry cream and zero-bug sugar sprinkles! Stamina & coding focus restored to 100%!',
                [
                  {
                    label: '🍦 Taste Castelia Cone (+25s Speed Boost)',
                    onClick: () => {
                      sfx.heal();
                      engine.callbacks.onRefill();
                      engine.activateCoffeeBoost(25);
                      triggerCafeBrewAnimation('CASTELIA CONE RUSH! ⚡');
                    },
                  },
                  {
                    label: '🧁 Inspect Pastry Showcase',
                    onClick: () => {
                      engine.walkToObject('pastry-case');
                    },
                  },
                ]
              );
            }
          } else if (prop.target.name === 'vinyl-jukebox') {
            sfx.discSpin();
            window.dispatchEvent(new CustomEvent('town:cafe-highlight', { detail: { id: 'vinyl-jukebox' } }));
            if (engine.callbacks.onBubble) {
              engine.callbacks.onBubble(
                'Lo-Fi Vinyl Jukebox 🎵',
                'Warm analog synthwaves & acoustic guitar tracks spinning at 33⅓ RPM. Switch the café ambiance between Morning Acoustic, Golden Sunset Lo-Fi, and Midnight Jazz!',
                [
                  {
                    label: '🎵 Open Jukebox & Track Selector',
                    onClick: () => {
                      const el = document.getElementById('cafe-jukebox-section');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    },
                  },
                  {
                    label: '🌙 Switch to Midnight Jazz Vibe',
                    onClick: () => {
                      sfx.discSpin();
                      window.dispatchEvent(new CustomEvent('town:cafe-jukebox-track', { detail: { mood: 'night' } }));
                    },
                  },
                ]
              );
            }
          } else if (prop.target.name === 'pastry-case') {
            sfx.martChime();
            window.dispatchEvent(new CustomEvent('town:cafe-highlight', { detail: { id: 'pastry-case', category: 'pastry' } }));
            if (engine.callbacks.onBubble) {
              engine.callbacks.onBubble(
                'Castelia Cone & Poké Puff Showcase 🍦',
                'Chilled glass cloches displaying Unova-famous Castelia Cones, Kalos Supreme Poké Puffs, Lumiose Galettes, and Old Gateau brain fuel for late-night debugging.',
                [
                  {
                    label: '🧁 Filter Sweets & Pastries Menu',
                    onClick: () => {
                      window.dispatchEvent(new CustomEvent('town:cafe-filter', { detail: { category: 'pastry' } }));
                      const el = document.getElementById('cafe-menu-grid');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    },
                  },
                  {
                    label: '🍦 Order Castelia Cone (+100 Energy)',
                    onClick: () => {
                      sfx.heal();
                      engine.callbacks.onRefill();
                      triggerCafeBrewAnimation('CASTELIA CONE SERVED! 🍦');
                    },
                  },
                ]
              );
            }
          } else if (prop.target.name === 'roast-board') {
            sfx.espressoBrew();
            window.dispatchEvent(new CustomEvent('town:cafe-highlight', { detail: { id: 'roast-board', category: 'espresso' } }));
            if (engine.callbacks.onBubble) {
              engine.callbacks.onBubble(
                'Specialty Dev Roasts & V60 Brew Lab 🫘',
                "Small-batch copper roaster & Chemex pour-over station. Today's single-origin beans: Dark Roasted TypeScript, YOLOv11 TensorRT Shot (75 FPS), and Go Routine Pour-Over.",
                [
                  {
                    label: '☕ Open Custom Blend Builder',
                    onClick: () => {
                      const el = document.getElementById('cafe-custom-brewer');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    },
                  },
                  {
                    label: '🔥 Filter Specialty Roasts',
                    onClick: () => {
                      window.dispatchEvent(new CustomEvent('town:cafe-filter', { detail: { category: 'espresso' } }));
                      const el = document.getElementById('cafe-menu-grid');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    },
                  },
                ]
              );
            }
          } else if (prop.target.name === 'vip-booth') {
            sfx.select();
            window.dispatchEvent(new CustomEvent('town:cafe-highlight', { detail: { id: 'vip-booth' } }));
            if (engine.callbacks.onBubble) {
              engine.callbacks.onBubble(
                'VIP Coffee Chat & Pairing Booth 💬',
                'Reserved leather booth with dual monitors and warm pendant lighting. Grab a virtual espresso with Zulfan to discuss full-stack web roles, Edge AI research, or system architecture!',
                [
                  {
                    label: '💬 Open Coffee Chat Scheduler',
                    onClick: () => {
                      const el = document.getElementById('cafe-vip-lounge');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    },
                  },
                  {
                    label: '📄 View Official CV (PDF)',
                    href: '/cv/CV_Zulfan.pdf',
                  },
                ]
              );
            }
          } else if (prop.target.name === 'craft-tap') {
            sfx.espressoBrew();
            window.dispatchEvent(new CustomEvent('town:cafe-highlight', { detail: { id: 'craft-tap', category: 'elixir' } }));
            if (engine.callbacks.onBubble) {
              engine.callbacks.onBubble(
                'Nitro Cold Brew & Craft Mocktail Tap 🍹',
                'Pressurized nitrogen cold brew & botanical night-bar elixirs: Kafka Event-Stream Tonic, Redis Lua Sub-Millisecond Fizz, and Berry Matcha Cloud.',
                [
                  {
                    label: '🍹 Filter Night Bar & Cold Brews',
                    onClick: () => {
                      window.dispatchEvent(new CustomEvent('town:cafe-filter', { detail: { category: 'elixir' } }));
                      const el = document.getElementById('cafe-menu-grid');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    },
                  },
                  {
                    label: '⚡ Pour Nitro Cold Brew (+20s Speed)',
                    onClick: () => {
                      sfx.espressoBrew();
                      engine.callbacks.onRefill();
                      engine.activateCoffeeBoost(20);
                      triggerCafeBrewAnimation('NITRO COLD BREW! +20s BOOST');
                    },
                  },
                ]
              );
            }
          }
        } else if (prop.target.type === 'place' && prop.target.id) {
          if (prop.target.id === 'town') {
            engine.exitCurrentSceneToTown();
          } else {
            sfx.door();
            engine.callbacks.onNavigate(`/${prop.target.id}`);
          }
        }
        engine.wake();
      }
      return;
    }

    if (engine.currentScene === 'arena') {
      const fx = engine.playerPos.x + DIRS[engine.playerDir].x;
      const fy = engine.playerPos.y + DIRS[engine.playerDir].y;
      const prop =
        (activeTarget ? ARENA_PROPS.find((p) => p.id === activeTarget) : undefined) ||
        ARENA_PROPS.find(
          (p) =>
            (fx >= p.x && fx < p.x + p.w && fy >= p.y && fy < p.y + p.h) ||
            (engine.playerPos.x >= p.x - 1 &&
              engine.playerPos.x <= p.x + p.w &&
              engine.playerPos.y >= p.y - 1 &&
              engine.playerPos.y <= p.y + p.h)
        );

      if (prop) {
        sfx.select();
        if (prop.target.type === 'event' && prop.target.name) {
          if (prop.target.name === 'mewtwo-boss') {
            sfx.encounter();
            triggerArenaBattleAnimation('IMPERIAL PSYSTRIKE! 👑', '#f59e0b');
            if (engine.callbacks.onBubble) {
              engine.callbacks.onBubble(
                'Grand Champion Mewtwo · Imperial Tribune 👑',
                'MEWTWO (Telepathy): "Ave, Challenger! Welcome to the Gladiator Colosseum. Step onto the sacred sand to test your blade in 1v1 combat, or face the Six Trials of Rome!"',
                [
                  {
                    label: '⚔️ Enter the Gladiator Pit (1v1 Duel)',
                    onClick: () => {
                      const el = document.getElementById('battle-sim-section');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    },
                  },
                  {
                    label: '🦁 Face the Six Colosseum Trials',
                    onClick: () => {
                      const el = document.getElementById('algo-dojo-section');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    },
                  },
                ]
              );
            }
          } else if (prop.target.name === 'lucario-coach') {
            sfx.confirm();
            triggerArenaBattleAnimation('LANISTA AURA BLESSING! 🥊', '#38bdf8');
            if (engine.callbacks.onBubble) {
              engine.callbacks.onBubble(
                'Lanista Lucario · Master of Gladiators 🥊',
                '"Your combat aura burns bright, Gladiator!" Lanista Lucario sharpens your tactics and restores your warrior stamina to 100%. Choose your Champion from the Armory to break Mewtwo’s Imperial Guard!',
                [
                  {
                    label: '⚔️ Choose Champion & Duel (+100% Stamina)',
                    onClick: () => {
                      sfx.heal();
                      engine.callbacks.onRefill();
                      const el = document.getElementById('battle-sim-section');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    },
                  },
                  {
                    label: '🛡️ Inspect Obelisk Combat Runes',
                    onClick: () => {
                      engine.walkToObject('stat-radar');
                      const el = document.getElementById('stat-radar-section');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    },
                  },
                ]
              );
            }
          } else if (prop.target.name === 'referee-dan') {
            sfx.select();
            triggerArenaBattleAnimation('MUNERA SANCTIONED! 📯', '#dc2626');
            if (engine.callbacks.onBubble) {
              engine.callbacks.onBubble(
                'Legatus Arbiter · Chief Judge of the Sand 📯',
                '"By decree of the Colosseum Senate: 4 signature strikes per Gladiator, 3 Imperial Blessings per bout, and the Golden Caesar Laurel for victorious challengers! Let the Munera begin!"',
                [
                  {
                    label: '⚔️ Step into the Gladiator Pit',
                    onClick: () => {
                      const el = document.getElementById('battle-sim-section');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    },
                  },
                  {
                    label: '🏆 Visit the Hall of Victors',
                    onClick: () => {
                      engine.walkToObject('trophy-vault');
                      const el = document.getElementById('trophy-vault-section');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    },
                  },
                ]
              );
            }
          } else if (prop.target.name === 'battle-terminal') {
            sfx.confirm();
            triggerArenaBattleAnimation('ARMORY FORGE READY! ⚔️', '#ef4444');
            if (engine.callbacks.onBubble) {
              engine.callbacks.onBubble(
                'Gladiator Armory & Weapon Rack ⚔️',
                'Forged blades, Roman Scutum shields, and Golden Tridents! Command Charizard (Ignis Myrmillo), Lucario (Aura Dimachaerus), Garchomp (Draco Secutor), or Dialga (Chronos Hoplomachus) in the Gladiator Pit!',
                [
                  {
                    label: '⚔️ Open Gladiator Duel Pit',
                    onClick: () => {
                      const el = document.getElementById('battle-sim-section');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    },
                  },
                ]
              );
            }
          } else if (prop.target.name === 'algorithm-dojo') {
            sfx.select();
            triggerArenaBattleAnimation('PORTA BESTIARIORUM OPEN! 🦁', '#d97706');
            if (engine.callbacks.onBubble) {
              engine.callbacks.onBubble(
                'Porta Bestiariorum · Six Trials Gate 🦁',
                'Behind these iron portcullis bars lie the Six Engineering Trials of the Colosseum: Computer Vision, Praetorian CyberSec, High-Velocity Web, Concurrent Backends, NLP Scrolls, and IoT Telemetry!',
                [
                  {
                    label: '🦁 Enter the Six Colosseum Trials',
                    onClick: () => {
                      const el = document.getElementById('algo-dojo-section');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    },
                  },
                ]
              );
            }
          } else if (prop.target.name === 'trophy-vault') {
            sfx.heal();
            triggerArenaBattleAnimation('AVE VICTOR! SPOILS OF ROME 🏆', '#fbbf24');
            if (engine.callbacks.onBubble) {
              engine.callbacks.onBubble(
                'Hall of Victors · Marble Pedestals 🏆',
                "Behold Muhammad Zulfan's consecrated Colosseum spoils: IDEA FEST 3 National Bronze Medallion, Huawei HCIA-Security V4.0 Praetorian Seal, ITENAS Senate GPA 3.49/4.00, and 6× Legion Lab Assistantship.",
                [
                  {
                    label: '🏆 Inspect Pedestals & Laurels',
                    onClick: () => {
                      const el = document.getElementById('trophy-vault-section');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    },
                  },
                  {
                    label: '📜 Download Imperial Scroll (CV PDF)',
                    href: '/cv/CV_Zulfan.pdf',
                  },
                ]
              );
            }
          } else if (prop.target.name === 'stat-radar') {
            sfx.select();
            triggerArenaBattleAnimation('OBELISK RUNES AWAKENED: 565 PWR 🛡️', '#f59e0b');
            if (engine.callbacks.onBubble) {
              engine.callbacks.onBubble(
                'Obelisk of Mars · 6-Axis Combat Runes 🛡️',
                'Carved in ancient sandstone (565 Total Combat Power): Eagle Vision AI/CV (98), Gladius Full-Stack (96), Aqueduct Backend (95), Aegis CyberSec (92), Chariot IoT (90), and Senate Algorithms (94).',
                [
                  {
                    label: '🛡️ Inspect Gladiator Runes',
                    onClick: () => {
                      const el = document.getElementById('stat-radar-section');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    },
                  },
                ]
              );
            }
          }
        } else if (prop.target.type === 'place' && prop.target.id) {
          if (prop.target.id === 'town') {
            engine.exitCurrentSceneToTown();
          } else {
            sfx.door();
            engine.callbacks.onNavigate(`/${prop.target.id}`);
          }
        }
        engine.wake();
      }
      return;
    }

    if (engine.currentScene === 'garden') {
      const fx = engine.playerPos.x + DIRS[engine.playerDir].x;
      const fy = engine.playerPos.y + DIRS[engine.playerDir].y;
      const prop =
        (activeTarget ? GARDEN_PROPS.find((p) => p.id === activeTarget) : undefined) ||
        GARDEN_PROPS.find(
          (p) =>
            (fx >= p.x && fx < p.x + p.w && fy >= p.y && fy < p.y + p.h) ||
            (engine.playerPos.x >= p.x - 1 &&
              engine.playerPos.x <= p.x + p.w &&
              engine.playerPos.y >= p.y - 1 &&
              engine.playerPos.y <= p.y + p.h)
        );

      if (prop) {
        sfx.select();
        if (prop.target.type === 'event' && prop.target.name) {
          if (prop.target.name === 'gardevoir' || prop.target.name === 'botanist-flora') {
            sfx.heal();
            triggerGardenHarvestAnimation('GARDEVOIR FAIRY BLESSING! +3 POKE BALLS 🌸', '#f472b6');
            engine.harvestBerries();
            if (engine.callbacks.onBubble) {
              engine.callbacks.onBubble(
                'Gardevoir · Embracing Psychic/Fairy Guardian 🧚',
                '"Gar-de-voir! 🌸" Gardevoir radiates calming psychic warmth and a gentle Fairy blessing. Beneath the Grand Sakura Tree, Gardevoir tends to the 6 heirloom berry plots! [Tech Guardian: UI/UX Grace, Clean Architecture & Front-End Harmony]',
                [
                  {
                    label: '⚡ Psychic Power (Moonblast / Psychic)',
                    onClick: () => engine.triggerSignatureMove('gardevoir', 6, 3),
                  },
                  {
                    label: '🤝 Walk Together',
                    onClick: () => engine.setActiveFollower('gardevoir'),
                  },
                  {
                    label: '🌱 Open 6-Plot Berry Plantation',
                    onClick: () => {
                      const el = document.getElementById('plantation-sim-section');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    },
                  },
                  {
                    label: '🍯 Spin Copper Berry Blender',
                    onClick: () => {
                      const el = document.getElementById('berry-blender-section');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    },
                  },
                ]
              );
            }
          } else if (prop.target.name === 'celebi' || prop.target.name === 'shaymin-npc') {
            sfx.confirm();
            triggerGardenHarvestAnimation('CELEBI TIME TRAVEL BLOOM! 🌿', '#4ade80');
            if (engine.callbacks.onBubble) {
              engine.callbacks.onBubble(
                'Celebi · Voice of the Forest & Time Guardian 🌿',
                '"Bi-bi-biii! ✨" Celebi gracefully floats above the sakura spring! Its time-traveling touch instantly revitalizes every plant and grants a +50% movement speed boost! [Tech Guardian: Time-Travel Git History, Instant CI/CD Deploy & Timeless Resilience]',
                [
                  {
                    label: '⚡ Time Ripple (Time Ripple / Leaf Storm)',
                    onClick: () => engine.triggerSignatureMove('celebi', 8, 3),
                  },
                  {
                    label: '✨ Time Speed Blessing (+50% Speed)',
                    onClick: () => {
                      engine.activateCoffeeBoost(30);
                      window.dispatchEvent(new CustomEvent('garden:ripen-all'));
                    },
                  },
                  {
                    label: '🤝 Walk Together',
                    onClick: () => engine.setActiveFollower('celebi'),
                  },
                  {
                    label: '📖 Open Botanical Skill Compendium',
                    onClick: () => {
                      const el = document.getElementById('berry-compendium-section');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    },
                  },
                ]
              );
            }
          } else if (prop.target.name === 'plot-oran') {
            sfx.select();
            triggerGardenHarvestAnimation('ORAN & PECHA BED INSPECTED! 🍊', '#38bdf8');
            if (engine.callbacks.onBubble) {
              engine.callbacks.onBubble(
                'North-West Raised Bed · Oran & Pecha Cultivars 🍊',
                'Cobalt-blue Oran Berries (+10 HP Resilience) & sweet pink Pecha Blossoms thrive in moist volcanic loam — symbolizing Zulfan’s rock-solid Full-Stack Web & TypeScript foundation.',
                [
                  {
                    label: '🍊 Harvest / Tend in Live Farm',
                    onClick: () => {
                      window.dispatchEvent(new CustomEvent('garden:focus-plot', { detail: { plotIdx: 0 } }));
                      const el = document.getElementById('plantation-sim-section');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    },
                  },
                ]
              );
            }
          } else if (prop.target.name === 'plot-sitrus') {
            sfx.select();
            triggerGardenHarvestAnimation('SITRUS & LUM HYBRID RIPE! 🍋', '#facc15');
            if (engine.callbacks.onBubble) {
              engine.callbacks.onBubble(
                'North-East Raised Bed · Sitrus & Miracle Lum 🍋',
                'Golden Sitrus Berries (+25% HP) and rare Emerald Lum Berries (Cure-All Miracle) represent high-yield Computer Vision (YOLOv8 AeroScan) & Huawei HCIA-Security V4.0 protection!',
                [
                  {
                    label: '🍋 Harvest / Tend in Live Farm',
                    onClick: () => {
                      window.dispatchEvent(new CustomEvent('garden:focus-plot', { detail: { plotIdx: 1 } }));
                      const el = document.getElementById('plantation-sim-section');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    },
                  },
                ]
              );
            }
          } else if (prop.target.name === 'plot-cheri') {
            sfx.select();
            triggerGardenHarvestAnimation('CHERI & LEPPA SPICE HARVEST! 🍒', '#ef4444');
            if (engine.callbacks.onBubble) {
              engine.callbacks.onBubble(
                'South-West Terrace · Cheri & Leppa Berries 🍒',
                'Spicy ruby Cheri Berries and high-PP Leppa Berries fuel rapid IoT microcontroller reflexes (ESP32/Arduino) and non-stop backend API endurance!',
                [
                  {
                    label: '🍒 Harvest / Tend in Live Farm',
                    onClick: () => {
                      window.dispatchEvent(new CustomEvent('garden:focus-plot', { detail: { plotIdx: 2 } }));
                      const el = document.getElementById('plantation-sim-section');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    },
                  },
                ]
              );
            }
          } else if (prop.target.name === 'watering-well') {
            sfx.heal();
            triggerGardenHarvestAnimation('SPRAYDUCK IRRIGATION SHOWER! 💧', '#38bdf8');
            window.dispatchEvent(new CustomEvent('garden:water-all'));
            if (engine.callbacks.onBubble) {
              engine.callbacks.onBubble(
                'Sprayduck Spring Well · Greenhouse Irrigation 💧',
                'You filled the iconic yellow Sprayduck watering can from the crystal Sakura spring and irrigated all 6 plantation beds to 100% moisture!',
                [
                  {
                    label: '🌱 Check Irrigated Plots',
                    onClick: () => {
                      const el = document.getElementById('plantation-sim-section');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    },
                  },
                ]
              );
            }
          } else if (prop.target.name === 'berry-blender') {
            sfx.confirm();
            triggerGardenHarvestAnimation('COPPER BERRY BLENDER SPINNING! 🍯', '#f59e0b');
            if (engine.callbacks.onBubble) {
              engine.callbacks.onBubble(
                'Artisanal Berry Blender & Combee Apiary 🍯',
                'Combine 3 harvested berries in our high-RPM Hoenn Copper Berry Blender to craft Gold Pokéblocks, Developer Focus Jams, and Combee Honey Elixirs!',
                [
                  {
                    label: '🍯 Launch Berry Blender Lab',
                    onClick: () => {
                      const el = document.getElementById('berry-blender-section');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    },
                  },
                ]
              );
            }
          }
        } else if (prop.target.type === 'place' && prop.target.id) {
          if (prop.target.id === 'town') {
            engine.exitCurrentSceneToTown();
          } else {
            sfx.door();
            engine.callbacks.onNavigate(`/${prop.target.id}`);
          }
        }
        engine.wake();
      }
      return;
    }

    if (engine.currentScene === 'neighbour') {
      const fx = engine.playerPos.x + DIRS[engine.playerDir].x;
      const fy = engine.playerPos.y + DIRS[engine.playerDir].y;
      const prop =
        (activeTarget ? NEIGHBOUR_PROPS.find((p) => p.id === activeTarget) : undefined) ||
        NEIGHBOUR_PROPS.find(
          (p) =>
            (fx >= p.x && fx < p.x + p.w && fy >= p.y && fy < p.y + p.h) ||
            (engine.playerPos.x >= p.x - 1 &&
              engine.playerPos.x <= p.x + p.w &&
              engine.playerPos.y >= p.y - 1 &&
              engine.playerPos.y <= p.y + p.h)
        );

      if (prop) {
        sfx.select();
        if (prop.target.type === 'event' && prop.target.name) {
          if (prop.target.name === 'neighbour-maya') {
            sfx.confirm();
            triggerNeighbourAnimation('FELLOW DEV GREETING! 🤝', '#38bdf8');
            if (engine.callbacks.onBubble) {
              engine.callbacks.onBubble(
                'Neighbour Maya · Fellow Dev 👋',
                '"Hey Zulfan! Welcome to our cozy dev cottage. Feel free to grab some hot tea by the fireplace, challenge the PR Ping-Pong game, or sign our guestbook corkboard!"',
                [
                  {
                    label: '🤝 Open Co-Op Chronicles',
                    onClick: () => {
                      const el = document.getElementById('coop-chronicles-section');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    },
                  },
                  {
                    label: '📌 Sign Neighbour Guestbook',
                    onClick: () => {
                      const el = document.getElementById('guestbook-section');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    },
                  },
                ]
              );
            }
          } else if (prop.target.name === 'eevee-companion') {
            sfx.heal();
            triggerNeighbourAnimation('EEVEE AFFECTION +100! 🦊💖', '#fbbf24');
            if (engine.callbacks.onBubble) {
              engine.callbacks.onBubble(
                'Eevee · Cottage Mascot 🦊',
                '"Eev-vee! ✨" Eevee wags its fluffy tail happily and cuddles up! Which evolutionary tech vibe matches your engineering mindset today?',
                [
                  {
                    label: '🦊 Match My Eeveelution Tech Vibe',
                    onClick: () => {
                      const el = document.getElementById('eevee-vibe-section');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    },
                  },
                  {
                    label: '☕ Share a Cup of Oolong Tea',
                    onClick: () => {
                      engine.walkToObject('fireplace-hearth');
                    },
                  },
                ]
              );
            }
          } else if (prop.target.name === 'guestbook-board') {
            sfx.select();
            triggerNeighbourAnimation('CORKBOARD OPENED! 📌', '#a855f7');
            if (engine.callbacks.onBubble) {
              engine.callbacks.onBubble(
                'Neighbour Guestbook & Endorsement Corkboard 📌',
                'A wooden corkboard covered with colourful sticky notes, peer reviews, and heartfelt dev endorsements from visiting trainers across Sinnoh & Unova.',
                [
                  {
                    label: '📌 Leave a Sticky Note / Endorsement',
                    onClick: () => {
                      const el = document.getElementById('guestbook-section');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    },
                  },
                ]
              );
            }
          } else if (prop.target.name === 'coop-table') {
            sfx.confirm();
            triggerNeighbourAnimation('PAIR-PROGRAMMING DESK! 💻', '#3b82f6');
            if (engine.callbacks.onBubble) {
              engine.callbacks.onBubble(
                'Co-Op Pair-Programming Desk 🤝',
                'Dual mechanical keyboards, ultrawide curved monitor, and Git pull requests ready for review. Explore collaborative open-source sprints & ITENAS hackathon milestones!',
                [
                  {
                    label: '🤝 Inspect Co-Op Projects & Sprints',
                    onClick: () => {
                      const el = document.getElementById('coop-chronicles-section');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    },
                  },
                ]
              );
            }
          } else if (prop.target.name === 'fireplace-hearth') {
            sfx.heal();
            engine.callbacks.onRefill();
            engine.activateCoffeeBoost(25);
            triggerNeighbourAnimation('WARM TEA BOOST! +25s SPEED 🍵', '#f97316');
            if (engine.callbacks.onBubble) {
              engine.callbacks.onBubble(
                'Fireside Oolong Tea Table 🍵',
                'You enjoyed a piping-hot porcelain cup of roasted Oolong tea by the crackling brick fireplace. Stamina restored to 100% and +50% movement speed for 25s!',
                [
                  {
                    label: '🎮 Play PR Ping-Pong Corner',
                    onClick: () => {
                      engine.walkToObject('retro-console');
                    },
                  },
                ]
              );
            }
          } else if (prop.target.name === 'retro-console') {
            sfx.select();
            triggerNeighbourAnimation('PR PING-PONG READY! 🎮', '#10b981');
            if (engine.callbacks.onBubble) {
              engine.callbacks.onBubble(
                'Retro CRT & PR Ping-Pong Corner 🎮',
                'A vintage CRT TV hooked up to a custom indie mini-game: PR Review Ping-Pong! Defend your branch against incoming merge conflicts and syntax bugs.',
                [
                  {
                    label: '🎮 Start PR Ping-Pong Mini-Game',
                    onClick: () => {
                      const el = document.getElementById('ping-pong-game-section');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    },
                  },
                ]
              );
            }
          } else if (prop.target.name === 'mentorship-shelf') {
            sfx.select();
            triggerNeighbourAnimation('6x LAB MENTORSHIP GUILD! 📚', '#6366f1');
            if (engine.callbacks.onBubble) {
              engine.callbacks.onBubble(
                '6× Lab Mentorship & Guild Library 📚',
                'Cedar shelves filled with curriculum modules, robotics lab manuals, and student project showcases from Zulfan\'s 6 semesters as ITENAS Laboratory Assistant.',
                [
                  {
                    label: '📚 Inspect Mentorship Impact & Guild',
                    onClick: () => {
                      const el = document.getElementById('mentorship-guild-section');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    },
                  },
                  {
                    label: '📄 View Official CV (PDF)',
                    href: '/cv/CV_Zulfan.pdf',
                  },
                ]
              );
            }
          }
        } else if (prop.target.type === 'place' && prop.target.id) {
          if (prop.target.id === 'town') {
            engine.exitCurrentSceneToTown();
          } else {
            sfx.door();
            engine.callbacks.onNavigate(`/${prop.target.id}`);
          }
        }
        engine.wake();
      }
      return;
    }

    if (engine.currentScene === 'mart') {
      const fx = engine.playerPos.x + DIRS[engine.playerDir].x;
      const fy = engine.playerPos.y + DIRS[engine.playerDir].y;
      const prop =
        (activeTarget ? MART_PROPS.find((p) => p.id === activeTarget) : undefined) ||
        MART_PROPS.find(
          (p) =>
            (fx >= p.x && fx < p.x + p.w && fy >= p.y && fy < p.y + p.h) ||
            (engine.playerPos.x >= p.x - 1 &&
              engine.playerPos.x <= p.x + p.w &&
              engine.playerPos.y >= p.y - 1 &&
              engine.playerPos.y <= p.y + p.h)
        );

      if (prop) {
        sfx.select();
        if (prop.target.type === 'event' && prop.target.name) {
          if (prop.target.name === 'clerk') {
            sfx.martChime();
            if (engine.callbacks.onBubble) {
              engine.callbacks.onBubble(
                'Clerk Kevin · Poké Mart',
                "Welcome to Zulfan's Poké Mart! We supply full-stack web platforms, edge TensorRT AI models, and custom software consultations. What would you like to inspect?",
                [
                  {
                    label: '📦 Browse Store Catalog',
                    onClick: () => {
                      const el = document.getElementById('mart-catalog');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    },
                  },
                  {
                    label: '🪙 Talk to Meowth (Cashier Mascot)',
                    onClick: () => {
                      engine.walkToObject('meowth');
                    },
                  },
                  {
                    label: '🎒 Inspect Engineering Services',
                    onClick: () => {
                      const tab = document.querySelector<HTMLButtonElement>('[data-mart-tab="services"]');
                      tab?.click();
                      const el = document.getElementById('mart-catalog');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    },
                  },
                  {
                    label: '🧾 Checkout Brief at Counter',
                    onClick: () => {
                      const btn = document.getElementById('checkout-btn');
                      btn?.click();
                    },
                  },
                  {
                    label: '🔑 Key Items & CV (PDF)',
                    onClick: () => {
                      window.open('/cv/CV_Zulfan.pdf', '_blank');
                    },
                  },
                ]
              );
            } else {
              engine.callbacks.onDialogue('Clerk Kevin', [
                "Welcome to Zulfan's Poké Mart! Browse our software services, developer potions, or pick up Zulfan's official CV below!",
              ]);
            }
          } else if (prop.target.name === 'meowth') {
            sfx.cashRegister();
            triggerCashRegisterAnimation('CHA-CHING! 🪙');
            if (engine.callbacks.onBubble) {
              const meowthQuotes = [
                "Meowth! 🪙 'That\\'s right! Zulfan\\'s edge AI vision pipelines run at 120 FPS on Jetson hardware without breaking a sweat!'",
                "Meowth jingled his Amulet Coin! 🪙 'Recruiters who hire Zulfan get double sprint velocity and 100% clean git commits!'",
                "Meowth whispers knowingly! 🪙 'Looking for a verified full-stack engineer? Zulfan graduated from ITENAS with a 3.49 GPA and coordinated 6 lab semesters!'",
                "Meowth purrs! 🪙 'Psst! All Technical TMs and official CVs here are 100% free! Keep your Poké-Dollars for coffee!'",
                "Meowth grins! 🪙 'IDEA FEST Bronze Medalist and HCIA-Security Certified... this engineer is ready for high-impact production roles!'"
              ];
              const randomQuote = meowthQuotes[Math.floor(Math.random() * meowthQuotes.length)];

              engine.callbacks.onBubble(
                'Meowth 🪙 (Cashier Mascot & Amulet Coin)',
                randomQuote,
                [
                  {
                    label: '🪙 Meowth Pay Day (+₽ 1,000)',
                    onClick: () => {
                      sfx.confirm();
                      triggerCashRegisterAnimation('PAY DAY! +₽1,000');
                      const btn = document.getElementById('btn-meowth-payday');
                      btn?.click();
                    },
                  },
                  {
                    label: '💰 Open Trainer Wallet Ledger',
                    onClick: () => {
                      const badge = document.getElementById('wallet-badge-btn');
                      badge?.click();
                    },
                  },
                  {
                    label: '💿 Insert TM into Disc Reader',
                    onClick: () => {
                      window.dispatchEvent(
                        new CustomEvent('town:open-tm-reader', {
                          detail: { tmId: 'tm-01' },
                        })
                      );
                    },
                  },
                  {
                    label: '👨‍💼 Talk to Clerk Kevin',
                    onClick: () => {
                      engine.walkToObject('clerk');
                    },
                  },
                ]
              );
            }
          } else if (prop.target.name === 'services-shelf') {
            if (engine.callbacks.onBubble) {
              engine.callbacks.onBubble(
                'Engineering Services Shelf 🎒',
                'Custom software solutions ready for commission: Full-Stack Web Development (Laravel 12 / Next.js) and Edge AI Computer Vision (YOLOv11 + TensorRT ~1.8ms/frame).',
                [
                  {
                    label: '🎒 View Services (Scroll Panel)',
                    onClick: () => {
                      const tab = document.querySelector<HTMLButtonElement>('[data-mart-tab="services"]');
                      tab?.click();
                      const el = document.getElementById('mart-catalog');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    },
                  },
                  {
                    label: '👨‍💼 Ask Clerk Kevin',
                    onClick: () => {
                      engine.walkToObject('clerk');
                    },
                  },
                ]
              );
            }
          } else if (prop.target.name === 'tech-tms') {
            if (engine.callbacks.onBubble) {
              engine.callbacks.onBubble(
                'Technical TMs & Stack Discs 💿',
                'Inscribe cutting-edge technologies into your codebase: Python & PyTorch, TypeScript & Astro, Laravel 12 & PHP, Docker & Kubernetes, and TensorRT & CUDA.',
                [
                  {
                    label: '💿 Insert TM into Disc Reader',
                    onClick: () => {
                      window.dispatchEvent(
                        new CustomEvent('town:open-tm-reader', {
                          detail: { tmId: 'tm-01' },
                        })
                      );
                    },
                  },
                  {
                    label: '📦 Filter Catalog (Tech TMs Tab)',
                    onClick: () => {
                      const tab = document.querySelector<HTMLButtonElement>('[data-mart-tab="tms"]');
                      tab?.click();
                      const el = document.getElementById('mart-catalog');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    },
                  },
                  {
                    label: '🔬 Open Research Lab (/lab)',
                    onClick: () => {
                      engine.callbacks.onNavigate('/lab');
                    },
                  },
                ]
              );
            }
          } else if (prop.target.name === 'potions-shelf') {
            if (engine.callbacks.onBubble) {
              engine.callbacks.onBubble(
                'Dev Potions & Productivity Boosters 🧪',
                'Essential engineer supplies: Bandung Specialty Espresso (+100% Focus), Clean Architecture Ether (100% Code Quality), and Git Full Restore.',
                [
                  {
                    label: '🧪 Inspect Potions (Scroll Panel)',
                    onClick: () => {
                      const tab = document.querySelector<HTMLButtonElement>('[data-mart-tab="potions"]');
                      tab?.click();
                      const el = document.getElementById('mart-catalog');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    },
                  },
                  {
                    label: '☕ Grab Cold Brew at Cooler',
                    onClick: () => {
                      engine.walkToObject('drink-cooler');
                    },
                  },
                ]
              );
            }
          } else if (prop.target.name === 'key-showcase') {
            if (engine.callbacks.onBubble) {
              engine.callbacks.onBubble(
                'Key Items Pedestal & CV 🔑',
                "Pedestal showcasing Muhammad Zulfan's ITENAS Informatics Diploma (GPA 3.49/4.00), AeroScan AI Weights, and Official CV / Résumé.",
                [
                  {
                    label: '📄 Download Official CV (PDF)',
                    onClick: () => {
                      window.open('/cv/CV_Zulfan.pdf', '_blank');
                    },
                  },
                  {
                    label: '🔑 Inspect Key Shelf (Scroll Panel)',
                    onClick: () => {
                      const tab = document.querySelector<HTMLButtonElement>('[data-mart-tab="key"]');
                      tab?.click();
                      const el = document.getElementById('mart-catalog');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    },
                  },
                ]
              );
            }
          } else if (prop.target.name === 'drink-cooler') {
            if (engine.callbacks.onBubble) {
              engine.callbacks.onBubble(
                'Poké-Cooler & Cold Brew Vending 🥤',
                'POKÉ-COOLER: Chilled Fresh Water, Soda Pop, and Bandung Specialty Cold Brew to keep development productivity at maximum (+50% walking speed boost!).',
                [
                  {
                    label: '☕ Drink Bandung Espresso (₽ 50)',
                    onClick: () => {
                      const btn = document.getElementById('drink-coffee-btn');
                      btn?.click();
                    },
                  },
                  {
                    label: '🧪 Use Clean Arch Ether (₽ 100)',
                    onClick: () => {
                      const btn = document.getElementById('drink-ether-btn');
                      btn?.click();
                    },
                  },
                  {
                    label: '📦 Inspect Potions Shelf',
                    onClick: () => {
                      const tab = document.querySelector<HTMLButtonElement>('[data-mart-tab="potions"]');
                      tab?.click();
                      const el = document.getElementById('mart-catalog');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    },
                  },
                ]
              );
            }
          } else {
            document.dispatchEvent(new CustomEvent(`town:${prop.target.name}`));
          }
        } else if (prop.target.type === 'note' && prop.target.text) {
          if (engine.callbacks.onBubble) {
            engine.callbacks.onBubble(prop.label, prop.target.text);
          } else {
            engine.callbacks.onDialogue(prop.label, [prop.target.text]);
          }
        } else if (prop.target.type === 'place' && prop.target.id) {
          if (prop.target.id === 'town') {
            engine.exitCurrentSceneToTown();
          } else {
            sfx.door();
            engine.callbacks.onNavigate(`/${prop.target.id}`);
          }
        }
        engine.wake();
      }
      return;
    }

    if (engine.currentScene === 'reception') {
      const fx = engine.playerPos.x + DIRS[engine.playerDir].x;
      const fy = engine.playerPos.y + DIRS[engine.playerDir].y;
      const prop =
        (activeTarget ? RECEPTION_PROPS.find((p) => p.id === activeTarget) : undefined) ||
        RECEPTION_PROPS.find(
          (p) =>
            (fx >= p.x && fx < p.x + p.w && fy >= p.y && fy < p.y + p.h) ||
            (engine.playerPos.x >= p.x - 1 &&
              engine.playerPos.x <= p.x + p.w &&
              engine.playerPos.y >= p.y - 1 &&
              engine.playerPos.y <= p.y + p.h)
        );

      if (prop) {
        sfx.select();
        if (prop.target.type === 'event' && prop.target.name) {
          if (prop.target.name === 'mira') {
            if (engine.callbacks.onBubble) {
              engine.callbacks.onBubble(
                'Nurse Mira · Front Desk Concierge',
                "Welcome to the Poké Center! I'm Mira. Feel free to ask me anything about Zulfan's engineering track record, research, or ask me for campus directions!",
                [
                  {
                    label: '💬 Chat with Mira (Ask AI)',
                    onClick: () => {
                      const input = document.querySelector<HTMLInputElement>('#chat-input');
                      input?.focus();
                      input?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    },
                  },
                  {
                    label: '🎯 Recruiter Concierge & Role Matcher',
                    onClick: () => {
                      const rc = document.querySelector('#recruiter-concierge');
                      rc?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    },
                  },
                  {
                    label: '💖 Ask Chansey to Heal & Refill Balls',
                    onClick: () => {
                      engine.walkToObject('chansey');
                    },
                  },
                  {
                    label: '📋 View Campus Directory',
                    onClick: () => {
                      engine.walkToObject('directory-board');
                    },
                  },
                  {
                    label: '💻 Access Network PC',
                    onClick: () => {
                      engine.walkToObject('pc-terminal');
                    },
                  },
                ]
              );
            } else {
              engine.callbacks.onDialogue('Nurse Mira', [
                "Welcome to the Pokémon Center! I'm Mira. Ask me anything about Zulfan's background or town directions!",
              ]);
            }
          } else if (prop.target.name === 'chansey') {
            sfx.heal();
            if (engine.callbacks.onBubble) {
              engine.callbacks.onBubble(
                'Chansey 🥚 (Front Desk Medical Assistant)',
                "Chan-sey! 💖 Chansey greets you with a warm smile and cradles a glowing Lucky Egg! Would you like to heal your party, refill your Poké Balls, or enjoy a fresh Lucky Egg speed boost?",
                [
                  {
                    label: '💖 Rest & Refill 10 Poké Balls',
                    onClick: () => {
                      sfx.heal();
                      triggerHealAnimation();
                      engine.callbacks.onRefill();
                      window.dispatchEvent(new CustomEvent('town:refill-balls'));
                      if (engine.callbacks.onBubble) {
                        engine.callbacks.onBubble(
                          'Pokéball Healing Station ✨',
                          'Your party has been fully rested and your bag refilled to 10 Poké Balls! Ready for your next journey in Town!'
                        );
                      }
                    },
                  },
                  {
                    label: '🥚 Take Lucky Egg (+50% Speed Boost)',
                    onClick: () => {
                      engine.activateCoffeeBoost(25);
                      sfx.confirm();
                      if (engine.callbacks.onBubble) {
                        engine.callbacks.onBubble(
                          'Lucky Egg Speed Boost 🥚✨',
                          "Chansey gave you a fresh Lucky Egg! You feel energized and ready to explore Zulfan's portfolio town with +50% turbo movement speed for 25 seconds!"
                        );
                      }
                    },
                  },
                  {
                    label: '💬 Chat with Nurse Mira',
                    onClick: () => {
                      engine.walkToObject('mira');
                    },
                  },
                ]
              );
            }
          } else if (prop.target.name === 'healing-machine') {
            sfx.heal();
            triggerHealAnimation();
            engine.callbacks.onRefill();
            window.dispatchEvent(new CustomEvent('town:refill-balls'));
            if (engine.callbacks.onBubble) {
              engine.callbacks.onBubble(
                'Pokéball Healing Station ✨',
                'Your party has been fully rested and all Poké Balls refilled to 10! Ready for your next journey in Town!'
              );
            }
          } else if (prop.target.name === 'pc-terminal') {
            sfx.select();
            window.dispatchEvent(new CustomEvent('reception:open-pc'));
          } else if (prop.target.name === 'directory-board') {
            sfx.select();
            if (engine.callbacks.onBubble) {
              engine.callbacks.onBubble(
                'Campus Directory Board 📋',
                "Official Directory of Muhammad Zulfan's Portfolio Town. Discover all 13 specialized research facilities, gyms, gardens, and interactive worlds across the campus.",
                [
                  {
                    label: '📋 View All 13 Facilities (Scroll Panel)',
                    onClick: () => {
                      const dir = document.querySelector('#campus-directory');
                      dir?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    },
                  },
                  {
                    label: '🎯 AI Job-Fit JD Scanner (HR Mode)',
                    onClick: () => {
                      document.dispatchEvent(new CustomEvent('town:open-modal', { detail: { target: 'jobfit' } }));
                    },
                  },
                  {
                    label: '🗺️ Exit to Town Square (Open Map)',
                    onClick: () => {
                      engine.callbacks.onNavigate('/');
                    },
                  },
                ]
              );
            }
          } else if (prop.target.name === 'partner-pod') {
            sfx.select();
            const fName = engine.activeFollower ? `${engine.activeFollower.icon} ${engine.activeFollower.name}` : 'None Selected';
            if (engine.callbacks.onBubble) {
              engine.callbacks.onBubble(
                'Poké-Partner Care Pod 🐾',
                `Active Companion: ${fName}. Check your partner's vitality, switch companions from storage, or test their Signature Move!`,
                [
                  {
                    label: '🐾 Open Partner Hub & Switch Companion',
                    onClick: () => {
                      window.dispatchEvent(new CustomEvent('town:open-partner-hub'));
                    },
                  },
                  {
                    label: '💻 Open Bill’s PC Storage Box',
                    onClick: () => {
                      window.dispatchEvent(new CustomEvent('reception:open-pc', { detail: { tab: 'partners' } }));
                    },
                  },
                  ...(engine.activeFollower
                    ? [
                      {
                        label: `⚡ Cast ${engine.activeFollower.name} Move`,
                        onClick: () => {
                          if (engine.activeFollower) {
                            engine.triggerSignatureMove(engine.activeFollower.id, 4, 3);
                          }
                        },
                      },
                    ]
                    : []),
                ]
              );
            }
          } else if (prop.target.name === 'warp-globe') {
            sfx.confirm();
            if (engine.callbacks.onBubble) {
              engine.callbacks.onBubble(
                'Holographic 13-Zone Town Globe 🌐',
                'Interactive spatial projection of Zulfan Town! Launch the Guided Auto-Tour, run the AI Job-Fit Scanner, or warp directly to any campus zone.',
                [
                  {
                    label: '🧭 Open Town Fast-Travel Map',
                    onClick: () => {
                      document.dispatchEvent(new CustomEvent('town:open-modal', { detail: { target: 'map' } }));
                    },
                  },
                  {
                    label: '🎬 Launch Guided Auto-Tour (60s)',
                    onClick: () => {
                      sessionStorage.setItem('town:start_tour', '1');
                      engine.callbacks.onNavigate('/');
                    },
                  },
                  {
                    label: '👾 Warp to Digi-Sanctuary Island',
                    onClick: () => {
                      engine.callbacks.onNavigate('/digimon');
                    },
                  },
                ]
              );
            }
          } else if (prop.target.name === 'triage-scanner') {
            sfx.select();
            const gs = gameStore.getState();
            const balls = gs.balls;
            const badges = gs.badges.length;
            const stamps = gs.stamps.length;
            if (engine.callbacks.onBubble) {
              engine.callbacks.onBubble(
                'System Health & Triage Telemetry 🩺',
                `Node: BANDUNG_ITENAS_01 | Status: 100% Operational | Inventory: ${balls} Poké Balls | Gym Badges: ${badges}/8 | Passport Stamps: ${stamps}/5.`,
                [
                  {
                    label: '💻 Launch Cloud Diagnostics in PC',
                    onClick: () => {
                      window.dispatchEvent(new CustomEvent('reception:open-pc', { detail: { tab: 'card' } }));
                    },
                  },
                  {
                    label: '💖 Overcharge Bag to 15 Poké Balls',
                    onClick: () => {
                      window.dispatchEvent(new CustomEvent('reception:overcharge-balls'));
                    },
                  },
                ]
              );
            }
          } else if (prop.target.name === 'waiting-couch') {
            sfx.select();
            if (engine.callbacks.onBubble) {
              engine.callbacks.onBubble(
                'VIP Visitor Lounge 🛋️',
                "A plush executive lounge. On the mahogany coffee table rests Muhammad Zulfan's official résumé, ITENAS Computer Science academic records (GPA 3.49/4.00), and research pre-prints.",
                [
                  {
                    label: '📰 Read Portfolio Zines & Research (Scroll)',
                    onClick: () => {
                      const lounge = document.querySelector('#vip-lounge-section');
                      lounge?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    },
                  },
                  {
                    label: '🥚 Claim Lucky Egg Buff (+50% Speed)',
                    onClick: () => {
                      engine.activateCoffeeBoost(25);
                    },
                  },
                  {
                    label: '📄 Download Official CV (PDF)',
                    onClick: () => {
                      window.open('/cv/CV_Zulfan.pdf', '_blank');
                    },
                  },
                  {
                    label: '📋 Read Visitor FAQ & Credentials',
                    onClick: () => {
                      const faq = document.querySelector('#visitor-inquiries');
                      faq?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    },
                  },
                ]
              );
            }
          } else {
            document.dispatchEvent(new CustomEvent(`town:${prop.target.name}`));
          }
        } else if (prop.target.type === 'note' && prop.target.text) {
          if (engine.callbacks.onBubble) {
            engine.callbacks.onBubble(prop.label, prop.target.text);
          } else {
            engine.callbacks.onDialogue(prop.label, [prop.target.text]);
          }
        } else if (prop.target.type === 'place' && prop.target.id) {
          if (prop.target.id === 'town') {
            engine.exitCurrentSceneToTown();
          } else {
            sfx.door();
            engine.callbacks.onNavigate(`/${prop.target.id}`);
          }
        }
        engine.wake();
      }
      return;
    }

    if (engine.currentScene === 'arcade') {
      const fx = engine.playerPos.x + DIRS[engine.playerDir].x;
      const fy = engine.playerPos.y + DIRS[engine.playerDir].y;
      const prop =
        (activeTarget ? ARCADE_PROPS.find((p) => p.id === activeTarget) : undefined) ||
        ARCADE_PROPS.find(
          (p) =>
            (fx >= p.x && fx < p.x + p.w && fy >= p.y && fy < p.y + p.h) ||
            (engine.playerPos.x >= p.x - 1 &&
              engine.playerPos.x <= p.x + p.w &&
              engine.playerPos.y >= p.y - 1 &&
              engine.playerPos.y <= p.y + p.h)
        );

      if (prop) {
        sfx.select();
        if (prop.target.type === 'event' && prop.target.name) {
          document.dispatchEvent(new CustomEvent(`town:${prop.target.name}`));
        } else if (prop.target.type === 'note' && prop.target.text) {
          if (engine.callbacks.onBubble) {
            engine.callbacks.onBubble(prop.label, prop.target.text);
          } else {
            engine.callbacks.onDialogue(prop.label, [prop.target.text]);
          }
        } else if (prop.target.type === 'place' && prop.target.id) {
          if (prop.target.id === 'town') {
            engine.exitCurrentSceneToTown();
          } else {
            sfx.door();
            engine.callbacks.onNavigate(`/${prop.target.id}`);
          }
        }
        engine.wake();
      }
      return;
    }

    if (engine.currentScene === 'lab') {
      const fx = engine.playerPos.x + DIRS[engine.playerDir].x;
      const fy = engine.playerPos.y + DIRS[engine.playerDir].y;
      const prop =
        (activeTarget ? LAB_PROPS.find((p) => p.id === activeTarget) : undefined) ||
        LAB_PROPS.find(
          (p) =>
            (fx >= p.x && fx < p.x + p.w && fy >= p.y && fy < p.y + p.h) ||
            (engine.playerPos.x >= p.x - 1 &&
              engine.playerPos.x <= p.x + p.w &&
              engine.playerPos.y >= p.y - 1 &&
              engine.playerPos.y <= p.y + p.h)
        );

      if (prop) {
        sfx.select();
        if (prop.target.type === 'event' && prop.target.name === 'pheromosa') {
          const pheroText =
            'PHEROMOSA (UB-02 Beauty): "Latency is entropy, Researcher. At 3.2ms TensorRT FP16 inference on Jetson Orin Nano, perception reacts before human blink! Inspect the Lab Bench, Edge AI Posters, or Whiteboard!"';
          if (engine.callbacks.onBubble) {
            engine.callbacks.onBubble('Pheromosa · Ultra Beast AI Optimizer ✨', pheroText, [
              {
                label: '🔬 Inspect Edge AI Lab Bench',
                onClick: () => document.dispatchEvent(new CustomEvent('town:lab-bench')),
              },
              {
                label: '📋 Open Research Posters',
                onClick: () => document.dispatchEvent(new CustomEvent('town:lab-posters')),
              },
              {
                label: '🧠 Inspect ML Whiteboard',
                onClick: () => document.dispatchEvent(new CustomEvent('town:lab-whiteboard')),
              },
            ]);
          } else {
            engine.callbacks.onDialogue('Pheromosa · Ultra Beast AI Optimizer ✨', [pheroText]);
          }
        } else if (prop.target.type === 'event' && prop.target.name) {
          document.dispatchEvent(new CustomEvent(`town:${prop.target.name}`));
        } else if (prop.target.type === 'note' && prop.target.text) {
          if (engine.callbacks.onBubble) {
            engine.callbacks.onBubble(prop.label, prop.target.text);
          } else {
            engine.callbacks.onDialogue(prop.label, [prop.target.text]);
          }
        } else if (prop.target.type === 'place' && prop.target.id) {
          if (prop.target.id === 'town') {
            engine.exitCurrentSceneToTown();
          } else {
            sfx.door();
            engine.callbacks.onNavigate(`/${prop.target.id}`);
          }
        }
        engine.wake();
      }
      return;
    }

    if (engine.currentScene === 'dev') {
      const fx = engine.playerPos.x + DIRS[engine.playerDir].x;
      const fy = engine.playerPos.y + DIRS[engine.playerDir].y;
      const prop =
        (activeTarget ? DEV_PROPS.find((p) => p.id === activeTarget) : undefined) ||
        DEV_PROPS.find(
          (p) =>
            (fx >= p.x && fx < p.x + p.w && fy >= p.y && fy < p.y + p.h) ||
            (engine.playerPos.x >= p.x - 1 &&
              engine.playerPos.x <= p.x + p.w &&
              engine.playerPos.y >= p.y - 1 &&
              engine.playerPos.y <= p.y + p.h)
        );

      if (prop) {
        sfx.select();

        // Bi-Directional Sync for Dev Center Consoles & Props
        if (prop.id === 'console-wasm') {
          document.dispatchEvent(new CustomEvent('town:highlight-project', { detail: { id: 'aeroscan' } }));
          if (engine.callbacks.onBubble) {
            engine.callbacks.onBubble(
              'AI Inference Console 🖥️',
              "Edge AI & TensorRT. Zulfan's YOLOv11s model, optimized with TensorRT 10: ~1.8 ms/frame (>500 FPS) on an RTX 4060.",
              {
                label: 'Buka Debrief AeroScan 🚀',
                onClick: () => {
                  document.dispatchEvent(new CustomEvent('town:debrief', { detail: { id: 'aeroscan' } }));
                },
              }
            );
          } else {
            engine.callbacks.onDialogue(prop.label, [prop.target.text || '']);
          }
        } else if (prop.id === 'console-edge') {
          document.dispatchEvent(new CustomEvent('town:highlight-project', { detail: { id: 'foodlink' } }));
          if (engine.callbacks.onBubble) {
            engine.callbacks.onBubble(
              'Distributed Systems Console 🌐',
              'FoodLink Cloud-Native Platform. Laravel 12 API Gateway, Redis Queue, PostGIS spatial matchmaking, and Docker orchestration.',
              {
                label: 'Buka Debrief FoodLink 🚀',
                onClick: () => {
                  document.dispatchEvent(new CustomEvent('town:debrief', { detail: { id: 'foodlink' } }));
                },
              }
            );
          } else {
            engine.callbacks.onDialogue(prop.label, [prop.target.text || '']);
          }
        } else if (prop.id === 'console-static') {
          document.dispatchEvent(new CustomEvent('town:highlight-project', { detail: { id: 'omr-grader' } }));
          if (engine.callbacks.onBubble) {
            engine.callbacks.onBubble(
              'Static Architecture Console ⚡',
              'Static-first Astro framework. Compiled HTML at build time; 60 FPS lightweight canvas engine with zero bloat.',
              {
                label: 'Lihat Arsitektur Kota 📜',
                onClick: () => {
                  const el = document.getElementById('sec-build');
                  el?.scrollIntoView({ behavior: 'smooth' });
                  (el as any)?.setAttribute('open', '');
                },
              }
            );
          } else {
            engine.callbacks.onDialogue(prop.label, [prop.target.text || '']);
          }
        } else if (prop.id === 'whiteboard') {
          document.dispatchEvent(new CustomEvent('town:highlight-project', { detail: { id: 'thesis' } }));
          if (engine.callbacks.onBubble) {
            engine.callbacks.onBubble(
              'Architecture Whiteboard 📋',
              'End-to-End System Blueprint: profile.yaml ➔ Static Pages + 2D Engine + AI Digital Twin & Knowledge Base.',
              {
                label: 'Open Thesis Debrief 🚀',
                onClick: () => {
                  document.dispatchEvent(new CustomEvent('town:debrief', { detail: { id: 'thesis' } }));
                },
              }
            );
          } else {
            engine.callbacks.onDialogue(prop.label, [prop.target.text || '']);
          }
        } else if (prop.id === 'rack') {
          document.dispatchEvent(new CustomEvent('town:telemetry'));
          if (engine.callbacks.onBubble) {
            engine.callbacks.onBubble(
              'High-Performance Compute Rack 🗄️',
              'Active Server Rack: Compute cluster for model training, TensorRT FP16 quantization, and continuous deployment pipeline.',
              {
                label: 'Open Telemetry Wall 📈',
                onClick: () => {
                  document.dispatchEvent(new CustomEvent('town:telemetry'));
                },
              }
            );
          } else {
            engine.callbacks.onDialogue(prop.label, [prop.target.text || '']);
          }
        } else if (prop.id === 'eternatus') {
          sfx.select();
          if (engine.callbacks.onBubble) {
            engine.callbacks.onBubble(
              'Eternatus ⚡ (Server Assistant & Dynamo Core)',
              'Mission Control Server Assistant online! Eternatus channels infinite power to the AI compute clusters, TensorRT inference pipelines, and distributed backends. Ready to overclock!',
              [
                {
                  label: '📈 Open Telemetry Wall',
                  onClick: () => {
                    document.dispatchEvent(new CustomEvent('town:telemetry'));
                  },
                },
                {
                  label: '⚡ Overclock Core (+50% Speed)',
                  onClick: () => {
                    engine.activateCoffeeBoost();
                  },
                },
              ]
            );
          } else {
            engine.callbacks.onDialogue(prop.label, [
              'Server Assistant Eternatus active! Infinite power flowing to AI clusters.',
            ]);
          }
        } else if (prop.id === 'snorlax' || prop.id === 'lebronette') {
          sfx.select();
          if (engine.callbacks.onBubble) {
            engine.callbacks.onBubble(
              'Snorlax 💤 (Head of Comfort)',
              'Zzz... Snorlax is sleeping peacefully guarding the Mission Control command desk. Slow and steady breathing. Would you like to play the Poké Flute to greet him?',
              [
                {
                  label: '🎶 Play Poké Flute',
                  onClick: () => {
                    sfx.heal();
                    if (engine.callbacks.onBubble) {
                      engine.callbacks.onBubble(
                        'Snorlax 💤 (Snorlax Smiles)',
                        '♪~♫~ A melodious tune from the Poké Flute echoes softly! Snorlax stirs happily, opens one eye, gives a warm smile, and comfortably resumes dozing... 💤'
                      );
                    }
                  },
                },
                {
                  label: '🏥 Visit Poké Center',
                  onClick: () => {
                    engine.callbacks.onNavigate('/reception');
                  },
                },
              ]
            );
          } else {
            engine.callbacks.onDialogue(prop.label, ['Zzz... Snorlax is fast asleep.']);
          }
        } else if (prop.id === 'coffee') {
          sfx.select();
          if (engine.callbacks.onBubble) {
            engine.callbacks.onBubble(
              'Coffee Machine ☕ (Robusta Overclock)',
              'Mission Control automatic espresso machine is ready to brew pure West Java robusta coffee. Delivers an instant caffeine boost for turbo speed!',
              {
                label: '☕ Drink Coffee (Turbo Speed +50%)',
                onClick: () => {
                  engine.activateCoffeeBoost();
                },
              }
            );
          } else {
            engine.activateCoffeeBoost();
          }
        } else if (prop.target.type === 'event' && prop.target.name) {
          document.dispatchEvent(new CustomEvent(`town:${prop.target.name}`));
        } else if (prop.target.type === 'note' && prop.target.text) {
          if (engine.callbacks.onBubble) {
            engine.callbacks.onBubble(prop.label, prop.target.text);
          } else {
            engine.callbacks.onDialogue(prop.label, [prop.target.text]);
          }
        } else if (prop.target.type === 'place' && prop.target.id) {
          if (prop.target.id === 'town') {
            engine.exitCurrentSceneToTown();
          } else {
            sfx.door();
            engine.callbacks.onNavigate(`/${prop.target.id}`);
          }
        }
        engine.wake();
      }
      return;
    }

    if (engine.currentScene === 'home') {
      if (engine.homeFloor === '1F') {
        if (
          activeTarget === 'stairs-up' ||
          ((engine.playerPos.x === 12 || engine.playerPos.x === 13) && engine.playerPos.y <= 2)
        ) {
          engine.switchHomeFloor('2F');
          return;
        }
        const fx = engine.playerPos.x + DIRS[engine.playerDir].x;
        const fy = engine.playerPos.y + DIRS[engine.playerDir].y;
        const prop =
          (activeTarget ? HOME_PROPS.find((p) => p.id === activeTarget) : undefined) ||
          HOME_PROPS.find(
            (p) =>
              (fx >= p.x && fx < p.x + p.w && fy >= p.y && fy < p.y + p.h) ||
              (engine.playerPos.x >= p.x - 1 &&
                engine.playerPos.x <= p.x + p.w &&
                engine.playerPos.y >= p.y - 1 &&
                engine.playerPos.y <= p.y + p.h)
          );

        if (prop) {
          sfx.select();
          if (prop.id === 'stairs-up') {
            engine.switchHomeFloor('2F');
            return;
          }
          if (engine.callbacks.onBubble) {
            engine.callbacks.onBubble(prop.name, prop.lines.join(' '), prop.action);
          } else {
            engine.callbacks.onDialogue(prop.name, prop.lines);
          }
          engine.wake();
        }
      } else {
        // 2F
        if (
          activeTarget === 'home2f-stairs-down' ||
          ((engine.playerPos.x === 12 || engine.playerPos.x === 13) && engine.playerPos.y <= 2)
        ) {
          engine.switchHomeFloor('1F');
          return;
        }
        const fx = engine.playerPos.x + DIRS[engine.playerDir].x;
        const fy = engine.playerPos.y + DIRS[engine.playerDir].y;
        const prop =
          (activeTarget ? HOME2F_PROPS.find((p) => p.id === activeTarget) : undefined) ||
          HOME2F_PROPS.find(
            (p) =>
              (fx >= p.x && fx < p.x + p.w && fy >= p.y && fy < p.y + p.h) ||
              (engine.playerPos.x >= p.x - 1 &&
                engine.playerPos.x <= p.x + p.w &&
                engine.playerPos.y >= p.y - 1 &&
                engine.playerPos.y <= p.y + p.h)
          );

        if (prop) {
          sfx.select();
          if (prop.id === 'home2f-stairs-down') {
            engine.switchHomeFloor('1F');
            return;
          }
          if (prop.id === 'home2f-fridge') {
            document.dispatchEvent(new CustomEvent('town:fridge'));
          }
          if (prop.id === 'home2f-computer') {
            document.dispatchEvent(new CustomEvent('town:desk'));
          }
          if (engine.callbacks.onBubble) {
            engine.callbacks.onBubble(prop.name, prop.lines.join(' '), prop.action);
          } else {
            engine.callbacks.onDialogue(prop.name, prop.lines);
          }
          engine.wake();
        }
      }
      return;
    }

    const fx = engine.playerPos.x + DIRS[engine.playerDir].x;
    const fy = engine.playerPos.y + DIRS[engine.playerDir].y;

    const arenaCfg = townConfig.getBuilding('arena');
    const aceX = arenaCfg ? arenaCfg.x + Math.floor(arenaCfg.w / 2) - 1 : 28;
    const aceY = arenaCfg ? arenaCfg.y + 1 : 17;

    // 1. Check NPC
    const npc =
      (activeTarget ? engine.map.npcs.find((n) => n.id === activeTarget || (n as any).subType === activeTarget) : undefined) ||
      engine.map.npcs.find((n) => {
        const cfg = townConfig.getBuilding(n.id);
        const nx = cfg ? cfg.x : (n.id === 'ace' ? aceX : n.x);
        const ny = cfg ? cfg.y : (n.id === 'ace' ? aceY : n.y);
        const nw = cfg?.w ?? (['lugia', 'charizard', 'dialga', 'palkia', 'giratina', 'rayquaza', 'arceus', 'tyranitar', 'garchomp', 'urshifu', 'groudon', 'kyogre', 'reshiram', 'zekrom', 'samurott', 'gyarados', 'snorlax', 'latias'].includes(n.id) ? 2 : 1);
        const nh = cfg?.h ?? (['lugia', 'charizard', 'dialga', 'palkia', 'giratina', 'rayquaza', 'arceus', 'tyranitar', 'garchomp', 'urshifu', 'groudon', 'kyogre', 'reshiram', 'zekrom', 'samurott', 'gyarados', 'snorlax', 'latias'].includes(n.id) ? 2 : 1);
        const inFacing = fx >= nx && fx < nx + nw && fy >= ny && fy < ny + nh;
        const isAdjacent = (
          engine.playerPos.x >= nx - 1 &&
          engine.playerPos.x <= nx + nw &&
          engine.playerPos.y >= ny - 1 &&
          engine.playerPos.y <= ny + nh
        );
        return inFacing || isAdjacent;
      });
    if (npc) {
      sfx.select();
      if (npc.id === 'rayquaza' || (npc as any).subType === 'rayquaza') {
        sfx.select();
        const rayquazaActions: BubbleAction[] = [
          {
            label: '⚡ Deru Badai (Delta Stream)',
            onClick: () => engine.triggerSignatureMove('rayquaza', (npc as any).x, (npc as any).y),
          },
          {
            label: '🤝 Ajak Jalan Bersama',
            onClick: () => engine.setActiveFollower('rayquaza'),
          },
        ];
        if (engine.callbacks.onBubble) {
          engine.callbacks.onBubble(
            'Rayquaza Sang Naga Langit 🐉',
            'Kyyyaaaarrrr-shooo...! 🐉 Aura zamrud naga langit berputar megah di angkasa. [Tech Guardian: DevOps, CI/CD Cloud Pipelines & High-Availability] Mengarungi stratosfer awan menjaga stabilitas uptime sistem 99.99%!',
            rayquazaActions
          );
        } else {
          engine.callbacks.onDialogue('Rayquaza Sang Naga Langit 🐉', [
            'RAYQUAZA: "Kyyyaaaarrrr-shooo...!" 🐉',
            'Tech Guardian: DevOps, CI/CD Cloud Pipelines & High-Availability.',
          ]);
        }
        document.dispatchEvent(new CustomEvent('town:rayquaza'));
        engine.wake();
        return;
      }
      if (npc.id === 'garchomp' || (npc as any).subType === 'garchomp') {
        sfx.select();
        const garchompActions: BubbleAction[] = [
          {
            label: '⚡ Tebasan Naga (Dragon Claw)',
            onClick: () => engine.triggerSignatureMove('garchomp', (npc as any).x, (npc as any).y),
          },
          {
            label: '🤝 Ajak Jalan Bersama',
            onClick: () => engine.setActiveFollower('garchomp'),
          },
        ];
        if (engine.callbacks.onBubble) {
          engine.callbacks.onBubble(
            'Garchomp Sang Predator Darat 🦈',
            'Gyaaa-shhh...! 🦈 Sayap sirip tajam Garchomp berdesir membelah angin. [Tech Guardian: High-Speed Algorithms, Optimization & Clean Code] Bergerak secepat jet tempur supersonik mengeksekusi logika komputasi!',
            garchompActions
          );
        } else {
          engine.callbacks.onDialogue('Garchomp Sang Predator Darat 🦈', [
            'GARCHOMP: "Gyaaa-shhh...!" 🦈',
            'Tech Guardian: High-Speed Algorithms, Optimization & Clean Code.',
          ]);
        }
        document.dispatchEvent(new CustomEvent('town:garchomp'));
        engine.wake();
        return;
      }
      if (
        npc.id === 'urshifu' ||
        (npc as any).subType === 'urshifu' ||
        npc.id === 'urshifu_gmax' ||
        (npc as any).subType === 'urshifu_gmax'
      ) {
        sfx.select();
        const urshifuActions: BubbleAction[] = [
          {
            label: '⚡ Serbuan Beruntun (G-Max Rapid Flow)',
            onClick: () => engine.triggerSignatureMove('urshifu', (npc as any).x, (npc as any).y),
          },
          {
            label: '🤝 Ajak Jalan Bersama',
            onClick: () => engine.setActiveFollower('urshifu'),
          },
        ];
        if (engine.callbacks.onBubble) {
          engine.callbacks.onBubble(
            'Urshifu G-Max Rapid Strike 🌊',
            'Hssshaaarrr-kwooo...! 🌊 Aliran deras jurus Rapid Strike bergemuruh di sekitar sang Master Wushu. [Tech Guardian: Agile Execution, Rapid Prototyping & Flow State UI/UX] Menghadirkan solusi kilat yang kokoh dan tepat sasaran.',
            urshifuActions
          );
        } else {
          engine.callbacks.onDialogue('Urshifu G-Max Rapid Strike 🌊', [
            'URSHIFU: "Hssshaaarrr-kwooo...!" 🌊',
            'Tech Guardian: Agile Execution, Rapid Prototyping & Flow State UI/UX.',
          ]);
        }
        document.dispatchEvent(new CustomEvent('town:urshifu'));
        engine.wake();
        return;
      }
      if (npc.id === 'dialga' || (npc as any).subType === 'dialga') {
        sfx.select();
        const dialgaActions: BubbleAction[] = [
          {
            label: '⚡ Dentang Waktu (Roar of Time)',
            onClick: () => engine.triggerSignatureMove('dialga', npc.x, npc.y),
          },
          {
            label: '🤝 Ajak Jalan Bersama',
            onClick: () => engine.setActiveFollower('dialga'),
          },
        ];
        if (engine.callbacks.onBubble) {
          engine.callbacks.onBubble(
            'Dialga (The Temporal Pokémon) ⏳🔷',
            'Gugyugubah...! ⏳🔷 Kristal berlian di dada Dialga memancarkan denyut waktu kosmik. [Tech Guardian: Time-Critical Backend, Rust/WASM & Microservices] Mengatur latensi real-time, sinkronisasi data presisi, dan arsitektur konkurensi di Zulfan\'s Town.',
            dialgaActions
          );
        } else {
          engine.callbacks.onDialogue('Dialga Sang Penguasa Waktu ⏳🔷', [
            'DIALGA: "Gugyugubah...!" ⏳🔷',
            'Tech Guardian: Time-Critical Backend, Rust/WASM & Microservices.',
            'Kristal berlian memancarkan denyut Roar of Time menjaga setiap detik evolusi teknologi.',
          ]);
        }
        document.dispatchEvent(new CustomEvent('town:dialga'));
        engine.wake();
        return;
      }
      if (npc.id === 'palkia' || (npc as any).subType === 'palkia') {
        sfx.select();
        const palkiaActions: BubbleAction[] = [
          {
            label: '⚡ Riak Dimensi (Spacial Rend)',
            onClick: () => engine.triggerSignatureMove('palkia', npc.x, npc.y),
          },
          {
            label: '🤝 Ajak Jalan Bersama',
            onClick: () => engine.setActiveFollower('palkia'),
          },
        ];
        if (engine.callbacks.onBubble) {
          engine.callbacks.onBubble(
            'Palkia (The Spatial Pokémon) 🌌💧',
            'Gyaaa-ooohhn...! 🌌💧 Mutiara kosmik di pundak Palkia bergetar memancarkan gelombang ruang. [Tech Guardian: Spatial Computing & Distributed Cloud Infrastructure] Menghubungkan setiap simpul arsitektur awan tanpa batas dimensi.',
            palkiaActions
          );
        } else {
          engine.callbacks.onDialogue('Palkia Sang Penguasa Ruang 🌌💧', [
            'PALKIA: "Gyaaa-ooohhn...!" 🌌💧',
            'Tech Guardian: Spatial Computing, Distributed Systems & High-Speed Cloud Networking.',
            'Mutiara kosmik menenun struktur konektivitas terdistribusi di Zulfan\'s Town.',
          ]);
        }
        document.dispatchEvent(new CustomEvent('town:palkia'));
        engine.wake();
        return;
      }
      if (npc.id === 'giratina' || (npc as any).subType === 'giratina') {
        sfx.select();
        const giratinaActions: BubbleAction[] = [
          {
            label: '⚡ Gemuruh Shadow Force',
            onClick: () => engine.triggerSignatureMove('giratina', npc.x, npc.y),
          },
          {
            label: '🤝 Ajak Jalan Bersama',
            onClick: () => engine.setActiveFollower('giratina'),
          },
        ];
        if (engine.callbacks.onBubble) {
          engine.callbacks.onBubble(
            'Giratina (The Renegade Pokémon) 👻🌌',
            'Gyaaa-shhhooo...! 👻🌌 Portal bayangan antimateri berputar di bawah mantel Giratina. [Tech Guardian: Fault Tolerance, Chaos Engineering & Resilient Rollback] Menguji ketangguhan sistem dari celah dimensi yang tak terduga.',
            giratinaActions
          );
        } else {
          engine.callbacks.onDialogue('Giratina Sang Penguasa Distorsi 👻🌌', [
            'GIRATINA: "Gyaaa-shhhooo...!" 👻🌌',
            'Tech Guardian: Fault Tolerance & Resilient Chaos Engineering.',
          ]);
        }
        document.dispatchEvent(new CustomEvent('town:giratina'));
        engine.wake();
        return;
      }
      if (npc.id === 'zekrom' || (npc as any).subType === 'zekrom') {
        sfx.select();
        const zekromActions: BubbleAction[] = [
          {
            label: '⚡ Kilatan Fusion Bolt',
            onClick: () => engine.triggerSignatureMove('zekrom', npc.x, npc.y),
          },
          {
            label: '🤝 Ajak Jalan Bersama',
            onClick: () => engine.setActiveFollower('zekrom'),
          },
        ];
        if (engine.callbacks.onBubble) {
          engine.callbacks.onBubble(
            'Zekrom (The Deep Black Pokémon) 🖤⚡',
            'Bzzzz-Vrrrooom...! 🖤⚡ Generator petir Zekrom berputar kencang. [Tech Guardian: Scalable Cloud Architecture & High-Voltage Compute] Memberikan daya komputasi raksasa untuk memproses data masif tanpa jeda.',
            zekromActions
          );
        } else {
          engine.callbacks.onDialogue('Zekrom Sang Naga Idealisme 🖤⚡', [
            'ZEKROM: "Bzzzz-Vrrrooom...!" 🖤⚡',
            'Tech Guardian: Scalable Cloud Architecture & High-Voltage Compute.',
          ]);
        }
        document.dispatchEvent(new CustomEvent('town:zekrom'));
        engine.wake();
        return;
      }
      if (npc.id === 'reshiram' || (npc as any).subType === 'reshiram') {
        sfx.select();
        const reshiramActions: BubbleAction[] = [
          {
            label: '⚡ Kobaran Fusion Flare',
            onClick: () => engine.triggerSignatureMove('reshiram', npc.x, npc.y),
          },
          {
            label: '🤝 Ajak Jalan Bersama',
            onClick: () => engine.setActiveFollower('reshiram'),
          },
        ];
        if (engine.callbacks.onBubble) {
          engine.callbacks.onBubble(
            'Reshiram (The Vast White Pokémon) 🤍🔥',
            'Vaaa-zhooom...! 🤍🔥 Ekor turbin Reshiram membara dengan api kebenaran murni. [Tech Guardian: Code Integrity, Rigorous Testing & Clean Architecture] Memastikan setiap baris kode terverifikasi bersih dan bebas kerentanan.',
            reshiramActions
          );
        } else {
          engine.callbacks.onDialogue('Reshiram Sang Naga Kebenaran 🤍🔥', [
            'RESHIRAM: "Vaaa-zhooom...!" 🤍🔥',
            'Tech Guardian: Code Integrity, Rigorous Testing & Clean Architecture.',
          ]);
        }
        document.dispatchEvent(new CustomEvent('town:reshiram'));
        engine.wake();
        return;
      }
      if (npc.id === 'arceus') {
        sfx.select();
        const arceusActions: BubbleAction[] = [
          {
            label: '⚡ Cahaya Kosmik (Judgment)',
            onClick: () => engine.triggerSignatureMove('arceus', npc.x, npc.y),
          },
          {
            label: '🤝 Ajak Jalan Bersama',
            onClick: () => engine.setActiveFollower('arceus'),
          },
        ];
        if (engine.callbacks.onBubble) {
          engine.callbacks.onBubble(
            'Arceus (The Alpha Pokémon) 🌟',
            'Dooo-oooonnn...! ✨ Pendaran cahaya keemasan cincin kosmik berputar agung di atas pelataran Dev Center. [Tech Guardian: Enterprise System Architecture & End-to-End Product Vision] Merancang fondasi ekosistem software menyeluruh dari rancangan arsitektur hingga tahap produksi global.',
            arceusActions
          );
        } else {
          engine.callbacks.onDialogue('Arceus Sang Pencipta 🌟', [
            'ARCEUS: "Dooo-oooonnn...!" ✨',
            'Tech Guardian: Enterprise System Architecture & End-to-End Product Vision.',
          ]);
        }
        engine.wake();
        return;
      }
      if (npc.id === 'charizard' || npc.id === 'lebron') {
        sfx.select();
        const charizardActions: BubbleAction[] = [
          {
            label: '⚡ Semburan Api (Flamethrower)',
            onClick: () => engine.triggerSignatureMove('charizard', npc.x, npc.y),
          },
          {
            label: '🤝 Ajak Jalan Bersama',
            onClick: () => engine.setActiveFollower('charizard'),
          },
          {
            label: '🔥 Mulai Encounter Battle',
            onClick: () => document.dispatchEvent(new CustomEvent('town:charizard')),
          },
        ];
        if (engine.callbacks.onBubble) {
          engine.callbacks.onBubble(
            'Charizard Sang Naga Api 🔥',
            'GRAAAWWWRRR...! 🔥 Ekor api Charizard membakar semangat petualang di alun-alun kota! [Tech Guardian: Full-Stack Web Engineering & Scalable Cloud Apps] Menghadirkan aplikasi web modern yang cepat, tangguh, dan membakar habis setiap bug!',
            charizardActions
          );
        } else {
          engine.callbacks.onDialogue('Charizard Sang Naga Api 🔥', npc.lines, () =>
            document.dispatchEvent(new CustomEvent('town:charizard'))
          );
        }
        engine.wake();
        return;
      }
      if (npc.id === 'ranger' || npc.id === 'tyranitar' || (npc as any).subType === 'tyranitar') {
        sfx.select();
        const tyranitarActions: BubbleAction[] = [
          {
            label: '⚡ Badai Pasir (Sandstorm)',
            onClick: () => engine.triggerSignatureMove('tyranitar', npc.x, npc.y),
          },
          {
            label: '🤝 Ajak Jalan Bersama',
            onClick: () => engine.setActiveFollower('tyranitar'),
          },
        ];
        if (engine.callbacks.onBubble) {
          engine.callbacks.onBubble(
            'Tyranitar Sang Pelindung Zirah 🪨',
            'Gwoooaaargh! 🪨 Tubuh zirah batu baja Tyranitar kokoh tak tergoyahkan menjaga perbatasan Zulfan\'s Town. [Tech Guardian: Bulletproof Security, Resilient Database & Infrastructure] Kokoh bertahan dari segala spike traffic dan ancaman siber!',
            tyranitarActions
          );
        } else {
          engine.callbacks.onDialogue('Tyranitar Sang Pelindung Zirah 🪨', npc.lines);
        }
        engine.wake();
        return;
      }
      if (npc.id === 'ace' || npc.id === 'mewtwo' || (npc as any).subType === 'mewtwo') {
        sfx.select();
        const mewtwoActions: BubbleAction[] = [
          {
            label: '⚡ Gelombang Psikis (Psystrike)',
            onClick: () => engine.triggerSignatureMove('mewtwo', npc.x, npc.y),
          },
          {
            label: '🤝 Ajak Jalan Bersama',
            onClick: () => engine.setActiveFollower('mewtwo'),
          },
          {
            label: '⚔️ Uji Tech Challenge Quiz',
            onClick: () => document.dispatchEvent(new CustomEvent('town:arena-quiz')),
          },
        ];
        if (engine.callbacks.onBubble) {
          engine.callbacks.onBubble(
            'Mewtwo Sang Penantang 🔮',
            'Saya tidak diciptakan untuk kalah. Pikiran manusia ini... menarik. [Tech Guardian: AI Agents, LLM Orchestration & Deep Learning] Menguasai penalaran multi-agent cerdas dan otomatisasi AI melampaui komputasi biasa.',
            mewtwoActions
          );
        } else {
          engine.callbacks.onDialogue('Mewtwo Sang Penantang 🔮', npc.lines, () =>
            document.dispatchEvent(new CustomEvent('town:arena-quiz'))
          );
        }
        engine.wake();
        return;
      }
      if (npc.id === 'twin') {
        sfx.select();
        gameStore.addStamp('twin');
        const twinActions: BubbleAction[] = [
          {
            label: '⚡ Bola Aura (Aura Sphere)',
            onClick: () => engine.triggerSignatureMove('lucario', npc.x, npc.y),
          },
          {
            label: '🤝 Ajak Jalan Bersama',
            onClick: () => engine.setActiveFollower('lucario'),
          },
          {
            label: '💬 Buka Digital Twin AI',
            href: '/twin',
          },
        ];
        if (engine.callbacks.onBubble) {
          engine.callbacks.onBubble(
            'Digital Twin & Lucario 🌀',
            'Aura Zulfan beresonansi kuat di sini! [Tech Guardian: Intuitive UI/UX Design & Human-Centric Frontend] Merasakan kebutuhan pengguna secara empatik dan menghadirkan interaksi digital yang memikat.',
            twinActions
          );
        } else {
          engine.callbacks.onDialogue('Digital Twin & Lucario 🌀', npc.lines, () =>
            engine.callbacks.onNavigate('/twin')
          );
        }
        engine.wake();
        return;
      }
      if (npc.id === 'groudon' || (npc as any).subType === 'groudon') {
        sfx.select();
        const groudonLines = [
          'GROUDON: "Gwoooaaarrr-ghuuu...!" 🌋🔥',
          'Di pelataran daratan Zulfan\'s Town, Groudon Sang Penguasa Magma & Benua berdiri kokoh nan perkasa.',
          'Aura panas Desolate Land memancar dari alur garis hitam di tubuh merah crimsonnya, mengeringkan kabut dan memadatkan magma menjadi daratan kokoh.',
          'Dalam mitologi Hoenn purba, Groudon adalah Pokémon Legendaris yang menciptakan dan memperluas benua alam semesta.',
        ];
        const groudonActions: BubbleAction[] = [
          {
            label: '⚡ Gemuruh Magma Precipice Blades',
            onClick: () => engine.triggerSignatureMove('groudon', npc.x, npc.y),
          },
          {
            label: '🤝 Ajak Jalan Bersama',
            onClick: () => engine.setActiveFollower('groudon'),
          },
        ];
        if (engine.callbacks.onBubble) {
          engine.callbacks.onBubble(
            'Groudon (The Continent Pokémon) 🌋🔥',
            'Gwoooaaarrr-ghuuu...! 🌋🔥 (Kerak bumi bergetar dan gelombang panas Desolate Land memancar dari tubuh Groudon. Sang Penguasa Daratan menjaga kestabilan pondasi benua di Zulfan\'s Town.)',
            groudonActions
          );
        } else {
          engine.callbacks.onDialogue('Groudon Sang Penguasa Daratan 🌋🔥', groudonLines);
        }
        document.dispatchEvent(new CustomEvent('town:groudon'));
        engine.wake();
        return;
      }
      if (npc.id === 'kyogre' || (npc as any).subType === 'kyogre') {
        sfx.select();
        const kyogreLines = [
          'KYOGRE: "Gyaaa-oooh-shuuu...!" 🌊💧',
          'Di perairan dan pesisir Zulfan\'s Town, Kyogre Sang Penguasa Samudra & Palung Laut melayang dengan anggun.',
          'Aura hujan lebat Primordial Sea memancar dari guratan merah di sirip lebarnya, mengisi sumber mata air dan menjaga kedalaman samudra tanpa batas.',
          'Dalam mitologi Hoenn purba, Kyogre dipuja sebagai pencipta lautan luas yang mempertemukan pulau-pulau di alam semesta.',
        ];
        const kyogreActions: BubbleAction[] = [
          {
            label: '⚡ Gelombang Samudra Origin Pulse',
            onClick: () => engine.triggerSignatureMove('kyogre', npc.x, npc.y),
          },
          {
            label: '🤝 Ajak Jalan Bersama',
            onClick: () => engine.setActiveFollower('kyogre'),
          },
        ];
        if (engine.callbacks.onBubble) {
          engine.callbacks.onBubble(
            'Kyogre (The Sea Basin Pokémon) 🌊💧',
            'Gyaaa-oooh-shuuu...! 🌊💧 (Deru ombak samudra dan rintik hujan Primordial Sea memancar dari sirip Kyogre. Sang Penguasa Samudra menjaga kemurnian aliran air di Zulfan\'s Town.)',
            kyogreActions
          );
        } else {
          engine.callbacks.onDialogue('Kyogre Sang Penguasa Samudra 🌊💧', kyogreLines);
        }
        document.dispatchEvent(new CustomEvent('town:kyogre'));
        engine.wake();
        return;
      }
      if (npc.id === 'latios' || (npc as any).subType === 'latios') {
        sfx.select();
        const latiosLines = [
          'LATIOS: "Shwiii-shooo...!" ✈️🔷',
          'Di angkasa Zulfan\'s Town, Latios Sang Pokémon Eon melayang dengan aerodinamika supersonik.',
          'Bentuk tubuhnya yang ramping seperti pesawat jet memungkinkannya melesat melebihi kecepatan suara sambil memproyeksikan telepati kedamaian.',
          'Dalam legenda Hoenn dan Alto Mare, Latios adalah pelindung berhati murni yang menjaga Soul Dew demi keselamatan seluruh kota.',
        ];
        const latiosActions: BubbleAction[] = [
          {
            label: '⚡ Kecepatan Jet Luster Purge',
            onClick: () => engine.triggerSignatureMove('latios', npc.x, npc.y),
          },
          {
            label: '🤝 Ajak Jalan Bersama',
            onClick: () => engine.setActiveFollower('latios'),
          },
        ];
        if (engine.callbacks.onBubble) {
          engine.callbacks.onBubble(
            'Latios (The Eon Pokémon) ✈️🔷',
            'Shwiii-shooo...! ✈️🔷 (Sayap jet Latios berpendar memancarkan gelombang psikis aerodinamis. Sang Penjaga Jiwa dan Cahaya mengawasi Zulfan\'s Town dengan kecepatan kilat.)',
            latiosActions
          );
        } else {
          engine.callbacks.onDialogue('Latios Sang Penjelajah Angkasa ✈️🔷', latiosLines);
        }
        document.dispatchEvent(new CustomEvent('town:latios'));
        engine.wake();
        return;
      }
      if (npc.id === 'latias' || (npc as any).subType === 'latias') {
        sfx.select();
        const latiasLines = [
          'LATIAS: "Kyuuu-wiiin...!" 💖✨',
          'Di taman dan angkasa Zulfan\'s Town, Latias Sang Pokémon Eon melayang dengan keanggunan berhati murni.',
          'Bulu halusnya dapat membiaskan cahaya untuk berkamuflase, memancarkan telepati kehangatan dan empati kepada setiap orang.',
          'Dalam legenda Hoenn dan Alto Mare, Latias adalah pelindung lembut nan pemberani yang menjaga keharmonisan kota.',
        ];
        const latiasActions: BubbleAction[] = [
          {
            label: '⚡ Cahaya Mistik Mist Ball',
            onClick: () => engine.triggerSignatureMove('latias', npc.x, npc.y),
          },
          {
            label: '🤝 Ajak Jalan Bersama',
            onClick: () => engine.setActiveFollower('latias'),
          },
        ];
        if (engine.callbacks.onBubble) {
          engine.callbacks.onBubble(
            'Latias (The Eon Pokémon) 💖✨',
            'Kyuuu-wiiin...! 💖✨ (Sayap kemerahan Latias berpendar membiaskan kilau cahaya Refract Light. Sang Pelindung Jiwa menyebarkan aura kedamaian dan kehangatan di Zulfan\'s Town.)',
            latiasActions
          );
        } else {
          engine.callbacks.onDialogue('Latias Sang Pelindung Hati 💖✨', latiasLines);
        }
        document.dispatchEvent(new CustomEvent('town:latias'));
        engine.wake();
        return;
      }
      if (npc.id === 'darkrai' || (npc as any).subType === 'darkrai') {
        sfx.select();
        const darkraiLines = [
          'DARKRAI: "Zzzz-shhhwaaaddd...!" 🌑💤',
          'Di perbatasan bayang-bayang Zulfan\'s Town, Darkrai Sang Pokémon Mistik melayang dalam keheningan malam.',
          'Kabut bayangan hitam pekat berputar di bawah mantelnya. Konon saat bulan baru muncul, Darkrai dapat memicu tidur lelap dan mimpi buruk tak berujung (Dark Void).',
          'Namun di balik reputasinya yang menakutkan, Darkrai bertindak sebagai pelindung tersembunyi yang mengusir marabahaya dari dimensi bayangan.',
        ];
        const darkraiActions: BubbleAction[] = [
          {
            label: '⚡ Dimensi Bayangan Dark Void',
            onClick: () => engine.triggerSignatureMove('darkrai', npc.x, npc.y),
          },
          {
            label: '🤝 Ajak Jalan Bersama',
            onClick: () => engine.setActiveFollower('darkrai'),
          },
        ];
        if (engine.callbacks.onBubble) {
          engine.callbacks.onBubble(
            'Darkrai (The Pitch-Black Pokémon) 🌑💤',
            'Zzzz-shhhwaaaddd...! 🌑💤 (Kabut bayangan hitam berputar di bawah mantel Darkrai. Sang Penguasa Dimensi Mimpi Buruk mengawasi perbatasan Zulfan\'s Town dari balik tirai kegelapan.)',
            darkraiActions
          );
        } else {
          engine.callbacks.onDialogue('Darkrai Sang Penguasa Mimpi Buruk 🌑💤', darkraiLines);
        }
        document.dispatchEvent(new CustomEvent('town:darkrai'));
        engine.wake();
        return;
      }
      if (npc.id === 'necrozma' || (npc as any).subType === 'necrozma' || npc.id === 'necrozma_dusk_mane') {
        sfx.select();
        const necrozmaLines = [
          'NECROZMA (Dusk Mane): "Ggg-rraaa-shhh-kzzzt...!" 🦁☀️',
          'Di pelataran Zulfan\'s Town, wujud fusi perkasa Necrozma Dusk Mane berdiri memancarkan cahaya surya menyilaukan.',
          'Prisma kristal hitam di kepalanya menyerap dan membiaskan energi matahari dari Solgaleo menjadi pancaran daya tak terbatas.',
          'Dalam legenda Alola dan Ultra Megalopolis, Necrozma adalah Pembawa Cahaya legendaris yang menguasai ruang antar-dimensi Ultra Space.',
        ];
        const necrozmaActions: BubbleAction[] = [
          {
            label: '⚡ Cahaya Surya Sunsteel Strike',
            onClick: () => engine.triggerSignatureMove('necrozma', npc.x, npc.y),
          },
          {
            label: '🤝 Ajak Jalan Bersama',
            onClick: () => engine.setActiveFollower('necrozma'),
          },
        ];
        if (engine.callbacks.onBubble) {
          engine.callbacks.onBubble(
            'Necrozma Dusk Mane (The Prism Pokémon) 🦁☀️',
            'Ggg-rraaa-shhh-kzzzt...! 🦁☀️ (Prisma kristal hitam beresonansi dengan surya terang Solgaleo. Necrozma Dusk Mane memancarkan kekuatan cahaya murni Sunsteel Strike yang menerangi Zulfan\'s Town.)',
            necrozmaActions
          );
        } else {
          engine.callbacks.onDialogue('Necrozma Dusk Mane Sang Prisma Surya 🦁☀️', necrozmaLines);
        }
        document.dispatchEvent(new CustomEvent('town:necrozma'));
        engine.wake();
        return;
      }
      if (npc.id === 'lunala' || (npc as any).subType === 'lunala') {
        sfx.select();
        const lunalaLines = [
          'LUNALA: "Mahaaalo-laaa...!" 🌙✨',
          'Di angkasa malam Zulfan\'s Town, Lunala Sang Utusan Rembulan membentangkan sayap sabitnya yang mempesona.',
          'Sayapnya menyerap dan membiaskan cahaya malam menjadi energi kosmik penenang jiwa.',
          'Dalam legenda Alola dan mitologi Ultra Space, Lunala dipuja sebagai pelindung malam yang membawa berkah kedamaian.',
        ];
        const lunalaActions: BubbleAction[] = [
          {
            label: '⚡ Sinar Rembulan Moongeist Beam',
            onClick: () => engine.triggerSignatureMove('lunala', npc.x, npc.y),
          },
          {
            label: '🤝 Ajak Jalan Bersama',
            onClick: () => engine.setActiveFollower('lunala'),
          },
        ];
        if (engine.callbacks.onBubble) {
          engine.callbacks.onBubble(
            'Lunala (The Moone Pokémon) 🌙✨',
            'Mahaaalo-laaa...! 🌙✨ (Sayap bulan sabit Lunala membentang menyerap cahaya malam dalam fase Full Moon. Sang Utusan Rembulan menaburkan debu kosmik starlight yang melindungi Zulfan\'s Town.)',
            lunalaActions
          );
        } else {
          engine.callbacks.onDialogue('Lunala Sang Utusan Rembulan 🌙✨', lunalaLines);
        }
        document.dispatchEvent(new CustomEvent('town:lunala'));
        engine.wake();
        return;
      }
      if (npc.id === 'solgaleo' || (npc as any).subType === 'solgaleo') {
        sfx.select();
        const solgaleoLines = [
          'SOLGALEO: "Laaa-lionnn-shooo...!" ☀️🦁',
          'Di pelataran Zulfan\'s Town, Solgaleo Sang Utusan Mentari berdiri perkasa dengan surai surya yang berkobar.',
          'Surai dan tubuhnya memancarkan energi matahari berlimpah yang menghangatkan seluruh penjuru kota.',
          'Dalam mitologi Alola dan peradaban kuno, Solgaleo disembah sebagai Sang Pemangsa Mentari yang membawa cahaya kehidupan abadi.',
        ];
        const solgaleoActions: BubbleAction[] = [
          {
            label: '⚡ Kilau Surya Sunsteel Corona',
            onClick: () => engine.triggerSignatureMove('solgaleo', npc.x, npc.y),
          },
          {
            label: '🤝 Ajak Jalan Bersama',
            onClick: () => engine.setActiveFollower('solgaleo'),
          },
        ];
        if (engine.callbacks.onBubble) {
          engine.callbacks.onBubble(
            'Solgaleo (The Sunne Pokémon) ☀️🦁',
            'Laaa-lionnn-shooo...! ☀️🦁 (Surai keemasan Solgaleo berkobar terang benderang dalam fase Radiant Sun. Sang Utusan Mentari memancarkan kehangatan surya Sunsteel Strike yang melindungi Zulfan\'s Town.)',
            solgaleoActions
          );
        } else {
          engine.callbacks.onDialogue('Solgaleo Sang Utusan Mentari ☀️🦁', solgaleoLines);
        }
        document.dispatchEvent(new CustomEvent('town:solgaleo'));
        engine.wake();
        return;
      }
      if (npc.id === 'samurott' || (npc as any).subType === 'samurott') {
        sfx.select();
        const samurottLines = [
          'SAMUROTT: "Rrrwooon-kllliiinggg...!" ⚔️🌊',
          'Di pelataran Zulfan\'s Town, Samurott Sang Formidable Seamitar berdiri gagah menghunus pedang kerang Seamitar.',
          'Bilah Seamitar yang terpasang di pelindung kakinya diasah dengan presisi mutlak, siap memotong kode kusut dan rintangan teknis.',
          'Sebagai pelindung Clean Code dan Precision Architecture, Samurott melambangkan ketangguhan dan eksekusi tanpa cela.',
        ];
        const samurottActions: BubbleAction[] = [
          {
            label: '⚔️ Tebasan Kerang Razor Shell',
            onClick: () => engine.triggerSignatureMove('samurott', npc.x, npc.y),
          },
          {
            label: '🤝 Ajak Jalan Bersama',
            onClick: () => engine.setActiveFollower('samurott'),
          },
        ];
        if (engine.callbacks.onBubble) {
          engine.callbacks.onBubble(
            'Samurott (Formidable Seamitar) ⚔️🌊',
            'Rrrwooon-kllliiinggg...! ⚔️🌊 (Samurott menghunus pedang kerang Seamitar berkecepatan kilat. Ombak air berputar membentuk tebasan Razor Shell presisi tinggi yang melindungi Zulfan\'s Town.)',
            samurottActions
          );
        } else {
          engine.callbacks.onDialogue('Samurott Formidable Seamitar ⚔️🌊', samurottLines);
        }
        document.dispatchEvent(new CustomEvent('town:samurott'));
        engine.wake();
        return;
      }
      if (npc.id === 'charizard' || npc.id === 'lebron' || npc.action?.kind === 'event') {
        const evt = npc.action?.kind === 'event' ? npc.action.name : npc.id;
        document.dispatchEvent(new CustomEvent(`town:${evt}`));
        engine.wake();
        return;
      }
      if (engine.callbacks.onBubble) {
        let action: { label: string; href?: string; onClick?: () => void } | undefined;
        if (npc.action) {
          if (npc.action.kind === 'navigate') {
            action = { label: 'Talk / Enter', href: npc.action.route };
          } else if (npc.action.kind === 'refill') {
            action = { label: 'Refill Poké Balls', onClick: () => engine.callbacks.onRefill() };
          } else if (npc.action.kind === 'open') {
            const t = npc.action.target;
            action = { label: `Open ${t.toUpperCase()}`, onClick: () => engine.callbacks.onOpenModal(t) };
          }
        }
        engine.callbacks.onBubble(npc.name, npc.lines.join(' '), action);
      } else {
        let onAction: (() => void) | undefined;
        if (npc.action) {
          if (npc.action.kind === 'navigate') {
            const r = npc.action.route;
            onAction = () => engine.callbacks.onNavigate(r);
          } else if (npc.action.kind === 'refill') {
            onAction = () => engine.callbacks.onRefill();
          } else if (npc.action.kind === 'open') {
            const t = npc.action.target;
            onAction = () => engine.callbacks.onOpenModal(t);
          }
        }
        engine.callbacks.onDialogue(npc.name, npc.lines, onAction);
      }
      engine.wake();
      return;
    }

    // 1b. Hidden PokéBall Items & Highland Summit Vista Point in Town Overworld
    if (engine.currentScene === 'town') {
      const foundSet = getFoundHiddenPokeballs();
      const hitLoot = HIDDEN_POKEBALL_ITEMS.find(
        (item) =>
          !foundSet.has(item.id) &&
          (activeTarget === item.id || (item.x === fx && item.y === fy))
      );
      if (hitLoot) {
        markHiddenPokeballFound(hitLoot.id);
        engine.map.collision[hitLoot.y * engine.map.w + hitLoot.x] = 0;
        engine.townBackgroundCanvas = null;
        const totalBalls = gameStore.addBalls(hitLoot.ballsReward);
        sfx.heal();
        engine.spawnFlyBurst(hitLoot.x, hitLoot.y);
        const remaining = HIDDEN_POKEBALL_ITEMS.length - getFoundHiddenPokeballs().size;
        const msg = `${hitLoot.lore} (+${hitLoot.ballsReward} Poké Balls · Total di tas: ${totalBalls} 🎒 · Sisa harta tersembunyi di dunia luar: ${remaining}/${HIDDEN_POKEBALL_ITEMS.length})`;
        if (engine.callbacks.onBubble) {
          engine.callbacks.onBubble(`🎁 ${hitLoot.name}`, msg);
        } else {
          engine.callbacks.onDialogue(hitLoot.name, [msg]);
        }
        engine.wake();
        return;
      }

      const isAtVista =
        activeTarget === SUMMIT_VISTA_POINT.id ||
        (fx === SUMMIT_VISTA_POINT.x && fy === SUMMIT_VISTA_POINT.y) ||
        (engine.playerPos.x === SUMMIT_VISTA_POINT.x && engine.playerPos.y === SUMMIT_VISTA_POINT.y);
      if (isAtVista) {
        sfx.heal();
        engine.spawnFlyBurst(SUMMIT_VISTA_POINT.x, SUMMIT_VISTA_POINT.y);
        const nextAtmo =
          engine.townAtmosphere === 'day'
            ? 'Sunset'
            : engine.townAtmosphere === 'sunset'
              ? 'Night'
              : 'Day';
        const vistaAction = {
          label: `🌅 Ubah Suasana ke ${nextAtmo}`,
          onClick: () => {
            engine.cycleAtmosphere();
            engine.wake();
          },
        };
        if (engine.callbacks.onBubble) {
          engine.callbacks.onBubble(SUMMIT_VISTA_POINT.title, SUMMIT_VISTA_POINT.text, vistaAction);
        } else {
          engine.callbacks.onDialogue(SUMMIT_VISTA_POINT.title, [SUMMIT_VISTA_POINT.text]);
        }
        engine.wake();
        return;
      }
    }

    // 2. Check Sign
    const sign =
      (activeTarget ? engine.map.signs.find((s) => s.id === activeTarget) : undefined) ||
      engine.map.signs.find((s) => {
        if (s.id === 'digidex-console' && engine.currentScene === 'digimon') {
          return (
            fx >= DIGI_PLAZA_CONSOLE.x &&
            fx < DIGI_PLAZA_CONSOLE.x + DIGI_PLAZA_CONSOLE.w &&
            fy >= DIGI_PLAZA_CONSOLE.y &&
            fy < DIGI_PLAZA_CONSOLE.y + DIGI_PLAZA_CONSOLE.h
          );
        }
        return s.x === fx && s.y === fy;
      });
    if (sign) {
      sfx.select();
      if (sign.id === 'digidex-console') {
        const placedDigi = townConfig.getBuildings().filter((b) => b.kind === 'digimon' && !b.hidden);
        const liveText = `DIGIDEX MASTER CONSOLE — Digi-Sanctuary Island (40×45). Detected ${placedDigi.length} Digimon entities placed on the island & ${DIGIMON_CATALOG.length} active Digimon in Catalog (Tier 1–4).`;
        const consoleActions = [
          {
            label: '📖 Open DigiDex Showcase & Roster',
            onClick: () => {
              window.dispatchEvent(
                new CustomEvent('digimon:open-modal', { detail: { mode: 'roster' } })
              );
            },
          },
          {
            label: '🛠️ Open Town Editor (E)',
            onClick: () => window.dispatchEvent(new CustomEvent('town:toggle-editor')),
          },
        ];
        if (engine.callbacks.onBubble) {
          engine.callbacks.onBubble(sign.name, liveText, consoleActions);
        } else {
          engine.callbacks.onDialogue(sign.name, [liveText]);
        }
        engine.wake();
        return;
      }
      if (engine.callbacks.onBubble) {
        let action:
          | { label: string; href?: string; onClick?: () => void }
          | { label: string; href?: string; onClick?: () => void }[]
          | undefined;
        if (sign.action) {
          if (sign.action.kind === 'navigate') {
            action = { label: `Open ${sign.name}`, href: sign.action.route };
          } else if (sign.action.kind === 'open') {
            const t = sign.action.target;
            action = { label: `Open ${sign.name}`, onClick: () => engine.callbacks.onOpenModal(t) };
          } else if (sign.action.kind === 'event') {
            const evt = sign.action.name;
            action = [
              {
                label: '🚪 Enter Poké-Café & Bar (/cafe)',
                href: '/cafe',
              },
              {
                label: '☕ Order Dev Roast (+100 Energy)',
                onClick: () => {
                  sfx.espressoBrew();
                  engine.callbacks.onRefill();
                  document.dispatchEvent(new CustomEvent(`town:${evt}`));
                },
              },
            ];
          }
        }
        engine.callbacks.onBubble(sign.name, sign.lines.join(' '), action);
      } else {
        let onAction: (() => void) | undefined;
        if (sign.action) {
          if (sign.action.kind === 'navigate') {
            const r = sign.action.route;
            onAction = () => engine.callbacks.onNavigate(r);
          } else if (sign.action.kind === 'open') {
            const t = sign.action.target;
            onAction = () => engine.callbacks.onOpenModal(t);
          }
        }
        engine.callbacks.onDialogue(sign.name, sign.lines, onAction);
      }
      engine.wake();
      return;
    }

    // 2a. Check dynamic building entrance doors
    for (const b of townConfig.getBuildings()) {
      if (b.hidden || b.kind !== 'building' || !b.link) continue;
      const doorX = b.doorX !== undefined ? b.doorX : b.x + Math.floor(b.w / 2);
      const doorY = b.doorY !== undefined ? b.doorY : b.y + b.h;
      const route = b.link;

      const isFacingDoor = (fx === doorX && fy === doorY) || (b.w >= 6 && fx === doorX - 1 && fy === doorY);
      const isAtEntrance = (engine.playerDir === 'up' && engine.playerPos.y === doorY + 1 && (engine.playerPos.x === doorX || (b.w >= 6 && engine.playerPos.x === doorX - 1)));
      const isStandingOnDoor = (engine.playerPos.x === doorX && engine.playerPos.y === doorY) || (b.w >= 6 && engine.playerPos.x === doorX - 1 && engine.playerPos.y === doorY);

      if (isFacingDoor || isAtEntrance || isStandingOnDoor) {
        sfx.door();
        engine.callbacks.onNavigate(route);
        engine.wake();
        return;
      }
    }

    // Static door fallback in interactFacing: only if building hasn't moved
    for (const b of engine.map.buildings) {
      const cfg = townConfig.getBuilding(b.id);
      if (cfg && (cfg.x !== b.x || cfg.y !== b.y || cfg.hidden)) continue;
      if (Array.isArray(b.doors)) {
        for (const d of b.doors) {
          if ((fx === d.x && fy === d.y) || (engine.playerPos.x === d.x && engine.playerPos.y === d.y)) {
            sfx.door();
            engine.callbacks.onNavigate(cfg?.link ?? b.route ?? '/');
            engine.wake();
            return;
          }
        }
      }
    }

    // 2b. Check Custom Placed Objects, NPCs, Signs, Props from townConfig (plus Kingdoms built-in landmark triggers)
    const matchedKingdomLandmark =
      engine.currentScene === 'kingdom'
        ? KINGDOM_LANDMARKS.find(
          (lm) =>
            (activeTarget && (lm.id === activeTarget || lm.subType === activeTarget)) ||
            (engine.playerPos.x === lm.interactX && engine.playerPos.y === lm.interactY) ||
            (fx === lm.interactX && fy === lm.interactY - 1)
        )
        : undefined;

    const matchedHarbourLandmark =
      engine.currentScene === 'harbour'
        ? HARBOUR_LANDMARKS.find(
          (lm) =>
            (activeTarget && lm.id === activeTarget) ||
            (engine.playerPos.x === lm.interactX && engine.playerPos.y === lm.interactY) ||
            (fx === lm.interactX && fy === lm.interactY - 1)
        )
        : undefined;

    const matchedSkyLandmark =
      engine.currentScene === 'sky-castle'
        ? SKY_CASTLE_LANDMARKS.find(
          (lm) =>
            (activeTarget && lm.id === activeTarget) ||
            (engine.playerPos.x === lm.interactX && engine.playerPos.y === lm.interactY) ||
            (fx === lm.interactX && fy === lm.interactY - 1)
        )
        : undefined;

    const matchedDarkLandmark =
      engine.currentScene === 'dark-castle'
        ? DARK_CASTLE_LANDMARKS.find(
          (lm) =>
            (activeTarget && lm.id === activeTarget) ||
            (engine.playerPos.x === lm.interactX && engine.playerPos.y === lm.interactY) ||
            (fx === lm.interactX && fy === lm.interactY - 1)
        )
        : undefined;

    const customPlaced =
      (activeTarget
        ? townConfig.getBuildings().find((b) => !b.hidden && (b.id === activeTarget || b.subType === activeTarget))
        : undefined) ||
      townConfig.getBuildings().find((b) => {
        if (b.hidden) return false;
        // Skip major indoor buildings which have their own doors
        if (['dev', 'lab', 'home', 'shop', 'arcade', 'reception', 'office', 'tower'].includes(b.id)) return false;
        const anchor =
          b.kind === 'digimon'
            ? engine.digimonPatrol.getInteractAnchor(b)
            : { x: b.x, y: b.y, w: b.w, h: b.h };
        const inFacing = fx >= anchor.x && fx < anchor.x + anchor.w && fy >= anchor.y && fy < anchor.y + anchor.h;
        const isAdjacent = (
          engine.playerPos.x >= anchor.x - 1 &&
          engine.playerPos.x <= anchor.x + anchor.w &&
          engine.playerPos.y >= anchor.y - 1 &&
          engine.playerPos.y <= anchor.y + anchor.h
        );
        return inFacing || isAdjacent;
      }) ||
      (matchedKingdomLandmark
        ? {
          id: matchedKingdomLandmark.id,
          name: matchedKingdomLandmark.name,
          subType: matchedKingdomLandmark.subType,
          kind: 'building' as const,
          x: matchedKingdomLandmark.x,
          y: matchedKingdomLandmark.y,
          w: matchedKingdomLandmark.w,
          h: matchedKingdomLandmark.h,
          dialogue: matchedKingdomLandmark.dialogue,
        }
        : undefined) ||
      (matchedHarbourLandmark
        ? {
          id: matchedHarbourLandmark.id,
          name: matchedHarbourLandmark.name,
          subType: matchedHarbourLandmark.id,
          kind: 'building' as const,
          x: matchedHarbourLandmark.x,
          y: matchedHarbourLandmark.y,
          w: matchedHarbourLandmark.w,
          h: matchedHarbourLandmark.h,
          dialogue: matchedHarbourLandmark.dialogue,
        }
        : undefined) ||
      (matchedSkyLandmark
        ? {
          id: matchedSkyLandmark.id,
          name: matchedSkyLandmark.name,
          subType: matchedSkyLandmark.id,
          kind: 'building' as const,
          x: matchedSkyLandmark.x,
          y: matchedSkyLandmark.y,
          w: matchedSkyLandmark.w,
          h: matchedSkyLandmark.h,
          dialogue: matchedSkyLandmark.dialogue,
        }
        : undefined) ||
      (matchedDarkLandmark
        ? {
          id: matchedDarkLandmark.id,
          name: matchedDarkLandmark.name,
          subType: matchedDarkLandmark.id,
          kind: 'building' as const,
          x: matchedDarkLandmark.x,
          y: matchedDarkLandmark.y,
          w: matchedDarkLandmark.w,
          h: matchedDarkLandmark.h,
          dialogue: matchedDarkLandmark.lines ? matchedDarkLandmark.lines.join(' ') : matchedDarkLandmark.title,
        }
        : undefined);

    if (matchedDarkLandmark) {
      sfx.select();
      let title = matchedDarkLandmark.title;
      let text = matchedDarkLandmark.lines ? matchedDarkLandmark.lines.join(' ') : matchedDarkLandmark.title;
      let actions: Array<{ label: string; href?: string; onClick?: () => void }> = [];

      if (matchedDarkLandmark.id === 'shadow-cathedral') {
        actions.push({
          label: '🚪 Enter Shadow Cathedral (/dark-castle/cathedral)',
          href: '/dark-castle/cathedral',
        });
      } else if (matchedDarkLandmark.id === 'crimson-forge') {
        actions.push({
          label: '🚪 Enter Crimson Reactor Forge (/dark-castle/forge)',
          href: '/dark-castle/forge',
        });
      } else if (matchedDarkLandmark.id === 'blood-manor') {
        actions.push({
          label: '🚪 Enter Demon Keep & Blood Manor (/dark-castle/manor)',
          href: '/dark-castle/manor',
        });
      } else if (matchedDarkLandmark.id === 'chrono-vault') {
        actions.push({
          label: '🚪 Enter Chained Chrono Vault (/dark-castle/vault)',
          href: '/dark-castle/vault',
        });
      } else if (matchedDarkLandmark.id === 'obsidian-obelisk') {
        if (isAllSealsUnlocked()) {
          title = '🔮 Obsidian Obelisk Ring — AWAKENED';
          text = 'SOVEREIGN OF THE ABYSS: All 4 Abyssal Seals are united! The Rift is stabilized and the central monolith radiates supreme cosmic power!';
          gameStore.addStamp('battle');
          actions.push({
            label: '✨ Sovereign of the Abyss (Cosmic Aura)',
            onClick: () => {
              sfx.fly();
              engine.spawnFlyBurst(22, 29);
              engine.wake();
            },
          });
        } else {
          actions.push({
            label: '🔮 Touch Arcane Obsidian Runes',
            onClick: () => {
              sfx.confirm();
              engine.wake();
            },
          });
        }
      }

      if (engine.callbacks.onBubble) {
        engine.callbacks.onBubble(title, text, actions);
      } else {
        engine.callbacks.onDialogue(title, [text]);
      }
      engine.wake();
      return;
    }

    if (activeTarget === 'kiosk' || activeTarget === 'cafe' || activeTarget === 'bar' || customPlaced?.id === 'kiosk') {
      sfx.select();
      const kioskLines = [
        'POKÉ-CAFÉ BARISTA STAND ☕',
        'Specialty roasts & Castelia Cones crafted fresh for devs & trainers!',
        '"Today\'s blend: Dark Roasted TypeScript with notes of React & zero runtime bugs!"',
      ];
      const kioskActions = [
        {
          label: '🚪 Enter Poké-Café & Bar (/cafe)',
          href: '/cafe',
        },
        {
          label: '☕ Quick Sip Dev Roast (+100 Energy)',
          onClick: () => {
            sfx.espressoBrew();
            engine.callbacks.onRefill();
            document.dispatchEvent(new CustomEvent('town:cafe-coffee'));
            if (engine.callbacks.onBubble) {
              engine.callbacks.onBubble(
                'Poké-Café Barista Stand ☕',
                'You enjoyed a warm cup of Dark Roasted TypeScript! Fresh espresso aroma restored your coding focus & stamina to 100%! Step inside the Café & Bar for custom blends, Lo-Fi Vinyl Jukebox & VIP Coffee Chats! ☕✨',
                {
                  label: '🚪 Step Inside Poké-Café & Bar',
                  href: '/cafe',
                }
              );
            }
          },
        },
      ];
      if (engine.callbacks.onBubble) {
        engine.callbacks.onBubble('Poké-Café Barista Stand ☕', kioskLines.join(' '), kioskActions);
      } else {
        engine.callbacks.onDialogue('Poké-Café Barista Stand ☕', kioskLines, () => engine.callbacks.onNavigate('/cafe'));
      }
      engine.wake();
      return;
    }

    if (activeTarget === 'arena' || activeTarget === 'colosseum' || customPlaced?.id === 'arena') {
      sfx.select();
      const arenaLines = [
        'BATTLE FRONTIER & ALGORITHM COLOSSEUM ⚔️',
        'Step into the Grand Stadium where Frontier Brain Mewtwo & Tactical Coach Lucario test your AI, full-stack architecture, and competitive engineering mastery!',
      ];
      const arenaActions = [
        {
          label: '⚔️ Enter Battle Frontier Arena (/arena)',
          href: '/arena',
        },
        {
          label: '🔮 Quick Telepathy Quiz vs Mewtwo',
          onClick: () => document.dispatchEvent(new CustomEvent('town:arena-quiz')),
        },
      ];
      if (engine.callbacks.onBubble) {
        engine.callbacks.onBubble('Battle Frontier Colosseum ⚔️', arenaLines.join(' '), arenaActions);
      } else {
        engine.callbacks.onDialogue('Battle Frontier Colosseum ⚔️', arenaLines, () => engine.callbacks.onNavigate('/arena'));
      }
      engine.wake();
      return;
    }

    if (
      activeTarget === 'berry' ||
      activeTarget === 'garden' ||
      customPlaced?.id === 'garden' ||
      customPlaced?.id === 'berry'
    ) {
      sfx.select();
      const berryLines = [
        'ORGANIC BERRY ORCHARD & SAKURA GROVE 🌸',
        'Oran, Sitrus, dan Cheri berries tumbuh subur di kebun botani di bawah naungan pohon sakura.',
        'Tempat yang asri dan tenang untuk memulihkan stamina para trainer dan developer!',
      ];
      const berryActions = [
        {
          label: '🌸 Enter Berry Garden & Conservatory (/garden)',
          href: '/garden',
        },
        {
          label: '🍇 Petik Buah Berry (+3 Poké Balls)',
          onClick: () => engine.harvestBerries(),
        },
      ];
      if (engine.callbacks.onBubble) {
        engine.callbacks.onBubble('Berry Garden & Sakura Grove 🌸', berryLines.join(' '), berryActions);
      } else {
        engine.callbacks.onDialogue('Berry Garden & Sakura Grove 🌸', berryLines, () =>
          engine.callbacks.onNavigate('/garden')
        );
      }
      engine.wake();
      return;
    }

    if (
      activeTarget === 'neighbour' ||
      activeTarget === 'villa' ||
      customPlaced?.id === 'villa' ||
      customPlaced?.id === 'neighbour'
    ) {
      sfx.select();
      const neighbourLines = [
        "NEIGHBOUR'S COTTAGE & FELLOW DEV GUILD 🏡",
        "A warm, sunlit cottage where fellow developers, open-source contributors, and Eevee hang out!",
        "Step inside to pair-program, sign the Neighbour Guestbook, and discover Eeveelution tech vibes!",
      ];
      const neighbourActions = [
        {
          label: "🏡 Enter Neighbour's House (/neighbour)",
          href: '/neighbour',
        },
        {
          label: '🦊 Say Hi to Eevee & Maya',
          onClick: () => {
            sfx.heal();
            engine.callbacks.onRefill();
            document.dispatchEvent(new CustomEvent('town:neighbour-fx', { detail: { text: 'EEVEE CHEERED FOR YOU! 🦊💖', color: '#f59e0b' } }));
            if (engine.callbacks.onBubble) {
              engine.callbacks.onBubble(
                "Neighbour's Cottage 🏡",
                "Neighbour Maya and Eevee greeted you warmly from the cottage porch! Your energy is refreshed to 100%! Step inside to pair-program, play PR Ping-Pong, and sign the Guestbook! 🦊✨",
                {
                  label: "🏡 Step Inside Neighbour's Cottage",
                  href: '/neighbour',
                }
              );
            }
          },
        },
      ];
      if (engine.callbacks.onBubble) {
        engine.callbacks.onBubble("Neighbour's House 🏡", neighbourLines.join(' '), neighbourActions);
      } else {
        engine.callbacks.onDialogue("Neighbour's House 🏡", neighbourLines, () => engine.callbacks.onNavigate('/neighbour'));
      }
      engine.wake();
      return;
    }

    if (customPlaced) {
      const tpl = SPAWNABLE_TEMPLATES.find(
        (t) => t.id === customPlaced.id || t.id === 'tpl_' + customPlaced.id || t.subType === customPlaced.subType || t.subType === customPlaced.id
      );
      if (customPlaced.dialogue || tpl?.defaultDialogue || customPlaced.kind === 'npc' || customPlaced.kind === 'digimon' || customPlaced.kind === 'sign' || engine.currentScene === 'kingdom' || engine.currentScene === 'harbour' || engine.currentScene === 'sky-castle') {
        sfx.select();

        let action: BubbleAction | BubbleAction[] | undefined;
        let dialogueText = customPlaced.dialogue || tpl?.defaultDialogue || `${customPlaced.name} stands at coordinates (${customPlaced.x}, ${customPlaced.y}).`;

        if (customPlaced.link) {
          action = { label: 'Buka / Kunjungi ↗', href: customPlaced.link };
        } else if (customPlaced.kind === 'digimon') {
          const entry = getDigimonById(customPlaced.subType || customPlaced.id);
          if (entry) {
            requestDigimonSprites(entry.id, () => engine.wake());
            const modalEl = typeof document !== 'undefined' ? document.getElementById('digidex-modal') : null;
            if (modalEl) {
              const anchor = engine.digimonPatrol.getInteractAnchor(customPlaced);
              engine.spawnFlyBurst(anchor.x + 1, anchor.y + 1);
              engine.wake();
              window.dispatchEvent(
                new CustomEvent('digimon:open-modal', {
                  detail: {
                    id: customPlaced.id,
                    subType: entry.id,
                    x: customPlaced.x,
                    y: customPlaced.y,
                    name: customPlaced.name,
                    customDialogue: customPlaced.dialogue,
                    mode: 'inspect',
                  },
                })
              );
              return;
            }
            dialogueText =
              customPlaced.dialogue ||
              `[${entry.stage} • ${entry.attribute} • Jurus: ${entry.signatureMove}] ${entry.lore} (${entry.credit})`;
            action = {
              label: `⚡ ${entry.signatureMove.split('&')[0].trim()} Aura`,
              onClick: () => {
                sfx.fly();
                engine.spawnFlyBurst(customPlaced.x + 1, customPlaced.y + 1);
                engine.wake();
              },
            };
          }
        } else if (customPlaced.subType === 'pokeball_item') {
          action = {
            label: '🎁 Ambil Item (+2 Poké Ball)',
            onClick: () => {
              sfx.heal();
              engine.callbacks.onRefill();
              if (engine.callbacks.onBubble) {
                engine.callbacks.onBubble(customPlaced.name, 'Kamu membuka Poké Ball ini dan menemukan persediaan bola cadangan! ✨');
              }
            },
          };
        } else if (customPlaced.subType === 'pokestop') {
          action = {
            label: '🔄 Putar Piringan Poké-Stop',
            onClick: () => {
              sfx.heal();
              engine.callbacks.onRefill();
              if (engine.callbacks.onBubble) {
                engine.callbacks.onBubble('Poké-Stop ✨', 'Piringan berputar cepat! Kamu mendapatkan Poké Ball segar dan energi petualang baru! 🎒');
              }
            },
          };
        } else if (customPlaced.subType === 'groudon') {
          dialogueText = "GROUDON: 'Gwoooaaarrr-ghuuu...!' 🌋🔥 [Tech Guardian: Rock-Solid Storage & Database Partitioning] Menjaga kestabilan pondasi benua dan data persisten tak tergoyahkan.";
          action = [
            {
              label: '⚡ Gemuruh Magma Precipice Blades',
              onClick: () => engine.triggerSignatureMove('groudon', customPlaced.x, customPlaced.y),
            },
            {
              label: '🤝 Ajak Jalan Bersama',
              onClick: () => engine.setActiveFollower('groudon'),
            },
          ];
        } else if (customPlaced.subType === 'kyogre') {
          dialogueText = "KYOGRE: 'Gyaaa-oooh-shuuu...!' 🌊💧 [Tech Guardian: Streaming Data Pipelines & Event-Driven Architecture] Mengalirkan jutaan pesan data secara kontinu tanpa hambatan.";
          action = [
            {
              label: '⚡ Gelombang Samudra Origin Pulse',
              onClick: () => engine.triggerSignatureMove('kyogre', customPlaced.x, customPlaced.y),
            },
            {
              label: '🤝 Ajak Jalan Bersama',
              onClick: () => engine.setActiveFollower('kyogre'),
            },
          ];
        } else if (customPlaced.subType === 'gyarados') {
          dialogueText = "GYARADOS: 'Gwoooaaargh... Roaaar!' 🌊🐉 [Tech Guardian: High-Throughput Streaming & Resilient Network Pipelines] Mengalirkan jutaan transaksi data secara deras dan pantang menyerah menembus arus!";
          action = [
            {
              label: '⚡ Semburan Air (Hydro Pump)',
              onClick: () => engine.triggerSignatureMove('gyarados', customPlaced.x, customPlaced.y),
            },
            {
              label: '🤝 Ajak Jalan Bersama',
              onClick: () => engine.setActiveFollower('gyarados'),
            },
          ];
        } else if (customPlaced.subType === 'snorlax') {
          dialogueText = "SNORLAX: 'Zzz... Gwaaahhh...!' 😴💤 [Tech Guardian: Bulletproof Fault Tolerance & High-Availability Storage] Kokoh dan tenang menghadapi jutaan beban traffic tanpa pernah goyah sekalipun!";
          action = [
            {
              label: '⚡ Hantaman Tubuh (Body Slam)',
              onClick: () => engine.triggerSignatureMove('snorlax', customPlaced.x, customPlaced.y),
            },
            {
              label: '🤝 Ajak Jalan Bersama',
              onClick: () => engine.setActiveFollower('snorlax'),
            },
          ];
        } else if (customPlaced.subType === 'latios') {
          dialogueText = "LATIOS: 'Shwiii-shooo...!' ✈️🔷 [Tech Guardian: High-Speed Telemetry & API Edge Gateways] Mengarahkan arus komputasi supersonik dengan latensi paling rendah.";
          action = [
            {
              label: '⚡ Kecepatan Jet Luster Purge',
              onClick: () => engine.triggerSignatureMove('latios', customPlaced.x, customPlaced.y),
            },
            {
              label: '🤝 Ajak Jalan Bersama',
              onClick: () => engine.setActiveFollower('latios'),
            },
          ];
        } else if (customPlaced.subType === 'latias') {
          dialogueText = "LATIAS: 'Kyuuu-wiiin...!' 💖✨ [Tech Guardian: Responsive Frontend & Empathetic UX] Membiaskan antarmuka digital yang memikat dan bersahabat di segala platform.";
          action = [
            {
              label: '⚡ Cahaya Mistik Mist Ball',
              onClick: () => engine.triggerSignatureMove('latias', customPlaced.x, customPlaced.y),
            },
            {
              label: '🤝 Ajak Jalan Bersama',
              onClick: () => engine.setActiveFollower('latias'),
            },
          ];
        } else if (customPlaced.subType === 'darkrai') {
          dialogueText = "DARKRAI: 'Zzzz-shhhwaaaddd...!' 🌑💤 [Tech Guardian: Cyber Security, Encryption & Penetration Testing] Mengunci celah ilegal dan menjaga sistem dari dimensi bayangan.";
          action = [
            {
              label: '⚡ Dimensi Bayangan Dark Void',
              onClick: () => engine.triggerSignatureMove('darkrai', customPlaced.x, customPlaced.y),
            },
            {
              label: '🤝 Ajak Jalan Bersama',
              onClick: () => engine.setActiveFollower('darkrai'),
            },
          ];
        } else if (customPlaced.subType === 'necrozma' || customPlaced.subType === 'necrozma_dusk_mane') {
          dialogueText = "NECROZMA: 'Ggg-rraaa-shhh-kzzzt...!' 🦁☀️ [Tech Guardian: Multi-Modal AI & Cross-Platform Convergence] Membiaskan cahaya komputasi surya tak terbatas Sunsteel Strike.";
          action = [
            {
              label: '⚡ Cahaya Surya Sunsteel Strike',
              onClick: () => engine.triggerSignatureMove('necrozma', customPlaced.x, customPlaced.y),
            },
            {
              label: '🤝 Ajak Jalan Bersama',
              onClick: () => engine.setActiveFollower('necrozma'),
            },
          ];
        } else if (customPlaced.subType === 'lunala') {
          dialogueText = "LUNALA: 'Mahaaalo-laaa...!' 🌙✨ [Tech Guardian: Dark Mode Aesthetics & Night-Shift Reliability] Menjaga keandalan operasional sistem 24/7 di bawah sinar kosmik.";
          action = [
            {
              label: '⚡ Sinar Rembulan Moongeist Beam',
              onClick: () => engine.triggerSignatureMove('lunala', customPlaced.x, customPlaced.y),
            },
            {
              label: '🤝 Ajak Jalan Bersama',
              onClick: () => engine.setActiveFollower('lunala'),
            },
          ];
        } else if (customPlaced.subType === 'solgaleo') {
          dialogueText = "SOLGALEO: 'Laaa-lionnn-shooo...!' ☀️🦁 [Tech Guardian: High-Performance GPU Computing & Radiant Power Delivery] Menyalurkan daya komputasi grafis dan inferensi model tercepat.";
          action = [
            {
              label: '⚡ Kilau Surya Sunsteel Corona',
              onClick: () => engine.triggerSignatureMove('solgaleo', customPlaced.x, customPlaced.y),
            },
            {
              label: '🤝 Ajak Jalan Bersama',
              onClick: () => engine.setActiveFollower('solgaleo'),
            },
          ];
        } else if (customPlaced.subType === 'samurott') {
          dialogueText = "SAMUROTT: 'Rrrwooon-kllliiinggg...!' ⚔️🌊 [Tech Guardian: Precision Systems & Clean Code Mastery] Menghunus pedang Seamitar untuk memotong bug rumit, refactoring bersih, dan performa kode yang tangguh.";
          action = [
            {
              label: '⚔️ Tebasan Kerang Razor Shell',
              onClick: () => engine.triggerSignatureMove('samurott', customPlaced.x, customPlaced.y),
            },
            {
              label: '🤝 Ajak Jalan Bersama',
              onClick: () => engine.setActiveFollower('samurott'),
            },
          ];
        } else if (customPlaced.subType === 'empoleon') {
          dialogueText = "EMPOLEON: 'Gwooon-piiinggg...!' 🐧👑 [Tech Guardian: Enterprise Architecture, Marine-Grade Infrastructure & Security Hardening] Berdiri gagah memimpin orkestrasi sistem skala besar dengan pertahanan baja!";
          action = [
            {
              label: '🌊 Meriam Air Kaisar (Hydro Cannon)',
              onClick: () => engine.triggerSignatureMove('empoleon', customPlaced.x, customPlaced.y),
            },
            {
              label: '🤝 Ajak Jalan Bersama',
              onClick: () => engine.setActiveFollower('empoleon'),
            },
          ];
        } else if (customPlaced.subType === 'regigigas') {
          dialogueText = "REGIGIGAS: 'Zuuugii-giiigaaas...!' 🗿⚡ [Tech Guardian: Legacy Core Systems, Monolith Migration & High-Capacity Compute] Menggerakkan infrastruktur raksasa dengan ketahanan kolosal!";
          action = [
            {
              label: '🗿 Kehancuran Kolosal (Crush Grip)',
              onClick: () => engine.triggerSignatureMove('regigigas', customPlaced.x, customPlaced.y),
            },
            {
              label: '🤝 Ajak Jalan Bersama',
              onClick: () => engine.setActiveFollower('regigigas'),
            },
          ];
        } else if (customPlaced.subType === 'koraidon') {
          dialogueText = "KORAIDON: 'Gyaaaas-krrrooo...!' 🦖🔥 [Tech Guardian: Low-Latency Kernel Engines, Concurrent Runtime & Blazing Execution Speed] Melaju kencang melampaui batas komputasi!";
          action = [
            {
              label: '⚡ Tabrakan Kosmik (Collision Course)',
              onClick: () => engine.triggerSignatureMove('koraidon', customPlaced.x, customPlaced.y),
            },
            {
              label: '🤝 Ajak Jalan Bersama',
              onClick: () => engine.setActiveFollower('koraidon'),
            },
          ];
        } else if (customPlaced.subType === 'eternatus') {
          dialogueText = "ETERNATUS: 'Krrr-shhhwaaazzz...!' ☄️⚡ [Tech Guardian: High-Density GPU Clusters, Distributed Compute & Infinite Power Scaling] Menyalurkan energi Dynamax tak terbatas ke seluruh infrastruktur AI!";
          action = [
            {
              label: '☄️ Meriam Dynamax (Dynamax Cannon)',
              onClick: () => engine.triggerSignatureMove('eternatus', customPlaced.x, customPlaced.y),
            },
            {
              label: '🤝 Ajak Jalan Bersama',
              onClick: () => engine.setActiveFollower('eternatus'),
            },
          ];
        } else if (customPlaced.subType === 'rayquaza') {
          dialogueText = "RAYQUAZA: 'Krrr-shhhwaaahh...!' 🐉 [Tech Guardian: DevOps, CI/CD Cloud Pipelines & High-Availability] Mengarungi stratosfer awan menjaga stabilitas uptime sistem 99.99%!";
          action = [
            {
              label: '⚡ Deru Badai (Delta Stream)',
              onClick: () => engine.triggerSignatureMove('rayquaza', customPlaced.x, customPlaced.y),
            },
            {
              label: '🤝 Ajak Jalan Bersama',
              onClick: () => engine.setActiveFollower('rayquaza'),
            },
          ];
        } else if (customPlaced.subType === 'charizard') {
          dialogueText = "CHARIZARD: 'GRAAAWWWRRR...!' 🔥 Ekor api Charizard membakar semangat petualang di Zulfan's Town! [Tech Guardian: Full-Stack Web Engineering & Scalable Cloud Apps] Solusi cepat, tangguh, dan membakar habis setiap bug!";
          action = [
            {
              label: '⚡ Semburan Api (Flamethrower)',
              onClick: () => engine.triggerSignatureMove('charizard', customPlaced.x, customPlaced.y),
            },
            {
              label: '🤝 Ajak Jalan Bersama',
              onClick: () => engine.setActiveFollower('charizard'),
            },
          ];
        } else if (customPlaced.subType === 'tyranitar' || customPlaced.subType === 'blastoise') {
          dialogueText = "TYRANITAR: 'Gwoooaaargh!' 🪨 Tubuh zirah batu baja Tyranitar kokoh tak tergoyahkan. [Tech Guardian: Bulletproof Security, Resilient Database & Infrastructure] Kokoh bertahan dari segala lonjakan traffic dan ancaman siber!";
          action = [
            {
              label: '⚡ Badai Pasir (Sandstorm)',
              onClick: () => engine.triggerSignatureMove('tyranitar', customPlaced.x, customPlaced.y),
            },
            {
              label: '🤝 Ajak Jalan Bersama',
              onClick: () => engine.setActiveFollower('tyranitar'),
            },
          ];
        } else if (customPlaced.subType === 'garchomp') {
          dialogueText = "GARCHOMP: 'Gyaaa-shhh...!' 🦈 Sayap sirip tajam Garchomp berdesir membelah angin. [Tech Guardian: High-Speed Algorithms, Optimization & Clean Code] Bergerak secepat jet tempur supersonik mengeksekusi logika!";
          action = [
            {
              label: '⚡ Tebasan Naga (Dragon Claw)',
              onClick: () => engine.triggerSignatureMove('garchomp', customPlaced.x, customPlaced.y),
            },
            {
              label: '🤝 Ajak Jalan Bersama',
              onClick: () => engine.setActiveFollower('garchomp'),
            },
          ];
        } else if (customPlaced.subType === 'urshifu' || customPlaced.subType === 'urshifu_gmax') {
          dialogueText = "URSHIFU: 'Hssshaaarrr-kwooo...!' 🌊 Aliran deras jurus Rapid Strike bergemuruh. [Tech Guardian: Agile Execution, Rapid Prototyping & Flow State UI/UX] Menghadirkan solusi kilat yang kokoh dan tepat sasaran.";
          action = [
            {
              label: '⚡ Serbuan Beruntun (G-Max Rapid Flow)',
              onClick: () => engine.triggerSignatureMove('urshifu', customPlaced.x, customPlaced.y),
            },
            {
              label: '🤝 Ajak Jalan Bersama',
              onClick: () => engine.setActiveFollower('urshifu'),
            },
          ];
        } else if (customPlaced.subType === 'lucario') {
          dialogueText = "LUCARIO: 'Aura Zulfan beresonansi kuat di sini!' 🌀 [Tech Guardian: Intuitive UI/UX Design & Human-Centric Frontend] Merasakan kebutuhan pengguna secara empatik dan menghadirkan interaksi digital yang memikat.";
          action = [
            {
              label: '⚡ Bola Aura (Aura Sphere)',
              onClick: () => engine.triggerSignatureMove('lucario', customPlaced.x, customPlaced.y),
            },
            {
              label: '🤝 Ajak Jalan Bersama',
              onClick: () => engine.setActiveFollower('lucario'),
            },
          ];
        } else if (customPlaced.subType === 'mewtwo') {
          dialogueText = "MEWTWO: 'Saya tidak diciptakan untuk kalah. Pikiran manusia ini... menarik.' 🔮 [Tech Guardian: AI Agents, LLM Orchestration & Deep Learning] Menguasai penalaran multi-agent cerdas dan otomatisasi AI.";
          action = [
            {
              label: '⚡ Gelombang Psikis (Psystrike)',
              onClick: () => engine.triggerSignatureMove('mewtwo', customPlaced.x, customPlaced.y),
            },
            {
              label: '🤝 Ajak Jalan Bersama',
              onClick: () => engine.setActiveFollower('mewtwo'),
            },
          ];
        } else if (customPlaced.subType === 'arceus') {
          dialogueText = "ARCEUS: 'Dooo-oooonnn...!' ✨ [Tech Guardian: Enterprise System Architecture & End-to-End Product Vision] Merancang fondasi ekosistem software menyeluruh dari rancangan arsitektur hingga produksi global.";
          action = [
            {
              label: '⚡ Cahaya Kosmik (Judgment)',
              onClick: () => engine.triggerSignatureMove('arceus', customPlaced.x, customPlaced.y),
            },
            {
              label: '🤝 Ajak Jalan Bersama',
              onClick: () => engine.setActiveFollower('arceus'),
            },
          ];
        } else if (customPlaced.subType === 'dialga') {
          dialogueText = "DIALGA: 'Gugyugubah...!' ⏳🔷 [Tech Guardian: Time-Critical Backend & Microservices] Mengatur latensi real-time dan sinkronisasi data presisi.";
          action = [
            {
              label: '⚡ Dentang Waktu (Roar of Time)',
              onClick: () => engine.triggerSignatureMove('dialga', customPlaced.x, customPlaced.y),
            },
            {
              label: '🤝 Ajak Jalan Bersama',
              onClick: () => engine.setActiveFollower('dialga'),
            },
          ];
        } else if (customPlaced.subType === 'palkia') {
          dialogueText = "PALKIA: 'Gyaaa-ooohhn...!' 🌌💧 [Tech Guardian: Spatial Computing & Distributed Cloud Infrastructure] Menghubungkan setiap simpul arsitektur awan tanpa batas dimensi.";
          action = [
            {
              label: '⚡ Riak Dimensi (Spacial Rend)',
              onClick: () => engine.triggerSignatureMove('palkia', customPlaced.x, customPlaced.y),
            },
            {
              label: '🤝 Ajak Jalan Bersama',
              onClick: () => engine.setActiveFollower('palkia'),
            },
          ];
        } else if (customPlaced.subType === 'reshiram') {
          dialogueText = "RESHIRAM: 'Vaaa-zhooom...!' 🤍🔥 [Tech Guardian: Code Integrity, Rigorous Testing & Clean Architecture] Memastikan setiap baris kode terverifikasi bersih dan bebas kerentanan.";
          action = [
            {
              label: '⚡ Kobaran Fusion Flare',
              onClick: () => engine.triggerSignatureMove('reshiram', customPlaced.x, customPlaced.y),
            },
            {
              label: '🤝 Ajak Jalan Bersama',
              onClick: () => engine.setActiveFollower('reshiram'),
            },
          ];
        } else if (customPlaced.subType === 'zekrom') {
          dialogueText = "ZEKROM: 'Bzzzz-Vrrrooom...!' 🖤⚡ [Tech Guardian: Scalable Cloud Architecture & High-Voltage Compute] Memberikan daya komputasi raksasa untuk memproses data masif tanpa jeda.";
          action = [
            {
              label: '⚡ Kilatan Fusion Bolt',
              onClick: () => engine.triggerSignatureMove('zekrom', customPlaced.x, customPlaced.y),
            },
            {
              label: '🤝 Ajak Jalan Bersama',
              onClick: () => engine.setActiveFollower('zekrom'),
            },
          ];
        } else if (customPlaced.subType === 'giratina') {
          dialogueText = "GIRATINA: 'Gyaaa-shhhooo...!' 👻🌌 [Tech Guardian: Fault Tolerance, Chaos Engineering & Resilient Rollback] Menguji ketangguhan sistem dari celah dimensi yang tak terduga.";
          action = [
            {
              label: '⚡ Gemuruh Shadow Force',
              onClick: () => engine.triggerSignatureMove('giratina', customPlaced.x, customPlaced.y),
            },
            {
              label: '🤝 Ajak Jalan Bersama',
              onClick: () => engine.setActiveFollower('giratina'),
            },
          ];
        } else if (customPlaced.subType === 'pikachu') {
          dialogueText = "PIKACHU: 'Pika-Pikaaa-Chuuu!' ⚡ [Tech Guardian: Community Engagement & Interactive Web Experiences] Maskot setia penyemangat petualangan di Zulfan's Town!";
          action = [
            {
              label: '⚡ Sambaran Kilat (Thunderbolt)',
              onClick: () => engine.triggerSignatureMove('pikachu', customPlaced.x, customPlaced.y),
            },
            {
              label: '🤝 Ajak Jalan Bersama',
              onClick: () => engine.setActiveFollower('pikachu'),
            },
          ];
        } else if (customPlaced.subType === 'lugia') {
          dialogueText = "LUGIA: 'Gyaaa-oooor-shuuu...!' 🌊🌪️ [Tech Guardian: Full-Stack Calm in Storms, High-Traffic Sea Scale & Atmospheric Airflow] Kepakan sayap perak Lugia mampu meredakan badai dan menjaga kelancaran sistem di saat load tertinggi.";
          action = [
            {
              label: '⚡ Tembakan Udara (Aeroblast)',
              onClick: () => engine.triggerSignatureMove('lugia', customPlaced.x, customPlaced.y),
            },
            {
              label: '🤝 Ajak Jalan Bersama',
              onClick: () => engine.setActiveFollower('lugia'),
            },
          ];
        } else if (customPlaced.subType === 'archaludon') {
          dialogueText = "ARCHALUDON: 'Zzzzt-CLANGGG...!' ⚡🌉 [Tech Guardian: Structural Steel Architecture & High-Voltage Data Pipelines] Mengisi daya railgun baja dan menembakkan Electro Shot berkecepatan tinggi melintasi jaringan.";
          action = [
            {
              label: '⚡ Tembakan Elektro (Electro Shot)',
              onClick: () => engine.triggerSignatureMove('archaludon', customPlaced.x, customPlaced.y),
            },
            {
              label: '🤝 Ajak Jalan Bersama',
              onClick: () => engine.setActiveFollower('archaludon'),
            },
          ];
        } else if (customPlaced.subType === 'gougingfire') {
          dialogueText = "GOUGING FIRE: 'Grrraa-OOOORRR!' 🔥🌋 [Tech Guardian: Hardened Firewall Bastion & Volcanic Compute Cores] Perisai api purba Burning Bulwark membakar tuntas setiap ancaman dan menjaga integritas sistem.";
          action = [
            {
              label: '🔥 Benteng Membara (Burning Bulwark)',
              onClick: () => engine.triggerSignatureMove('gougingfire', customPlaced.x, customPlaced.y),
            },
            {
              label: '🤝 Ajak Jalan Bersama',
              onClick: () => engine.setActiveFollower('gougingfire'),
            },
          ];
        } else if (customPlaced.subType === 'greattusk') {
          dialogueText = "GREAT TUSK: 'Brrrooo-THUDDD!' 🐘🪨 [Tech Guardian: Heavy Data Ingestion & Unstoppable Throughput] Menerjang rintangan teknis tanpa henti dengan gading purba dan kekuatan seismik Headlong Rush!";
          action = [
            {
              label: '🐘 Terjangan Frontal (Headlong Rush)',
              onClick: () => engine.triggerSignatureMove('greattusk', customPlaced.x, customPlaced.y),
            },
            {
              label: '🤝 Ajak Jalan Bersama',
              onClick: () => engine.setActiveFollower('greattusk'),
            },
          ];
        } else if (customPlaced.subType === 'kyurem') {
          dialogueText = "KYUREM: 'Krrrr-SHHHOOO...!' ❄️💎 [Tech Guardian: Sub-Zero Latency Optimization & Immutable State Snapshots] Membekukan bottleneck seketika lewat hembusan kristal es Glaciate.";
          action = [
            {
              label: '❄️ Dunia Beku (Glaciate)',
              onClick: () => engine.triggerSignatureMove('kyurem', customPlaced.x, customPlaced.y),
            },
            {
              label: '🤝 Ajak Jalan Bersama',
              onClick: () => engine.setActiveFollower('kyurem'),
            },
          ];
        } else if (customPlaced.subType === 'salamence') {
          dialogueText = "SALAMENCE: 'Gyaaa-RAAAHHH!' 🐲☄️ [Tech Guardian: Cloud Flight Orchestration & High-Altitude Scalability] Sayap merahnya membelah langit kota sambil menghujankan meteor energi Draco Meteor!";
          action = [
            {
              label: '☄️ Hujan Meteor (Draco Meteor)',
              onClick: () => engine.triggerSignatureMove('salamence', customPlaced.x, customPlaced.y),
            },
            {
              label: '🤝 Ajak Jalan Bersama',
              onClick: () => engine.setActiveFollower('salamence'),
            },
          ];
        } else if (customPlaced.subType === 'royal_castle') {
          dialogueText =
            customPlaced.dialogue ||
            tpl?.defaultDialogue ||
            'Grand Royal Castle of Avalon 👑 — Sovereign Keep & Throne Hall overlooking the entire citadel.';
          action = [
            {
              label: '👑 Enter Grand Throne Hall →',
              href: '/kingdom/castle',
            },
            {
              label: '⚔️ Visit Excalibur Shrine',
              onClick: () => engine.walkToObject('excalibur_shrine'),
            },
            {
              label: '🌀 Return to Digi-Sanctuary (20, 40)',
              href: '/digimon?from=kingdom',
            },
          ];
        } else if (customPlaced.subType === 'blacksmith_forge') {
          dialogueText =
            customPlaced.dialogue ||
            tpl?.defaultDialogue ||
            'Royal Blacksmith & Armory ⚒️ — Glowing furnace where Valyrian-grade blades & shields are forged.';
          action = [
            {
              label: '⚒️ Enter Dragonflame Blacksmith →',
              href: '/kingdom/blacksmith',
            },
            {
              label: '🔨 Spark the Royal Anvil',
              onClick: () => {
                sfx.confirm();
                engine.spawnFlyBurst(customPlaced.x + 2, customPlaced.y + 2);
                engine.callbacks.onBubble?.(
                  customPlaced.name,
                  'CLANG! Hot sparks fly off the master anvil as a newly tempered knightsword shines bright!'
                );
              },
            },
          ];
        } else if (customPlaced.subType === 'medieval_tavern') {
          dialogueText =
            customPlaced.dialogue ||
            tpl?.defaultDialogue ||
            'The Golden Griffin Inn & Tavern 🍺 — Warm hearthfire, hearty feast, and travellers’ tales.';
          action = [
            {
              label: '🍺 Enter Golden Griffin Tavern →',
              href: '/kingdom/tavern',
            },
            {
              label: '🍖 Rest & Feast (+100 Energy)',
              onClick: () => {
                sfx.heal();
                engine.callbacks.onRefill();
                engine.callbacks.onBubble?.(
                  customPlaced.name,
                  'A warm bowl of royal stew and spiced cider restored your stamina to 100%!'
                );
              },
            },
          ];
        } else if (customPlaced.subType === 'mage_tower') {
          dialogueText =
            customPlaced.dialogue ||
            tpl?.defaultDialogue ||
            'Arcane Mage Observatory 🔮 — Astral crystal spire channeling dimensional ley-lines across worlds.';
          action = [
            {
              label: '🔮 Enter Astral Mage Sanctum →',
              href: '/kingdom/mage-tower',
            },
            {
              label: '✨ Cast Astral Resonance',
              onClick: () => {
                sfx.fly();
                engine.spawnFlyBurst(customPlaced.x + 2, customPlaced.y + 1);
                engine.callbacks.onBubble?.(
                  customPlaced.name,
                  'Runes orbit the crystal spire, harmonizing the bridge between Kingdom Citadel and Digi-Sanctuary!'
                );
              },
            },
          ];
        } else if (customPlaced.subType === 'knights_barracks') {
          dialogueText =
            customPlaced.dialogue ||
            tpl?.defaultDialogue ||
            'Garrison & Knights’ Barracks 🛡️ — Training hall of the Royal Vanguard and Gate Wardens.';
          action = [
            {
              label: "🛡️ Enter Knights' Barracks →",
              href: '/kingdom/barracks',
            },
            {
              label: '🐎 Inspect Jousting Arena',
              onClick: () => engine.walkToObject('jousting_arena'),
            },
          ];
        } else if (customPlaced.subType === 'jousting_arena') {
          dialogueText =
            customPlaced.dialogue ||
            tpl?.defaultDialogue ||
            'Royal Tournament & Jousting Arena 🐎 — Stone colosseum pavilion surrounding the golden sand knights’ lists.';
          action = [
            {
              label: '🐎 Enter Stone Jousting Arena →',
              href: '/kingdom/jousting',
            },
            {
              label: '🎺 Sound Tournament Fanfare',
              onClick: () => {
                sfx.select();
                engine.spawnFlyBurst(customPlaced.x + 3, customPlaced.y + 2);
              },
            },
          ];
        } else if (customPlaced.subType === 'royal_chapel') {
          dialogueText =
            customPlaced.dialogue ||
            tpl?.defaultDialogue ||
            'Royal Cathedral & Sanctuary Bell ⛪ — Peaceful stained-glass nave offering grace and renewal.';
          action = [
            {
              label: '⛪ Enter Saint Avalon Abbey →',
              href: '/kingdom/chapel',
            },
            {
              label: '💚 Receive Royal Blessing (+100 Energy)',
              onClick: () => {
                sfx.heal();
                engine.callbacks.onRefill();
                engine.callbacks.onBubble?.(
                  customPlaced.name,
                  'The cathedral bell chimes gently—your HP and Focus have been fully restored!'
                );
              },
            },
          ];
        } else if (customPlaced.subType === 'excalibur_shrine') {
          const collected = countRoyalCrests();
          dialogueText =
            collected >= 7
              ? 'Excalibur Shrine ⚔️✨: All 7/7 Royal Crests glow in golden unison! The sovereign blade yields to the Knight of Avalon!'
              : customPlaced.dialogue ||
                tpl?.defaultDialogue ||
                `Sword in the Stone — Excalibur Shrine ⚔️✨ (${collected}/7 Royal Crests): Only one bearing all 7 Crests may awaken the sovereign blade!`;
          action = {
            label:
              collected >= 7
                ? '⚔️ Draw Excalibur from the Stone (7/7 Ready!)'
                : `✨ Draw the Light of Excalibur (${collected}/7 Crests)`,
            onClick: () => {
              const latestCount = countRoyalCrests();
              sfx.heal();
              engine.callbacks.onRefill();
              engine.spawnFlyBurst(customPlaced.x + 1, customPlaced.y + 1);
              if (latestCount >= 7) {
                awakenExcalibur();
                sfx.confirm();
                engine.spawnFlyBurst(customPlaced.x - 1, customPlaced.y + 1);
                engine.spawnFlyBurst(customPlaced.x + 3, customPlaced.y + 1);
                engine.spawnFlyBurst(customPlaced.x + 1, customPlaced.y - 1);
                engine.wake();
                engine.callbacks.onBubble?.(
                  '⚔️ EXCALIBUR AWAKENED — KNIGHT OF AVALON!',
                  'All 7 Royal Crests resonate in golden harmony! You draw Excalibur from the ancient stone plinth — earning the sovereign title Knight of Avalon and blessing the entire Royal Citadel!',
                  [
                    {
                      label: '👑 Visit Royal Throne Hall',
                      href: '/kingdom/castle',
                    },
                    {
                      label: '📜 View Knighthood Certificate',
                      onClick: () => {
                        const target = document.getElementById('kingdom-excalibur-finale');
                        target?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      },
                    },
                  ]
                );
              } else {
                engine.wake();
                engine.callbacks.onBubble?.(
                  'Excalibur Shrine ⚔️✨',
                  `A pillar of golden light erupts from the stone plinth and restores your energy, yet ${7 - latestCount} Royal Crest seal(s) still bind the blade (${latestCount}/7 collected).`,
                  [
                    {
                      label: '📜 Check Royal Crest Registry',
                      onClick: () => {
                        const target = document.getElementById('kingdom-excalibur-finale');
                        target?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      },
                    },
                  ]
                );
              }
            },
          };
        } else if (customPlaced.subType === 'harbour_cottage') {
          action = [
            {
              label: '🚪 Enter Harbourmaster Tudor Inn',
              href: '/harbour/inn',
            },
            {
              label: '☕ Rest & Sea-Breeze Tea (+100 Energy)',
              onClick: () => {
                sfx.heal();
                engine.callbacks.onRefill();
                engine.callbacks.onBubble?.(
                  customPlaced.name,
                  'A steaming pot of spiced harbour tea and fresh bread restored your stamina to 100%!'
                );
              },
            },
          ];
        } else if (customPlaced.subType === 'harbour_lighthouse') {
          action = [
            {
              label: '🚪 Enter Old Port Lighthouse',
              href: '/harbour/lighthouse',
            },
            {
              label: '💡 Sweep Beacon Light',
              onClick: () => {
                sfx.fly();
                engine.spawnFlyBurst(11, 5);
                engine.callbacks.onBubble?.(
                  customPlaced.name,
                  'The great glass lantern rotates, casting a warm golden beam across the Azure Harbour!'
                );
              },
            },
          ];
        } else if (customPlaced.subType === 'harbour_warehouse') {
          action = {
            label: '🚪 Enter Customs & Cargo Warehouse',
            href: '/harbour/warehouse',
          };
        } else if (customPlaced.subType === 'harbour_market') {
          action = {
            label: '🚪 Enter Dockside Market Pavilion',
            href: '/harbour/market',
          };
        } else if (customPlaced.subType === 'harbour_galleon') {
          const sealCount = countMaritimeSeals();
          dialogueText =
            sealCount >= 5
              ? 'THE SOVEREIGN BRIGANTINE ⚓✨ (5/5 Maritime Seals Ready!): The twin sails billow in azure gold — sound the Grand Admiral’s Armada Salute!'
              : customPlaced.dialogue ||
                tpl?.defaultDialogue ||
                `THE SOVEREIGN BRIGANTINE (${sealCount}/5 Maritime Seals): Gather all 5 Royal Maritime Seals across Avalon Bay to awaken the Grand Fleet!`;
          action = [
            {
              label: '🚪 Board The Sovereign Brigantine',
              href: '/harbour/galleon',
            },
            {
              label:
                sealCount >= 5
                  ? '⚓ Awaken Sovereign Armada (5/5 Ready!)'
                  : `🔔 Ring Ship Brass Bell (${sealCount}/5 Seals)`,
              onClick: () => {
                const latestSeals = countMaritimeSeals();
                sfx.confirm();
                engine.spawnFlyBurst(30, 35);
                if (latestSeals >= 5) {
                  awakenVoyage();
                  engine.callbacks.onRefill();
                  engine.spawnFlyBurst(26, 28);
                  engine.spawnFlyBurst(34, 39);
                  engine.wake();
                  engine.callbacks.onBubble?.(
                    '⚓ GRAND ADMIRAL OF AVALON — SOVEREIGN VOYAGE!',
                    'All 5 Royal Maritime Seals gleam across the deck! Twin broadside cannons thunder a golden salute as you earn the title Grand Admiral of Avalon!',
                    [
                      {
                        label: '🏴‍☠️ Enter Admiral’s Great Cabin',
                        href: '/harbour/galleon',
                      },
                      {
                        label: '📜 View Admiralty Certificate',
                        onClick: () => {
                          const target = document.getElementById('harbour-voyage-finale');
                          target?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        },
                      },
                    ]
                  );
                } else {
                  engine.wake();
                  engine.callbacks.onBubble?.(
                    'The Sovereign Brigantine ⚓',
                    `The quarterdeck brass bell rings clear across Avalon Bay! Collect ${5 - latestSeals} more Maritime Seal(s) (${latestSeals}/5) to unlock the Grand Admiral’s Sovereign Armada Salute.`,
                    [
                      {
                        label: '📜 Check Maritime Seals Progress',
                        onClick: () => {
                          const target = document.getElementById('harbour-voyage-finale');
                          target?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        },
                      },
                    ]
                  );
                }
              },
            },
            {
              label: '🏰 Return to Royal Kingdom (22, 59)',
              href: '/kingdom?from=harbour',
            },
          ];
        } else if (customPlaced.subType === 'sky_tavern') {
          action = {
            label: '🏠 Enter Cloudhaven Timber Inn',
            href: '/sky-castle/inn',
          };
        } else if (customPlaced.subType === 'sky_observatory') {
          action = {
            label: '🔭 Enter Golden Astral Observatory',
            href: '/sky-castle/observatory',
          };
        } else if (customPlaced.subType === 'sky_chapel') {
          action = {
            label: '⛪ Enter Radiant Sky Chapel',
            href: '/sky-castle/chapel',
          };
        } else if (customPlaced.subType === 'sky_windmills') {
          action = {
            label: '🌬️ Enter Upper Cloud Windmill',
            href: '/sky-castle/windmill',
          };
        } else if (customPlaced.subType === 'sky_workshop') {
          action = {
            label: '⚙️ Enter Lower Sky-Dock Workshop',
            href: '/sky-castle/workshop',
          };
        } else if (customPlaced.subType === 'sky_crystal_plaza') {
          const collectedPlumes = countSkyPlumes();
          action = {
            label:
              collectedPlumes >= 6
                ? '💎 Awaken Azure Sky Crystal (6/6 Plumes!)'
                : `💎 Touch the Sky Crystal (${collectedPlumes}/6 Plumes · +100 Energy)`,
            onClick: () => {
              sfx.heal();
              engine.callbacks.onRefill();
              engine.spawnFlyBurst(22, 29);
              if (collectedPlumes >= 6) {
                awakenSkyCrystal();
                engine.callbacks.onBubble?.(
                  '💎 Azure Sky Crystal — AWAKENED!',
                  'All 6 Celestial Plumes resonate above the White Marble Plaza! The Azure Sky Crystal erupts with sovereign starlight!'
                );
              } else {
                engine.callbacks.onBubble?.(
                  customPlaced.name,
                  `Pure sky mana restores your stamina to full! Collect all 6 Celestial Plumes (${collectedPlumes}/6) across Sky Castle interiors to awaken the Azure Crystal.`
                );
              }
              engine.wake();
            },
          };
        } else if (customPlaced.subType === 'sky_citadel') {
          action = {
            label: '👑 Enter White Marble Sky Citadel',
            href: '/sky-castle/citadel',
          };
        } else if (customPlaced.subType === 'natural_spring') {
          action = {
            label: '♨️ Berendam & Pulihkan Stamina (+Speed 20d)',
            onClick: () => {
              sfx.heal();
              engine.callbacks.onRefill();
              engine.activateCoffeeBoost(20);
              engine.spawnFlyBurst(customPlaced.x + 1, customPlaced.y + 1);
              engine.callbacks.onBubble?.(
                '♨️ Mata Air Alami',
                'Air hangat pegunungan memulihkan staminamu hingga penuh dan memberi dorongan kecepatan lari selama 20 detik!'
              );
              engine.wake();
            },
          };
        } else if (customPlaced.subType === 'tree_berry') {
          action = {
            label: '🍒 Panen Buah Berry Segar',
            onClick: () => {
              const berries = [
                { name: 'Oran Berry', effect: 'Rasa manis-segar yang memulihkan energi!' },
                { name: 'Sitrus Berry', effect: 'Aroma sitrus cerah yang menyegarkan langkahmu (+Speed 10d)!' },
                { name: 'Pecha Berry', effect: 'Lembut dan harum, menenangkan suasana penjelajahan!' },
                { name: 'Lum Berry', effect: 'Buah langka berkilau yang menyegarkan pikiran dan stamina!' },
              ];
              const picked = berries[Math.floor(Math.random() * berries.length)];
              sfx.confirm();
              engine.callbacks.onRefill();
              if (picked.name === 'Sitrus Berry') {
                engine.activateCoffeeBoost(10);
              }
              engine.spawnFlyBurst(customPlaced.x + 1, customPlaced.y + 1);
              engine.callbacks.onBubble?.(
                `🍒 Panen: ${picked.name}!`,
                `Kamu memetik ${picked.name} segar dari ${customPlaced.name}. ${picked.effect}`
              );
              engine.wake();
            },
          };
        } else if (
          customPlaced.subType === 'crystal_cluster' ||
          customPlaced.subType === 'mushroom_patch' ||
          customPlaced.subType === 'tree_golden'
        ) {
          action = {
            label:
              customPlaced.subType === 'tree_golden'
                ? '✨ Sentuh Daun Emas Celestia'
                : customPlaced.subType === 'crystal_cluster'
                  ? '💎 Resonasikan Gugus Kristal'
                  : '🍄 Sentuh Glowshroom Bioluminesen',
            onClick: () => {
              sfx.heal();
              engine.spawnFlyBurst(
                customPlaced.x + Math.floor(customPlaced.w / 2),
                customPlaced.y + Math.floor(customPlaced.h / 2)
              );
              engine.callbacks.onBubble?.(
                customPlaced.name,
                customPlaced.subType === 'tree_golden'
                  ? 'Partikel cahaya emas berjatuhan lembut dari kanopi Celestia — aura malam pun tampak lebih hangat!'
                  : customPlaced.subType === 'crystal_cluster'
                    ? 'Gugus kristal beresonansi dengan nada bening dan memancarkan pendar cyan menenangkan!'
                    : 'Spora bioluminesen beterbangan lembut di udara, menerangi sekeliling saat senja & malam!'
              );
              engine.wake();
            },
          };
        }

        if (Array.isArray(action) && customPlaced.subType) {
          const rideId =
            customPlaced.subType === 'blastoise'
              ? 'tyranitar'
              : customPlaced.subType.replace('_gmax', '').replace('_dusk_mane', '');
          action.push({
            label: '🏇 Tunggangi (Poké Ride)',
            onClick: () => {
              engine.setActiveFollower(rideId, false);
              engine.setPokeRide(true);
            },
          });
        }

        if (engine.callbacks.onBubble) {
          engine.callbacks.onBubble(customPlaced.name, dialogueText, action);
        } else {
          const firstAct = Array.isArray(action) ? action[0] : action;
          engine.callbacks.onDialogue(
            customPlaced.name,
            [dialogueText],
            firstAct?.href ? () => engine.callbacks.onNavigate(firstAct!.href!) : firstAct?.onClick
          );
        }
        engine.wake();
        return;
      }
    }

    // Check Ghost Trainer at facing tile in Town Square
    if (engine.currentScene === 'town' && engine.ghostTrainersEnabled && engine.ghostTrainers.length > 0) {
      const ghost = findGhostAtTile(engine.ghostTrainers, fx, fy);
      if (ghost) {
        engine.showGhostTrainerBubble(ghost);
        engine.wake();
        return;
      }
    }

    // 3. Check Prop (Statue / Fountain / East & West POIs)
    const contestCfg = townConfig.getBuilding('contest');
    const prop = engine.map.props.find((p) => {
      let px = p.x;
      let py = p.y;
      if (p.id === 'contest' && contestCfg && !contestCfg.hidden) {
        px = contestCfg.x + 3;
        py = contestCfg.y + 2;
      }
      return (
        Math.hypot(px - fx, py - fy) <= 2.8 ||
        (Math.abs(px - engine.playerPos.x) <= 2 && Math.abs(py - engine.playerPos.y) <= 2)
      );
    });
    if (prop) {
      sfx.select();
      if (prop.id === 'lookout') {
        const next = engine.townAtmosphere === 'day' ? 'Sunset' : engine.townAtmosphere === 'sunset' ? 'Night' : 'Day';
        const action = {
          label: `🌅 Switch to ${next} Time`,
          onClick: () => {
            const current = engine.cycleAtmosphere();
            const upcoming = current === 'day' ? 'Sunset' : current === 'sunset' ? 'Night' : 'Day';
            if (engine.callbacks.onBubble) {
              engine.callbacks.onBubble(
                'Scenic Lookout Point 🔭',
                `Panoramic ocean vista overlooking Sinnoh. Atmosphere switched to ${current.toUpperCase()}!`,
                {
                  label: `🌅 Switch to ${upcoming} Time`,
                  onClick: () => engine.cycleAtmosphere(),
                }
              );
            }
          },
        };
        if (engine.callbacks.onBubble) {
          engine.callbacks.onBubble('Scenic Lookout Point 🔭', prop.lines.join(' '), action);
        } else {
          engine.callbacks.onDialogue('Scenic Lookout Point', prop.lines);
        }
        engine.wake();
        return;
      }
      if (prop.id === 'berry') {
        const actions = [
          {
            label: '🌸 Enter Berry Garden & Conservatory (/garden)',
            href: '/garden',
          },
          {
            label: '🍇 Pick Berries (+3 Poké Balls)',
            onClick: () => engine.harvestBerries(),
          },
        ];
        if (engine.callbacks.onBubble) {
          engine.callbacks.onBubble('Berry Garden & Sakura Grove 🌸', prop.lines.join(' '), actions);
        } else {
          engine.callbacks.onDialogue('Berry Garden', prop.lines, () => engine.callbacks.onNavigate('/garden'));
        }
        engine.wake();
        return;
      }
      if (prop.id === 'contest') {
        if (contestCfg && contestCfg.hidden) {
          return;
        }
        const action = {
          label: '🌟 View Frontend Architecture',
          onClick: () => engine.callbacks.onNavigate('/dev'),
        };
        if (engine.callbacks.onBubble) {
          engine.callbacks.onBubble('Contest Stage Podium 🎪', prop.lines.join(' '), action);
        } else {
          engine.callbacks.onDialogue('Contest Stage', prop.lines);
        }
        engine.wake();
        return;
      }
      if (prop.id === 'arena') {
        const actions = [
          {
            label: '⚔️ Enter Battle Frontier Arena (/arena)',
            href: '/arena',
          },
          {
            label: '🔮 Quick Telepathy Quiz vs Mewtwo',
            onClick: () => document.dispatchEvent(new CustomEvent('town:arena-quiz')),
          },
        ];
        if (engine.callbacks.onBubble) {
          engine.callbacks.onBubble('Pokémon Battle Arena ⚔️', prop.lines.join(' '), actions);
        } else {
          engine.callbacks.onDialogue('Battle Arena', prop.lines, () => engine.callbacks.onNavigate('/arena'));
        }
        engine.wake();
        return;
      }
      if (prop.id === 'hobby') {
        const action = {
          label: '☕ Check Arcade Showcase',
          onClick: () => engine.callbacks.onNavigate('/arcade'),
        };
        if (engine.callbacks.onBubble) {
          engine.callbacks.onBubble("Off-Duty Pergola & Boardwalk 🚴", prop.lines.join(' '), action);
        } else {
          engine.callbacks.onDialogue('Off-Duty Pergola', prop.lines);
        }
        engine.wake();
        return;
      }
      if (prop.id === 'fountain' || prop.type === 'fountain') {
        if (engine.callbacks.onBubble) {
          engine.callbacks.onBubble(prop.name, prop.lines.join(' '), {
            label: '📖 Trainer Guestbook Board',
            onClick: () => window.dispatchEvent(new CustomEvent('town:open-guestbook')),
          });
        } else {
          engine.callbacks.onDialogue(prop.name, prop.lines);
        }
        engine.wake();
        return;
      }
      if (engine.callbacks.onBubble) {
        engine.callbacks.onBubble(prop.name, prop.lines.join(' '));
      } else {
        engine.callbacks.onDialogue(prop.name, prop.lines);
      }
      engine.wake();
      return;
    }

    // 4. Check Shop (Depop stall) using active townConfig bounds if moved/hidden
    const shopBase = engine.map.buildings.find((b) => b.id === 'shop');
    const shopCfg = townConfig.getBuilding('shop');
    const shopBounds = shopCfg?.hidden ? null : (shopCfg || shopBase);
    const shop = shopBounds && fx >= shopBounds.x && fx < shopBounds.x + shopBounds.w && fy >= shopBounds.y && fy < shopBounds.y + shopBounds.h;
    if (shop) {
      sfx.select();
      if (engine.callbacks.onBubble) {
        engine.callbacks.onBubble('Depop & Store', "Visit Muhammad Zulfan's verified classic web portfolio and showcases.", {
          label: 'Visit Portfolio',
          href: 'https://zulfan15.github.io/MZulfan',
        });
      } else {
        engine.callbacks.onDialogue('Depop & Store', ["Visit Muhammad Zulfan's verified classic web portfolio and showcases."], () => {
          window.open('https://zulfan15.github.io/MZulfan', '_blank');
        });
      }
      engine.wake();
      return;
    }
  }
