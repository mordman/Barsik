import { rand } from './utils.js';

export class AudioManager {
  constructor(bus) {
    this.bus = bus; this.ac = null; this.master = null; this.noise = null; this.muted = false;

    bus.on('input:meow', () => { this.ensure(); this.meow(rand(.9, 1.15)); });
    bus.on('cat:pet', () => { this.ensure(); this.purr(); });
    bus.on('action:start', ({ id }) => { this.ensure(); this.onAction(id); });
    bus.on('catch:butterfly', () => { this.ensure(); this.sparkle(); });
    bus.on('bowl:refill', () => { this.ensure(); this.sparkle(); });
    bus.on('bird:fly', () => { this.ensure(); this.chirp(); });
    bus.on('need:low', () => { this.ensure(); this.blip(); });
    bus.on('ui:toggleSound', () => this.toggle());

    const unlock = () => this.ensure();
    document.addEventListener('pointerdown', unlock);
    document.addEventListener('keydown', unlock);
  }

  ensure() {
    if (!this.ac) {
      try {
        this.ac = new (window.AudioContext || window.webkitAudioContext)();
        this.master = this.ac.createGain();
        this.master.gain.value = this.muted ? 0 : .5;
        this.master.connect(this.ac.destination);
        const b = this.ac.createBuffer(1, this.ac.sampleRate * .3, this.ac.sampleRate);
        const d = b.getChannelData(0);
        for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
        this.noise = b;
      } catch (e) { return; }
    }
    if (this.ac.state === 'suspended') this.ac.resume();
  }

  toggle() { this.muted = !this.muted; if (this.master) this.master.gain.value = this.muted ? 0 : .5; }

  tone(f0, f1, dur, type = 'triangle', vol = .12, delay = 0) {
    if (!this.ac) return;
    const t = this.ac.currentTime + delay;
    const o = this.ac.createOscillator(), g = this.ac.createGain();
    o.type = type;
    o.frequency.setValueAtTime(f0, t);
    o.frequency.linearRampToValueAtTime(f1, t + dur);
    g.gain.setValueAtTime(.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + .04);
    g.gain.exponentialRampToValueAtTime(.0001, t + dur);
    o.connect(g).connect(this.master);
    o.start(t); o.stop(t + dur + .02);
  }

  meow(p = 1) {
    this.tone(520 * p, 880 * p, .09, 'triangle', .13);
    this.tone(880 * p, 380 * p, .3, 'triangle', .11, .09);
  }
  purr() {
    if (!this.ac) return;
    const t = this.ac.currentTime;
    const o = this.ac.createOscillator(), g = this.ac.createGain();
    const l = this.ac.createOscillator(), lg = this.ac.createGain();
    o.type = 'sawtooth'; o.frequency.value = 52;
    l.frequency.value = 23; lg.gain.value = .045;
    g.gain.setValueAtTime(.05, t);
    g.gain.linearRampToValueAtTime(.0001, t + .9);
    l.connect(lg).connect(g.gain);
    o.connect(g).connect(this.master);
    o.start(t); l.start(t); o.stop(t + .9); l.stop(t + .9);
  }
  crunch() {
    if (!this.ac) return;
    for (let i = 0; i < 3; i++) {
      const t = this.ac.currentTime + i * .16;
      const s = this.ac.createBufferSource(); s.buffer = this.noise;
      const f = this.ac.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 900 + Math.random() * 700;
      const g = this.ac.createGain();
      g.gain.setValueAtTime(.12, t);
      g.gain.exponentialRampToValueAtTime(.001, t + .07);
      s.connect(f).connect(g).connect(this.master);
      s.start(t); s.stop(t + .08);
    }
  }
  sparkle() { this.tone(1568, 1568, .1, 'sine', .06); this.tone(1976, 1976, .14, 'sine', .06, .09); }
  chirp() { this.tone(2400, 3100, .07, 'square', .05); this.tone(2900, 2300, .09, 'square', .05, .09); }
  sleepTune() { this.tone(392, 392, .25, 'sine', .07); this.tone(330, 330, .25, 'sine', .07, .28); this.tone(262, 262, .4, 'sine', .07, .56); }
  hop() { this.tone(220, 340, .09, 'square', .06); }
  blip() { this.tone(660, 660, .06, 'sine', .05); }

  onAction(id) {
    if (id === 'food') this.crunch();
    else if (id === 'bed') this.sleepTune();
    else if (id === 'yarn' || id === 'scratch') this.hop();
  }
}