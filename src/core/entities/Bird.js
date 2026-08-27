import { BIRD_INTERACT } from '../config/interacts.js';

export class Bird {
  constructor(state, bus) { this.state = state; this.bus = bus; }

  update(dt) {
    const b = this.state.bird;
    BIRD_INTERACT.x = b.x;                    // интеракт следует за птичкой

    if (b.flying > 0) {
      b.flying += dt;
      if (b.flying > 1.7) { b.flying = 0; b.x = 9 + Math.random() * 5; b.tx = b.x; }
      return;
    }
    b.hopT = (b.hopT ?? 4) - dt;
    if (b.hopT <= 0) {
      b.tx = Math.max(9, Math.min(14, b.x + (Math.random() * 4 - 2)));
      b.hopT = 3 + Math.random() * 4;
    }
    b.x += (b.tx - b.x) * dt * 1.5;
/*
    // кот подошёл вплотную — птичка вспархивает
    const c = this.state.cat;
    if (c.state !== 'stalk' && Math.hypot(c.x - b.x, c.y - 12.8) < .95) {
      b.flying = .01;
      this.state.needs.fun = Math.min(100, this.state.needs.fun + 6);
      this.bus.emit('toast', { msg: 'Птичка вспорхнула! 🕊️' });
    }
*/
        const c = this.state.cat;
    // кот подкрался в стойке
    if (c.state === 'stalk' && c.actionT > 1.5 && b.flying <= 0) {
      b.flying = .01; this.bus.emit('bird:fly');
    }
    // подошёл вплотную — вспорхнула
    else if (c.state !== 'stalk' && Math.hypot(c.x - b.x, c.y - 12.8) < .95) {
      b.flying = .01; this.bus.emit('bird:fly');
      this.state.needs.fun = Math.min(100, this.state.needs.fun + 6);
      this.bus.emit('toast', { msg: 'Птичка вспорхнула! 🕊️' });
    }
  }
}