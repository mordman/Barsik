import { iso } from '../world/Iso.js';
import { nightLevel } from '../world/DayCycle.js';
import { drawFloors } from './tiles/Floors.js';
import { collectWallDrawables } from './tiles/Walls.js';
import { collectFenceDrawables } from './tiles/Fence.js';
import { collectFloraDrawables } from './Flora.js';
import { collectFurnitureDrawables } from './furniture/index.js';
import { drawCat, catOpts, PAL } from './sprites/CatSprite.js';
import { drawButterfly, drawBird } from './sprites/Critters.js';
import { drawBubble } from './fx/Bubbles.js';
import { drawPlumbob } from './fx/Plumbob.js';
import { drawLights } from './fx/Lighting.js';
import { drawParticles } from './fx/ParticlesFx.js';

export class Renderer {
  constructor(state, camera, particles) {
    this.state = state; this.camera = camera; this.particles = particles;
  }

  render() {
    const { ctx, cw, ch, view, dpr } = this.camera;
    const s = this.state;
    const nl = 1 - nightLevel(s.time.minutes);
    const cat = s.cat, cs = iso(cat.x, cat.y);
    const npc = s.npc, ns = iso(npc.x, npc.y);

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.drawBg(ctx, cw, ch);

    // --- мир ---
    ctx.save();
    ctx.translate(view.ox, view.oy);
    ctx.scale(view.s, view.s);
    drawFloors(ctx, s);

    const drawables = [
      ...collectWallDrawables(ctx, s, nl),
      ...collectFenceDrawables(ctx),
      ...collectFloraDrawables(ctx, s),
      ...collectFurnitureDrawables(ctx, s),
      { d: cat.x + cat.y + .01, f: () => drawCat(ctx, cs.x, cs.y, catOpts(s)) },
      { d: npc.x + npc.y, f: () => drawCat(ctx, ns.x, ns.y,
          { pal: PAL.gray, face: npc.face, pose: 'sit', phase: 0, t: s.time.t, squint: false, hop: 0 }) },
      ...s.butterflies.map(b => ({ d: b.x + b.y + .6, f: () => drawButterfly(ctx, b, s.time.t) })),
      { d: s.bird.x + 13.5, f: () => drawBird(ctx, s, s.time.t) },
    ];
    drawables.sort((a, b) => a.d - b.d);
    for (const it of drawables) it.f();
    ctx.restore();

    // --- ночь ---
    if (nl > 0.01) {
      ctx.fillStyle = `rgba(16,22,48,${nl * .5})`;
      ctx.fillRect(0, 0, cw, ch);
    }

    // --- свет и эффекты поверх темноты ---
    ctx.save();
    ctx.translate(view.ox, view.oy);
    ctx.scale(view.s, view.s);
    drawLights(ctx, s, nl);
    drawParticles(ctx, this.particles.list);
    const worst = Math.min(...Object.values(s.needs));
    drawPlumbob(ctx, cs.x, cs.y - 64, s.time.t, worst);
    drawBubble(ctx, cat.bubble, cs.x, cs.y - 44);
    drawBubble(ctx, npc.bubble, ns.x, ns.y - 40);
    ctx.restore();
  }

  drawBg(g, cw, ch) {
    const gr = g.createLinearGradient(0, 0, 0, ch);
    gr.addColorStop(0, '#26402c'); gr.addColorStop(1, '#0f1a12');
    g.fillStyle = gr; g.fillRect(0, 0, cw, ch);
    const v = g.createRadialGradient(cw / 2, ch / 2, Math.min(cw, ch) * .3, cw / 2, ch / 2, Math.max(cw, ch) * .75);
    v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,.4)');
    g.fillStyle = v; g.fillRect(0, 0, cw, ch);
  }
}