import { DIRS, type CharacterPalette, type Dir, type TownData, type TownMap, type Vec } from './types';
import { createTownMap } from './map';
import { TILE_SIZE, drawCharacter } from './sprites';
import { renderBuildings, renderGround, renderLamps, renderLighting, renderProps, renderSigns } from './tiles';
import { findPath } from './pathfinding';
import { sfx } from '../game/sfx';

export interface EngineCallbacks {
  onDialogue: (name: string, lines: string[], onAction?: () => void) => void;
  onBubble?: (title: string, text: string, action?: { label: string; href?: string; onClick?: () => void }) => void;
  onNavigate: (route: string) => void;
  onEncounter: () => void;
  onRefill: () => void;
  onOpenModal: (target: 'map' | 'dex') => void;
}

export class TownEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private map: TownMap;
  private callbacks: EngineCallbacks;

  // Player state
  private playerPos: Vec = { x: 18, y: 12 };
  private playerTarget: Vec = { x: 18, y: 12 };
  private playerDir: Dir = 'down';
  private isMoving = false;
  private moveProgress = 0; // 0 to 1 between tiles
  private stepCount = 0;
  private path: Vec[] = [];
  private pendingTarget: string | null = null;

  private playerPalette: CharacterPalette = {
    skin: '#e0b48a',
    hair: '#1c1726',
    shirt: '#e8473f',
    pants: '#1d2b53',
    shoes: '#1c1726',
    cap: '#e8473f',
  };

  // Rendering & Camera
  private zoom = 3;
  private cameraX = 0;
  private cameraY = 0;
  private tick = 0;
  private isAwake = false;
  private rafId: number | null = null;
  private lastTime = 0;

  // Cleanup handlers
  private unbindEvents: (() => void)[] = [];

  constructor(
    canvas: HTMLCanvasElement,
    townData: TownData,
    initialSpawn = 'town',
    callbacks: EngineCallbacks
  ) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get 2D context');
    this.ctx = ctx;
    this.callbacks = callbacks;
    this.map = createTownMap(townData);

    const spawn = this.map.spawns[initialSpawn] || this.map.spawns.town;
    this.playerPos = { x: spawn.x, y: spawn.y };
    this.playerTarget = { x: spawn.x, y: spawn.y };
    this.playerDir = spawn.dir;
    this.cameraX = (this.map.w * TILE_SIZE) / 2;
    this.cameraY = (this.map.h * TILE_SIZE) / 2;

    this.bindControls();
    this.handleResize();
    this.wake();
  }

  public destroy() {
    this.sleep();
    this.unbindEvents.forEach((u) => u());
    this.unbindEvents = [];
  }

  public handleResize = () => {
    const dpr = window.devicePixelRatio || 1;
    const rect = this.canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;

    // Calculate zoom to frame the town cleanly with forest perimeter
    const targetW = this.map.w * TILE_SIZE * 1.08;
    const targetH = this.map.h * TILE_SIZE * 1.08;
    const zoomW = this.canvas.width / targetW;
    const zoomH = this.canvas.height / targetH;
    this.zoom = Math.max(Math.min(zoomW, zoomH), 1.2 * dpr);

    this.updateDomLabels();
    this.wake();
  };

  // Energy-efficient sleep/wake loop
  public wake() {
    if (this.isAwake) return;
    this.isAwake = true;
    this.lastTime = performance.now();
    this.rafId = requestAnimationFrame(this.loop);
  }

  public sleep() {
    this.isAwake = false;
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  private loop = (time: number) => {
    if (!this.isAwake) return;
    const dt = Math.min((time - this.lastTime) / 1000, 0.1);
    this.lastTime = time;

    this.update(dt);
    this.render();

    // Check if we can sleep: idle, no active path
    if (!this.isMoving && this.path.length === 0) {
      this.sleep();
      return;
    }

    this.rafId = requestAnimationFrame(this.loop);
  };

  private bindControls() {
    const onKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'KeyW'].includes(e.code)) {
        e.preventDefault();
        this.queueMove('up');
      } else if (['ArrowDown', 'KeyS'].includes(e.code)) {
        e.preventDefault();
        this.queueMove('down');
      } else if (['ArrowLeft', 'KeyA'].includes(e.code)) {
        e.preventDefault();
        this.queueMove('left');
      } else if (['ArrowRight', 'KeyD'].includes(e.code)) {
        e.preventDefault();
        this.queueMove('right');
      } else if (e.code === 'Enter' || e.code === 'Space') {
        e.preventDefault();
        this.interactFacing();
      }
    };

    const onClick = (e: MouseEvent) => {
      const rect = this.canvas.getBoundingClientRect();
      const clickScreenX = (e.clientX - rect.left) * (this.canvas.width / rect.width);
      const clickScreenY = (e.clientY - rect.top) * (this.canvas.height / rect.height);

      // Convert screen coordinate to tile coordinate
      const worldX = (clickScreenX - this.canvas.width / 2) / this.zoom + this.cameraX;
      const worldY = (clickScreenY - this.canvas.height / 2) / this.zoom + this.cameraY;

      const targetTileX = Math.floor(worldX / TILE_SIZE);
      const targetTileY = Math.floor(worldY / TILE_SIZE);

      this.walkTo(targetTileX, targetTileY);
    };

    window.addEventListener('keydown', onKeyDown);
    this.canvas.addEventListener('click', onClick);
    window.addEventListener('resize', this.handleResize);

    this.unbindEvents.push(
      () => window.removeEventListener('keydown', onKeyDown),
      () => this.canvas.removeEventListener('click', onClick),
      () => window.removeEventListener('resize', this.handleResize)
    );
  }

  public walkTo(targetX: number, targetY: number) {
    if (targetX < 0 || targetX >= this.map.w || targetY < 0 || targetY >= this.map.h) return;
    const start = this.isMoving ? this.playerTarget : this.playerPos;
    const found = findPath(start, { x: targetX, y: targetY }, this.map.collision, this.map.w, this.map.h);
    if (found && found.length > 0) {
      this.path = found;
      this.wake();
    }
  }

  public walkToObject(id: string) {
    switch (id) {
      case 'home':
        this.pendingTarget = null;
        this.walkTo(8, 8);
        break;
      case 'dev':
        this.pendingTarget = null;
        this.walkTo(22, 8);
        break;
      case 'lab':
        this.pendingTarget = null;
        this.walkTo(8, 16);
        break;
      case 'arcade':
        this.pendingTarget = null;
        this.walkTo(23, 16);
        break;
      case 'depop':
        this.pendingTarget = 'depop';
        this.walkTo(7, 24);
        break;
      case 'statue':
        this.pendingTarget = 'statue';
        this.walkTo(14, 7);
        break;
      case 'twin':
        this.pendingTarget = 'twin';
        this.walkTo(13, 15);
        break;
      case 'lebron':
        this.pendingTarget = 'lebron';
        this.walkTo(16, 24);
        break;
      case 'linkedin':
        this.pendingTarget = 'linkedin';
        this.walkTo(23, 21);
        break;
      case 'resume':
        this.pendingTarget = 'resume';
        this.walkTo(27, 21);
        break;
      case 'github':
        this.pendingTarget = 'github';
        this.walkTo(23, 22);
        break;
      case 'email':
        this.pendingTarget = 'email';
        this.walkTo(27, 22);
        break;
    }
  }

  public queueMove(dir: Dir) {
    this.path = []; // cancel auto path
    this.pendingTarget = null;
    this.playerDir = dir;
    const next = {
      x: this.playerPos.x + DIRS[dir].x,
      y: this.playerPos.y + DIRS[dir].y,
    };

    if (this.canWalk(next.x, next.y)) {
      this.playerTarget = next;
      this.isMoving = true;
      this.moveProgress = 0;
      this.wake();
    } else {
      sfx.bump();
      this.wake();
    }
  }

  private canWalk(x: number, y: number): boolean {
    if (x < 0 || x >= this.map.w || y < 0 || y >= this.map.h) return false;
    return this.map.collision[y * this.map.w + x] === 0;
  }

  private update(dt: number) {
    this.tick++;

    if (this.isMoving) {
      const speed = 5.5; // tiles per second
      this.moveProgress += dt * speed;

      if (this.moveProgress >= 1) {
        this.playerPos = { ...this.playerTarget };
        this.isMoving = false;
        this.moveProgress = 0;
        this.stepCount++;
        sfx.step();

        // Check tile triggers
        this.onStepComplete();

        // Trigger interaction when reaching target
        if (this.path.length === 0 && this.pendingTarget) {
          const t = this.pendingTarget;
          this.pendingTarget = null;
          this.triggerPendingTarget(t);
        }
      }
    } else if (this.path.length > 0) {
      const nextStep = this.path.shift()!;
      const dx = nextStep.x - this.playerPos.x;
      const dy = nextStep.y - this.playerPos.y;

      if (dx === 1) this.playerDir = 'right';
      else if (dx === -1) this.playerDir = 'left';
      else if (dy === 1) this.playerDir = 'down';
      else if (dy === -1) this.playerDir = 'up';

      this.playerTarget = nextStep;
      this.isMoving = true;
      this.moveProgress = 0;
    }
  }

  private triggerPendingTarget(id: string) {
    switch (id) {
      case 'statue':
        this.playerDir = 'up';
        this.interactFacing();
        break;
      case 'twin':
        this.playerDir = 'up';
        this.interactFacing();
        break;
      case 'lebron':
        this.playerDir = 'down';
        this.interactFacing();
        break;
      case 'linkedin':
        this.playerDir = 'up';
        this.interactFacing();
        break;
      case 'resume':
        this.playerDir = 'up';
        this.interactFacing();
        break;
      case 'github':
        this.playerDir = 'down';
        this.interactFacing();
        break;
      case 'email':
        this.playerDir = 'down';
        this.interactFacing();
        break;
      case 'depop':
        this.playerDir = 'up';
        this.interactFacing();
        break;
    }
  }

  private onStepComplete() {
    const tileIdx = this.playerPos.y * this.map.w + this.playerPos.x;

    // 1. Door trigger
    const route = this.map.doors.get(tileIdx);
    if (route) {
      sfx.door();
      this.callbacks.onNavigate(route);
      return;
    }

    // 2. Tall grass encounter (15% chance per step in tall grass)
    if (this.map.ground[tileIdx] === 2) {
      if (Math.random() < 0.15) {
        sfx.encounter();
        this.callbacks.onEncounter();
        return;
      }
    }
  }

  public interactFacing() {
    const fx = this.playerPos.x + DIRS[this.playerDir].x;
    const fy = this.playerPos.y + DIRS[this.playerDir].y;

    // 1. Check NPC
    const npc = this.map.npcs.find((n) => n.x === fx && n.y === fy);
    if (npc) {
      sfx.select();
      if (this.callbacks.onBubble) {
        let action: { label: string; href?: string; onClick?: () => void } | undefined;
        if (npc.action) {
          if (npc.action.kind === 'navigate') {
            action = { label: 'Talk / Enter', href: npc.action.route };
          } else if (npc.action.kind === 'refill') {
            action = { label: 'Refill Poké Balls', onClick: () => this.callbacks.onRefill() };
          }
        }
        this.callbacks.onBubble(npc.name, npc.lines.join(' '), action);
      } else {
        let onAction: (() => void) | undefined;
        if (npc.action) {
          if (npc.action.kind === 'navigate') {
            const r = npc.action.route;
            onAction = () => this.callbacks.onNavigate(r);
          } else if (npc.action.kind === 'refill') {
            onAction = () => this.callbacks.onRefill();
          }
        }
        this.callbacks.onDialogue(npc.name, npc.lines, onAction);
      }
      this.wake();
      return;
    }

    // 2. Check Sign
    const sign = this.map.signs.find((s) => s.x === fx && s.y === fy);
    if (sign) {
      sfx.select();
      if (this.callbacks.onBubble) {
        let action: { label: string; href?: string; onClick?: () => void } | undefined;
        if (sign.action) {
          if (sign.action.kind === 'navigate') {
            action = { label: `Open ${sign.name}`, href: sign.action.route };
          } else if (sign.action.kind === 'open') {
            const t = sign.action.target;
            action = { label: `Open ${sign.name}`, onClick: () => this.callbacks.onOpenModal(t) };
          }
        }
        this.callbacks.onBubble(sign.name, sign.lines.join(' '), action);
      } else {
        let onAction: (() => void) | undefined;
        if (sign.action) {
          if (sign.action.kind === 'navigate') {
            const r = sign.action.route;
            onAction = () => this.callbacks.onNavigate(r);
          } else if (sign.action.kind === 'open') {
            const t = sign.action.target;
            onAction = () => this.callbacks.onOpenModal(t);
          }
        }
        this.callbacks.onDialogue(sign.name, sign.lines, onAction);
      }
      this.wake();
      return;
    }

    // 3. Check Prop (Statue)
    const prop = this.map.props.find((p) => (p.x === fx || p.x + 1 === fx) && (p.y === fy || p.y + 1 === fy));
    if (prop) {
      sfx.select();
      if (this.callbacks.onBubble) {
        this.callbacks.onBubble(prop.name, prop.lines.join(' '));
      } else {
        this.callbacks.onDialogue(prop.name, prop.lines);
      }
      this.wake();
      return;
    }

    // 4. Check Shop (Depop stall)
    const shop = this.map.buildings.find((b) => b.id === 'shop' && fx >= b.x && fx < b.x + b.w && fy >= b.y && fy < b.y + b.h);
    if (shop) {
      sfx.select();
      if (this.callbacks.onBubble) {
        this.callbacks.onBubble('Depop & Store', "Visit Muhammad Zulfan's verified classic web portfolio and showcases.", {
          label: 'Visit Portfolio',
          href: 'https://zulfan15.github.io/MZulfan',
        });
      } else {
        this.callbacks.onDialogue('Depop & Store', ["Visit Muhammad Zulfan's verified classic web portfolio and showcases."], () => {
          window.open('https://zulfan15.github.io/MZulfan', '_blank');
        });
      }
      this.wake();
      return;
    }
  }

  public updateDomLabels() {
    const container = document.querySelector('[data-town-labels]');
    if (!container) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = this.canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    const labelDefs: Record<string, { x: number; y: number; w: number; h: number; kind: string; lift?: number }> = {
      home: { x: 4, y: 3, w: 8, h: 6, kind: 'building', lift: 0 },
      statue: { x: 14, y: 6, w: 2, h: 2, kind: 'statue', lift: 0 },
      dev: { x: 18, y: 3, w: 11, h: 6, kind: 'building', lift: 0 },
      lab: { x: 4, y: 12, w: 8, h: 5, kind: 'building', lift: 0 },
      arcade: { x: 19, y: 12, w: 9, h: 5, kind: 'building', lift: 0 },
      twin: { x: 13, y: 14, w: 1, h: 1, kind: 'npc' },
      depop: { x: 4, y: 20, w: 7, h: 4, kind: 'stall', lift: 0 },
      lebron: { x: 16, y: 25, w: 1, h: 1, kind: 'npc' },
      linkedin: { x: 23, y: 20, w: 1, h: 1, kind: 'board' },
      resume: { x: 27, y: 20, w: 1, h: 1, kind: 'resume' },
      github: { x: 23, y: 23, w: 1, h: 1, kind: 'signpost' },
      email: { x: 27, y: 23, w: 1, h: 1, kind: 'mailbox' },
    };

    const buttons = container.querySelectorAll<HTMLButtonElement>('.town-label');
    buttons.forEach((btn) => {
      const id = btn.getAttribute('data-id');
      if (!id || !labelDefs[id]) return;

      const obj = labelDefs[id];
      const worldX = (obj.x + obj.w / 2) * TILE_SIZE;
      const worldY = (obj.y - (obj.lift ?? 0)) * TILE_SIZE;

      const canvasX = this.canvas.width / 2 + (worldX - this.cameraX) * this.zoom;
      const canvasY = this.canvas.height / 2 + (worldY - this.cameraY) * this.zoom;

      const cssX = canvasX / dpr;
      let cssY = canvasY / dpr;

      if (obj.kind === 'npc') {
        cssY -= 12;
      } else if (obj.kind === 'statue') {
        cssY -= 4;
      } else {
        cssY -= 2;
      }

      const visible = cssX > -60 && cssX < rect.width + 60 && cssY > -40 && cssY < rect.height + 40;
      btn.style.transform = `translate(${Math.round(cssX)}px, ${Math.round(cssY)}px) translate(-50%, -100%)`;
      btn.style.visibility = visible ? 'visible' : 'hidden';
    });
  }

  private render() {
    const ctx = this.ctx;
    ctx.imageSmoothingEnabled = false;

    // Center camera on the town frame
    this.cameraX = (this.map.w * TILE_SIZE) / 2;
    this.cameraY = (this.map.h * TILE_SIZE) / 2;

    ctx.save();
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Dark forest surround background
    ctx.fillStyle = '#162e1d';
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Apply zoom & center camera
    ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
    ctx.scale(this.zoom, this.zoom);
    ctx.translate(-this.cameraX, -this.cameraY);

    const viewW = this.canvas.width / this.zoom;
    const viewH = this.canvas.height / this.zoom;
    const viewX = this.cameraX - viewW / 2;
    const viewY = this.cameraY - viewH / 2;

    // 1. Terrain
    renderGround(ctx, this.map, this.tick, viewX, viewY, viewW, viewH);

    // 2. Warm Street Lamp Glows on Ground
    renderLighting(ctx, this.map.lamps);

    // 3. Props (Statue / Pedestal)
    renderProps(ctx, this.map.props);

    // 4. Street Lamp Posts
    renderLamps(ctx, this.map.lamps);

    // 5. Signs (LinkedIn, Résumé, GitHub, Email)
    renderSigns(ctx, this.map.signs);

    // 6. Buildings with glowing windows, balconies, awnings
    renderBuildings(ctx, this.map.buildings);

    // 7. NPCs
    for (const npc of this.map.npcs) {
      drawCharacter(
        ctx,
        npc.palette,
        npc.dir,
        0,
        npc.x * TILE_SIZE,
        npc.y * TILE_SIZE,
        1
      );

      // Floating speech bubble if twin
      if (npc.id === 'twin') {
        const bx = npc.x * TILE_SIZE + 22;
        const by = npc.y * TILE_SIZE - 6;
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

    // 8. Player
    const drawX =
      (this.playerPos.x + (this.playerTarget.x - this.playerPos.x) * this.moveProgress) * TILE_SIZE;
    const drawY =
      (this.playerPos.y + (this.playerTarget.y - this.playerPos.y) * this.moveProgress) * TILE_SIZE;
    const stepFrame = this.isMoving ? Math.floor(this.moveProgress * 4) : 0;

    drawCharacter(ctx, this.playerPalette, this.playerDir, stepFrame, drawX, drawY, 1);

    ctx.restore();

    // Position HTML DOM labels
    this.updateDomLabels();
  }
}
