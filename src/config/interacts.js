import { FLOWERS } from './map.js';

export const INTERACTS = [
  { key:'food',   id:'food',   x:5.5,  y:3.5, r:1.15, icon:'🍗', label:'Поесть' },
  { key:'water',  id:'water',  x:6.5,  y:3.5, r:1.0,  icon:'💧', label:'Попить' },
  { key:'bed',    id:'bed',    x:10.5, y:3.5, r:1.35, icon:'🛏️', label:'Спать' },
  { key:'litter', id:'litter', x:10.5, y:8.5, r:1.2,  icon:'🚽', label:'Сходить в лоток' },
  { key:'sofa',   id:'sofa',   x:9,    y:3.9, r:1.4,  icon:'🛋️', label:'Полежать на диване' },
  { key:'yarn',   id:'yarn',   x:7.5,  y:6.5, r:1.1,  icon:'🧶', label:'Играть с клубком' },
  { key:'scratch',id:'scratch',x:4.5,  y:4.5, r:1.15, icon:'🐾', label:'Точить когти' },
  { key:'social', id:'social', x:13.5, y:8.5, r:1.65, icon:'💬', label:'Пообщаться с Барсиком' },
  ...FLOWERS.map((f, i) => ({
    key: 'sniff' + i, id: 'sniff', fi: i, x: f.x, y: f.y, r: .95, icon: '🌸', label: 'Понюхать цветок',
  })),
];

// Тайлы, с которых можно дотянуться до объекта (обход блокированных)
export const APPROACH = {};
export function buildApproach(map) {
  for (const it of INTERACTS) {
    const list = [];
    const bx = Math.floor(it.x), by = Math.floor(it.y);
    for (let dx = -2; dx <= 2; dx++) for (let dy = -2; dy <= 2; dy++) {
      const tx = bx + dx, ty = by + dy;
      if (map.walkable(tx, ty) && Math.hypot(tx + .5 - it.x, ty + .5 - it.y) < it.r + .7)
        list.push({ x: tx, y: ty });
    }
    APPROACH[it.key] = list;
  }
}

export const BIRD_INTERACT = {
  key: 'bird', id: 'stalk', x: 12, y: 12.6, r: 2.7,
  icon: '🐦', label: 'Подкрасться к птичке',
  when: s => s.bird.flying <= 0,
};
INTERACTS.push(BIRD_INTERACT);