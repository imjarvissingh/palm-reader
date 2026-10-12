import { type DateParts } from '@/lib/date';

const MASTER = new Set([11, 22, 33]);

/** Repeatedly sums digits until a single digit or a master number remains. */
export function reduceNumber(n: number, keepMaster = true): number {
  let v = Math.abs(Math.trunc(n));
  while (v > 9 && !(keepMaster && MASTER.has(v))) {
    v = String(v).split('').reduce((s, d) => s + Number(d), 0);
  }
  return v;
}

/** Life path: reduce month, day and year separately, then reduce the sum. */
export function lifePathNumber(d: DateParts): number {
  return reduceNumber(reduceNumber(d.month) + reduceNumber(d.day) + reduceNumber(d.year));
}

const LETTER_VALUES: Record<string, number> = {};
'abcdefghijklmnopqrstuvwxyz'.split('').forEach((c, i) => {
  LETTER_VALUES[c] = (i % 9) + 1;
});

/** Pythagorean expression (destiny) number from a name. Non-Latin letters are ignored. */
export function expressionNumber(name: string): number | null {
  const letters = name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z]/g, '');
  if (!letters) return null;
  return reduceNumber(letters.split('').reduce((s, c) => s + (LETTER_VALUES[c] ?? 0), 0));
}

/** Personal year for the given calendar year. */
export function personalYearNumber(birth: Pick<DateParts, 'month' | 'day'>, year: number): number {
  return reduceNumber(reduceNumber(birth.month) + reduceNumber(birth.day) + reduceNumber(year), false);
}

export const NUMBER_MEANINGS: Record<number, { title: string; text: string }> = {
  1: { title: 'The Pioneer', text: 'Independent and driven. You learn by starting, and you are at your best when you trust your own direction.' },
  2: { title: 'The Peacemaker', text: 'Sensitive and cooperative. You notice what others need and build bridges between people.' },
  3: { title: 'The Communicator', text: 'Expressive and playful. Words, art and humour are how you move energy in the world.' },
  4: { title: 'The Builder', text: 'Practical and dependable. You create order and lasting foundations through steady work.' },
  5: { title: 'The Explorer', text: 'Adventurous and adaptable. Variety, travel and freedom keep you growing.' },
  6: { title: 'The Nurturer', text: 'Caring and responsible. Home, family and community are where you shine.' },
  7: { title: 'The Seeker', text: 'Reflective and analytical. You need quiet time to find the deeper truth in things.' },
  8: { title: 'The Achiever', text: 'Ambitious and capable. You are drawn to leadership, resources and real-world results.' },
  9: { title: 'The Humanitarian', text: 'Compassionate and idealistic. You are motivated by causes larger than yourself.' },
  11: { title: 'The Intuitive (master 11)', text: 'Highly perceptive and inspiring. Your challenge is to trust your insight without being overwhelmed by it.' },
  22: { title: 'The Master Builder (master 22)', text: 'Visionary and practical at once. You can turn big dreams into structures that help many people.' },
  33: { title: 'The Master Teacher (master 33)', text: 'Devoted to uplifting others through compassion, creativity and example.' },
};

export const PERSONAL_YEAR_THEMES: Record<number, string> = {
  1: 'Beginnings. Plant seeds and start the project you keep postponing.',
  2: 'Partnership and patience. Growth happens quietly, through cooperation.',
  3: 'Expression. Socialise, create and share your voice.',
  4: 'Foundations. Organise, work steadily and strengthen routines.',
  5: 'Change. Expect movement, travel and new options.',
  6: 'Responsibility and love. Home and relationships take centre stage.',
  7: 'Reflection. Study, rest and look inward.',
  8: 'Harvest. Career and finances respond to past effort.',
  9: 'Completion. Clear out what is finished to make room for the next cycle.',
};
