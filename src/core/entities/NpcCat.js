import { IN } from '../config/constants.js';

const LINES = ['Мяу.', 'Рыбу не видел?', 'Хвост мой.', 'Опять этот забор…', 'Мрр.'];

export class NpcCat {
  constructor(state, bus) { this.state = state; this.bus = bus; }

  update(dt) {
    const n = this.state.npc;
    if (n.bubble) { n.bubble.t += dt; if (n.bubble.t > n.bubble.dur) n.bubble = null; }
    n.talkT = (n.talkT ?? 8) - dt;
    if (n.talkT <= 0) {
      n.talkT = 12 + Math.random() * 10;
      const c = this.state.cat;
      const catOutside = !(c.x >= IN.x0 && c.x <= IN.x1 + 1 && c.y >= IN.y0 && c.y <= IN.y1 + 1);
      if (!n.bubble && catOutside && Math.random() < .7)
        n.bubble = { text: LINES[Math.floor(Math.random() * LINES.length)], t: 0, dur: 2 };
    }
  }
}