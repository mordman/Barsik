import { NEEDS, NEED_ORDER } from '../config/needs.js';

const clamp = value => Math.max(0, Math.min(100, value));

export class NeedsSystem {
  constructor(state, bus) {
    this.state = state;
    this.bus = bus;
    this.warnCooldown = 0;
  }

  update(dt) {
    const { needs, cat } = this.state;
    const sleeping = cat.state === 'sleep';

    for (const key of NEED_ORDER) {
      const definition = NEEDS[key];
      let change = -definition.decay * dt;
      if (sleeping && definition.sleepMul) change *= definition.sleepMul;
      if (sleeping && definition.sleepRegen) change += definition.sleepRegen * dt;
      needs[key] = clamp(needs[key] + change);
    }

    this.warnCooldown = Math.max(0, this.warnCooldown - dt);
    if (this.warnCooldown > 0) return;

    const critical = NEED_ORDER.find(key => needs[key] < 20);
    if (critical) {
      this.bus.emit('toast', { msg: NEEDS[critical].warn });
      this.warnCooldown = 12;
    }
  }
}
