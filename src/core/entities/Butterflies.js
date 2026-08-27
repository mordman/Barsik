const SPOTS = [[2.5,5],[3,10],[6,12],[10,12],[13,11],[15,7],[13,2.5],[9,2]];

export class Butterflies {
  constructor(state, bus) {
    this.state = state; this.bus = bus;
    state.butterflies = SPOTS.slice(0, 3).map((s, i) =>
      ({ ax: s[0], ay: s[1], x: s[0], y: s[1], ph: i * 2.1, attr: 0 }));
    // в М6 на «мяу» бабочки слетятся к коту:
    bus.on('cat:meow', () => { for (const b of state.butterflies) b.attr = 2.5; });
  }

  update(dt) {
    const c = this.state.cat;
    for (const b of this.state.butterflies) {
      b.ph += dt;
      if (b.attr > 0) {
        b.attr -= dt;
        b.ax += (c.x - b.ax) * dt * .8;
        b.ay += (c.y - b.ay) * dt * .8;
      }
      b.x = b.ax + Math.sin(b.ph * .7) * 1.3;
      b.y = b.ay + Math.cos(b.ph * .53) * .9;

      // поймал!
      if (c.state !== 'sleep' && Math.hypot(c.x - b.x, c.y - b.y) < .6) {
        this.state.needs.fun = Math.min(100, this.state.needs.fun + 12);
        this.state.stats.catches++;
        this.bus.emit('toast', { msg: 'Поймал бабочку! 🦋 +игры' });
        this.bus.emit('fx:spawn', { type: 'spark', x: b.x, y: b.y, n: 8 });
        this.bus.emit('catch:butterfly');
        const s = SPOTS[Math.floor(Math.random() * SPOTS.length)];
        b.ax = s[0]; b.ay = s[1]; b.attr = 0; b.ph = Math.random() * 6;
      }
    }
  }
}