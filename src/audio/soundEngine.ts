// Procedural Web Audio Sound Engine for Farhan P. Zamma Cinematic Experience
// Delivers realistic cinema soundscapes with zero external dependencies (TypeScript)

class SoundEngine {
  private ctx: AudioContext | null = null;
  public isMuted: boolean = true; // Default muted per web standards
  private projectorOsc: OscillatorNode | null = null;
  private projectorGain: GainNode | null = null;
  private isProjectorRunning: boolean = false;
  private listeners: Set<(isMuted: boolean) => void> = new Set();
  private peacefulOscs: OscillatorNode[] = [];
  private peacefulGain: GainNode | null = null;
  private peacefulFilter: BiquadFilterNode | null = null;
  private peacefulLfo: OscillatorNode | null = null;
  private peacefulLfoGain: GainNode | null = null;
  private chimeInterval: ReturnType<typeof setInterval> | null = null;
  private isPeacefulRunning: boolean = false;

  public init(): void {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
  }

  public subscribe(cb: (isMuted: boolean) => void): () => void {
    this.listeners.add(cb);
    return () => {
      this.listeners.delete(cb);
    };
  }

  private notify(): void {
    this.listeners.forEach((cb) => {
      try {
        cb(this.isMuted);
      } catch (err) {
        console.warn("Audio listener error", err);
      }
    });
  }

  public unmute(): void {
    this.init();
    this.isMuted = false;
    this.notify();
  }

  public toggleSound(): boolean {
    this.init();
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.stopProjectorHum();
      this.stopPeacefulAmbient();
    } else {
      this.playWhoosh();
      this.startPeacefulAmbient();
    }
    this.notify();
    return !this.isMuted;
  }

  public setMuted(muted: boolean): void {
    this.init();
    this.isMuted = muted;
    if (this.isMuted) {
      this.stopProjectorHum();
      this.stopPeacefulAmbient();
    } else {
      this.startPeacefulAmbient();
    }
    this.notify();
  }

  // Clapperboard "CLACK!" snap
  public playClapperSnap(): void {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const bufferSize = Math.floor(this.ctx.sampleRate * 0.08);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.15));
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(1400, t);
    filter.Q.setValueAtTime(3.5, t);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.9, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

    const osc = this.ctx.createOscillator();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(220, t);
    osc.frequency.exponentialRampToValueAtTime(45, t + 0.05);

    const oscGain = this.ctx.createGain();
    oscGain.gain.setValueAtTime(0.6, t);
    oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.connect(oscGain);
    oscGain.connect(this.ctx.destination);

    noise.start(t);
    osc.start(t);
    osc.stop(t + 0.07);
  }

  // Camera Shutter Actuation
  public playCameraShutter(): void {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc1 = this.ctx.createOscillator();
    osc1.type = "square";
    osc1.frequency.setValueAtTime(1200, t);
    osc1.frequency.exponentialRampToValueAtTime(120, t + 0.025);

    const gain1 = this.ctx.createGain();
    gain1.gain.setValueAtTime(0.4, t);
    gain1.gain.exponentialRampToValueAtTime(0.01, t + 0.03);

    const osc2 = this.ctx.createOscillator();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(800, t + 0.04);
    osc2.frequency.exponentialRampToValueAtTime(80, t + 0.07);

    const gain2 = this.ctx.createGain();
    gain2.gain.setValueAtTime(0.001, t);
    gain2.gain.setValueAtTime(0.3, t + 0.04);
    gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.075);

    osc1.connect(gain1);
    gain1.connect(this.ctx.destination);
    osc2.connect(gain2);
    gain2.connect(this.ctx.destination);

    osc1.start(t);
    osc1.stop(t + 0.03);
    osc2.start(t + 0.04);
    osc2.stop(t + 0.08);
  }

  // Studio REC Tally Tone (1kHz confirmation chime)
  public playRecBeep(): void {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(1000, t);
    osc.frequency.setValueAtTime(1500, t + 0.08);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.15, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.25);
  }

  // Cinematic Sub-Bass Whoosh
  public playWhoosh(): void {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(180, t);
    osc.frequency.exponentialRampToValueAtTime(35, t + 0.45);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.4, t + 0.12);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.52);
  }

  // Rack Focus Lens Servo Motor Click
  public playLensRack(): void {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(600, t);
    osc.frequency.linearRampToValueAtTime(950, t + 0.06);

    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(1200, t);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.08, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.07);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.08);
  }

  // Film Reel Sprocket Tick
  public playFilmSprocketTick(): void {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(440, t);
    osc.frequency.exponentialRampToValueAtTime(110, t + 0.015);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.12, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.02);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.025);
  }

  // 35mm Film Projector Motor Hum
  public startProjectorHum(): void {
    if (this.isMuted || this.isProjectorRunning) return;
    this.init();
    if (!this.ctx) return;

    try {
      const t = this.ctx.currentTime;
      this.projectorOsc = this.ctx.createOscillator();
      this.projectorOsc.type = "triangle";
      this.projectorOsc.frequency.setValueAtTime(58, t);

      const filter = this.ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(180, t);

      this.projectorGain = this.ctx.createGain();
      this.projectorGain.gain.setValueAtTime(0.001, t);
      this.projectorGain.gain.linearRampToValueAtTime(0.08, t + 1.5);

      this.projectorOsc.connect(filter);
      filter.connect(this.projectorGain);
      this.projectorGain.connect(this.ctx.destination);

      this.projectorOsc.start(t);
      this.isProjectorRunning = true;
    } catch (e) {
      console.warn("Could not start projector hum", e);
    }
  }

  public stopProjectorHum(): void {
    if (this.projectorOsc && this.isProjectorRunning && this.ctx) {
      try {
        const t = this.ctx.currentTime;
        if (this.projectorGain) {
          this.projectorGain.gain.linearRampToValueAtTime(0.001, t + 0.4);
        }
      } catch (e) {}
      this.projectorOsc = null;
      this.projectorGain = null;
      this.isProjectorRunning = false;
    }
  }

  // Grand Cinema Velvet Curtain Opening Swell
  public playCurtainOpening(): void {
    this.init();
    if (!this.ctx) return;

    try {
      const t = this.ctx.currentTime;

      // 1. Velvet Fabric Whoosh / Rustle (Low-pass filtered pink noise)
      const bufferSize = Math.floor(this.ctx.sampleRate * 1.8);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        data[i] = (b0 + b1 + b2) * 0.3 * Math.sin((i / bufferSize) * Math.PI);
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const noiseFilter = this.ctx.createBiquadFilter();
      noiseFilter.type = "bandpass";
      noiseFilter.frequency.setValueAtTime(320, t);
      noiseFilter.frequency.exponentialRampToValueAtTime(800, t + 1.2);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.001, t);
      noiseGain.gain.linearRampToValueAtTime(0.35, t + 0.5);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 1.8);

      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);
      noise.start(t);

      // 2. Cinematic Golden Fanfare Harmonic Swell (Chords: D2 -> A2 -> D3 -> F#3)
      const freqs = [73.42, 110.0, 146.83, 185.0, 293.66]; // D2, A2, D3, F#3, D4
      freqs.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = idx === 0 ? "sawtooth" : "sine";
        osc.frequency.setValueAtTime(freq, t);

        const startTime = t + idx * 0.08;
        gain.gain.setValueAtTime(0.0001, t);
        gain.gain.linearRampToValueAtTime(0.06 / (idx + 1), startTime + 0.6);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 2.4);

        const chordFilter = this.ctx.createBiquadFilter();
        chordFilter.type = "lowpass";
        chordFilter.frequency.setValueAtTime(800, t);
        chordFilter.frequency.linearRampToValueAtTime(2400, t + 1.2);

        osc.connect(chordFilter);
        chordFilter.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 2.5);
      });
    } catch (e) {
      console.warn("Could not play curtain opening sound", e);
    }
  }

  // Realistic Stereo Audience Applause & Clapping for Grand Premiere Curtain Opening
  public playAudienceApplause(): void {
    this.init();
    if (!this.ctx) return;

    try {
      const sampleRate = this.ctx.sampleRate;
      const duration = 4.8; // 4.8s of authentic audience applause
      const numFrames = Math.floor(sampleRate * duration);
      const buffer = this.ctx.createBuffer(2, numFrames, sampleRate);
      const leftChannel = buffer.getChannelData(0);
      const rightChannel = buffer.getChannelData(1);

      // Generate 750 individual randomized hand-clap impulses
      const numClaps = 750;
      for (let c = 0; c < numClaps; c++) {
        // Natural distribution: early clappers -> rapid swell -> enthusiastic peak -> graceful decay
        let timeSec: number;
        const r = Math.random();
        if (r < 0.08) {
          timeSec = Math.random() * 0.4;
        } else if (r < 0.68) {
          timeSec = 0.4 + Math.random() * 2.2;
        } else {
          timeSec = 2.6 + Math.random() * 2.1;
        }

        const startSample = Math.floor(timeSec * sampleRate);
        if (startSample >= numFrames) continue;

        // Individual hand-clap duration: 16ms - 30ms
        const clapDuration = 0.016 + Math.random() * 0.014;
        const clapSamples = Math.floor(clapDuration * sampleRate);

        // Applause volume curve across duration
        let crowdEnvelope = 1.0;
        if (timeSec < 0.4) {
          crowdEnvelope = (timeSec / 0.4) * 0.5;
        } else if (timeSec < 1.3) {
          crowdEnvelope = 0.5 + ((timeSec - 0.4) / 0.9) * 0.5;
        } else if (timeSec < 3.0) {
          crowdEnvelope = 1.0;
        } else {
          crowdEnvelope = Math.max(0, 1.0 - (timeSec - 3.0) / 1.7);
        }

        // Stereo panning: spread audience from left to right
        const pan = (Math.random() * 2 - 1) * 0.85;
        const gainL = Math.cos(((pan + 1) * Math.PI) / 4);
        const gainR = Math.sin(((pan + 1) * Math.PI) / 4);

        // Acoustic resonance: hand cavity resonance (900Hz - 2200Hz)
        const clapFreq = 950 + Math.random() * 1250;
        const decayRate = 190 + Math.random() * 90;
        const clapVol = (0.22 + Math.random() * 0.38) * crowdEnvelope;

        for (let i = 0; i < clapSamples && startSample + i < numFrames; i++) {
          const t = i / sampleRate;
          const noise = (Math.random() * 2 - 1) * 0.65;
          const resonance = Math.sin(2 * Math.PI * clapFreq * t) * 0.35;
          const env = Math.exp(-decayRate * t);
          const val = (noise + resonance) * env * clapVol;

          leftChannel[startSample + i] += val * gainL;
          rightChannel[startSample + i] += val * gainR;
        }
      }

      // Add diffuse ambient theater room murmur & acoustics layer
      let b0L = 0, b1L = 0, b0R = 0, b1R = 0;
      for (let i = 0; i < numFrames; i++) {
        const tSec = i / sampleRate;
        let crowdSwell = 0;
        if (tSec < 0.6) {
          crowdSwell = (tSec / 0.6) * 0.5;
        } else if (tSec < 1.6) {
          crowdSwell = 0.5 + ((tSec - 0.6) / 1.0) * 0.5;
        } else if (tSec < 3.2) {
          crowdSwell = 1.0;
        } else {
          crowdSwell = Math.max(0, 1.0 - (tSec - 3.2) / 1.5);
        }

        const whiteL = Math.random() * 2 - 1;
        const whiteR = Math.random() * 2 - 1;
        b0L = 0.94 * b0L + whiteL * 0.06;
        b1L = 0.92 * b1L + b0L * 0.08;
        b0R = 0.94 * b0R + whiteR * 0.06;
        b1R = 0.92 * b1R + b0R * 0.08;

        leftChannel[i] += b1L * 0.14 * crowdSwell;
        rightChannel[i] += b1R * 0.14 * crowdSwell;
      }

      const source = this.ctx.createBufferSource();
      source.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(1350, this.ctx.currentTime);
      filter.Q.setValueAtTime(0.85, this.ctx.currentTime);

      const gain = this.ctx.createGain();
      const t = this.ctx.currentTime;
      gain.gain.setValueAtTime(0.01, t);
      gain.gain.linearRampToValueAtTime(0.85, t + 0.45);
      gain.gain.setValueAtTime(0.85, t + 2.8);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 4.75);

      source.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      source.start(t);
    } catch (err) {
      console.warn("Could not play audience applause", err);
    }
  }

  // Peaceful, Serene Cinematic Ambient Soundscape that plays throughout the experience
  public startPeacefulAmbient(): void {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    if (this.isPeacefulRunning) return;

    try {
      const t = this.ctx.currentTime;
      this.isPeacefulRunning = true;

      // Master gain for the peaceful soundscape (gentle, calming background level)
      this.peacefulGain = this.ctx.createGain();
      this.peacefulGain.gain.setValueAtTime(0.0001, t);
      this.peacefulGain.gain.linearRampToValueAtTime(0.09, t + 2.5);

      // Lowpass filter for warm cinematic analog feel
      this.peacefulFilter = this.ctx.createBiquadFilter();
      this.peacefulFilter.type = "lowpass";
      this.peacefulFilter.frequency.setValueAtTime(540, t);
      this.peacefulFilter.Q.setValueAtTime(1.2, t);

      // Gentle LFO modulating the filter for slow, peaceful organic "breathing"
      this.peacefulLfo = this.ctx.createOscillator();
      this.peacefulLfo.type = "sine";
      this.peacefulLfo.frequency.setValueAtTime(0.06, t); // 16-second calm breath cycle

      this.peacefulLfoGain = this.ctx.createGain();
      this.peacefulLfoGain.gain.setValueAtTime(180, t);

      this.peacefulLfo.connect(this.peacefulLfoGain);
      this.peacefulLfoGain.connect(this.peacefulFilter.frequency);
      this.peacefulLfo.start(t);

      // Warm cinematic harmonic pad chords (D2, A2, D3, F#3, A3, E4)
      const chordNotes = [
        { freq: 73.42, type: "sine" as OscillatorType, detune: 0, gain: 0.28 },     // D2 (sub warmth)
        { freq: 110.0, type: "sine" as OscillatorType, detune: -3, gain: 0.22 },    // A2 (peaceful fifth)
        { freq: 146.83, type: "sine" as OscillatorType, detune: 2, gain: 0.18 },    // D3 (root)
        { freq: 185.0, type: "sine" as OscillatorType, detune: -2, gain: 0.16 },    // F#3 (warm major third)
        { freq: 220.0, type: "triangle" as OscillatorType, detune: 3, gain: 0.12 }, // A3 (upper fifth)
        { freq: 329.63, type: "sine" as OscillatorType, detune: -1, gain: 0.08 },   // E4 (peaceful ninth)
      ];

      this.peacefulOscs = [];
      chordNotes.forEach((note) => {
        if (!this.ctx || !this.peacefulFilter) return;
        const osc = this.ctx.createOscillator();
        const oscGain = this.ctx.createGain();

        osc.type = note.type;
        osc.frequency.setValueAtTime(note.freq, t);
        osc.detune.setValueAtTime(note.detune, t);

        oscGain.gain.setValueAtTime(note.gain, t);

        osc.connect(oscGain);
        oscGain.connect(this.peacefulFilter);
        osc.start(t);
        this.peacefulOscs.push(osc);
      });

      this.peacefulFilter.connect(this.peacefulGain);
      this.peacefulGain.connect(this.ctx.destination);

      // Periodic subtle celestial chime harmonics (pentatonic D5, E5, F#5, A5, B5)
      const chimeFreqs = [587.33, 659.25, 739.99, 880.0, 987.77];
      this.chimeInterval = setInterval(() => {
        if (this.isMuted || !this.isPeacefulRunning || !this.ctx) return;
        try {
          const chimeTime = this.ctx.currentTime;
          const chimeOsc = this.ctx.createOscillator();
          const chimeGain = this.ctx.createGain();

          const randomFreq = chimeFreqs[Math.floor(Math.random() * chimeFreqs.length)];
          chimeOsc.type = "sine";
          chimeOsc.frequency.setValueAtTime(randomFreq, chimeTime);

          chimeGain.gain.setValueAtTime(0.0001, chimeTime);
          chimeGain.gain.linearRampToValueAtTime(0.035, chimeTime + 0.08);
          chimeGain.gain.exponentialRampToValueAtTime(0.0001, chimeTime + 3.4);

          chimeOsc.connect(chimeGain);
          chimeGain.connect(this.ctx.destination);

          chimeOsc.start(chimeTime);
          chimeOsc.stop(chimeTime + 3.5);
        } catch (e) {}
      }, 4500);

    } catch (err) {
      console.warn("Could not start peaceful ambient soundscape", err);
    }
  }

  public stopPeacefulAmbient(): void {
    if (this.chimeInterval) {
      clearInterval(this.chimeInterval);
      this.chimeInterval = null;
    }

    if (this.peacefulGain && this.ctx) {
      try {
        const t = this.ctx.currentTime;
        this.peacefulGain.gain.linearRampToValueAtTime(0.0001, t + 0.8);
      } catch (e) {}
    }

    setTimeout(() => {
      this.peacefulOscs.forEach((osc) => {
        try {
          osc.stop();
          osc.disconnect();
        } catch (e) {}
      });
      this.peacefulOscs = [];

      if (this.peacefulLfo) {
        try {
          this.peacefulLfo.stop();
          this.peacefulLfo.disconnect();
        } catch (e) {}
        this.peacefulLfo = null;
      }

      this.peacefulGain = null;
      this.peacefulFilter = null;
      this.peacefulLfoGain = null;
      this.isPeacefulRunning = false;
    }, 900);
  }
}

export const soundEngine = new SoundEngine();
