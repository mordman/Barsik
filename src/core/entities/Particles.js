export class Particles {
  constructor(state, bus) {
    this.list = [];
    bus.on('fx:spawn', o => this.spawn(o.type, o.x, o.y, o.n || 1));
  }
  spawn(type, x, y, n = 1) {
    for (let i = 0; i < n; i++) {
      const p = { type, x: x + (Math.random() - .5) * .4, y: y + (Math.random() - .5) * .4,
                  t: 0, life: 1, vx: 0, vy: 0 };
      switch (type) {
        case 'heart': p.life = 1.1; p.vy = -.5; break;
        case 'zzz':   p.life = 1.8; p.vy = -.35; break;
        case 'spark': p.life = .7; p.vx = (Math.random() - .5) * 2; p.vy = (Math.random() - .5) * 2; break;
        case 'crumb': p.life = .6; break;
        case 'sand':  p.life = .8; p.vx = (Math.random() - .5) * 1.2; break;
        case 'puff':  p.life = .5; break;
      }
      this.list.push(p);
    }
  }
  update(dt) {
    for (let i = this.list.length - 1; i >= 0; i--) {
      const p = this.list[i];
      p.t += dt; p.x += p.vx * dt; p.y += p.vy * dt;
      if (p.t > p.life) this.list.splice(i, 1);
    }
  }
}