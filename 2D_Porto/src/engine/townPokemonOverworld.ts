import type { CharacterPalette, TownMap } from './types';
import { drawPikachu } from './townBackground';
import { TILE_SIZE, drawCharacter, drawLucario } from './sprites';
import { townConfig } from './townConfig';
import type { PokemonPMDAnimator } from './pokemonPMDAnimator';
import {
  drawCharizardFlameAura,
  drawDarkraiVoidAura,
  drawEmpoleonTridentAura,
  drawEternatusDynamoAura,
  drawKoraidonApexAura,
  drawLatiosJetAura,
  drawLugiaAeroblastAura,
  drawRegigigasRuneAura,
  drawSamurottHydroAura,
  drawUrshifuTorrentAura,
} from './townPokemonFx';

export interface TownPokemonOverworldHost {
  map: TownMap;
  tick: number;
  playerPalette: CharacterPalette;
  pmdAnimator: PokemonPMDAnimator;
  lugiaImg: HTMLImageElement | null;
  charizardImg: HTMLImageElement | null;
  tyranitarImg: HTMLImageElement | null;
  garchompImg: HTMLImageElement | null;
  urshifuImg: HTMLImageElement | null;
  blastoiseImg: HTMLImageElement | null;
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
}

export function renderOverworldPokemonNPCs(
  host: TownPokemonOverworldHost,
  ctx: CanvasRenderingContext2D
): void {
  for (const npc of host.map.npcs) {
    const cfg = townConfig.getBuilding(npc.id);
    if (cfg?.hidden) continue;
    const arenaCfg = townConfig.getBuilding('arena');
    const curTileX = cfg ? cfg.x : (npc.id === 'ace' && arenaCfg ? arenaCfg.x + Math.floor(arenaCfg.w / 2) - 1 : npc.x);
    const curTileY = cfg ? cfg.y : (npc.id === 'ace' && arenaCfg ? arenaCfg.y + 1 : npc.y);

    if (npc.id === 'twin') {
      const isFlipped = (cfg?.orientation || 'W') === 'E';
      if (isFlipped) {
        ctx.save();
        ctx.translate(curTileX * TILE_SIZE + 8, 0);
        ctx.scale(-1, 1);
        ctx.translate(-(curTileX * TILE_SIZE + 8), 0);
      }
      drawLucario(ctx, curTileX * TILE_SIZE, curTileY * TILE_SIZE, host.tick, 1);
      if (isFlipped) ctx.restore();
    } else if (npc.id === 'charizard' || npc.id === 'lebron' || (npc as any).subType === 'charizard') {
      const drawX = curTileX * TILE_SIZE;
      const drawY = curTileY * TILE_SIZE;
      const breath = Math.sin(host.tick * 0.05) * 0.8;
      const coreX = drawX + 8;
      const coreY = drawY + 16;

      // Ground contact shadow
      ctx.fillStyle = 'rgba(20, 25, 30, 0.4)';
      ctx.beginPath();
      ctx.ellipse(coreX, coreY, 15, 5.5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Fire Dragon tail flame ember glow & heat radiance
      drawCharizardFlameAura(ctx, host.tick, coreX, coreY - 10, true);

      // Draw Charizard 8-direction PMD animated sprite (with fallback)
      const dir = (cfg?.orientation || 'W').toLowerCase();
      const pmdDir = dir === 'w' ? 'left' : dir === 'e' ? 'right' : dir === 'n' ? 'up' : 'down';
      const pmdDrawn = host.pmdAnimator.draw(
        ctx,
        'charizard',
        'idle',
        pmdDir,
        coreX,
        coreY,
        host.tick
      );

      if (!pmdDrawn) {
        const isFlipped = (cfg?.orientation || 'W') === 'E';
        if (isFlipped) {
          ctx.save();
          ctx.translate(coreX, 0);
          ctx.scale(-1, 1);
          ctx.translate(-coreX, 0);
        }
        if (host.charizardImg && host.charizardImg.complete && host.charizardImg.naturalWidth > 0) {
          ctx.drawImage(host.charizardImg, drawX - 13, drawY - 20 + breath, 42, 42);
        }
        if (isFlipped) ctx.restore();
      }
    } else if (npc.id === 'dialga' || (npc as any).subType === 'dialga') {
      // Authentic Dialga Temporal Steel/Dragon Overworld Sprite with Roar of Time Diamond Aura
      const drawX = curTileX * TILE_SIZE;
      const drawY = curTileY * TILE_SIZE;
      const levitate = Math.sin(host.tick * 0.04) * 1.5;

      // Ground contact shadow
      ctx.fillStyle = 'rgba(15, 23, 42, 0.45)';
      ctx.beginPath();
      ctx.ellipse(drawX + 8, drawY + 16, 14, 5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Diamond Chest Core Temporal Energy Glow (pulsing cyan / cobalt / diamond blue)
      const corePulse = 0.35 + Math.sin(host.tick * 0.08) * 0.15;
      const coreX = drawX + 8;
      const coreY = drawY - 2 + levitate;
      const coreGrad = ctx.createRadialGradient(coreX, coreY, 2, coreX, coreY, 18);
      coreGrad.addColorStop(0, `rgba(224, 242, 254, ${corePulse + 0.35})`);
      coreGrad.addColorStop(0.45, `rgba(56, 189, 248, ${corePulse + 0.1})`);
      coreGrad.addColorStop(1, 'rgba(2, 132, 199, 0)');
      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(coreX, coreY, 18, 0, Math.PI * 2);
      ctx.fill();

      // Roar of Time temporal distortion pulse ring (concentric expanding wave)
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

      // Draw PMD Animated Dialga
      const dir = cfg?.orientation || npc.dir || 'S';
      const pmdDrawn = host.pmdAnimator.draw(
        ctx,
        'dialga',
        'idle',
        dir,
        coreX,
        drawY + 16,
        host.tick
      );

      // Fallback to static sprite if PMD not yet loaded
      if (!pmdDrawn && host.dialgaImg && host.dialgaImg.complete && host.dialgaImg.naturalWidth > 0) {
        const isFlipped = (cfg?.orientation || 'W') === 'E';
        if (isFlipped) {
          ctx.save();
          ctx.translate(drawX + 8, 0);
          ctx.scale(-1, 1);
          ctx.translate(-(drawX + 8), 0);
        }
        ctx.drawImage(host.dialgaImg, drawX - 13, drawY - 20 + levitate, 42, 42);
        if (isFlipped) ctx.restore();
      }
    } else if (npc.id === 'palkia' || (npc as any).subType === 'palkia') {
      // Authentic Palkia Spatial Dragon/Water Overworld Sprite with Spacial Rend Pearl Aura
      const drawX = curTileX * TILE_SIZE;
      const drawY = curTileY * TILE_SIZE;
      const levitate = Math.sin(host.tick * 0.04) * 1.6;

      // Ground contact shadow
      ctx.fillStyle = 'rgba(25, 20, 35, 0.4)';
      ctx.beginPath();
      ctx.ellipse(drawX + 8, drawY + 16, 14, 5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Dimensional Spatial Pearl Glow (rippling pink/magenta spacetime wave)
      const spatialPulse = 0.35 + Math.sin(host.tick * 0.08) * 0.15;
      const pearlX = drawX + 8;
      const pearlY = drawY - 2 + levitate;
      const spatGrad = ctx.createRadialGradient(pearlX, pearlY, 3, pearlX, pearlY, 18);
      spatGrad.addColorStop(0, `rgba(240, 171, 252, ${spatialPulse + 0.3})`);
      spatGrad.addColorStop(0.5, `rgba(192, 38, 211, ${spatialPulse})`);
      spatGrad.addColorStop(1, 'rgba(192, 38, 211, 0)');
      ctx.fillStyle = spatGrad;
      ctx.beginPath();
      ctx.arc(pearlX, pearlY, 18, 0, Math.PI * 2);
      ctx.fill();

      // Spacial Rend dimensional space-warp slice lines
      const rendAngle = host.tick * 0.03;
      for (let r = 0; r < 2; r++) {
        const angle = rendAngle + (r * Math.PI) / 2;
        const rx1 = pearlX + Math.cos(angle) * 14;
        const ry1 = pearlY + Math.sin(angle) * 8;
        const rx2 = pearlX - Math.cos(angle) * 14;
        const ry2 = pearlY - Math.sin(angle) * 8;
        ctx.strokeStyle = 'rgba(244, 114, 182, 0.7)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(rx1, ry1);
        ctx.lineTo(rx2, ry2);
        ctx.stroke();
      }

      // Pearlescent sparkles
      if (host.tick % 24 < 14) {
        ctx.fillStyle = '#fdf4ff';
        ctx.fillRect(pearlX + Math.sin(host.tick * 0.2) * 12, pearlY - 4 - (host.tick % 14), 1.5, 1.5);
        ctx.fillStyle = '#e879f9';
        ctx.fillRect(pearlX - 6 + Math.cos(host.tick * 0.16) * 10, pearlY + 4 - (host.tick % 10), 2, 2);
      }

      // Draw PMD Animated Palkia
      const dir = cfg?.orientation || npc.dir || 'S';
      const coreX = drawX + 8;
      const pmdDrawn = host.pmdAnimator.draw(
        ctx,
        'palkia',
        'idle',
        dir,
        coreX,
        drawY + 16,
        host.tick
      );

      // Fallback to static sprite if PMD not yet loaded
      if (!pmdDrawn && host.palkiaImg && host.palkiaImg.complete && host.palkiaImg.naturalWidth > 0) {
        const isFlipped = (cfg?.orientation || 'W') === 'E';
        if (isFlipped) {
          ctx.save();
          ctx.translate(drawX + 8, 0);
          ctx.scale(-1, 1);
          ctx.translate(-(drawX + 8), 0);
        }
        ctx.drawImage(host.palkiaImg, drawX - 13, drawY - 20 + levitate, 42, 42);
        if (isFlipped) ctx.restore();
      }
    } else if (npc.id === 'giratina' || (npc as any).subType === 'giratina') {
      // Authentic Giratina Altered Forme Overworld Sprite with Distortion World Antimatter Portal
      const drawX = curTileX * TILE_SIZE;
      const drawY = curTileY * TILE_SIZE;
      const levitate = Math.sin(host.tick * 0.04) * 1.8;

      // Distortion World Antimatter Ground Portal (swirling dark rift)
      const portalPulse = 0.45 + Math.sin(host.tick * 0.07) * 0.15;
      const portalX = drawX + 8;
      const portalY = drawY + 16;
      const portGrad = ctx.createRadialGradient(portalX, portalY, 3, portalX, portalY, 16);
      portGrad.addColorStop(0, `rgba(88, 28, 135, ${portalPulse + 0.3})`);
      portGrad.addColorStop(0.5, `rgba(24, 24, 27, ${portalPulse})`);
      portGrad.addColorStop(1, 'rgba(24, 24, 27, 0)');
      ctx.fillStyle = portGrad;
      ctx.beginPath();
      ctx.ellipse(portalX, portalY, 16, 6, 0, 0, Math.PI * 2);
      ctx.fill();

      // Swirling antimatter rift orbit ring
      ctx.strokeStyle = `rgba(220, 38, 38, ${portalPulse * 0.7})`;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.ellipse(portalX, portalY, 13 + Math.sin(host.tick * 0.08) * 2, 4.5, host.tick * 0.02, 0, Math.PI * 2);
      ctx.stroke();

      // Floating ghost / dark antimatter wisps
      if (host.tick % 22 < 14) {
        ctx.fillStyle = '#c084fc';
        ctx.fillRect(portalX + Math.sin(host.tick * 0.2) * 10, portalY - 6 - (host.tick % 16), 1.5, 1.5);
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(portalX - 4 + Math.cos(host.tick * 0.18) * 12, portalY - 4 - (host.tick % 14), 2, 2);
        ctx.fillStyle = '#f87171';
        ctx.fillRect(portalX + 4 - Math.sin(host.tick * 0.15) * 8, portalY - 8 - (host.tick % 12), 1.5, 1.5);
      }

      // Draw PMD Animated Giratina
      const dir = cfg?.orientation || npc.dir || 'S';
      const coreX = drawX + 8;
      const pmdDrawn = host.pmdAnimator.draw(
        ctx,
        'giratina',
        'idle',
        dir,
        coreX,
        drawY + 16,
        host.tick
      );

      // Fallback to static sprite if PMD not yet loaded
      if (!pmdDrawn && host.giratinaImg && host.giratinaImg.complete && host.giratinaImg.naturalWidth > 0) {
        const isFlipped = (cfg?.orientation || 'W') === 'E';
        if (isFlipped) {
          ctx.save();
          ctx.translate(drawX + 8, 0);
          ctx.scale(-1, 1);
          ctx.translate(-(drawX + 8), 0);
        }
        ctx.drawImage(host.giratinaImg, drawX - 13, drawY - 20 + levitate, 42, 42);
        if (isFlipped) ctx.restore();
      }
    } else if (npc.id === 'zekrom' || (npc as any).subType === 'zekrom') {
      // Authentic Zekrom (Deep Black Pokémon) PMD Animated Sprite with Lightning Generator Turbine
      const drawX = curTileX * TILE_SIZE;
      const drawY = curTileY * TILE_SIZE;
      const levitate = Math.sin(host.tick * 0.035) * 1.5;

      // Ground contact shadow
      ctx.fillStyle = 'rgba(10, 15, 25, 0.45)';
      ctx.beginPath();
      ctx.ellipse(drawX + 8, drawY + 16, 14, 5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Electric Lightning Turbine Glow behind tail (Fusion Bolt)
      const turbineGlow = 0.35 + Math.sin(host.tick * 0.09) * 0.15;
      const tailDir = cfg?.orientation || npc.dir || 'S';
      const tailX = tailDir === 'W' ? drawX + 16 : (tailDir === 'E' ? drawX : drawX + 8);
      const tailY = drawY + 8 + levitate;
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

      // Draw PMD Animated Zekrom
      const dir = cfg?.orientation || npc.dir || 'S';
      const coreX = drawX + 8;
      const pmdDrawn = host.pmdAnimator.draw(
        ctx,
        'zekrom',
        'idle',
        dir,
        coreX,
        drawY + 16,
        host.tick
      );

      // Fallback to static sprite if PMD not yet loaded
      if (!pmdDrawn && host.zekromImg && host.zekromImg.complete && host.zekromImg.naturalWidth > 0) {
        const isFlipped = (cfg?.orientation || 'W') === 'E';
        if (isFlipped) {
          ctx.save();
          ctx.translate(drawX + 8, 0);
          ctx.scale(-1, 1);
          ctx.translate(-(drawX + 8), 0);
        }
        ctx.drawImage(host.zekromImg, drawX - 13, drawY - 20 + levitate, 42, 42);
        if (isFlipped) ctx.restore();
      }
    } else if (npc.id === 'reshiram' || (npc as any).subType === 'reshiram') {
      // Authentic Reshiram (Vast White Pokémon) PMD Animated Sprite with Jet Turbine Fusion Flare
      const drawX = curTileX * TILE_SIZE;
      const drawY = curTileY * TILE_SIZE;
      const coreX = drawX + 8;
      const coreY = drawY + 16;
      const levitate = Math.sin(host.tick * 0.035) * 1.5;

      // Ground contact shadow
      ctx.fillStyle = 'rgba(20, 25, 35, 0.4)';
      ctx.beginPath();
      ctx.ellipse(coreX, drawY + 16, 14, 5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Fiery Jet Turbine Glow behind tail (Fusion Flare)
      const turbineGlow = 0.35 + Math.sin(host.tick * 0.08) * 0.15;
      const tailX = drawX - 3;
      const tailY = drawY + 8 + levitate;
      const fireGrad = ctx.createRadialGradient(tailX, tailY, 2, tailX, tailY, 14);
      fireGrad.addColorStop(0, `rgba(255, 165, 0, ${turbineGlow + 0.25})`);
      fireGrad.addColorStop(0.5, `rgba(239, 68, 68, ${turbineGlow})`);
      fireGrad.addColorStop(1, 'rgba(239, 68, 68, 0)');
      ctx.fillStyle = fireGrad;
      ctx.beginPath();
      ctx.arc(tailX, tailY, 14, 0, Math.PI * 2);
      ctx.fill();

      // Fiery ember particles rising from tail turbine
      if (host.tick % 24 < 16) {
        ctx.fillStyle = '#ffedd5';
        ctx.fillRect(tailX + Math.sin(host.tick * 0.2) * 6, tailY - 4 - (host.tick % 16), 1.5, 1.5);
        ctx.fillStyle = '#f97316';
        ctx.fillRect(tailX - 2 + Math.cos(host.tick * 0.15) * 8, tailY - 2 - (host.tick % 12), 2, 2);
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(tailX + 2 - Math.sin(host.tick * 0.1) * 7, tailY - 6 - (host.tick % 14), 1.5, 1.5);
      }

      // Draw PMD Animated Reshiram
      const dir = cfg?.orientation || npc.dir || 'S';
      const pmdDrawn = host.pmdAnimator.draw(
        ctx,
        'reshiram',
        'idle',
        dir,
        coreX,
        coreY,
        host.tick
      );

      // Fallback to static sprite if PMD image not loaded yet
      if (!pmdDrawn && host.reshiramImg && host.reshiramImg.complete && host.reshiramImg.naturalWidth > 0) {
        const isFlipped = (cfg?.orientation || 'W') === 'E';
        if (isFlipped) {
          ctx.save();
          ctx.translate(drawX + 8, 0);
          ctx.scale(-1, 1);
          ctx.translate(-(drawX + 8), 0);
        }
        ctx.drawImage(host.reshiramImg, drawX - 13, drawY - 20 + levitate, 42, 42);
        if (isFlipped) ctx.restore();
      }
    } else if (npc.id === 'arceus' || (npc as any).subType === 'arceus') {
      // Divine Arceus Overworld Sprite with Golden Judgment Ring
      const drawX = curTileX * TILE_SIZE;
      const drawY = curTileY * TILE_SIZE;
      const levitate = Math.sin(host.tick * 0.04) * 2;

      // Ground shadow
      ctx.fillStyle = 'rgba(20, 25, 30, 0.4)';
      ctx.beginPath();
      ctx.ellipse(drawX + 8, drawY + 16, 12, 4.5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Celestial Golden Halo Rings (Judgment Wheel Ring)
      const haloR = 14 + Math.sin(host.tick * 0.05) * 2;
      ctx.strokeStyle = 'rgba(250, 204, 21, 0.45)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(drawX + 8, drawY - 4 + levitate, haloR, 0, Math.PI * 2);
      ctx.stroke();

      // Cross rays of the Wheel of Origin
      const angle = host.tick * 0.015;
      for (let a = 0; a < 4; a++) {
        const rayAngle = angle + (a * Math.PI) / 2;
        const rx1 = drawX + 8 + Math.cos(rayAngle) * (haloR - 4);
        const ry1 = drawY - 4 + levitate + Math.sin(rayAngle) * (haloR - 4);
        const rx2 = drawX + 8 + Math.cos(rayAngle) * (haloR + 4);
        const ry2 = drawY - 4 + levitate + Math.sin(rayAngle) * (haloR + 4);
        ctx.strokeStyle = '#fef08a';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(rx1, ry1);
        ctx.lineTo(rx2, ry2);
        ctx.stroke();
      }

      // Divine golden stardust sparkles
      if (host.tick % 30 < 15) {
        ctx.fillStyle = '#fef08a';
        ctx.fillRect(drawX + 8 + Math.cos(host.tick * 0.1) * 16, drawY - 4 + levitate + Math.sin(host.tick * 0.1) * 16, 2, 2);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(drawX + 8 - Math.sin(host.tick * 0.12) * 14, drawY - 4 + levitate - Math.cos(host.tick * 0.12) * 14, 1.5, 1.5);
      }

      // Draw PMD Animated Arceus
      const dir = cfg?.orientation || npc.dir || 'S';
      const pmdDrawn = host.pmdAnimator.draw(
        ctx,
        'arceus',
        'idle',
        dir,
        drawX + 8,
        drawY + 16,
        host.tick
      );

      // Fallback to static sprite if PMD image not loaded yet
      if (!pmdDrawn && host.arceusImg && host.arceusImg.complete && host.arceusImg.naturalWidth > 0) {
        const isFlipped = (cfg?.orientation || 'W') === 'E';
        if (isFlipped) {
          ctx.save();
          ctx.translate(drawX + 8, 0);
          ctx.scale(-1, 1);
          ctx.translate(-(drawX + 8), 0);
        }
        ctx.drawImage(host.arceusImg, drawX - 12, drawY - 18 + levitate, 40, 40);
        if (isFlipped) ctx.restore();
      }
    } else if (npc.id === 'ranger' || npc.id === 'blastoise' || npc.id === 'tyranitar' || (npc as any).subType === 'tyranitar') {
      // Authentic Tyranitar Rock/Dark Armor Pokémon Overworld Sprite with Sand Stream Aura
      const drawX = curTileX * TILE_SIZE;
      const drawY = curTileY * TILE_SIZE;
      const stomp = Math.sin(host.tick * 0.04) * 0.8;

      // Ground shadow beneath heavy armor body
      ctx.fillStyle = 'rgba(25, 20, 15, 0.45)';
      ctx.beginPath();
      ctx.ellipse(drawX + 8, drawY + 16, 15, 5.5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Sand Stream & Earth particles swirling around Tyranitar
      if (host.tick % 18 < 12) {
        const sandAngle = (host.tick * 0.08) % (Math.PI * 2);
        const sandRadius = 11 + Math.sin(host.tick * 0.1) * 3;
        const sandX = drawX + 8 + Math.cos(sandAngle) * sandRadius;
        const sandY = drawY + 11 + Math.sin(sandAngle) * 3 + stomp;
        ctx.fillStyle = '#d4b182'; // Desert sand grain
        ctx.fillRect(sandX, sandY, 1.5, 1.5);

        // Rocky dark armor dust
        if (host.tick % 24 < 8) {
          ctx.fillStyle = '#4b5563';
          ctx.fillRect(drawX + 4 + Math.sin(host.tick * 0.2) * 8, drawY + 12 - (host.tick % 8), 1.5, 1.5);
        }
      }

      // Draw Tyranitar 8-direction PMD animated sprite (with fallback)
      const dir = (cfg?.orientation || 'W').toLowerCase();
      const pmdDir = dir === 'w' ? 'left' : dir === 'e' ? 'right' : dir === 'n' ? 'up' : 'down';
      const pmdDrawn = host.pmdAnimator.draw(
        ctx,
        'tyranitar',
        'idle',
        pmdDir,
        drawX + 8,
        drawY + 16,
        host.tick
      );

      if (!pmdDrawn) {
        const isFlipped = (cfg?.orientation || 'W') === 'E';
        if (isFlipped) {
          ctx.save();
          ctx.translate(drawX + 8, 0);
          ctx.scale(-1, 1);
          ctx.translate(-(drawX + 8), 0);
        }
        const img = host.tyranitarImg || host.blastoiseImg;
        if (img && img.complete && img.naturalWidth > 0) {
          ctx.drawImage(img, drawX - 13, drawY - 20 + stomp, 42, 42);
        }
        if (isFlipped) ctx.restore();
      }
    } else if (npc.id === 'garchomp' || (npc as any).subType === 'garchomp') {
      // Authentic Garchomp Dragon/Ground Mach Pokémon Overworld Sprite
      const drawX = curTileX * TILE_SIZE;
      const drawY = curTileY * TILE_SIZE;
      const coreX = drawX + 8;
      const machBob = Math.sin(host.tick * 0.05) * 0.9;

      // Ground contact shadow
      ctx.fillStyle = 'rgba(20, 20, 30, 0.4)';
      ctx.beginPath();
      ctx.ellipse(coreX, drawY + 16, 15, 5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Dragon Claw & Supersonic Mach Slipstream particles
      if (host.tick % 16 < 11) {
        ctx.fillStyle = '#38bdf8'; // Sky blue dragon aura
        ctx.fillRect(coreX + Math.cos(host.tick * 0.15) * 12, drawY + 6 - (host.tick % 10) + machBob, 2, 1);
        ctx.fillStyle = '#fde047'; // Sand dune speed spark
        ctx.fillRect(coreX - 5 + Math.sin(host.tick * 0.2) * 10, drawY + 14 - (host.tick % 8), 1.5, 1.5);
        ctx.fillStyle = '#f43f5e'; // Crimson star chest spark
        ctx.fillRect(coreX + Math.cos(host.tick * 0.25) * 8, drawY - 2 + machBob, 1.5, 1.5);
      }

      // Draw Garchomp 8-direction PMD animated sprite (with fallback)
      const dir = (cfg?.orientation || 'W').toLowerCase();
      const pmdDir = dir === 'w' ? 'left' : dir === 'e' ? 'right' : dir === 'n' ? 'up' : 'down';
      const pmdDrawn = host.pmdAnimator.draw(
        ctx,
        'garchomp',
        'idle',
        pmdDir,
        coreX,
        drawY + 16,
        host.tick
      );

      if (!pmdDrawn && host.garchompImg && host.garchompImg.complete && host.garchompImg.naturalWidth > 0) {
        const isFlipped = (cfg?.orientation || 'W') === 'E';
        if (isFlipped) {
          ctx.save();
          ctx.translate(drawX + 8, 0);
          ctx.scale(-1, 1);
          ctx.translate(-(drawX + 8), 0);
        }
        ctx.drawImage(host.garchompImg, drawX - 13, drawY - 20 + machBob, 42, 42);
        if (isFlipped) ctx.restore();
      }
    } else if (npc.id === 'urshifu' || (npc as any).subType === 'urshifu' || (npc as any).subType === 'urshifu_gmax') {
      // Authentic Urshifu Rapid Strike PMD Overworld Sprite with G-Max Torrent Aura
      const drawX = curTileX * TILE_SIZE;
      const drawY = curTileY * TILE_SIZE;
      const coreX = drawX + 8;
      const coreY = drawY + 16;
      const stanceBob = Math.sin(host.tick * 0.04) * 0.8;

      // Ground shadow beneath colossal martial stance
      ctx.fillStyle = 'rgba(15, 23, 42, 0.45)';
      ctx.beginPath();
      ctx.ellipse(coreX, coreY, 16, 5.5, 0, 0, Math.PI * 2);
      ctx.fill();

      drawUrshifuTorrentAura(ctx, host.tick, coreX, coreY - 12, true);

      const dir = (cfg?.orientation || 'W').toLowerCase();
      const pmdDir = dir === 'w' ? 'left' : dir === 'e' ? 'right' : dir === 'n' ? 'up' : 'down';
      const pmdDrawn = host.pmdAnimator.draw(
        ctx,
        'urshifu',
        'idle',
        pmdDir,
        coreX,
        coreY,
        host.tick
      );

      // Static fallback if PMD sprite is still loading
      if (!pmdDrawn && host.urshifuImg && host.urshifuImg.complete && host.urshifuImg.naturalWidth > 0) {
        const isFlipped = (cfg?.orientation || 'W') === 'E';
        if (isFlipped) {
          ctx.save();
          ctx.translate(drawX + 8, 0);
          ctx.scale(-1, 1);
          ctx.translate(-(drawX + 8), 0);
        }
        ctx.drawImage(host.urshifuImg, drawX - 16, drawY - 24 + stanceBob, 48, 45);
        if (isFlipped) ctx.restore();
      }
    } else if (npc.id === 'ace' || npc.id === 'mewtwo' || (npc as any).subType === 'mewtwo') {
      // Authentic Mewtwo Pokémon Overworld Sprite with Psychic Aura & Telekinesis
      const drawX = curTileX * TILE_SIZE;
      const drawY = curTileY * TILE_SIZE;
      const levitate = Math.sin(host.tick * 0.045) * 2.2;

      // Ground shadow (subtly pulses with levitation height)
      const shadowScale = 1 - Math.sin(host.tick * 0.045) * 0.15;
      ctx.fillStyle = 'rgba(25, 15, 35, 0.45)';
      ctx.beginPath();
      ctx.ellipse(drawX + 8, drawY + 16, 12 * shadowScale, 4.5 * shadowScale, 0, 0, Math.PI * 2);
      ctx.fill();

      // Pulsing Psystrike / Psychic Aura Rings
      const auraR = 14 + Math.sin(host.tick * 0.06) * 2;
      ctx.strokeStyle = 'rgba(168, 85, 247, 0.45)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(drawX + 8, drawY - 2 + levitate, auraR, 0, Math.PI * 2);
      ctx.stroke();

      // Orbiting telekinetic psychic energy orbs
      for (let i = 0; i < 3; i++) {
        const orbAngle = host.tick * 0.04 + (i * Math.PI * 2) / 3;
        const ox = drawX + 8 + Math.cos(orbAngle) * (auraR - 2);
        const oy = drawY - 2 + levitate + Math.sin(orbAngle) * (auraR - 4) * 0.5;
        ctx.fillStyle = '#e9d5ff';
        ctx.beginPath();
        ctx.arc(ox, oy, 1.8, 0, Math.PI * 2);
        ctx.fill();
      }

      // Ambient psychic sparkles
      if (host.tick % 24 < 12) {
        ctx.fillStyle = '#c084fc';
        ctx.fillRect(drawX + 8 + Math.cos(host.tick * 0.1) * 14, drawY - 4 + levitate + Math.sin(host.tick * 0.1) * 14, 2, 2);
        ctx.fillStyle = '#f3e8ff';
        ctx.fillRect(drawX + 8 - Math.sin(host.tick * 0.15) * 12, drawY - 2 + levitate - Math.cos(host.tick * 0.15) * 12, 1.5, 1.5);
      }

      if (host.mewtwoImg && host.mewtwoImg.complete && host.mewtwoImg.naturalWidth > 0) {
        const isFlipped = (cfg?.orientation || 'W') === 'E';
        if (isFlipped) {
          ctx.save();
          ctx.translate(drawX + 8, 0);
          ctx.scale(-1, 1);
          ctx.translate(-(drawX + 8), 0);
        }
        ctx.drawImage(host.mewtwoImg, drawX - 11, drawY - 16 + levitate, 38, 38);
        if (isFlipped) ctx.restore();
      }
    } else if (npc.id === 'rayquaza' || (npc as any).subType === 'rayquaza') {
      // Authentic Rayquaza Sky High Dragon/Flying Overworld Sprite with Ozone Emerald Aura
      const drawX = curTileX * TILE_SIZE;
      const drawY = curTileY * TILE_SIZE;
      const levitate = Math.sin(host.tick * 0.04) * 2.0;

      // Ground shadow
      ctx.fillStyle = 'rgba(10, 30, 20, 0.4)';
      ctx.beginPath();
      ctx.ellipse(drawX + 8, drawY + 16, 14, 5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Atmospheric Ozone Emerald Aura
      const auraPulse = 0.35 + Math.sin(host.tick * 0.08) * 0.15;
      const coreX = drawX + 8;
      const coreY = drawY - 2 + levitate;
      const spatGrad = ctx.createRadialGradient(coreX, coreY, 2, coreX, coreY, 18);
      spatGrad.addColorStop(0, `rgba(167, 243, 208, ${auraPulse + 0.3})`);
      spatGrad.addColorStop(0.5, `rgba(16, 185, 129, ${auraPulse})`);
      spatGrad.addColorStop(1, 'rgba(5, 150, 105, 0)');
      ctx.fillStyle = spatGrad;
      ctx.beginPath();
      ctx.arc(coreX, coreY, 18, 0, Math.PI * 2);
      ctx.fill();

      // Stardust & Delta Stream wind sparkles
      if (host.tick % 24 < 14) {
        ctx.fillStyle = '#fef08a';
        ctx.fillRect(coreX + Math.sin(host.tick * 0.2) * 12, coreY - 4 - (host.tick % 14), 1.5, 1.5);
        ctx.fillStyle = '#34d399';
        ctx.fillRect(coreX - 6 + Math.cos(host.tick * 0.16) * 10, coreY + 4 - (host.tick % 10), 2, 2);
      }

      // Draw PMD Animated Rayquaza
      const dir = cfg?.orientation || npc.dir || 'S';
      const pmdDrawn = host.pmdAnimator.draw(
        ctx,
        'rayquaza',
        'idle',
        dir,
        coreX,
        drawY + 16,
        host.tick
      );

      // Fallback to static sprite if PMD image not loaded yet
      if (!pmdDrawn && host.rayquazaImg && host.rayquazaImg.complete && host.rayquazaImg.naturalWidth > 0) {
        const isFlipped = (cfg?.orientation || 'W') === 'E';
        if (isFlipped) {
          ctx.save();
          ctx.translate(drawX + 8, 0);
          ctx.scale(-1, 1);
          ctx.translate(-(drawX + 8), 0);
        }
        ctx.drawImage(host.rayquazaImg, drawX - 13, drawY - 20 + levitate, 42, 42);
        if (isFlipped) ctx.restore();
      }
    } else if (npc.id === 'groudon' || (npc as any).subType === 'groudon') {
      // Authentic Groudon Continent Ground Overworld Sprite with Primal Magma & Desolate Land Aura
      const drawX = curTileX * TILE_SIZE;
      const drawY = curTileY * TILE_SIZE;
      const breath = Math.sin(host.tick * 0.04) * 0.8;
      const coreX = drawX + 8;
      const coreY = drawY + 8;

      // Ground shadow beneath heavy continent body
      ctx.fillStyle = 'rgba(25, 12, 6, 0.45)';
      ctx.beginPath();
      ctx.ellipse(coreX, drawY + 16, 15, 6, 0, 0, Math.PI * 2);
      ctx.fill();

      // Primal Magma / Desolate Land Heat Radiance (ambient pulsing heat wave gradient)
      const magmaPulse = 0.35 + Math.sin(host.tick * 0.07) * 0.15;
      const heatGrad = ctx.createRadialGradient(coreX, coreY, 2, coreX, coreY, 20);
      heatGrad.addColorStop(0, `rgba(239, 68, 68, ${magmaPulse + 0.25})`);
      heatGrad.addColorStop(0.5, `rgba(249, 115, 22, ${magmaPulse * 0.8})`);
      heatGrad.addColorStop(1, 'rgba(180, 83, 9, 0)');
      ctx.fillStyle = heatGrad;
      ctx.beginPath();
      ctx.arc(coreX, coreY, 20, 0, Math.PI * 2);
      ctx.fill();

      // Volcanic embers & magma sparks rising upward from the scorched earth
      if (host.tick % 20 < 12) {
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(coreX + Math.sin(host.tick * 0.25) * 14, coreY + 8 - ((host.tick * 1.5) % 18), 1.5, 1.5);
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(coreX - 8 + Math.cos(host.tick * 0.18) * 12, coreY + 10 - ((host.tick * 1.2) % 16), 2, 2);
        ctx.fillStyle = '#fde047';
        ctx.fillRect(coreX + 4 + Math.sin(host.tick * 0.3) * 10, coreY + 6 - (host.tick % 14), 1.5, 1.5);
      }

      // Draw Groudon 8-direction PMD animated sprite (with fallback)
      const dir = (cfg?.orientation || 'W').toLowerCase();
      const pmdDir = dir === 'w' ? 'left' : dir === 'e' ? 'right' : dir === 'n' ? 'up' : 'down';
      const pmdDrawn = host.pmdAnimator.draw(
        ctx,
        'groudon',
        'idle',
        pmdDir,
        coreX,
        drawY + 16,
        host.tick
      );

      if (!pmdDrawn && host.groudonImg && host.groudonImg.complete && host.groudonImg.naturalWidth > 0) {
        const isFlipped = (cfg?.orientation || 'W') === 'E';
        if (isFlipped) {
          ctx.save();
          ctx.translate(drawX + 8, 0);
          ctx.scale(-1, 1);
          ctx.translate(-(drawX + 8), 0);
        }
        ctx.drawImage(host.groudonImg, drawX - 13, drawY - 20 + breath, 42, 42);
        if (isFlipped) ctx.restore();
      }
    } else if (npc.id === 'kyogre' || (npc as any).subType === 'kyogre') {
      // Authentic Kyogre Sea Basin Water Overworld Sprite with Primordial Sea Aqua Aura
      const drawX = curTileX * TILE_SIZE;
      const drawY = curTileY * TILE_SIZE;
      const swimY = Math.sin(host.tick * 0.04) * 1.8;
      const coreX = drawX + 8;
      const coreY = drawY + 2 + swimY;

      // Water ripple shadow
      ctx.fillStyle = 'rgba(7, 43, 79, 0.4)';
      ctx.beginPath();
      ctx.ellipse(coreX, drawY + 16, 15, 5.5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Primordial Sea Oceanic Hydro Aura
      const waterPulse = 0.35 + Math.sin(host.tick * 0.08) * 0.15;
      const aquaGrad = ctx.createRadialGradient(coreX, coreY, 2, coreX, coreY, 19);
      aquaGrad.addColorStop(0, `rgba(186, 230, 253, ${waterPulse + 0.3})`);
      aquaGrad.addColorStop(0.5, `rgba(14, 165, 233, ${waterPulse})`);
      aquaGrad.addColorStop(1, 'rgba(3, 105, 161, 0)');
      ctx.fillStyle = aquaGrad;
      ctx.beginPath();
      ctx.arc(coreX, coreY, 19, 0, Math.PI * 2);
      ctx.fill();

      // Hydro droplet & bioluminescent mist bubbles
      if (host.tick % 22 < 13) {
        ctx.fillStyle = '#7dd3fc';
        ctx.fillRect(coreX + Math.sin(host.tick * 0.22) * 13, coreY - 4 + Math.cos(host.tick * 0.22) * 8, 1.5, 1.5);
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(coreX - 7 + Math.cos(host.tick * 0.17) * 11, coreY + 4 + Math.sin(host.tick * 0.17) * 7, 2, 2);
        ctx.fillStyle = '#f0f9ff';
        ctx.fillRect(coreX + 5 + Math.sin(host.tick * 0.28) * 9, coreY - 6 - (host.tick % 8), 1.5, 1.5);
      }

      // Draw Kyogre 8-direction PMD animated sprite (with fallback)
      const dir = (cfg?.orientation || 'W').toLowerCase();
      const pmdDir = dir === 'w' ? 'left' : dir === 'e' ? 'right' : dir === 'n' ? 'up' : 'down';
      const pmdDrawn = host.pmdAnimator.draw(
        ctx,
        'kyogre',
        'idle',
        pmdDir,
        coreX,
        drawY + 16,
        host.tick
      );

      if (!pmdDrawn && host.kyogreImg && host.kyogreImg.complete && host.kyogreImg.naturalWidth > 0) {
        const isFlipped = (cfg?.orientation || 'W') === 'E';
        if (isFlipped) {
          ctx.save();
          ctx.translate(drawX + 8, 0);
          ctx.scale(-1, 1);
          ctx.translate(-(drawX + 8), 0);
        }
        ctx.drawImage(host.kyogreImg, drawX - 13, drawY - 20 + swimY, 42, 42);
        if (isFlipped) ctx.restore();
      }
    } else if (npc.id === 'latios' || (npc as any).subType === 'latios') {
      // Authentic Latios Eon Dragon/Psychic Overworld Sprite with Jet Stream Azure Aura
      const drawX = curTileX * TILE_SIZE;
      const drawY = curTileY * TILE_SIZE;
      const jetHover = Math.sin(host.tick * 0.055) * 2.2;
      const coreX = drawX + 8;
      const coreY = drawY + 1 + jetHover;

      // Aerodynamic ground shadow
      ctx.fillStyle = 'rgba(15, 23, 42, 0.35)';
      ctx.beginPath();
      ctx.ellipse(coreX, drawY + 16, 13, 4.5, 0, 0, Math.PI * 2);
      ctx.fill();

      drawLatiosJetAura(ctx, host.tick, coreX, coreY, true);

      // Draw Latios PMD animated sprite (8 directions) or fallback
      const dir = cfg?.orientation || 'W';
      const pmdDrawn = host.pmdAnimator.draw(
        ctx,
        'latios',
        'idle',
        dir,
        coreX,
        drawY + 16,
        host.tick
      );
      if (!pmdDrawn && host.latiosImg && host.latiosImg.complete && host.latiosImg.naturalWidth > 0) {
        const isFlipped = (cfg?.orientation || 'W') === 'E';
        if (isFlipped) {
          ctx.save();
          ctx.translate(drawX + 8, 0);
          ctx.scale(-1, 1);
          ctx.translate(-(drawX + 8), 0);
        }
        ctx.drawImage(host.latiosImg, drawX - 13, drawY - 20 + jetHover, 42, 42);
        if (isFlipped) ctx.restore();
      }
    } else if (npc.id === 'latias' || (npc as any).subType === 'latias') {
      // Authentic Latias Eon Dragon/Psychic Overworld Sprite with Crimson Rose Mist Aura
      const drawX = curTileX * TILE_SIZE;
      const drawY = curTileY * TILE_SIZE;
      const floatY = Math.sin(host.tick * 0.055 + 1.2) * 2.2;
      const coreX = drawX + 8;
      const coreY = drawY + 1 + floatY;

      // Aerodynamic ground shadow
      ctx.fillStyle = 'rgba(15, 23, 42, 0.35)';
      ctx.beginPath();
      ctx.ellipse(coreX, drawY + 16, 12, 4.5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Eon Crimson / Rose Mist Radiant Aura
      const rosePulse = 0.35 + Math.sin(host.tick * 0.09 + 1.0) * 0.15;
      const auraGrad = ctx.createRadialGradient(coreX, coreY, 2, coreX, coreY, 18);
      auraGrad.addColorStop(0, `rgba(254, 205, 211, ${rosePulse + 0.3})`);
      auraGrad.addColorStop(0.5, `rgba(244, 63, 94, ${rosePulse})`);
      auraGrad.addColorStop(1, 'rgba(190, 18, 60, 0)');
      ctx.fillStyle = auraGrad;
      ctx.beginPath();
      ctx.arc(coreX, coreY, 18, 0, Math.PI * 2);
      ctx.fill();

      // Light refraction glass crystals & pink stardust
      if (host.tick % 20 < 12) {
        ctx.fillStyle = '#fda4af';
        ctx.fillRect(coreX + Math.sin(host.tick * 0.24) * 12, coreY - 4 + Math.cos(host.tick * 0.24) * 8, 1.5, 1.5);
        ctx.fillStyle = '#f43f5e';
        ctx.fillRect(coreX - 7 + Math.cos(host.tick * 0.18) * 10, coreY + 3 + Math.sin(host.tick * 0.18) * 6, 2, 2);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(coreX + 4 + Math.sin(host.tick * 0.3) * 8, coreY - 5 - (host.tick % 7), 1.5, 1.5);
      }

      // Draw Latias PMD animated sprite (8 directions) or fallback
      const dir = cfg?.orientation || 'S';
      const pmdDrawn = host.pmdAnimator.draw(
        ctx,
        'latias',
        'idle',
        dir,
        coreX,
        drawY + 16,
        host.tick
      );
      if (!pmdDrawn && host.latiasImg && host.latiasImg.complete && host.latiasImg.naturalWidth > 0) {
        const isFlipped = (cfg?.orientation || 'W') === 'E';
        if (isFlipped) {
          ctx.save();
          ctx.translate(drawX + 8, 0);
          ctx.scale(-1, 1);
          ctx.translate(-(drawX + 8), 0);
        }
        ctx.drawImage(host.latiasImg, drawX - 13, drawY - 20 + floatY, 42, 42);
        if (isFlipped) ctx.restore();
      }
    } else if (npc.id === 'darkrai' || (npc as any).subType === 'darkrai') {
      // Authentic Darkrai Pitch-Black Dark Overworld Sprite with Dark Void Nightmare Aura
      const drawX = curTileX * TILE_SIZE;
      const drawY = curTileY * TILE_SIZE;
      const levitate = Math.sin(host.tick * 0.04) * 2.0;
      const coreX = drawX + 8;
      const coreY = drawY + 2 + levitate;

      // Shadowy abyss portal pool
      const portalPulse = 0.4 + Math.sin(host.tick * 0.08) * 0.15;
      ctx.fillStyle = `rgba(15, 23, 42, ${portalPulse + 0.2})`;
      ctx.beginPath();
      ctx.ellipse(coreX, drawY + 16, 14, 5.5, 0, 0, Math.PI * 2);
      ctx.fill();

      drawDarkraiVoidAura(ctx, host.tick, coreX, coreY, true);

      // Draw Darkrai PMD animated sprite (8 directions) or fallback
      const dir = cfg?.orientation || 'W';
      const pmdDrawn = host.pmdAnimator.draw(
        ctx,
        'darkrai',
        'idle',
        dir,
        coreX,
        drawY + 16,
        host.tick
      );
      if (!pmdDrawn && host.darkraiImg && host.darkraiImg.complete && host.darkraiImg.naturalWidth > 0) {
        const isFlipped = (cfg?.orientation || 'W') === 'E';
        if (isFlipped) {
          ctx.save();
          ctx.translate(drawX + 8, 0);
          ctx.scale(-1, 1);
          ctx.translate(-(drawX + 8), 0);
        }
        ctx.drawImage(host.darkraiImg, drawX - 13, drawY - 20 + levitate, 42, 42);
        if (isFlipped) ctx.restore();
      }
    } else if (npc.id === 'necrozma' || (npc as any).subType === 'necrozma' || npc.id === 'necrozma_dusk_mane') {
      // Authentic Necrozma Dusk Mane Prism Psychic/Steel Overworld Sprite with Solar Flare Aura
      const drawX = curTileX * TILE_SIZE;
      const drawY = curTileY * TILE_SIZE;
      const breath = Math.sin(host.tick * 0.04) * 0.9;
      const coreX = drawX + 8;
      const coreY = drawY + 6;

      // Ground shadow beneath heavy lion paws
      ctx.fillStyle = 'rgba(25, 15, 10, 0.45)';
      ctx.beginPath();
      ctx.ellipse(coreX, drawY + 16, 16, 6, 0, 0, Math.PI * 2);
      ctx.fill();

      // Radiant Solar Prism Aura
      const solarPulse = 0.35 + Math.sin(host.tick * 0.08) * 0.15;
      const sunGrad = ctx.createRadialGradient(coreX, coreY, 2, coreX, coreY, 20);
      sunGrad.addColorStop(0, `rgba(254, 240, 138, ${solarPulse + 0.3})`);
      sunGrad.addColorStop(0.4, `rgba(245, 158, 11, ${solarPulse})`);
      sunGrad.addColorStop(0.8, `rgba(79, 70, 229, ${solarPulse * 0.6})`);
      sunGrad.addColorStop(1, 'rgba(30, 27, 75, 0)');
      ctx.fillStyle = sunGrad;
      ctx.beginPath();
      ctx.arc(coreX, coreY, 20, 0, Math.PI * 2);
      ctx.fill();

      // Solar flare / prism laser sparkles
      if (host.tick % 20 < 12) {
        ctx.fillStyle = '#fbbf24';
        ctx.fillRect(coreX + Math.sin(host.tick * 0.25) * 14, coreY + 6 - ((host.tick * 1.4) % 18), 1.5, 1.5);
        ctx.fillStyle = '#818cf8';
        ctx.fillRect(coreX - 8 + Math.cos(host.tick * 0.18) * 12, coreY + 8 - ((host.tick * 1.2) % 16), 2, 2);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(coreX + 4 + Math.sin(host.tick * 0.3) * 10, coreY + 4 - (host.tick % 14), 1.5, 1.5);
      }

      // Draw Necrozma Dusk Mane sprite (120x112 scaled to 46x43)
      if (host.necrozmaImg && host.necrozmaImg.complete && host.necrozmaImg.naturalWidth > 0) {
        const isFlipped = (cfg?.orientation || 'W') === 'E';
        if (isFlipped) {
          ctx.save();
          ctx.translate(drawX + 8, 0);
          ctx.scale(-1, 1);
          ctx.translate(-(drawX + 8), 0);
        }
        ctx.drawImage(host.necrozmaImg, drawX - 15, drawY - 21 + breath, 46, 43);
        if (isFlipped) ctx.restore();
      }
    } else if (npc.id === 'lunala' || (npc as any).subType === 'lunala') {
      // Authentic Lunala Moone Psychic/Ghost Overworld Sprite with Full Moon Starlight Aura
      const drawX = curTileX * TILE_SIZE;
      const drawY = curTileY * TILE_SIZE;
      const levitate = Math.sin(host.tick * 0.045) * 2.2;
      const coreX = drawX + 8;
      const coreY = drawY + 2 + levitate;

      // Crescent lunar ground shadow beneath wingspan
      ctx.fillStyle = 'rgba(15, 23, 42, 0.35)';
      ctx.beginPath();
      ctx.ellipse(coreX, drawY + 16, 17, 5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Full Moon Cosmic Starlight Radiant Aura
      const moonPulse = 0.35 + Math.sin(host.tick * 0.08) * 0.15;
      const moonGrad = ctx.createRadialGradient(coreX, coreY, 2, coreX, coreY, 20);
      moonGrad.addColorStop(0, `rgba(224, 231, 255, ${moonPulse + 0.3})`);
      moonGrad.addColorStop(0.5, `rgba(129, 140, 248, ${moonPulse})`);
      moonGrad.addColorStop(0.8, `rgba(67, 56, 202, ${moonPulse * 0.5})`);
      moonGrad.addColorStop(1, 'rgba(15, 23, 42, 0)');
      ctx.fillStyle = moonGrad;
      ctx.beginPath();
      ctx.arc(coreX, coreY, 20, 0, Math.PI * 2);
      ctx.fill();

      // Lunar dust sparkles & starlight constellation glints
      if (host.tick % 20 < 12) {
        ctx.fillStyle = '#c7d2fe';
        ctx.fillRect(coreX + Math.sin(host.tick * 0.22) * 14, coreY - 4 + Math.cos(host.tick * 0.22) * 8, 1.5, 1.5);
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(coreX - 9 + Math.cos(host.tick * 0.16) * 12, coreY + 3 + Math.sin(host.tick * 0.16) * 6, 2, 2);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(coreX + 5 + Math.sin(host.tick * 0.28) * 10, coreY - 6 - (host.tick % 7), 1.5, 1.5);
      }

      // Draw PMD Animated Lunala
      const dir = cfg?.orientation || npc.dir || 'S';
      const pmdDrawn = host.pmdAnimator.draw(
        ctx,
        'lunala',
        'idle',
        dir,
        coreX,
        drawY + 16,
        host.tick
      );

      // Fallback to static sprite if PMD not yet loaded
      if (!pmdDrawn && host.lunalaImg && host.lunalaImg.complete && host.lunalaImg.naturalWidth > 0) {
        const isFlipped = (cfg?.orientation || 'W') === 'E';
        if (isFlipped) {
          ctx.save();
          ctx.translate(drawX + 8, 0);
          ctx.scale(-1, 1);
          ctx.translate(-(drawX + 8), 0);
        }
        ctx.drawImage(host.lunalaImg, drawX - 15, drawY - 21 + levitate, 46, 46);
        if (isFlipped) ctx.restore();
      }
    } else if (npc.id === 'solgaleo' || (npc as any).subType === 'solgaleo') {
      // Authentic Solgaleo Sunne Psychic/Steel Overworld Sprite with Radiant Sun Solar Corona Aura
      const drawX = curTileX * TILE_SIZE;
      const drawY = curTileY * TILE_SIZE;
      const breath = Math.sin(host.tick * 0.04) * 0.9;
      const coreX = drawX + 8;
      const coreY = drawY + 6;

      // Ground shadow beneath heavy lion paws
      ctx.fillStyle = 'rgba(25, 15, 5, 0.45)';
      ctx.beginPath();
      ctx.ellipse(coreX, drawY + 16, 16, 6, 0, 0, Math.PI * 2);
      ctx.fill();

      // Radiant Sun Solar Corona Aura (pure radiant gold / amber / white heat)
      const sunPulse = 0.35 + Math.sin(host.tick * 0.08) * 0.15;
      const sunGrad = ctx.createRadialGradient(coreX, coreY, 2, coreX, coreY, 20);
      sunGrad.addColorStop(0, `rgba(255, 255, 255, ${sunPulse + 0.35})`);
      sunGrad.addColorStop(0.35, `rgba(254, 240, 138, ${sunPulse + 0.2})`);
      sunGrad.addColorStop(0.7, `rgba(245, 158, 11, ${sunPulse * 0.7})`);
      sunGrad.addColorStop(1, 'rgba(234, 88, 12, 0)');
      ctx.fillStyle = sunGrad;
      ctx.beginPath();
      ctx.arc(coreX, coreY, 20, 0, Math.PI * 2);
      ctx.fill();

      // Solar flare sparks & prism glints
      if (host.tick % 20 < 12) {
        ctx.fillStyle = '#fef08a';
        ctx.fillRect(coreX + Math.sin(host.tick * 0.22) * 14, coreY + 4 - ((host.tick * 1.3) % 16), 1.5, 1.5);
        ctx.fillStyle = '#f97316';
        ctx.fillRect(coreX - 8 + Math.cos(host.tick * 0.17) * 12, coreY + 6 - ((host.tick * 1.1) % 15), 2, 2);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(coreX + 4 + Math.sin(host.tick * 0.28) * 10, coreY + 2 - (host.tick % 13), 1.5, 1.5);
      }

      // Draw Solgaleo 8-direction PMD animated sprite (with fallback)
      const dir = (cfg?.orientation || 'S').toLowerCase();
      const pmdDir = dir === 'w' ? 'left' : dir === 'e' ? 'right' : dir === 'n' ? 'up' : 'down';
      const pmdDrawn = host.pmdAnimator.draw(
        ctx,
        'solgaleo',
        'idle',
        pmdDir,
        coreX,
        drawY + 16,
        host.tick
      );

      if (!pmdDrawn && host.solgaleoImg && host.solgaleoImg.complete && host.solgaleoImg.naturalWidth > 0) {
        const isFlipped = (cfg?.orientation || 'W') === 'E';
        if (isFlipped) {
          ctx.save();
          ctx.translate(drawX + 8, 0);
          ctx.scale(-1, 1);
          ctx.translate(-(drawX + 8), 0);
        }
        ctx.drawImage(host.solgaleoImg, drawX - 15, drawY - 21 + breath, 46, 43);
        if (isFlipped) ctx.restore();
      }
    } else if (npc.id === 'samurott' || (npc as any).subType === 'samurott') {
      // Authentic Samurott Overworld Sprite with Seamitar Hydro Aura
      const drawX = curTileX * TILE_SIZE;
      const drawY = curTileY * TILE_SIZE;
      const breath = Math.sin(host.tick * 0.05) * 0.8;
      const coreX = drawX + 8;
      const coreY = drawY + 6;

      // Ground shadow
      ctx.fillStyle = 'rgba(10, 25, 45, 0.45)';
      ctx.beginPath();
      ctx.ellipse(coreX, drawY + 16, 14, 5, 0, 0, Math.PI * 2);
      ctx.fill();

      drawSamurottHydroAura(ctx, host.tick, coreX, coreY, true);

      // Draw Samurott PMD animated sprite (8 directions) or fallback
      const dir = cfg?.orientation || 'W';
      const pmdDrawn = host.pmdAnimator.draw(
        ctx,
        'samurott',
        'idle',
        dir,
        coreX,
        drawY + 16,
        host.tick
      );
      if (!pmdDrawn && host.samurottImg && host.samurottImg.complete && host.samurottImg.naturalWidth > 0) {
        const isFlipped = (cfg?.orientation || 'W') === 'E';
        if (isFlipped) {
          ctx.save();
          ctx.translate(drawX + 8, 0);
          ctx.scale(-1, 1);
          ctx.translate(-(drawX + 8), 0);
        }
        ctx.drawImage(host.samurottImg, drawX - 13, drawY - 20 + breath, 42, 42);
        if (isFlipped) ctx.restore();
      }
    } else {
      const drawX = curTileX * TILE_SIZE;
      const drawY = curTileY * TILE_SIZE;
      const dir =
        cfg?.orientation === 'W'
          ? 'left'
          : cfg?.orientation === 'E'
            ? 'right'
            : cfg?.orientation === 'N'
              ? 'up'
              : cfg?.orientation === 'S'
                ? 'down'
                : npc.dir;
      drawCharacter(
        ctx,
        npc.palette,
        dir,
        0,
        drawX,
        drawY,
        1
      );
    }

    // Floating speech bubble for interactive Pokémon & NPCs
    const isTalkable = [
      'twin',
      'charizard',
      'ranger',
      'tyranitar',
      'dialga',
      'palkia',
      'giratina',
      'rayquaza',
      'arceus',
      'ace',
      'mewtwo',
      'reshiram',
      'zekrom',
      'groudon',
      'kyogre',
      'garchomp',
      'urshifu',
      'samurott',
    ].includes(npc.id) || (npc as any).subType;

    if (isTalkable) {
      const isBig = [
        'charizard',
        'dialga',
        'palkia',
        'giratina',
        'rayquaza',
        'arceus',
        'tyranitar',
        'garchomp',
        'urshifu',
        'groudon',
        'kyogre',
        'reshiram',
        'zekrom',
        'samurott',
      ].includes(npc.id);
      const bx = curTileX * TILE_SIZE + (isBig ? 24 : 18);
      const by = curTileY * TILE_SIZE - 10 + Math.sin(host.tick * 0.08 + curTileX * 0.5) * 1.5;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.roundRect(bx, by, 13, 9, 3);
      ctx.fill();
      ctx.strokeStyle = '#1c1726';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      ctx.fillStyle = '#1c1726';
      ctx.fillRect(bx + 2.5, by + 3.5, 1.5, 1.5);
      ctx.fillRect(bx + 5.5, by + 3.5, 1.5, 1.5);
      ctx.fillRect(bx + 8.5, by + 3.5, 1.5, 1.5);
    }
  }

  // Custom spawned NPCs
  for (const b of townConfig.getBuildings()) {
    if (b.kind === 'npc' && !host.map.npcs.some((n) => n.id === b.id)) {
      if (b.hidden) continue;
      const isPokemon = [
        'charizard', 'tyranitar', 'blastoise', 'garchomp', 'urshifu', 'rayquaza',
        'mewtwo', 'arceus', 'dialga', 'palkia', 'reshiram', 'zekrom',
        'giratina', 'groudon', 'kyogre', 'gyarados', 'snorlax', 'latios', 'latias', 'darkrai',
        'necrozma', 'lunala', 'solgaleo', 'samurott', 'empoleon', 'regigigas', 'koraidon', 'eternatus', 'lugia', 'lucario', 'pikachu'
      ].includes(b.subType || b.id);
      const isFlipped = (isPokemon && !host.pmdAnimator.isSupported(b.subType || b.id)) ? b.orientation === 'E' : false;
      const centerX = b.x * TILE_SIZE + 8;
      if (isFlipped) {
        ctx.save();
        ctx.translate(centerX, 0);
        ctx.scale(-1, 1);
        ctx.translate(-centerX, 0);
      }
      if ((b.subType === 'charizard' || b.id === 'charizard') && (host.pmdAnimator.isSupported('charizard') || (host.charizardImg && host.charizardImg.complete))) {
        const breath = Math.sin(host.tick * 0.05) * 0.8;
        const coreX = b.x * TILE_SIZE + 8;
        const coreY = b.y * TILE_SIZE + 16;
        drawCharizardFlameAura(ctx, host.tick, coreX, coreY - 10, true);

        const dir = b.orientation || 'S';
        const pmdDrawn = host.pmdAnimator.draw(
          ctx,
          'charizard',
          'idle',
          dir,
          coreX,
          coreY,
          host.tick
        );
        if (!pmdDrawn && host.charizardImg && host.charizardImg.complete) {
          ctx.drawImage(host.charizardImg, b.x * TILE_SIZE - 13, b.y * TILE_SIZE - 20 + breath, 42, 42);
        }
      } else if ((b.subType === 'tyranitar' || b.id === 'tyranitar' || b.subType === 'blastoise' || b.id === 'blastoise') && (host.pmdAnimator.isSupported('tyranitar') || host.tyranitarImg || host.blastoiseImg)) {
        const stomp = Math.sin(host.tick * 0.04) * 0.8;
        const coreX = b.x * TILE_SIZE + 8;
        const dir = b.orientation || 'S';
        const pmdDrawn = host.pmdAnimator.draw(
          ctx,
          'tyranitar',
          'idle',
          dir,
          coreX,
          b.y * TILE_SIZE + 16,
          host.tick
        );
        if (!pmdDrawn) {
          const img = host.tyranitarImg || host.blastoiseImg;
          if (img && img.complete) {
            ctx.drawImage(img, b.x * TILE_SIZE - 13, b.y * TILE_SIZE - 20 + stomp, 42, 42);
          }
        }
      } else if ((b.subType === 'garchomp' || b.id === 'garchomp') && (host.pmdAnimator.isSupported('garchomp') || (host.garchompImg && host.garchompImg.complete))) {
        const machBob = Math.sin(host.tick * 0.05) * 0.9;
        const drawX = b.x * TILE_SIZE;
        const drawY = b.y * TILE_SIZE;
        const coreX = drawX + 8;

        // Ground shadow
        ctx.fillStyle = 'rgba(20, 20, 30, 0.4)';
        ctx.beginPath();
        ctx.ellipse(coreX, drawY + 16, 13, 4.5, 0, 0, Math.PI * 2);
        ctx.fill();

        // Dragon Claw & Mach slipstream particles
        if (host.tick % 16 < 11) {
          ctx.fillStyle = '#38bdf8';
          ctx.fillRect(coreX + Math.cos(host.tick * 0.15) * 12, drawY + 6 - (host.tick % 10) + machBob, 2, 1);
          ctx.fillStyle = '#fde047';
          ctx.fillRect(coreX - 5 + Math.sin(host.tick * 0.2) * 10, drawY + 14 - (host.tick % 8), 1.5, 1.5);
        }

        const dir = b.orientation || 'S';
        const pmdDrawn = host.pmdAnimator.draw(
          ctx,
          'garchomp',
          'idle',
          dir,
          coreX,
          b.y * TILE_SIZE + 16,
          host.tick
        );
        if (!pmdDrawn && host.garchompImg && host.garchompImg.complete) {
          ctx.drawImage(host.garchompImg, drawX - 13, drawY - 20 + machBob, 42, 42);
        }
      } else if (b.subType === 'urshifu' || b.id === 'urshifu' || b.subType === 'urshifu_gmax') {
        const stanceBob = Math.sin(host.tick * 0.04) * 0.8;
        const drawX = b.x * TILE_SIZE;
        const drawY = b.y * TILE_SIZE;
        const coreX = drawX + 8;
        const coreY = drawY + 16;

        // Ground shadow
        ctx.fillStyle = 'rgba(15, 23, 42, 0.45)';
        ctx.beginPath();
        ctx.ellipse(coreX, coreY, 16, 5.5, 0, 0, Math.PI * 2);
        ctx.fill();

        drawUrshifuTorrentAura(ctx, host.tick, coreX, coreY - 12, true);

        const dir = (b.orientation || 'S').toLowerCase();
        const pmdDir = dir === 'w' ? 'left' : dir === 'e' ? 'right' : dir === 'n' ? 'up' : 'down';
        const pmdDrawn = host.pmdAnimator.draw(
          ctx,
          'urshifu',
          'idle',
          pmdDir,
          coreX,
          coreY,
          host.tick
        );
        if (!pmdDrawn && host.urshifuImg && host.urshifuImg.complete) {
          ctx.drawImage(host.urshifuImg, drawX - 16, drawY - 24 + stanceBob, 48, 45);
        }
      } else if (b.subType === 'dialga' || b.id === 'dialga') {
        const coreX = b.x * TILE_SIZE + 8;
        const coreY = b.y * TILE_SIZE + 16;
        const lev = Math.sin(host.tick * 0.04) * 1.5;

        const dir = b.orientation || 'S';
        const pmdDrawn = host.pmdAnimator.draw(
          ctx,
          'dialga',
          'idle',
          dir,
          coreX,
          coreY,
          host.tick
        );
        if (!pmdDrawn && host.dialgaImg && host.dialgaImg.complete) {
          ctx.drawImage(host.dialgaImg, b.x * TILE_SIZE - 13, b.y * TILE_SIZE - 20 + lev, 42, 42);
        }
      } else if (b.subType === 'palkia' || b.id === 'palkia') {
        const coreX = b.x * TILE_SIZE + 8;
        const coreY = b.y * TILE_SIZE + 16;
        const lev = Math.sin(host.tick * 0.04) * 1.6;

        const dir = b.orientation || 'S';
        const pmdDrawn = host.pmdAnimator.draw(
          ctx,
          'palkia',
          'idle',
          dir,
          coreX,
          coreY,
          host.tick
        );
        if (!pmdDrawn && host.palkiaImg && host.palkiaImg.complete) {
          ctx.drawImage(host.palkiaImg, b.x * TILE_SIZE - 13, b.y * TILE_SIZE - 20 + lev, 42, 42);
        }
      } else if (b.subType === 'giratina' || b.id === 'giratina') {
        const coreX = b.x * TILE_SIZE + 8;
        const coreY = b.y * TILE_SIZE + 16;
        const lev = Math.sin(host.tick * 0.04) * 1.8;

        const dir = b.orientation || 'S';
        const pmdDrawn = host.pmdAnimator.draw(
          ctx,
          'giratina',
          'idle',
          dir,
          coreX,
          coreY,
          host.tick
        );
        if (!pmdDrawn && host.giratinaImg && host.giratinaImg.complete) {
          ctx.drawImage(host.giratinaImg, b.x * TILE_SIZE - 13, b.y * TILE_SIZE - 20 + lev, 42, 42);
        }
      } else if (b.subType === 'zekrom' || b.id === 'zekrom') {
        const coreX = b.x * TILE_SIZE + 8;
        const coreY = b.y * TILE_SIZE + 16;
        const lev = Math.sin(host.tick * 0.035) * 1.5;

        const dir = b.orientation || 'S';
        const pmdDrawn = host.pmdAnimator.draw(
          ctx,
          'zekrom',
          'idle',
          dir,
          coreX,
          coreY,
          host.tick
        );
        if (!pmdDrawn && host.zekromImg && host.zekromImg.complete) {
          ctx.drawImage(host.zekromImg, b.x * TILE_SIZE - 13, b.y * TILE_SIZE - 20 + lev, 42, 42);
        }
      } else if (b.subType === 'reshiram' || b.id === 'reshiram') {
        const coreX = b.x * TILE_SIZE + 8;
        const coreY = b.y * TILE_SIZE + 16;
        const lev = Math.sin(host.tick * 0.035) * 1.5;

        const dir = b.orientation || 'S';
        const pmdDrawn = host.pmdAnimator.draw(
          ctx,
          'reshiram',
          'idle',
          dir,
          coreX,
          coreY,
          host.tick
        );

        if (!pmdDrawn && host.reshiramImg && host.reshiramImg.complete) {
          ctx.drawImage(host.reshiramImg, b.x * TILE_SIZE - 13, b.y * TILE_SIZE - 20 + lev, 42, 42);
        }
      } else if (b.subType === 'arceus' || b.id === 'arceus') {
        const coreX = b.x * TILE_SIZE + 8;
        const coreY = b.y * TILE_SIZE + 16;
        const lev = Math.sin(host.tick * 0.04) * 2;

        const dir = b.orientation || 'S';
        const pmdDrawn = host.pmdAnimator.draw(
          ctx,
          'arceus',
          'idle',
          dir,
          coreX,
          coreY,
          host.tick
        );

        if (!pmdDrawn && host.arceusImg && host.arceusImg.complete) {
          ctx.drawImage(host.arceusImg, b.x * TILE_SIZE - 12, b.y * TILE_SIZE - 18 + lev, 40, 40);
        }
      } else if ((b.subType === 'mewtwo' || b.id === 'mewtwo') && host.mewtwoImg && host.mewtwoImg.complete) {
        const lev = Math.sin(host.tick * 0.045) * 2.2;
        ctx.drawImage(host.mewtwoImg, b.x * TILE_SIZE - 11, b.y * TILE_SIZE - 16 + lev, 38, 38);
      } else if (b.subType === 'rayquaza' || b.id === 'rayquaza') {
        const coreX = b.x * TILE_SIZE + 8;
        const coreY = b.y * TILE_SIZE + 16;
        const lev = Math.sin(host.tick * 0.04) * 2.0;

        // Atmospheric Ozone Emerald Aura
        const auraPulse = 0.35 + Math.sin(host.tick * 0.08) * 0.15;
        const spatGrad = ctx.createRadialGradient(coreX, b.y * TILE_SIZE - 2 + lev, 2, coreX, b.y * TILE_SIZE - 2 + lev, 18);
        spatGrad.addColorStop(0, `rgba(167, 243, 208, ${auraPulse + 0.3})`);
        spatGrad.addColorStop(0.5, `rgba(16, 185, 129, ${auraPulse})`);
        spatGrad.addColorStop(1, 'rgba(5, 150, 105, 0)');
        ctx.fillStyle = spatGrad;
        ctx.beginPath();
        ctx.arc(coreX, b.y * TILE_SIZE - 2 + lev, 18, 0, Math.PI * 2);
        ctx.fill();

        // Stardust & Delta Stream wind sparkles
        if (host.tick % 24 < 14) {
          ctx.fillStyle = '#fef08a';
          ctx.fillRect(coreX + Math.sin(host.tick * 0.2) * 12, b.y * TILE_SIZE - 6 - (host.tick % 14), 1.5, 1.5);
          ctx.fillStyle = '#34d399';
          ctx.fillRect(coreX - 6 + Math.cos(host.tick * 0.16) * 10, b.y * TILE_SIZE + 2 - (host.tick % 10), 2, 2);
        }

        const dir = b.orientation || 'S';
        const pmdDrawn = host.pmdAnimator.draw(
          ctx,
          'rayquaza',
          'idle',
          dir,
          coreX,
          coreY,
          host.tick
        );

        if (!pmdDrawn && host.rayquazaImg && host.rayquazaImg.complete) {
          ctx.drawImage(host.rayquazaImg, b.x * TILE_SIZE - 13, b.y * TILE_SIZE - 20 + lev, 42, 42);
        }
      } else if ((b.subType === 'groudon' || b.id === 'groudon') && (host.pmdAnimator.isSupported('groudon') || (host.groudonImg && host.groudonImg.complete))) {
        const breath = Math.sin(host.tick * 0.04) * 0.8;
        const coreX = b.x * TILE_SIZE + 8;
        const coreY = b.y * TILE_SIZE + 8;

        // Ground shadow beneath heavy continent body
        ctx.fillStyle = 'rgba(25, 12, 6, 0.45)';
        ctx.beginPath();
        ctx.ellipse(coreX, b.y * TILE_SIZE + 16, 15, 6, 0, 0, Math.PI * 2);
        ctx.fill();

        // Primal Magma / Desolate Land Heat Radiance
        const magmaPulse = 0.35 + Math.sin(host.tick * 0.07) * 0.15;
        const heatGrad = ctx.createRadialGradient(coreX, coreY, 2, coreX, coreY, 20);
        heatGrad.addColorStop(0, `rgba(239, 68, 68, ${magmaPulse + 0.25})`);
        heatGrad.addColorStop(0.5, `rgba(249, 115, 22, ${magmaPulse * 0.8})`);
        heatGrad.addColorStop(1, 'rgba(180, 83, 9, 0)');
        ctx.fillStyle = heatGrad;
        ctx.beginPath();
        ctx.arc(coreX, coreY, 20, 0, Math.PI * 2);
        ctx.fill();

        // Volcanic embers & magma sparks rising upward from the scorched earth
        if (host.tick % 20 < 12) {
          ctx.fillStyle = '#f59e0b';
          ctx.fillRect(coreX + Math.sin(host.tick * 0.25) * 14, coreY + 8 - ((host.tick * 1.5) % 18), 1.5, 1.5);
          ctx.fillStyle = '#ef4444';
          ctx.fillRect(coreX - 8 + Math.cos(host.tick * 0.18) * 12, coreY + 10 - ((host.tick * 1.2) % 16), 2, 2);
          ctx.fillStyle = '#fde047';
          ctx.fillRect(coreX + 4 + Math.sin(host.tick * 0.3) * 10, coreY + 6 - (host.tick % 14), 1.5, 1.5);
        }

        const dir = b.orientation || 'S';
        const pmdDrawn = host.pmdAnimator.draw(
          ctx,
          'groudon',
          'idle',
          dir,
          coreX,
          b.y * TILE_SIZE + 16,
          host.tick
        );
        if (!pmdDrawn && host.groudonImg && host.groudonImg.complete) {
          ctx.drawImage(host.groudonImg, b.x * TILE_SIZE - 13, b.y * TILE_SIZE - 20 + breath, 42, 42);
        }
      } else if ((b.subType === 'kyogre' || b.id === 'kyogre') && (host.pmdAnimator.isSupported('kyogre') || (host.kyogreImg && host.kyogreImg.complete))) {
        const swimY = Math.sin(host.tick * 0.04) * 1.8;
        const coreX = b.x * TILE_SIZE + 8;
        const coreY = b.y * TILE_SIZE + 2 + swimY;

        // Water ripple shadow
        ctx.fillStyle = 'rgba(7, 43, 79, 0.4)';
        ctx.beginPath();
        ctx.ellipse(coreX, b.y * TILE_SIZE + 16, 15, 5.5, 0, 0, Math.PI * 2);
        ctx.fill();

        // Primordial Sea Oceanic Hydro Aura
        const waterPulse = 0.35 + Math.sin(host.tick * 0.08) * 0.15;
        const aquaGrad = ctx.createRadialGradient(coreX, coreY, 2, coreX, coreY, 19);
        aquaGrad.addColorStop(0, `rgba(186, 230, 253, ${waterPulse + 0.3})`);
        aquaGrad.addColorStop(0.5, `rgba(14, 165, 233, ${waterPulse})`);
        aquaGrad.addColorStop(1, 'rgba(3, 105, 161, 0)');
        ctx.fillStyle = aquaGrad;
        ctx.beginPath();
        ctx.arc(coreX, coreY, 19, 0, Math.PI * 2);
        ctx.fill();

        // Hydro droplet & bioluminescent mist bubbles
        if (host.tick % 22 < 13) {
          ctx.fillStyle = '#7dd3fc';
          ctx.fillRect(coreX + Math.sin(host.tick * 0.22) * 13, coreY - 4 + Math.cos(host.tick * 0.22) * 8, 1.5, 1.5);
          ctx.fillStyle = '#38bdf8';
          ctx.fillRect(coreX - 7 + Math.cos(host.tick * 0.17) * 11, coreY + 4 + Math.sin(host.tick * 0.17) * 7, 2, 2);
          ctx.fillStyle = '#f0f9ff';
          ctx.fillRect(coreX + 5 + Math.sin(host.tick * 0.28) * 9, coreY - 6 - (host.tick % 8), 1.5, 1.5);
        }

        const dir = b.orientation || 'S';
        const pmdDrawn = host.pmdAnimator.draw(
          ctx,
          'kyogre',
          'idle',
          dir,
          coreX,
          b.y * TILE_SIZE + 16,
          host.tick
        );
        if (!pmdDrawn && host.kyogreImg && host.kyogreImg.complete) {
          ctx.drawImage(host.kyogreImg, b.x * TILE_SIZE - 13, b.y * TILE_SIZE - 20 + swimY, 42, 42);
        }
      } else if ((b.subType === 'latios' || b.id === 'latios') && (host.pmdAnimator.isSupported('latios') || (host.latiosImg && host.latiosImg.complete))) {
        const jetHover = Math.sin(host.tick * 0.055) * 2.2;
        const coreX = b.x * TILE_SIZE + 8;
        const coreY = b.y * TILE_SIZE + 1 + jetHover;

        // Aerodynamic ground shadow
        ctx.fillStyle = 'rgba(15, 23, 42, 0.35)';
        ctx.beginPath();
        ctx.ellipse(coreX, b.y * TILE_SIZE + 16, 13, 4.5, 0, 0, Math.PI * 2);
        ctx.fill();

        drawLatiosJetAura(ctx, host.tick, coreX, coreY, true);

        const dir = b.orientation || 'S';
        const pmdDrawn = host.pmdAnimator.draw(
          ctx,
          'latios',
          'idle',
          dir,
          coreX,
          b.y * TILE_SIZE + 16,
          host.tick
        );
        if (!pmdDrawn && host.latiosImg && host.latiosImg.complete) {
          ctx.drawImage(host.latiosImg, b.x * TILE_SIZE - 13, b.y * TILE_SIZE - 20 + jetHover, 42, 42);
        }
      } else if ((b.subType === 'latias' || b.id === 'latias') && (host.pmdAnimator.isSupported('latias') || (host.latiasImg && host.latiasImg.complete))) {
        const floatY = Math.sin(host.tick * 0.055 + 1.2) * 2.2;
        const coreX = b.x * TILE_SIZE + 8;
        const coreY = b.y * TILE_SIZE + 1 + floatY;

        // Aerodynamic ground shadow
        ctx.fillStyle = 'rgba(15, 23, 42, 0.35)';
        ctx.beginPath();
        ctx.ellipse(coreX, b.y * TILE_SIZE + 16, 12, 4.5, 0, 0, Math.PI * 2);
        ctx.fill();

        // Eon Crimson / Rose Mist Radiant Aura
        const rosePulse = 0.35 + Math.sin(host.tick * 0.09 + 1.0) * 0.15;
        const auraGrad = ctx.createRadialGradient(coreX, coreY, 2, coreX, coreY, 18);
        auraGrad.addColorStop(0, `rgba(254, 205, 211, ${rosePulse + 0.3})`);
        auraGrad.addColorStop(0.5, `rgba(244, 63, 94, ${rosePulse})`);
        auraGrad.addColorStop(1, 'rgba(190, 18, 60, 0)');
        ctx.fillStyle = auraGrad;
        ctx.beginPath();
        ctx.arc(coreX, coreY, 18, 0, Math.PI * 2);
        ctx.fill();

        // Light refraction glass crystals & pink stardust
        if (host.tick % 20 < 12) {
          ctx.fillStyle = '#fda4af';
          ctx.fillRect(coreX + Math.sin(host.tick * 0.24) * 12, coreY - 4 + Math.cos(host.tick * 0.24) * 8, 1.5, 1.5);
          ctx.fillStyle = '#f43f5e';
          ctx.fillRect(coreX - 7 + Math.cos(host.tick * 0.18) * 10, coreY + 3 + Math.sin(host.tick * 0.18) * 6, 2, 2);
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(coreX + 4 + Math.sin(host.tick * 0.3) * 8, coreY - 5 - (host.tick % 7), 1.5, 1.5);
        }

        const dir = b.orientation || 'S';
        const pmdDrawn = host.pmdAnimator.draw(
          ctx,
          'latias',
          'idle',
          dir,
          coreX,
          b.y * TILE_SIZE + 16,
          host.tick
        );
        if (!pmdDrawn && host.latiasImg && host.latiasImg.complete) {
          ctx.drawImage(host.latiasImg, b.x * TILE_SIZE - 13, b.y * TILE_SIZE - 20 + floatY, 42, 42);
        }
      } else if ((b.subType === 'darkrai' || b.id === 'darkrai') && (host.pmdAnimator.isSupported('darkrai') || (host.darkraiImg && host.darkraiImg.complete))) {
        const levitate = Math.sin(host.tick * 0.04) * 2.0;
        const coreX = b.x * TILE_SIZE + 8;
        const coreY = b.y * TILE_SIZE + 2 + levitate;

        // Shadowy abyss portal pool
        const portalPulse = 0.4 + Math.sin(host.tick * 0.08) * 0.15;
        ctx.fillStyle = `rgba(15, 23, 42, ${portalPulse + 0.2})`;
        ctx.beginPath();
        ctx.ellipse(coreX, b.y * TILE_SIZE + 16, 14, 5.5, 0, 0, Math.PI * 2);
        ctx.fill();

        drawDarkraiVoidAura(ctx, host.tick, coreX, coreY, true);

        const dir = b.orientation || 'S';
        const pmdDrawn = host.pmdAnimator.draw(
          ctx,
          'darkrai',
          'idle',
          dir,
          coreX,
          b.y * TILE_SIZE + 16,
          host.tick
        );
        if (!pmdDrawn && host.darkraiImg && host.darkraiImg.complete) {
          ctx.drawImage(host.darkraiImg, b.x * TILE_SIZE - 13, b.y * TILE_SIZE - 20 + levitate, 42, 42);
        }
      } else if ((b.subType === 'necrozma' || b.subType === 'necrozma_dusk_mane' || b.id === 'necrozma' || b.id === 'necrozma_dusk_mane') && host.necrozmaImg && host.necrozmaImg.complete) {
        const breath = Math.sin(host.tick * 0.04) * 0.9;
        const coreX = b.x * TILE_SIZE + 8;
        const coreY = b.y * TILE_SIZE + 6;

        // Ground shadow beneath heavy lion paws
        ctx.fillStyle = 'rgba(25, 15, 10, 0.45)';
        ctx.beginPath();
        ctx.ellipse(coreX, b.y * TILE_SIZE + 16, 16, 6, 0, 0, Math.PI * 2);
        ctx.fill();

        // Radiant Solar Prism Aura
        const solarPulse = 0.35 + Math.sin(host.tick * 0.08) * 0.15;
        const sunGrad = ctx.createRadialGradient(coreX, coreY, 2, coreX, coreY, 20);
        sunGrad.addColorStop(0, `rgba(254, 240, 138, ${solarPulse + 0.3})`);
        sunGrad.addColorStop(0.4, `rgba(245, 158, 11, ${solarPulse})`);
        sunGrad.addColorStop(0.8, `rgba(79, 70, 229, ${solarPulse * 0.6})`);
        sunGrad.addColorStop(1, 'rgba(30, 27, 75, 0)');
        ctx.fillStyle = sunGrad;
        ctx.beginPath();
        ctx.arc(coreX, coreY, 20, 0, Math.PI * 2);
        ctx.fill();

        // Solar flare / prism laser sparkles
        if (host.tick % 20 < 12) {
          ctx.fillStyle = '#fbbf24';
          ctx.fillRect(coreX + Math.sin(host.tick * 0.25) * 14, coreY + 6 - ((host.tick * 1.4) % 18), 1.5, 1.5);
          ctx.fillStyle = '#818cf8';
          ctx.fillRect(coreX - 8 + Math.cos(host.tick * 0.18) * 12, coreY + 8 - ((host.tick * 1.2) % 16), 2, 2);
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(coreX + 4 + Math.sin(host.tick * 0.3) * 10, coreY + 4 - (host.tick % 14), 1.5, 1.5);
        }

        ctx.drawImage(host.necrozmaImg, b.x * TILE_SIZE - 15, b.y * TILE_SIZE - 21 + breath, 46, 43);
      } else if (b.subType === 'lunala' || b.id === 'lunala') {
        const levitate = Math.sin(host.tick * 0.045) * 2.2;
        const coreX = b.x * TILE_SIZE + 8;
        const coreY = b.y * TILE_SIZE + 2 + levitate;

        // Crescent lunar ground shadow beneath wingspan
        ctx.fillStyle = 'rgba(15, 23, 42, 0.35)';
        ctx.beginPath();
        ctx.ellipse(coreX, b.y * TILE_SIZE + 16, 17, 5, 0, 0, Math.PI * 2);
        ctx.fill();

        // Full Moon Cosmic Starlight Radiant Aura
        const moonPulse = 0.35 + Math.sin(host.tick * 0.08) * 0.15;
        const moonGrad = ctx.createRadialGradient(coreX, coreY, 2, coreX, coreY, 20);
        moonGrad.addColorStop(0, `rgba(224, 231, 255, ${moonPulse + 0.3})`);
        moonGrad.addColorStop(0.5, `rgba(129, 140, 248, ${moonPulse})`);
        moonGrad.addColorStop(0.8, `rgba(67, 56, 202, ${moonPulse * 0.5})`);
        moonGrad.addColorStop(1, 'rgba(15, 23, 42, 0)');
        ctx.fillStyle = moonGrad;
        ctx.beginPath();
        ctx.arc(coreX, coreY, 20, 0, Math.PI * 2);
        ctx.fill();

        // Lunar dust sparkles & starlight constellation glints
        if (host.tick % 20 < 12) {
          ctx.fillStyle = '#c7d2fe';
          ctx.fillRect(coreX + Math.sin(host.tick * 0.22) * 14, coreY - 4 + Math.cos(host.tick * 0.22) * 8, 1.5, 1.5);
          ctx.fillStyle = '#38bdf8';
          ctx.fillRect(coreX - 9 + Math.cos(host.tick * 0.16) * 12, coreY + 3 + Math.sin(host.tick * 0.16) * 6, 2, 2);
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(coreX + 5 + Math.sin(host.tick * 0.28) * 10, coreY - 6 - (host.tick % 7), 1.5, 1.5);
        }

        const dir = b.orientation || 'S';
        const pmdDrawn = host.pmdAnimator.draw(
          ctx,
          'lunala',
          'idle',
          dir,
          coreX,
          b.y * TILE_SIZE + 16,
          host.tick
        );
        if (!pmdDrawn && host.lunalaImg && host.lunalaImg.complete) {
          ctx.drawImage(host.lunalaImg, b.x * TILE_SIZE - 15, b.y * TILE_SIZE - 21 + levitate, 46, 46);
        }
      } else if ((b.subType === 'solgaleo' || b.id === 'solgaleo') && host.solgaleoImg && host.solgaleoImg.complete) {
        const breath = Math.sin(host.tick * 0.04) * 0.9;
        const coreX = b.x * TILE_SIZE + 8;
        const coreY = b.y * TILE_SIZE + 6;

        // Ground shadow beneath heavy lion paws
        ctx.fillStyle = 'rgba(25, 15, 5, 0.45)';
        ctx.beginPath();
        ctx.ellipse(coreX, b.y * TILE_SIZE + 16, 16, 6, 0, 0, Math.PI * 2);
        ctx.fill();

        // Radiant Sun Solar Corona Aura
        const sunPulse = 0.35 + Math.sin(host.tick * 0.08) * 0.15;
        const sunGrad = ctx.createRadialGradient(coreX, coreY, 2, coreX, coreY, 20);
        sunGrad.addColorStop(0, `rgba(255, 255, 255, ${sunPulse + 0.35})`);
        sunGrad.addColorStop(0.35, `rgba(254, 240, 138, ${sunPulse + 0.2})`);
        sunGrad.addColorStop(0.7, `rgba(245, 158, 11, ${sunPulse * 0.7})`);
        sunGrad.addColorStop(1, 'rgba(234, 88, 12, 0)');
        ctx.fillStyle = sunGrad;
        ctx.beginPath();
        ctx.arc(coreX, coreY, 20, 0, Math.PI * 2);
        ctx.fill();

        // Solar flare sparks & prism glints
        if (host.tick % 20 < 12) {
          ctx.fillStyle = '#fef08a';
          ctx.fillRect(coreX + Math.sin(host.tick * 0.22) * 14, coreY + 4 - ((host.tick * 1.3) % 16), 1.5, 1.5);
          ctx.fillStyle = '#f97316';
          ctx.fillRect(coreX - 8 + Math.cos(host.tick * 0.17) * 12, coreY + 6 - ((host.tick * 1.1) % 15), 2, 2);
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(coreX + 4 + Math.sin(host.tick * 0.28) * 10, coreY + 2 - (host.tick % 13), 1.5, 1.5);
        }

        const pmdDrawn = host.pmdAnimator.draw(
          ctx,
          'solgaleo',
          'idle',
          'down',
          coreX,
          b.y * TILE_SIZE + 16,
          host.tick
        );
        if (!pmdDrawn && host.solgaleoImg && host.solgaleoImg.complete) {
          ctx.drawImage(host.solgaleoImg, b.x * TILE_SIZE - 15, b.y * TILE_SIZE - 21 + breath, 46, 43);
        }
      } else if ((b.subType === 'samurott' || b.id === 'samurott') && (host.pmdAnimator.isSupported('samurott') || (host.samurottImg && host.samurottImg.complete))) {
        const breath = Math.sin(host.tick * 0.05) * 0.8;
        const coreX = b.x * TILE_SIZE + 8;
        const coreY = b.y * TILE_SIZE + 6;

        // Ground shadow
        ctx.fillStyle = 'rgba(10, 25, 45, 0.45)';
        ctx.beginPath();
        ctx.ellipse(coreX, b.y * TILE_SIZE + 16, 14, 5, 0, 0, Math.PI * 2);
        ctx.fill();

        drawSamurottHydroAura(ctx, host.tick, coreX, coreY, true);

        const dir = b.orientation || 'S';
        const pmdDrawn = host.pmdAnimator.draw(
          ctx,
          'samurott',
          'idle',
          dir,
          coreX,
          b.y * TILE_SIZE + 16,
          host.tick
        );
        if (!pmdDrawn && host.samurottImg && host.samurottImg.complete) {
          ctx.drawImage(host.samurottImg, b.x * TILE_SIZE - 13, b.y * TILE_SIZE - 20 + breath, 42, 42);
        }
      } else if ((b.subType === 'empoleon' || b.id === 'empoleon') && (host.pmdAnimator.isSupported('empoleon') || (host.empoleonImg && host.empoleonImg.complete))) {
        const breath = Math.sin(host.tick * 0.045) * 0.8;
        const coreX = b.x * TILE_SIZE + 8;
        const coreY = b.y * TILE_SIZE + 5;

        // Ground shadow
        ctx.fillStyle = 'rgba(10, 25, 45, 0.45)';
        ctx.beginPath();
        ctx.ellipse(coreX, b.y * TILE_SIZE + 16, 13, 5, 0, 0, Math.PI * 2);
        ctx.fill();

        drawEmpoleonTridentAura(ctx, host.tick, coreX, coreY, true);

        const dir = b.orientation || 'S';
        const pmdDrawn = host.pmdAnimator.draw(
          ctx,
          'empoleon',
          'idle',
          dir,
          coreX,
          b.y * TILE_SIZE + 16,
          host.tick
        );
        if (!pmdDrawn && host.empoleonImg && host.empoleonImg.complete) {
          ctx.drawImage(host.empoleonImg, b.x * TILE_SIZE - 13, b.y * TILE_SIZE - 20 + breath, 42, 42);
        }
      } else if ((b.subType === 'regigigas' || b.id === 'regigigas') && (host.pmdAnimator.isSupported('regigigas') || (host.regigigasImg && host.regigigasImg.complete))) {
        const coreX = b.x * TILE_SIZE + 8;
        const coreY = b.y * TILE_SIZE + 4;

        // Heavy colossal ground shadow
        ctx.fillStyle = 'rgba(20, 25, 15, 0.48)';
        ctx.beginPath();
        ctx.ellipse(coreX, b.y * TILE_SIZE + 16, 16, 6, 0, 0, Math.PI * 2);
        ctx.fill();

        drawRegigigasRuneAura(ctx, host.tick, coreX, coreY, true);

        const dir = b.orientation || 'S';
        const pmdDrawn = host.pmdAnimator.draw(
          ctx,
          'regigigas',
          'idle',
          dir,
          coreX,
          b.y * TILE_SIZE + 16,
          host.tick
        );
        if (!pmdDrawn && host.regigigasImg && host.regigigasImg.complete) {
          ctx.drawImage(host.regigigasImg, b.x * TILE_SIZE - 16, b.y * TILE_SIZE - 24, 48, 48);
        }
      } else if ((b.subType === 'koraidon' || b.id === 'koraidon') && (host.pmdAnimator.isSupported('koraidon') || (host.koraidonImg && host.koraidonImg.complete))) {
        const coreX = b.x * TILE_SIZE + 8;
        const coreY = b.y * TILE_SIZE + 4;

        // Ground shadow
        ctx.fillStyle = 'rgba(25, 10, 12, 0.45)';
        ctx.beginPath();
        ctx.ellipse(coreX, b.y * TILE_SIZE + 16, 15, 5.5, 0, 0, Math.PI * 2);
        ctx.fill();

        drawKoraidonApexAura(ctx, host.tick, coreX, coreY, true);

        const dir = b.orientation || 'S';
        const pmdDrawn = host.pmdAnimator.draw(
          ctx,
          'koraidon',
          'idle',
          dir,
          coreX,
          b.y * TILE_SIZE + 16,
          host.tick
        );
        if (!pmdDrawn && host.koraidonImg && host.koraidonImg.complete) {
          ctx.drawImage(host.koraidonImg, b.x * TILE_SIZE - 16, b.y * TILE_SIZE - 24, 48, 48);
        }
      } else if ((b.subType === 'eternatus' || b.id === 'eternatus') && (host.pmdAnimator.isSupported('eternatus') || (host.eternatusImg && host.eternatusImg.complete))) {
        const coreX = b.x * TILE_SIZE + 8;
        const coreY = b.y * TILE_SIZE + 3;

        // Cosmic Dynamax ground shadow
        ctx.fillStyle = 'rgba(20, 10, 35, 0.45)';
        ctx.beginPath();
        ctx.ellipse(coreX, b.y * TILE_SIZE + 16, 16, 5.5, 0, 0, Math.PI * 2);
        ctx.fill();

        drawEternatusDynamoAura(ctx, host.tick, coreX, coreY, true);

        const dir = b.orientation || 'S';
        const pmdDrawn = host.pmdAnimator.draw(
          ctx,
          'eternatus',
          'idle',
          dir,
          coreX,
          b.y * TILE_SIZE + 16,
          host.tick
        );
        if (!pmdDrawn && host.eternatusImg && host.eternatusImg.complete) {
          ctx.drawImage(host.eternatusImg, b.x * TILE_SIZE - 16, b.y * TILE_SIZE - 24, 48, 48);
        }
      } else if ((b.subType === 'gyarados' || b.id === 'gyarados') && host.pmdAnimator.isSupported('gyarados')) {
        const swimY = Math.sin(host.tick * 0.04) * 1.5;
        const coreX = b.x * TILE_SIZE + 8;
        const coreY = b.y * TILE_SIZE + 4 + swimY;

        // Ground shadow
        ctx.fillStyle = 'rgba(7, 43, 79, 0.45)';
        ctx.beginPath();
        ctx.ellipse(coreX, b.y * TILE_SIZE + 16, 16, 5.5, 0, 0, Math.PI * 2);
        ctx.fill();

        // Surging Dragon Rage / Waterfall Hydro Aura
        const waterPulse = 0.35 + Math.sin(host.tick * 0.08) * 0.15;
        const aquaGrad = ctx.createRadialGradient(coreX, coreY, 2, coreX, coreY, 20);
        aquaGrad.addColorStop(0, `rgba(186, 230, 253, ${waterPulse + 0.3})`);
        aquaGrad.addColorStop(0.5, `rgba(14, 165, 233, ${waterPulse})`);
        aquaGrad.addColorStop(1, 'rgba(3, 105, 161, 0)');
        ctx.fillStyle = aquaGrad;
        ctx.beginPath();
        ctx.arc(coreX, coreY, 20, 0, Math.PI * 2);
        ctx.fill();

        // Hydro droplets & dragon mist sparks
        if (host.tick % 20 < 12) {
          ctx.fillStyle = '#bae6fd';
          ctx.fillRect(coreX + Math.sin(host.tick * 0.22) * 13, coreY - 4 + Math.cos(host.tick * 0.22) * 8, 1.5, 1.5);
          ctx.fillStyle = '#0284c7';
          ctx.fillRect(coreX - 7 + Math.cos(host.tick * 0.17) * 11, coreY + 4 + Math.sin(host.tick * 0.17) * 7, 2, 2);
        }

        const dir = b.orientation || 'S';
        host.pmdAnimator.draw(
          ctx,
          'gyarados',
          'idle',
          dir,
          coreX,
          b.y * TILE_SIZE + 16,
          host.tick
        );
      } else if ((b.subType === 'snorlax' || b.id === 'snorlax') && host.pmdAnimator.isSupported('snorlax')) {
        const coreX = b.x * TILE_SIZE + 8;
        const coreY = b.y * TILE_SIZE + 16;
        const breath = Math.sin(host.tick * 0.035) * 0.8;

        // Ground shadow
        ctx.fillStyle = 'rgba(20, 25, 35, 0.45)';
        ctx.beginPath();
        ctx.ellipse(coreX, b.y * TILE_SIZE + 16, 15, 6, 0, 0, Math.PI * 2);
        ctx.fill();

        // Sleepy cozy floating 'z' particles
        if (host.tick % 60 < 25) {
          ctx.fillStyle = '#93c5fd';
          ctx.font = '8px monospace';
          ctx.fillText('z', coreX + 6 + (host.tick % 15) * 0.4, b.y * TILE_SIZE - 4 - ((host.tick * 0.6) % 12));
        }

        const dir = b.orientation || 'S';
        host.pmdAnimator.draw(
          ctx,
          'snorlax',
          'idle',
          dir,
          coreX,
          b.y * TILE_SIZE + 16 + breath,
          host.tick
        );
      } else if ((b.subType === 'lugia' || b.id === 'lugia') && (host.pmdAnimator.isSupported('lugia') || (host.lugiaImg && host.lugiaImg.complete))) {
        const floatY = Math.sin(host.tick * 0.05) * 2.0;
        const coreX = b.x * TILE_SIZE + 8;
        const coreY = b.y * TILE_SIZE + 2 + floatY;

        // Silver sea-storm ground shadow
        ctx.fillStyle = 'rgba(15, 23, 42, 0.4)';
        ctx.beginPath();
        ctx.ellipse(coreX, b.y * TILE_SIZE + 16, 16, 5.5, 0, 0, Math.PI * 2);
        ctx.fill();

        drawLugiaAeroblastAura(ctx, host.tick, coreX, coreY, true);

        const dir = b.orientation || 'S';
        const pmdDrawn = host.pmdAnimator.draw(
          ctx,
          'lugia',
          'idle',
          dir,
          coreX,
          b.y * TILE_SIZE + 16,
          host.tick
        );
        if (!pmdDrawn && host.lugiaImg && host.lugiaImg.complete) {
          ctx.drawImage(host.lugiaImg, b.x * TILE_SIZE - 16, b.y * TILE_SIZE - 24 + floatY, 48, 48);
        }
      } else if (b.subType === 'lucario' || b.id === 'lucario') {
        drawLucario(ctx, b.x * TILE_SIZE, b.y * TILE_SIZE, host.tick, 1);
      } else if (b.subType === 'pikachu' || b.id === 'pikachu') {
        drawPikachu(ctx, b.x * TILE_SIZE, b.y * TILE_SIZE);
      } else {
        const dir =
          b.orientation === 'W'
            ? 'left'
            : b.orientation === 'E'
              ? 'right'
              : b.orientation === 'N'
                ? 'up'
                : 'down';
        drawCharacter(ctx, host.playerPalette, dir, 0, b.x * TILE_SIZE, b.y * TILE_SIZE, 1);
      }
      if (isFlipped) {
        ctx.restore();
      }

      // Draw speech bubble for custom placed Pokémon & NPCs
      const bx = b.x * TILE_SIZE + ((b.w || 1) >= 2 ? 24 : 18);
      const by = b.y * TILE_SIZE - 10 + Math.sin(host.tick * 0.08 + b.x * 0.5) * 1.5;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.roundRect(bx, by, 13, 9, 3);
      ctx.fill();
      ctx.strokeStyle = '#1c1726';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      ctx.fillStyle = '#1c1726';
      ctx.fillRect(bx + 2.5, by + 3.5, 1.5, 1.5);
      ctx.fillRect(bx + 5.5, by + 3.5, 1.5, 1.5);
      ctx.fillRect(bx + 8.5, by + 3.5, 1.5, 1.5);
    }
  }
}
