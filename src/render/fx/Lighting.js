import { iso } from '../../world/Iso.js';
import { hsh } from '../../core/utils.js';

export function drawLights(g, state, nl) {
  if (nl <= 0.02) return;
  const t = state.time.t;
  g.save();
  g.globalCompositeOperation = 'lighter';

  // тёплый свет из окна
  const win = iso(7, 3);
  let gr = g.createRadialGradient(win.x, win.y - 36, 4, win.x, win.y - 36, 70);
  gr.addColorStop(0, `rgba(255,190,110,${.3 * nl})`); gr.addColorStop(1, 'rgba(255,190,110,0)');
  g.fillStyle = gr; g.fillRect(win.x - 80, win.y - 110, 160, 150);

  // лампа
  const lp = iso(10.5, 5.5);
  gr = g.createRadialGradient(lp.x, lp.y - 46, 4, lp.x, lp.y - 46, 66);
  gr.addColorStop(0, `rgba(255,205,120,${.4 * nl})`); gr.addColorStop(1, 'rgba(255,205,120,0)');
  g.fillStyle = gr; g.fillRect(lp.x - 70, lp.y - 115, 140, 140);

  // общий тёплый свет дома
  const hc = iso(7.5, 5.5);
  gr = g.createRadialGradient(hc.x, hc.y, 10, hc.x, hc.y, 190);
  gr.addColorStop(0, `rgba(255,170,90,${.13 * nl})`); gr.addColorStop(1, 'rgba(255,170,90,0)');
  g.fillStyle = gr; g.fillRect(hc.x - 200, hc.y - 200, 400, 400);

  // светлячки в саду
  if (nl > 0.35) {
    for (let i = 0; i < 9; i++) {
      const fx = 2 + hsh(i, 11) * 14, fy = 2 + hsh(11, i) * 10;
      const px = Math.sin(t * .5 + i * 2.4) * .8, py = Math.cos(t * .4 + i * 1.7) * .6;
      const s = iso(fx + px, fy + py);
      const tw = (Math.sin(t * 3 + i * 2) + 1) / 2;
      gr = g.createRadialGradient(s.x, s.y - 8, 0, s.x, s.y - 8, 7);
      gr.addColorStop(0, `rgba(255,233,163,${.5 * nl * tw})`); gr.addColorStop(1, 'rgba(255,233,163,0)');
      g.fillStyle = gr; g.fillRect(s.x - 8, s.y - 16, 16, 16);
    }
  }
  g.restore();
}