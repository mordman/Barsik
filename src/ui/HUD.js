import { NEEDS, NEED_ORDER } from '../config/needs.js';
import { moodEmoji } from '../systems/mood.js';
import { clockLabel } from '../world/DayCycle.js';
import { IN } from '../config/constants.js';

export class HUD {
  constructor(state, bus) {
    this.state = state; this.last = 0;

    const panel = document.createElement('div');
    panel.id = 'hudPanel';
    panel.innerHTML = `
      <div id="hudName"><span id="catName"></span><span id="mood">😺</span></div>
      <div id="needRows"></div>`;
    document.body.appendChild(panel);

    const rows = panel.querySelector('#needRows');
    this.fills = {}; this.rowEls = {};
    for (const key of NEED_ORDER) {
      const cfg = NEEDS[key];
      const d = document.createElement('div');
      d.className = 'need';
      d.innerHTML = `<span class="ico">${cfg.icon}</span><span class="lbl">${cfg.label}</span>
        <div class="track"><div class="fill f-${key}"></div></div>`;
      rows.appendChild(d);
      this.fills[key] = d.querySelector('.fill');
      this.rowEls[key] = d;
    }

    const right = document.createElement('div');
    right.id = 'hudRight';
    right.innerHTML = `
      <div class="chip" id="bflyChip">🦋 0</div>
      <div class="chip" id="clockChip"></div>
      <div class="chip" id="locChip"></div>
      <button class="round" id="pauseBtn" title="Пауза">⏸</button>
      <button class="round" id="sndBtn" title="Звук">🔊</button>`;
    document.body.appendChild(right);

    right.querySelector('#pauseBtn').onclick = () => bus.emit('ui:togglePause');
    let sndOn = true;
    right.querySelector('#sndBtn').onclick = e => {
      sndOn = !sndOn;
      e.currentTarget.textContent = sndOn ? '🔊' : '🔇';
      bus.emit('ui:toggleSound');
    };

    this.nameEl  = panel.querySelector('#catName');
    this.moodEl  = panel.querySelector('#mood');
    this.clockEl = right.querySelector('#clockChip');
    this.locEl   = right.querySelector('#locChip');
    this.bflyEl  = right.querySelector('#bflyChip');
  }

  sync(now) {
    if (now - this.last < 120) return;
    this.last = now;
    const s = this.state;
    for (const key of NEED_ORDER) {
      this.fills[key].style.width = s.needs[key] + '%';
      this.rowEls[key].classList.toggle('low', s.needs[key] < 25);
    }
    this.nameEl.textContent = s.meta.catName;
    this.moodEl.textContent = moodEmoji(s);
    this.clockEl.textContent = clockLabel(s.time.minutes);
    this.bflyEl.textContent = `🦋 ${s.stats.catches}`;
    const c = s.cat;
    const inside = c.x >= IN.x0 && c.x <= IN.x1 + 1 && c.y >= IN.y0 && c.y <= IN.y1 + 1;
    this.locEl.textContent = inside ? '🏠 дома' : '🌳 в саду';
  }
}