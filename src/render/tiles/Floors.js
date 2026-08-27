import { IN } from '../../config/constants.js';
import { PATH_TILES } from '../../config/map.js';
import { iso } from '../../world/Iso.js';
import { hsh, lerp } from '../../core/utils.js';
import { tileDiamond } from '../helpers.js';

export function drawFloors(g, state) {
  for (let y = 0; y < 14; y++) for (let x = 0; x < 18; x++) {
    const h1 = hsh(x, y);
    const inside = x >= IN.x0 && x <= IN.x1 && y >= IN.y0 && y <= IN.y1;
    tileDiamond(g, x, y);
    if (inside) {
      const v = (x + y) % 2 ? 0 : 6;
      g.fillStyle = `hsl(28,42%,${52 + h1 * 6 + v}%)`;
      g.fill();
      g.strokeStyle = 'rgba(90,58,30,.28)'; g.lineWidth = 1;
      for (const t of [.33, .66]) {
        const p = iso(x, y), c = iso(x + 1, y), l = iso(x, y + 1), b = iso(x + 1, y + 1);
        g.beginPath();
        g.moveTo(lerp(p.x, c.x, t), lerp(p.y, c.y, t));
        g.lineTo(lerp(l.x, b.x, t), lerp(l.y, b.y, t));
        g.stroke();
      }
    } else if (PATH_TILES.has(x + ',' + y) || (x === 7 && y === 9)) {
      g.fillStyle = `hsl(90,8%,${48 + h1 * 8}%)`; g.fill();
      g.strokeStyle = 'rgba(0,0,0,.18)'; g.lineWidth = 1.5; g.stroke();
    } else {
      g.fillStyle = `hsl(${100 + h1 * 16},38%,${26 + h1 * 7}%)`; g.fill();
      if (h1 > .45) {
        const p = iso(x + .5, y + .5);
        g.strokeStyle = h1 > .72 ? 'rgba(210,235,170,.35)' : 'rgba(20,50,20,.4)';
        g.lineWidth = 1.2;
        for (let i = 0; i < 3; i++) {
          const ox = (hsh(x * 3 + i, y) - .5) * 26, oy = (hsh(x, y * 5 + i) - .5) * 12;
          g.beginPath(); g.moveTo(p.x + ox, p.y + oy); g.lineTo(p.x + ox + 2, p.y + oy - 4); g.stroke();
        }
      }
    }
  }
  // тени от стен внутри дома
  g.fillStyle = 'rgba(0,0,0,.09)';
  for (let x = IN.x0; x <= IN.x1; x++) { tileDiamond(g, x, IN.y0); g.fill(); }
  for (let y = IN.y0; y <= IN.y1; y++) { tileDiamond(g, IN.x0, y); g.fill(); }
  // ковёр
  const s = iso(7.5, 5.5);
  g.save(); g.translate(s.x, s.y); g.scale(1, .5);
  g.fillStyle = '#c98a3f'; g.beginPath(); g.arc(0, 0, 62, 0, 7); g.fill();
  g.fillStyle = '#f1d9ae'; g.beginPath(); g.arc(0, 0, 46, 0, 7); g.fill();
  g.fillStyle = '#b05c3f'; g.beginPath(); g.arc(0, 0, 26, 0, 7); g.fill();
  g.fillStyle = '#f1d9ae';
  g.beginPath(); g.arc(0, 2, 9, 0, 7); g.fill();
  for (const a of [-1, 0, 1]) { g.beginPath(); g.arc(a * 8, -9, 4, 0, 7); g.fill(); }
  g.restore();
  // коврик у двери
  const dm = iso(7.5, 9.5);
  g.save(); g.translate(dm.x, dm.y); g.scale(1, .5);
  g.fillStyle = '#8c4a3a'; g.beginPath(); g.arc(0, 0, 22, 0, 7); g.fill();
  g.fillStyle = '#c9752f'; g.beginPath(); g.arc(0, 0, 14, 0, 7); g.fill();
  g.restore();
}