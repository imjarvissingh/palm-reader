import { addDays, formatLongDate, formatShortDate, isoWeekKey, MONTH_NAMES, startOfWeek, toISODate } from '@/lib/date';
import { hashString, pick, randomInt, seededRandom } from '@/lib/random';
import { getMoonPhase, type MoonPhase } from '@/features/astro/moon';
import {
  CAREER, ELEMENT_OPENERS, FOCUS_WORDS, GROWTH, HEADLINES, LOVE, LUCKY_COLORS, MOODS, OVERVIEW_MIDDLES, WELLBEING,
} from './content';
import { getSign, SIGNS, type ZodiacId } from './zodiac';
import { compatibilityScore } from '@/features/astro/compatibility';

export type HoroscopePeriod = 'today' | 'tomorrow' | 'week' | 'month';

export const PERIODS: { id: HoroscopePeriod; label: string }[] = [
  { id: 'today', label: 'Today' },
  { id: 'tomorrow', label: 'Tomorrow' },
  { id: 'week', label: 'Week' },
  { id: 'month', label: 'Month' },
];

export interface HoroscopeSection {
  id: 'love' | 'career' | 'growth' | 'wellbeing';
  title: string;
  text: string;
  /** 1 to 5. */
  score: number;
}

export interface Horoscope {
  key: string;
  signId: ZodiacId;
  period: HoroscopePeriod;
  rangeLabel: string;
  headline: string;
  overview: string;
  sections: HoroscopeSection[];
  mood: string;
  focusWord: string;
  luckyNumber: number;
  luckyColor: string;
  bestMatch: ZodiacId;
  /** Present for daily readings: the calculated moon phase that day. */
  moon?: MoonPhase;
}

function periodKey(period: HoroscopePeriod, base: Date): { key: string; anchor: Date; label: string } {
  switch (period) {
    case 'today':
      return { key: toISODate(base), anchor: base, label: formatLongDate(base) };
    case 'tomorrow': {
      const d = addDays(base, 1);
      return { key: toISODate(d), anchor: d, label: formatLongDate(d) };
    }
    case 'week': {
      const start = startOfWeek(base);
      return { key: isoWeekKey(base), anchor: start, label: `${formatShortDate(start)} – ${formatShortDate(addDays(start, 6))}` };
    }
    case 'month':
      return {
        key: `${base.getFullYear()}-${String(base.getMonth() + 1).padStart(2, '0')}`,
        anchor: new Date(base.getFullYear(), base.getMonth(), 1),
        label: `${MONTH_NAMES[base.getMonth()]} ${base.getFullYear()}`,
      };
  }
}

const PERIOD_WORD: Record<HoroscopePeriod, string> = {
  today: 'Today', tomorrow: 'Tomorrow', week: 'This week', month: 'This month',
};

function fill(template: string, vars: Record<string, string>): string {
  const out = template.replace(/\{(\w+)\}/g, (_, k: string) => vars[k] ?? '');
  return out.charAt(0).toUpperCase() + out.slice(1);
}

/**
 * Builds an original, date-aware horoscope for a sign. Deterministic: the same
 * sign, period and date always produce the same text. This is entertainment
 * content, not a calculation of planetary positions.
 */
export function generateHoroscope(signId: ZodiacId, period: HoroscopePeriod, base: Date = new Date()): Horoscope {
  const sign = getSign(signId);
  const { key, anchor, label } = periodKey(period, base);
  const rand = seededRandom(hashString(`${signId}|${period}|${key}`));

  // Best match: one of the three most compatible signs, chosen per period.
  const ranked = SIGNS.filter((s) => s.id !== signId)
    .map((s) => ({ id: s.id, score: compatibilityScore(signId, s.id).overall }))
    .sort((a, b) => b.score - a.score);
  const bestMatch = pick(rand, ranked.slice(0, 3)).id;
  const matchName = getSign(bestMatch).name;

  const vars = {
    drive: sign.drive,
    keyword: pick(rand, sign.keywords),
    strength: pick(rand, sign.strengths).toLowerCase(),
    period: PERIOD_WORD[period],
    periodLower: PERIOD_WORD[period].toLowerCase(),
    match: matchName,
  };

  const moon = period === 'today' || period === 'tomorrow' ? getMoonPhase(new Date(anchor.getFullYear(), anchor.getMonth(), anchor.getDate(), 12)) : undefined;

  const overviewParts = [fill(pick(rand, ELEMENT_OPENERS[sign.element]), vars), fill(pick(rand, OVERVIEW_MIDDLES), vars)];
  if (moon) overviewParts.push(`With the ${moon.name.toLowerCase()} overhead: ${moon.guidance.charAt(0).toLowerCase()}${moon.guidance.slice(1)}`);

  const section = (id: HoroscopeSection['id'], title: string, bank: readonly string[]): HoroscopeSection => ({
    id, title, text: fill(pick(rand, bank), vars), score: randomInt(rand, 2, 5),
  });

  return {
    key: `${signId}:${period}:${key}`,
    signId,
    period,
    rangeLabel: label,
    headline: pick(rand, HEADLINES),
    overview: overviewParts.join(' '),
    sections: [
      section('love', 'Love', LOVE),
      section('career', 'Career & money', CAREER),
      section('growth', 'Personal growth', GROWTH),
      section('wellbeing', 'Well-being', WELLBEING),
    ],
    mood: pick(rand, MOODS),
    focusWord: pick(rand, FOCUS_WORDS),
    luckyNumber: randomInt(rand, 1, 44),
    luckyColor: pick(rand, LUCKY_COLORS),
    bestMatch,
    moon,
  };
}

export function horoscopeShareText(h: Horoscope): string {
  const sign = getSign(h.signId);
  const lines = [
    `${sign.name} · ${h.rangeLabel}`,
    `“${h.headline}”`,
    '',
    h.overview,
    '',
    ...h.sections.map((s) => `${s.title}: ${s.text}`),
    '',
    `Lucky number ${h.luckyNumber} · Colour ${h.luckyColor} · Mood ${h.mood}`,
    '— from Lunara (for entertainment)',
  ];
  return lines.join('\n');
}
