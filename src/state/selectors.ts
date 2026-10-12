import { getZodiacSign, type ZodiacId } from '@/features/horoscope/zodiac';
import { parseISODate } from '@/lib/date';
import type { Profile } from './persist';

/** The user's sign: the one they picked, else the one from their birth date. */
export function profileSign(profile: Profile): ZodiacId | null {
  if (profile.signId) return profile.signId;
  const d = parseISODate(profile.birthDate);
  return d ? getZodiacSign(d).sign.id : null;
}

export function greeting(now: Date = new Date()): string {
  const h = now.getHours();
  if (h < 5) return 'Good night';
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}
