import { rr } from '../helpers.js';

export function drawBubble(g, b, sx, sy) {
  if (!b) return;
  const k = Math.min(1, b.t * 5);
  const fade = b.t > b.dur - .3 ? Math.max(0, (b.dur - b.t) / .3) : 1;
  g.save();
  g.globalAlpha = fade;
  g.translate(sx, sy); g.scale(k, k);
  g.font = '800 13px Nunito';
  const w = g.measureText(b.text).width + 20;
  g.fillStyle = 'rgba(255,253,245,.96)';
  rr(g, -w / 2, -30, w, 26, 10); g.fill();
  g.beginPath(); g.moveTo(-5, -5); g.lineTo(5, -5); g.lineTo(0, 3); g.closePath(); g.fill();
  g.fillStyle = '#3a2f28'; g.textAlign = 'center';
  g.fillText(b.text, 0, -12);
  g.restore();
}