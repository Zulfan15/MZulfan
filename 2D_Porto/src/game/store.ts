export interface StampMission {
  id: 'dev' | 'twin' | 'battle' | 'critter' | 'arcade';
  name: string;
  icon: string;
  desc: string;
  hint: string;
  targetRoute?: string;
  targetCoords?: { x: number; y: number };
}

export const STAMP_MISSIONS: StampMission[] = [
  {
    id: 'dev',
    name: 'Dev Center Explorer',
    icon: '🏢',
    desc: 'Kunjungi Dev Center & lihat proyek unggulan',
    hint: 'Masuk ke gedung Dev Center (Utara Lapangan)',
    targetRoute: '/dev',
    targetCoords: { x: 16, y: 12 },
  },
  {
    id: 'twin',
    name: 'Digital Twin AI',
    icon: '🤖',
    desc: 'Mengobrol dengan AI Digital Twin Zulfan',
    hint: 'Bicara dengan Digital Twin di koridor utara / dekat Research Lab',
    targetRoute: '/twin',
    targetCoords: { x: 16, y: 16 },
  },
  {
    id: 'battle',
    name: 'Battle Arena Challenger',
    icon: '🔥',
    desc: 'Jawab kuis teknologi dari Mewtwo di Battle Arena',
    hint: 'Masuki Battle Arena di Timur dan jawab kuis Mewtwo',
    targetCoords: { x: 31, y: 39 },
  },
  {
    id: 'critter',
    name: 'Wild Critter Catcher',
    icon: '🌿',
    desc: 'Tangkap 1 Critter Pokémon di padang rumput liar',
    hint: 'Jelajahi petak rumput liar di selatan Garden Lane',
    targetCoords: { x: 26, y: 37 },
  },
  {
    id: 'arcade',
    name: 'Arcade Deoxys Strategist',
    icon: '🕹️',
    desc: 'Mainkan 1 giliran Mancala melawan Deoxys di Arcade',
    hint: 'Tantang Deoxys di meja papan Mancala Arcade Hub',
    targetRoute: '/arcade',
    targetCoords: { x: 28, y: 17 },
  },
];

export type GymBadgeId =
  | 'cascade'
  | 'vision'
  | 'stratos'
  | 'tactical'
  | 'heuristic'
  | 'sanctuary'
  | 'botanical'
  | 'empathy';

export interface GymBadge {
  id: GymBadgeId;
  name: string;
  icon: string;
  route: string;
  desc: string;
  color: string;
}

export const GYM_BADGES: GymBadge[] = [
  {
    id: 'cascade',
    name: 'Cascade Core Badge',
    icon: '⚡',
    route: '/dev',
    desc: 'Menginspeksi arsitektur proyek di Dev Center.',
    color: '#38bdf8',
  },
  {
    id: 'vision',
    name: 'Vision Neural Badge',
    icon: '👁️',
    route: '/lab',
    desc: 'Menguji eksperimen Computer Vision / Thesis di Research Lab.',
    color: '#a855f7',
  },
  {
    id: 'stratos',
    name: 'Cloud Stratos Badge',
    icon: '🗼',
    route: '/tower',
    desc: 'Menjelajahi perjalanan karier & sertifikasi di Tech Tower.',
    color: '#60a5fa',
  },
  {
    id: 'tactical',
    name: 'Tactical Logic Badge',
    icon: '⚔️',
    route: '/arena',
    desc: 'Menghadapi tantangan arsitektur di Battle Arena.',
    color: '#f43f5e',
  },
  {
    id: 'heuristic',
    name: 'Heuristic Mind Badge',
    icon: '🕹️',
    route: '/arcade',
    desc: 'Bermain melawan AI Alpha-Beta di Arcade.',
    color: '#f59e0b',
  },
  {
    id: 'sanctuary',
    name: 'Cyber Sanctuary Badge',
    icon: '🌐',
    route: '/digimon',
    desc: 'Mengunjungi Digi-Sanctuary & membuka DigiDex.',
    color: '#06b6d4',
  },
  {
    id: 'botanical',
    name: 'Botanical Data Badge',
    icon: '🌿',
    route: '/garden',
    desc: 'Memanen buah algoritma & skill di Berry Garden.',
    color: '#22c55e',
  },
  {
    id: 'empathy',
    name: 'Empathy Twin Badge',
    icon: '🤖',
    route: '/twin',
    desc: 'Berbicara dengan AI Digital Twin & Reception Desk.',
    color: '#ec4899',
  },
];

export interface GameState {
  balls: number;
  caught: string[];
  trainerName: string;
  stamps: string[];
  badges: GymBadgeId[];
}

const STORAGE_KEY = 'zulfan_town_save';

export class GameStore {
  private state: GameState = {
    balls: 5,
    caught: [],
    trainerName: 'TRAINER',
    stamps: [],
    badges: [],
  };

  private listeners: Set<(state: GameState) => void> = new Set();

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          this.state = {
            balls: typeof parsed.balls === 'number' ? parsed.balls : 5,
            caught: Array.isArray(parsed.caught) ? parsed.caught : [],
            trainerName: parsed.trainerName || 'TRAINER',
            stamps: Array.isArray(parsed.stamps) ? parsed.stamps : [],
            badges: Array.isArray(parsed.badges) ? parsed.badges : [],
          };
        }
      } catch {
        // fallback to default
      }
    }
  }

  public getState(): GameState {
    return { ...this.state };
  }

  public save() {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    }
    this.notify();
  }

  public subscribe(fn: (state: GameState) => void) {
    this.listeners.add(fn);
    fn(this.getState());
    return () => this.listeners.delete(fn);
  }

  private notify() {
    const s = this.getState();
    this.listeners.forEach((fn) => fn(s));
  }

  public catchCritter(id: string): boolean {
    if (this.state.balls <= 0) return false;
    this.state.balls--;
    if (!this.state.caught.includes(id)) {
      this.state.caught.push(id);
    }
    this.addStamp('critter');
    this.save();
    return true;
  }

  public refillBalls(count = 5) {
    this.state.balls = Math.max(this.state.balls, count);
    this.save();
  }

  public setTrainerName(name: string) {
    this.state.trainerName = (name || 'TRAINER').slice(0, 12).toUpperCase();
    this.save();
  }

  public isCaught(id: string): boolean {
    return this.state.caught.includes(id);
  }

  public addStamp(id: 'dev' | 'twin' | 'battle' | 'critter' | 'arcade'): boolean {
    const stampToBadge: Partial<Record<string, GymBadgeId>> = {
      dev: 'cascade',
      twin: 'empathy',
      battle: 'tactical',
      arcade: 'heuristic',
    };
    const mappedBadge = stampToBadge[id];
    if (mappedBadge) {
      this.unlockBadge(mappedBadge);
    }

    if (!this.state.stamps.includes(id)) {
      this.state.stamps.push(id);
      this.save();
      const mission = STAMP_MISSIONS.find((m) => m.id === id);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('town:stamp-unlocked', {
            detail: {
              id,
              mission,
              totalStamps: this.state.stamps.length,
            },
          })
        );
      }
      return true;
    }
    return false;
  }

  public hasStamp(id: string): boolean {
    return this.state.stamps.includes(id);
  }

  public getStamps(): string[] {
    return [...this.state.stamps];
  }

  public unlockBadge(id: GymBadgeId): boolean {
    if (!this.state.badges.includes(id)) {
      this.state.badges.push(id);
      this.save();
      const badge = GYM_BADGES.find((b) => b.id === id);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('town:badge-unlocked', {
            detail: {
              id,
              badge,
              totalBadges: this.state.badges.length,
            },
          })
        );
      }
      return true;
    }
    return false;
  }

  public hasBadge(id: GymBadgeId): boolean {
    return this.state.badges.includes(id);
  }

  public getBadges(): GymBadgeId[] {
    return [...this.state.badges];
  }
}

export const gameStore = new GameStore();
