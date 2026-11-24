"use client";

import { clamp } from "@/lib/math";
import { useAppStore } from "@/store/useAppStore";

export interface AudioTrack {
  title: string;
  src: string;
}

const AMBIENT_TITLE = "Ambient · Peristalsis";

/**
 * Web Audio engine providing gesture-gated generative ambient synthesis
 * ("Ambient · Peristalsis"), scroll-velocity reactive lowpass filtering,
 * optional manifest track playback, and procedural UI SFX.
 */
export class AudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private filterNode: BiquadFilterNode | null = null;
  private convolverNode: ConvolverNode | null = null;
  private dryGain: GainNode | null = null;
  private wetGain: GainNode | null = null;
  private ambientGain: GainNode | null = null;
  private lfoOsc: OscillatorNode | null = null;
  private oscillators: OscillatorNode[] = [];
  private noiseBuffer: AudioBuffer | null = null;
  private pulseTimer: number | null = null;

  private audioEl: HTMLAudioElement | null = null;
  private mediaSource: MediaElementAudioSourceNode | null = null;
  private trackGain: GainNode | null = null;

  private tracks: AudioTrack[] = [];
  private trackIndex = 0; // 0 = generative ambient
  private manifestFetched = false;

  private enabled = false;
  private volume = 0.5;
  private targetVelocity = 0;

  private ensureContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (this.ctx) {
      if (this.ctx.state === "suspended") {
        void this.ctx.resume().catch(() => {});
      }
      return this.ctx;
    }

    const AudioCtx =
      window.AudioContext ||
      (window as Window & { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioCtx) return null;

    const ctx = new AudioCtx();
    this.ctx = ctx;

    const master = ctx.createGain();
    master.gain.setValueAtTime(0, ctx.currentTime);
    master.connect(ctx.destination);
    this.masterGain = master;

    this.noiseBuffer = this.createNoiseBuffer(ctx, 2.0);
    this.setupAmbientGraph(ctx, master);
    return ctx;
  }

  private createNoiseBuffer(ctx: AudioContext, seconds: number): AudioBuffer {
    const length = Math.floor(ctx.sampleRate * seconds);
    const buffer = ctx.createBuffer(2, length, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const data = buffer.getChannelData(ch);
      for (let i = 0; i < length; i++) {
        data[i] = Math.random() * 2 - 1;
      }
    }
    return buffer;
  }

  private createReverbImpulse(ctx: AudioContext, duration = 3.5): AudioBuffer {
    const length = Math.floor(ctx.sampleRate * duration);
    const impulse = ctx.createBuffer(2, length, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const channel = impulse.getChannelData(ch);
      for (let i = 0; i < length; i++) {
        const decay = Math.pow(1 - i / length, 2.8);
        channel[i] = (Math.random() * 2 - 1) * decay;
      }
    }
    return impulse;
  }

  private setupAmbientGraph(ctx: AudioContext, master: GainNode): void {
    const ambientGain = ctx.createGain();
    ambientGain.gain.setValueAtTime(1, ctx.currentTime);
    this.ambientGain = ambientGain;

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(380, ctx.currentTime);
    filter.Q.setValueAtTime(2.6, ctx.currentTime);
    this.filterNode = filter;

    // 0.07Hz LFO modulating filter resonance (Q)
    const lfo = ctx.createOscillator();
    lfo.type = "sine";
    lfo.frequency.setValueAtTime(0.07, ctx.currentTime);
    const lfoGain = ctx.createGain();
    lfoGain.gain.setValueAtTime(1.5, ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(filter.Q);
    lfo.start();
    this.lfoOsc = lfo;

    // 3.5s stereo exponentially decaying noise convolver reverb
    const convolver = ctx.createConvolver();
    convolver.buffer = this.createReverbImpulse(ctx, 3.5);
    this.convolverNode = convolver;

    const dry = ctx.createGain();
    dry.gain.setValueAtTime(0.32, ctx.currentTime);
    this.dryGain = dry;

    const wet = ctx.createGain();
    wet.gain.setValueAtTime(0.68, ctx.currentTime);
    this.wetGain = wet;

    // 3 detuned oscillators: A1 (55Hz), E2 (82.41Hz), A2 (110Hz)
    const specs: Array<{ freq: number; type: OscillatorType; detune: number; gain: number }> = [
      { freq: 55.0, type: "triangle", detune: -4, gain: 0.24 },
      { freq: 82.41, type: "sawtooth", detune: 4, gain: 0.09 },
      { freq: 110.0, type: "triangle", detune: 3, gain: 0.14 },
    ];

    this.oscillators = specs.map((spec) => {
      const osc = ctx.createOscillator();
      osc.type = spec.type;
      osc.frequency.setValueAtTime(spec.freq, ctx.currentTime);
      osc.detune.setValueAtTime(spec.detune, ctx.currentTime);

      const oscGain = ctx.createGain();
      oscGain.gain.setValueAtTime(spec.gain, ctx.currentTime);
      osc.connect(oscGain);
      oscGain.connect(filter);
      osc.start();
      return osc;
    });

    filter.connect(dry);
    filter.connect(convolver);
    convolver.connect(wet);
    dry.connect(ambientGain);
    wet.connect(ambientGain);
    ambientGain.connect(master);
  }

  private startPeristalticPulse(): void {
    if (typeof window === "undefined" || this.pulseTimer !== null) return;
    this.triggerPeristalticPulse();
    this.pulseTimer = window.setInterval(() => {
      this.triggerPeristalticPulse();
    }, 2400);
  }

  private stopPeristalticPulse(): void {
    if (this.pulseTimer !== null && typeof window !== "undefined") {
      window.clearInterval(this.pulseTimer);
      this.pulseTimer = null;
    }
  }

  private triggerPeristalticPulse(): void {
    if (!this.enabled || this.trackIndex !== 0 || !this.ctx || !this.filterNode || !this.noiseBuffer) {
      return;
    }
    const ctx = this.ctx;
    const now = ctx.currentTime;

    const src = ctx.createBufferSource();
    src.buffer = this.noiseBuffer;

    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.setValueAtTime(165, now);
    bp.Q.setValueAtTime(3.2, now);

    const pulseGain = ctx.createGain();
    pulseGain.gain.setValueAtTime(0.0001, now);
    pulseGain.gain.exponentialRampToValueAtTime(0.055, now + 0.35);
    pulseGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.35);

    src.connect(bp);
    bp.connect(pulseGain);
    pulseGain.connect(this.filterNode);

    src.start(now);
    src.stop(now + 1.4);
  }

  private async loadManifestOnce(): Promise<void> {
    if (this.manifestFetched || typeof window === "undefined") return;
    this.manifestFetched = true;

    try {
      const res = await fetch("/audio/manifest.json", { cache: "force-cache" });
      if (!res.ok) return;
      const data: unknown = await res.json();
      if (!Array.isArray(data)) return;

      const parsed = data.filter(
        (item): item is AudioTrack =>
          typeof item === "object" &&
          item !== null &&
          typeof (item as { title?: unknown }).title === "string" &&
          typeof (item as { src?: unknown }).src === "string"
      );

      if (parsed.length > 0) {
        this.tracks = parsed;
        useAppStore.getState().set({ audioHasTracks: true });
      }
    } catch {
      // Optional manifest absent — stay silently on generative ambient
    }
  }

  private applyTrackSelection(): void {
    const title =
      this.trackIndex === 0
        ? AMBIENT_TITLE
        : this.tracks[this.trackIndex - 1]?.title ?? AMBIENT_TITLE;

    useAppStore.getState().set({ audioTrackTitle: title });

    if (!this.ctx || !this.masterGain || !this.ambientGain) return;
    const now = this.ctx.currentTime;

    if (this.trackIndex === 0) {
      this.ambientGain.gain.setTargetAtTime(1, now, 0.25);
      if (this.trackGain) {
        this.trackGain.gain.setTargetAtTime(0, now, 0.2);
      }
      if (this.audioEl) {
        this.audioEl.pause();
      }
      if (this.enabled) {
        this.startPeristalticPulse();
      }
      return;
    }

    const track = this.tracks[this.trackIndex - 1];
    if (!track) return;

    this.ambientGain.gain.setTargetAtTime(0, now, 0.25);
    this.stopPeristalticPulse();

    if (!this.audioEl) {
      const el = new Audio();
      el.crossOrigin = "anonymous";
      el.loop = true;
      this.audioEl = el;

      const srcNode = this.ctx.createMediaElementSource(el);
      const tGain = this.ctx.createGain();
      tGain.gain.setValueAtTime(0, now);
      srcNode.connect(tGain);
      tGain.connect(this.masterGain);
      this.mediaSource = srcNode;
      this.trackGain = tGain;
    }

    if (this.audioEl.src !== new URL(track.src, window.location.origin).href) {
      this.audioEl.src = track.src;
    }

    if (this.enabled) {
      this.trackGain?.gain.setTargetAtTime(0.85, now, 0.25);
      void this.audioEl.play().catch(() => {});
    }
  }

  public async setEnabled(next: boolean): Promise<boolean> {
    if (next) {
      const ctx = this.ensureContext();
      if (!ctx || !this.masterGain) return false;
      this.enabled = true;

      if (ctx.state === "suspended") {
        await ctx.resume().catch(() => {});
      }

      const now = ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
      this.masterGain.gain.linearRampToValueAtTime(this.volume, now + 1.2);

      if (this.trackIndex === 0) {
        this.startPeristalticPulse();
      } else if (this.audioEl) {
        void this.audioEl.play().catch(() => {});
      }

      useAppStore.getState().set({ soundOn: true });
      void this.loadManifestOnce();
      return true;
    }

    this.enabled = false;
    this.stopPeristalticPulse();
    if (this.ctx && this.masterGain) {
      const now = this.ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
      this.masterGain.gain.linearRampToValueAtTime(0, now + 0.35);
    }
    if (this.audioEl) {
      this.audioEl.pause();
    }
    useAppStore.getState().set({ soundOn: false });
    return false;
  }

  public async toggle(): Promise<boolean> {
    return this.setEnabled(!this.enabled);
  }

  public setVolume(value: number): void {
    this.volume = clamp(value, 0, 1);
    if (this.enabled && this.ctx && this.masterGain) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.08);
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public setVelocity(velocity: number): void {
    this.targetVelocity = velocity;
    if (!this.ctx || !this.filterNode || !this.enabled) return;
    const cutoff = clamp(380 + Math.abs(this.targetVelocity) * 6, 380, 1800);
    this.filterNode.frequency.setTargetAtTime(cutoff, this.ctx.currentTime, 0.12);
  }

  public next(): void {
    const total = 1 + this.tracks.length;
    if (total <= 1) return;
    this.trackIndex = (this.trackIndex + 1) % total;
    this.applyTrackSelection();
  }

  public prev(): void {
    const total = 1 + this.tracks.length;
    if (total <= 1) return;
    this.trackIndex = (this.trackIndex - 1 + total) % total;
    this.applyTrackSelection();
  }

  public playTick(): void {
    if (!this.enabled || !this.ctx || !this.masterGain) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(2400, now);

    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, now);
    g.gain.linearRampToValueAtTime(0.05, now + 0.002);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.025);

    osc.connect(g);
    g.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.03);
  }

  public playWhoosh(): void {
    if (!this.enabled || !this.ctx || !this.masterGain || !this.noiseBuffer) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    const src = ctx.createBufferSource();
    src.buffer = this.noiseBuffer;

    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.Q.setValueAtTime(1.8, now);
    bp.frequency.setValueAtTime(240, now);
    bp.frequency.exponentialRampToValueAtTime(1500, now + 0.25);
    bp.frequency.exponentialRampToValueAtTime(280, now + 0.6);

    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, now);
    g.gain.linearRampToValueAtTime(0.14, now + 0.14);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);

    src.connect(bp);
    bp.connect(g);
    g.connect(this.masterGain);

    src.start(now);
    src.stop(now + 0.62);
  }

  public playCopy(): void {
    if (!this.enabled || !this.ctx || !this.masterGain) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    [880, 1320].forEach((freq, idx) => {
      const start = now + idx * 0.055;
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, start);

      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, start);
      g.gain.linearRampToValueAtTime(0.08, start + 0.005);
      g.gain.exponentialRampToValueAtTime(0.0001, start + 0.09);

      osc.connect(g);
      g.connect(this.masterGain!);
      osc.start(start);
      osc.stop(start + 0.1);
    });
  }

  public dispose(): void {
    this.stopPeristalticPulse();
    this.oscillators.forEach((osc) => {
      try {
        osc.stop();
      } catch {
        // Ignore already stopped oscillator
      }
    });
    this.oscillators = [];
    try {
      this.lfoOsc?.stop();
    } catch {
      // Ignore
    }
    this.lfoOsc = null;
    if (this.audioEl) {
      this.audioEl.pause();
      this.audioEl = null;
    }
    this.mediaSource = null;
    this.convolverNode = null;
    this.dryGain = null;
    this.wetGain = null;
    this.filterNode = null;
    this.ambientGain = null;
    this.masterGain = null;
    if (this.ctx) {
      void this.ctx.close().catch(() => {});
      this.ctx = null;
    }
  }
}

export const audioEngine = new AudioEngine();
