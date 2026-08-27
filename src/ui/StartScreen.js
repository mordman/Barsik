const NAMES = ['Мурзик', 'Пушок', 'Барсик', 'Соня', 'Клео'];

export class StartScreen {
  constructor(state, bus) {
    this.state = state; this.bus = bus;
    this.el = document.createElement('div');
    this.el.id = 'overlay';
    this.el.innerHTML = `
      <div class="card">
        <div class="catArt">🐈</div>
        <h1>КОТО<span>ДОМ</span></h1>
        <p class="sub">изометрический симулятор жизни котика</p>
        <div class="names"></div>
        <div class="ctrls">
          <span><kbd>W A S D</kbd> бегать</span><span><kbd>E</kbd> действие</span>
          <span><kbd>M</kbd> мяукать</span><span><kbd>клик</kbd> идти / гладить</span>
        </div>
        <button id="startBtn">Заселиться 🐾</button>
      </div>`;
    document.body.appendChild(this.el);

    const names = this.el.querySelector('.names');
    let sel = NAMES[0];
    NAMES.forEach((n, i) => {
      const b = document.createElement('button');
      b.textContent = n;
      if (i === 0) b.classList.add('on');
      b.onclick = () => {
        names.querySelectorAll('button').forEach(x => x.classList.remove('on'));
        b.classList.add('on'); sel = n;
      };
      names.appendChild(b);
    });

    this.el.querySelector('#startBtn').onclick = () => {
      state.meta.catName = sel;
      state.meta.started = true;
      this.el.classList.add('hide');
      bus.emit('ui:unlock');
      bus.emit('game:start');
    };
  }
}