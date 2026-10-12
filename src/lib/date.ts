/** Calendar helpers. All functions work in the device's local calendar date. */

export interface DateParts {
  year: number;
  month: number; // 1-12
  day: number; // 1-31
}

export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

export function daysInMonth(year: number, month: number): number {
  return [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1] ?? 0;
}

export function isValidDateParts(p: DateParts): boolean {
  return (
    Number.isInteger(p.year) &&
    Number.isInteger(p.month) &&
    Number.isInteger(p.day) &&
    p.month >= 1 &&
    p.month <= 12 &&
    p.day >= 1 &&
    p.day <= daysInMonth(p.year, p.month)
  );
}

/** Parses strict `YYYY-MM-DD`. Returns null for anything malformed or impossible (e.g. 2023-02-29). */
export function parseISODate(value: string | null | undefined): DateParts | null {
  if (!value) return null;
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
  if (!m) return null;
  const parts = { year: Number(m[1]), month: Number(m[2]), day: Number(m[3]) };
  return isValidDateParts(parts) ? parts : null;
}

const pad = (n: number) => String(n).padStart(2, '0');

export function toISODate(d: Date | DateParts): string {
  if (d instanceof Date) return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  return `${d.year}-${pad(d.month)}-${pad(d.day)}`;
}

export function partsFromDate(d: Date): DateParts {
  return { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() };
}

export function addDays(d: Date, days: number): Date {
  const out = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  out.setDate(out.getDate() + days);
  return out;
}

/** ISO-8601 week key such as `2026-W41`. */
export function isoWeekKey(d: Date): string {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((date.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${date.getUTCFullYear()}-W${pad(week)}`;
}

/** Monday of the week containing `d`. */
export function startOfWeek(d: Date): Date {
  const day = d.getDay() || 7;
  return addDays(d, 1 - day);
}

export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
] as const;

export function formatLongDate(d: Date): string {
  return `${MONTH_NAMES[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

export function formatShortDate(d: Date): string {
  return `${MONTH_NAMES[d.getMonth()]?.slice(0, 3)} ${d.getDate()}`;
}

/** Age in whole years on `today`, or null if the birth date is in the future. */
export function ageOn(birth: DateParts, today: Date): number | null {
  let age = today.getFullYear() - birth.year;
  const m = today.getMonth() + 1;
  if (m < birth.month || (m === birth.month && today.getDate() < birth.day)) age--;
  return age < 0 ? null : age;
}

/**
 * Validates free-text day/month/year fields for a birth date.
 * Empty fields mean "not provided" and are valid.
 */
export function validateBirthInput(
  day: string,
  month: string,
  year: string,
  today: Date = new Date(),
): { parts: DateParts | null; error: string | null } {
  const d = day.trim();
  const m = month.trim();
  const y = year.trim();
  if (!d && !m && !y) return { parts: null, error: null };
  if (!/^\d{1,2}$/.test(d) || !/^\d{1,2}$/.test(m) || !/^\d{4}$/.test(y)) {
    return { parts: null, error: 'Enter day, month and a four-digit year.' };
  }
  const parts = { year: Number(y), month: Number(m), day: Number(d) };
  if (!isValidDateParts(parts)) return { parts: null, error: 'That date does not exist.' };
  if (parts.year < 1900) return { parts: null, error: 'Please enter a year after 1900.' };
  if (ageOn(parts, today) === null) return { parts: null, error: 'Birth date cannot be in the future.' };
  return { parts, error: null };
}
