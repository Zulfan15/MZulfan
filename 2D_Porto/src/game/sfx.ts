// Retro chiptune sound generator using the browser's Web Audio API. Zero audio files needed.

class SoundFX {
  private ctx: AudioContext | null = null;
  private enabled = true;

  constructor() {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sfx_enabled');
      this.enabled = saved !== '0';
    }
  }

  private init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public isEnabled() {
    return this.enabled;
  }

  public toggle(): boolean {
    this.enabled = !this.enabled;
    if (typeof window !== 'undefined') {
      localStorage.setItem('sfx_enabled', this.enabled ? '1' : '0');
    }
    return this.enabled;
  }

  private playTone(freq: number, type: OscillatorType, duration: number, gain = 0.1) {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gainNode = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gainNode.gain.setValueAtTime(gain, this.ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gainNode);
      gainNode.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {
      // Audio autoplay policy fallback
    }
  }

  public step() {
    this.playTone(180, 'triangle', 0.04, 0.04);
  }

  public blip() {
    this.playTone(880, 'square', 0.03, 0.03);
  }

  public select() {
    this.playTone(520, 'sine', 0.08, 0.06);
    setTimeout(() => this.playTone(780, 'sine', 0.1, 0.06), 40);
  }

  public confirm() {
    this.playTone(520, 'triangle', 0.1, 0.08);
    setTimeout(() => this.playTone(1040, 'triangle', 0.16, 0.08), 60);
  }

  public bump() {
    this.playTone(110, 'sawtooth', 0.08, 0.05);
  }

  public door() {
    this.playTone(440, 'sine', 0.1, 0.06);
    setTimeout(() => this.playTone(660, 'sine', 0.15, 0.06), 80);
    setTimeout(() => this.playTone(880, 'sine', 0.25, 0.06), 160);
  }

  public encounter() {
    const notes = [440, 554, 659, 880, 1108];
    notes.forEach((f, i) => {
      setTimeout(() => this.playTone(f, 'square', 0.12, 0.08), i * 60);
    });
  }

  public catchSuccess() {
    const fanfare = [523, 659, 784, 1046];
    fanfare.forEach((f, i) => {
      setTimeout(() => this.playTone(f, 'triangle', 0.18, 0.08), i * 90);
    });
  }

  public get on(): boolean {
    return this.enabled;
  }

  public play(name: string, mult = 1) {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const sounds: Record<string, [number, number][]> = {
      blip: [[880, 18]],
      move: [[660, 40]],
      select: [[990, 50], [1320, 70]],
      back: [[440, 60]],
      drop: [[520, 45]],
      store: [[784, 60], [1046, 90]],
      capture: [[523, 70], [659, 70], [784, 70], [1046, 140]],
      extra: [[784, 80], [988, 80], [1175, 160]],
      win: [[523, 120], [659, 120], [784, 120], [1046, 120], [784, 100], [1046, 320]],
      lose: [[392, 180], [370, 180], [349, 180], [330, 420]],
      start: [[392, 90], [523, 90], [659, 90], [784, 200]],
    };

    const seq = sounds[name];
    if (!seq) return;

    try {
      let t = this.ctx.currentTime;
      for (const [freq, ms] of seq) {
        const osc = this.ctx.createOscillator();
        const gainNode = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(freq * mult, t);
        gainNode.gain.setValueAtTime(0.06, t);
        gainNode.gain.exponentialRampToValueAtTime(0.0008, t + ms / 1000);
        osc.connect(gainNode);
        gainNode.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + ms / 1000);
        t += ms / 1000;
      }
    } catch {
      // Audio autoplay policy fallback
    }
  }
}

export const sfx = new SoundFX();
