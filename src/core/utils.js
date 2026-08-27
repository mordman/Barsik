export const clamp = (v, a, b) => v < a ? a : v > b ? b : v;
export const lerp  = (a, b, t) => a + (b - a) * t;
export const rand  = (a = 1, b) => b === undefined ? Math.random() * a : a + Math.random() * (b - a);
export const hsh = (x, y) => {
  let n = (x * 374761393 + y * 668265263) | 0;
  n = Math.imul(n ^ (n >>> 13), 1274126177);
  return ((n ^ (n >>> 16)) >>> 0) / 4294967295;
};
export const TK = (x, y) => x + ',' + y;