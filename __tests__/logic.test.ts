import { compatibilityScore } from '@/features/astro/compatibility';
import { searchDreams, DREAM_SYMBOLS } from '@/features/astro/dreams';
import { getMonthCalendar, getMoonPhase } from '@/features/astro/moon';
import { expressionNumber, lifePathNumber, personalYearNumber, reduceNumber } from '@/features/astro/numerology';
import { vedicSun } from '@/features/astro/vedic';
import { generateHoroscope, PERIODS } from '@/features/horoscope/generator';
import { getZodiacSign, SIGNS } from '@/features/horoscope/zodiac';
import { isoWeekKey, parseISODate, validateBirthInput } from '@/lib/date';

describe('zodiac sign calculation', () => {
  const cases: [number, number, string][] = [
    [3, 21, 'aries'], [4, 19, 'aries'], [4, 20, 'taurus'], [5, 20, 'taurus'], [5, 21, 'gemini'],
    [6, 20, 'gemini'], [6, 21, 'cancer'], [7, 22, 'cancer'], [7, 23, 'leo'], [8, 22, 'leo'],
    [8, 23, 'virgo'], [9, 22, 'virgo'], [9, 23, 'libra'], [10, 22, 'libra'], [10, 23, 'scorpio'],
    [11, 21, 'scorpio'], [11, 22, 'sagittarius'], [12, 21, 'sagittarius'], [12, 22, 'capricorn'],
    [12, 31, 'capricorn'], [1, 1, 'capricorn'], [1, 19, 'capricorn'], [1, 20, 'aquarius'],
    [2, 18, 'aquarius'], [2, 19, 'pisces'], [2, 29, 'pisces'], [3, 20, 'pisces'],
  ];
  it.each(cases)('%i/%i is %s', (month, day, id) => {
    expect(getZodiacSign({ month, day }).sign.id).toBe(id);
  });

  it('flags cusp dates and not mid-sign dates', () => {
    expect(getZodiacSign({ month: 3, day: 21 }).isCusp).toBe(true);
    expect(getZodiacSign({ month: 1, day: 19 }).isCusp).toBe(true);
    expect(getZodiacSign({ month: 4, day: 5 }).isCusp).toBe(false);
  });

  it('covers every day of a leap year exactly once', () => {
    for (let d = new Date(2024, 0, 1); d.getFullYear() === 2024; d.setDate(d.getDate() + 1)) {
      expect(() => getZodiacSign({ month: d.getMonth() + 1, day: d.getDate() })).not.toThrow();
    }
  });
});

describe('date validation', () => {
  const today = new Date(2026, 9, 12);
  it('parses only real ISO dates', () => {
    expect(parseISODate('2024-02-29')).toEqual({ year: 2024, month: 2, day: 29 });
    expect(parseISODate('2023-02-29')).toBeNull();
    expect(parseISODate('2023-13-01')).toBeNull();
    expect(parseISODate('12/01/2020')).toBeNull();
    expect(parseISODate(null)).toBeNull();
  });
  it('validates birth inputs', () => {
    expect(validateBirthInput('', '', '', today)).toEqual({ parts: null, error: null });
    expect(validateBirthInput('3', '11', '1994', today).parts).toEqual({ year: 1994, month: 11, day: 3 });
    expect(validateBirthInput('31', '4', '1994', today).error).toMatch(/does not exist/);
    expect(validateBirthInput('1', '1', '2030', today).error).toMatch(/future/);
    expect(validateBirthInput('1', '1', '94', today).error).toMatch(/four-digit/);
    expect(validateBirthInput('1', '1', '1850', today).error).toMatch(/1900/);
  });
  it('computes ISO week keys across year boundaries', () => {
    expect(isoWeekKey(new Date(2026, 0, 1))).toBe('2026-W01');
    expect(isoWeekKey(new Date(2027, 0, 1))).toBe('2026-W53');
  });
});

describe('horoscope generator', () => {
  const day = new Date(2026, 9, 12);
  it('is deterministic for the same sign and date', () => {
    expect(generateHoroscope('leo', 'today', day)).toEqual(generateHoroscope('leo', 'today', day));
  });
  it('varies by sign and by date', () => {
    const texts = new Set(SIGNS.map((s) => generateHoroscope(s.id, 'today', day).overview));
    expect(texts.size).toBeGreaterThan(8);
    const days = new Set(Array.from({ length: 10 }, (_, i) => generateHoroscope('leo', 'today', new Date(2026, 9, 1 + i)).overview));
    expect(days.size).toBeGreaterThan(5);
  });
  it('produces complete readings for all signs and periods', () => {
    for (const s of SIGNS) {
      for (const p of PERIODS) {
        const h = generateHoroscope(s.id, p.id, day);
        expect(h.sections.map((x) => x.id)).toEqual(['love', 'career', 'growth', 'wellbeing']);
        for (const sec of h.sections) {
          expect(sec.text.length).toBeGreaterThan(20);
          expect(sec.text).not.toMatch(/[{}]/);
          expect(sec.score).toBeGreaterThanOrEqual(1);
          expect(sec.score).toBeLessThanOrEqual(5);
        }
        expect(h.overview).not.toMatch(/[{}]/);
        expect(h.bestMatch).not.toBe(s.id);
      }
    }
  });
  it('uses the right date for tomorrow and includes the moon only for daily readings', () => {
    expect(generateHoroscope('aries', 'tomorrow', day).rangeLabel).toBe('October 13, 2026');
    expect(generateHoroscope('aries', 'today', day).moon).toBeDefined();
    expect(generateHoroscope('aries', 'week', day).moon).toBeUndefined();
    expect(generateHoroscope('aries', 'month', day).rangeLabel).toBe('October 2026');
  });
});

describe('compatibility', () => {
  it('is symmetric and bounded', () => {
    for (const a of SIGNS) for (const b of SIGNS) {
      const x = compatibilityScore(a.id, b.id);
      const y = compatibilityScore(b.id, a.id);
      expect(x.overall).toBe(y.overall);
      expect(x.overall).toBeGreaterThanOrEqual(5);
      expect(x.overall).toBeLessThanOrEqual(99);
      expect(x.strengths.length).toBeGreaterThan(0);
      expect(x.watchFor.length).toBeGreaterThan(0);
    }
  });
  it('rates trines above squares', () => {
    expect(compatibilityScore('aries', 'leo').overall).toBeGreaterThan(compatibilityScore('aries', 'cancer').overall);
    expect(compatibilityScore('aries', 'leo').relation).toBe('Trine');
  });
});

describe('numerology', () => {
  it('reduces numbers and keeps master numbers', () => {
    expect(reduceNumber(29)).toBe(11);
    expect(reduceNumber(22)).toBe(22);
    expect(reduceNumber(38)).toBe(11);
    expect(reduceNumber(38, false)).toBe(2);
  });
  it('computes life path, expression and personal year', () => {
    expect(lifePathNumber({ year: 1990, month: 7, day: 15 })).toBe(5);
    expect(expressionNumber('Ab')).toBe(3);
    expect(expressionNumber('Zoë')).toBe(expressionNumber('Zoe'));
    expect(expressionNumber('123')).toBeNull();
    const py = personalYearNumber({ month: 7, day: 15 }, 2026);
    expect(py).toBeGreaterThanOrEqual(1);
    expect(py).toBeLessThanOrEqual(9);
  });
});

describe('moon phases', () => {
  it('matches known phases', () => {
    expect(getMoonPhase(new Date(Date.UTC(2024, 3, 8, 18))).id).toBe('new'); // 8 Apr 2024 eclipse
    expect(getMoonPhase(new Date(Date.UTC(2024, 3, 23, 23))).id).toBe('full');
    expect(getMoonPhase(new Date(Date.UTC(2024, 3, 23, 23))).illumination).toBeGreaterThan(0.97);
  });
  it('builds a calendar for every day of the month', () => {
    expect(getMonthCalendar(2024, 2)).toHaveLength(29);
    expect(getMonthCalendar(2026, 10)).toHaveLength(31);
  });
});

describe('vedic sun', () => {
  it('shifts the tropical sign back by the ayanamsa', () => {
    // 1 May 1990: tropical Taurus (~10°), sidereal Aries (Mesha).
    expect(vedicSun({ year: 1990, month: 5, day: 1 }).rashi.name).toBe('Mesha');
    // 15 August 2000: tropical Leo (~23°), sidereal Cancer (Karka).
    expect(vedicSun({ year: 2000, month: 8, day: 15 }).rashi.name).toBe('Karka');
  });
});

describe('dreams', () => {
  it('searches names and meanings case-insensitively', () => {
    expect(searchDreams('').length).toBe(DREAM_SYMBOLS.length);
    expect(searchDreams('TEETH').map((d) => d.id)).toContain('teeth');
    expect(searchDreams('zzzz')).toHaveLength(0);
  });
});
