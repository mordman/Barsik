import { W, H } from '../../core/constants.js';
import { iso } from '../../world/Iso.js';

function drawFencePost(g, x, y) {
  const s = iso(x + .5, y + .5);
  g.fillStyle = 'rgba(0,0,0,.2)';
  g.save(); g.translate(s.x, s.y + 1); g.scale(1, .42);
  g.beginPath(); g.arc(0, 0, 7, 0, 7); g.fill(); g.restore();
  g.fillStyle = '#8a6644'; g.fillRect(s.x - 2.5, s.y - 16, 5, 16);
  g.fillStyle = '#a87c4f'; g.fillRect(s.x - 3.5, s.y - 18, 7, 3.5);
  const nb = (y === 0 || y === H - 1) ? (x < W - 1 ? { x: x + 1, y } : null)
                                       : (y < H - 1 ? { x, y: y + 1 } : null);
  if (nb && (nb.y === 0 || nb.y === H - 1 || nb.x === 0 || nb.x === W - 1)) {
    const s2 = iso(nb.x + .5, nb.y + .5);
    g.strokeStyle = 'rgba(110,82,54,.9)'; g.lineWidth = 3;
    for (const h of [13, 7]) {
      g.beginPath(); g.moveTo(s.x, s.y - h); g.lineTo(s2.x, s2.y - h); g.stroke();
    }
  }
}

export function collectFenceDrawables(g) {
  const D = [];
  for (let x = 0; x < W; x++) {
    D.push({ d: x + .45, f: () => drawFencePost(g, x, 0) });
    D.push({ d: x + 13.45, f: () => drawFencePost(g, x, H - 1) });
  }
  for (let y = 1; y < H - 1; y++) {
    D.push({ d: y + .45, f: () => drawFencePost(g, 0, y) });
    D.push({ d: W - 1 + y + .45, f: () => drawFencePost(g, W - 1, y) });
  }
  return D;
}