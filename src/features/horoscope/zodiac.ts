import { type DateParts } from '@/lib/date';

export type ZodiacId =
  | 'aries' | 'taurus' | 'gemini' | 'cancer' | 'leo' | 'virgo'
  | 'libra' | 'scorpio' | 'sagittarius' | 'capricorn' | 'aquarius' | 'pisces';

export type Element = 'fire' | 'earth' | 'air' | 'water';
export type Modality = 'cardinal' | 'fixed' | 'mutable';

export interface ZodiacSign {
  id: ZodiacId;
  name: string;
  /** Unicode glyph forced to text presentation so it never renders as an emoji. */
  glyph: string;
  element: Element;
  modality: Modality;
  ruler: string;
  /** Inclusive start (month, day) of the conventional tropical date range. */
  start: [number, number];
  end: [number, number];
  keywords: string[];
  strengths: string[];
  challenges: string[];
  summary: string;
  /** Short noun phrase the generator weaves into sentences ("your restless curiosity"). */
  drive: string;
}

const T = '︎';

export const SIGNS: readonly ZodiacSign[] = [
  {
    id: 'aries', name: 'Aries', glyph: `♈${T}`, element: 'fire', modality: 'cardinal', ruler: 'Mars',
    start: [3, 21], end: [4, 19],
    keywords: ['initiative', 'courage', 'momentum'],
    strengths: ['Starts things others only talk about', 'Honest and direct', 'Recovers fast from setbacks'],
    challenges: ['Impatience with slow processes', 'Can leap before checking the landing'],
    summary: 'The spark of the zodiac. Aries energy favours first steps, bold decisions and learning by doing.',
    drive: 'your instinct to go first',
  },
  {
    id: 'taurus', name: 'Taurus', glyph: `♉${T}`, element: 'earth', modality: 'fixed', ruler: 'Venus',
    start: [4, 20], end: [5, 20],
    keywords: ['steadiness', 'comfort', 'patience'],
    strengths: ['Reliable and consistent', 'Appreciates beauty and craft', 'Builds things that last'],
    challenges: ['Resists change even when it helps', 'Can hold on to comfort too long'],
    summary: 'Grounded and sensual, Taurus energy values security, loyalty and the slow reward of patient effort.',
    drive: 'your talent for steady building',
  },
  {
    id: 'gemini', name: 'Gemini', glyph: `♊${T}`, element: 'air', modality: 'mutable', ruler: 'Mercury',
    start: [5, 21], end: [6, 20],
    keywords: ['curiosity', 'conversation', 'versatility'],
    strengths: ['Quick learner', 'Connects people and ideas', 'Adapts easily'],
    challenges: ['Scattered attention', 'Restless when routine sets in'],
    summary: 'The messenger. Gemini energy thrives on ideas, variety and the exchange of information.',
    drive: 'your restless curiosity',
  },
  {
    id: 'cancer', name: 'Cancer', glyph: `♋${T}`, element: 'water', modality: 'cardinal', ruler: 'the Moon',
    start: [6, 21], end: [7, 22],
    keywords: ['nurture', 'memory', 'belonging'],
    strengths: ['Deeply caring', 'Strong intuition about people', 'Protective of loved ones'],
    challenges: ['Moods that follow the tides', 'Can retreat instead of asking'],
    summary: 'Tender and tenacious, Cancer energy builds emotional safety and keeps close bonds alive.',
    drive: 'your instinct to protect what you love',
  },
  {
    id: 'leo', name: 'Leo', glyph: `♌${T}`, element: 'fire', modality: 'fixed', ruler: 'the Sun',
    start: [7, 23], end: [8, 22],
    keywords: ['warmth', 'expression', 'generosity'],
    strengths: ['Natural presence', 'Generous with encouragement', 'Creative confidence'],
    challenges: ['Sensitive to being overlooked', 'Pride that delays apologies'],
    summary: 'Radiant and big-hearted, Leo energy is about creative self-expression and lifting others up.',
    drive: 'your warm, creative presence',
  },
  {
    id: 'virgo', name: 'Virgo', glyph: `♍${T}`, element: 'earth', modality: 'mutable', ruler: 'Mercury',
    start: [8, 23], end: [9, 22],
    keywords: ['craft', 'service', 'discernment'],
    strengths: ['Eye for detail', 'Practical problem solver', 'Quietly dependable'],
    challenges: ['Self-criticism', 'Perfectionism that stalls finishing'],
    summary: 'Precise and helpful, Virgo energy refines, organises and improves whatever it touches.',
    drive: 'your gift for making things better',
  },
  {
    id: 'libra', name: 'Libra', glyph: `♎${T}`, element: 'air', modality: 'cardinal', ruler: 'Venus',
    start: [9, 23], end: [10, 22],
    keywords: ['harmony', 'partnership', 'fairness'],
    strengths: ['Diplomatic', 'Strong sense of fairness', 'Eye for balance and style'],
    challenges: ['Indecision', 'Avoiding conflict that needs airing'],
    summary: 'Gracious and relational, Libra energy seeks balance, beauty and a fair deal for everyone.',
    drive: 'your sense of balance',
  },
  {
    id: 'scorpio', name: 'Scorpio', glyph: `♏${T}`, element: 'water', modality: 'fixed', ruler: 'Pluto and Mars',
    start: [10, 23], end: [11, 21],
    keywords: ['depth', 'intensity', 'transformation'],
    strengths: ['Fierce loyalty', 'Sees beneath the surface', 'Resilient under pressure'],
    challenges: ['Guardedness', 'Difficulty letting go'],
    summary: 'Magnetic and deep, Scorpio energy is about truth, intimacy and reinvention.',
    drive: 'your capacity to go deep',
  },
  {
    id: 'sagittarius', name: 'Sagittarius', glyph: `♐${T}`, element: 'fire', modality: 'mutable', ruler: 'Jupiter',
    start: [11, 22], end: [12, 21],
    keywords: ['adventure', 'meaning', 'optimism'],
    strengths: ['Big-picture thinker', 'Infectious optimism', 'Loves to learn and explore'],
    challenges: ['Overpromising', 'Restless with commitments'],
    summary: 'The seeker. Sagittarius energy aims at far horizons: travel, philosophy and honest adventure.',
    drive: 'your hunger for new horizons',
  },
  {
    id: 'capricorn', name: 'Capricorn', glyph: `♑${T}`, element: 'earth', modality: 'cardinal', ruler: 'Saturn',
    start: [12, 22], end: [1, 19],
    keywords: ['ambition', 'structure', 'mastery'],
    strengths: ['Disciplined', 'Plays the long game', 'Responsible under pressure'],
    challenges: ['All work, little rest', 'Reluctant to show softness'],
    summary: 'Patient and ambitious, Capricorn energy climbs steadily and builds lasting structures.',
    drive: 'your long-game ambition',
  },
  {
    id: 'aquarius', name: 'Aquarius', glyph: `♒${T}`, element: 'air', modality: 'fixed', ruler: 'Uranus and Saturn',
    start: [1, 20], end: [2, 18],
    keywords: ['originality', 'community', 'vision'],
    strengths: ['Inventive', 'Champions the group', 'Independent thinker'],
    challenges: ['Detached when emotions run high', 'Stubborn about ideas'],
    summary: 'Inventive and humane, Aquarius energy imagines better futures and gathers people around them.',
    drive: 'your original way of seeing',
  },
  {
    id: 'pisces', name: 'Pisces', glyph: `♓${T}`, element: 'water', modality: 'mutable', ruler: 'Neptune and Jupiter',
    start: [2, 19], end: [3, 20],
    keywords: ['imagination', 'empathy', 'intuition'],
    strengths: ['Compassionate', 'Rich imagination', 'Artistic sensitivity'],
    challenges: ['Absorbs others’ moods', 'Escapes instead of deciding'],
    summary: 'Dreamy and empathic, Pisces energy flows toward art, compassion and the unseen.',
    drive: 'your deep intuition',
  },
];

const BY_ID = new Map(SIGNS.map((s) => [s.id, s]));

export function getSign(id: ZodiacId): ZodiacSign {
  const s = BY_ID.get(id);
  if (!s) throw new Error(`Unknown zodiac sign: ${id}`);
  return s;
}

export function isZodiacId(value: unknown): value is ZodiacId {
  return typeof value === 'string' && BY_ID.has(value as ZodiacId);
}

const md = (month: number, day: number) => month * 100 + day;

/**
 * Tropical sun sign for a birth date, using conventional date ranges.
 * The exact boundary moves by up to a day year to year, so `isCusp` flags
 * dates within one day of a boundary.
 */
export function getZodiacSign(date: Pick<DateParts, 'month' | 'day'>): { sign: ZodiacSign; isCusp: boolean } {
  const value = md(date.month, date.day);
  let found: ZodiacSign | undefined;
  for (const s of SIGNS) {
    const start = md(s.start[0], s.start[1]);
    const end = md(s.end[0], s.end[1]);
    const inRange = start <= end ? value >= start && value <= end : value >= start || value <= end;
    if (inRange) {
      found = s;
      break;
    }
  }
  if (!found) throw new Error(`Invalid date ${date.month}/${date.day}`);
  const startDiff = dayDistance(date, found.start);
  const endDiff = dayDistance(date, found.end);
  return { sign: found, isCusp: startDiff === 0 || endDiff === 0 };
}

function dayDistance(a: Pick<DateParts, 'month' | 'day'>, b: [number, number]): number {
  // Use a non-leap reference year; only distances of 0 matter for cusp detection.
  const ref = (m: number, d: number) => Date.UTC(2001, m - 1, d);
  return Math.abs(ref(a.month, a.day) - ref(b[0], b[1])) / 86400000;
}

export function formatRange(s: ZodiacSign): string {
  const mon = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${mon[s.start[0] - 1]} ${s.start[1]} – ${mon[s.end[0] - 1]} ${s.end[1]}`;
}

export const ELEMENT_INFO: Record<Element, { label: string; theme: string }> = {
  fire: { label: 'Fire', theme: 'action, enthusiasm and courage' },
  earth: { label: 'Earth', theme: 'practicality, patience and the material world' },
  air: { label: 'Air', theme: 'ideas, communication and connection' },
  water: { label: 'Water', theme: 'emotion, intuition and empathy' },
};
