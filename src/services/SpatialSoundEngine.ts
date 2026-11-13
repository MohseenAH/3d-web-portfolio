/**
 * ============================================================================
 * PROCEDURAL WEB AUDIO SYNTHESIZER ENGINE (No External Audio Assets)
 * Generates ambient crystalline chords and glass chime feedback.
 * Designed as a lightweight singleton with zero network requests.
 * ============================================================================
 */

interface AmbientNode {
  osc: OscillatorNode;
  lfo: OscillatorNode;
  gain: GainNode;
}

export class SpatialSoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private ambientNodes: AmbientNode[] = [];
  public isMuted: boolean = true;
  private initialized: boolean = false;

  public init(): void {
    if (this.initialized) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.15;
      this.masterGain.connect(this.ctx.destination);
      this.initialized = true;
    } catch {
      console.warn('Web Audio API not supported in this browser environment.');
    }
  }

  public toggleSound(enable: boolean): boolean {
    this.init();
    if (!this.ctx) return false;

    if (this.ctx.state === 'suspended' && enable) {
      this.ctx.resume();
    }

    this.isMuted = !enable;
    if (this.isMuted) {
      this.stopAmbientPad();
    } else {
      this.startAmbientPad();
    }
    return !this.isMuted;
  }

  public startAmbientPad(): void {
    if (!this.ctx || !this.masterGain || this.ambientNodes.length > 0) return;

    // Ambient Ethereal Frequencies (Amaj9/Emaj7 suspended harmonic pad)
    const freqs = [220.00, 329.63, 440.00, 554.37, 659.25];

    freqs.forEach((freq, i) => {
      if (!this.ctx || !this.masterGain) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = i % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800 + i * 200, this.ctx.currentTime);

      // Gentle low-frequency LFO for breathing volume
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.frequency.setValueAtTime(0.1 + i * 0.04, this.ctx.currentTime);
      lfoGain.gain.setValueAtTime(0.02, this.ctx.currentTime);
      lfo.connect(lfoGain.gain);

      gain.gain.setValueAtTime(0.01 + i * 0.005, this.ctx.currentTime);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start();
      lfo.start();

      this.ambientNodes.push({ osc, lfo, gain });
    });
  }

  public stopAmbientPad(): void {
    this.ambientNodes.forEach(({ osc, lfo }) => {
      try {
        osc.stop();
        lfo.stop();
      } catch {
        // Safe disposal
      }
    });
    this.ambientNodes = [];
  }

  public playGlassChime(freq: number = 1320): void {
    if (this.isMuted || !this.ctx || !this.masterGain) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      // Crisp glass chime pitch drop
      osc.frequency.exponentialRampToValueAtTime(freq * 0.98, now + 0.4);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.45);
    } catch {
      // Safe fallback
    }
  }
}

export const soundEngine = new SpatialSoundEngine();
