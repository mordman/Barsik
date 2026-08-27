import { iso } from '../../world/Iso.js';

export function drawParticles(g, list) {
  for (const p of list) {
    const s = iso(p.x, p.y);
    g.globalAlpha = Math.max(0, 1 - p.t / p.life);
    switch (p.type) {
      case 'heart':
        g.fillStyle = '#ff6b8a';
        g.save(); g.translate(s.x + Math.sin(p.t * 6) * 3, s.y - 22 - p.t * 26);
        heart(g, 5 + p.t * 2); g.fill(); g.restore();
        break;
      case 'zzz':
        g.fillStyle = '#cfe3ff';
        g.font = `800 ${11 + p.t * 8}px Nunito`;
        g.textAlign = 'center';
        g.fillText('z', s.x + 8 + p.t * 8, s.y - 30 - p.t * 22);
        break;
      case 'spark': {
        g.strokeStyle = '#ffd166'; g.lineWidth = 1.8;
        g.save(); g.translate(s.x + p.vx * 14, s.y - 14 + p.vy * 8);
        const r = 4 * (1 - p.t / p.life) + 1;
        g.beginPath(); g.moveTo(-r, 0); g.lineTo(r, 0); g.moveTo(0, -r); g.lineTo(0, r); g.stroke();
        g.restore(); break;
      }
      case 'crumb':
        g.fillStyle = '#9c6b33';
        g.beginPath(); g.arc(s.x, s.y - 6 + p.t * 14, 1.6, 0, 7); g.fill(); break;
      case 'sand':
        g.fillStyle = '#e8d8a8';
        g.beginPath(); g.arc(s.x + p.vx * 10, s.y - 8 + p.t * 10, 1.6, 0, 7); g.fill(); break;
      case 'puff':
        g.fillStyle = 'rgba(230,230,220,.5)';
        g.beginPath(); g.arc(s.x, s.y - 4 - p.t * 8, 3 + p.t * 8, 0, 7); g.fill(); break;
    }
    g.globalAlpha = 1;
  }
}

function heart(g, s) {
  g.beginPath(); g.moveTo(0, s * .35);
  g.bezierCurveTo(-s, -s * .45, -s * .5, -s * 1.1, 0, -s * .4);
  g.bezierCurveTo(s * .5, -s * 1.1, s, -s * .45, 0, s * .35);
  g.closePath();
}