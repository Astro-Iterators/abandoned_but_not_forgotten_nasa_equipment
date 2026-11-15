export class AudioManager {
  private ctx: AudioContext | null = null;
  private muted = false;
  private ambientOsc: OscillatorNode | null = null;
  private ambientGain: GainNode | null = null;
  private masterGain: GainNode | null = null;

  constructor(initialMuted = false) {
    this.muted = initialMuted;
  }

  private initContext(): boolean {
    if (this.ctx) return true;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.muted ? 0 : 0.3, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
        return true;
      }
    } catch {
      // AudioContext unavailable or restricted
    }
    return false;
  }

  public isMuted(): boolean {
    return this.muted;
  }

  public setMuted(muted: boolean): void {
    this.muted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(muted ? 0 : 0.3, this.ctx.currentTime);
    }
  }

  public toggleMute(): boolean {
    this.setMuted(!this.muted);
    return this.muted;
  }

  public playTone(freq: number, type: OscillatorType, duration: number, gainValue = 0.2): void {
    if (this.muted) return;
    if (!this.initContext() || !this.ctx || !this.masterGain) return;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(gainValue, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {
      // Audio playback failed quietly
    }
  }

  public playCue(cue: 'bip' | 'clue' | 'step' | 'success' | 'alert'): void {
    if (this.muted) return;

    switch (cue) {
      case 'bip':
        this.playTone(880, 'sine', 0.08, 0.15);
        setTimeout(() => this.playTone(1320, 'sine', 0.12, 0.15), 90);
        break;
      case 'clue':
        this.playTone(523.25, 'triangle', 0.15, 0.2); // C5
        setTimeout(() => this.playTone(659.25, 'triangle', 0.2, 0.2), 120); // E5
        setTimeout(() => this.playTone(783.99, 'triangle', 0.3, 0.25), 240); // G5
        break;
      case 'step':
        this.playTone(120, 'square', 0.04, 0.05);
        break;
      case 'success':
        this.playTone(440, 'triangle', 0.15, 0.2);
        setTimeout(() => this.playTone(554.37, 'triangle', 0.15, 0.2), 140);
        setTimeout(() => this.playTone(659.25, 'triangle', 0.15, 0.2), 280);
        setTimeout(() => this.playTone(880, 'sine', 0.4, 0.25), 420);
        break;
      case 'alert':
        this.playTone(220, 'sawtooth', 0.2, 0.15);
        setTimeout(() => this.playTone(180, 'sawtooth', 0.25, 0.15), 180);
        break;
    }
  }

  public startAtmosphere(): void {
    if (this.muted || this.ambientOsc) return;
    if (!this.initContext() || !this.ctx || !this.masterGain) return;

    try {
      this.ambientOsc = this.ctx.createOscillator();
      this.ambientGain = this.ctx.createGain();

      this.ambientOsc.type = 'sine';
      this.ambientOsc.frequency.setValueAtTime(55, this.ctx.currentTime); // Low Martian wind/engine drone

      this.ambientGain.gain.setValueAtTime(0.05, this.ctx.currentTime);
      this.ambientOsc.connect(this.ambientGain);
      this.ambientGain.connect(this.masterGain);

      this.ambientOsc.start();
    } catch {
      // Wind drone failed
    }
  }

  public stopAtmosphere(): void {
    if (this.ambientOsc) {
      try {
        this.ambientOsc.stop();
        this.ambientOsc.disconnect();
      } catch {}
      this.ambientOsc = null;
      this.ambientGain = null;
    }
  }

  public dispose(): void {
    this.stopAtmosphere();
    if (this.ctx) {
      try {
        this.ctx.close();
      } catch {}
      this.ctx = null;
    }
  }
}
