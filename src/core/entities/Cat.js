import { SPEED } from '../config/constants.js';

export class Cat {
  constructor(state, map, bus) {
    this.state = state; this.map = map; this.bus = bus;
    this.moving = false;
  }

  update(dt, input) {
    const c = this.state.cat;
    if (c.locked) return;                 // в М4 действия будут «запирать» кота

    let vx = 0, vy = 0;
    const k = input.keys;
    if (k.KeyW || k.ArrowUp)    { vx -= 1; vy -= 1; }
    if (k.KeyS || k.ArrowDown)  { vx += 1; vy += 1; }
    if (k.KeyA || k.ArrowLeft)  { vx -= 1; vy += 1; }
    if (k.KeyD || k.ArrowRight) { vx += 1; vy -= 1; }

    if (vx || vy) {
      // ручное управление — путь отменяется
      c.path = null;
      const l = Math.hypot(vx, vy); vx /= l; vy /= l;
      c.face = Math.abs(vx) > Math.abs(vy) ? (vx > 0 ? 'right' : 'left')
                                           : (vy > 0 ? 'down' : 'up');
      const mx = vx * SPEED * dt, my = vy * SPEED * dt;
      if (this.map.canStand(c.x + mx, c.y)) c.x += mx;   // скольжение вдоль стен
      if (this.map.canStand(c.x, c.y + my)) c.y += my;
      c.pose = 'walk'; c.phase += dt * 10;
      this.moving = true;
    } else if (c.path && c.path.length) {
      // следование по пути (клик)
      const wp = c.path[0];
      const dx = wp.x - c.x, dy = wp.y - c.y, d = Math.hypot(dx, dy);
      if (d < .12) c.path.shift();
      else {
        c.face = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left')
                                             : (dy > 0 ? 'down' : 'up');
        const st = Math.min(SPEED * dt, d);
        
        const mx = dx / d * st, my = dy / d * st;
        if (this.map.canStand(c.x + mx, c.y)) c.x += mx;
        if (this.map.canStand(c.x, c.y + my)) c.y += my;
        c.pose = 'walk'; c.phase += dt * 10;
      }
      if (c.path.length === 0) this.bus.emit('cat:arrived');
      this.moving = true;
    } else {
      c.pose = c.idlePose || 'stand';
      this.moving = false;
    }
    c.moving = this.moving;
  }
}