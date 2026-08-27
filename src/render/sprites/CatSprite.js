import { iell, rr } from '../helpers.js';

export const PAL = {
  orange: { main: '#f09d4c', dark: '#c9752f', cream: '#ffe8c8', pink: '#ff9db0', eye: '#4f9e56' },
  gray:   { main: '#9aa3ad', dark: '#6f7a86', cream: '#e6e9ee', pink: '#e78f9e', eye: '#c99a2f' },
};

// состояние → параметры отрисовки
export function catOpts(s) {
  const c = s.cat;
  let face = c.face, pose = c.pose || 'stand', hop = 0;
  switch (c.state) {
    case 'eat': case 'drink': case 'sniff': pose = 'eat'; break;
    case 'sleep':   pose = 'sleep'; break;
    case 'litter': case 'lounge': pose = 'sitfront'; face = 'down'; break;
    case 'social':  pose = 'sit'; break;
    case 'scratch': pose = 'scratch'; break;
    case 'stalk': pose = 'wiggle'; face = 'down'; break;
    case 'play':
      face = Math.cos(c.actionT * 2.4) >= 0 ? 'right' : 'left';
      hop = Math.abs(Math.sin(c.actionT * 7)) * 7;
      break;
  }
  if (pose === 'sit' && (face === 'up' || face === 'down')) face = 'right';
  return { pal: PAL.orange, face, pose, phase: c.phase, t: s.time.t, squint: c.petT > 0, hop };
  
}

export function drawCat(g, sx, sy, o) {
  g.save(); g.translate(sx, sy);
  g.fillStyle = 'rgba(10,18,12,.3)'; iell(g, 0, 2, 15, 5.5);
  if (o.pose === 'sleep') sleepCat(g, o.pal, o.t);
  else if (o.face === 'down') frontCat(g, o.pal, o);
  else if (o.face === 'up') backCat(g, o.pal, o);
  else sideCat(g, o.pal, o);
  g.restore();
}

function headSide(g, p, o, dip, rot) {
  g.save(); g.translate(10, -19 + dip); g.rotate(rot || 0);
  g.fillStyle = p.main;
  g.beginPath(); g.moveTo(-6,-5); g.lineTo(-8,-14); g.lineTo(-1,-8); g.closePath(); g.fill();
  g.beginPath(); g.moveTo(2,-8);  g.lineTo(6,-15);  g.lineTo(8,-5);  g.closePath(); g.fill();
  g.fillStyle = p.pink;
  g.beginPath(); g.moveTo(-5.5,-7); g.lineTo(-6.8,-12); g.lineTo(-2.5,-8.5); g.closePath(); g.fill();
  g.beginPath(); g.moveTo(3.2,-8.5); g.lineTo(5.6,-12.6); g.lineTo(6.8,-7); g.closePath(); g.fill();
  g.fillStyle = p.main; g.beginPath(); g.arc(0, 0, 8, 0, 7); g.fill();
  g.strokeStyle = p.dark; g.lineWidth = 1.6;
  g.beginPath(); g.moveTo(-2,-7); g.lineTo(-2.5,-5); g.moveTo(1,-7.5); g.lineTo(.8,-5.2);
  g.moveTo(4,-7); g.lineTo(4.2,-5); g.stroke();
  g.fillStyle = p.cream; iell(g, 1.5, 3.5, 5, 3.2);
  const closed = ((o.t % 3.3) < .13) || o.squint;
  if (closed) {
    g.strokeStyle = p.dark; g.lineWidth = 1.5;
    g.beginPath(); g.arc(-2.5,-.5,1.8,Math.PI*.15,Math.PI*.85); g.stroke();
    g.beginPath(); g.arc(3.5,-.5,1.8,Math.PI*.15,Math.PI*.85); g.stroke();
  } else {
    g.fillStyle = p.eye;
    g.beginPath(); g.ellipse(-2.5,-.6,1.9,2.4,0,0,7); g.fill();
    g.beginPath(); g.ellipse(3.5,-.6,1.9,2.4,0,0,7); g.fill();
    g.fillStyle = '#1c1c1c';
    g.beginPath(); g.ellipse(-2.5,-.6,.8,2,0,0,7); g.fill();
    g.beginPath(); g.ellipse(3.5,-.6,.8,2,0,0,7); g.fill();
  }
  g.fillStyle = p.pink;
  g.beginPath(); g.moveTo(6.4,.8); g.lineTo(8.4,.8); g.lineTo(7.4,2.4); g.closePath(); g.fill();
  g.strokeStyle = p.dark; g.lineWidth = 1;
  g.beginPath(); g.arc(6.6,3.4,1.2,0,Math.PI*.9); g.arc(8.4,3.4,1.2,Math.PI*.1,Math.PI); g.stroke();
  g.strokeStyle = 'rgba(70,45,25,.55)'; g.lineWidth = .8;
  g.beginPath(); g.moveTo(6,2.6); g.lineTo(13,1.4); g.moveTo(6,3.4); g.lineTo(13.5,3.6);
  g.moveTo(6,4.2); g.lineTo(12.5,5.6); g.stroke();
  g.restore();
}

function sideCat(g, p, o) {
  g.save();
  if (o.face === 'left') g.scale(-1, 1);
  const walk = o.pose === 'walk', ph = o.phase || 0;
  const dip = o.pose === 'eat' ? 6 + Math.sin(o.t * 9) * 2.6 : 0;   // поза появится в М4
  g.translate(0, -(o.hop || 0));
  if (o.pose === 'scratch') g.rotate(-.12);
  if (dip) g.rotate(.08);

  // хвост
  const sw = Math.sin(o.t * 2.2 + 1) * (walk ? 5 : 3);
  g.strokeStyle = p.main; g.lineWidth = 5; g.lineCap = 'round';
  g.beginPath(); g.moveTo(-10,-11); g.bezierCurveTo(-16,-14,-19,-20+sw*.4,-17,-27+sw); g.stroke();
  g.strokeStyle = p.dark;
  g.beginPath(); g.moveTo(-17.4,-24.6+sw*.8); g.lineTo(-17,-27+sw); g.stroke();

  if (o.pose === 'sit') {
    g.fillStyle = p.main; iell(g,-3,-9,10.5,9.5); iell(g,6,-12,6.5,7.5);
    g.fillStyle = p.cream; iell(g,6,-9,4,4.5);
    g.strokeStyle = p.main; g.lineWidth = 4.6;
    g.beginPath(); g.moveTo(-12,-5); g.bezierCurveTo(-8,-1,0,-.5,7,-1.5); g.stroke();
    g.fillStyle = p.dark; g.beginPath(); g.arc(7,-1.5,2.4,0,7); g.fill();
    g.fillStyle = p.main;
    rr(g,3.5,-9,3.2,9,1.5); g.fill(); rr(g,7.5,-9,3.2,9,1.5); g.fill();
    g.fillStyle = p.cream;
    rr(g,3.3,-2.4,3.6,2.4,1.2); g.fill(); rr(g,7.3,-2.4,3.6,2.4,1.2); g.fill();
    g.strokeStyle = p.dark; g.lineWidth = 2.4;
    g.beginPath(); g.arc(-5,-15,2.6,Math.PI*.9,Math.PI*1.9); g.stroke();
    headSide(g, p, o, 0, 0);
    g.restore(); return;
  }

  const A = walk ? Math.sin(ph * 2) : 0, B = -A;
  const lift = v => Math.max(0, v) * 2.2;
  const leg = (x, lf, far) => {
    g.fillStyle = far ? p.dark : p.main;
    rr(g, x, -9 - lf, 3.5, 9, 1.5); g.fill();
    if (!far) { g.fillStyle = p.cream; rr(g, x - .2, -2.6 - lf, 3.9, 2.6, 1.2); g.fill(); }
  };
  leg(-4, lift(B), true); leg(5, lift(A), true);

  const bob = walk ? Math.sin(ph * 2) * 1.1 : Math.sin(o.t * 1.7) * .5;
  g.fillStyle = p.main; iell(g, 0, -12 + bob, 13.5, 8.8);
  g.fillStyle = p.cream; iell(g, 2, -9 + bob, 8, 4.5);
  g.strokeStyle = p.dark; g.lineWidth = 2.8;
  for (const sx of [-6, -1, 4]) {
    g.beginPath(); g.arc(sx, -13 + bob, 7, Math.PI * 1.15, Math.PI * 1.75); g.stroke();
  }
  leg(-8, lift(A), false); leg(9, lift(B), false);
    if (o.pose === 'scratch') {
    const up = Math.sin(o.t * 14) * 2;
    g.fillStyle = p.main;
    rr(g, 6, -17 - up, 3.4, 9, 1.5); g.fill();
    rr(g, 9.5, -16 + up, 3.4, 8, 1.5); g.fill();
  }
  headSide(g, p, o, dip, dip ? .15 : 0);
  g.restore();
}

function frontCat(g, p, o) {
    if (o.pose === 'wiggle') g.translate(Math.sin(o.t * 16) * 2, 0);
  const walk = o.pose === 'walk';
  const bob = walk ? Math.sin(o.phase * 2) * 1.3 : Math.sin(o.t * 1.8) * .6;
  const sw = Math.sin(o.t * 2.2) * 4;
  g.strokeStyle = p.main; g.lineWidth = 5; g.lineCap = 'round';
  g.beginPath(); g.moveTo(8,-9); g.bezierCurveTo(15,-13,16,-20+sw*.4,14,-25+sw); g.stroke();
  g.fillStyle = p.main; iell(g, 0, -11 + bob * .4, 10, 11);
  g.fillStyle = p.cream; iell(g, 0, -7 + bob * .4, 6, 7);
  const st = walk ? Math.sin(o.phase * 2) * 2 : 0;
  g.fillStyle = p.main;
  rr(g,-6.5,-4-Math.max(0,st),4.2,5,2); g.fill();
  rr(g,2.3,-4-Math.max(0,-st),4.2,5,2); g.fill();
  g.fillStyle = p.cream;
  rr(g,-6.7,-1-Math.max(0,st),4.6,2,1); g.fill();
  rr(g,2.1,-1-Math.max(0,-st),4.6,2,1); g.fill();
  g.save(); g.translate(0, -22 + bob);
  g.fillStyle = p.main;
  g.beginPath(); g.moveTo(-8,-3); g.lineTo(-9.5,-13); g.lineTo(-1,-7); g.closePath(); g.fill();
  g.beginPath(); g.moveTo(8,-3);  g.lineTo(9.5,-13);  g.lineTo(1,-7);  g.closePath(); g.fill();
  g.fillStyle = p.pink;
  g.beginPath(); g.moveTo(-6.8,-5); g.lineTo(-7.8,-11); g.lineTo(-2.8,-6.8); g.closePath(); g.fill();
  g.beginPath(); g.moveTo(6.8,-5);  g.lineTo(7.8,-11);  g.lineTo(2.8,-6.8);  g.closePath(); g.fill();
  g.fillStyle = p.main; g.beginPath(); g.arc(0, 0, 9, 0, 7); g.fill();
  g.strokeStyle = p.dark; g.lineWidth = 1.6;
  g.beginPath(); g.moveTo(-2.5,-8); g.lineTo(-2.5,-5.5); g.moveTo(0,-8.5); g.lineTo(0,-6);
  g.moveTo(2.5,-8); g.lineTo(2.5,-5.5); g.stroke();
  g.fillStyle = p.cream; iell(g,-4.5,3,3.4,2.6); iell(g,4.5,3,3.4,2.6);
  const closed = ((o.t % 3.3) < .13) || o.squint;
  if (closed) {
    g.strokeStyle = p.dark; g.lineWidth = 1.6;
    g.beginPath(); g.arc(-3.5,-.5,2,Math.PI*.15,Math.PI*.85); g.stroke();
    g.beginPath(); g.arc(3.5,-.5,2,Math.PI*.15,Math.PI*.85); g.stroke();
  } else {
    g.fillStyle = p.eye;
    g.beginPath(); g.ellipse(-3.5,-.5,2.2,2.7,0,0,7); g.fill();
    g.beginPath(); g.ellipse(3.5,-.5,2.2,2.7,0,0,7); g.fill();
    g.fillStyle = '#1c1c1c';
    g.beginPath(); g.ellipse(-3.5,-.5,.9,2.2,0,0,7); g.fill();
    g.beginPath(); g.ellipse(3.5,-.5,.9,2.2,0,0,7); g.fill();
  }
  g.fillStyle = p.pink;
  g.beginPath(); g.moveTo(-1.3,2.6); g.lineTo(1.3,2.6); g.lineTo(0,4.2); g.closePath(); g.fill();
  g.strokeStyle = p.dark; g.lineWidth = 1;
  g.beginPath(); g.arc(-1.2,5.2,1.3,0,Math.PI*.9); g.arc(1.2,5.2,1.3,Math.PI*.1,Math.PI); g.stroke();
  g.strokeStyle = 'rgba(70,45,25,.55)'; g.lineWidth = .8;
  g.beginPath(); g.moveTo(-6,2); g.lineTo(-13,.8); g.moveTo(-6,3.2); g.lineTo(-13.5,3.4);
  g.moveTo(6,2); g.lineTo(13,.8); g.moveTo(6,3.2); g.lineTo(13.5,3.4); g.stroke();
  g.restore();
}

function backCat(g, p, o) {
  const walk = o.pose === 'walk';
  const bob = walk ? Math.sin(o.phase * 2) * 1.2 : Math.sin(o.t * 1.7) * .5;
  const sw = Math.sin(o.t * 2.4) * 5;
  g.strokeStyle = p.main; g.lineWidth = 5; g.lineCap = 'round';
  g.beginPath(); g.moveTo(3,-9); g.bezierCurveTo(7,-16,8+sw*.4,-24,6+sw,-29); g.stroke();
  g.strokeStyle = p.dark;
  g.beginPath(); g.moveTo(6.4+sw*.8,-27); g.lineTo(6+sw,-29); g.stroke();
  g.fillStyle = p.main; iell(g, 0, -11 + bob * .4, 10.5, 11);
  g.strokeStyle = p.dark; g.lineWidth = 2.6;
  for (const sx of [-4, 0, 4]) { g.beginPath(); g.arc(sx,-14+bob*.4,6,Math.PI*1.15,Math.PI*1.8); g.stroke(); }
  if (walk) {
    const A = Math.sin(o.phase * 2);
    g.fillStyle = p.main;
    iell(g, -4, -1 - Math.max(0, A) * 2, 2.4, 1.6);
    iell(g,  4, -1 - Math.max(0, -A) * 2, 2.4, 1.6);
  }
  g.save(); g.translate(0, -22 + bob);
  g.fillStyle = p.main;
  g.beginPath(); g.moveTo(-8,-3); g.lineTo(-9.5,-13); g.lineTo(-1,-7); g.closePath(); g.fill();
  g.beginPath(); g.moveTo(8,-3);  g.lineTo(9.5,-13);  g.lineTo(1,-7);  g.closePath(); g.fill();
  g.beginPath(); g.arc(0, 0, 9, 0, 7); g.fill();
  g.strokeStyle = p.dark; g.lineWidth = 1.8;
  g.beginPath(); g.moveTo(-2,-8); g.lineTo(-2.4,-5); g.moveTo(2,-8); g.lineTo(2.4,-5); g.stroke();
  g.restore();
}

function sleepCat(g, p, t) {
  const br = Math.sin(t * 1.6) * .9;
  g.strokeStyle = p.main; g.lineWidth = 5; g.lineCap = 'round';
  g.beginPath(); g.moveTo(13,-5); g.bezierCurveTo(10,-1,-2,-.5,-11,-3); g.stroke();
  g.fillStyle = p.dark; g.beginPath(); g.arc(-11, -3, 2.6, 0, 7); g.fill();
  g.fillStyle = p.main; iell(g, 0, -7, 15, 9 + br);
  g.strokeStyle = p.dark; g.lineWidth = 2.6;
  g.beginPath(); g.arc(-3,-11,8,Math.PI*1.1,Math.PI*1.7); g.stroke();
  g.beginPath(); g.arc(2,-10,7,Math.PI*1.15,Math.PI*1.75); g.stroke();
  g.save(); g.translate(8, -10);
  g.fillStyle = p.main;
  g.beginPath(); g.moveTo(-5,-4); g.lineTo(-7,-11); g.lineTo(-1,-6); g.closePath(); g.fill();
  g.beginPath(); g.moveTo(1,-6);  g.lineTo(4,-12);  g.lineTo(6,-4);  g.closePath(); g.fill();
  g.beginPath(); g.arc(0, 0, 7, 0, 7); g.fill();
  g.strokeStyle = p.dark; g.lineWidth = 1.4;
  g.beginPath(); g.arc(-2.5,.5,1.7,Math.PI*.15,Math.PI*.85); g.stroke();
  g.fillStyle = p.pink;
  g.beginPath(); g.moveTo(3.4,1.6); g.lineTo(5.2,1.6); g.lineTo(4.3,3); g.closePath(); g.fill();
  g.restore();
}