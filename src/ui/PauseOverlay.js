export class PauseOverlay {
  constructor(state, bus) {
    this.state = state;
    this.el = document.createElement('div');
    this.el.id = 'pause';
    this.el.innerHTML = `<div class="card"><h2>Пауза 😼</h2><p>Нажми Esc, чтобы продолжить</p></div>`;
    document.body.appendChild(this.el);
    bus.on('ui:togglePause', () => this.toggle());
    addEventListener('keydown', e => {
      if (e.code === 'Escape' && state.meta.started) this.toggle();
    });
  }
  toggle() {
    this.state.meta.paused = !this.state.meta.paused;
    this.el.classList.toggle('show', this.state.meta.paused);
  }
}