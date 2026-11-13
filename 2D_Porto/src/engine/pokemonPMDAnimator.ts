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
  lunala: {
    id: 'lunala',
    name: 'Lunala',
    scale: 0.65,
    idle: {
      src: '/assets/pokemon/lunala/Idle-Anim.png',
      frameWidth: 80,
      frameHeight: 96,
      frameCount: 4,
      durations: [12, 14, 12, 14],
      anchorX: 40,
      anchorY: 54,
    },
    walk: {
      src: '/assets/pokemon/lunala/Walk-Anim.png',
      frameWidth: 80,
      frameHeight: 104,
      frameCount: 4,
      durations: [8, 12, 8, 12],
      anchorX: 40,
      anchorY: 58,
    },
    shoot: {
      src: '/assets/pokemon/lunala/Shoot-Anim.png',
      frameWidth: 80,
      frameHeight: 136,
      frameCount: 11,
      durations: [2, 6, 1, 2, 2, 2, 2, 2, 2, 2, 2],
      anchorX: 40,
      anchorY: 72,
    },
    attack: {
      src: '/assets/pokemon/lunala/Attack-Anim.png',
      frameWidth: 104,
      frameHeight: 136,
      frameCount: 10,
      durations: [2, 4, 1, 1, 1, 2, 2, 2, 2, 2],
      anchorX: 52,
      anchorY: 73,
    },
  },
  solgaleo: {
    id: 'solgaleo',
    name: 'Solgaleo',
    scale: 0.85,
    idle: {
      src: '/assets/pokemon/solgaleo/Idle-Anim.png',
      frameWidth: 48,
      frameHeight: 72,
      frameCount: 8,
      durations: [60, 6, 6, 6, 6, 6, 6, 12],
      anchorX: 24,
      anchorY: 40,
    },
    walk: {
      src: '/assets/pokemon/solgaleo/Walk-Anim.png',
      frameWidth: 48,
      frameHeight: 72,
      frameCount: 4,
      durations: [10, 10, 10, 10],
      anchorX: 24,
      anchorY: 40,
    },
    shoot: {
      src: '/assets/pokemon/solgaleo/Swing-Anim.png',
      frameWidth: 96,
      frameHeight: 120,
      frameCount: 9,
      durations: [2, 1, 2, 2, 3, 2, 2, 1, 1],
      anchorX: 48,
      anchorY: 64,
    },
    attack: {
      src: '/assets/pokemon/solgaleo/Attack-Anim.png',
      frameWidth: 80,
      frameHeight: 112,
      frameCount: 14,
      durations: [2, 2, 6, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2],
      anchorX: 40,
      anchorY: 60,
    },
  },
  garchomp: {
    id: 'garchomp',
    name: 'Garchomp',
    scale: 1.3,
    idle: {
      src: '/assets/pokemon/garchomp/Idle-Anim.png',
      frameWidth: 48,
      frameHeight: 56,
      frameCount: 6,
      durations: [40, 2, 12, 10, 12, 2],
      anchorX: 24,
      anchorY: 32,
    },
    walk: {
      src: '/assets/pokemon/garchomp/Walk-Anim.png',
      frameWidth: 40,
      frameHeight: 48,
      frameCount: 4,
      durations: [10, 10, 10, 10],
      anchorX: 20,
      anchorY: 28,
    },
    shoot: {
      src: '/assets/pokemon/garchomp/Shoot-Anim.png',
      frameWidth: 56,
      frameHeight: 64,
      frameCount: 17,
      durations: [1, 2, 4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
      anchorX: 28,
      anchorY: 36,
    },
    attack: {
      src: '/assets/pokemon/garchomp/Attack-Anim.png',
      frameWidth: 72,
      frameHeight: 80,
      frameCount: 14,
      durations: [2, 2, 6, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2],
      anchorX: 36,
      anchorY: 42,
    },
    rearUp: {
      src: '/assets/pokemon/garchomp/RearUp-Anim.png',
      frameWidth: 40,
      frameHeight: 64,
      frameCount: 18,
      durations: [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
      anchorX: 20,
      anchorY: 38,
    },
  },
  groudon: {
    id: 'groudon',
    name: 'Groudon',
    scale: 0.72,
    idle: {
      src: '/assets/pokemon/groudon/Idle-Anim.png',
      frameWidth: 64,
      frameHeight: 80,
      frameCount: 14,
      durations: [60, 10, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 10],
      anchorX: 32,
      anchorY: 44,
    },
    walk: {
      src: '/assets/pokemon/groudon/Walk-Anim.png',
      frameWidth: 64,
      frameHeight: 88,
      frameCount: 4,
      durations: [10, 12, 10, 12],
      anchorX: 32,
      anchorY: 48,
    },
    shoot: {
      src: '/assets/pokemon/groudon/Shoot-Anim.png',
      frameWidth: 80,
      frameHeight: 88,
      frameCount: 12,
      durations: [2, 2, 6, 2, 2, 2, 2, 2, 2, 2, 2, 2],
      anchorX: 40,
      anchorY: 46,
    },
    attack: {
      src: '/assets/pokemon/groudon/Attack-Anim.png',
      frameWidth: 88,
      frameHeight: 104,
      frameCount: 10,
      durations: [2, 6, 1, 1, 2, 2, 2, 2, 2, 2],
      anchorX: 44,
      anchorY: 55,
    },
  },
  kyogre: {
    id: 'kyogre',
    name: 'Kyogre',
    scale: 0.78,
    idle: {
      src: '/assets/pokemon/kyogre/Idle-Anim.png',
      frameWidth: 64,
      frameHeight: 72,
      frameCount: 10,
      durations: [10, 14, 14, 14, 14, 10, 14, 14, 14, 14],
      anchorX: 32,
      anchorY: 40,
    },
    walk: {
      src: '/assets/pokemon/kyogre/Walk-Anim.png',
      frameWidth: 64,
      frameHeight: 72,
      frameCount: 10,
      durations: [8, 8, 8, 8, 8, 8, 8, 8, 8, 8],
      anchorX: 32,
      anchorY: 40,
    },
    shoot: {
      src: '/assets/pokemon/kyogre/Shoot-Anim.png',
      frameWidth: 72,
      frameHeight: 72,
      frameCount: 11,
      durations: [2, 6, 2, 2, 2, 2, 2, 2, 2, 2, 2],
      anchorX: 36,
      anchorY: 38,
    },
    attack: {
      src: '/assets/pokemon/kyogre/Attack-Anim.png',
      frameWidth: 80,
      frameHeight: 72,
      frameCount: 10,
      durations: [2, 6, 1, 1, 2, 2, 2, 2, 2, 2],
      anchorX: 40,
      anchorY: 39,
    },
  },
  tyranitar: {
    id: 'tyranitar',
    name: 'Tyranitar',
    scale: 1.42,
    idle: {
      src: '/assets/pokemon/tyranitar/Idle-Anim.png',
      frameWidth: 40,
      frameHeight: 48,
      frameCount: 4,
      durations: [14, 24, 14, 24],
      anchorX: 20,
      anchorY: 28,
    },
    walk: {
      src: '/assets/pokemon/tyranitar/Walk-Anim.png',
      frameWidth: 40,
      frameHeight: 48,
      frameCount: 4,
      durations: [10, 16, 10, 16],
      anchorX: 20,
      anchorY: 28,
    },
    shoot: {
      src: '/assets/pokemon/tyranitar/Shoot-Anim.png',
      frameWidth: 48,
      frameHeight: 56,
      frameCount: 13,
      durations: [2, 3, 6, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2],
      anchorX: 24,
      anchorY: 30,
    },
    attack: {
      src: '/assets/pokemon/tyranitar/Attack-Anim.png',
      frameWidth: 80,
      frameHeight: 80,
      frameCount: 11,
      durations: [2, 2, 2, 6, 2, 2, 2, 2, 2, 2, 2],
      anchorX: 40,
      anchorY: 43,
    },
  },
  gyarados: {
    id: 'gyarados',
    name: 'Gyarados',
    scale: 0.62,
    idle: {
      src: '/assets/pokemon/gyarados/Idle-Anim.png',
      frameWidth: 72,
      frameHeight: 128,
      frameCount: 4,
      durations: [18, 8, 18, 8],
      anchorX: 36,
      anchorY: 68,
    },
    walk: {
      src: '/assets/pokemon/gyarados/Walk-Anim.png',
      frameWidth: 88,
      frameHeight: 128,
      frameCount: 4,
      durations: [10, 14, 10, 14],
      anchorX: 44,
      anchorY: 68,
    },
    shoot: {
      src: '/assets/pokemon/gyarados/Shoot-Anim.png',
      frameWidth: 104,
      frameHeight: 128,
      frameCount: 12,
      durations: [2, 2, 4, 1, 2, 2, 2, 2, 2, 2, 2, 2],
      anchorX: 52,
      anchorY: 66,
    },
    attack: {
      src: '/assets/pokemon/gyarados/Attack-Anim.png',
      frameWidth: 104,
      frameHeight: 136,
      frameCount: 10,
      durations: [4, 6, 1, 1, 1, 2, 2, 2, 2, 2],
      anchorX: 52,
      anchorY: 71,
    },
    rearUp: {
      src: '/assets/pokemon/gyarados/RearUp-Anim.png',
      frameWidth: 88,
      frameHeight: 160,
      frameCount: 12,
      durations: [2, 6, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
      anchorX: 44,
      anchorY: 84,
    },
  },
  snorlax: {
    id: 'snorlax',
    name: 'Snorlax',
    scale: 0.95,
    idle: {
      src: '/assets/pokemon/snorlax/Idle-Anim.png',
      frameWidth: 32,
      frameHeight: 64,
      frameCount: 6,
      durations: [40, 1, 3, 4, 3, 1],
      anchorX: 16,
      anchorY: 37,
    },
    walk: {
      src: '/assets/pokemon/snorlax/Walk-Anim.png',
      frameWidth: 32,
      frameHeight: 48,
      frameCount: 4,
      durations: [8, 10, 8, 10],
      anchorX: 16,
      anchorY: 29,
    },
    shoot: {
      src: '/assets/pokemon/snorlax/Shoot-Anim.png',
      frameWidth: 40,
      frameHeight: 56,
      frameCount: 12,
      durations: [2, 2, 6, 1, 1, 2, 2, 2, 2, 2, 2, 2],
      anchorX: 20,
      anchorY: 32,
    },
    attack: {
      src: '/assets/pokemon/snorlax/Attack-Anim.png',
      frameWidth: 64,
      frameHeight: 88,
      frameCount: 10,
      durations: [2, 8, 1, 1, 1, 2, 2, 2, 2, 2],
      anchorX: 32,
      anchorY: 47,
    },
  },
  latias: {
    id: 'latias',
    name: 'Latias',
    scale: 1.0,
    idle: {
      src: '/assets/pokemon/latias/Idle-Anim.png',
      frameWidth: 48,
      frameHeight: 64,
      frameCount: 6,
      durations: [8, 8, 8, 8, 8, 8],
      anchorX: 24,
      anchorY: 39,
    },
    walk: {
      src: '/assets/pokemon/latias/Walk-Anim.png',
      frameWidth: 48,
      frameHeight: 64,
      frameCount: 14,
      durations: [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
      anchorX: 24,
      anchorY: 39,
    },
    shoot: {
      src: '/assets/pokemon/latias/Shoot-Anim.png',
      frameWidth: 64,
      frameHeight: 80,
      frameCount: 12,
      durations: [2, 6, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2],
      anchorX: 32,
      anchorY: 42,
    },
    attack: {
      src: '/assets/pokemon/latias/Attack-Anim.png',
      frameWidth: 72,
      frameHeight: 72,
      frameCount: 11,
      durations: [2, 2, 6, 1, 1, 1, 2, 2, 2, 2, 2],
      anchorX: 36,
      anchorY: 43,
    },
    rearUp: {
      src: '/assets/pokemon/latias/RearUp-Anim.png',
      frameWidth: 48,
      frameHeight: 96,
      frameCount: 12,
      durations: [2, 2, 2, 6, 2, 2, 2, 2, 2, 2, 2, 2],
      anchorX: 24,
      anchorY: 60,
    },
  },
  latios: {
    id: 'latios',
    name: 'Latios',
    scale: 1.0,
    idle: {
      src: '/assets/pokemon/latios/Idle-Anim.png',
      frameWidth: 64,
      frameHeight: 80,
      frameCount: 6,
      durations: [8, 8, 8, 8, 8, 8],
      anchorX: 32,
      anchorY: 44,
    },
    walk: {
      src: '/assets/pokemon/latios/Walk-Anim.png',
      frameWidth: 64,
      frameHeight: 80,
      frameCount: 12,
      durations: [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
      anchorX: 32,
      anchorY: 44,
    },
    shoot: {
      src: '/assets/pokemon/latios/Shoot-Anim.png',
      frameWidth: 72,
      frameHeight: 88,
      frameCount: 12,
      durations: [2, 6, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2],
      anchorX: 36,
      anchorY: 46,
    },
    attack: {
      src: '/assets/pokemon/latios/Attack-Anim.png',
      frameWidth: 80,
      frameHeight: 80,
      frameCount: 11,
      durations: [2, 2, 6, 1, 1, 1, 2, 2, 2, 2, 2],
      anchorX: 40,
      anchorY: 43,
    },
    rearUp: {
      src: '/assets/pokemon/latios/RearUp-Anim.png',
      frameWidth: 64,
      frameHeight: 104,
      frameCount: 12,
      durations: [2, 2, 2, 6, 2, 2, 2, 2, 2, 2, 2, 2],
      anchorX: 32,
      anchorY: 56,
    },
  },
  samurott: {
    id: 'samurott',
    name: 'Samurott',
    scale: 1.0,
    idle: {
      src: '/assets/pokemon/samurott/Idle-Anim.png',
      frameWidth: 48,
      frameHeight: 48,
      frameCount: 4,
      durations: [60, 12, 12, 12],
      anchorX: 24,
      anchorY: 28,
    },
    walk: {
      src: '/assets/pokemon/samurott/Walk-Anim.png',
      frameWidth: 48,
      frameHeight: 40,
      frameCount: 4,
      durations: [8, 10, 8, 10],
      anchorX: 24,
      anchorY: 24,
    },
    shoot: {
      src: '/assets/pokemon/samurott/Shoot-Anim.png',
      frameWidth: 56,
      frameHeight: 48,
      frameCount: 10,
      durations: [2, 6, 1, 2, 2, 2, 2, 2, 2, 2],
      anchorX: 28,
      anchorY: 27,
    },
    attack: {
      src: '/assets/pokemon/samurott/Attack-Anim.png',
      frameWidth: 80,
      frameHeight: 88,
      frameCount: 11,
      durations: [2, 6, 1, 1, 1, 6, 2, 2, 2, 2, 2],
      anchorX: 40,
      anchorY: 46,
    },
  },
  empoleon: {
    id: 'empoleon',
    name: 'Empoleon',
    scale: 1.0,
    idle: {
      src: '/assets/pokemon/empoleon/Idle-Anim.png',
      frameWidth: 32,
      frameHeight: 56,
      frameCount: 4,
      durations: [20, 12, 20, 30],
      anchorX: 16,
      anchorY: 32,
    },
    walk: {
      src: '/assets/pokemon/empoleon/Walk-Anim.png',
      frameWidth: 32,
      frameHeight: 56,
      frameCount: 4,
      durations: [10, 10, 10, 10],
      anchorX: 16,
      anchorY: 32,
    },
    shoot: {
      src: '/assets/pokemon/empoleon/Shoot-Anim.png',
      frameWidth: 40,
      frameHeight: 56,
      frameCount: 12,
      durations: [2, 2, 6, 1, 2, 2, 2, 2, 2, 2, 2, 2],
      anchorX: 20,
      anchorY: 31,
    },
    attack: {
      src: '/assets/pokemon/empoleon/Attack-Anim.png',
      frameWidth: 64,
      frameHeight: 80,
      frameCount: 14,
      durations: [2, 2, 2, 4, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2],
      anchorX: 32,
      anchorY: 43,
    },
  },
  darkrai: {
    id: 'darkrai',
    name: 'Darkrai',
    scale: 0.95,
    idle: {
      src: '/assets/pokemon/darkrai/Idle-Anim.png',
      frameWidth: 40,
      frameHeight: 80,
      frameCount: 7,
      durations: [20, 6, 6, 20, 6, 6, 6],
      anchorX: 20,
      anchorY: 44,
    },
    walk: {
      src: '/assets/pokemon/darkrai/Walk-Anim.png',
      frameWidth: 40,
      frameHeight: 80,
      frameCount: 8,
      durations: [7, 7, 9, 9, 9, 7, 7, 7],
      anchorX: 20,
      anchorY: 43,
    },
    shoot: {
      src: '/assets/pokemon/darkrai/Shoot-Anim.png',
      frameWidth: 32,
      frameHeight: 80,
      frameCount: 24,
      durations: [2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      anchorX: 16,
      anchorY: 44,
    },
    attack: {
      src: '/assets/pokemon/darkrai/Attack-Anim.png',
      frameWidth: 80,
      frameHeight: 104,
      frameCount: 11,
      durations: [2, 2, 6, 1, 1, 1, 2, 4, 3, 2, 2],
      anchorX: 40,
      anchorY: 55,
    },
    rearUp: {
      src: '/assets/pokemon/darkrai/RearUp-Anim.png',
      frameWidth: 48,
      frameHeight: 96,
      frameCount: 13,
      durations: [2, 2, 3, 4, 2, 2, 2, 2, 2, 4, 3, 2, 2],
      anchorX: 24,
      anchorY: 52,
    },
  },
  regigigas: {
    id: 'regigigas',
    name: 'Regigigas',
    scale: 0.92,
    idle: {
      src: '/assets/pokemon/regigigas/Idle-Anim.png',
      frameWidth: 64,
      frameHeight: 88,
      frameCount: 8,
      durations: [60, 12, 4, 4, 4, 4, 4, 20],
      anchorX: 32,
      anchorY: 48,
    },
    walk: {
      src: '/assets/pokemon/regigigas/Walk-Anim.png',
      frameWidth: 48,
      frameHeight: 72,
      frameCount: 4,
      durations: [8, 12, 8, 12],
      anchorX: 24,
      anchorY: 40,
    },
    shoot: {
      src: '/assets/pokemon/regigigas/Shoot-Anim.png',
      frameWidth: 80,
      frameHeight: 88,
      frameCount: 11,
      durations: [2, 10, 1, 2, 2, 2, 2, 2, 2, 2, 2],
      anchorX: 40,
      anchorY: 46,
    },
    attack: {
      src: '/assets/pokemon/regigigas/Attack-Anim.png',
      frameWidth: 96,
      frameHeight: 96,
      frameCount: 14,
      durations: [2, 2, 6, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2],
      anchorX: 48,
      anchorY: 50,
    },
    rearUp: {
      src: '/assets/pokemon/regigigas/Emit-Anim.png',
      frameWidth: 64,
      frameHeight: 120,
      frameCount: 16,
      durations: [6, 1, 1, 2, 2, 2, 2, 1, 1, 3, 1, 1, 2, 2, 2, 2],
      anchorX: 32,
      anchorY: 64,
    },
  },
  koraidon: {
    id: 'koraidon',
    name: 'Koraidon',
    scale: 0.9,
    idle: {
      src: '/assets/pokemon/koraidon/Idle-Anim.png',
      frameWidth: 64,
      frameHeight: 88,
      frameCount: 6,
      durations: [40, 2, 12, 10, 12, 2],
      anchorX: 32,
      anchorY: 48,
    },
    walk: {
      src: '/assets/pokemon/koraidon/Walk-Anim.png',
      frameWidth: 64,
      frameHeight: 80,
      frameCount: 4,
      durations: [8, 14, 8, 14],
      anchorX: 32,
      anchorY: 44,
    },
    shoot: {
      src: '/assets/pokemon/koraidon/Shoot-Anim.png',
      frameWidth: 72,
      frameHeight: 88,
      frameCount: 17,
      durations: [1, 2, 4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
      anchorX: 36,
      anchorY: 48,
    },
    attack: {
      src: '/assets/pokemon/koraidon/Attack-Anim.png',
      frameWidth: 80,
      frameHeight: 104,
      frameCount: 14,
      durations: [2, 2, 6, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2],
      anchorX: 40,
      anchorY: 54,
    },
    rearUp: {
      src: '/assets/pokemon/koraidon/RearUp-Anim.png',
      frameWidth: 64,
      frameHeight: 96,
      frameCount: 14,
      durations: [1, 2, 2, 2, 2, 1, 2, 4, 4, 2, 2, 2, 2, 2],
      anchorX: 32,
      anchorY: 52,
    },
  },
  eternatus: {
    id: 'eternatus',
    name: 'Eternatus',
    scale: 0.68,
    idle: {
      src: '/assets/pokemon/eternatus/Idle-Anim.png',
      frameWidth: 104,
      frameHeight: 128,
      frameCount: 4,
      durations: [12, 8, 12, 8],
      anchorX: 52,
      anchorY: 68,
    },
    walk: {
      src: '/assets/pokemon/eternatus/Walk-Anim.png',
      frameWidth: 104,
      frameHeight: 120,
      frameCount: 6,
      durations: [8, 8, 8, 8, 8, 8],
      anchorX: 52,
      anchorY: 64,
    },
    shoot: {
      src: '/assets/pokemon/eternatus/Shoot-Anim.png',
      frameWidth: 112,
      frameHeight: 128,
      frameCount: 13,
      durations: [2, 3, 4, 4, 1, 1, 2, 2, 2, 2, 2, 2, 2],
      anchorX: 56,
      anchorY: 66,
    },
    attack: {
      src: '/assets/pokemon/eternatus/Attack-Anim.png',
      frameWidth: 128,
      frameHeight: 160,
      frameCount: 14,
      durations: [2, 2, 1, 3, 1, 3, 2, 1, 1, 2, 2, 2, 2, 2],
      anchorX: 64,
      anchorY: 83,
    },
    rearUp: {
      src: '/assets/pokemon/eternatus/RearUp-Anim.png',
      frameWidth: 104,
      frameHeight: 128,
      frameCount: 13,
      durations: [4, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
      anchorX: 52,
      anchorY: 68,
    },
  },
  urshifu: {
    id: 'urshifu',
    name: 'Urshifu',
    scale: 1.1,
    idle: {
      src: '/assets/pokemon/urshifu/Idle-Anim.png',
      frameWidth: 32,
      frameHeight: 64,
      frameCount: 4,
      durations: [10, 10, 10, 10],
      anchorX: 16,
      anchorY: 39,
    },
    walk: {
      src: '/assets/pokemon/urshifu/Walk-Anim.png',
      frameWidth: 32,
      frameHeight: 56,
      frameCount: 4,
      durations: [8, 10, 8, 10],
      anchorX: 16,
      anchorY: 35,
    },
    shoot: {
      src: '/assets/pokemon/urshifu/Shoot-Anim.png',
      frameWidth: 40,
      frameHeight: 72,
      frameCount: 13,
      durations: [2, 2, 2, 6, 2, 2, 2, 2, 2, 2, 2, 2, 2],
      anchorX: 20,
      anchorY: 41,
    },
    attack: {
      src: '/assets/pokemon/urshifu/Attack-Anim.png',
      frameWidth: 72,
      frameHeight: 96,
      frameCount: 11,
      durations: [2, 6, 2, 2, 2, 2, 2, 2, 2, 2, 4],
      anchorX: 36,
      anchorY: 53,
    },
  },
  charizard: {
    id: 'charizard',
    name: 'Charizard',
    scale: 1.45,
    idle: {
      src: '/assets/pokemon/charizard/Idle-Anim.png',
      frameWidth: 40,
      frameHeight: 48,
      frameCount: 4,
      durations: [15, 15, 15, 15],
      anchorX: 20,
      anchorY: 28,
    },
    walk: {
      src: '/assets/pokemon/charizard/Walk-Anim.png',
      frameWidth: 40,
      frameHeight: 48,
      frameCount: 4,
      durations: [8, 10, 8, 10],
      anchorX: 20,
      anchorY: 28,
    },
    shoot: {
      src: '/assets/pokemon/charizard/Shoot-Anim.png',
      frameWidth: 56,
      frameHeight: 56,
      frameCount: 11,
      durations: [4, 6, 2, 2, 2, 2, 2, 2, 2, 2, 2],
      anchorX: 28,
      anchorY: 31,
    },
    attack: {
      src: '/assets/pokemon/charizard/Attack-Anim.png',
      frameWidth: 80,
      frameHeight: 88,
      frameCount: 14,
      durations: [2, 2, 2, 2, 4, 1, 1, 2, 2, 2, 2, 2, 2, 2],
      anchorX: 40,
      anchorY: 47,
    },
    rearUp: {
      src: '/assets/pokemon/charizard/Hop-Anim.png',
      frameWidth: 48,
      frameHeight: 96,
      frameCount: 10,
      durations: [2, 1, 2, 3, 4, 4, 3, 2, 1, 2],
      anchorX: 24,
      anchorY: 52,
    },
  },
  gardevoir: {
    id: 'gardevoir',
    name: 'Gardevoir',
    scale: 1.1,
    idle: {
      src: '/assets/pokemon/gardevoir/Idle-Anim.png',
      frameWidth: 32,
      frameHeight: 40,
      frameCount: 4,
      durations: [6, 12, 6, 12],
      anchorX: 16,
      anchorY: 24,
    },
    walk: {
      src: '/assets/pokemon/gardevoir/Walk-Anim.png',
      frameWidth: 32,
      frameHeight: 40,
      frameCount: 4,
      durations: [8, 12, 8, 12],
      anchorX: 16,
      anchorY: 24,
    },
    shoot: {
      src: '/assets/pokemon/gardevoir/Charge-Anim.png',
      frameWidth: 32,
      frameHeight: 40,
      frameCount: 10,
      durations: [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
      anchorX: 17,
      anchorY: 24,
    },
    attack: {
      src: '/assets/pokemon/gardevoir/Attack-Anim.png',
      frameWidth: 72,
      frameHeight: 72,
      frameCount: 10,
      durations: [2, 4, 1, 1, 1, 2, 2, 2, 2, 2],
      anchorX: 36,
      anchorY: 39,
    },
    rearUp: {
      src: '/assets/pokemon/gardevoir/Hop-Anim.png',
      frameWidth: 32,
      frameHeight: 88,
      frameCount: 10,
      durations: [2, 1, 2, 3, 4, 4, 3, 2, 1, 2],
      anchorX: 16,
      anchorY: 48,
    },
  },
  celebi: {
    id: 'celebi',
    name: 'Celebi',
    scale: 1.05,
    idle: {
      src: '/assets/pokemon/celebi/Idle-Anim.png',
      frameWidth: 24,
      frameHeight: 56,
      frameCount: 6,
      durations: [8, 7, 6, 6, 6, 7],
      anchorX: 12,
      anchorY: 32,
    },
    walk: {
      src: '/assets/pokemon/celebi/Walk-Anim.png',
      frameWidth: 24,
      frameHeight: 48,
      frameCount: 8,
      durations: [4, 4, 4, 4, 4, 4, 4, 4],
      anchorX: 12,
      anchorY: 28,
    },
    shoot: {
      src: '/assets/pokemon/celebi/Shoot-Anim.png',
      frameWidth: 40,
      frameHeight: 64,
      frameCount: 13,
      durations: [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
      anchorX: 20,
      anchorY: 36,
    },
    attack: {
      src: '/assets/pokemon/celebi/Attack-Anim.png',
      frameWidth: 72,
      frameHeight: 80,
      frameCount: 16,
      durations: [1, 1, 1, 1, 1, 1, 1, 6, 1, 1, 1, 2, 2, 2, 2, 2],
      anchorX: 36,
      anchorY: 43,
    },
    rearUp: {
      src: '/assets/pokemon/celebi/Hop-Anim.png',
      frameWidth: 24,
      frameHeight: 88,
      frameCount: 10,
      durations: [2, 1, 2, 3, 4, 4, 3, 2, 1, 2],
      anchorX: 12,
      anchorY: 48,
    },
  },
  lugia: {
    id: 'lugia',
    name: 'Lugia',
    scale: 0.72,
    idle: {
      src: '/assets/pokemon/lugia/Idle-Anim.png',
      frameWidth: 72,
      frameHeight: 96,
      frameCount: 2,
      durations: [30, 30],
      anchorX: 36,
      anchorY: 52,
    },
    walk: {
      src: '/assets/pokemon/lugia/Hover-Anim.png',
      frameWidth: 80,
      frameHeight: 96,
      frameCount: 12,
      // Hover-Anim packs 3 full wingbeats across 12 frames; scale per-frame ticks for ~1.5-2 flaps/s
      durations: [9, 11, 9, 11, 9, 11, 9, 11, 9, 11, 9, 11],
      anchorX: 40,
      anchorY: 52,
    },
    shoot: {
      src: '/assets/pokemon/lugia/Shoot-Anim.png',
      frameWidth: 88,
      frameHeight: 128,
      frameCount: 11,
      durations: [2, 6, 1, 1, 2, 2, 2, 2, 2, 2, 2],
      anchorX: 44,
      anchorY: 57,
    },
    attack: {
      src: '/assets/pokemon/lugia/Attack-Anim.png',
      frameWidth: 104,
      frameHeight: 112,
      frameCount: 10,
      durations: [2, 4, 1, 1, 1, 2, 2, 2, 2, 2],
      anchorX: 52,
      anchorY: 59,
    },
    rearUp: {
      src: '/assets/pokemon/lugia/Hop-Anim.png',
      frameWidth: 80,
      frameHeight: 136,
      frameCount: 10,
      durations: [2, 1, 2, 3, 4, 4, 3, 2, 1, 2],
      anchorX: 40,
      anchorY: 72,
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
    tick: number,
    scaleMultiplier = 1
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

    const effectiveScale = cfg.scale * scaleMultiplier;
    const destW = spec.frameWidth * effectiveScale;
    const destH = spec.frameHeight * effectiveScale;
    const destX = coreX - spec.anchorX * effectiveScale;
    const destY = coreY - spec.anchorY * effectiveScale;

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

