import { DIRS, Tile, type CharacterPalette, type Dir, type TownMap, type Vec } from './types';
import { drawPikachu } from './townBackground';
import { DIGIMON_ZONE_COLORS, getDigimonById, type DigimonCatalogEntry } from './digimonCatalog';
import { TILE_SIZE, drawCharacter, drawLucario, drawRiderCharacter } from './sprites';
import { townConfig } from './townConfig';
import { sfx } from '../game/sfx';
import type { PMDAction, PokemonPMDAnimator } from './pokemonPMDAnimator';
import type { FollowerPokemon, MoveParticle, WeatherParticle } from './TownEngine';

export interface TownPokemonFxHost {
  map: TownMap;
  tick: number;
  playerPos: Vec;
  playerDir: Dir;
  playerPalette: CharacterPalette;
  isMoving: boolean;
  moveProgress: number;
  activeFollower: FollowerPokemon | null;
  followerPos: Vec;
  followerTarget: Vec;
  followerDir: Dir;
  followerFacing: 'left' | 'right';
  followerEmoteTime: number;
  followerEmote: string;
  followerWalkTick: number;
  moveParticles: MoveParticle[];
  particles: WeatherParticle[];
  cameraShakeTime: number;
  cameraShakeIntensity: number;
  pmdAnimator: PokemonPMDAnimator;
  isWorldScene(): boolean;
  getRideClass(pokemonId?: string): 'sky' | 'surf' | 'charge';
  spawnDustPuff(x: number, y: number): void;
  wake(): void;
  drawDigimonOverworldSprite(
    ctx: CanvasRenderingContext2D,
    entry: DigimonCatalogEntry,
    orientation: 'N' | 'S' | 'E' | 'W',
    animTick: number,
    isWalking: boolean,
    centerX: number,
    footY: number,
    heightScale?: number,
    drawLoadingFallback?: boolean
  ): boolean;
  gardevoirImg: HTMLImageElement | null;
  celebiImg: HTMLImageElement | null;
  lugiaImg: HTMLImageElement | null;
  charizardImg: HTMLImageElement | null;
  tyranitarImg: HTMLImageElement | null;
  garchompImg: HTMLImageElement | null;
  urshifuImg: HTMLImageElement | null;
  arceusImg: HTMLImageElement | null;
  mewtwoImg: HTMLImageElement | null;
  reshiramImg: HTMLImageElement | null;
  zekromImg: HTMLImageElement | null;
  giratinaImg: HTMLImageElement | null;
  palkiaImg: HTMLImageElement | null;
  dialgaImg: HTMLImageElement | null;
  rayquazaImg: HTMLImageElement | null;
  groudonImg: HTMLImageElement | null;
  kyogreImg: HTMLImageElement | null;
  latiosImg: HTMLImageElement | null;
  latiasImg: HTMLImageElement | null;
  darkraiImg: HTMLImageElement | null;
  necrozmaImg: HTMLImageElement | null;
  lunalaImg: HTMLImageElement | null;
  solgaleoImg: HTMLImageElement | null;
  samurottImg: HTMLImageElement | null;
  empoleonImg: HTMLImageElement | null;
  regigigasImg: HTMLImageElement | null;
  koraidonImg: HTMLImageElement | null;
  eternatusImg: HTMLImageElement | null;
  rayquazaAttackTick: number;
  arceusAttackTick: number;
  reshiramAttackTick: number;
  zekromAttackTick: number;
  giratinaAttackTick: number;
  palkiaAttackTick: number;
  dialgaAttackTick: number;
  lunalaAttackTick: number;
  solgaleoAttackTick: number;
  garchompAttackTick: number;
  groudonAttackTick: number;
  kyogreAttackTick: number;
  tyranitarAttackTick: number;
  gyaradosAttackTick: number;
  snorlaxAttackTick: number;
  samurottAttackTick: number;
  empoleonAttackTick: number;
  regigigasAttackTick: number;
  koraidonAttackTick: number;
  eternatusAttackTick: number;
  urshifuAttackTick: number;
  darkraiAttackTick: number;
  latiosAttackTick: number;
  latiasAttackTick: number;
  charizardAttackTick: number;
  gardevoirAttackTick: number;
  celebiAttackTick: number;
  lugiaAttackTick: number;
}

export function triggerSignatureMove(host: TownPokemonFxHost, pokemonId: string, originX?: number, originY?: number) {
  const id = pokemonId.toLowerCase();
  const ox =
    originX !== undefined
      ? originX * TILE_SIZE + 8
      : (host.activeFollower ? host.followerPos.x : host.playerPos.x) * TILE_SIZE + 8;
  const oy =
    originY !== undefined
      ? originY * TILE_SIZE + 8
      : (host.activeFollower ? host.followerPos.y : host.playerPos.y) * TILE_SIZE + 8;

  host.cameraShakeTime = 28;
  host.cameraShakeIntensity = 3.6;
  sfx.encounter();

  if (id.includes('gardevoir')) {
    host.gardevoirAttackTick = 26;
    for (let i = 0; i < 45; i++) {
      const angle = Math.random() * Math.PI * 2;
      const spd = 2.0 + Math.random() * 4.0;
      host.moveParticles.push({
        x: ox,
        y: oy,
        vx: Math.cos(angle) * spd,
        vy: Math.sin(angle) * spd,
        size: 3 + Math.random() * 3,
        color: ['#f472b6', '#ec4899', '#c084fc', '#fbcfe8', '#ffffff'][Math.floor(Math.random() * 5)],
        alpha: 0.95,
        life: 0,
        maxLife: 28 + Math.floor(Math.random() * 18),
        type: 'psychic',
      });
    }
  } else if (id.includes('celebi')) {
    host.celebiAttackTick = 26;
    for (let i = 0; i < 45; i++) {
      const angle = Math.random() * Math.PI * 2;
      const spd = 2.2 + Math.random() * 4.2;
      host.moveParticles.push({
        x: ox,
        y: oy,
        vx: Math.cos(angle) * spd,
        vy: Math.sin(angle) * spd,
        size: 3 + Math.random() * 3,
        color: ['#22c55e', '#4ade80', '#86efac', '#fef08a', '#ffffff'][Math.floor(Math.random() * 5)],
        alpha: 0.95,
        life: 0,
        maxLife: 28 + Math.floor(Math.random() * 18),
        type: 'aura',
      });
    }
  } else if (id.includes('charizard')) {
    host.charizardAttackTick = 28;
    for (let i = 0; i < 45; i++) {
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.8;
      const spd = 2.5 + Math.random() * 4.5;
      host.moveParticles.push({
        x: ox,
        y: oy,
        vx: Math.cos(angle) * spd,
        vy: Math.sin(angle) * spd,
        size: 3 + Math.random() * 4,
        color: ['#f97316', '#ef4444', '#fde047', '#ffedd5'][Math.floor(Math.random() * 4)],
        alpha: 0.95,
        life: 0,
        maxLife: 25 + Math.floor(Math.random() * 20),
        type: 'flame',
      });
    }
  } else if (id.includes('tyranitar') || id.includes('blastoise')) {
    host.tyranitarAttackTick = 26;
    for (let i = 0; i < 45; i++) {
      const r = 8 + Math.random() * 32;
      const ang = Math.random() * Math.PI * 2;
      host.moveParticles.push({
        x: ox + Math.cos(ang) * r,
        y: oy + Math.sin(ang) * r,
        vx: -Math.sin(ang) * 3.5,
        vy: Math.cos(ang) * 3.5,
        size: 2 + Math.random() * 2.5,
        color: ['#d97706', '#b45309', '#fde68a', '#78350f'][Math.floor(Math.random() * 4)],
        alpha: 0.9,
        life: 0,
        maxLife: 30 + Math.floor(Math.random() * 15),
        type: 'sand',
      });
    }
  } else if (id.includes('garchomp')) {
    host.garchompAttackTick = 26;
    for (let i = 0; i < 35; i++) {
      const spd = 3.5 + Math.random() * 4.5;
      const ang = Math.PI * 0.25 + (Math.random() - 0.5) * 0.8;
      host.moveParticles.push({
        x: ox + (Math.random() - 0.5) * 20,
        y: oy + (Math.random() - 0.5) * 20,
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd,
        size: 3 + Math.random() * 3,
        color: ['#06b6d4', '#22d3ee', '#38bdf8', '#ffffff'][Math.floor(Math.random() * 4)],
        alpha: 0.95,
        life: 0,
        maxLife: 24 + Math.floor(Math.random() * 14),
        type: 'claw',
      });
    }
  } else if (id.includes('urshifu')) {
    host.urshifuAttackTick = 28;
    for (let i = 0; i < 45; i++) {
      const spd = 3 + Math.random() * 5;
      const ang = Math.random() * Math.PI * 2;
      host.moveParticles.push({
        x: ox,
        y: oy,
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd,
        size: 2.5 + Math.random() * 3.5,
        color: ['#0284c7', '#38bdf8', '#7dd3fc', '#ffffff'][Math.floor(Math.random() * 4)],
        alpha: 0.95,
        life: 0,
        maxLife: 26 + Math.floor(Math.random() * 18),
        type: 'water',
      });
    }
  } else if (id.includes('lucario')) {
    for (let i = 0; i < 40; i++) {
      const spd = 2 + Math.random() * 4;
      const ang = Math.random() * Math.PI * 2;
      host.moveParticles.push({
        x: ox,
        y: oy,
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd,
        size: 3 + Math.random() * 3,
        color: ['#38bdf8', '#6366f1', '#818cf8', '#e0e7ff'][Math.floor(Math.random() * 4)],
        alpha: 0.95,
        life: 0,
        maxLife: 28 + Math.floor(Math.random() * 15),
        type: 'aura',
      });
    }
  } else if (id.includes('mewtwo')) {
    for (let i = 0; i < 45; i++) {
      const spd = 2.2 + Math.random() * 4.2;
      const ang = Math.random() * Math.PI * 2;
      host.moveParticles.push({
        x: ox,
        y: oy,
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd,
        size: 3 + Math.random() * 3.5,
        color: ['#a855f7', '#d946ef', '#ec4899', '#f0abfc'][Math.floor(Math.random() * 4)],
        alpha: 0.95,
        life: 0,
        maxLife: 30 + Math.floor(Math.random() * 15),
        type: 'psychic',
      });
    }
  } else if (id.includes('arceus')) {
    host.arceusAttackTick = 37;
    for (let i = 0; i < 45; i++) {
      host.moveParticles.push({
        x: ox + (Math.random() - 0.5) * 50,
        y: oy - 60 + Math.random() * 20,
        vx: (Math.random() - 0.5) * 1.5,
        vy: 4.5 + Math.random() * 3.5,
        size: 3 + Math.random() * 3.5,
        color: ['#fbbf24', '#fde047', '#fef08a', '#ffffff'][Math.floor(Math.random() * 4)],
        alpha: 0.95,
        life: 0,
        maxLife: 26 + Math.floor(Math.random() * 14),
        type: 'cosmic',
      });
    }
  } else if (id.includes('rayquaza')) {
    host.rayquazaAttackTick = 26;
    for (let i = 0; i < 45; i++) {
      const ang = Math.random() * Math.PI * 2;
      const spd = 3 + Math.random() * 5;
      host.moveParticles.push({
        x: ox,
        y: oy,
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd,
        size: 3 + Math.random() * 3,
        color: ['#10b981', '#34d399', '#6ee7b7', '#a7f3d0'][Math.floor(Math.random() * 4)],
        alpha: 0.95,
        life: 0,
        maxLife: 28 + Math.floor(Math.random() * 16),
        type: 'shockwave',
      });
    }
  } else if (id.includes('dialga')) {
    host.dialgaAttackTick = 28;
    for (let i = 0; i < 45; i++) {
      const ang = Math.random() * Math.PI * 2;
      const spd = 2.5 + Math.random() * 4.5;
      host.moveParticles.push({
        x: ox,
        y: oy,
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd,
        size: 3 + Math.random() * 3,
        color: ['#0284c7', '#38bdf8', '#bae6fd', '#ffffff'][Math.floor(Math.random() * 4)],
        alpha: 0.95,
        life: 0,
        maxLife: 30 + Math.floor(Math.random() * 15),
        type: 'cosmic',
      });
    }
  } else if (id.includes('palkia')) {
    host.palkiaAttackTick = 28;
    for (let i = 0; i < 45; i++) {
      const ang = Math.random() * Math.PI * 2;
      const spd = 2.5 + Math.random() * 4.5;
      host.moveParticles.push({
        x: ox,
        y: oy,
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd,
        size: 3 + Math.random() * 3,
        color: ['#e11d48', '#fb7185', '#f43f5e', '#ffffff'][Math.floor(Math.random() * 4)],
        alpha: 0.95,
        life: 0,
        maxLife: 30 + Math.floor(Math.random() * 15),
        type: 'cosmic',
      });
    }
  } else if (id.includes('reshiram')) {
    host.reshiramAttackTick = 30;
    for (let i = 0; i < 50; i++) {
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.6;
      const spd = 3.0 + Math.random() * 5.0;
      host.moveParticles.push({
        x: ox + (Math.random() - 0.5) * 12,
        y: oy,
        vx: Math.cos(angle) * spd,
        vy: Math.sin(angle) * spd,
        size: 3 + Math.random() * 4,
        color: ['#ffffff', '#ffedd5', '#f97316', '#ef4444'][Math.floor(Math.random() * 4)],
        alpha: 0.95,
        life: 0,
        maxLife: 28 + Math.floor(Math.random() * 18),
        type: 'flame',
      });
    }
  } else if (id.includes('zekrom')) {
    host.zekromAttackTick = 28;
    for (let i = 0; i < 50; i++) {
      const ang = Math.random() * Math.PI * 2;
      const spd = 3.2 + Math.random() * 5.2;
      host.moveParticles.push({
        x: ox,
        y: oy,
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd,
        size: 2.5 + Math.random() * 3.5,
        color: ['#06b6d4', '#22d3ee', '#38bdf8', '#0284c7', '#ffffff'][Math.floor(Math.random() * 5)],
        alpha: 0.95,
        life: 0,
        maxLife: 26 + Math.floor(Math.random() * 16),
        type: 'shockwave',
      });
    }
  } else if (id.includes('giratina')) {
    host.giratinaAttackTick = 27;
    for (let i = 0; i < 50; i++) {
      const ang = Math.random() * Math.PI * 2;
      const spd = 2.4 + Math.random() * 4.2;
      host.moveParticles.push({
        x: ox,
        y: oy,
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd,
        size: 3 + Math.random() * 3.5,
        color: ['#701a75', '#a21caf', '#c026d3', '#3b0764', '#18181b'][Math.floor(Math.random() * 5)],
        alpha: 0.95,
        life: 0,
        maxLife: 32 + Math.floor(Math.random() * 16),
        type: 'psychic',
      });
    }
  } else if (id.includes('groudon')) {
    host.groudonAttackTick = 28;
    for (let i = 0; i < 50; i++) {
      const ang = -Math.PI / 2 + (Math.random() - 0.5) * 1.5;
      const spd = 3.5 + Math.random() * 5.5;
      host.moveParticles.push({
        x: ox + (Math.random() - 0.5) * 30,
        y: oy + 10,
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd,
        size: 3.5 + Math.random() * 4,
        color: ['#dc2626', '#ea580c', '#b45309', '#fde047'][Math.floor(Math.random() * 4)],
        alpha: 0.95,
        life: 0,
        maxLife: 28 + Math.floor(Math.random() * 16),
        type: 'sand',
      });
    }
  } else if (id.includes('kyogre')) {
    host.kyogreAttackTick = 26;
    for (let i = 0; i < 50; i++) {
      const ang = Math.random() * Math.PI * 2;
      const spd = 3.0 + Math.random() * 5.0;
      host.moveParticles.push({
        x: ox,
        y: oy,
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd,
        size: 3 + Math.random() * 3.5,
        color: ['#0284c7', '#0ea5e9', '#38bdf8', '#bae6fd', '#ffffff'][Math.floor(Math.random() * 5)],
        alpha: 0.95,
        life: 0,
        maxLife: 30 + Math.floor(Math.random() * 16),
        type: 'water',
      });
    }
  } else if (id.includes('gyarados')) {
    host.gyaradosAttackTick = 25;
    for (let i = 0; i < 45; i++) {
      const ang = Math.random() * Math.PI * 2;
      const spd = 2.5 + Math.random() * 4.5;
      host.moveParticles.push({
        x: ox + Math.cos(ang) * 12,
        y: oy + Math.sin(ang) * 12,
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd,
        size: 2.5 + Math.random() * 3,
        color: ['#0284c7', '#38bdf8', '#0ea5e9', '#bae6fd', '#1d4ed8'][Math.floor(Math.random() * 5)],
        alpha: 0.95,
        life: 0,
        maxLife: 28 + Math.floor(Math.random() * 15),
        type: 'spark',
      });
    }
  } else if (id.includes('snorlax')) {
    host.snorlaxAttackTick = 26;
    host.cameraShakeTime = 22;
    host.cameraShakeIntensity = 4.8;
    for (let i = 0; i < 45; i++) {
      const ang = Math.random() * Math.PI * 2;
      const spd = 2.2 + Math.random() * 4.2;
      host.moveParticles.push({
        x: ox + Math.cos(ang) * 10,
        y: oy + Math.sin(ang) * 10,
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd,
        size: 3 + Math.random() * 3.5,
        color: ['#fbbf24', '#f59e0b', '#d97706', '#94a3b8', '#e2e8f0'][Math.floor(Math.random() * 5)],
        alpha: 0.95,
        life: 0,
        maxLife: 28 + Math.floor(Math.random() * 14),
        type: 'spark',
      });
    }
  } else if (id.includes('latios')) {
    host.latiosAttackTick = 25;
    host.cameraShakeTime = 16;
    host.cameraShakeIntensity = 3.5;
    for (let i = 0; i < 45; i++) {
      const ang = Math.PI * 0.25 + (Math.random() - 0.5) * 1.0;
      const spd = 4.0 + Math.random() * 5.5;
      host.moveParticles.push({
        x: ox + (Math.random() - 0.5) * 20,
        y: oy + (Math.random() - 0.5) * 20,
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd,
        size: 2.5 + Math.random() * 3,
        color: ['#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#ffffff'][Math.floor(Math.random() * 5)],
        alpha: 0.95,
        life: 0,
        maxLife: 26 + Math.floor(Math.random() * 14),
        type: 'shockwave',
      });
    }
  } else if (id.includes('latias')) {
    host.latiasAttackTick = 25;
    host.cameraShakeTime = 16;
    host.cameraShakeIntensity = 3.5;
    for (let i = 0; i < 45; i++) {
      const ang = Math.random() * Math.PI * 2;
      const spd = 2.5 + Math.random() * 4.2;
      host.moveParticles.push({
        x: ox,
        y: oy,
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd,
        size: 3 + Math.random() * 3,
        color: ['#e11d48', '#f43f5e', '#fb7185', '#fda4af', '#ffffff'][Math.floor(Math.random() * 5)],
        alpha: 0.95,
        life: 0,
        maxLife: 28 + Math.floor(Math.random() * 15),
        type: 'aura',
      });
    }
  } else if (id.includes('darkrai')) {
    host.darkraiAttackTick = 30;
    host.cameraShakeTime = 16;
    host.cameraShakeIntensity = 3.5;
    for (let i = 0; i < 50; i++) {
      const ang = Math.random() * Math.PI * 2;
      const r = 6 + Math.random() * 28;
      host.moveParticles.push({
        x: ox + Math.cos(ang) * r,
        y: oy + Math.sin(ang) * r,
        vx: -Math.sin(ang) * 3.2,
        vy: Math.cos(ang) * 3.2,
        size: 2.5 + Math.random() * 3.5,
        color: ['#3b0764', '#581c87', '#7e22ce', '#a855f7', '#0f172a'][Math.floor(Math.random() * 5)],
        alpha: 0.95,
        life: 0,
        maxLife: 32 + Math.floor(Math.random() * 16),
        type: 'psychic',
      });
    }
  } else if (id.includes('necrozma')) {
    for (let i = 0; i < 50; i++) {
      const ang = Math.random() * Math.PI * 2;
      const spd = 3.5 + Math.random() * 5.0;
      host.moveParticles.push({
        x: ox,
        y: oy,
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd,
        size: 3 + Math.random() * 3.5,
        color: ['#f59e0b', '#fbbf24', '#fde047', '#818cf8', '#ffffff'][Math.floor(Math.random() * 5)],
        alpha: 0.95,
        life: 0,
        maxLife: 28 + Math.floor(Math.random() * 15),
        type: 'cosmic',
      });
    }
  } else if (id.includes('lunala')) {
    host.lunalaAttackTick = 25;
    for (let i = 0; i < 50; i++) {
      const ang = Math.random() * Math.PI * 2;
      const spd = 2.8 + Math.random() * 4.6;
      host.moveParticles.push({
        x: ox,
        y: oy,
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd,
        size: 3 + Math.random() * 3.5,
        color: ['#4338ca', '#6366f1', '#818cf8', '#c7d2fe', '#e0e7ff'][Math.floor(Math.random() * 5)],
        alpha: 0.95,
        life: 0,
        maxLife: 30 + Math.floor(Math.random() * 16),
        type: 'cosmic',
      });
    }
  } else if (id.includes('solgaleo')) {
    host.solgaleoAttackTick = 25;
    for (let i = 0; i < 50; i++) {
      const ang = Math.random() * Math.PI * 2;
      const spd = 3.2 + Math.random() * 5.2;
      host.moveParticles.push({
        x: ox,
        y: oy,
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd,
        size: 3 + Math.random() * 4,
        color: ['#ea580c', '#f59e0b', '#fbbf24', '#fef08a', '#ffffff'][Math.floor(Math.random() * 5)],
        alpha: 0.95,
        life: 0,
        maxLife: 28 + Math.floor(Math.random() * 16),
        type: 'flame',
      });
    }
  } else if (id.includes('samurott')) {
    host.samurottAttackTick = 27;
    host.cameraShakeTime = 16;
    host.cameraShakeIntensity = 3.5;
    for (let i = 0; i < 50; i++) {
      const ang = Math.random() * Math.PI * 2;
      const spd = 3.5 + Math.random() * 5.0;
      host.moveParticles.push({
        x: ox,
        y: oy,
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd,
        size: 2.8 + Math.random() * 3.8,
        color: ['#0284c7', '#0ea5e9', '#38bdf8', '#7dd3fc', '#ffffff'][Math.floor(Math.random() * 5)],
        alpha: 0.95,
        life: 0,
        maxLife: 28 + Math.floor(Math.random() * 16),
        type: 'water',
      });
    }
  } else if (id.includes('empoleon')) {
    host.empoleonAttackTick = 26;
    host.cameraShakeTime = 16;
    host.cameraShakeIntensity = 3.6;
    for (let i = 0; i < 50; i++) {
      const ang = Math.random() * Math.PI * 2;
      const spd = 3.6 + Math.random() * 5.2;
      host.moveParticles.push({
        x: ox,
        y: oy,
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd,
        size: 2.8 + Math.random() * 3.6,
        color: ['#0284c7', '#38bdf8', '#93c5fd', '#facc15', '#ffffff'][Math.floor(Math.random() * 5)],
        alpha: 0.95,
        life: 0,
        maxLife: 28 + Math.floor(Math.random() * 16),
        type: 'water',
      });
    }
  } else if (id.includes('regigigas')) {
    host.regigigasAttackTick = 29;
    host.cameraShakeTime = 24;
    host.cameraShakeIntensity = 5.0;
    for (let i = 0; i < 50; i++) {
      const ang = Math.random() * Math.PI * 2;
      const spd = 2.6 + Math.random() * 4.8;
      host.moveParticles.push({
        x: ox + Math.cos(ang) * 10,
        y: oy + Math.sin(ang) * 10,
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd,
        size: 3.2 + Math.random() * 3.8,
        color: ['#facc15', '#22c55e', '#f8fafc', '#94a3b8', '#ef4444'][Math.floor(Math.random() * 5)],
        alpha: 0.95,
        life: 0,
        maxLife: 30 + Math.floor(Math.random() * 16),
        type: 'shockwave',
      });
    }
  } else if (id.includes('koraidon')) {
    host.koraidonAttackTick = 26;
    host.cameraShakeTime = 18;
    host.cameraShakeIntensity = 4.2;
    for (let i = 0; i < 50; i++) {
      const ang = Math.random() * Math.PI * 2;
      const spd = 3.5 + Math.random() * 5.2;
      host.moveParticles.push({
        x: ox + Math.cos(ang) * 8,
        y: oy + Math.sin(ang) * 8,
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd,
        size: 2.8 + Math.random() * 3.6,
        color: ['#ef4444', '#f97316', '#facc15', '#38bdf8', '#ffffff'][Math.floor(Math.random() * 5)],
        alpha: 0.95,
        life: 0,
        maxLife: 28 + Math.floor(Math.random() * 15),
        type: 'flame',
      });
    }
  } else if (id.includes('eternatus')) {
    host.eternatusAttackTick = 29;
    host.cameraShakeTime = 22;
    host.cameraShakeIntensity = 4.6;
    for (let i = 0; i < 55; i++) {
      const ang = Math.random() * Math.PI * 2;
      const spd = 3.2 + Math.random() * 5.6;
      host.moveParticles.push({
        x: ox + Math.cos(ang) * 10,
        y: oy + Math.sin(ang) * 10,
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd,
        size: 3.0 + Math.random() * 3.8,
        color: ['#e11d48', '#ec4899', '#a855f7', '#06b6d4', '#ffffff'][Math.floor(Math.random() * 5)],
        alpha: 0.95,
        life: 0,
        maxLife: 30 + Math.floor(Math.random() * 16),
        type: 'cosmic',
      });
    }
  } else if (id.includes('lugia')) {
    host.lugiaAttackTick = 24;
    host.cameraShakeTime = 20;
    host.cameraShakeIntensity = 4.2;
    for (let i = 0; i < 55; i++) {
      const ang = Math.random() * Math.PI * 2;
      const spd = 3.2 + Math.random() * 5.2;
      host.moveParticles.push({
        x: ox + Math.cos(ang) * 8,
        y: oy + Math.sin(ang) * 8,
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd,
        size: 2.8 + Math.random() * 3.6,
        color: ['#e0f2fe', '#7dd3fc', '#38bdf8', '#818cf8', '#ffffff'][Math.floor(Math.random() * 5)],
        alpha: 0.95,
        life: 0,
        maxLife: 28 + Math.floor(Math.random() * 16),
        type: 'shockwave',
      });
    }
  } else {
    for (let i = 0; i < 40; i++) {
      const ang = Math.random() * Math.PI * 2;
      const spd = 3 + Math.random() * 4;
      host.moveParticles.push({
        x: ox,
        y: oy,
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd,
        size: 2.5 + Math.random() * 3,
        color: ['#facc15', '#fde047', '#fef08a', '#ffffff'][Math.floor(Math.random() * 4)],
        alpha: 0.95,
        life: 0,
        maxLife: 24 + Math.floor(Math.random() * 12),
        type: 'shockwave',
      });
    }
  }

  host.wake();
}

export function drawFollower(host: TownPokemonFxHost, ctx: CanvasRenderingContext2D) {
  if (!host.activeFollower) return;

  const drawX =
    (host.isMoving
      ? host.followerPos.x + (host.followerTarget.x - host.followerPos.x) * host.moveProgress
      : host.followerPos.x) * TILE_SIZE;
  const drawY =
    (host.isMoving
      ? host.followerPos.y + (host.followerTarget.y - host.followerPos.y) * host.moveProgress
      : host.followerPos.y) * TILE_SIZE;

  const isFollowerWalking =
    host.isMoving &&
    (host.followerPos.x !== host.followerTarget.x || host.followerPos.y !== host.followerTarget.y);
  const stepBob = isFollowerWalking ? Math.sin(host.moveProgress * Math.PI * 2) * 1.5 : 0;
  const idleBob = Math.sin(host.tick * 0.08) * 1.2;

  const fid = host.activeFollower.id;
  const isFlipped = host.followerFacing === 'right';

  ctx.save();
  // Authentic ground contact shadow matching placed NPC scale
  const shadowMap: Record<string, { rx: number; ry: number; yOff: number }> = {
    urshifu: { rx: 16, ry: 5.5, yOff: 16 },
    lunala: { rx: 17, ry: 5, yOff: 16 },
    solgaleo: { rx: 16, ry: 6, yOff: 16 },
    samurott: { rx: 14, ry: 5, yOff: 16 },
    empoleon: { rx: 13, ry: 5, yOff: 16 },
    regigigas: { rx: 16, ry: 6, yOff: 16 },
    koraidon: { rx: 15, ry: 5.5, yOff: 16 },
    eternatus: { rx: 16, ry: 5.5, yOff: 16 },
    lugia: { rx: 16, ry: 5.5, yOff: 16 },
    necrozma: { rx: 16, ry: 6, yOff: 16 },
    groudon: { rx: 15, ry: 6, yOff: 16 },
    kyogre: { rx: 15, ry: 5.5, yOff: 16 },
    gyarados: { rx: 16, ry: 5.5, yOff: 16 },
    snorlax: { rx: 15, ry: 6, yOff: 15 },
    dialga: { rx: 14, ry: 5, yOff: 16 },
    palkia: { rx: 14, ry: 5, yOff: 16 },
    giratina: { rx: 14, ry: 5, yOff: 16 },
    zekrom: { rx: 14, ry: 5, yOff: 16 },
    reshiram: { rx: 14, ry: 5, yOff: 16 },
    rayquaza: { rx: 14, ry: 5, yOff: 16 },
    darkrai: { rx: 14, ry: 5.5, yOff: 16 },
    garchomp: { rx: 15, ry: 5, yOff: 16 },
    tyranitar: { rx: 15, ry: 5.5, yOff: 16 },
    charizard: { rx: 15, ry: 5.5, yOff: 16 },
    gardevoir: { rx: 13, ry: 4.5, yOff: 15 },
    celebi: { rx: 11, ry: 4.0, yOff: 15 },
    arceus: { rx: 12, ry: 4.5, yOff: 16 },
    mewtwo: { rx: 12, ry: 4.5, yOff: 16 },
    latios: { rx: 12, ry: 4.5, yOff: 16 },
    latias: { rx: 12, ry: 4.5, yOff: 16 },
  };
  const digiCompanion = getDigimonById(fid);
  const s = shadowMap[fid];
  if (digiCompanion) {
    const aura = DIGIMON_ZONE_COLORS[digiCompanion.elementZone] || DIGIMON_ZONE_COLORS.plaza;
    ctx.fillStyle = aura.inner;
    ctx.beginPath();
    ctx.ellipse(drawX + 8, drawY + 15, 13, 4.6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = aura.rim;
    ctx.lineWidth = 0.9;
    ctx.beginPath();
    ctx.ellipse(drawX + 8, drawY + 15, 12, 4, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = 'rgba(15, 23, 42, 0.42)';
    ctx.beginPath();
    ctx.ellipse(drawX + 8, drawY + 15, 9.5, 3.2, 0, 0, Math.PI * 2);
    ctx.fill();
  } else if (s) {
    ctx.fillStyle = 'rgba(15, 23, 42, 0.4)';
    ctx.beginPath();
    ctx.ellipse(drawX + 8, drawY + s.yOff, s.rx, s.ry, 0, 0, Math.PI * 2);
    ctx.fill();
  } else if (fid !== 'lucario' && fid !== 'pikachu') {
    ctx.fillStyle = 'rgba(15, 23, 42, 0.35)';
    ctx.beginPath();
    ctx.ellipse(drawX + 8, drawY + 14, 7, 3, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  const shouldFlip = isFlipped && !host.pmdAnimator.isSupported(fid) && !digiCompanion;
  if (shouldFlip) {
    ctx.translate(drawX + 8, 0);
    ctx.scale(-1, 1);
    ctx.translate(-(drawX + 8), 0);
  }

  if (digiCompanion) {
    const orientMap: Record<Dir, 'N' | 'S' | 'E' | 'W'> = {
      up: 'N',
      down: 'S',
      left: 'W',
      right: 'E',
    };
    const orient = orientMap[host.followerDir] || 'S';
    const bobOffset = isFollowerWalking ? stepBob * 0.45 : idleBob * 0.55;
    host.drawDigimonOverworldSprite(
      ctx,
      digiCompanion,
      orient,
      host.tick,
      isFollowerWalking,
      drawX + 8,
      drawY + 15 + bobOffset,
      0.86,
      true
    );
  } else if (fid === 'pikachu') {
    drawPikachu(ctx, drawX, drawY + stepBob + idleBob);
  } else if (fid === 'lucario') {
    drawLucario(ctx, drawX, drawY + stepBob, host.tick, 1);
  } else if (fid === 'charizard') {
    const coreX = drawX + 8;
    const coreY = drawY + 16;
    drawCharizardFlameAura(ctx, host.tick, coreX, coreY - 10);

    let action: 'idle' | 'walk' | 'shoot' = 'idle';
    let animTick = host.tick;
    if (host.charizardAttackTick > 0) {
      action = 'shoot';
      animTick = 28 - host.charizardAttackTick;
    } else if (isFollowerWalking) {
      action = 'walk';
      animTick = host.followerWalkTick;
    }
    const dir = host.followerDir || 'down';

    const pmdDrawn = host.pmdAnimator.draw(
      ctx,
      'charizard',
      action,
      dir,
      coreX,
      coreY,
      animTick
    );

    if (!pmdDrawn && host.charizardImg && host.charizardImg.complete) {
      ctx.drawImage(host.charizardImg, drawX - 13, drawY - 20 + stepBob + idleBob, 42, 42);
    }
  } else if (fid === 'gardevoir') {
    const coreX = drawX + 8;
    const coreY = drawY + 16;
    drawGardevoirPsychicAura(ctx, host.tick, coreX, coreY - 10);

    let action: 'idle' | 'walk' | 'shoot' = 'idle';
    let animTick = host.tick;
    if (host.gardevoirAttackTick > 0) {
      action = 'shoot';
      animTick = 26 - host.gardevoirAttackTick;
    } else if (isFollowerWalking) {
      action = 'walk';
      animTick = host.followerWalkTick;
    }
    const dir = host.followerDir || 'down';

    const pmdDrawn = host.pmdAnimator.draw(
      ctx,
      'gardevoir',
      action,
      dir,
      coreX,
      coreY,
      animTick
    );

    if (!pmdDrawn && host.gardevoirImg && host.gardevoirImg.complete) {
      ctx.drawImage(host.gardevoirImg, drawX - 16, drawY - 24 + stepBob + idleBob, 48, 48);
    }
  } else if (fid === 'celebi') {
    const coreX = drawX + 8;
    const coreY = drawY + 16;
    const floatBob = Math.sin(host.tick * 0.1) * 2;
    drawCelebiForestAura(ctx, host.tick, coreX, coreY - 10);

    let action: 'idle' | 'walk' | 'shoot' = 'idle';
    let animTick = host.tick;
    if (host.celebiAttackTick > 0) {
      action = 'shoot';
      animTick = 26 - host.celebiAttackTick;
    } else if (isFollowerWalking) {
      action = 'walk';
      animTick = host.followerWalkTick;
    }
    const dir = host.followerDir || 'down';

    const pmdDrawn = host.pmdAnimator.draw(
      ctx,
      'celebi',
      action,
      dir,
      coreX,
      coreY + floatBob,
      animTick
    );

    if (!pmdDrawn && host.celebiImg && host.celebiImg.complete) {
      ctx.drawImage(host.celebiImg, drawX - 16, drawY - 24 + floatBob, 48, 48);
    }
  } else if (fid === 'tyranitar') {
    const coreX = drawX + 8;
    const coreY = drawY + 16;

    // Sand Stream & armored rock dust aura
    const sandPulse = 0.35 + Math.sin(host.tick * 0.08) * 0.15;
    const sandGrad = ctx.createRadialGradient(coreX, coreY - 10, 2, coreX, coreY - 10, 18);
    sandGrad.addColorStop(0, `rgba(217, 119, 6, ${sandPulse + 0.3})`);
    sandGrad.addColorStop(0.5, `rgba(180, 83, 9, ${sandPulse * 0.7})`);
    sandGrad.addColorStop(1, 'rgba(15, 23, 42, 0)');
    ctx.fillStyle = sandGrad;
    ctx.beginPath();
    ctx.arc(coreX, coreY - 10, 18, 0, Math.PI * 2);
    ctx.fill();

    // Sand swirl & rock armor fragments
    if (host.tick % 16 < 11) {
      ctx.fillStyle = '#d4b182';
      ctx.fillRect(coreX + Math.cos(host.tick * 0.15) * 12, coreY - 12 - (host.tick % 10), 1.5, 1.5);
      ctx.fillStyle = '#4b5563';
      ctx.fillRect(coreX - 6 + Math.sin(host.tick * 0.2) * 10, coreY - 6 - (host.tick % 8), 2, 2);
    }

    // Determine action, direction, and animation frame tick
    let action: 'idle' | 'walk' | 'shoot' = 'idle';
    let animTick = host.tick;
    if (host.tyranitarAttackTick > 0) {
      action = 'shoot';
      animTick = 26 - host.tyranitarAttackTick;
    } else if (isFollowerWalking) {
      action = 'walk';
      animTick = host.followerWalkTick;
    }
    const dir = host.followerDir || 'down';

    const pmdDrawn = host.pmdAnimator.draw(
      ctx,
      'tyranitar',
      action,
      dir,
      coreX,
      coreY,
      animTick
    );

    if (!pmdDrawn && host.tyranitarImg && host.tyranitarImg.complete) {
      ctx.drawImage(host.tyranitarImg, drawX - 13, drawY - 20 + stepBob, 42, 42);
    }
  } else if (fid === 'garchomp') {
    const coreX = drawX + 8;
    const coreY = drawY + 16;

    // Dragon Rush / Mach supersonic slipstream aura
    const dragonPulse = 0.35 + Math.sin(host.tick * 0.08) * 0.15;
    const dragonGrad = ctx.createRadialGradient(coreX, coreY - 10, 2, coreX, coreY - 10, 18);
    dragonGrad.addColorStop(0, `rgba(56, 189, 248, ${dragonPulse + 0.3})`);
    dragonGrad.addColorStop(0.5, `rgba(3, 105, 161, ${dragonPulse * 0.7})`);
    dragonGrad.addColorStop(1, 'rgba(15, 23, 42, 0)');
    ctx.fillStyle = dragonGrad;
    ctx.beginPath();
    ctx.arc(coreX, coreY - 10, 18, 0, Math.PI * 2);
    ctx.fill();

    // Sandstorm sparks & dragon energy
    if (host.tick % 16 < 11) {
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(coreX + Math.cos(host.tick * 0.15) * 12, coreY - 12 - (host.tick % 10), 2, 1);
      ctx.fillStyle = '#fde047';
      ctx.fillRect(coreX - 6 + Math.sin(host.tick * 0.2) * 10, coreY - 6 - (host.tick % 8), 1.5, 1.5);
    }

    // Determine action, direction, and animation frame tick
    let action: 'idle' | 'walk' | 'shoot' = 'idle';
    let animTick = host.tick;
    if (host.garchompAttackTick > 0) {
      action = 'shoot';
      animTick = 26 - host.garchompAttackTick;
    } else if (isFollowerWalking) {
      action = 'walk';
      animTick = host.followerWalkTick;
    }
    const dir = host.followerDir || 'down';

    const pmdDrawn = host.pmdAnimator.draw(
      ctx,
      'garchomp',
      action,
      dir,
      coreX,
      coreY,
      animTick
    );

    if (!pmdDrawn && host.garchompImg && host.garchompImg.complete) {
      ctx.drawImage(host.garchompImg, drawX - 13, drawY - 20 + stepBob + idleBob, 42, 42);
    }
  } else if (fid === 'urshifu') {
    const coreX = drawX + 8;
    const coreY = drawY + 16;
    drawUrshifuTorrentAura(ctx, host.tick, coreX, coreY - 12, true);

    let action: 'idle' | 'walk' | 'attack' = 'idle';
    let animTick = host.tick;
    if (host.urshifuAttackTick > 0) {
      action = 'attack';
      animTick = 28 - host.urshifuAttackTick;
    } else if (isFollowerWalking) {
      action = 'walk';
      animTick = host.followerWalkTick;
    }
    const dir = host.followerDir || 'down';

    const pmdDrawn = host.pmdAnimator.draw(
      ctx,
      'urshifu',
      action,
      dir,
      coreX,
      coreY,
      animTick
    );

    if (!pmdDrawn && host.urshifuImg && host.urshifuImg.complete) {
      ctx.drawImage(host.urshifuImg, drawX - 16, drawY - 24 + stepBob, 48, 45);
    }
  } else if (fid === 'rayquaza') {
    const coreX = drawX + 8;
    const coreY = drawY + 16;
    const auraCoreY = drawY - 2 + idleBob * 1.8;

    // Atmospheric Ozone Emerald Aura
    const auraPulse = 0.35 + Math.sin(host.tick * 0.08) * 0.15;
    const spatGrad = ctx.createRadialGradient(coreX, auraCoreY, 2, coreX, auraCoreY, 18);
    spatGrad.addColorStop(0, `rgba(167, 243, 208, ${auraPulse + 0.3})`);
    spatGrad.addColorStop(0.5, `rgba(16, 185, 129, ${auraPulse})`);
    spatGrad.addColorStop(1, 'rgba(5, 150, 105, 0)');
    ctx.fillStyle = spatGrad;
    ctx.beginPath();
    ctx.arc(coreX, auraCoreY, 18, 0, Math.PI * 2);
    ctx.fill();

    // Determine action, direction, and animation frame tick
    let action: 'idle' | 'walk' | 'shoot' = 'idle';
    let animTick = host.tick;
    if (host.rayquazaAttackTick > 0) {
      action = 'shoot';
      animTick = 26 - host.rayquazaAttackTick;
    } else if (isFollowerWalking) {
      action = 'walk';
      animTick = host.followerWalkTick;
    }
    const dir = host.followerDir || 'down';

    const pmdDrawn = host.pmdAnimator.draw(
      ctx,
      'rayquaza',
      action,
      dir,
      coreX,
      coreY,
      animTick
    );

    if (!pmdDrawn && host.rayquazaImg && host.rayquazaImg.complete) {
      ctx.drawImage(host.rayquazaImg, drawX - 13, drawY - 20 + idleBob * 1.8, 42, 42);
    }
  } else if (fid === 'mewtwo') {
    if (host.mewtwoImg && host.mewtwoImg.complete) {
      const auraR = 14 + Math.sin(host.tick * 0.06) * 2;
      ctx.strokeStyle = 'rgba(168, 85, 247, 0.45)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(drawX + 8, drawY - 2 + stepBob + idleBob, auraR, 0, Math.PI * 2);
      ctx.stroke();

      ctx.drawImage(host.mewtwoImg, drawX - 11, drawY - 16 + stepBob + idleBob, 38, 38);
    }
  } else if (fid === 'arceus') {
    const coreX = drawX + 8;
    const coreY = drawY + 16;

    const haloR = 14 + Math.sin(host.tick * 0.05) * 2;
    ctx.strokeStyle = 'rgba(250, 204, 21, 0.45)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(coreX, drawY - 4 + stepBob + idleBob, haloR, 0, Math.PI * 2);
    ctx.stroke();

    // Determine action, direction, and animation frame tick
    let action: 'idle' | 'walk' | 'shoot' = 'idle';
    let animTick = host.tick;
    if (host.arceusAttackTick > 0) {
      action = 'shoot';
      animTick = 37 - host.arceusAttackTick;
    } else if (isFollowerWalking) {
      action = 'walk';
      animTick = host.followerWalkTick;
    }
    const dir = host.followerDir || 'down';

    const pmdDrawn = host.pmdAnimator.draw(
      ctx,
      'arceus',
      action,
      dir,
      coreX,
      coreY,
      animTick
    );

    if (!pmdDrawn && host.arceusImg && host.arceusImg.complete) {
      ctx.drawImage(host.arceusImg, drawX - 12, drawY - 18 + stepBob + idleBob, 40, 40);
    }
  } else if (fid === 'dialga') {
    const coreX = drawX + 8;
    const coreY = drawY + 16;
    const corePulse = 0.35 + Math.sin(host.tick * 0.08) * 0.15;
    const coreGrad = ctx.createRadialGradient(coreX, coreY, 2, coreX, coreY, 18);
    coreGrad.addColorStop(0, `rgba(224, 242, 254, ${corePulse + 0.35})`);
    coreGrad.addColorStop(0.45, `rgba(56, 189, 248, ${corePulse + 0.1})`);
    coreGrad.addColorStop(1, 'rgba(2, 132, 199, 0)');
    ctx.fillStyle = coreGrad;
    ctx.beginPath();
    ctx.arc(coreX, coreY, 18, 0, Math.PI * 2);
    ctx.fill();

    // Roar of Time temporal distortion pulse ring
    const timePhase = (host.tick * 0.045) % 1;
    const ringRadius = 5 + timePhase * 16;
    const ringAlpha = (1 - timePhase) * 0.65;
    ctx.strokeStyle = `rgba(56, 189, 248, ${ringAlpha})`;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(coreX, coreY, ringRadius, 0, Math.PI * 2);
    ctx.stroke();

    // Diamond time-sparkles floating around Dialga
    if (host.tick % 24 < 14) {
      ctx.fillStyle = '#f0f9ff';
      ctx.fillRect(coreX + Math.sin(host.tick * 0.2) * 12, coreY - 4 - (host.tick % 14), 1.5, 1.5);
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(coreX - 6 + Math.cos(host.tick * 0.16) * 10, coreY + 4 - (host.tick % 10), 2, 2);
    }

    // Determine action, direction, and animation frame tick
    let action: 'idle' | 'walk' | 'shoot' = 'idle';
    let animTick = host.tick;
    if (host.dialgaAttackTick > 0) {
      action = 'shoot';
      animTick = 28 - host.dialgaAttackTick;
    } else if (isFollowerWalking) {
      action = 'walk';
      animTick = host.followerWalkTick;
    }
    const dir = host.followerDir || 'down';

    const pmdDrawn = host.pmdAnimator.draw(
      ctx,
      'dialga',
      action,
      dir,
      coreX,
      coreY,
      animTick
    );

    if (!pmdDrawn && host.dialgaImg && host.dialgaImg.complete) {
      ctx.drawImage(host.dialgaImg, drawX - 13, drawY - 20 + stepBob + idleBob, 42, 42);
    }
  } else if (fid === 'palkia') {
    const coreX = drawX + 8;
    const coreY = drawY + 16;
    const spatialPulse = 0.35 + Math.sin(host.tick * 0.08) * 0.15;
    const spatGrad = ctx.createRadialGradient(coreX, coreY, 3, coreX, coreY, 18);
    spatGrad.addColorStop(0, `rgba(240, 171, 252, ${spatialPulse + 0.3})`);
    spatGrad.addColorStop(0.5, `rgba(192, 38, 211, ${spatialPulse})`);
    spatGrad.addColorStop(1, 'rgba(192, 38, 211, 0)');
    ctx.fillStyle = spatGrad;
    ctx.beginPath();
    ctx.arc(coreX, coreY, 18, 0, Math.PI * 2);
    ctx.fill();

    // Spacial Rend dimensional space-warp slice lines
    const rendAngle = host.tick * 0.03;
    for (let r = 0; r < 2; r++) {
      const angle = rendAngle + (r * Math.PI) / 2;
      const rx1 = coreX + Math.cos(angle) * 14;
      const ry1 = coreY + Math.sin(angle) * 8;
      const rx2 = coreX - Math.cos(angle) * 14;
      const ry2 = coreY - Math.sin(angle) * 8;
      ctx.strokeStyle = 'rgba(244, 114, 182, 0.7)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(rx1, ry1);
      ctx.lineTo(rx2, ry2);
      ctx.stroke();
    }

    // Determine action, direction, and animation frame tick
    let action: 'idle' | 'walk' | 'shoot' = 'idle';
    let animTick = host.tick;
    if (host.palkiaAttackTick > 0) {
      action = 'shoot';
      animTick = 28 - host.palkiaAttackTick;
    } else if (isFollowerWalking) {
      action = 'walk';
      animTick = host.followerWalkTick;
    }
    const dir = host.followerDir || 'down';

    const pmdDrawn = host.pmdAnimator.draw(
      ctx,
      'palkia',
      action,
      dir,
      coreX,
      coreY,
      animTick
    );

    if (!pmdDrawn && host.palkiaImg && host.palkiaImg.complete) {
      ctx.drawImage(host.palkiaImg, drawX - 13, drawY - 20 + stepBob + idleBob, 42, 42);
    }
  } else if (fid === 'reshiram') {
    const coreX = drawX + 8;
    const coreY = drawY + 16;
    const turbineGlow = 0.35 + Math.sin(host.tick * 0.08) * 0.15;
    const tailX = drawX - 3;
    const tailY = drawY + 8 + stepBob + idleBob;
    const fireGrad = ctx.createRadialGradient(tailX, tailY, 2, tailX, tailY, 14);
    fireGrad.addColorStop(0, `rgba(255, 165, 0, ${turbineGlow + 0.25})`);
    fireGrad.addColorStop(0.5, `rgba(239, 68, 68, ${turbineGlow})`);
    fireGrad.addColorStop(1, 'rgba(239, 68, 68, 0)');
    ctx.fillStyle = fireGrad;
    ctx.beginPath();
    ctx.arc(tailX, tailY, 14, 0, Math.PI * 2);
    ctx.fill();

    // Determine action, direction, and animation frame tick
    let action: 'idle' | 'walk' | 'shoot' = 'idle';
    let animTick = host.tick;
    if (host.reshiramAttackTick > 0) {
      action = 'shoot';
      animTick = 30 - host.reshiramAttackTick;
    } else if (isFollowerWalking) {
      action = 'walk';
      animTick = host.followerWalkTick;
    }
    const dir = host.followerDir || 'down';

    const pmdDrawn = host.pmdAnimator.draw(
      ctx,
      'reshiram',
      action,
      dir,
      coreX,
      coreY,
      animTick
    );

    if (!pmdDrawn && host.reshiramImg && host.reshiramImg.complete) {
      ctx.drawImage(host.reshiramImg, drawX - 13, drawY - 20 + stepBob + idleBob, 42, 42);
    }
  } else if (fid === 'zekrom') {
    const coreX = drawX + 8;
    const coreY = drawY + 16;
    const turbineGlow = 0.35 + Math.sin(host.tick * 0.09) * 0.15;
    const tailX = drawX - 3;
    const tailY = drawY + 8 + stepBob + idleBob;
    const elecGrad = ctx.createRadialGradient(tailX, tailY, 2, tailX, tailY, 15);
    elecGrad.addColorStop(0, `rgba(56, 189, 248, ${turbineGlow + 0.3})`);
    elecGrad.addColorStop(0.5, `rgba(2, 132, 199, ${turbineGlow})`);
    elecGrad.addColorStop(1, 'rgba(2, 132, 199, 0)');
    ctx.fillStyle = elecGrad;
    ctx.beginPath();
    ctx.arc(tailX, tailY, 15, 0, Math.PI * 2);
    ctx.fill();

    // Dynamic blue/cyan lightning discharges surging from the tail
    const sparkPhase = Math.floor(host.tick / 3) % 4;
    if (host.tick % 20 < 14) {
      ctx.fillStyle = sparkPhase % 2 === 0 ? '#38bdf8' : '#e0f2fe';
      ctx.fillRect(tailX + Math.sin(host.tick * 0.25) * 8, tailY - 5 - (host.tick % 14), 2, 2);
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(tailX - 3 + Math.cos(host.tick * 0.2) * 9, tailY - 2 - (host.tick % 10), 1.5, 1.5);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(tailX + 3 - Math.sin(host.tick * 0.15) * 8, tailY - 7 - (host.tick % 12), 1.5, 1.5);
    }

    // Determine action, direction, and animation frame tick
    let action: 'idle' | 'walk' | 'shoot' = 'idle';
    let animTick = host.tick;
    if (host.zekromAttackTick > 0) {
      action = 'shoot';
      animTick = 28 - host.zekromAttackTick;
    } else if (isFollowerWalking) {
      action = 'walk';
      animTick = host.followerWalkTick;
    }
    const dir = host.followerDir || 'down';

    const pmdDrawn = host.pmdAnimator.draw(
      ctx,
      'zekrom',
      action,
      dir,
      coreX,
      coreY,
      animTick
    );

    if (!pmdDrawn && host.zekromImg && host.zekromImg.complete) {
      ctx.drawImage(host.zekromImg, drawX - 13, drawY - 20 + stepBob + idleBob, 42, 42);
    }
  } else if (fid === 'giratina') {
    const coreX = drawX + 8;
    const coreY = drawY + 16;
    const shadowGrad = ctx.createRadialGradient(coreX, coreY, 2, coreX, coreY, 17);
    shadowGrad.addColorStop(0, 'rgba(232, 121, 249, 0.5)');
    shadowGrad.addColorStop(0.6, 'rgba(112, 26, 117, 0.35)');
    shadowGrad.addColorStop(1, 'rgba(15, 23, 42, 0)');
    ctx.fillStyle = shadowGrad;
    ctx.beginPath();
    ctx.arc(coreX, coreY, 17, 0, Math.PI * 2);
    ctx.fill();

    // Determine action, direction, and animation frame tick
    let action: 'idle' | 'walk' | 'shoot' = 'idle';
    let animTick = host.tick;
    if (host.giratinaAttackTick > 0) {
      action = 'shoot';
      animTick = 27 - host.giratinaAttackTick;
    } else if (isFollowerWalking) {
      action = 'walk';
      animTick = host.followerWalkTick;
    }
    const dir = host.followerDir || 'down';

    const pmdDrawn = host.pmdAnimator.draw(
      ctx,
      'giratina',
      action,
      dir,
      coreX,
      coreY,
      animTick
    );

    if (!pmdDrawn && host.giratinaImg && host.giratinaImg.complete) {
      ctx.drawImage(host.giratinaImg, drawX - 13, drawY - 20 + stepBob + idleBob * 1.5, 42, 42);
    }
  } else if (fid === 'groudon') {
    const coreX = drawX + 8;
    const coreY = drawY + 16;
    const heatGrad = ctx.createRadialGradient(coreX, coreY - 10, 2, coreX, coreY - 10, 18);
    heatGrad.addColorStop(0, 'rgba(239, 68, 68, 0.55)');
    heatGrad.addColorStop(0.5, 'rgba(249, 115, 22, 0.35)');
    heatGrad.addColorStop(1, 'rgba(180, 83, 9, 0)');
    ctx.fillStyle = heatGrad;
    ctx.beginPath();
    ctx.arc(coreX, coreY - 10, 18, 0, Math.PI * 2);
    ctx.fill();

    // Volcanic embers & magma sparks
    if (host.tick % 16 < 11) {
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(coreX + Math.sin(host.tick * 0.25) * 12, coreY - 12 - (host.tick % 10), 1.5, 1.5);
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(coreX - 6 + Math.cos(host.tick * 0.18) * 10, coreY - 6 - (host.tick % 8), 2, 2);
    }

    // Determine action, direction, and animation frame tick
    let action: 'idle' | 'walk' | 'shoot' = 'idle';
    let animTick = host.tick;
    if (host.groudonAttackTick > 0) {
      action = 'shoot';
      animTick = 28 - host.groudonAttackTick;
    } else if (isFollowerWalking) {
      action = 'walk';
      animTick = host.followerWalkTick;
    }
    const dir = host.followerDir || 'down';

    const pmdDrawn = host.pmdAnimator.draw(
      ctx,
      'groudon',
      action,
      dir,
      coreX,
      coreY,
      animTick
    );

    if (!pmdDrawn && host.groudonImg && host.groudonImg.complete) {
      ctx.drawImage(host.groudonImg, drawX - 13, drawY - 20 + stepBob, 42, 42);
    }
  } else if (fid === 'kyogre') {
    const coreX = drawX + 8;
    const coreY = drawY + 16;
    const aquaPulse = 0.35 + Math.sin(host.tick * 0.08) * 0.15;
    const aquaGrad = ctx.createRadialGradient(coreX, coreY - 10, 2, coreX, coreY - 10, 18);
    aquaGrad.addColorStop(0, `rgba(186, 230, 253, ${aquaPulse + 0.3})`);
    aquaGrad.addColorStop(0.5, `rgba(14, 165, 233, ${aquaPulse})`);
    aquaGrad.addColorStop(1, 'rgba(3, 105, 161, 0)');
    ctx.fillStyle = aquaGrad;
    ctx.beginPath();
    ctx.arc(coreX, coreY - 10, 18, 0, Math.PI * 2);
    ctx.fill();

    // Hydro droplet & bioluminescent mist bubbles
    if (host.tick % 16 < 11) {
      ctx.fillStyle = '#7dd3fc';
      ctx.fillRect(coreX + Math.sin(host.tick * 0.22) * 12, coreY - 12 - (host.tick % 10), 1.5, 1.5);
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(coreX - 6 + Math.cos(host.tick * 0.17) * 10, coreY - 6 - (host.tick % 8), 2, 2);
    }

    // Determine action, direction, and animation frame tick
    let action: 'idle' | 'walk' | 'shoot' = 'idle';
    let animTick = host.tick;
    if (host.kyogreAttackTick > 0) {
      action = 'shoot';
      animTick = 26 - host.kyogreAttackTick;
    } else if (isFollowerWalking) {
      action = 'walk';
      animTick = host.followerWalkTick;
    }
    const dir = host.followerDir || 'down';

    const pmdDrawn = host.pmdAnimator.draw(
      ctx,
      'kyogre',
      action,
      dir,
      coreX,
      coreY,
      animTick
    );

    if (!pmdDrawn && host.kyogreImg && host.kyogreImg.complete) {
      ctx.drawImage(host.kyogreImg, drawX - 13, drawY - 20 + stepBob + idleBob * 1.4, 42, 42);
    }
  } else if (fid === 'gyarados') {
    const coreX = drawX + 8;
    const coreY = drawY + 16;
    const aquaPulse = 0.35 + Math.sin(host.tick * 0.08) * 0.15;
    const aquaGrad = ctx.createRadialGradient(coreX, coreY - 10, 2, coreX, coreY - 10, 20);
    aquaGrad.addColorStop(0, `rgba(186, 230, 253, ${aquaPulse + 0.35})`);
    aquaGrad.addColorStop(0.5, `rgba(14, 165, 233, ${aquaPulse * 0.8})`);
    aquaGrad.addColorStop(1, 'rgba(3, 105, 161, 0)');
    ctx.fillStyle = aquaGrad;
    ctx.beginPath();
    ctx.arc(coreX, coreY - 10, 20, 0, Math.PI * 2);
    ctx.fill();

    // Surging water spray & dragon mist droplets
    if (host.tick % 16 < 11) {
      ctx.fillStyle = '#bae6fd';
      ctx.fillRect(coreX + Math.sin(host.tick * 0.22) * 13, coreY - 12 - (host.tick % 10), 1.5, 1.5);
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(coreX - 7 + Math.cos(host.tick * 0.17) * 11, coreY - 6 - (host.tick % 8), 2, 2);
    }

    // Determine action, direction, and animation frame tick
    let action: 'idle' | 'walk' | 'shoot' = 'idle';
    let animTick = host.tick;
    if (host.gyaradosAttackTick > 0) {
      action = 'shoot';
      animTick = 25 - host.gyaradosAttackTick;
    } else if (isFollowerWalking) {
      action = 'walk';
      animTick = host.followerWalkTick;
    }
    const dir = host.followerDir || 'down';

    host.pmdAnimator.draw(
      ctx,
      'gyarados',
      action,
      dir,
      coreX,
      coreY,
      animTick
    );
  } else if (fid === 'snorlax') {
    const coreX = drawX + 8;
    const coreY = drawY + 16;

    // Sleepy aura & subtle floating 'z' when idle
    if (!isFollowerWalking && host.tick % 60 < 25) {
      ctx.fillStyle = '#93c5fd';
      ctx.font = '8px monospace';
      ctx.fillText('z', coreX + 6 + (host.tick % 15) * 0.4, coreY - 14 - ((host.tick * 0.6) % 12));
    }

    let action: 'idle' | 'walk' | 'shoot' = 'idle';
    let animTick = host.tick;
    if (host.snorlaxAttackTick > 0) {
      action = 'shoot';
      animTick = 26 - host.snorlaxAttackTick;
    } else if (isFollowerWalking) {
      action = 'walk';
      animTick = host.followerWalkTick;
    }
    const dir = host.followerDir || 'down';

    host.pmdAnimator.draw(
      ctx,
      'snorlax',
      action,
      dir,
      coreX,
      coreY,
      animTick
    );
  } else if (fid === 'latios') {
    const coreX = drawX + 8;
    const coreY = drawY + 16;
    drawLatiosJetAura(ctx, host.tick, coreX, coreY - 10, true);

    let action: 'idle' | 'walk' | 'shoot' = 'idle';
    let animTick = host.tick;
    if (host.latiosAttackTick > 0) {
      action = 'shoot';
      animTick = 25 - host.latiosAttackTick;
    } else if (isFollowerWalking) {
      action = 'walk';
      animTick = host.followerWalkTick;
    }
    const dir = host.followerDir || 'down';

    const pmdDrawn = host.pmdAnimator.draw(
      ctx,
      'latios',
      action,
      dir,
      coreX,
      coreY,
      animTick
    );
    if (!pmdDrawn && host.latiosImg && host.latiosImg.complete) {
      ctx.drawImage(host.latiosImg, drawX - 13, drawY - 20 + stepBob + idleBob * 1.6, 42, 42);
    }
  } else if (fid === 'latias') {
    const coreX = drawX + 8;
    const coreY = drawY + 16;
    const rosePulse = 0.35 + Math.sin(host.tick * 0.08) * 0.15;
    const roseGrad = ctx.createRadialGradient(coreX, coreY - 10, 2, coreX, coreY - 10, 18);
    roseGrad.addColorStop(0, `rgba(254, 205, 211, ${rosePulse + 0.35})`);
    roseGrad.addColorStop(0.5, `rgba(244, 63, 94, ${rosePulse * 0.8})`);
    roseGrad.addColorStop(1, 'rgba(190, 18, 60, 0)');
    ctx.fillStyle = roseGrad;
    ctx.beginPath();
    ctx.arc(coreX, coreY - 10, 18, 0, Math.PI * 2);
    ctx.fill();

    // Refract Light sparkles
    if (host.tick % 16 < 10) {
      ctx.fillStyle = '#fecdd3';
      ctx.fillRect(coreX + Math.sin(host.tick * 0.22) * 12, coreY - 12 - (host.tick % 8), 1.5, 1.5);
    }

    let action: 'idle' | 'walk' | 'shoot' = 'idle';
    let animTick = host.tick;
    if (host.latiasAttackTick > 0) {
      action = 'shoot';
      animTick = 25 - host.latiasAttackTick;
    } else if (isFollowerWalking) {
      action = 'walk';
      animTick = host.followerWalkTick;
    }
    const dir = host.followerDir || 'down';

    const pmdDrawn = host.pmdAnimator.draw(
      ctx,
      'latias',
      action,
      dir,
      coreX,
      coreY,
      animTick
    );
    if (!pmdDrawn && host.latiasImg && host.latiasImg.complete) {
      ctx.drawImage(host.latiasImg, drawX - 13, drawY - 20 + stepBob + idleBob * 1.6, 42, 42);
    }
  } else if (fid === 'darkrai') {
    const coreX = drawX + 8;
    const coreY = drawY + 16;
    drawDarkraiVoidAura(ctx, host.tick, coreX, coreY - 10, true);

    let action: 'idle' | 'walk' | 'shoot' = 'idle';
    let animTick = host.tick;
    if (host.darkraiAttackTick > 0) {
      action = 'shoot';
      animTick = 30 - host.darkraiAttackTick;
    } else if (isFollowerWalking) {
      action = 'walk';
      animTick = host.followerWalkTick;
    }
    const dir = host.followerDir || 'down';

    const pmdDrawn = host.pmdAnimator.draw(
      ctx,
      'darkrai',
      action,
      dir,
      coreX,
      coreY,
      animTick
    );
    if (!pmdDrawn && host.darkraiImg && host.darkraiImg.complete) {
      ctx.drawImage(host.darkraiImg, drawX - 13, drawY - 20 + stepBob + idleBob * 1.4, 42, 42);
    }
  } else if (fid === 'necrozma') {
    if (host.necrozmaImg && host.necrozmaImg.complete) {
      const coreX = drawX + 8;
      const coreY = drawY + 4 + stepBob;
      const sunGrad = ctx.createRadialGradient(coreX, coreY, 2, coreX, coreY, 17);
      sunGrad.addColorStop(0, 'rgba(254, 240, 138, 0.65)');
      sunGrad.addColorStop(0.5, 'rgba(245, 158, 11, 0.35)');
      sunGrad.addColorStop(1, 'rgba(30, 27, 75, 0)');
      ctx.fillStyle = sunGrad;
      ctx.beginPath();
      ctx.arc(coreX, coreY, 17, 0, Math.PI * 2);
      ctx.fill();

      ctx.drawImage(host.necrozmaImg, drawX - 15, drawY - 21 + stepBob, 46, 43);
    }
  } else if (fid === 'lunala') {
    const coreX = drawX + 8;
    const coreY = drawY + 16;
    const moonPulse = 0.35 + Math.sin(host.tick * 0.08) * 0.15;
    const moonGrad = ctx.createRadialGradient(coreX, coreY - 14, 2, coreX, coreY - 14, 20);
    moonGrad.addColorStop(0, `rgba(224, 231, 255, ${moonPulse + 0.3})`);
    moonGrad.addColorStop(0.5, `rgba(129, 140, 248, ${moonPulse})`);
    moonGrad.addColorStop(0.8, `rgba(67, 56, 202, ${moonPulse * 0.5})`);
    moonGrad.addColorStop(1, 'rgba(15, 23, 42, 0)');
    ctx.fillStyle = moonGrad;
    ctx.beginPath();
    ctx.arc(coreX, coreY - 14, 20, 0, Math.PI * 2);
    ctx.fill();

    // Lunar dust sparkles & starlight constellation glints
    if (host.tick % 20 < 12) {
      ctx.fillStyle = '#c7d2fe';
      ctx.fillRect(coreX + Math.sin(host.tick * 0.22) * 14, coreY - 18 + Math.cos(host.tick * 0.22) * 8, 1.5, 1.5);
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(coreX - 9 + Math.cos(host.tick * 0.16) * 12, coreY - 11 + Math.sin(host.tick * 0.16) * 6, 2, 2);
    }

    // Determine action, direction, and animation frame tick
    let action: 'idle' | 'walk' | 'shoot' = 'idle';
    let animTick = host.tick;
    if (host.lunalaAttackTick > 0) {
      action = 'shoot';
      animTick = 25 - host.lunalaAttackTick;
    } else if (isFollowerWalking) {
      action = 'walk';
      animTick = host.followerWalkTick;
    }
    const dir = host.followerDir || 'down';

    const pmdDrawn = host.pmdAnimator.draw(
      ctx,
      'lunala',
      action,
      dir,
      coreX,
      coreY,
      animTick
    );

    if (!pmdDrawn && host.lunalaImg && host.lunalaImg.complete) {
      ctx.drawImage(host.lunalaImg, drawX - 15, drawY - 21 + stepBob + idleBob * 1.5, 46, 46);
    }
  } else if (fid === 'solgaleo') {
    const coreX = drawX + 8;
    const coreY = drawY + 16;
    const sunGrad = ctx.createRadialGradient(coreX, coreY - 10, 2, coreX, coreY - 10, 18);
    sunGrad.addColorStop(0, 'rgba(255, 255, 255, 0.7)');
    sunGrad.addColorStop(0.4, 'rgba(254, 240, 138, 0.45)');
    sunGrad.addColorStop(0.8, 'rgba(245, 158, 11, 0.25)');
    sunGrad.addColorStop(1, 'rgba(234, 88, 12, 0)');
    ctx.fillStyle = sunGrad;
    ctx.beginPath();
    ctx.arc(coreX, coreY - 10, 18, 0, Math.PI * 2);
    ctx.fill();

    // Determine action, direction, and animation frame tick
    let action: 'idle' | 'walk' | 'shoot' = 'idle';
    let animTick = host.tick;
    if (host.solgaleoAttackTick > 0) {
      action = 'shoot';
      animTick = 25 - host.solgaleoAttackTick;
    } else if (isFollowerWalking) {
      action = 'walk';
      animTick = host.followerWalkTick;
    }
    const dir = host.followerDir || 'down';

    const pmdDrawn = host.pmdAnimator.draw(
      ctx,
      'solgaleo',
      action,
      dir,
      coreX,
      coreY,
      animTick
    );

    if (!pmdDrawn && host.solgaleoImg && host.solgaleoImg.complete) {
      ctx.drawImage(host.solgaleoImg, drawX - 15, drawY - 21 + stepBob, 46, 43);
    }
  } else if (fid === 'samurott') {
    const coreX = drawX + 8;
    const coreY = drawY + 16;
    drawSamurottHydroAura(ctx, host.tick, coreX, coreY - 10, true);

    let action: 'idle' | 'walk' | 'attack' = 'idle';
    let animTick = host.tick;
    if (host.samurottAttackTick > 0) {
      action = 'attack';
      animTick = 27 - host.samurottAttackTick;
    } else if (isFollowerWalking) {
      action = 'walk';
      animTick = host.followerWalkTick;
    }
    const dir = host.followerDir || 'down';

    const pmdDrawn = host.pmdAnimator.draw(
      ctx,
      'samurott',
      action,
      dir,
      coreX,
      coreY,
      animTick
    );
    if (!pmdDrawn && host.samurottImg && host.samurottImg.complete) {
      ctx.drawImage(host.samurottImg, drawX - 13, drawY - 20 + stepBob + idleBob, 42, 42);
    }
  } else if (fid === 'empoleon') {
    const coreX = drawX + 8;
    const coreY = drawY + 16;
    drawEmpoleonTridentAura(ctx, host.tick, coreX, coreY - 10, true);

    let action: 'idle' | 'walk' | 'shoot' = 'idle';
    let animTick = host.tick;
    if (host.empoleonAttackTick > 0) {
      action = 'shoot';
      animTick = 26 - host.empoleonAttackTick;
    } else if (isFollowerWalking) {
      action = 'walk';
      animTick = host.followerWalkTick;
    }
    const dir = host.followerDir || 'down';

    const pmdDrawn = host.pmdAnimator.draw(
      ctx,
      'empoleon',
      action,
      dir,
      coreX,
      coreY,
      animTick
    );
    if (!pmdDrawn && host.empoleonImg && host.empoleonImg.complete) {
      ctx.drawImage(host.empoleonImg, drawX - 13, drawY - 20 + stepBob + idleBob, 42, 42);
    }
  } else if (fid === 'regigigas') {
    const coreX = drawX + 8;
    const coreY = drawY + 16;
    drawRegigigasRuneAura(ctx, host.tick, coreX, coreY - 12, true);

    let action: 'idle' | 'walk' | 'shoot' = 'idle';
    let animTick = host.tick;
    if (host.regigigasAttackTick > 0) {
      action = 'shoot';
      animTick = 29 - host.regigigasAttackTick;
    } else if (isFollowerWalking) {
      action = 'walk';
      animTick = host.followerWalkTick;
    }
    const dir = host.followerDir || 'down';

    const pmdDrawn = host.pmdAnimator.draw(
      ctx,
      'regigigas',
      action,
      dir,
      coreX,
      coreY,
      animTick
    );
    if (!pmdDrawn && host.regigigasImg && host.regigigasImg.complete) {
      ctx.drawImage(host.regigigasImg, drawX - 16, drawY - 24 + stepBob, 48, 48);
    }
  } else if (fid === 'koraidon') {
    const coreX = drawX + 8;
    const coreY = drawY + 16;
    drawKoraidonApexAura(ctx, host.tick, coreX, coreY - 12, true);

    let action: 'idle' | 'walk' | 'attack' = 'idle';
    let animTick = host.tick;
    if (host.koraidonAttackTick > 0) {
      action = 'attack';
      animTick = 26 - host.koraidonAttackTick;
    } else if (isFollowerWalking) {
      action = 'walk';
      animTick = host.followerWalkTick;
    }
    const dir = host.followerDir || 'down';

    const pmdDrawn = host.pmdAnimator.draw(
      ctx,
      'koraidon',
      action,
      dir,
      coreX,
      coreY,
      animTick
    );
    if (!pmdDrawn && host.koraidonImg && host.koraidonImg.complete) {
      ctx.drawImage(host.koraidonImg, drawX - 16, drawY - 24 + stepBob, 48, 48);
    }
  } else if (fid === 'eternatus') {
    const coreX = drawX + 8;
    const coreY = drawY + 16;
    drawEternatusDynamoAura(ctx, host.tick, coreX, coreY - 12, true);

    let action: 'idle' | 'walk' | 'shoot' = 'idle';
    let animTick = host.tick;
    if (host.eternatusAttackTick > 0) {
      action = 'shoot';
      animTick = 29 - host.eternatusAttackTick;
    } else if (isFollowerWalking) {
      action = 'walk';
      animTick = host.followerWalkTick;
    }
    const dir = host.followerDir || 'down';

    const pmdDrawn = host.pmdAnimator.draw(
      ctx,
      'eternatus',
      action,
      dir,
      coreX,
      coreY,
      animTick
    );
    if (!pmdDrawn && host.eternatusImg && host.eternatusImg.complete) {
      ctx.drawImage(host.eternatusImg, drawX - 16, drawY - 24 + stepBob + idleBob * 1.4, 48, 48);
    }
  } else if (fid === 'lugia') {
    const coreX = drawX + 8;
    const coreY = drawY + 16;
    drawLugiaAeroblastAura(ctx, host.tick, coreX, coreY - 12, true);

    let action: 'idle' | 'walk' | 'shoot' = 'idle';
    let animTick = host.tick;
    if (host.lugiaAttackTick > 0) {
      action = 'shoot';
      animTick = 24 - host.lugiaAttackTick;
    } else if (isFollowerWalking) {
      action = 'walk';
      animTick = host.followerWalkTick;
    }
    const dir = host.followerDir || 'down';

    const pmdDrawn = host.pmdAnimator.draw(
      ctx,
      'lugia',
      action,
      dir,
      coreX,
      coreY,
      animTick
    );
    if (!pmdDrawn && host.lugiaImg && host.lugiaImg.complete) {
      ctx.drawImage(host.lugiaImg, drawX - 16, drawY - 24 + stepBob + idleBob * 1.4, 48, 48);
    }
  }

  ctx.restore();

  // Cute thought emote bubble (heart or music note)
  if (host.followerEmoteTime > 0) {
    const pmdCfg = host.pmdAnimator.getConfig(fid);
    const topOffset = getDigimonById(fid)
      ? 26
      : pmdCfg
        ? Math.round(pmdCfg.idle.anchorY * pmdCfg.scale + 8)
        : 18;
    const emoteY = drawY + 16 - topOffset;
    ctx.save();
    ctx.font = '10px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.beginPath();
    ctx.arc(drawX + 8, emoteY, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.fillStyle = '#000000';
    ctx.fillText(host.followerEmote, drawX + 8, emoteY + 0.5);
    ctx.restore();
  }
}

export function drawLugiaAeroblastAura(
  ctx: CanvasRenderingContext2D,
  tick: number,
  coreX: number,
  coreY: number,
  withSparkles: boolean
) {
  const stormPulse = 0.34 + Math.sin(tick * 0.08) * 0.14;
  const auraGrad = ctx.createRadialGradient(coreX, coreY, 2, coreX, coreY, 21);
  auraGrad.addColorStop(0, `rgba(224, 242, 254, ${stormPulse + 0.32})`);
  auraGrad.addColorStop(0.45, `rgba(56, 189, 248, ${stormPulse + 0.12})`);
  auraGrad.addColorStop(0.8, `rgba(99, 102, 241, ${stormPulse * 0.65})`);
  auraGrad.addColorStop(1, 'rgba(30, 58, 138, 0)');
  ctx.fillStyle = auraGrad;
  ctx.beginPath();
  ctx.arc(coreX, coreY, 21, 0, Math.PI * 2);
  ctx.fill();

  if (withSparkles && tick % 20 < 12) {
    ctx.fillStyle = '#e0f2fe';
    ctx.fillRect(coreX + Math.sin(tick * 0.22) * 13, coreY - 4 + Math.cos(tick * 0.22) * 8, 2, 2);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(coreX - 8 + Math.cos(tick * 0.18) * 11, coreY + 3 - (tick % 10), 1.5, 1.5);
    ctx.fillStyle = '#c7d2fe';
    ctx.fillRect(coreX + 5 + Math.sin(tick * 0.26) * 8, coreY - 6 - (tick % 9), 1.5, 1.5);
  }
}

export function drawEternatusDynamoAura(
  ctx: CanvasRenderingContext2D,
  tick: number,
  coreX: number,
  coreY: number,
  withSparkles: boolean
) {
  const dynamoPulse = 0.34 + Math.sin(tick * 0.08) * 0.14;
  const auraGrad = ctx.createRadialGradient(coreX, coreY, 2, coreX, coreY, 21);
  auraGrad.addColorStop(0, `rgba(244, 114, 182, ${dynamoPulse + 0.3})`);
  auraGrad.addColorStop(0.45, `rgba(225, 29, 72, ${dynamoPulse + 0.1})`);
  auraGrad.addColorStop(0.8, `rgba(6, 182, 212, ${dynamoPulse * 0.65})`);
  auraGrad.addColorStop(1, 'rgba(30, 27, 75, 0)');
  ctx.fillStyle = auraGrad;
  ctx.beginPath();
  ctx.arc(coreX, coreY, 21, 0, Math.PI * 2);
  ctx.fill();

  if (withSparkles && tick % 20 < 12) {
    ctx.fillStyle = '#f43f5e';
    ctx.fillRect(coreX + Math.sin(tick * 0.22) * 13, coreY - 4 + Math.cos(tick * 0.22) * 8, 2, 2);
    ctx.fillStyle = '#06b6d4';
    ctx.fillRect(coreX - 8 + Math.cos(tick * 0.18) * 11, coreY + 3 - (tick % 10), 1.5, 1.5);
    ctx.fillStyle = '#f5d0fe';
    ctx.fillRect(coreX + 5 + Math.sin(tick * 0.26) * 8, coreY - 6 - (tick % 9), 1.5, 1.5);
  }
}

export function drawKoraidonApexAura(
  ctx: CanvasRenderingContext2D,
  tick: number,
  coreX: number,
  coreY: number,
  withSparkles: boolean
) {
  const apexPulse = 0.34 + Math.sin(tick * 0.08) * 0.14;
  const auraGrad = ctx.createRadialGradient(coreX, coreY, 2, coreX, coreY, 20);
  auraGrad.addColorStop(0, `rgba(254, 215, 170, ${apexPulse + 0.3})`);
  auraGrad.addColorStop(0.45, `rgba(239, 68, 68, ${apexPulse + 0.12})`);
  auraGrad.addColorStop(0.8, `rgba(234, 88, 12, ${apexPulse * 0.6})`);
  auraGrad.addColorStop(1, 'rgba(127, 29, 29, 0)');
  ctx.fillStyle = auraGrad;
  ctx.beginPath();
  ctx.arc(coreX, coreY, 20, 0, Math.PI * 2);
  ctx.fill();

  if (withSparkles && tick % 20 < 12) {
    ctx.fillStyle = '#facc15';
    ctx.fillRect(coreX + Math.sin(tick * 0.22) * 12, coreY - 4 + Math.cos(tick * 0.22) * 7, 1.5, 1.5);
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(coreX - 7 + Math.cos(tick * 0.18) * 11, coreY + 4 - (tick % 10), 2, 2);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(coreX + 4 + Math.sin(tick * 0.28) * 8, coreY + 1 - (tick % 9), 1.5, 1.5);
  }
}

export function drawRegigigasRuneAura(
  ctx: CanvasRenderingContext2D,
  tick: number,
  coreX: number,
  coreY: number,
  withSparkles: boolean
) {
  const runePulse = 0.3 + Math.sin(tick * 0.06) * 0.14;
  const auraGrad = ctx.createRadialGradient(coreX, coreY, 2, coreX, coreY, 21);
  auraGrad.addColorStop(0, `rgba(254, 240, 138, ${runePulse + 0.3})`);
  auraGrad.addColorStop(0.45, `rgba(234, 179, 8, ${runePulse + 0.1})`);
  auraGrad.addColorStop(0.8, `rgba(74, 222, 128, ${runePulse * 0.55})`);
  auraGrad.addColorStop(1, 'rgba(20, 83, 45, 0)');
  ctx.fillStyle = auraGrad;
  ctx.beginPath();
  ctx.arc(coreX, coreY, 21, 0, Math.PI * 2);
  ctx.fill();

  if (withSparkles && tick % 24 < 14) {
    const colors = ['#facc15', '#38bdf8', '#ef4444'];
    ctx.fillStyle = colors[Math.floor(tick / 12) % colors.length];
    ctx.fillRect(coreX + Math.sin(tick * 0.16) * 13, coreY - 5 + Math.cos(tick * 0.16) * 7, 2, 2);
    ctx.fillStyle = '#4ade80';
    ctx.fillRect(coreX - 8 + Math.cos(tick * 0.14) * 11, coreY + 4 - (tick % 9), 1.5, 1.5);
  }
}

export function drawDarkraiVoidAura(
  ctx: CanvasRenderingContext2D,
  tick: number,
  coreX: number,
  coreY: number,
  withSparkles: boolean
) {
  const voidPulse = 0.35 + Math.sin(tick * 0.07) * 0.15;
  const voidGrad = ctx.createRadialGradient(coreX, coreY, 2, coreX, coreY, 19);
  voidGrad.addColorStop(0, `rgba(192, 132, 252, ${voidPulse + 0.25})`);
  voidGrad.addColorStop(0.5, `rgba(88, 28, 135, ${voidPulse})`);
  voidGrad.addColorStop(1, 'rgba(15, 23, 42, 0)');
  ctx.fillStyle = voidGrad;
  ctx.beginPath();
  ctx.arc(coreX, coreY, 19, 0, Math.PI * 2);
  ctx.fill();

  if (withSparkles && tick % 22 < 14) {
    ctx.fillStyle = '#a855f7';
    ctx.fillRect(coreX + Math.sin(tick * 0.2) * 12, coreY + 6 - ((tick * 1.3) % 18), 1.5, 1.5);
    ctx.fillStyle = '#1e1b4b';
    ctx.fillRect(coreX - 8 + Math.cos(tick * 0.16) * 10, coreY + 8 - ((tick * 1.1) % 16), 2, 2);
    ctx.fillStyle = '#f3e8ff';
    ctx.fillRect(coreX + 4 + Math.sin(tick * 0.28) * 8, coreY - 4 - (tick % 10), 1.5, 1.5);
  }
}

export function drawCharizardFlameAura(
  ctx: CanvasRenderingContext2D,
  tick: number,
  coreX: number,
  coreY: number,
  withSparkles: boolean = true
) {
  const flamePulse = 0.35 + Math.sin(tick * 0.12) * 0.15;
  const flameGrad = ctx.createRadialGradient(coreX, coreY, 2, coreX, coreY, 18);
  flameGrad.addColorStop(0, `rgba(255, 245, 150, ${flamePulse + 0.3})`);
  flameGrad.addColorStop(0.45, `rgba(249, 115, 22, ${flamePulse})`);
  flameGrad.addColorStop(0.8, `rgba(239, 68, 68, ${flamePulse * 0.6})`);
  flameGrad.addColorStop(1, 'rgba(185, 28, 28, 0)');
  ctx.fillStyle = flameGrad;
  ctx.beginPath();
  ctx.arc(coreX, coreY, 18, 0, Math.PI * 2);
  ctx.fill();

  if (withSparkles && tick % 16 < 11) {
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(coreX + Math.sin(tick * 0.25) * 11, coreY - 4 - (tick % 8), 1.5, 1.5);
    ctx.fillStyle = '#f97316';
    ctx.fillRect(coreX - 6 + Math.cos(tick * 0.2) * 10, coreY + 2 - (tick % 6), 2, 2);
    ctx.fillStyle = '#ffedd5';
    ctx.fillRect(coreX + 4 + Math.sin(tick * 0.3) * 8, coreY - 6 - (tick % 7), 1.5, 1.5);
  }
}

export function drawGardevoirPsychicAura(
  ctx: CanvasRenderingContext2D,
  tick: number,
  coreX: number,
  coreY: number,
  withSparkles: boolean = true
) {
  const auraPulse = 0.32 + Math.sin(tick * 0.09) * 0.14;
  const auraGrad = ctx.createRadialGradient(coreX, coreY, 2, coreX, coreY, 18);
  auraGrad.addColorStop(0, `rgba(251, 207, 232, ${auraPulse + 0.3})`);
  auraGrad.addColorStop(0.45, `rgba(244, 114, 182, ${auraPulse + 0.1})`);
  auraGrad.addColorStop(0.8, `rgba(192, 132, 252, ${auraPulse * 0.6})`);
  auraGrad.addColorStop(1, 'rgba(147, 51, 234, 0)');
  ctx.fillStyle = auraGrad;
  ctx.beginPath();
  ctx.arc(coreX, coreY, 18, 0, Math.PI * 2);
  ctx.fill();

  if (withSparkles && tick % 18 < 11) {
    ctx.fillStyle = '#fbcfe8';
    ctx.fillRect(coreX + Math.sin(tick * 0.22) * 11, coreY - 4 + Math.cos(tick * 0.22) * 6, 1.5, 1.5);
    ctx.fillStyle = '#f472b6';
    ctx.fillRect(coreX - 6 + Math.cos(tick * 0.18) * 9, coreY + 3 - (tick % 8), 1.5, 1.5);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(coreX + 4 + Math.sin(tick * 0.28) * 8, coreY - 6 - (tick % 6), 1.5, 1.5);
  }
}

export function drawCelebiForestAura(
  ctx: CanvasRenderingContext2D,
  tick: number,
  coreX: number,
  coreY: number,
  withSparkles: boolean = true
) {
  const forestPulse = 0.32 + Math.sin(tick * 0.09) * 0.14;
  const auraGrad = ctx.createRadialGradient(coreX, coreY, 2, coreX, coreY, 18);
  auraGrad.addColorStop(0, `rgba(254, 240, 138, ${forestPulse + 0.3})`);
  auraGrad.addColorStop(0.45, `rgba(74, 222, 128, ${forestPulse + 0.15})`);
  auraGrad.addColorStop(0.8, `rgba(34, 197, 94, ${forestPulse * 0.6})`);
  auraGrad.addColorStop(1, 'rgba(21, 128, 61, 0)');
  ctx.fillStyle = auraGrad;
  ctx.beginPath();
  ctx.arc(coreX, coreY, 18, 0, Math.PI * 2);
  ctx.fill();

  if (withSparkles && tick % 18 < 11) {
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(coreX + Math.sin(tick * 0.24) * 11, coreY - 5 + Math.cos(tick * 0.24) * 7, 1.5, 1.5);
    ctx.fillStyle = '#86efac';
    ctx.fillRect(coreX - 6 + Math.cos(tick * 0.18) * 10, coreY + 3 - (tick % 8), 1.5, 1.5);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(coreX + 4 + Math.sin(tick * 0.3) * 8, coreY - 6 - (tick % 7), 1.5, 1.5);
  }
}

export function drawUrshifuTorrentAura(
  ctx: CanvasRenderingContext2D,
  tick: number,
  coreX: number,
  coreY: number,
  withSparkles: boolean
) {
  // G-Max Rapid Strike dual aura: crimson Dynamax glow + hydro azure mist
  const torrentPulse = 0.3 + Math.sin(tick * 0.08) * 0.14;
  const auraGrad = ctx.createRadialGradient(coreX, coreY, 2, coreX, coreY, 18);
  auraGrad.addColorStop(0, `rgba(186, 230, 253, ${torrentPulse + 0.28})`);
  auraGrad.addColorStop(0.45, `rgba(56, 189, 248, ${torrentPulse + 0.1})`);
  auraGrad.addColorStop(0.8, `rgba(239, 68, 68, ${torrentPulse * 0.6})`);
  auraGrad.addColorStop(1, 'rgba(15, 23, 42, 0)');
  ctx.fillStyle = auraGrad;
  ctx.beginPath();
  ctx.arc(coreX, coreY, 18, 0, Math.PI * 2);
  ctx.fill();

  if (withSparkles) {
    const dynPhase = (tick * 0.05) % (Math.PI * 2);
    const cloudX = coreX + Math.cos(dynPhase) * 14;
    const cloudY = coreY - 18 + Math.sin(dynPhase) * 4;
    ctx.fillStyle = 'rgba(239, 68, 68, 0.75)';
    ctx.fillRect(cloudX, cloudY, 2.5, 2);
    ctx.fillStyle = 'rgba(244, 63, 94, 0.65)';
    ctx.fillRect(cloudX - 2, cloudY + 1, 2, 1.5);

    if (tick % 16 < 11) {
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(coreX + Math.sin(tick * 0.1) * 13, coreY - 2 + Math.cos(tick * 0.1) * 4, 2, 2);
      ctx.fillStyle = '#bae6fd';
      ctx.fillRect(coreX - 4 + Math.cos(tick * 0.15) * 10, coreY + 2 - (tick % 8), 1.5, 1.5);
    }
  }
}

export function drawEmpoleonTridentAura(
  ctx: CanvasRenderingContext2D,
  tick: number,
  coreX: number,
  coreY: number,
  withSparkles: boolean
) {
  const tridentPulse = 0.32 + Math.sin(tick * 0.08) * 0.14;
  const auraGrad = ctx.createRadialGradient(coreX, coreY, 2, coreX, coreY, 18);
  auraGrad.addColorStop(0, `rgba(224, 242, 254, ${tridentPulse + 0.3})`);
  auraGrad.addColorStop(0.45, `rgba(56, 189, 248, ${tridentPulse + 0.12})`);
  auraGrad.addColorStop(0.8, `rgba(29, 78, 216, ${tridentPulse * 0.65})`);
  auraGrad.addColorStop(1, 'rgba(30, 58, 138, 0)');
  ctx.fillStyle = auraGrad;
  ctx.beginPath();
  ctx.arc(coreX, coreY, 18, 0, Math.PI * 2);
  ctx.fill();

  if (withSparkles && tick % 20 < 12) {
    ctx.fillStyle = '#fde047';
    ctx.fillRect(coreX + Math.sin(tick * 0.2) * 11, coreY - 6 + Math.cos(tick * 0.2) * 6, 1.5, 1.5);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(coreX - 6 + Math.cos(tick * 0.18) * 10, coreY + 4 - (tick % 10), 2, 2);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(coreX + 4 + Math.sin(tick * 0.26) * 8, coreY + 2 - (tick % 9), 1.5, 1.5);
  }
}

export function drawSamurottHydroAura(
  ctx: CanvasRenderingContext2D,
  tick: number,
  coreX: number,
  coreY: number,
  withSparkles: boolean
) {
  const waterPulse = 0.3 + Math.sin(tick * 0.08) * 0.15;
  const waterGrad = ctx.createRadialGradient(coreX, coreY, 2, coreX, coreY, 18);
  waterGrad.addColorStop(0, `rgba(255, 255, 255, ${waterPulse + 0.3})`);
  waterGrad.addColorStop(0.4, `rgba(56, 189, 248, ${waterPulse + 0.15})`);
  waterGrad.addColorStop(0.75, `rgba(14, 165, 233, ${waterPulse * 0.7})`);
  waterGrad.addColorStop(1, 'rgba(2, 132, 199, 0)');
  ctx.fillStyle = waterGrad;
  ctx.beginPath();
  ctx.arc(coreX, coreY, 18, 0, Math.PI * 2);
  ctx.fill();

  if (withSparkles && tick % 20 < 12) {
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(coreX + Math.sin(tick * 0.22) * 12, coreY + 4 - ((tick * 1.2) % 14), 1.5, 1.5);
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(coreX - 6 + Math.cos(tick * 0.17) * 10, coreY + 5 - ((tick * 1.0) % 13), 2, 2);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(coreX + 4 + Math.sin(tick * 0.28) * 8, coreY + 2 - (tick % 11), 1.5, 1.5);
  }
}

export function drawLatiosJetAura(
  ctx: CanvasRenderingContext2D,
  tick: number,
  coreX: number,
  coreY: number,
  withSparkles: boolean
) {
  const jetPulse = 0.35 + Math.sin(tick * 0.09) * 0.15;
  const auraGrad = ctx.createRadialGradient(coreX, coreY, 2, coreX, coreY, 18);
  auraGrad.addColorStop(0, `rgba(191, 219, 254, ${jetPulse + 0.3})`);
  auraGrad.addColorStop(0.5, `rgba(59, 130, 246, ${jetPulse})`);
  auraGrad.addColorStop(1, 'rgba(29, 78, 216, 0)');
  ctx.fillStyle = auraGrad;
  ctx.beginPath();
  ctx.arc(coreX, coreY, 18, 0, Math.PI * 2);
  ctx.fill();

  if (withSparkles && tick % 20 < 12) {
    ctx.fillStyle = '#93c5fd';
    ctx.fillRect(coreX + Math.sin(tick * 0.24) * 12, coreY - 4 + Math.cos(tick * 0.24) * 8, 1.5, 1.5);
    ctx.fillStyle = '#60a5fa';
    ctx.fillRect(coreX - 8 + Math.cos(tick * 0.18) * 10, coreY + 3 + Math.sin(tick * 0.18) * 6, 2, 2);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(coreX + 4 + Math.sin(tick * 0.3) * 8, coreY - 5 - (tick % 7), 1.5, 1.5);
  }
}

export function spawnRideMountFX(host: TownPokemonFxHost) {
  const ox = host.playerPos.x * TILE_SIZE + 8;
  const oy = host.playerPos.y * TILE_SIZE + 16;
  for (let i = 0; i < 24; i++) {
    const ang = Math.random() * Math.PI * 2;
    const spd = 1.5 + Math.random() * 3;
    host.moveParticles.push({
      x: ox,
      y: oy,
      vx: Math.cos(ang) * spd,
      vy: Math.sin(ang) * spd - 1,
      size: 2.5 + Math.random() * 2,
      color: ['#facc15', '#38bdf8', '#c084fc', '#ffffff', '#4ade80'][Math.floor(Math.random() * 5)],
      alpha: 0.9,
      life: 0,
      maxLife: 20 + Math.floor(Math.random() * 10),
      type: 'cosmic',
    });
  }
}

export function spawnRideTrailFX(host: TownPokemonFxHost, drawX: number, drawY: number) {
  if (!host.activeFollower) return;
  const fid = host.activeFollower.id;
  const rideClass = host.getRideClass(fid);
  const tileX = Math.max(0, Math.min(host.map.w - 1, Math.round(drawX / TILE_SIZE)));
  const tileY = Math.max(0, Math.min(host.map.h - 1, Math.round(drawY / TILE_SIZE)));
  const override = townConfig.getTileOverride(tileX, tileY);
  const baseGround = host.map.ground[tileY * host.map.w + tileX];
  const isOverWater = host.isWorldScene() && (override === 'water' || baseGround === Tile.WATER);

  const cx = drawX + 8;
  const cy = drawY + 14;

  if (isOverWater && rideClass === 'surf') {
    // Aqua Surf water wake ripples & splash droplets
    host.particles.push({
      x: cx + (Math.random() - 0.5) * 6,
      y: cy,
      vx: 0,
      vy: 0,
      size: 2.5,
      alpha: 0.65,
      color: 'rgba(125, 211, 252, 0.85)',
      type: 'ripple',
      life: 0,
      maxLife: 16,
    });
    host.moveParticles.push({
      x: cx + (Math.random() - 0.5) * 10,
      y: cy,
      vx: (Math.random() - 0.5) * 1.4,
      vy: -0.8 - Math.random() * 1.2,
      size: 2,
      color: Math.random() < 0.5 ? '#38bdf8' : '#e0f2fe',
      alpha: 0.85,
      life: 0,
      maxLife: 14,
      type: 'water',
    });
    return;
  }

  if (rideClass === 'sky') {
    // Sky Soar wind / starlight slipstream particles
    const colorMap: Record<string, string[]> = {
      rayquaza: ['#34d399', '#a7f3d0', '#fef08a'],
      lunala: ['#818cf8', '#e0e7ff', '#38bdf8'],
      giratina: ['#c084fc', '#f43f5e', '#fde047'],
      reshiram: ['#fb923c', '#fef08a', '#ffffff'],
      zekrom: ['#38bdf8', '#93c5fd', '#e0f2fe'],
      charizard: ['#f97316', '#facc15', '#fed7aa'],
      lugia: ['#e0f2fe', '#7dd3fc', '#a5b4fc'],
    };
    const palette = colorMap[fid] || ['#38bdf8', '#e0f2fe', '#c084fc'];
    host.moveParticles.push({
      x: cx + (Math.random() - 0.5) * 12,
      y: cy - 6 + (Math.random() - 0.5) * 6,
      vx: -DIRS[host.playerDir].x * (1.2 + Math.random()) + (Math.random() - 0.5) * 0.6,
      vy: -DIRS[host.playerDir].y * (1.2 + Math.random()) + (Math.random() - 0.5) * 0.6,
      size: 2 + Math.random() * 1.5,
      color: palette[Math.floor(Math.random() * palette.length)],
      alpha: 0.8,
      life: 0,
      maxLife: 15,
      type: 'cosmic',
    });
    return;
  }

  // Terra Charge high-speed ground dash sparks + dust puff
  host.spawnDustPuff(drawX, drawY);
  if (host.tick % 6 === 0) {
    const sparkColors: Record<string, string> = {
      dialga: '#38bdf8',
      arceus: '#facc15',
      groudon: '#f97316',
      solgaleo: '#fde047',
      lucario: '#60a5fa',
      pikachu: '#facc15',
    };
    host.moveParticles.push({
      x: cx + (Math.random() - 0.5) * 10,
      y: cy,
      vx: -DIRS[host.playerDir].x * 1.5 + (Math.random() - 0.5),
      vy: -0.6 - Math.random() * 0.8,
      size: 2,
      color: sparkColors[fid] || '#cbd5e1',
      alpha: 0.85,
      life: 0,
      maxLife: 12,
      type: 'aura',
    });
  }
}

export function drawPokeRide(
  host: TownPokemonFxHost,
  ctx: CanvasRenderingContext2D,
  drawX: number,
  drawY: number,
  stepFrame: number
) {
  if (!host.activeFollower) return;
  const fid = host.activeFollower.id;
  const isMoving = host.isMoving;
  const animTick = isMoving ? Math.floor(host.tick * 1.35) : host.tick;
  const dir = host.playerDir;
  const coreX = drawX + 8;
  const coreY = drawY + 16;

  // Special case: Pikachu sprints alongside / on Ash's shoulder with lightning aura!
  if (fid === 'pikachu') {
    drawCharacter(ctx, host.playerPalette, host.playerDir, stepFrame, drawX, drawY, 1);
    if (!host.playerPalette.isAsh) {
      const pikaOffset = host.playerDir === 'left' ? 7 : -5;
      const pikaBob = isMoving ? Math.sin(host.moveProgress * Math.PI * 2) * 1.5 : Math.sin(host.tick * 0.08) * 1.0;
      drawPikachu(ctx, drawX + pikaOffset, drawY - 14 + pikaBob);
    }
    return;
  }

  const rideClass = host.getRideClass(fid);
  const tileX = Math.max(0, Math.min(host.map.w - 1, Math.round(drawX / TILE_SIZE)));
  const tileY = Math.max(0, Math.min(host.map.h - 1, Math.round(drawY / TILE_SIZE)));
  const override = townConfig.getTileOverride(tileX, tileY);
  const baseGround = host.map.ground[tileY * host.map.w + tileX];
  const isOverWater = host.isWorldScene() && (override === 'water' || baseGround === Tile.WATER);

  // Step bob / ride bobbing
  const rideBob = isMoving
    ? Math.sin(host.moveProgress * Math.PI * 2) * (rideClass === 'sky' ? 2.0 : 1.5)
    : Math.sin(host.tick * 0.08) * (rideClass === 'sky' ? 1.8 : 1.0);

  // Ground shadow or water wake beneath the Pokémon mount (never on top of the Pokémon!)
  const shadowMap: Record<string, { rx: number; ry: number; yOff: number }> = {
    urshifu: { rx: 16, ry: 5.5, yOff: 16 },
    lunala: { rx: 17, ry: 5, yOff: 16 },
    solgaleo: { rx: 16, ry: 6, yOff: 16 },
    samurott: { rx: 14, ry: 5, yOff: 16 },
    empoleon: { rx: 13, ry: 5, yOff: 16 },
    regigigas: { rx: 16, ry: 6, yOff: 16 },
    koraidon: { rx: 15, ry: 5.5, yOff: 16 },
    eternatus: { rx: 16, ry: 5.5, yOff: 16 },
    lugia: { rx: 16, ry: 5.5, yOff: 16 },
    necrozma: { rx: 16, ry: 6, yOff: 16 },
    groudon: { rx: 15, ry: 6, yOff: 16 },
    kyogre: { rx: 15, ry: 5.5, yOff: 16 },
    gyarados: { rx: 16, ry: 5.5, yOff: 16 },
    snorlax: { rx: 15, ry: 6, yOff: 15 },
    dialga: { rx: 15, ry: 5.5, yOff: 16 },
    palkia: { rx: 15, ry: 5.5, yOff: 16 },
    giratina: { rx: 15, ry: 5.5, yOff: 16 },
    zekrom: { rx: 15, ry: 5.5, yOff: 16 },
    reshiram: { rx: 15, ry: 5.5, yOff: 16 },
    rayquaza: { rx: 15, ry: 5.5, yOff: 16 },
    darkrai: { rx: 14, ry: 5.5, yOff: 16 },
    garchomp: { rx: 15, ry: 5.5, yOff: 16 },
    tyranitar: { rx: 15, ry: 5.5, yOff: 16 },
    charizard: { rx: 15, ry: 5.5, yOff: 16 },
    gardevoir: { rx: 13, ry: 4.5, yOff: 15 },
    celebi: { rx: 11, ry: 4.0, yOff: 15 },
    arceus: { rx: 14, ry: 5, yOff: 16 },
    mewtwo: { rx: 13, ry: 4.5, yOff: 16 },
    latios: { rx: 13, ry: 4.5, yOff: 16 },
    latias: { rx: 13, ry: 4.5, yOff: 16 },
  };
  const s = shadowMap[fid] ?? { rx: 14, ry: 5, yOff: 16 };
  ctx.fillStyle = rideClass === 'sky' ? 'rgba(15, 23, 42, 0.28)' : 'rgba(15, 23, 42, 0.42)';
  ctx.beginPath();
  ctx.ellipse(
    coreX,
    drawY + s.yOff,
    rideClass === 'sky' ? s.rx * 0.85 : s.rx,
    rideClass === 'sky' ? s.ry * 0.85 : s.ry,
    0,
    0,
    Math.PI * 2
  );
  ctx.fill();

  // Water surf wake ring when surfing on water
  if (isOverWater && rideClass === 'surf') {
    const wavePulse = 0.5 + 0.5 * Math.sin(host.tick * 0.14);
    ctx.save();
    ctx.strokeStyle = `rgba(186, 230, 253, ${0.55 + wavePulse * 0.3})`;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.ellipse(coreX, drawY + 15, s.rx + 2 + wavePulse * 2, s.ry + 1, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  // Determine attack tick and action
  let action: PMDAction = isMoving ? 'walk' : 'idle';
  let attackTick = 0;
  if (fid === 'rayquaza' && host.rayquazaAttackTick > 0) {
    action = 'shoot';
    attackTick = 26 - host.rayquazaAttackTick;
  } else if (fid === 'arceus' && host.arceusAttackTick > 0) {
    action = 'shoot';
    attackTick = 30 - host.arceusAttackTick;
  } else if (fid === 'reshiram' && host.reshiramAttackTick > 0) {
    action = 'shoot';
    attackTick = 28 - host.reshiramAttackTick;
  } else if (fid === 'zekrom' && host.zekromAttackTick > 0) {
    action = 'shoot';
    attackTick = 26 - host.zekromAttackTick;
  } else if (fid === 'giratina' && host.giratinaAttackTick > 0) {
    action = 'shoot';
    attackTick = 24 - host.giratinaAttackTick;
  } else if (fid === 'palkia' && host.palkiaAttackTick > 0) {
    action = 'shoot';
    attackTick = 28 - host.palkiaAttackTick;
  } else if (fid === 'dialga' && host.dialgaAttackTick > 0) {
    action = 'shoot';
    attackTick = 28 - host.dialgaAttackTick;
  } else if (fid === 'lunala' && host.lunalaAttackTick > 0) {
    action = 'shoot';
    attackTick = 25 - host.lunalaAttackTick;
  } else if (fid === 'solgaleo' && host.solgaleoAttackTick > 0) {
    action = 'shoot';
    attackTick = 25 - host.solgaleoAttackTick;
  } else if (fid === 'garchomp' && host.garchompAttackTick > 0) {
    action = 'shoot';
    attackTick = 26 - host.garchompAttackTick;
  } else if (fid === 'groudon' && host.groudonAttackTick > 0) {
    action = 'shoot';
    attackTick = 28 - host.groudonAttackTick;
  } else if (fid === 'kyogre' && host.kyogreAttackTick > 0) {
    action = 'shoot';
    attackTick = 26 - host.kyogreAttackTick;
  } else if (fid === 'tyranitar' && host.tyranitarAttackTick > 0) {
    action = 'shoot';
    attackTick = 26 - host.tyranitarAttackTick;
  } else if (fid === 'gyarados' && host.gyaradosAttackTick > 0) {
    action = 'shoot';
    attackTick = 25 - host.gyaradosAttackTick;
  } else if (fid === 'snorlax' && host.snorlaxAttackTick > 0) {
    action = 'shoot';
    attackTick = 26 - host.snorlaxAttackTick;
  } else if (fid === 'samurott' && host.samurottAttackTick > 0) {
    action = 'attack';
    attackTick = 27 - host.samurottAttackTick;
  } else if (fid === 'empoleon' && host.empoleonAttackTick > 0) {
    action = 'shoot';
    attackTick = 26 - host.empoleonAttackTick;
  } else if (fid === 'regigigas' && host.regigigasAttackTick > 0) {
    action = 'shoot';
    attackTick = 29 - host.regigigasAttackTick;
  } else if (fid === 'koraidon' && host.koraidonAttackTick > 0) {
    action = 'attack';
    attackTick = 26 - host.koraidonAttackTick;
  } else if (fid === 'eternatus' && host.eternatusAttackTick > 0) {
    action = 'shoot';
    attackTick = 29 - host.eternatusAttackTick;
  } else if (fid === 'latios' && host.latiosAttackTick > 0) {
    action = 'shoot';
    attackTick = 25 - host.latiosAttackTick;
  } else if (fid === 'latias' && host.latiasAttackTick > 0) {
    action = 'shoot';
    attackTick = 25 - host.latiasAttackTick;
  } else if (fid === 'darkrai' && host.darkraiAttackTick > 0) {
    action = 'shoot';
    attackTick = 30 - host.darkraiAttackTick;
  } else if (fid === 'urshifu' && host.urshifuAttackTick > 0) {
    action = 'attack';
    attackTick = 28 - host.urshifuAttackTick;
  } else if (fid === 'charizard' && host.charizardAttackTick > 0) {
    action = 'shoot';
    attackTick = 28 - host.charizardAttackTick;
  } else if (fid === 'gardevoir' && host.gardevoirAttackTick > 0) {
    action = 'shoot';
    attackTick = 26 - host.gardevoirAttackTick;
  } else if (fid === 'celebi' && host.celebiAttackTick > 0) {
    action = 'shoot';
    attackTick = 26 - host.celebiAttackTick;
  } else if (fid === 'lugia' && host.lugiaAttackTick > 0) {
    action = 'shoot';
    attackTick = 24 - host.lugiaAttackTick;
  }

  const curAnimTick = attackTick > 0 ? attackTick : animTick;

  // Draw background visual aura for PMD/legendary Pokémon
  if (fid === 'rayquaza') {
    const ozonePulse = 0.35 + Math.sin(host.tick * 0.08) * 0.15;
    const ozoneGrad = ctx.createRadialGradient(coreX, coreY - 12, 3, coreX, coreY - 12, 22);
    ozoneGrad.addColorStop(0, `rgba(52, 211, 153, ${ozonePulse + 0.3})`);
    ozoneGrad.addColorStop(0.5, `rgba(16, 185, 129, ${ozonePulse})`);
    ozoneGrad.addColorStop(1, 'rgba(16, 185, 129, 0)');
    ctx.fillStyle = ozoneGrad;
    ctx.beginPath();
    ctx.arc(coreX, coreY - 12, 22, 0, Math.PI * 2);
    ctx.fill();
  } else if (fid === 'arceus') {
    const cosPulse = 0.35 + Math.sin(host.tick * 0.08) * 0.15;
    const cosGrad = ctx.createRadialGradient(coreX, coreY - 12, 3, coreX, coreY - 12, 20);
    cosGrad.addColorStop(0, `rgba(254, 240, 138, ${cosPulse + 0.3})`);
    cosGrad.addColorStop(0.5, `rgba(234, 179, 8, ${cosPulse})`);
    cosGrad.addColorStop(1, 'rgba(234, 179, 8, 0)');
    ctx.fillStyle = cosGrad;
    ctx.beginPath();
    ctx.arc(coreX, coreY - 12, 20, 0, Math.PI * 2);
    ctx.fill();
  } else if (fid === 'dialga') {
    const corePulse = 0.35 + Math.sin(host.tick * 0.08) * 0.15;
    const coreGrad = ctx.createRadialGradient(coreX, coreY - 10, 2, coreX, coreY - 10, 20);
    coreGrad.addColorStop(0, `rgba(224, 242, 254, ${corePulse + 0.35})`);
    coreGrad.addColorStop(0.45, `rgba(56, 189, 248, ${corePulse + 0.1})`);
    coreGrad.addColorStop(1, 'rgba(2, 132, 199, 0)');
    ctx.fillStyle = coreGrad;
    ctx.beginPath();
    ctx.arc(coreX, coreY - 10, 20, 0, Math.PI * 2);
    ctx.fill();
  } else if (fid === 'palkia') {
    const spatialPulse = 0.35 + Math.sin(host.tick * 0.08) * 0.15;
    const spatGrad = ctx.createRadialGradient(coreX, coreY - 10, 3, coreX, coreY - 10, 20);
    spatGrad.addColorStop(0, `rgba(240, 171, 252, ${spatialPulse + 0.3})`);
    spatGrad.addColorStop(0.5, `rgba(192, 38, 211, ${spatialPulse})`);
    spatGrad.addColorStop(1, 'rgba(192, 38, 211, 0)');
    ctx.fillStyle = spatGrad;
    ctx.beginPath();
    ctx.arc(coreX, coreY - 10, 20, 0, Math.PI * 2);
    ctx.fill();
  } else if (fid === 'lunala') {
    const moonPulse = 0.35 + Math.sin(host.tick * 0.08) * 0.15;
    const moonGrad = ctx.createRadialGradient(coreX, coreY - 14, 2, coreX, coreY - 14, 22);
    moonGrad.addColorStop(0, `rgba(224, 231, 255, ${moonPulse + 0.3})`);
    moonGrad.addColorStop(0.5, `rgba(129, 140, 248, ${moonPulse})`);
    moonGrad.addColorStop(1, 'rgba(15, 23, 42, 0)');
    ctx.fillStyle = moonGrad;
    ctx.beginPath();
    ctx.arc(coreX, coreY - 14, 22, 0, Math.PI * 2);
    ctx.fill();
  } else if (fid === 'solgaleo') {
    const sunPulse = 0.35 + Math.sin(host.tick * 0.08) * 0.15;
    const sunGrad = ctx.createRadialGradient(coreX, coreY - 10, 2, coreX, coreY - 10, 20);
    sunGrad.addColorStop(0, `rgba(255, 255, 255, ${sunPulse + 0.35})`);
    sunGrad.addColorStop(0.35, `rgba(254, 240, 138, ${sunPulse + 0.2})`);
    sunGrad.addColorStop(0.7, `rgba(245, 158, 11, ${sunPulse * 0.7})`);
    sunGrad.addColorStop(1, 'rgba(234, 88, 12, 0)');
    ctx.fillStyle = sunGrad;
    ctx.beginPath();
    ctx.arc(coreX, coreY - 10, 20, 0, Math.PI * 2);
    ctx.fill();
  } else if (fid === 'garchomp') {
    const dragonPulse = 0.35 + Math.sin(host.tick * 0.08) * 0.15;
    const dragonGrad = ctx.createRadialGradient(coreX, coreY - 10, 2, coreX, coreY - 10, 20);
    dragonGrad.addColorStop(0, `rgba(56, 189, 248, ${dragonPulse + 0.3})`);
    dragonGrad.addColorStop(0.5, `rgba(3, 105, 161, ${dragonPulse * 0.7})`);
    dragonGrad.addColorStop(1, 'rgba(15, 23, 42, 0)');
    ctx.fillStyle = dragonGrad;
    ctx.beginPath();
    ctx.arc(coreX, coreY - 10, 20, 0, Math.PI * 2);
    ctx.fill();
  } else if (fid === 'groudon') {
    const magmaPulse = 0.35 + Math.sin(host.tick * 0.08) * 0.15;
    const magmaGrad = ctx.createRadialGradient(coreX, coreY - 10, 2, coreX, coreY - 10, 20);
    magmaGrad.addColorStop(0, `rgba(239, 68, 68, ${magmaPulse + 0.35})`);
    magmaGrad.addColorStop(0.5, `rgba(249, 115, 22, ${magmaPulse * 0.8})`);
    magmaGrad.addColorStop(1, 'rgba(180, 83, 9, 0)');
    ctx.fillStyle = magmaGrad;
    ctx.beginPath();
    ctx.arc(coreX, coreY - 10, 20, 0, Math.PI * 2);
    ctx.fill();
  } else if (fid === 'kyogre') {
    const aquaPulse = 0.35 + Math.sin(host.tick * 0.08) * 0.15;
    const aquaGrad = ctx.createRadialGradient(coreX, coreY - 10, 2, coreX, coreY - 10, 20);
    aquaGrad.addColorStop(0, `rgba(186, 230, 253, ${aquaPulse + 0.35})`);
    aquaGrad.addColorStop(0.5, `rgba(14, 165, 233, ${aquaPulse * 0.8})`);
    aquaGrad.addColorStop(1, 'rgba(3, 105, 161, 0)');
    ctx.fillStyle = aquaGrad;
    ctx.beginPath();
    ctx.arc(coreX, coreY - 10, 20, 0, Math.PI * 2);
    ctx.fill();
  } else if (fid === 'tyranitar') {
    const sandPulse = 0.35 + Math.sin(host.tick * 0.08) * 0.15;
    const sandGrad = ctx.createRadialGradient(coreX, coreY - 10, 2, coreX, coreY - 10, 20);
    sandGrad.addColorStop(0, `rgba(217, 119, 6, ${sandPulse + 0.35})`);
    sandGrad.addColorStop(0.5, `rgba(180, 83, 9, ${sandPulse * 0.8})`);
    sandGrad.addColorStop(1, 'rgba(15, 23, 42, 0)');
    ctx.fillStyle = sandGrad;
    ctx.beginPath();
    ctx.arc(coreX, coreY - 10, 20, 0, Math.PI * 2);
    ctx.fill();
  } else if (fid === 'gyarados') {
    const aquaPulse = 0.35 + Math.sin(host.tick * 0.08) * 0.15;
    const aquaGrad = ctx.createRadialGradient(coreX, coreY - 10, 2, coreX, coreY - 10, 20);
    aquaGrad.addColorStop(0, `rgba(186, 230, 253, ${aquaPulse + 0.35})`);
    aquaGrad.addColorStop(0.5, `rgba(14, 165, 233, ${aquaPulse * 0.8})`);
    aquaGrad.addColorStop(1, 'rgba(3, 105, 161, 0)');
    ctx.fillStyle = aquaGrad;
    ctx.beginPath();
    ctx.arc(coreX, coreY - 10, 20, 0, Math.PI * 2);
    ctx.fill();
  } else if (fid === 'samurott') {
    drawSamurottHydroAura(ctx, host.tick, coreX, coreY - 10, false);
  } else if (fid === 'empoleon') {
    drawEmpoleonTridentAura(ctx, host.tick, coreX, coreY - 10, false);
  } else if (fid === 'regigigas') {
    drawRegigigasRuneAura(ctx, host.tick, coreX, coreY - 12, false);
  } else if (fid === 'koraidon') {
    drawKoraidonApexAura(ctx, host.tick, coreX, coreY - 12, false);
  } else if (fid === 'eternatus') {
    drawEternatusDynamoAura(ctx, host.tick, coreX, coreY - 12, false);
  } else if (fid === 'latios') {
    drawLatiosJetAura(ctx, host.tick, coreX, coreY - 10, false);
  } else if (fid === 'latias') {
    const rosePulse = 0.35 + Math.sin(host.tick * 0.08) * 0.15;
    const roseGrad = ctx.createRadialGradient(coreX, coreY - 10, 2, coreX, coreY - 10, 18);
    roseGrad.addColorStop(0, `rgba(254, 205, 211, ${rosePulse + 0.35})`);
    roseGrad.addColorStop(0.5, `rgba(244, 63, 94, ${rosePulse * 0.8})`);
    roseGrad.addColorStop(1, 'rgba(190, 18, 60, 0)');
    ctx.fillStyle = roseGrad;
    ctx.beginPath();
    ctx.arc(coreX, coreY - 10, 18, 0, Math.PI * 2);
    ctx.fill();
  } else if (fid === 'darkrai') {
    drawDarkraiVoidAura(ctx, host.tick, coreX, coreY - 10, false);
  } else if (fid === 'urshifu') {
    drawUrshifuTorrentAura(ctx, host.tick, coreX, coreY - 12, false);
  } else if (fid === 'charizard') {
    drawCharizardFlameAura(ctx, host.tick, coreX, coreY - 10, false);
  } else if (fid === 'gardevoir') {
    drawGardevoirPsychicAura(ctx, host.tick, coreX, coreY - 10, false);
  } else if (fid === 'celebi') {
    drawCelebiForestAura(ctx, host.tick, coreX, coreY - 10, false);
  } else if (fid === 'lugia') {
    drawLugiaAeroblastAura(ctx, host.tick, coreX, coreY - 12, false);
  }

  // Anatomical per-species and per-direction saddle offsets relative to (coreX, coreY)
  const saddleConfigs: Record<
    string,
    {
      down: { dx: number; dy: number };
      side: { dx: number; dy: number };
      up: { dx: number; dy: number };
    }
  > = {
    dialga:   { down: { dx: 0, dy: -21 }, side: { dx: -4, dy: -20 }, up: { dx: 0, dy: -19 } },
    giratina: { down: { dx: 0, dy: -23 }, side: { dx: -8, dy: -19 }, up: { dx: 0, dy: -19 } },
    palkia:   { down: { dx: 0, dy: -21 }, side: { dx: -3, dy: -19 }, up: { dx: 0, dy: -19 } },
    rayquaza: { down: { dx: 0, dy: -21 }, side: { dx: -4, dy: -19 }, up: { dx: 0, dy: -19 } },
    lunala:   { down: { dx: 0, dy: -17 }, side: { dx: -2, dy: -16 }, up: { dx: 0, dy: -16 } },
    arceus:   { down: { dx: 0, dy: -20 }, side: { dx: -4, dy: -18 }, up: { dx: 0, dy: -19 } },
    reshiram: { down: { dx: 0, dy: -19 }, side: { dx: -5, dy: -17 }, up: { dx: 0, dy: -17 } },
    zekrom:   { down: { dx: 0, dy: -19 }, side: { dx: -5, dy: -17 }, up: { dx: 0, dy: -17 } },
    groudon:  { down: { dx: 0, dy: -22 }, side: { dx: -4, dy: -20 }, up: { dx: 0, dy: -21 } },
    kyogre:   { down: { dx: 0, dy: -18 }, side: { dx: -3, dy: -17 }, up: { dx: 0, dy: -18 } },
    charizard:{ down: { dx: 0, dy: -21 }, side: { dx: -4, dy: -19 }, up: { dx: 0, dy: -19 } },
    gardevoir:{ down: { dx: 0, dy: -18 }, side: { dx: -3, dy: -17 }, up: { dx: 0, dy: -17 } },
    celebi:   { down: { dx: 0, dy: -15 }, side: { dx: -2, dy: -14 }, up: { dx: 0, dy: -15 } },
    garchomp: { down: { dx: 0, dy: -20 }, side: { dx: -4, dy: -19 }, up: { dx: 0, dy: -19 } },
    tyranitar:{ down: { dx: 0, dy: -22 }, side: { dx: -4, dy: -20 }, up: { dx: 0, dy: -20 } },
    gyarados: { down: { dx: 0, dy: -22 }, side: { dx: -5, dy: -20 }, up: { dx: 0, dy: -21 } },
    snorlax:  { down: { dx: 0, dy: -18 }, side: { dx: -3, dy: -17 }, up: { dx: 0, dy: -17 } },
    urshifu:  { down: { dx: 0, dy: -19 }, side: { dx: -3, dy: -18 }, up: { dx: 0, dy: -18 } },
    solgaleo: { down: { dx: 0, dy: -18 }, side: { dx: -4, dy: -17 }, up: { dx: 0, dy: -17 } },
    necrozma: { down: { dx: 0, dy: -19 }, side: { dx: -3, dy: -18 }, up: { dx: 0, dy: -18 } },
    samurott: { down: { dx: 0, dy: -17 }, side: { dx: -3, dy: -16 }, up: { dx: 0, dy: -17 } },
    empoleon: { down: { dx: 0, dy: -17 }, side: { dx: -2, dy: -16 }, up: { dx: 0, dy: -17 } },
    regigigas:{ down: { dx: 0, dy: -22 }, side: { dx: -4, dy: -20 }, up: { dx: 0, dy: -21 } },
    koraidon: { down: { dx: 0, dy: -20 }, side: { dx: -4, dy: -18 }, up: { dx: 0, dy: -19 } },
    eternatus:{ down: { dx: 0, dy: -21 }, side: { dx: -5, dy: -19 }, up: { dx: 0, dy: -19 } },
    lugia:    { down: { dx: 0, dy: -20 }, side: { dx: -4, dy: -18 }, up: { dx: 0, dy: -19 } },
    latios:   { down: { dx: 0, dy: -16 }, side: { dx: -2, dy: -15 }, up: { dx: 0, dy: -16 } },
    latias:   { down: { dx: 0, dy: -16 }, side: { dx: -2, dy: -15 }, up: { dx: 0, dy: -16 } },
    darkrai:  { down: { dx: 0, dy: -18 }, side: { dx: -3, dy: -17 }, up: { dx: 0, dy: -17 } },
    mewtwo:   { down: { dx: 0, dy: -17 }, side: { dx: -3, dy: -16 }, up: { dx: 0, dy: -17 } },
    lucario:  { down: { dx: 0, dy: -13 }, side: { dx: -2, dy: -12 }, up: { dx: 0, dy: -13 } },
  };

  const saddle = saddleConfigs[fid] ?? {
    down: { dx: 0, dy: -19 },
    side: { dx: -3, dy: -17 },
    up: { dx: 0, dy: -17 },
  };

  let riderDx = 0;
  let riderDy = -19;
  if (dir === 'down') {
    riderDx = saddle.down.dx;
    riderDy = saddle.down.dy;
  } else if (dir === 'up') {
    riderDx = saddle.up.dx;
    riderDy = saddle.up.dy;
  } else if (dir === 'right') {
    riderDx = saddle.side.dx;
    riderDy = saddle.side.dy;
  } else if (dir === 'left') {
    riderDx = -saddle.side.dx;
    riderDy = saddle.side.dy;
  }

  const digiMount = getDigimonById(fid);
  const pmdDrawn = digiMount
    ? false
    : host.pmdAnimator.draw(
        ctx,
        fid,
        action,
        dir,
        coreX,
        coreY,
        curAnimTick,
        1.18
      );

  if (digiMount) {
    const orientMap: Record<Dir, 'N' | 'S' | 'E' | 'W'> = {
      up: 'N',
      down: 'S',
      left: 'W',
      right: 'E',
    };
    host.drawDigimonOverworldSprite(
      ctx,
      digiMount,
      orientMap[dir] || 'S',
      curAnimTick,
      isMoving,
      coreX,
      coreY + 3 + rideBob,
      1.14,
      false
    );
  } else if (!pmdDrawn) {
    const isFlipped = host.playerDir === 'left';
    if (isFlipped) {
      ctx.save();
      ctx.translate(drawX + 8, 0);
      ctx.scale(-1, 1);
      ctx.translate(-(drawX + 8), 0);
    }
    if (fid === 'charizard' && host.charizardImg?.complete) {
      ctx.drawImage(host.charizardImg, drawX - 16, drawY - 24 + rideBob, 48, 48);
    } else if (fid === 'garchomp' && host.garchompImg?.complete) {
      ctx.drawImage(host.garchompImg, drawX - 16, drawY - 23 + rideBob, 48, 48);
    } else if (fid === 'tyranitar' && host.tyranitarImg?.complete) {
      ctx.drawImage(host.tyranitarImg, drawX - 16, drawY - 23 + rideBob, 48, 48);
    } else if (fid === 'urshifu' && host.urshifuImg?.complete) {
      ctx.drawImage(host.urshifuImg, drawX - 18, drawY - 25 + rideBob, 52, 48);
    } else if (fid === 'mewtwo' && host.mewtwoImg?.complete) {
      ctx.drawImage(host.mewtwoImg, drawX - 14, drawY - 21 + rideBob, 44, 44);
    } else if (fid === 'groudon' && host.groudonImg?.complete) {
      ctx.drawImage(host.groudonImg, drawX - 17, drawY - 24 + rideBob, 50, 48);
    } else if (fid === 'kyogre' && host.kyogreImg?.complete) {
      ctx.drawImage(host.kyogreImg, drawX - 18, drawY - 22 + rideBob, 52, 46);
    } else if (fid === 'latios' && host.latiosImg?.complete) {
      ctx.drawImage(host.latiosImg, drawX - 16, drawY - 21 + rideBob, 48, 44);
    } else if (fid === 'latias' && host.latiasImg?.complete) {
      ctx.drawImage(host.latiasImg, drawX - 16, drawY - 21 + rideBob, 48, 44);
    } else if (fid === 'darkrai' && host.darkraiImg?.complete) {
      ctx.drawImage(host.darkraiImg, drawX - 15, drawY - 23 + rideBob, 46, 46);
    } else if (fid === 'necrozma' && host.necrozmaImg?.complete) {
      ctx.drawImage(host.necrozmaImg, drawX - 17, drawY - 24 + rideBob, 50, 46);
    } else if (fid === 'solgaleo' && host.solgaleoImg?.complete) {
      ctx.drawImage(host.solgaleoImg, drawX - 17, drawY - 24 + rideBob, 50, 46);
    } else if (fid === 'samurott' && host.samurottImg?.complete) {
      ctx.drawImage(host.samurottImg, drawX - 16, drawY - 23 + rideBob, 48, 46);
    } else if (fid === 'empoleon' && host.empoleonImg?.complete) {
      ctx.drawImage(host.empoleonImg, drawX - 16, drawY - 23 + rideBob, 48, 46);
    } else if (fid === 'regigigas' && host.regigigasImg?.complete) {
      ctx.drawImage(host.regigigasImg, drawX - 17, drawY - 24 + rideBob, 50, 48);
    } else if (fid === 'koraidon' && host.koraidonImg?.complete) {
      ctx.drawImage(host.koraidonImg, drawX - 17, drawY - 24 + rideBob, 50, 48);
    } else if (fid === 'eternatus' && host.eternatusImg?.complete) {
      ctx.drawImage(host.eternatusImg, drawX - 17, drawY - 24 + rideBob, 50, 48);
    } else if (fid === 'gardevoir' && host.gardevoirImg?.complete) {
      ctx.drawImage(host.gardevoirImg, drawX - 16, drawY - 24 + rideBob, 48, 48);
    } else if (fid === 'celebi' && host.celebiImg?.complete) {
      ctx.drawImage(host.celebiImg, drawX - 16, drawY - 24 + rideBob, 48, 48);
    } else if (fid === 'lugia' && host.lugiaImg?.complete) {
      ctx.drawImage(host.lugiaImg, drawX - 17, drawY - 24 + rideBob, 50, 48);
    } else if (fid === 'lucario') {
      drawLucario(ctx, drawX, drawY + rideBob, host.tick, 1.1);
    }
    if (isFlipped) ctx.restore();
  }

  // Draw seated rider on the Pokémon's anatomical saddle (authentic Ash Ketchum sprite, realistic 0.60x mount scale & soft blending)
  drawRiderCharacter(
    ctx,
    host.playerPalette,
    dir,
    isMoving ? stepFrame : 0,
    coreX + riderDx,
    coreY + riderDy + rideBob * 0.75,
    0.60,
    0.82
  );
}

export function renderMoveParticles(host: TownPokemonFxHost, ctx: CanvasRenderingContext2D) {
  if (host.moveParticles.length === 0) return;
  ctx.save();
  for (const p of host.moveParticles) {
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color;
    ctx.shadowColor = p.color;
    ctx.shadowBlur = 6;
    ctx.fillRect(Math.floor(p.x), Math.floor(p.y), p.size, p.size);
  }
  ctx.restore();
}
