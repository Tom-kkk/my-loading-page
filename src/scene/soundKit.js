const PENTATONIC = [72, 74, 76, 79, 81, 84, 86, 88]; // C5 D5 E5 G5 A5 C6 D6 E6

function midiToHz(m) {
  return 440 * Math.pow(2, (m - 69) / 12);
}

export class SoundKit {
  constructor() {
    this.ctx = null;
    this.master = null;
    this.reverbSend = null;
    this.noise = null;
    this.enabled = true;
    this.lastHoverAt = 0;
  }

  ensure() {
    if (!this.enabled) return null;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return null;
    if (!this.ctx) {
      const ctx = new AudioCtx();
      const master = ctx.createGain();
      master.gain.value = 0.42;
      master.connect(ctx.destination);

      const reverb = this.makeReverb(ctx, 2.0, 0.28);
      const reverbSend = ctx.createGain();
      reverbSend.gain.value = 0.28;
      reverbSend.connect(reverb).connect(master);

      this.ctx = ctx;
      this.master = master;
      this.reverbSend = reverbSend;
      this.noise = this.makeNoise(ctx);
    }
    if (this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  setEnabled(next) {
    this.enabled = Boolean(next);
    if (this.master && this.ctx) {
      this.master.gain.setTargetAtTime(this.enabled ? 0.42 : 0.0001, this.ctx.currentTime, 0.04);
    }
    if (this.enabled) this.ensure();
  }

  makeReverb(ctx, seconds, damp) {
    const len = Math.floor(ctx.sampleRate * seconds);
    const buf = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch += 1) {
      const data = buf.getChannelData(ch);
      for (let i = 0; i < len; i += 1) {
        const decay = Math.pow(1 - i / len, 2.6);
        data[i] = (Math.random() * 2 - 1) * decay * damp;
      }
    }
    const convolver = ctx.createConvolver();
    convolver.buffer = buf;
    return convolver;
  }

  makeNoise(ctx) {
    const len = ctx.sampleRate * 1.2;
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i += 1) data[i] = Math.random() * 2 - 1;
    return buf;
  }

  chime(midi, { volume = 0.09, decay = 0.65, delay = 0, type = "sine" } = {}) {
    const ctx = this.ensure();
    if (!ctx) return;
    const now = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const overtone = ctx.createOscillator();
    const gain = ctx.createGain();
    const overGain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(midiToHz(midi), now);
    overtone.type = "triangle";
    overtone.frequency.setValueAtTime(midiToHz(midi) * 2, now);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(volume, now + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + decay);

    overGain.gain.setValueAtTime(volume * 0.22, now);
    overGain.gain.exponentialRampToValueAtTime(0.0001, now + decay * 0.45);

    osc.connect(gain);
    overtone.connect(overGain).connect(gain);
    gain.connect(this.master);
    gain.connect(this.reverbSend);

    osc.start(now);
    overtone.start(now);
    osc.stop(now + decay + 0.05);
    overtone.stop(now + decay + 0.05);
  }

  paper(volume = 0.14, duration = 0.28) {
    const ctx = this.ensure();
    if (!ctx || !this.noise) return;
    const now = ctx.currentTime;
    const src = ctx.createBufferSource();
    src.buffer = this.noise;
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(1600, now);
    filter.frequency.exponentialRampToValueAtTime(720, now + duration);
    filter.Q.value = 1.4;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(volume, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    src.connect(filter).connect(gain);
    gain.connect(this.master);
    gain.connect(this.reverbSend);
    src.start(now);
    src.stop(now + duration + 0.04);
  }

  hoverBook(index) {
    const now = performance.now();
    if (now - this.lastHoverAt < 120) return;
    this.lastHoverAt = now;
    const note = PENTATONIC[index % 4];
    this.chime(note, { volume: 0.052, decay: 0.52 });
  }

  openBook() {
    this.paper(0.16, 0.34);
    this.chime(72, { volume: 0.075, decay: 0.65, delay: 0.03 });
    this.chime(79, { volume: 0.065, decay: 0.75, delay: 0.11 });
  }

  turnPage() {
    this.paper(0.12, 0.24);
  }

  closeBook() {
    this.paper(0.09, 0.2);
    const ctx = this.ensure();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(64, now + 0.12);
    gain.gain.setValueAtTime(0.11, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.14);
    osc.connect(gain).connect(this.master);
    osc.start(now);
    osc.stop(now + 0.16);
  }

  clickLamp(on) {
    const ctx = this.ensure();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(on ? 520 : 380, now);
    osc.frequency.exponentialRampToValueAtTime(on ? 980 : 210, now + 0.055);
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.07);
    osc.connect(gain).connect(this.master);
    osc.start(now);
    osc.stop(now + 0.08);
    this.chime(on ? 79 : 74, { volume: 0.055, decay: 0.45, delay: 0.03 });
  }

  clickMoon() {
    [79, 84, 88].forEach((n, i) => {
      this.chime(n, { volume: 0.065, decay: 0.7, delay: i * 0.075 });
    });
  }

  clickOrnament(kind) {
    if (kind === "owl") {
      const ctx = this.ensure();
      if (!ctx) return;
      // 两段轻柔猫头鹰咕咕声（hoo - hooo）+ 轻微振翅声
      const hoot = (delay, startHz, endHz, dur, vol) => {
        const now = ctx.currentTime + delay;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(startHz, now);
        osc.frequency.exponentialRampToValueAtTime(endHz, now + dur);
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.linearRampToValueAtTime(vol, now + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + dur + 0.04);
        osc.connect(gain).connect(this.master);
        gain.connect(this.reverbSend);
        osc.start(now);
        osc.stop(now + dur + 0.06);
      };
      hoot(0, 470, 390, 0.16, 0.075);
      hoot(0.22, 440, 320, 0.28, 0.085);
      this.paper(0.06, 0.18);
      return;
    }
    if (kind === "rose") {
      // 小王子玫瑰：轻柔梦幻的五音竖琴琶音
      [72, 76, 79, 83, 86].forEach((note, i) => {
        this.chime(note, { volume: 0.068, decay: 1.05, delay: i * 0.085, type: "triangle" });
      });
      return;
    }
    if (kind === "rocket") {
      const ctx = this.ensure();
      if (!ctx || !this.noise) return;
      const now = ctx.currentTime;
      const src = ctx.createBufferSource();
      src.buffer = this.noise;
      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(260, now);
      filter.frequency.exponentialRampToValueAtTime(1400, now + 0.55);
      filter.frequency.exponentialRampToValueAtTime(380, now + 1.25);
      filter.Q.value = 1.6;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.18, now + 0.35);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.3);
      src.connect(filter).connect(gain);
      gain.connect(this.master);
      gain.connect(this.reverbSend);
      src.start(now);
      src.stop(now + 1.35);
      this.chime(76, { volume: 0.055, decay: 0.45, delay: 0.38 });
      this.chime(84, { volume: 0.06, decay: 0.55, delay: 0.52 });
      return;
    }
    const idx = kind === "cat" ? 4 : 3;
    this.chime(PENTATONIC[idx], { volume: 0.075, decay: 0.55 });
  }

  catMeow(playful = true) {
    const ctx = this.ensure();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc.type = "triangle";
    const startHz = playful ? 540 : 620;
    const peakHz = playful ? 820 : 710;
    const endHz = playful ? 460 : 410;
    osc.frequency.setValueAtTime(startHz, now);
    osc.frequency.exponentialRampToValueAtTime(peakHz, now + 0.11);
    osc.frequency.exponentialRampToValueAtTime(endHz, now + 0.34);

    filter.type = "bandpass";
    filter.frequency.setValueAtTime(1100, now);
    filter.frequency.exponentialRampToValueAtTime(1650, now + 0.12);
    filter.frequency.exponentialRampToValueAtTime(920, now + 0.34);
    filter.Q.value = 3.2;

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.14, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.36);

    osc.connect(filter).connect(gain);
    gain.connect(this.master);
    gain.connect(this.reverbSend);
    osc.start(now);
    osc.stop(now + 0.38);
  }

  rocketLand() {
    this.paper(0.08, 0.18);
    this.chime(79, { volume: 0.06, decay: 0.5 });
  }

  celebrate() {
    [72, 76, 79, 84, 88].forEach((note, i) => {
      this.chime(note, { volume: 0.085, decay: 1.15, delay: i * 0.11 });
    });
  }

  dispose() {
    if (this.ctx) {
      this.ctx.close().catch(() => {});
      this.ctx = null;
    }
  }
}
