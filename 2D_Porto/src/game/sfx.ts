// Retro chiptune sound generator using the browser's Web Audio API. Zero audio files needed.

function mtof(midi: number): number {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

class SoundFX {
  private ctx: AudioContext | null = null;
  private enabled = true;

  // 8-Bit Procedural Lo-Fi BGM Engine
  private bgmEnabled = false;
  private bgmPlaying = false;
  private bgmTheme: 'day' | 'sunset' | 'night' = 'day';
  private bgmGainNode: GainNode | null = null;
  private bgmFilterNode: BiquadFilterNode | null = null;
  private bgmTimer: number | null = null;
  private bgmNextNoteTime = 0;
  private bgmStep = 0;

  constructor() {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sfx_enabled');
      this.enabled = saved !== '0';
      const savedBgm = localStorage.getItem('bgm_enabled');
      this.bgmEnabled = savedBgm === '1';

      // Auto-unlock audio context on first user interaction
      const unlock = () => {
        if (this.ctx && this.ctx.state === 'suspended') {
          this.ctx.resume();
        }
        if (this.bgmEnabled && !this.bgmPlaying) {
          this.startBgm(this.bgmTheme);
        }
      };
      window.addEventListener('pointerdown', unlock, { once: true, passive: true });
      window.addEventListener('keydown', unlock, { once: true, passive: true });
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

  // ==========================================
  // BGM CONTROLS & WEB AUDIO SYNTHESIZER
  // ==========================================
  public isBgmEnabled(): boolean {
    return this.bgmEnabled;
  }

  public getBgmTheme(): 'day' | 'sunset' | 'night' {
    return this.bgmTheme;
  }

  public toggleBgm(): boolean {
    this.bgmEnabled = !this.bgmEnabled;
    if (typeof window !== 'undefined') {
      localStorage.setItem('bgm_enabled', this.bgmEnabled ? '1' : '0');
    }
    if (this.bgmEnabled) {
      this.startBgm(this.bgmTheme);
    } else {
      this.stopBgm();
    }
    return this.bgmEnabled;
  }

  public setBgmTheme(theme: 'day' | 'sunset' | 'night') {
    if (this.bgmTheme === theme) return;
    this.bgmTheme = theme;
    if (this.bgmPlaying) {
      // Smoothly update filter and sequence
      if (this.bgmFilterNode && this.ctx) {
        const targetFreq = theme === 'night' ? 950 : theme === 'sunset' ? 1400 : 1900;
        this.bgmFilterNode.frequency.setTargetAtTime(targetFreq, this.ctx.currentTime, 0.4);
      }
    }
  }

  public startBgm(theme?: 'day' | 'sunset' | 'night') {
    if (theme) this.bgmTheme = theme;
    if (typeof window === 'undefined') return;
    this.init();
    if (!this.ctx) return;

    if (this.bgmPlaying) {
      this.setBgmTheme(this.bgmTheme);
      return;
    }

    try {
      // Warm Lo-Fi master channel with gentle low-pass filter
      this.bgmFilterNode = this.ctx.createBiquadFilter();
      this.bgmFilterNode.type = 'lowpass';
      this.bgmFilterNode.frequency.setValueAtTime(
        this.bgmTheme === 'night' ? 950 : this.bgmTheme === 'sunset' ? 1400 : 1900,
        this.ctx.currentTime
      );
      this.bgmFilterNode.Q.setValueAtTime(1.2, this.ctx.currentTime);

      this.bgmGainNode = this.ctx.createGain();
      this.bgmGainNode.gain.setValueAtTime(0.0001, this.ctx.currentTime);
      this.bgmGainNode.gain.exponentialRampToValueAtTime(0.055, this.ctx.currentTime + 0.8);

      this.bgmFilterNode.connect(this.bgmGainNode);
      this.bgmGainNode.connect(this.ctx.destination);

      this.bgmPlaying = true;
      this.bgmStep = 0;
      this.bgmNextNoteTime = this.ctx.currentTime + 0.05;

      // Web Audio lookahead scheduler loop
      const scheduleLoop = () => {
        if (!this.bgmPlaying || !this.ctx) return;
        while (this.bgmNextNoteTime < this.ctx.currentTime + 0.25) {
          this.scheduleNextStep(this.bgmNextNoteTime);
          const stepDuration = this.getStepDuration();
          this.bgmNextNoteTime += stepDuration;
          this.bgmStep = (this.bgmStep + 1) % 64;
        }
      };

      this.bgmTimer = window.setInterval(scheduleLoop, 60);
    } catch {
      // Autoplay policy fallback
    }
  }

  public stopBgm() {
    if (!this.bgmPlaying) return;
    this.bgmPlaying = false;
    if (this.bgmTimer !== null) {
      clearInterval(this.bgmTimer);
      this.bgmTimer = null;
    }
    if (this.bgmGainNode && this.ctx) {
      try {
        this.bgmGainNode.gain.setTargetAtTime(0.0001, this.ctx.currentTime, 0.2);
        const gain = this.bgmGainNode;
        setTimeout(() => {
          try {
            gain.disconnect();
          } catch {}
        }, 500);
      } catch {}
      this.bgmGainNode = null;
    }
  }

  private getStepDuration(): number {
    // 16th notes: Day = 104 BPM, Sunset = 88 BPM, Night = 72 BPM
    if (this.bgmTheme === 'night') return 60 / 72 / 4; // ~0.208s
    if (this.bgmTheme === 'sunset') return 60 / 88 / 4; // ~0.170s
    return 60 / 104 / 4; // ~0.144s
  }

  private scheduleNextStep(time: number) {
    if (!this.ctx || !this.bgmFilterNode) return;

    const step = this.bgmStep;
    const theme = this.bgmTheme;

    // --- DAY THEME ("Littleroot Breeze" - C Major / G Major) ---
    if (theme === 'day') {
      // Bass pattern (Triangle wave on beat 1 & 3 of each bar)
      const bassProg = [
        48, 0, 0, 0, 55, 0, 0, 0, 48, 0, 0, 0, 55, 0, 0, 0, // C3, G3
        45, 0, 0, 0, 52, 0, 0, 0, 45, 0, 0, 0, 52, 0, 0, 0, // A2, E3
        41, 0, 0, 0, 48, 0, 0, 0, 41, 0, 0, 0, 48, 0, 0, 0, // F2, C3
        43, 0, 0, 0, 50, 0, 0, 0, 43, 0, 0, 0, 55, 0, 0, 0  // G2, D3, G3
      ];
      const bassMidi = bassProg[step];
      if (bassMidi) {
        this.playSynthNote(mtof(bassMidi), 'triangle', time, 0.28, 0.05);
      }

      // Arpeggio chords (Soft gentle sine)
      const arps = [
        60, 64, 67, 71, 67, 64, 60, 64, 60, 64, 67, 71, 67, 64, 60, 64, // Cmaj7
        57, 60, 64, 69, 64, 60, 57, 60, 57, 60, 64, 69, 64, 60, 57, 60, // Am7
        53, 57, 60, 65, 60, 57, 53, 57, 53, 57, 60, 65, 60, 57, 53, 57, // Fmaj7
        55, 59, 62, 67, 62, 59, 55, 59, 55, 59, 62, 67, 62, 59, 55, 59  // G7
      ];
      const arpMidi = arps[step];
      if (arpMidi && step % 2 === 0) {
        this.playSynthNote(mtof(arpMidi), 'sine', time, 0.16, 0.022);
      }

      // Lead Melody (Nostalgic 8-bit square wave)
      const melody = [
        72, 0, 76, 0, 79, 0, 81, 0, 79, 0, 0, 0, 76, 0, 74, 0,
        72, 0, 0, 0, 74, 0, 76, 0, 74, 0, 0, 0, 0, 0, 0, 0,
        72, 0, 76, 0, 79, 0, 84, 0, 83, 0, 0, 0, 81, 0, 79, 0,
        81, 0, 0, 0, 79, 0, 76, 0, 74, 0, 0, 0, 72, 0, 0, 0
      ];
      const melMidi = melody[step];
      if (melMidi) {
        this.playSynthNote(mtof(melMidi), 'square', time, 0.22, 0.038);
      }
    }

    // --- SUNSET THEME ("Golden Horizon" - Fmaj7 -> Em7 -> Dm7 -> Cmaj7) ---
    else if (theme === 'sunset') {
      const sunsetBass = [
        41, 0, 0, 0, 48, 0, 0, 0, 41, 0, 0, 0, 48, 0, 0, 0, // F
        40, 0, 0, 0, 47, 0, 0, 0, 40, 0, 0, 0, 47, 0, 0, 0, // E
        38, 0, 0, 0, 45, 0, 0, 0, 38, 0, 0, 0, 45, 0, 0, 0, // D
        36, 0, 0, 0, 43, 0, 0, 0, 36, 0, 0, 0, 43, 0, 0, 0  // C
      ];
      const bMidi = sunsetBass[step];
      if (bMidi) {
        this.playSynthNote(mtof(bMidi), 'triangle', time, 0.32, 0.045);
      }

      // Warm mellow chords
      if (step % 8 === 0) {
        const chord = step < 16 ? [65, 69, 72] : step < 32 ? [64, 67, 71] : step < 48 ? [62, 65, 69] : [60, 64, 67];
        for (const m of chord) {
          this.playSynthNote(mtof(m), 'sine', time, 0.45, 0.02);
        }
      }

      // Nostalgic floating whistle lead
      const sunsetMel = [
        0, 0, 77, 0, 76, 0, 72, 0, 0, 0, 69, 0, 0, 0, 72, 0,
        0, 0, 76, 0, 74, 0, 71, 0, 0, 0, 67, 0, 0, 0, 71, 0,
        0, 0, 74, 0, 72, 0, 69, 0, 0, 0, 65, 0, 0, 0, 69, 0,
        0, 0, 72, 0, 71, 0, 67, 0, 0, 0, 64, 0, 0, 0, 60, 0
      ];
      const sMidi = sunsetMel[step];
      if (sMidi) {
        this.playSynthNote(mtof(sMidi), 'triangle', time, 0.3, 0.035);
      }
    }

    // --- NIGHT THEME ("Lullaby of the Stars" - Music-Box Am9 / Cmaj7) ---
    else if (theme === 'night') {
      const nightBass = [
        45, 0, 0, 0, 0, 0, 0, 0, 52, 0, 0, 0, 0, 0, 0, 0, // Am
        38, 0, 0, 0, 0, 0, 0, 0, 45, 0, 0, 0, 0, 0, 0, 0, // Dm
        40, 0, 0, 0, 0, 0, 0, 0, 47, 0, 0, 0, 0, 0, 0, 0, // Em
        45, 0, 0, 0, 0, 0, 0, 0, 57, 0, 0, 0, 0, 0, 0, 0  // Am high
      ];
      const nBass = nightBass[step];
      if (nBass) {
        this.playSynthNote(mtof(nBass), 'triangle', time, 0.4, 0.04);
      }

      // Twinkling music box chime (Sine waves that glisten like stars)
      const musicBox = [
        81, 0, 0, 0, 84, 0, 0, 0, 88, 0, 0, 0, 84, 0, 0, 0,
        79, 0, 0, 0, 83, 0, 0, 0, 86, 0, 0, 0, 83, 0, 0, 0,
        77, 0, 0, 0, 81, 0, 0, 0, 84, 0, 0, 0, 81, 0, 0, 0,
        76, 0, 0, 0, 79, 0, 0, 0, 83, 0, 0, 0, 79, 0, 76, 0
      ];
      const chimeMidi = musicBox[step];
      if (chimeMidi && (step % 2 === 0)) {
        this.playSynthNote(mtof(chimeMidi), 'sine', time, 0.35, 0.028);
      }
    }
  }

  private playSynthNote(freq: number, type: OscillatorType, time: number, duration: number, gain: number) {
    if (!this.ctx || !this.bgmFilterNode) return;
    try {
      const osc = this.ctx.createOscillator();
      const gainNode = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, time);

      // Soft envelope (Gentle attack & exponential release)
      gainNode.gain.setValueAtTime(0.0001, time);
      gainNode.gain.linearRampToValueAtTime(gain, time + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, time + duration);

      osc.connect(gainNode);
      gainNode.connect(this.bgmFilterNode);

      osc.start(time);
      osc.stop(time + duration);
    } catch {
      // Audio node scheduling fallback
    }
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

  public heal() {
    // Authentic Pokémon Center recovery chime: B5 - E6 - B5 - E6 - G#6 - F#6 - E6
    const jingle = [988, 1319, 988, 1319, 1661, 1480, 1319];
    jingle.forEach((f, i) => {
      setTimeout(() => this.playTone(f, 'sine', 0.22, 0.09), i * 140);
    });
  }

  public bikeBell() {
    this.playTone(1320, 'sine', 0.08, 0.08);
    setTimeout(() => this.playTone(1760, 'sine', 0.12, 0.08), 70);
  }

  public fly() {
    const tones = [330, 440, 660, 880, 1320];
    tones.forEach((f, i) => {
      setTimeout(() => this.playTone(f, 'sine', 0.09, 0.07), i * 40);
    });
  }

  public martChime() {
    // Classic Pokémon Mart entrance chime: G5 -> C6 -> E6
    const notes = [784, 1046, 1319];
    notes.forEach((f, i) => {
      setTimeout(() => this.playTone(f, 'sine', 0.18, 0.07), i * 110);
    });
  }

  public cashRegister() {
    // Mechanical cash drawer slide followed by golden bell chime
    this.playTone(320, 'square', 0.05, 0.04);
    setTimeout(() => this.playTone(480, 'square', 0.04, 0.04), 40);
    setTimeout(() => this.playTone(1568, 'sine', 0.22, 0.08), 90);
    setTimeout(() => this.playTone(2093, 'sine', 0.28, 0.06), 140);
  }

  public espressoBrew() {
    // Soft bubbling percolator sound
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        this.playTone(400 + Math.random() * 300, 'triangle', 0.05, 0.03);
      }, i * 60);
    }
  }

  public discSpin() {
    // Ascending optical drive spin frequency
    const freqs = [350, 480, 680, 920, 1280];
    freqs.forEach((f, i) => {
      setTimeout(() => this.playTone(f, 'sine', 0.06, 0.04), i * 35);
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
