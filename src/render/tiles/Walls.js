import { IN, WALL_H, LOW_H } from '../../core/constants.js';
import { iso } from '../../world/Iso.js';
import { wallQuad } from '../helpers.js';

function drawNorthWall(g, night) {
  for (let x = IN.x0; x <= IN.x1; x++) {
    const A = iso(x, IN.y0), B = iso(x + 1, IN.y0);
    g.fillStyle = (x % 2) ? '#e9d5b1' : '#e4cfa9';
    g.beginPath(); g.moveTo(A.x, A.y); g.lineTo(B.x, B.y);
    g.lineTo(B.x, B.y - WALL_H); g.lineTo(A.x, A.y - WALL_H); g.closePath(); g.fill();
  }
  const A4 = iso(IN.x0, IN.y0), B11 = iso(IN.x1 + 1, IN.y0);
  g.fillStyle = '#f6e8ca';
  g.beginPath(); g.moveTo(A4.x, A4.y - WALL_H); g.lineTo(B11.x, B11.y - WALL_H);
  g.lineTo(B11.x, B11.y - WALL_H - 5); g.lineTo(A4.x, A4.y - WALL_H - 5); g.closePath(); g.fill();
  g.fillStyle = 'rgba(90,60,30,.25)';
  g.beginPath(); g.moveTo(A4.x, A4.y); g.lineTo(B11.x, B11.y);
  g.lineTo(B11.x, B11.y - 4); g.lineTo(A4.x, A4.y - 4); g.closePath(); g.fill();
  // окно (тайлы 6–8)
  const A = iso(6, IN.y0), ux = 32, uy = 16;
  wallQuad(g, A.x, A.y, ux, uy, .3, 16, 1.4, 38, '#8a6644');
  wallQuad(g, A.x, A.y, ux, uy, .42, 20, 1.16, 30, night > .5 ? '#22345e' : '#bfe2f7');
  if (night > .5) {
    wallQuad(g, A.x, A.y, ux, uy, 1.2, 40, .12, .12, '#f4ead7');
    wallQuad(g, A.x, A.y, ux, uy, .6, 30, .07, .07, '#f4ead7');
  } else {
    wallQuad(g, A.x, A.y, ux, uy, .55, 38, .34, .12, 'rgba(255,255,255,.85)');
    wallQuad(g, A.x, A.y, ux, uy, .9, 28, .28, .1, 'rgba(255,255,255,.7)');
  }
  wallQuad(g, A.x, A.y, ux, uy, .97, 20, .06, 30, '#8a6644');
  wallQuad(g, A.x, A.y, ux, uy, .42, 33.5, 1.16, .09, '#8a6644');
  wallQuad(g, A.x, A.y, ux, uy, .28, 13, 1.44, .24, '#a87c4f');
  wallQuad(g, A.x, A.y, ux, uy, .32, 20, .14, 30, '#e0664d');
  wallQuad(g, A.x, A.y, ux, uy, 1.54, 20, .14, 30, '#e0664d');
}

function drawWestWall(g) {
  for (let y = IN.y0; y <= IN.y1; y++) {
    const A = iso(IN.x0, y), B = iso(IN.x0, y + 1);
    g.fillStyle = (y % 2) ? '#f2e1c1' : '#eddab6';
    g.beginPath(); g.moveTo(A.x, A.y); g.lineTo(B.x, B.y);
    g.lineTo(B.x, B.y - WALL_H); g.lineTo(A.x, A.y - WALL_H); g.closePath(); g.fill();
  }
  const A3 = iso(IN.x0, IN.y0), B9 = iso(IN.x0, IN.y1 + 1);
  g.fillStyle = '#fbf0d8';
  g.beginPath(); g.moveTo(A3.x, A3.y - WALL_H); g.lineTo(B9.x, B9.y - WALL_H);
  g.lineTo(B9.x, B9.y - WALL_H - 5); g.lineTo(A3.x, A3.y - WALL_H - 5); g.closePath(); g.fill();
  // картина с котом
  const A = iso(IN.x0, 5), ux = -32, uy = 16;
  wallQuad(g, A.x, A.y, ux, uy, .2, 24, .6, 22, '#c9a24b');
  wallQuad(g, A.x, A.y, ux, uy, .26, 27, .48, 16, '#f6ecd8');
  wallQuad(g, A.x, A.y, ux, uy, .38, 29, .24, .2, '#4a3524');
  wallQuad(g, A.x, A.y, ux, uy, .36, 32, .1, .1, '#4a3524');
  wallQuad(g, A.x, A.y, ux, uy, .54, 32, .1, .1, '#4a3524');
  wallQuad(g, A.x, A.y, ux, uy, .42, 35, .16, .12, '#4a3524');
}

function drawStubH(g, x) {
  const A = iso(x, IN.y1 + 1), B = iso(x + 1, IN.y1 + 1);
  g.fillStyle = '#d9c39a';
  g.beginPath(); g.moveTo(A.x, A.y); g.lineTo(B.x, B.y);
  g.lineTo(B.x, B.y - LOW_H); g.lineTo(A.x, A.y - LOW_H); g.closePath(); g.fill();
  g.fillStyle = '#f0e0ba';
  g.beginPath(); g.moveTo(A.x, A.y - LOW_H); g.lineTo(B.x, B.y - LOW_H);
  g.lineTo(B.x, B.y - LOW_H - 3); g.lineTo(A.x, A.y - LOW_H - 3); g.closePath(); g.fill();
}
function drawStubV(g, y) {
  const A = iso(IN.x1 + 1, y), B = iso(IN.x1 + 1, y + 1);
  g.fillStyle = '#c9b184';
  g.beginPath(); g.moveTo(A.x, A.y); g.lineTo(B.x, B.y);
  g.lineTo(B.x, B.y - LOW_H); g.lineTo(A.x, A.y - LOW_H); g.closePath(); g.fill();
  g.fillStyle = '#e6d5ac';
  g.beginPath(); g.moveTo(A.x, A.y - LOW_H); g.lineTo(B.x, B.y - LOW_H);
  g.lineTo(B.x, B.y - LOW_H - 3); g.lineTo(A.x, A.y - LOW_H - 3); g.closePath(); g.fill();
}
function drawDoorPost(g, xe, lintel) {
  const s = iso(xe, IN.y1 + 1);
  g.fillStyle = '#8a6644';
  g.beginPath(); g.rect(s.x - 3.5, s.y - 30, 7, 30); g.fill();
  g.fillStyle = '#a87c4f';
  g.beginPath(); g.rect(s.x - 4.5, s.y - 33, 9, 5); g.fill();
  if (lintel) {
    const s2 = iso(xe + 1, IN.y1 + 1);
    g.fillStyle = '#a87c4f';
    g.beginPath(); g.moveTo(s.x - 5, s.y - 32); g.lineTo(s2.x + 5, s2.y - 32);
    g.lineTo(s2.x + 5, s2.y - 26); g.lineTo(s.x - 5, s.y - 26); g.closePath(); g.fill();
  }
}

export function collectWallDrawables(g, state, night = 0) {
  const D = [
    { d: 2.5, f: () => drawNorthWall(g, night) },
    { d: 3.5, f: () => drawWestWall(g) },
  ];
  for (const x of [4, 5, 6, 8, 9, 10]) D.push({ d: x + 9.8, f: () => drawStubH(g, x) });
  for (let y = 3; y <= 8; y++) D.push({ d: y + 11.05, f: () => drawStubV(g, y) });
  D.push({ d: 16.9, f: () => drawDoorPost(g, 7, true) });
  D.push({ d: 17.9, f: () => drawDoorPost(g, 8, false) });
  return D;
}