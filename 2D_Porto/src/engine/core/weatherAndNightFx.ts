import type { TownEngine } from '../TownEngine';
import type { Lamp } from '../types';
import { TILE_SIZE } from '../sprites';
import { townConfig } from '../townConfig';

export function initParticlesHelper(engine: TownEngine): void {
    const totalW = engine.map.w * TILE_SIZE;
    const totalH = engine.map.h * TILE_SIZE;
    engine.particles = [];
    engine.fireflies = [];

    // Weather Particles
    if (engine.weather === 'petals') {
      // 45 Sakura petals & gentle leaves
      for (let i = 0; i < 45; i++) {
        const isPetal = Math.random() < 0.65;
        engine.particles.push({
          x: Math.random() * totalW,
          y: Math.random() * totalH,
          vx: 0.35 + Math.random() * 0.45,
          vy: 0.25 + Math.random() * 0.35,
          size: isPetal ? (Math.random() > 0.5 ? 2.5 : 2) : 2,
          alpha: 0.4 + Math.random() * 0.45,
          color: isPetal ? (Math.random() > 0.5 ? '#ffb7c5' : '#ffccd5') : '#a8e063',
          type: isPetal ? 'petal' : 'leaf',
          sway: Math.random() * Math.PI * 2,
          swaySpeed: 0.02 + Math.random() * 0.03,
        });
      }
    } else if (engine.weather === 'rain') {
      // 65 Lo-Fi Raindrops
      for (let i = 0; i < 65; i++) {
        engine.particles.push({
          x: Math.random() * totalW,
          y: Math.random() * totalH,
          vx: -1.4 - Math.random() * 0.8,
          vy: 8.5 + Math.random() * 3.5,
          size: 1,
          len: 7 + Math.random() * 6,
          alpha: 0.35 + Math.random() * 0.45,
          color: 'rgba(180, 220, 255, 0.75)',
          type: 'raindrop',
        });
      }
    } else if (engine.weather === 'stars') {
      // 45 Twinkling Stars
      const starColors = ['#fff9db', '#d0ebff', '#eebefa', '#ffec99'];
      for (let i = 0; i < 45; i++) {
        engine.particles.push({
          x: Math.random() * totalW,
          y: Math.random() * totalH,
          vx: (Math.random() - 0.5) * 0.15,
          vy: -0.15 - Math.random() * 0.2,
          size: Math.random() > 0.6 ? 2.5 : 1.5,
          alpha: 0.3 + Math.random() * 0.5,
          color: starColors[Math.floor(Math.random() * starColors.length)],
          type: 'star',
          sway: Math.random() * Math.PI * 2,
          swaySpeed: 0.04 + Math.random() * 0.04,
        });
      }
    }

    // Night Time Fireflies (Kunang-Kunang)
    if (engine.townAtmosphere === 'night') {
      for (let i = 0; i < 22; i++) {
        engine.fireflies.push({
          x: Math.random() * totalW,
          y: Math.random() * totalH,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          size: 2,
          alpha: 0.4 + Math.random() * 0.5,
          color: '#d4ff59',
          type: 'firefly',
          sway: Math.random() * Math.PI * 2,
          swaySpeed: 0.03 + Math.random() * 0.04,
        });
      }
    }
  }

export function getActiveLampsHelper(engine: TownEngine): Lamp[] {
    const allBuildings = townConfig.getBuildings(true);
    if (allBuildings.length > 0) {
      const lamps: Lamp[] = [];
      const buildings = townConfig.getBuildings();
      for (const b of buildings) {
        if (b.hidden) continue;
        if (b.kind === 'lamp') {
          if (b.subType === 'stone_lantern') {
            lamps.push({ x: b.x, y: b.y, radius: 44, color: 'amber' });
          } else if (b.subType === 'lamp_cyber') {
            lamps.push({ x: b.x, y: b.y, radius: 52, color: 'cyan' });
          } else {
            lamps.push({ x: b.x, y: b.y, radius: 48, color: 'warm' });
          }
        } else if (b.kind === 'object') {
          if (b.subType === 'holo_projector' || b.id.startsWith('holo_projector')) {
            lamps.push({ x: b.x, y: b.y, radius: 40, color: 'cyan' });
          } else if (b.subType === 'pokestop' || b.id.startsWith('pokestop')) {
            lamps.push({ x: b.x, y: b.y, radius: 42, color: 'cyan' });
          } else if (b.subType === 'server_rack' || b.id.startsWith('server_rack')) {
            lamps.push({ x: b.x, y: b.y, radius: 34, color: 'cyan' });
          } else if (b.subType === 'pc_terminal' || b.id.startsWith('pc_terminal')) {
            lamps.push({ x: b.x, y: b.y, radius: 36, color: 'cyan' });
          } else if (b.subType === 'egg_incubator' || b.id.startsWith('egg_incubator')) {
            lamps.push({ x: b.x, y: b.y, radius: 36, color: 'gold' });
          } else if (b.subType === 'jukebox' || b.id.startsWith('jukebox')) {
            lamps.push({ x: b.x, y: b.y, radius: 40, color: 'magenta' });
          } else if (b.subType === 'ancient_pillar' || b.id.startsWith('ancient_pillar')) {
            lamps.push({ x: b.x + 0.5, y: b.y + 1, radius: 42, color: 'gold' });
          } else if (b.subType === 'volcanic_vent' || b.id.startsWith('volcanic_vent')) {
            lamps.push({ x: b.x + 0.5, y: b.y + 0.5, radius: 44, color: 'amber' });
          } else if (b.subType === 'alloy_beacon' || b.id.startsWith('alloy_beacon')) {
            lamps.push({ x: b.x + 0.5, y: b.y + 0.5, radius: 44, color: 'cyan' });
          } else if (b.subType === 'frost_shrine' || b.id.startsWith('frost_shrine')) {
            lamps.push({ x: b.x + 1, y: b.y + 1, radius: 48, color: 'cyan' });
          } else if (b.subType === 'campfire' || b.id === 'campfire') {
            lamps.push({ x: b.x + 0.5, y: b.y + 0.5, radius: 52, color: 'amber' });
          } else if (b.subType === 'mushroom_patch' || b.id.startsWith('mushroom_patch')) {
            lamps.push({ x: b.x + 0.5, y: b.y + 0.5, radius: 34, color: 'cyan' });
          } else if (b.subType === 'crystal_cluster' || b.id.startsWith('crystal_cluster')) {
            lamps.push({ x: b.x + 0.5, y: b.y + 0.5, radius: 40, color: 'cyan' });
          } else if (b.subType === 'natural_spring' || b.id.startsWith('natural_spring')) {
            lamps.push({ x: b.x + 1, y: b.y + 1, radius: 38, color: 'cyan' });
          }
        } else if (b.kind === 'tree') {
          if (b.subType === 'tree_golden' || b.id.startsWith('tree_golden')) {
            lamps.push({ x: b.x + 1, y: b.y + 1, radius: 46, color: 'gold' });
          }
        }
      }
      if (
        engine.currentScene === 'digimon' ||
        engine.currentScene === 'kingdom' ||
        engine.currentScene === 'harbour' ||
        engine.currentScene === 'sky-castle' ||
        engine.currentScene === 'dark-castle'
      ) {
        return [...engine.map.lamps, ...lamps];
      }
      return lamps;
    }
    return engine.map.lamps;
  }

export function renderPortalPulseOverlayHelper(engine: TownEngine, ctx: CanvasRenderingContext2D, startTileX: number, startTileY: number): void {
    const cx = (startTileX + 1.5) * TILE_SIZE;
    const cy = (startTileY + 1) * TILE_SIZE;
    const phase = (engine.tick * 0.045) % 1;
    const wave = 0.5 + 0.5 * Math.sin(engine.tick * 0.08);

    ctx.save();
    // Pulsing expanding cyan energy wave
    ctx.strokeStyle = `rgba(0, 240, 255, ${(1 - phase) * 0.65})`;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.ellipse(cx, cy, 8 + phase * 12, 5 + phase * 8, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Soft golden core shimmer
    ctx.fillStyle = `rgba(251, 191, 36, ${0.18 + wave * 0.22})`;
    ctx.beginPath();
    ctx.ellipse(cx, cy, 7, 4.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Pylon beacon pulse
    const px = startTileX * TILE_SIZE;
    const py = startTileY * TILE_SIZE;
    ctx.fillStyle = `rgba(103, 232, 249, ${0.35 + wave * 0.55})`;
    ctx.fillRect(px - 2, py + 4, 4, 2);
    ctx.fillRect(px + 46, py + 4, 4, 2);
    ctx.restore();
  }

export function renderNightBuildingWindowsHelper(ctx: CanvasRenderingContext2D): void {
    const buildings = townConfig.getBuildings();
    ctx.save();
    for (const b of buildings) {
      if (b.hidden) continue;
      const bx = b.x * TILE_SIZE;
      const by = b.y * TILE_SIZE;
      const bw = b.w * TILE_SIZE;

      // Render soft glowing warm windows on major buildings
      const bType = b.subType || b.id;
      if (['house', 'home', 'villa', 'dev', 'lab', 'reception', 'shop', 'mart', 'tower', 'office', 'arcade'].includes(bType)) {
        ctx.fillStyle = 'rgba(253, 230, 138, 0.72)';
        ctx.shadowColor = 'rgba(251, 191, 36, 0.85)';
        ctx.shadowBlur = 6;

        if (bType === 'house' || bType === 'home' || bType === 'villa') {
          ctx.fillRect(bx + 8, by + 18, 10, 8);
          ctx.fillRect(bx + bw - 18, by + 18, 10, 8);
        } else if (bType === 'dev' || bType === 'lab') {
          ctx.fillRect(bx + 10, by + 16, 12, 10);
          ctx.fillRect(bx + bw - 22, by + 16, 12, 10);
          ctx.fillRect(bx + Math.floor(bw / 2) - 6, by + 16, 12, 10);
        } else if (bType === 'reception') {
          ctx.fillRect(bx + 12, by + 20, 14, 12);
          ctx.fillRect(bx + bw - 26, by + 20, 14, 12);
        } else if (bType === 'shop' || bType === 'mart') {
          ctx.fillRect(bx + 10, by + 20, 16, 10);
        } else if (bType === 'arcade') {
          ctx.fillStyle = 'rgba(167, 139, 250, 0.75)';
          ctx.shadowColor = 'rgba(192, 132, 252, 0.9)';
          ctx.fillRect(bx + 10, by + 18, 12, 10);
          ctx.fillRect(bx + bw - 22, by + 18, 12, 10);
        } else if (bType === 'tower' || bType === 'office') {
          ctx.fillStyle = 'rgba(56, 189, 248, 0.75)';
          ctx.shadowColor = 'rgba(14, 165, 233, 0.9)';
          ctx.fillRect(bx + 12, by + 14, 10, 8);
          ctx.fillRect(bx + bw - 22, by + 14, 10, 8);
          ctx.fillRect(bx + 12, by + 30, 10, 8);
          ctx.fillRect(bx + bw - 22, by + 30, 10, 8);
        }
      }
    }
    ctx.restore();
  }

export function renderWeatherParticlesHelper(engine: TownEngine, ctx: CanvasRenderingContext2D): void {
    ctx.save();
    for (const p of engine.particles) {
      if (p.type === 'petal') {
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        const px = Math.floor(p.x);
        const py = Math.floor(p.y);
        ctx.fillRect(px, py, p.size, p.size);
        ctx.fillRect(px + 1, py + 1, Math.max(1, p.size - 0.5), Math.max(1, p.size - 0.5));
      } else if (p.type === 'leaf') {
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fillRect(Math.floor(p.x), Math.floor(p.y), p.size, p.size);
      } else if (p.type === 'raindrop') {
        ctx.strokeStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x + (p.vx * (p.len || 8)) / 10, p.y + (p.vy * (p.len || 8)) / 10);
        ctx.stroke();
      } else if (p.type === 'ripple') {
        ctx.strokeStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.ellipse(p.x, p.y, p.size * 1.5, p.size * 0.7, 0, 0, Math.PI * 2);
        ctx.stroke();
      } else if (p.type === 'star') {
        const pulse = 0.3 + 0.7 * Math.abs(Math.sin(engine.tick * (p.swaySpeed || 0.04) + (p.sway || 0)));
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha * pulse;
        const px = Math.floor(p.x);
        const py = Math.floor(p.y);
        ctx.fillRect(px, py, p.size, p.size);
        // Twinkling sparkle cross
        ctx.fillRect(px - 1, py, 1, 1);
        ctx.fillRect(px + p.size, py, 1, 1);
        ctx.fillRect(px, py - 1, 1, 1);
        ctx.fillRect(px, py + p.size, 1, 1);
      } else if (p.type === 'meteor') {
        ctx.save();
        ctx.globalAlpha = p.alpha;
        const grad = ctx.createLinearGradient(p.x, p.y, p.x - p.vx * 3.5, p.y - p.vy * 3.5);
        grad.addColorStop(0, '#ffffff');
        grad.addColorStop(0.3, '#fef08a');
        grad.addColorStop(1, 'rgba(56, 189, 248, 0)');
        ctx.strokeStyle = grad;
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x - p.vx * 3.5, p.y - p.vy * 3.5);
        ctx.stroke();
        ctx.restore();
      }
    }

    // Fireflies at night
    if (engine.townAtmosphere === 'night') {
      for (const f of engine.fireflies) {
        const pulse = 0.25 + 0.75 * Math.abs(Math.sin(engine.tick * (f.swaySpeed || 0.03) + (f.sway || 0)));
        ctx.save();
        ctx.globalAlpha = f.alpha * pulse;
        ctx.fillStyle = f.color;
        ctx.shadowColor = '#d4ff59';
        ctx.shadowBlur = 8;
        const fx = Math.floor(f.x);
        const fy = Math.floor(f.y);
        ctx.beginPath();
        ctx.arc(fx, fy, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }
    ctx.restore();
  }
