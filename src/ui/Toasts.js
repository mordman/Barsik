export class Toasts {
  constructor(bus) {
    this.box = document.createElement('div');
    this.box.id = 'toasts';
    document.body.appendChild(this.box);
    bus.on('toast', ({ msg }) => this.show(msg));
  }
  show(msg) {
    while (this.box.children.length >= 3) this.box.firstChild.remove();
    const el = document.createElement('div');
    el.className = 'toast'; el.textContent = msg;
    this.box.appendChild(el);
    requestAnimationFrame(() => el.classList.add('show'));
    setTimeout(() => { el.classList.add('bye'); setTimeout(() => el.remove(), 350); }, 3200);
  }
}