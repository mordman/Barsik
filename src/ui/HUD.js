import { NEEDS, NEED_ORDER } from '../config/needs.js';
import { moodEmoji } from '../systems/mood.js';
import { clockLabel } from '../world/DayCycle.js';
import { IN, W, H } from '../core/constants.js';
import { HOUSES, ROADS } from '../config/map.js';

export class HUD {
  constructor(state, bus, map) {
    this.state = state; this.map = map; this.last = 0;

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

    const mini = document.createElement('canvas');
    mini.id = 'minimap'; mini.width = W * 6; mini.height = H * 6;
    mini.title = 'Миникарта'; document.body.appendChild(mini);
    this.mini = mini; this.miniCtx = mini.getContext('2d');

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

  drawMinimap() {
    const g = this.miniCtx, scale = 6;
    g.clearRect(0, 0, W * scale, H * scale);
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const key = `${x},${y}`;
      g.fillStyle = !this.map.walkable(x, y) ? '#463d36' : ROADS.has(key) ? '#b6a47e' : '#50734d';
      g.fillRect(x * scale, y * scale, scale, scale);
    }
    g.strokeStyle = '#d6bd82'; g.lineWidth = 1;
    for (const h of HOUSES) g.strokeRect(h.x * scale + .5, h.y * scale + .5, h.w * scale - 1, h.h * scale - 1);
    const c = this.state.cat;
    g.fillStyle = '#ff7658'; g.beginPath(); g.arc(c.x * scale, c.y * scale, 3, 0, Math.PI * 2); g.fill();
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
    this.drawMinimap();
  }
}