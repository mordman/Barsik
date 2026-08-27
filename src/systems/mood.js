export function moodEmoji(s) {
  const c = s.cat;
  if (c.state === 'sleep') return '😴';
  if (c.state === 'eat' || c.state === 'drink') return '😋';
  const m = Math.min(...Object.values(s.needs));
  if (m < 15) return '🙀';
  if (m < 35) return '😿';
  if (m > 75) return '😻';
  return '😺';
}