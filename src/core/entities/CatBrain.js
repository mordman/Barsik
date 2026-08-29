import { iso } from '../../world/Iso.js';
import { findPath } from '../../world/Pathfinding.js';
import { INTERACTS, APPROACH } from '../../config/interacts.js';
import { clamp } from '../utils.js';

const THOUGHTS = [
  'Погладь меня… или не надо.', 'А что там за окном?', 'Время вкусняшек?',
  'Хвост живёт своей жизнью.', 'Надо потянуться.', 'Мррр.',
  'Я видел птичку. Она меня тоже.', 'Диван мой. Всегда был моим.',
];

export class CatBrain {
  constructor(state, cat, map, bus, camera, actions) {
    this.state = state; this.catEntity = cat; this.map = map;
    this.bus = bus; this.camera = camera; this.actions = actions;
    bus.on('input:pointer', e => this.onPointer(e));
    bus.on('input:pet', () => this.pet());
    bus.on('cat:arrived', () => this.onArrived());
    bus.on('cat:stuck', target => {
      if (target) this.walkTo(target.x, target.y, this.state.cat.pending);
    });
    bus.on('input:meow', () => this.meow());
  }

  onPointer(e) {
    const c = this.state.cat;
    const s = iso(c.x, c.y), v = this.camera.view;
    const px = s.x * v.s + v.ox, py = (s.y - 14) * v.s + v.oy;
    if (Math.hypot(e.sx - px, e.sy - py) < 34 * v.s) { this.pet(); return; }

    const it = this.interactAt(e.wx, e.wy);
    if (it) {
      if (Math.hypot(c.x - it.x, c.y - it.y) <= it.r) this.actions.start(it.id, it);
      else this.goTo(it);
      return;
    }
    const tx = Math.floor(e.wx), ty = Math.floor(e.wy);
    if (!this.map.walkable(tx, ty)) { this.say('Мяу? Туда нельзя 🙀', 1.4); return; }
    this.walkTo(tx, ty, null);
  }

  interactAt(wx, wy) {
    for (const it of INTERACTS) {
      if (it.when && !it.when(this.state)) continue;
      if (Math.hypot(wx - it.x, wy - it.y) < .75) return it;
    }
    return null;
  }

  goTo(it) {
    if (it.key === 'bird') {                 // к птичке — вдоль забора
      this.walkTo(Math.floor(it.x), 11, it.key);
      return;
    }
    const list = APPROACH[it.key];
    if (!list || !list.length) { this.say('Мяу? Не подобраться 😾'); return; }
    let best = null, bd = 1e9;
    for (const t of list) {
      const d = Math.hypot(t.x + .5 - this.state.cat.x, t.y + .5 - this.state.cat.y);
      if (d < bd) { bd = d; best = t; }
    }
    this.walkTo(best.x, best.y, it.key);
  }

  walkTo(tx, ty, pendingKey) {
    const c = this.state.cat;
    const p = findPath(this.map, Math.floor(c.x), Math.floor(c.y), tx, ty);
    if (p && p.length) {
      c.path = p; c.pathTarget = { x: tx, y: ty }; c.pathStall = 0;
      c.pending = pendingKey; c.idlePose = null;
    }
    else this.say('Мяу? Не пройти 😾', 1.4);
  }

  onArrived() {
    const c = this.state.cat;
    if (!c.pending) return;
    const it = INTERACTS.find(i => i.key === c.pending);
    c.pending = null;
    if (it && Math.hypot(c.x - it.x, c.y - it.y) < it.r + .6) this.actions.start(it.id, it);
  }

  pet() {
    this.state.needs.social = clamp(this.state.needs.social + 3, 0, 100);
    this.state.cat.petT = 1.2;
    this.bus.emit('cat:pet');
    this.bus.emit('fx:spawn', { type: 'heart', x: this.state.cat.x, y: this.state.cat.y, n: 3 });
    if (Math.random() < .6) this.say('Мррр 💕');
  }

  say(text, dur = 2) { this.state.cat.bubble = { text, t: 0, dur }; }

  startZoomies() {
    const c = this.state.cat;
    for (let i = 0; i < 25; i++) {
      const tx = Math.floor(c.x + (Math.random() * 12 - 6));
      const ty = Math.floor(c.y + (Math.random() * 12 - 6));
      if (!this.map.walkable(tx, ty)) continue;
      const p = findPath(this.map, Math.floor(c.x), Math.floor(c.y), tx, ty);
      if (p && p.length > 2) {
        c.path = p; c.pathTarget = { x: tx, y: ty }; c.pathStall = 0;
        c.state = 'zoom'; c.pending = null;
        this.bus.emit('toast', { msg: 'ЗУМИЗ!! 💨' });
        return;
      }
    }
  }

    meow() {
    const c = this.state.cat;
    if (c.state === 'sleep') { this.actions.interrupt(); this.bus.emit('toast', { msg: 'Мяу?.. 😾' }); return; }
    if (c.meowCd > 0) return;
    c.meowCd = .7;
    let ph = ['Мяу!', 'Мяяяу~', 'Мррр!', 'Мя!', 'Мяу-мяу!'];
    if (this.state.needs.food < 30) ph = ['Мяу! ЖРАТЬ!!', 'Миска. Пустая. Мяу!'];
    this.say(ph[Math.floor(Math.random() * ph.length)]);
    this.state.needs.social = Math.min(100, this.state.needs.social + 1);
    this.bus.emit('cat:meow');                     // бабочки уже слушают
    if (Math.hypot(c.x - this.state.npc.x, c.y - this.state.npc.y) < 6)
      setTimeout(() => { this.state.npc.bubble = { text: 'Мяу!', t: 0, dur: 1.6 }; }, 550);
  }

  update(dt, input) {
    const c = this.state.cat;
    c.petT = Math.max(0, c.petT - dt);
    c.meowCd = Math.max(0, (c.meowCd ?? 0) - dt);
    if (c.bubble) { c.bubble.t += dt; if (c.bubble.t > c.bubble.dur) c.bubble = null; }

    // движение клавишами прерывает дела и сон
    if (input.hasMove() && c.action) {
      const wasSleep = c.state === 'sleep';
      this.actions.interrupt();
      if (wasSleep) this.bus.emit('toast', { msg: 'Потягушки! 😺' });
      return;
    }

    // зумиз: след пыли и завершение
    if (c.state === 'zoom') {
      if (this.catEntity.moving && Math.random() < dt * 8)
        this.bus.emit('fx:spawn', { type: 'puff', x: c.x, y: c.y, n: 1 });
      if (!this.catEntity.moving) c.state = 'idle';
    }

    if (this.catEntity.moving) { c.idleT = 0; c.idlePose = null; c.idleSitT = 0; }
    else if (!c.action && c.state !== 'zoom') {
      c.idleT += dt;
      if (c.idleSitT > 0) {
        c.idleSitT -= dt;
        c.idlePose = c.idleSitT > 0 ? 'sit' : null;
      } else if (c.idleT > 5 && Math.random() < dt * .35) {
        c.idleSitT = 2.5 + Math.random() * 2.5;
      }
      // мысли
      c.thinkT = (c.thinkT ?? 9) - dt;
      if (c.thinkT <= 0 && !c.bubble) {
        c.thinkT = 14 + Math.random() * 12;
        this.say(THOUGHTS[Math.floor(Math.random() * THOUGHTS.length)]);
      }
      // редкие зумиз
      c.zoomT = (c.zoomT ?? 14) - dt;
      if (c.zoomT <= 0 && this.state.needs.fun > 40 && Math.random() < dt / 22) {
        c.zoomT = 20;
        this.startZoomies();
      }
    }
  }
}