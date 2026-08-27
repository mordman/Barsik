import { INTERACTS } from '../config/interacts.js';

export class InteractionSystem {
  constructor(state, bus, actions) {
    this.state = state; this.bus = bus; this.actions = actions;
    this.nearest = null;
    bus.on('input:interact', () => this.onE());
  }

  onE() {
    const c = this.state.cat;
    if (c.state === 'sleep') {
      this.actions.interrupt();
      this.bus.emit('toast', { msg: 'Потягушки! 😺' });
      return;
    }
    if (this.nearest) this.actions.start(this.nearest.id, this.nearest);
  }

  update() {
    const c = this.state.cat;
    let best = null, bd = 1e9;
    for (const it of INTERACTS) {
      if (it.when && !it.when(this.state)) continue;
      const d = Math.hypot(c.x - it.x, c.y - it.y);
      if (d < it.r && d < bd) { bd = d; best = it; }
    }
    this.nearest = c.action ? null : best;        // во время дела подсказку прячем
    this.state.interact = this.nearest ? this.nearest.key : null;
  }
}