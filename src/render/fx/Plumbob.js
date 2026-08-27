export function drawPlumbob(g, sx, sy, t, worstNeed) {
  const y = sy + Math.sin(t * 2) * 3;
  const col = worstNeed < 25 ? '#ff9a3f' : worstNeed < 50 ? '#d9d94f' : '#62d974';
  const rx = Math.cos(t * 2.4) * 6.5;
  g.save(); g.globalAlpha = .9;
  g.fillStyle = col;
  g.beginPath(); g.moveTo(sx, y - 13); g.lineTo(sx + rx, y - 6.5);
  g.lineTo(sx, y); g.lineTo(sx - rx, y - 6.5); g.closePath(); g.fill();
  g.fillStyle = 'rgba(0,0,0,.18)';
  g.beginPath(); g.moveTo(sx, y - 13); g.lineTo(sx + rx, y - 6.5); g.lineTo(sx, y); g.closePath(); g.fill();
  g.strokeStyle = 'rgba(255,255,255,.5)'; g.lineWidth = 1;
  g.beginPath(); g.moveTo(sx, y - 13); g.lineTo(sx + rx, y - 6.5); g.lineTo(sx, y);
  g.lineTo(sx - rx, y - 6.5); g.closePath(); g.stroke();
  g.restore();
}