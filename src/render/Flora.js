import { TREES, FLOWERS } from '../config/map.js';
import { iso } from '../world/Iso.js';
import { iell } from './helpers.js';

function drawTree(g, x, y, t) {
  const s = iso(x + .5, y + .5), sw = Math.sin(t * .8 + x * 2) * 1.8;
  g.fillStyle = 'rgba(0,0,0,.25)'; iell(g, s.x, s.y + 1, 20, 8);
  g.fillStyle = '#7a5138';
  g.beginPath(); g.moveTo(s.x - 4, s.y); g.lineTo(s.x + 4, s.y);
  g.lineTo(s.x + 3, s.y - 24); g.lineTo(s.x - 3, s.y - 24); g.closePath(); g.fill();
  g.fillStyle = '#3f7d44';
  g.beginPath(); g.arc(s.x - 10 + sw * .6, s.y - 27, 12, 0, 7); g.fill();
  g.beginPath(); g.arc(s.x + 9 + sw, s.y - 28, 12, 0, 7); g.fill();
  g.fillStyle = '#579a52';
  g.beginPath(); g.arc(s.x + sw, s.y - 37, 15, 0, 7); g.fill();
  g.fillStyle = '#6fb468';
  g.beginPath(); g.arc(s.x - 5 + sw, s.y - 42, 6, 0, 7); g.fill();
}

function drawFlower(g, f, t) {
  const s = iso(f.x, f.y);
  g.save(); g.translate(s.x, s.y); g.rotate(Math.sin(t * 1.4 + f.x * 3) * .1);
  g.strokeStyle = '#3f7d44'; g.lineWidth = 1.6;
  g.beginPath(); g.moveTo(0, 0); g.lineTo(0, -8); g.stroke();
  for (let i = 0; i < 5; i++) {
    const a = i / 5 * Math.PI * 2;
    g.fillStyle = f.c; g.beginPath(); g.arc(Math.cos(a) * 3, -8 + Math.sin(a) * 3, 2.3, 0, 7); g.fill();
  }
  g.fillStyle = '#ffd166'; g.beginPath(); g.arc(0, -8, 1.8, 0, 7); g.fill();
  g.restore();
}

export function collectFloraDrawables(g, state) {
  const t = state.time.t;
  const D = [];
  for (const [x, y] of TREES) D.push({ d: x + y + .5, f: () => drawTree(g, x, y, t) });
  for (const f of FLOWERS) D.push({ d: f.x + f.y + .3, f: () => drawFlower(g, f, t) });
  return D;
}