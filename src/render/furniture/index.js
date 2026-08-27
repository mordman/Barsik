import { FURNITURE } from '../../config/map.js';
import { iso } from '../../world/Iso.js';
import { iell, rr } from '../helpers.js';

const pos = id => FURNITURE.find(f => f.id === id);

function bowlFood(g, s, state) {
  const p = iso(s.x, s.y), lvl = state.world.bowlFood;
  g.fillStyle = 'rgba(0,0,0,.2)'; iell(g, p.x, p.y, 12, 5);
  g.fillStyle = '#b34f3d'; iell(g, p.x, p.y - 1, 11, 4.5);
  g.fillStyle = '#e0664d'; iell(g, p.x, p.y - 5, 11, 4.5);
  g.fillStyle = '#8c3a2c'; iell(g, p.x, p.y - 5, 7.5, 3);
  if (lvl > 0) {
    g.fillStyle = '#9c6b33';
    iell(g, p.x, p.y - 5.5, 6.5 * Math.max(.35, lvl), 2.6 * Math.max(.35, lvl));
    g.fillStyle = '#7a4f22';
    for (let i = 0; i < 4 * lvl; i++) {
      const a = ((i * 2654435761) % 100) / 100 * 6.28;
      g.beginPath(); g.arc(p.x + Math.cos(a) * 4 * lvl, p.y - 6 + Math.sin(a) * 1.6, 1.2, 0, 7); g.fill();
    }
  }
}
function bowlWater(g, s, state) {
  const p = iso(s.x, s.y), t = state.time.t;
  g.fillStyle = 'rgba(0,0,0,.2)'; iell(g, p.x, p.y, 11, 4.5);
  g.fillStyle = '#3c78a8'; iell(g, p.x, p.y - 1, 10, 4);
  g.fillStyle = '#4f97c7'; iell(g, p.x, p.y - 4.5, 10, 4);
  g.fillStyle = '#8fd0f0'; iell(g, p.x, p.y - 4.5, 7, 2.8);
  g.strokeStyle = 'rgba(255,255,255,.7)'; g.lineWidth = 1.2;
  g.beginPath(); g.arc(p.x - 2, p.y - 5, 3, Math.PI * 1.1 + t, Math.PI * 1.6 + t); g.stroke();
}
function bed(g, s) {
  const p = iso(s.x, s.y);
  g.fillStyle = 'rgba(0,0,0,.22)'; iell(g, p.x, p.y + 1, 22, 9);
  g.fillStyle = '#a84a3e'; iell(g, p.x, p.y - 2, 21, 9);
  g.fillStyle = '#c65b4e'; iell(g, p.x, p.y - 6, 21, 9);
  g.fillStyle = '#f2ddb0'; iell(g, p.x, p.y - 5.5, 13.5, 5.5);
}
function sofa(g) {
  const h = 13, bh = 30;
  const P = (x, y, z) => { const s = iso(x, y); return { x: s.x, y: s.y - z }; };
  const bD = P(8, 3.3, bh), bC = P(10, 3.3, bh), bA = P(8, 3, bh), bB = P(10, 3, bh);
  g.fillStyle = '#f09a70';
  g.beginPath(); g.moveTo(bD.x, bD.y); g.lineTo(bC.x, bC.y);
  g.lineTo(P(10, 3.3, 0).x, P(10, 3.3, 0).y); g.lineTo(P(8, 3.3, 0).x, P(8, 3.3, 0).y); g.closePath(); g.fill();
  g.fillStyle = '#f4a984';
  g.beginPath(); g.moveTo(bA.x, bA.y); g.lineTo(bB.x, bB.y); g.lineTo(bC.x, bC.y); g.lineTo(bD.x, bD.y); g.closePath(); g.fill();
  const tA = P(8, 3, h), tB = P(10, 3, h), tC = P(10, 4, h), tD = P(8, 4, h);
  g.fillStyle = '#d96a4f';
  g.beginPath(); g.moveTo(tD.x, tD.y); g.lineTo(tC.x, tC.y);
  g.lineTo(P(10, 4, 0).x, P(10, 4, 0).y); g.lineTo(P(8, 4, 0).x, P(8, 4, 0).y); g.closePath(); g.fill();
  g.fillStyle = '#b34f3d';
  g.beginPath(); g.moveTo(tB.x, tB.y); g.lineTo(tC.x, tC.y);
  g.lineTo(P(10, 4, 0).x, P(10, 4, 0).y); g.lineTo(P(10, 3, 0).x, P(10, 3, 0).y); g.closePath(); g.fill();
  g.fillStyle = '#e8875f';
  g.beginPath(); g.moveTo(tA.x, tA.y); g.lineTo(tB.x, tB.y); g.lineTo(tC.x, tC.y); g.lineTo(tD.x, tD.y); g.closePath(); g.fill();
  g.strokeStyle = 'rgba(140,50,30,.35)'; g.lineWidth = 1.5;
  for (const tx of [8.67, 9.33]) {
    g.beginPath(); g.moveTo(P(tx, 3, h).x, P(tx, 3, h).y); g.lineTo(P(tx, 4, h).x, P(tx, 4, h).y); g.stroke();
  }
  for (const [ax0, ax1] of [[8, 8.28], [9.72, 10]]) {
    const aA = P(ax0, 3, 22), aB = P(ax1, 3, 22), aC = P(ax1, 4, 22), aD = P(ax0, 4, 22);
    g.fillStyle = '#e8875f';
    g.beginPath(); g.moveTo(aA.x, aA.y); g.lineTo(aB.x, aB.y); g.lineTo(aC.x, aC.y); g.lineTo(aD.x, aD.y); g.closePath(); g.fill();
    g.fillStyle = '#c25a41';
    g.beginPath(); g.moveTo(aD.x, aD.y); g.lineTo(aC.x, aC.y);
    g.lineTo(P(ax1, 4, 0).x, P(ax1, 4, 0).y); g.lineTo(P(ax0, 4, 0).x, P(ax0, 4, 0).y); g.closePath(); g.fill();
  }
  const q = P(8.45, 3.35, h + 3);
  g.fillStyle = '#ffd166'; rr(g, q.x - 9, q.y - 7, 18, 14, 5); g.fill();
}
function scratch(g, s, state) {
  const p = iso(s.x, s.y);
  g.save(); g.translate(p.x, p.y);
  g.rotate(Math.sin(state.time.t * 22) * state.world.postWob * .05);
  g.fillStyle = 'rgba(0,0,0,.22)'; iell(g, 0, 1, 15, 6);
  g.fillStyle = '#a87c4f'; iell(g, 0, -1, 14, 6);
  g.fillStyle = '#caa06a'; rr(g, -5, -36, 10, 36, 3); g.fill();
  g.strokeStyle = '#a37c48'; g.lineWidth = 1.6;
  for (let yy = -32; yy < -4; yy += 5) { g.beginPath(); g.moveTo(-5, yy); g.lineTo(5, yy + 2); g.stroke(); }
  g.fillStyle = '#d9b06a'; iell(g, 0, -37, 8, 4);
  g.restore();
}
function lamp(g, s) {
  const p = iso(s.x, s.y);
  g.fillStyle = 'rgba(0,0,0,.2)'; iell(g, p.x, p.y, 9, 4);
  g.strokeStyle = '#5c4430'; g.lineWidth = 3;
  g.beginPath(); g.moveTo(p.x, p.y); g.lineTo(p.x, p.y - 40); g.stroke();
  g.fillStyle = '#ffd98a';
  g.beginPath(); g.moveTo(p.x - 11, p.y - 40); g.lineTo(p.x + 11, p.y - 40);
  g.lineTo(p.x + 7, p.y - 52); g.lineTo(p.x - 7, p.y - 52); g.closePath(); g.fill();
  g.fillStyle = '#e8b45e'; g.fillRect(p.x - 11, p.y - 40, 22, 2);
}
function yarn(g, s, state) {
  const p = iso(s.x, s.y);
  g.fillStyle = 'rgba(0,0,0,.2)'; iell(g, p.x, p.y, 10, 4);
  g.save(); g.translate(p.x, p.y - 6);
  g.rotate(Math.sin(state.time.t * 14) * state.world.yarnWob * .2);
  g.fillStyle = '#e0556e'; g.beginPath(); g.arc(0, 0, 8.5, 0, 7); g.fill();
  g.strokeStyle = '#b23a52'; g.lineWidth = 1.4;
  for (const r of [.35, .75]) { g.beginPath(); g.arc(0, 0, 8.5 * r, -.6, 2.6); g.stroke(); }
  g.beginPath(); g.arc(0, 0, 8.5, 2.5, 5); g.stroke();
  g.restore();
  g.strokeStyle = '#e0556e'; g.lineWidth = 1.6;
  g.beginPath(); g.moveTo(p.x + 7, p.y - 3); g.quadraticCurveTo(p.x + 16, p.y + 2, p.x + 22, p.y - 2); g.stroke();
}
function litterBase(g, s) {
  const ins = .16, x0 = 10 + ins, x1 = 11 - ins, y0 = 8 + ins, y1 = 9 - ins, z = 8;
  const A = iso(x0, y0), B = iso(x1, y0), C = iso(x1, y1), D = iso(x0, y1);
  g.fillStyle = 'rgba(0,0,0,.2)'; iell(g, (C.x + A.x) / 2, C.y + 2, 26, 9);
  g.fillStyle = '#93b5a7';
  g.beginPath(); g.moveTo(B.x, B.y - z); g.lineTo(C.x, C.y - z); g.lineTo(C.x, C.y); g.lineTo(B.x, B.y); g.closePath(); g.fill();
  g.fillStyle = '#a8c9bb';
  g.beginPath(); g.moveTo(D.x, D.y - z); g.lineTo(C.x, C.y - z); g.lineTo(C.x, C.y); g.lineTo(D.x, D.y); g.closePath(); g.fill();
  g.fillStyle = '#cfe3da';
  g.beginPath(); g.moveTo(A.x, A.y - z); g.lineTo(B.x, B.y - z); g.lineTo(C.x, C.y - z); g.lineTo(D.x, D.y - z); g.closePath(); g.fill();
  const ins2 = .3, a2 = iso(10 + ins2, 8 + ins2), c2 = iso(11 - ins2, 9 - ins2);
  g.fillStyle = '#e8d8a8';
  const b2 = iso(11 - ins2, 8 + ins2), d2 = iso(10 + ins2, 9 - ins2);
  g.beginPath(); g.moveTo(a2.x, a2.y - z); g.lineTo(b2.x, b2.y - z); g.lineTo(c2.x, c2.y - z); g.lineTo(d2.x, d2.y - z); g.closePath(); g.fill();
}
function litterFront(g) {
  const ins = .13, x1 = 11 - ins, y1 = 9 - ins, x0 = 10 + ins, y0 = 8 + ins, z = 9;
  const B = iso(x1, y0), C = iso(x1, y1), D = iso(x0, y1);
  g.fillStyle = '#7fa596';
  g.beginPath(); g.moveTo(B.x, B.y - z); g.lineTo(C.x, C.y - z); g.lineTo(C.x, C.y + 1); g.lineTo(B.x, B.y + 1); g.closePath(); g.fill();
  g.fillStyle = '#93bfae';
  g.beginPath(); g.moveTo(D.x, D.y - z); g.lineTo(C.x, C.y - z); g.lineTo(C.x, C.y + 1); g.lineTo(D.x, D.y + 1); g.closePath(); g.fill();
}

export function collectFurnitureDrawables(g, state) {
  return [
    { d: 9,    f: () => bowlFood(g, pos('food'), state) },
    { d: 10,   f: () => bowlWater(g, pos('water'), state) },
    { d: 14,   f: () => bed(g, pos('bed')) },
    { d: 13,   f: () => sofa(g) },
    { d: 9,    f: () => scratch(g, pos('scratch'), state) },
    { d: 16,   f: () => lamp(g, pos('lamp')) },
    { d: 13.5, f: () => yarn(g, pos('yarn'), state) },
    { d: 18.4, f: () => litterBase(g, pos('litter')) },
    { d: 19.4, f: () => litterFront(g) },
  ];
}