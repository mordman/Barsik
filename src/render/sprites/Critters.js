import { iso } from '../../world/Iso.js';

export function drawButterfly(g, b, t) {
  const s = iso(b.x, b.y);
  g.fillStyle = 'rgba(0,0,0,.14)';
  g.save(); g.translate(s.x, s.y); g.scale(1, .4);
  g.beginPath(); g.arc(0, 0, 5, 0, 7); g.fill(); g.restore();

  g.save(); g.translate(s.x, s.y - 16 + Math.sin(t * 3 + b.ph) * 3);
  const flap = Math.abs(Math.sin(t * 12 + b.ph)) * .85 + .15;
  g.fillStyle = ['#ffd166', '#e86fa0', '#9ad0ff'][Math.floor(b.ph) % 3];
  g.save(); g.rotate(-.35); g.scale(flap, 1);
  g.beginPath(); g.ellipse(-4, 0, 4.5, 6, 0, 0, 7); g.fill(); g.restore();
  g.save(); g.rotate(.35); g.scale(flap, 1);
  g.beginPath(); g.ellipse(4, 0, 4.5, 6, 0, 0, 7); g.fill(); g.restore();
  g.strokeStyle = '#3a2f28'; g.lineWidth = 1.6;
  g.beginPath(); g.moveTo(0, -4); g.lineTo(0, 4); g.stroke();
  g.restore();
}

export function drawBird(g, state, t) {
  const b = state.bird;
  const s = iso(b.x, 13.2);
  if (b.flying > 0) {
    const fy = b.flying;
    g.save(); g.globalAlpha = Math.max(0, 1 - fy / 1.6);
    g.translate(s.x + fy * 46, s.y - 20 - fy * 60);
    g.fillStyle = '#7d8fa3';
    g.beginPath(); g.ellipse(0, 0, 6, 4, -.3, 0, 7); g.fill();
    const w = Math.sin(fy * 40) * 6;
    g.strokeStyle = '#5c6d80'; g.lineWidth = 2.4;
    g.beginPath(); g.moveTo(-2, -2); g.quadraticCurveTo(-8, -6 - w, -13, -4 - w); g.stroke();
    g.beginPath(); g.moveTo(2, -2); g.quadraticCurveTo(8, -6 - w, 13, -4 - w); g.stroke();
    g.restore();
    return;
  }
  const hop = Math.abs(b.tx - b.x) > .1 ? Math.abs(Math.sin(t * 10)) * 2.5 : 0;
  g.save(); g.translate(s.x, s.y - 19 - hop);
  g.fillStyle = '#7d8fa3';
  g.beginPath(); g.ellipse(0, 0, 5.5, 4.2, 0, 0, 7); g.fill();
  g.beginPath(); g.arc(4.5, -3, 3.2, 0, 7); g.fill();
  g.fillStyle = '#f0a33c';
  g.beginPath(); g.moveTo(7.2, -3); g.lineTo(10, -2.2); g.lineTo(7.2, -1.6); g.closePath(); g.fill();
  g.fillStyle = '#222'; g.beginPath(); g.arc(5.2, -3.6, .7, 0, 7); g.fill();
  g.strokeStyle = '#5c6d80'; g.lineWidth = 1.8;
  g.beginPath(); g.moveTo(-5, -1); g.lineTo(-9, -4); g.stroke();
  g.strokeStyle = '#f0a33c'; g.lineWidth = 1;
  g.beginPath(); g.moveTo(-1, 4); g.lineTo(-1, 6); g.moveTo(2, 4); g.lineTo(2, 6); g.stroke();
  g.restore();
}