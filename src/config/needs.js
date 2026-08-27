export const NEEDS = {
  food:   { label: 'Сытость',  icon: '🍗', decay: 0.22, sleepMul: 0.3, warn: 'Голоден! К миске! 🍗' },
  energy: { label: 'Энергия',  icon: '⚡', decay: 0.12, sleepRegen: 9, warn: 'Глазки слипаются… нужна лежанка 😴' },
  toilet: { label: 'Лоток',    icon: '🚽', decay: 0.17, sleepMul: 0.3, warn: 'Срочно в лоток! 🚽' },
  fun:    { label: 'Игры',     icon: '🧶', decay: 0.27, sleepMul: 0.2, warn: 'Скучнооо… где клубок? 🧶' },
  social: { label: 'Общение',  icon: '💬', decay: 0.14, sleepMul: 0.2, warn: 'Одиноко… мяу! 💬' },
};
export const NEED_ORDER = ['food', 'energy', 'toilet', 'fun', 'social'];