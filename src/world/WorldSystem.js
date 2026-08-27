export class WorldSystem {
  constructor(state, bus) { this.state = state; this.bus = bus; }

  update(dt) {
    const w = this.state.world;
    w.postWob = Math.max(0, w.postWob - dt * 2);
    w.yarnWob = Math.max(0, w.yarnWob - dt * 1.5);
    if (w.bowlFood <= 0 && w.refillT > 0) {
      w.refillT -= dt;
      if (w.refillT <= 0) {
        w.bowlFood = 1;
        this.bus.emit('toast', { msg: 'Миска снова полная! ✨' });
        this.bus.emit('fx:spawn', { type: 'spark', x: 5.5, y: 3.5, n: 6 }); // частицы — в М5
        this.bus.emit('bowl:refill');
      }
    }
  }
}