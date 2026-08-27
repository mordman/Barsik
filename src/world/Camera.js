import { W, H, TW, TH } from '../core/constants.js';

export class Camera {
  constructor(canvas) {
    this.canvas = canvas;
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
    const s = Math.min((this.cw - 40) / (this.bx1 - this.bx0),
                       (this.ch - 60) / (this.by1 - this.by0));
    this.view.s = Math.max(0.4, Math.min(1.6, s));
    this.view.ox = this.cw / 2 - this.view.s * (this.bx0 + this.bx1) / 2;
    this.view.oy = this.ch / 2 - this.view.s * (this.by0 + this.by1) / 2 + 10;
  }
}