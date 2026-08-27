export class GameLoop {
  constructor({ update, render }) {
    this.update = update;
    this.render = render;
    this.last = 0;
    this._frame = this._frame.bind(this);
  }
  start() {
    this.last = performance.now();
    requestAnimationFrame(this._frame);
  }
  _frame(now) {
    const dt = Math.min(0.05, (now - this.last) / 1000); // защита от «прыжка» после сворачивания
    this.last = now;
    this.update(dt);
    this.render();
    requestAnimationFrame(this._frame);
  }
}