import { EventBus } from './core/EventBus.js';
import { GameLoop } from './core/GameLoop.js';
import { createState } from './core/State.js';
import { InputManager } from './core/InputManager.js';
import { AudioManager } from './core/AudioManager.js';
import { Camera } from './world/Camera.js';
import { MapModel } from './world/MapModel.js';
import { DayCycle } from './world/DayCycle.js';
import { buildApproach, INTERACTS } from './config/interacts.js';
import { Cat } from './entities/Cat.js';
import { CatBrain } from './entities/CatBrain.js';
import { NpcCat } from './entities/NpcCat.js';
import { Butterflies } from './entities/Butterflies.js';
import { Bird } from './entities/Bird.js';
import { Particles } from './entities/Particles.js';
import { NeedsSystem } from './systems/NeedsSystem.js';
import { ActionsSystem } from './systems/ActionsSystem.js';
import { InteractionSystem } from './systems/InteractionSystem.js';
import { WorldSystem } from './systems/WorldSystem.js';
import { Renderer } from './render/Renderer.js';
import { HUD } from './ui/HUD.js';
import { Toasts } from './ui/Toasts.js';
import { Prompt } from './ui/Prompt.js';
import { StartScreen } from './ui/StartScreen.js';
import { PauseOverlay } from './ui/PauseOverlay.js';
import { TouchControls } from './ui/TouchControls.js';

const bus   = new EventBus();
const state = createState();
state.meta.started = false;                  // ждём стартовый экран
const map   = new MapModel();
map.addBlocked(13, 8);
buildApproach(map);

const canvas = document.getElementById('game');
const camera = new Camera(canvas);

const input     = new InputManager(bus, canvas, camera, state);
const audio     = new AudioManager(bus);
const cat       = new Cat(state, map, bus);
const actions   = new ActionsSystem(state, bus);
const brain     = new CatBrain(state, cat, map, bus, camera, actions);
const npc       = new NpcCat(state, bus);
const flies     = new Butterflies(state, bus);
const bird      = new Bird(state, bus);
const particles = new Particles(state, bus);
const dayCycle  = new DayCycle(state);
const needsSys  = new NeedsSystem(state, bus);
const worldSys  = new WorldSystem(state, bus);
const interact  = new InteractionSystem(state, bus, actions);

const toasts   = new Toasts(bus);
const hud      = new HUD(state, bus);
const prompt   = new Prompt(state);
const start    = new StartScreen(state, bus);
const pauseOv  = new PauseOverlay(state, bus);
const touch    = new TouchControls(bus);
const renderer = new Renderer(state, camera, particles);

// кнопка «спать» на телефоне
bus.on('ui:sleep', () => {
  if (!state.meta.started || state.meta.paused) return;
  if (state.cat.state === 'sleep') actions.interrupt();
  else actions.start('bed', INTERACTS.find(i => i.key === 'bed'));
});

// туториал после заселения
bus.on('game:start', () => {
  bus.emit('toast', { msg: `Привет, ${state.meta.catName}! Осваивайся 🐾` });
  state.cat.bubble = { text: 'Мяу! Я дома!', t: 0, dur: 2 };
  setTimeout(() => bus.emit('toast', { msg: 'Подойди к миске и нажми E — покушай 🍗' }), 3500);
  setTimeout(() => bus.emit('toast', { msg: 'M — мяукать. Клик по полу — идти 🐾' }), 9000);
});

window.addEventListener('resize', () => camera.fit());

new GameLoop({
  update(dt) {
    state.time.t += dt;
    // за стартовым экраном мир дышит, но жизнь кота на паузе
    if (!state.meta.started) {
      flies.update(dt); bird.update(dt); npc.update(dt); particles.update(dt);
      return;
    }
    if (state.meta.paused) return;
    dayCycle.update(dt);
    needsSys.update(dt);
    worldSys.update(dt);
    actions.update(dt);
    interact.update();
    npc.update(dt);
    flies.update(dt);
    bird.update(dt);
    particles.update(dt);
    brain.update(dt, input);
    cat.update(dt, input);
  },
  render() {
    renderer.render();
    const now = performance.now();
    hud.sync(now);
    prompt.sync(now);
  },
}).start();

window.__cat = { bus, state, map, cat, brain };
console.log('[Котодом] М6: полная жизнь 🎉');