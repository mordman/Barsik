import { HOUSES } from '../config/map.js';
import { iso } from '../world/Iso.js';

function house(g, item) {
  const x0 = item.x, y0 = item.y, x1 = x0 + item.w, y1 = y0 + item.h;
  const a = iso(x0, y0), b = iso(x1, y0), c = iso(x1, y1), d = iso(x0, y1);
  g.fillStyle = 'rgba(35,25,20,.28)';
  g.beginPath(); g.moveTo(a.x, a.y); g.lineTo(b.x, b.y); g.lineTo(c.x, c.y); g.lineTo(d.x, d.y); g.closePath(); g.fill();
  g.fillStyle = item.color;
  for (const [p, q] of [[a, b], [b, c]]) {
    g.beginPath(); g.moveTo(p.x, p.y); g.lineTo(q.x, q.y); g.lineTo(q.x, q.y - 22); g.lineTo(p.x, p.y - 22); g.closePath(); g.fill();
  }
  g.fillStyle = '#d9b36f';
  g.beginPath(); g.moveTo(a.x, a.y - 22); g.lineTo(b.x, b.y - 22); g.lineTo(c.x, c.y - 22); g.lineTo(d.x, d.y - 22); g.closePath(); g.fill();
  // Открытая крыша показывает, что соседние дома заселены.
  const floor = [iso(x0 + .55, y0 + .55), iso(x1 - .55, y0 + .55), iso(x1 - .55, y1 - .55), iso(x0 + .55, y1 - .55)];
  g.fillStyle = '#d9c49a';
  g.beginPath(); g.moveTo(floor[0].x, floor[0].y - 24); for (const p of floor.slice(1)) g.lineTo(p.x, p.y - 24); g.closePath(); g.fill();
  const rug = iso(x0 + item.w / 2, y0 + item.h / 2);
  g.fillStyle = '#9b6655'; g.save(); g.translate(rug.x, rug.y - 27); g.scale(1, .45); g.beginPath(); g.arc(0, 0, 24, 0, Math.PI * 2); g.fill(); g.restore();
  g.fillStyle = '#624b3b';
  g.fillRect(rug.x - 15, rug.y - 40, 8, 8);
  g.fillStyle = '#6e9b83'; g.beginPath(); g.arc(rug.x + 14, rug.y - 39, 6, 0, Math.PI * 2); g.fill();
  g.fillStyle = '#e9d3a6'; g.fillRect(rug.x + 6, rug.y - 50, 15, 7);
  g.strokeStyle = 'rgba(91,67,48,.65)'; g.lineWidth = 3;
  const dividerX = iso(x0 + Math.floor(item.w / 2), y0 + .7);
  g.beginPath(); g.moveTo(dividerX.x, dividerX.y - 24); g.lineTo(iso(x0 + Math.floor(item.w / 2), y1 - .7).x, iso(x0 + Math.floor(item.w / 2), y1 - .7).y - 24); g.stroke();
  if (item.rooms > 2) {
    const dividerY = iso(x0 + .7, y0 + Math.floor(item.h / 2));
    g.beginPath(); g.moveTo(dividerY.x, dividerY.y - 24); g.lineTo(iso(x1 - .7, y0 + Math.floor(item.h / 2)).x, iso(x1 - .7, y0 + Math.floor(item.h / 2)).y - 24); g.stroke();
  }
  const door = item.entryTop
    ? iso(x0 + Math.floor(item.w / 2) + .5, y0)
    : iso(x0 + Math.floor(item.w / 2) + .5, y1);
  g.fillStyle = '#49352a'; g.fillRect(door.x - 4, door.y - 17, 8, 17);
}

export function collectLandmarkDrawables(g) {
  return HOUSES.map((item, i) => ({ d: item.x + item.y + i * .01, f: () => house(g, item) }));
}