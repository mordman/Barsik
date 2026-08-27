export function createState() {
  return {
    meta:  { started: true, paused: false, catName: 'Мурзик' },
    time:  { t: 0, minutes: 540 },
    needs: { food: 82, energy: 92, toilet: 76, fun: 72, social: 64 },
    cat:   { x: 7.5, y: 5.6, face: 'down', pose: 'stand', state: 'idle',
             action: null, actionT: 0, path: null, pending: null, locked: false,
             bubble: null, phase: 0, petT: 0, moving: false, idleT: 0, idleSitT: 0, zzzT: 0 },
    world: { bowlFood: 1, refillT: 0, postWob: 0, yarnWob: 0 },
    npc:   { x: 13.5, y: 8.5, face: 'left', bubble: null, talkT: 8 },
    bird:  { x: 12, tx: 12, flying: 0 },
    butterflies: [],
    stats: { catches: 0, sniffs: 0 },
    interact: null,   // key ближайшего интеракта (для Prompt)
  };
}