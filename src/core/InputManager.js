import { screenToWorld } from '../world/Iso.js';

export class InputManager {
  constructor(bus, canvas, camera, state) {
    this.bus = bus; this.canvas = canvas; this.camera = camera; this.state = state;
    this.keys = {};
    addEventListener('keydown', e => this._down(e));
    addEventListener('keyup',   e => { this.keys[e.code] = false; });
    addEventListener('blur',    () => { this.keys = {}; });
    canvas.addEventListener('pointerdown', e => this._pointer(e));
  }

  _down(e) {
    if (!this.state.meta.started || this.state.meta.paused) return;
    if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space'].includes(e.code)) e.preventDefault();
    this.keys[e.code] = true;
    if (e.code === 'KeyM')  this.bus.emit('input:meow');      // обработчики появятся в М4/М6
    if (e.code === 'KeyE')  this.bus.emit('input:interact');  // обработчики появятся в М4
    if (e.code === 'Space') this.bus.emit('input:pet');
  }
  _pointer(e) {
    if (!this.state.meta.started || this.state.meta.paused) return;
    const r = this.canvas.getBoundingClientRect();
    const wx = screenToWorld(e.clientX - r.left, e.clientY - r.top, this.camera.view);
    this.bus.emit('input:pointer', { wx: wx.x, wy: wx.y, sx: e.clientX - r.left, sy: e.clientY - r.top });
  }
  hasMove() {
    return !!(this.keys.KeyW || this.keys.KeyA || this.keys.KeyS || this.keys.KeyD ||
              this.keys.ArrowUp || this.keys.ArrowDown || this.keys.ArrowLeft || this.keys.ArrowRight);
  }
}