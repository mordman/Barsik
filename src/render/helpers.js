import { iso } from '../world/Iso.js';

export function iell(g, x, y, rx, ry) {           // «изометрический» эллипс
  g.save(); g.translate(x, y); g.scale(1, ry / rx);
  g.beginPath(); g.arc(0, 0, rx, 0, 7); g.fill(); g.restore();
}
export function rr(g, x, y, w, h, r) {            // скруглённый прямоугольник
  r = Math.min(r, w / 2, h / 2);
  g.beginPath(); g.moveTo(x + r, y);
  g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r);
  g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath();
}
export function tileDiamond(g, x, y) {
  const p = iso(x, y), c = iso(x + 1, y), b = iso(x + 1, y + 1), l = iso(x, y + 1);
  g.beginPath(); g.moveTo(p.x, p.y); g.lineTo(c.x, c.y);
  g.lineTo(b.x, b.y); g.lineTo(l.x, l.y); g.closePath();
}
// прямоугольник на наклонной стене: A — точка на ребре, (ux,uy) — направление вдоль стены
export function wallQuad(g, Ax, Ay, ux, uy, px, py, w, h, color) {
  const P = (x, y) => [Ax + ux * x, Ay + uy * x - y];
  g.fillStyle = color; g.beginPath();
  let [a, b] = P(px, py);      g.moveTo(a, b);
  [a, b] = P(px + w, py);      g.lineTo(a, b);
  [a, b] = P(px + w, py + h);  g.lineTo(a, b);
  [a, b] = P(px, py + h);      g.lineTo(a, b);
  g.closePath(); g.fill();
}