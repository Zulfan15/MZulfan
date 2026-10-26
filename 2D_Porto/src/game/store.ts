export interface GameState {
  balls: number;
  caught: string[];
  trainerName: string;
}

const STORAGE_KEY = 'zulfan_town_save';

export class GameStore {
  private state: GameState = {
    balls: 5,
    caught: [],
    trainerName: 'TRAINER',
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
}

export const gameStore = new GameStore();
