import { clamp } from '../core/utils.js';

const add = (v, d) => clamp(v + d, 0, 100);

export const ACTIONS = {
  food: {
    dur: 3.2, state: 'eat',
    denyMsg: 'Миска пустая! Подожди немножко 🍽️',
    canStart: s => s.world.bowlFood > 0,
    place: (c, it) => { c.x = it.x + .55; c.y = it.y + .8; c.face = 'left'; },
    onUpdate: (s, dt) => {
      s.needs.food = add(s.needs.food, 13 * dt);
      s.world.bowlFood = Math.max(0, 1 - s.cat.actionT / 3.2);
    },
    onFinish: s => {
      s.world.bowlFood = 0; s.world.refillT = 30;
      s.needs.toilet = clamp(s.needs.toilet - 6, 0, 100);
    },
    toast: 'Ням! Миска опустела 😋',
    fx: { type: 'crumb', x: 5.5,  y: 3.5, rate: 6 },
  },

  water: {
    dur: 1.6, state: 'drink',
    place: (c, it) => { c.x = it.x + .55; c.y = it.y + .8; c.face = 'left'; },
    onUpdate: (s, dt) => { s.needs.food = add(s.needs.food, 3 * dt); },
    bubble: 'Хлюп-хлюп 💧',
  },

  bed: {
    dur: Infinity, state: 'sleep',
    until: s => s.needs.energy >= 100,
    place: c => { c.x = 10.5; c.y = 3.6; c.face = 'right'; },
    onUpdate: s => {
      s.cat.zzzT = (s.cat.zzzT || 0) - 1 / 60;
      if (s.cat.zzzT <= 0) { s.cat.zzzT = 1.2; s.cat.bubble = { text: '💤', t: 0, dur: 1.1 }; }
    },
    onFinish: () => {},
    toast: 'Выспался! Бодр и мурр 😺',
  },

  litter: {
    dur: 3, state: 'litter',
    place: c => { c.x = 10.5; c.y = 8.45; c.face = 'down'; },
    onFinish: s => { s.needs.toilet = 100; },
    toast: 'Лоток — порядок ✨',
    fx: { type: 'sand',  x: 10.5, y: 8.5, rate: 8 },
  },

  sofa: {
    dur: 6, state: 'lounge',
    place: c => { c.x = 9; c.y = 3.95; c.face = 'down'; },
    onUpdate: (s, dt) => {
      s.needs.energy = add(s.needs.energy, 4.5 * dt);
      s.needs.fun = add(s.needs.fun, 2.5 * dt);
    },
    bubble: 'Мрр… диван мой 😌',
  },

  yarn: {
    dur: 6, state: 'play',
    place: () => {},
    onUpdate: (s, dt) => {
      s.needs.fun = add(s.needs.fun, 8 * dt);
      s.needs.energy = clamp(s.needs.energy - 2.5 * dt, 0, 100);
      s.world.yarnWob = 1;
      const a = s.cat.actionT * 2.4;
      s.cat.x = 7.5 + Math.cos(a) * .62;
      s.cat.y = 6.65 + Math.sin(a) * .45;
    },
    toast: 'Клубок побеждён! 🧶',
  },

  scratch: {
    dur: 2.8, state: 'scratch',
    place: c => { c.x = 5.28; c.y = 4.5; c.face = 'left'; },
    onUpdate: (s, dt) => { s.world.postWob = 1; s.needs.fun = add(s.needs.fun, 6 * dt); },
    toast: 'Когти острые, как сабельки 🗡️',
    fx: { type: 'puff',  x: 4.5,  y: 4.5, rate: 8 },
  },

  sniff: {
    dur: 1.8, state: 'sniff',
    place: (c, it) => {
      const dx = c.x - it.x, dy = c.y - it.y, d = Math.hypot(dx, dy) || 1;
      c.x = it.x + dx / d * .55; c.y = it.y + dy / d * .55;
      c.face = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up');
    },
    onFinish: s => { s.needs.fun = add(s.needs.fun, 7); },
    bubble: () => Math.random() < .3 ? 'Апчхи!! 🤧' : 'Мм, пахнет 🌸',
  },

  social: {
    dur: 4, state: 'social',
    place: c => { c.x = 12.35; c.y = 8.5; c.face = 'right'; },
    onUpdate: (s, dt) => {
      s.needs.social = add(s.needs.social, 12 * dt);
      for (const m of [.5, 1.6, 2.7]) if (Math.abs(s.cat.actionT - m) < dt) {
        if (Math.floor(m * 2) % 2 === 0) s.cat.bubble = { text: 'Мяу!', t: 0, dur: 1.4 };
        else s.npc.bubble = { text: 'Мрр!', t: 0, dur: 1.4 };
      }
    },
    toast: 'Пообщались с Барсиком 💬',
  },
    stalk: {
    dur: 2.3, state: 'stalk',
    place: (c, it) => { c.x = it.x; c.y = 11.55; c.face = 'down'; },
    //onUpdate: s => { if (s.cat.actionT > 1.5 && s.bird.flying <= 0) s.bird.flying = .01; },
    onFinish: s => { s.needs.fun = add(s.needs.fun, 10); },
    toast: 'Птичка улетела… но охота была прекрасна 🐦',
  },
};