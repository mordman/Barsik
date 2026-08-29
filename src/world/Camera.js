import { W, H, TW, TH } from '../core/constants.js';
import { iso } from './Iso.js';

export class Camera {
  constructor(canvas, state) {
    this.canvas = canvas;
    this.state = state;
    this.ctx = canvas.getContext('2d');
    this.view = { s: 1, ox: 0, oy: 0 };
    this.dpr = 1; this.cw = 0; this.ch = 0;
    // мировые границы сцены (с запасом под стены и деревья)
    this.bx0 = -H * TW / 2; this.bx1 = W * TW / 2;
    this.by0 = -105;        this.by1 = (W + H) * TH / 2 + 34;
    this.fit();
  }
  fit() {
    this.cw = innerWidth; this.ch = innerHeight;
    this.dpr = Math.min(2, devicePixelRatio || 1);
    this.canvas.width = this.cw * this.dpr;
    this.canvas.height = this.ch * this.dpr;
    this.canvas.style.width = this.cw + 'px';
    this.canvas.style.height = this.ch + 'px';
    this.view.s = Math.max(.72, Math.min(1.25, Math.min((this.cw - 40) / 720, (this.ch - 60) / 500)));
    this.follow();
  }
  follow() {
    const c = this.state?.cat || { x: W / 2, y: H / 2 };
    const p = iso(c.x, c.y);
    this.view.ox = this.cw / 2 - p.x * this.view.s;
    this.view.oy = this.ch / 2 - p.y * this.view.s + 42;
  }
}