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

export interface GameState {
  balls: number;
  caught: string[];
  trainerName: string;
  stamps: string[];
}

const STORAGE_KEY = 'zulfan_town_save';

export class GameStore {
  private state: GameState = {
    balls: 5,
    caught: [],
    trainerName: 'TRAINER',
    stamps: [],
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
}

export const gameStore = new GameStore();
