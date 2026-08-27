const KF = [[0,0],[4.5,0],[6,.5],[9,1],[16.5,1],[18.5,.55],[20,.12],[21.5,0],[24,0]]; // час → «дневность»

export class DayCycle {
  constructor(state) { this.state = state; }
  update(dt) {
    // 1 реальная секунда = 1 игровая минута (сутки ≈ 24 минуты)
    this.state.time.minutes = (this.state.time.minutes + dt) % 1440;
  }
}

export function nightLevel(minutes) {
  const h = minutes / 60;
  for (let i = 0; i < KF.length - 1; i++) {
    if (h >= KF[i][0] && h <= KF[i + 1][0]) {
      const t = (h - KF[i][0]) / (KF[i + 1][0] - KF[i][0]);
      return KF[i][1] + (KF[i + 1][1] - KF[i][1]) * t;
    }
  }
  return 0;
}

export function clockLabel(minutes) {
  const h = Math.floor(minutes / 60), m = Math.floor(minutes % 60);
  const icon = h >= 5 && h < 8 ? '🌅' : h >= 8 && h < 17 ? '☀️' : h >= 17 && h < 21 ? '🌇' : '🌙';
  return `${icon} ${h}:${String(m).padStart(2, '0')}`;
}