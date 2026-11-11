/**
 * Pokémon Mystery Dungeon (PMD) 8-Direction Animated Sprite Controller.
 * Supports Walk, Idle, and Attack/Shoot sprite sheets with precise PMD frame timings.
 */

export type PMDAction = 'idle' | 'walk' | 'shoot' | 'attack' | 'rearUp';

export interface PMDAnimSpec {
  src: string;
  frameWidth: number;
  frameHeight: number;
  frameCount: number;
  durations: number[];
  anchorX: number;
  anchorY: number;
}

export interface PMDPokemonConfig {
  id: string;
  name: string;
  scale: number;
  idle: PMDAnimSpec;
  walk: PMDAnimSpec;
  shoot?: PMDAnimSpec;
  attack?: PMDAnimSpec;
  rearUp?: PMDAnimSpec;
}

export const PMD_POKEMON_CONFIGS: Record<string, PMDPokemonConfig> = {
  rayquaza: {
    id: 'rayquaza',
    name: 'Rayquaza',
    scale: 0.6,
    idle: {
      src: '/assets/pokemon/rayquaza/Idle-Anim.png',
      frameWidth: 80,
      frameHeight: 120,
      frameCount: 4,
      durations: [14, 10, 14, 10],
      anchorX: 40,
      anchorY: 65,
    },
    walk: {
      src: '/assets/pokemon/rayquaza/Walk-Anim.png',
      frameWidth: 80,
      frameHeight: 128,
      frameCount: 12,
      durations: [8, 8, 6, 4, 4, 4, 8, 8, 6, 6, 6, 6],
      anchorX: 40,
      anchorY: 65,
    },
    shoot: {
      src: '/assets/pokemon/rayquaza/Shoot-Anim.png',
      frameWidth: 112,
      frameHeight: 120,
      frameCount: 11,
      durations: [2, 6, 2, 2, 2, 2, 2, 2, 2, 2, 2],
      anchorX: 56,
      anchorY: 65,
    },
    rearUp: {
      src: '/assets/pokemon/rayquaza/RearUp-Anim.png',
      frameWidth: 80,
      frameHeight: 144,
      frameCount: 13,
      durations: [2, 2, 6, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
      anchorX: 40,
      anchorY: 65,
    },
  },
  arceus: {
    id: 'arceus',
    name: 'Arceus',
    scale: 0.88,
    idle: {
      src: '/assets/pokemon/arceus/Idle-Anim.png',
      frameWidth: 48,
      frameHeight: 88,
      frameCount: 6,
      durations: [12, 12, 12, 12, 12, 12],
      anchorX: 24,
      anchorY: 48,
    },
    walk: {
      src: '/assets/pokemon/arceus/Walk-Anim.png',
      frameWidth: 48,
      frameHeight: 88,
      frameCount: 8,
      durations: [8, 10, 8, 10, 8, 10, 8, 10],
      anchorX: 24,
      anchorY: 48,
    },
    shoot: {
      src: '/assets/pokemon/arceus/SpAttack-Anim.png',
      frameWidth: 56,
      frameHeight: 128,
      frameCount: 11,
      durations: [2, 4, 2, 4, 8, 3, 3, 3, 3, 6, 4],
      anchorX: 28,
      anchorY: 65,
    },
  },
  reshiram: {
    id: 'reshiram',
    name: 'Reshiram',
    scale: 0.65,
    idle: {
      src: '/assets/pokemon/reshiram/Idle-Anim.png',
      frameWidth: 72,
      frameHeight: 104,
      frameCount: 6,
      durations: [90, 4, 8, 4, 8, 4],
      anchorX: 36,
      anchorY: 56,
    },
    walk: {
      src: '/assets/pokemon/reshiram/Walk-Anim.png',
      frameWidth: 88,
      frameHeight: 96,
      frameCount: 5,
      durations: [8, 6, 8, 6, 8],
      anchorX: 44,
      anchorY: 52,
    },
    shoot: {
      src: '/assets/pokemon/reshiram/Shoot-Anim.png',
      frameWidth: 96,
      frameHeight: 80,
      frameCount: 16,
      durations: [2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2],
      anchorX: 48,
      anchorY: 44,
    },
  },
  zekrom: {
    id: 'zekrom',
    name: 'Zekrom',
    scale: 0.68,
    idle: {
      src: '/assets/pokemon/zekrom/Idle-Anim.png',
      frameWidth: 72,
      frameHeight: 96,
      frameCount: 14,
      durations: [60, 10, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 10],
      anchorX: 36,
      anchorY: 52,
    },
    walk: {
      src: '/assets/pokemon/zekrom/Walk-Anim.png',
      frameWidth: 72,
      frameHeight: 104,
      frameCount: 6,
      durations: [10, 10, 15, 20, 10, 15],
      anchorX: 36,
      anchorY: 55,
    },
    shoot: {
      src: '/assets/pokemon/zekrom/Shoot-Anim.png',
      frameWidth: 96,
      frameHeight: 88,
      frameCount: 15,
      durations: [2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2],
      anchorX: 48,
      anchorY: 48,
    },
    attack: {
      src: '/assets/pokemon/zekrom/Attack-Anim.png',
      frameWidth: 88,
      frameHeight: 136,
      frameCount: 15,
      durations: [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
      anchorX: 44,
      anchorY: 71,
    },
  },
  giratina: {
    id: 'giratina',
    name: 'Giratina',
    scale: 0.82,
    idle: {
      src: '/assets/pokemon/giratina/Idle-Anim.png',
      frameWidth: 56,
      frameHeight: 80,
      frameCount: 2,
      durations: [60, 40],
      anchorX: 28,
      anchorY: 44,
    },
    walk: {
      src: '/assets/pokemon/giratina/Walk-Anim.png',
      frameWidth: 64,
      frameHeight: 80,
      frameCount: 4,
      durations: [12, 12, 12, 12],
      anchorX: 32,
      anchorY: 44,
    },
    shoot: {
      src: '/assets/pokemon/giratina/Shoot-Anim.png',
      frameWidth: 72,
      frameHeight: 88,
      frameCount: 12,
      durations: [2, 2, 6, 1, 2, 2, 2, 2, 2, 2, 2, 2],
      anchorX: 36,
      anchorY: 47,
    },
    attack: {
      src: '/assets/pokemon/giratina/Attack-Anim.png',
      frameWidth: 72,
      frameHeight: 96,
      frameCount: 14,
      durations: [2, 2, 6, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2],
      anchorX: 36,
      anchorY: 50,
    },
  },
  palkia: {
    id: 'palkia',
    name: 'Palkia',
    scale: 0.66,
    idle: {
      src: '/assets/pokemon/palkia/Idle-Anim.png',
      frameWidth: 72,
      frameHeight: 104,
      frameCount: 2,
      durations: [40, 30],
      anchorX: 36,
      anchorY: 58,
    },
    walk: {
      src: '/assets/pokemon/palkia/Walk-Anim.png',
      frameWidth: 80,
      frameHeight: 104,
      frameCount: 4,
      durations: [8, 12, 8, 12],
      anchorX: 40,
      anchorY: 58,
    },
    shoot: {
      src: '/assets/pokemon/palkia/Shoot-Anim.png',
      frameWidth: 104,
      frameHeight: 152,
      frameCount: 15,
      durations: [2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2],
      anchorX: 52,
      anchorY: 88,
    },
    attack: {
      src: '/assets/pokemon/palkia/Attack-Anim.png',
      frameWidth: 104,
      frameHeight: 160,
      frameCount: 15,
      durations: [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
      anchorX: 52,
      anchorY: 90,
    },
  },
  dialga: {
    id: 'dialga',
    name: 'Dialga',
    scale: 0.65,
    idle: {
      src: '/assets/pokemon/dialga/Idle-Anim.png',
      frameWidth: 72,
      frameHeight: 104,
      frameCount: 2,
      durations: [80, 45],
      anchorX: 36,
      anchorY: 66,
    },
    walk: {
      src: '/assets/pokemon/dialga/Walk-Anim.png',
      frameWidth: 72,
      frameHeight: 104,
      frameCount: 4,
      durations: [12, 14, 12, 14],
      anchorX: 36,
      anchorY: 66,
    },
    shoot: {
      src: '/assets/pokemon/dialga/Shoot-Anim.png',
      frameWidth: 72,
      frameHeight: 120,
      frameCount: 12,
      durations: [1, 2, 8, 1, 2, 2, 2, 2, 2, 2, 2, 2],
      anchorX: 36,
      anchorY: 73,
    },
    attack: {
      src: '/assets/pokemon/dialga/Attack-Anim.png',
      frameWidth: 96,
      frameHeight: 128,
      frameCount: 14,
      durations: [2, 2, 6, 1, 1, 1, 2, 2, 2, 2, 2, 2, 1, 2],
      anchorX: 48,
      anchorY: 76,
    },
  },
};

export class PokemonPMDAnimator {
  private images: Map<string, HTMLImageElement> = new Map();

  constructor() {
    if (typeof window !== 'undefined') {
      this.preloadAll();
    }
  }

  private preloadAll() {
    for (const [, cfg] of Object.entries(PMD_POKEMON_CONFIGS)) {
      this.loadImage(cfg.idle.src);
      this.loadImage(cfg.walk.src);
      if (cfg.shoot) this.loadImage(cfg.shoot.src);
      if (cfg.attack) this.loadImage(cfg.attack.src);
      if (cfg.rearUp) this.loadImage(cfg.rearUp.src);
    }
  }

  private loadImage(src: string): HTMLImageElement {
    const existing = this.images.get(src);
    if (existing) return existing;
    const img = new Image();
    img.src = src;
    this.images.set(src, img);
    return img;
  }

  public isSupported(pokemonId: string): boolean {
    const cleanId = pokemonId.toLowerCase().replace(/[^a-z]/g, '');
    return Object.keys(PMD_POKEMON_CONFIGS).some((k) => cleanId.includes(k));
  }

  public getConfig(pokemonId: string): PMDPokemonConfig | undefined {
    const cleanId = pokemonId.toLowerCase().replace(/[^a-z]/g, '');
    const matchedKey = Object.keys(PMD_POKEMON_CONFIGS).find((k) => cleanId.includes(k));
    return matchedKey ? PMD_POKEMON_CONFIGS[matchedKey] : undefined;
  }

  /**
   * Map cardinal / standard game directions to PMD 8-direction rows:
   * 0: South (Down)
   * 1: South-East
   * 2: East (Right)
   * 3: North-East
   * 4: North (Up)
   * 5: North-West
   * 6: West (Left)
   * 7: South-West
   */
  public getDirectionRow(dir: string): number {
    const d = dir.toLowerCase().trim();
    switch (d) {
      case 'down':
      case 's':
      case 'south':
        return 0;
      case 'se':
      case 'south-east':
      case 'southeast':
      case 'down-right':
        return 1;
      case 'right':
      case 'e':
      case 'east':
        return 2;
      case 'ne':
      case 'north-east':
      case 'northeast':
      case 'up-right':
        return 3;
      case 'up':
      case 'n':
      case 'north':
        return 4;
      case 'nw':
      case 'north-west':
      case 'northwest':
      case 'up-left':
        return 5;
      case 'left':
      case 'w':
      case 'west':
        return 6;
      case 'sw':
      case 'south-west':
      case 'southwest':
      case 'down-left':
        return 7;
      default:
        return 0;
    }
  }

  public getFrameIndex(tick: number, durations: number[]): number {
    const total = durations.reduce((a, b) => a + b, 0);
    if (total <= 0) return 0;
    let t = Math.floor(Math.abs(tick)) % total;
    for (let i = 0; i < durations.length; i++) {
      if (t < durations[i]) return i;
      t -= durations[i];
    }
    return 0;
  }

  /**
   * Render PMD animated Pokémon on Canvas.
   * Returns true if successfully drawn, false if image is not loaded yet.
   */
  public draw(
    ctx: CanvasRenderingContext2D,
    pokemonId: string,
    action: PMDAction,
    dir: string,
    coreX: number,
    coreY: number,
    tick: number
  ): boolean {
    const cfg = this.getConfig(pokemonId);
    if (!cfg) return false;

    let spec: PMDAnimSpec | undefined = cfg.idle;
    if (action === 'walk') spec = cfg.walk;
    else if (action === 'shoot' && cfg.shoot) spec = cfg.shoot;
    else if (action === 'attack' && (cfg.attack || cfg.shoot || cfg.rearUp)) spec = cfg.attack || cfg.shoot || cfg.rearUp;
    else if (action === 'rearUp' && cfg.rearUp) spec = cfg.rearUp;

    if (!spec) spec = cfg.idle;

    const img = this.loadImage(spec.src);
    if (!img.complete || img.naturalWidth === 0) return false;

    const dirRow = this.getDirectionRow(dir);
    const frameIndex = this.getFrameIndex(tick, spec.durations);

    const sx = frameIndex * spec.frameWidth;
    const sy = dirRow * spec.frameHeight;
    const sw = spec.frameWidth;
    const sh = spec.frameHeight;

    const destW = spec.frameWidth * cfg.scale;
    const destH = spec.frameHeight * cfg.scale;
    const destX = coreX - spec.anchorX * cfg.scale;
    const destY = coreY - spec.anchorY * cfg.scale;

    ctx.drawImage(
      img,
      sx,
      sy,
      sw,
      sh,
      Math.round(destX),
      Math.round(destY),
      Math.round(destW),
      Math.round(destH)
    );
    return true;
  }
}

