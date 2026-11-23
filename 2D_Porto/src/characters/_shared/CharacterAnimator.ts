import { directionIndex } from './direction';
import type {
  ActionClip,
  CharacterFrame,
  CharacterSpriteSet,
  Direction8,
  DirectionalClip,
} from './types';

export interface DrawOptions {
  /** Target on-screen height in px (frames are scaled uniformly to this height). */
  height: number;
  /** Nearest-neighbour by default (pixel art). */
  smoothing?: boolean;
  flipX?: boolean;
}

/**
 * Small, engine-agnostic state machine:
 *   idle / walk  → directional clips (one strip per direction)
 *   actions      → one-shot or looping clips that temporarily override locomotion
 */
export class CharacterAnimator<A extends string = string> {
  private direction: Direction8 = 'S';
  private moving = false;
  private locomotionTime = 0;
  private action: { id: A; time: number; onDone?: () => void } | null = null;

  constructor(
    private readonly sprites: CharacterSpriteSet,
    private readonly idleClip: DirectionalClip,
    private readonly walkClip: DirectionalClip,
    private readonly actions: Record<A, ActionClip>
  ) {}

  getDirection(): Direction8 {
    return this.direction;
  }

  setDirection(dir: Direction8): void {
    this.direction = dir;
  }

  setMoving(moving: boolean): void {
    if (moving !== this.moving) {
      this.moving = moving;
      this.locomotionTime = 0;
    }
  }

  isMoving(): boolean {
    return this.moving;
  }

  playAction(id: A, onDone?: () => void): void {
    this.action = { id, time: 0, onDone };
  }

  stopAction(): void {
    this.action = null;
  }

  currentAction(): A | null {
    return this.action?.id ?? null;
  }

  /** Advance time in seconds. */
  update(dt: number): void {
    this.locomotionTime += dt;
    if (!this.action) return;
    this.action.time += dt;
    const clip = this.actions[this.action.id];
    if (!clip.loop && this.action.time >= clip.frames.length / clip.fps) {
      const done = this.action.onDone;
      this.action = null;
      done?.();
    }
  }

  currentFrame(): CharacterFrame | null {
    const groups = this.sprites.groups;
    if (this.action) {
      const clip = this.actions[this.action.id];
      const raw = Math.floor(this.action.time * clip.fps);
      const step = clip.loop ? raw % clip.frames.length : Math.min(raw, clip.frames.length - 1);
      return groups[clip.group]?.[clip.frames[step]] ?? null;
    }
    const clip = this.moving ? this.walkClip : this.idleClip;
    const dirIdx = directionIndex(this.direction, this.sprites.directionOrder);
    const step = Math.floor(this.locomotionTime * clip.fps) % clip.framesPerDirection;
    return groups[clip.group]?.[dirIdx * clip.framesPerDirection + step] ?? null;
  }

  /** Draws the current frame with its feet at (x, footY). */
  draw(ctx: CanvasRenderingContext2D, x: number, footY: number, opts: DrawOptions): void {
    const frame = this.currentFrame();
    if (!frame) return;
    const scale = opts.height / frame.height;
    const w = Math.round(frame.width * scale);
    const h = Math.round(frame.height * scale);
    ctx.save();
    ctx.imageSmoothingEnabled = opts.smoothing ?? false;
    ctx.translate(Math.round(x), Math.round(footY));
    if (opts.flipX) ctx.scale(-1, 1);
    ctx.drawImage(frame.canvas, -Math.round(w / 2), -h, w, h);
    ctx.restore();
  }
}
