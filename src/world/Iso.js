import { TW, TH } from '../core/constants.js';

export const iso = (x, y) => ({ x: (x - y) * TW / 2, y: (x + y) * TH / 2 });

export function screenToWorld(px, py, view) {
  const wx = (px - view.ox) / view.s, wy = (py - view.oy) / view.s;
  return {
    x: (wx / (TW / 2) + wy / (TH / 2)) / 2,
    y: (wy / (TH / 2) - wx / (TW / 2)) / 2,
  };
}