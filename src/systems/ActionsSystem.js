import { ACTIONS } from '../config/actions.js';

export class ActionsSystem {
  constructor(state, bus) { this.state = state; this.bus = bus; }

  start(id, it) {
    const s = this.state, c = s.cat, def = ACTIONS[id];
    if (!def) return;
    this.interrupt(true);
    if (def.canStart && !def.canStart(s)) {
      if (def.denyMsg) this.bus.emit('toast', { msg: def.denyMsg });
      return;
    }
    def.place(c, it, s);
    c.state = def.state; c.action = id; c.actionT = 0;
    c.path = null; c.pending = null; c.locked = true;
    this.bus.emit('action:start', { id });
  }

  update(dt) {
    const s = this.state, c = s.cat;
    if (!c.action) return;
    const def = ACTIONS[c.action];
    c.actionT += dt;
    def.onUpdate?.(s, dt, c);
    if (def.fx && Math.random() < dt * def.fx.rate)
      this.bus.emit('fx:spawn', { type: def.fx.type, x: def.fx.x, y: def.fx.y, n: 1 });
    const byTime = def.dur !== Infinity && c.actionT >= def.dur;
    if (byTime || (def.until && def.until(s))) this.finish();
  }

  finish() {
    const s = this.state, c = s.cat, def = ACTIONS[c.action];
    def.onFinish?.(s, c);
    if (def.toast) this.bus.emit('toast', { msg: def.toast });
    const bubble = typeof def.bubble === 'function' ? def.bubble(s) : def.bubble;
    if (bubble) c.bubble = { text: bubble, t: 0, dur: 2 };
    this.bus.emit('action:finish', { id: c.action });
    c.action = null; c.state = 'idle'; c.locked = false;
  }

  interrupt(silent = false) {
    const c = this.state.cat;
    if (!c.action) return;
    ACTIONS[c.action].onInterrupt?.(this.state, c);
    c.action = null; c.state = 'idle'; c.pose = 'stand'; c.locked = false;
    if (!silent) this.bus.emit('action:interrupt', {});
  }
}