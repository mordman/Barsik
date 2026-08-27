import { W } from '../config/constants.js';

export function findPath(map, sx, sy, gx, gy) {
  if (!map.walkable(gx, gy)) return null;
  const K = (x, y) => x + y * W;
  const gScore = new Map([[K(sx, sy), 0]]);
  const prev = new Map(), closed = new Set();
  const open = [{ x: sx, y: sy, f: Math.abs(gx - sx) + Math.abs(gy - sy) }];
  while (open.length) {
    let bi = 0;
    for (let i = 1; i < open.length; i++) if (open[i].f < open[bi].f) bi = i;
    const cur = open.splice(bi, 1)[0];
    if (cur.x === gx && cur.y === gy) {
      const pts = []; let k = K(gx, gy);
      while (k !== K(sx, sy)) { pts.push({ x: (k % W) + .5, y: Math.floor(k / W) + .5 }); k = prev.get(k); }
      return pts.reverse();
    }
    closed.add(K(cur.x, cur.y));
    for (const [dx, dy] of [[1,0],[-1,0],[0,1],[0,-1]]) {
      const nx = cur.x + dx, ny = cur.y + dy, nk = K(nx, ny);
      if (!map.walkable(nx, ny) || closed.has(nk)) continue;
      const g = gScore.get(K(cur.x, cur.y)) + 1;
      if (g < (gScore.get(nk) ?? 1e9)) {
        gScore.set(nk, g); prev.set(nk, K(cur.x, cur.y));
        open.push({ x: nx, y: ny, f: g + Math.abs(gx - nx) + Math.abs(gy - ny) });
      }
    }
  }
  return null;
}