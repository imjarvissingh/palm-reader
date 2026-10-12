/**
 * Moon phase from the mean synodic month. Accurate to within roughly a day,
 * which is plenty for a calendar view; it is not an ephemeris.
 */

export const SYNODIC_MONTH = 29.530588853;
/** A known new moon: 2000-01-06 18:14 UTC. */
const REFERENCE_NEW_MOON_MS = Date.UTC(2000, 0, 6, 18, 14);

export type MoonPhaseId =
  | 'new' | 'waxing-crescent' | 'first-quarter' | 'waxing-gibbous'
  | 'full' | 'waning-gibbous' | 'last-quarter' | 'waning-crescent';

export interface MoonPhase {
  id: MoonPhaseId;
  name: string;
  /** Days since the most recent new moon, 0 – 29.53. */
  age: number;
  /** Fraction of the disc lit, 0 – 1. */
  illumination: number;
  waxing: boolean;
  emoji: string;
  guidance: string;
}

const PHASES: { id: MoonPhaseId; name: string; emoji: string; guidance: string }[] = [
  { id: 'new', name: 'New Moon', emoji: '🌑', guidance: 'A quiet reset. Good for setting a single clear intention.' },
  { id: 'waxing-crescent', name: 'Waxing Crescent', emoji: '🌒', guidance: 'Momentum is small but real. Take the first practical step.' },
  { id: 'first-quarter', name: 'First Quarter', emoji: '🌓', guidance: 'A push-through moment. Decide, adjust, keep going.' },
  { id: 'waxing-gibbous', name: 'Waxing Gibbous', emoji: '🌔', guidance: 'Refine and polish. Details matter now.' },
  { id: 'full', name: 'Full Moon', emoji: '🌕', guidance: 'Things come to light. Celebrate progress and notice what feels heavy.' },
  { id: 'waning-gibbous', name: 'Waning Gibbous', emoji: '🌖', guidance: 'Share what you have learned and say thank you.' },
  { id: 'last-quarter', name: 'Last Quarter', emoji: '🌗', guidance: 'Release what is not working. Clear space.' },
  { id: 'waning-crescent', name: 'Waning Crescent', emoji: '🌘', guidance: 'Rest and reflect before the next cycle begins.' },
];

export function moonAge(date: Date): number {
  const days = (date.getTime() - REFERENCE_NEW_MOON_MS) / 86400000;
  const age = days % SYNODIC_MONTH;
  return age < 0 ? age + SYNODIC_MONTH : age;
}

export function getMoonPhase(date: Date): MoonPhase {
  const age = moonAge(date);
  const illumination = (1 - Math.cos((2 * Math.PI * age) / SYNODIC_MONTH)) / 2;
  // Eight equal segments centred on the principal phases.
  const index = Math.floor(((age / SYNODIC_MONTH) * 8 + 0.5) % 8);
  const p = PHASES[index] ?? PHASES[0]!;
  return { ...p, age, illumination, waxing: age < SYNODIC_MONTH / 2 };
}

/** Phase for local noon of each day in a month (month is 1-12). */
export function getMonthCalendar(year: number, month: number): { day: number; phase: MoonPhase }[] {
  const days = new Date(year, month, 0).getDate();
  return Array.from({ length: days }, (_, i) => ({
    day: i + 1,
    phase: getMoonPhase(new Date(year, month - 1, i + 1, 12)),
  }));
}

/** Next date (local noon steps) on which the given principal phase begins. */
export function nextPhaseDate(from: Date, id: 'new' | 'full' | 'first-quarter' | 'last-quarter'): Date {
  const start = new Date(from.getFullYear(), from.getMonth(), from.getDate(), 12);
  let prev = getMoonPhase(start).id;
  for (let i = 1; i <= 31; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    const cur = getMoonPhase(d).id;
    if (cur === id && prev !== id) return d;
    prev = cur;
  }
  return start;
}
