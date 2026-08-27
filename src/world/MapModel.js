import { W, H, IN } from '../core/constants.js';
import { FURN_BLOCK, TREES, DOOR } from '../config/map.js';
import { TK } from '../core/utils.js';

export class MapModel {
  constructor() {
    this.blocked = new Set();
    // кольцо стен вокруг дома (с проёмом двери)
    for (let x = IN.x0 - 1; x <= IN.x1 + 1; x++) {
      this.blocked.add(TK(x, IN.y0 - 1));
      this.blocked.add(TK(x, IN.y1 + 1));
    }
    for (let y = IN.y0; y <= IN.y1; y++) {
      this.blocked.add(TK(IN.x0 - 1, y));
      this.blocked.add(TK(IN.x1 + 1, y));
    }
    this.blocked.delete(TK(DOOR.x, DOOR.y));
    for (const [x, y] of FURN_BLOCK) this.blocked.add(TK(x, y));
    for (const [x, y] of TREES) this.blocked.add(TK(x, y));
  }
  addBlocked(x, y) { this.blocked.add(TK(x, y)); }   // например, под НПС в М5
  walkable(tx, ty) {
    if (tx < 0 || ty < 0 || tx >= W || ty >= H) return false;
    if (tx === 0 || ty === 0 || tx === W - 1 || ty === H - 1) return false; // забор
    return !this.blocked.has(TK(tx, ty));
  }
  walkTile(x, y) { return this.walkable(Math.floor(x), Math.floor(y)); }
  canStand(x, y) {
    const r = 0.3;
    return this.walkTile(x - r, y - r) && this.walkTile(x + r, y - r)
        && this.walkTile(x - r, y + r) && this.walkTile(x + r, y + r);
  }
  isInside(o) { return o.x >= IN.x0 && o.x <= IN.x1 + 1 && o.y >= IN.y0 && o.y <= IN.y1 + 1; }
}