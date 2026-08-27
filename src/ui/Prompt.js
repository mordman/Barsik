import { INTERACTS } from '../config/interacts.js';

export class Prompt {
  constructor(state) {
    this.state = state; this.last = 0;
    this.el = document.createElement('div');
    this.el.id = 'prompt';
    document.body.appendChild(this.el);
  }
  sync(now) {
    if (now - this.last < 100) return;
    this.last = now;
    const s = this.state;
    if (s.cat.state === 'sleep') {
      this.el.innerHTML = '<kbd>E</kbd> 💤 Проснуться';
      this.el.classList.add('show');
      return;
    }
    const it = INTERACTS.find(i => i.key === s.interact);
    if (it) {
      this.el.innerHTML = `<kbd>E</kbd> ${it.icon} ${it.label}`;
      this.el.classList.add('show');
    } else this.el.classList.remove('show');
  }
}