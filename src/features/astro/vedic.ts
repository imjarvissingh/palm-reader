import { type DateParts } from '@/lib/date';

/**
 * Basic Vedic (sidereal) information. We compute only the Sun's approximate
 * sidereal sign from a birth date. The Moon sign and ascendant, which matter
 * most in Jyotish, need birth time and place and are not calculated here.
 */

export const RASHIS = [
  { name: 'Mesha', western: 'Aries', ruler: 'Mars' },
  { name: 'Vrishabha', western: 'Taurus', ruler: 'Venus' },
  { name: 'Mithuna', western: 'Gemini', ruler: 'Mercury' },
  { name: 'Karka', western: 'Cancer', ruler: 'Moon' },
  { name: 'Simha', western: 'Leo', ruler: 'Sun' },
  { name: 'Kanya', western: 'Virgo', ruler: 'Mercury' },
  { name: 'Tula', western: 'Libra', ruler: 'Venus' },
  { name: 'Vrishchika', western: 'Scorpio', ruler: 'Mars' },
  { name: 'Dhanu', western: 'Sagittarius', ruler: 'Jupiter' },
  { name: 'Makara', western: 'Capricorn', ruler: 'Saturn' },
  { name: 'Kumbha', western: 'Aquarius', ruler: 'Saturn' },
  { name: 'Meena', western: 'Pisces', ruler: 'Jupiter' },
] as const;

export const NAKSHATRAS = [
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra', 'Punarvasu', 'Pushya', 'Ashlesha',
  'Magha', 'Purva Phalguni', 'Uttara Phalguni', 'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
  'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha', 'Purva Bhadrapada',
  'Uttara Bhadrapada', 'Revati',
] as const;

const deg = (r: number) => (r * Math.PI) / 180;
const norm = (d: number) => ((d % 360) + 360) % 360;

/** Apparent tropical longitude of the Sun (degrees), low-precision formula (~0.01°). */
export function sunTropicalLongitude(date: Date): number {
  const jd = date.getTime() / 86400000 + 2440587.5;
  const n = jd - 2451545.0;
  const L = norm(280.46 + 0.9856474 * n);
  const g = norm(357.528 + 0.9856003 * n);
  return norm(L + 1.915 * Math.sin(deg(g)) + 0.02 * Math.sin(deg(2 * g)));
}

/** Approximate Lahiri ayanamsa in degrees for a given year. */
export function lahiriAyanamsa(year: number): number {
  return 23.853 + (year - 2000) * 0.013969;
}

export interface VedicSun {
  siderealLongitude: number;
  rashi: (typeof RASHIS)[number];
  nakshatra: string;
  pada: number;
  /** True when the sun was within 1° of a sign boundary, so the result is uncertain without birth time. */
  nearBoundary: boolean;
}

export function vedicSun(birth: DateParts): VedicSun {
  const date = new Date(Date.UTC(birth.year, birth.month - 1, birth.day, 12));
  const sid = norm(sunTropicalLongitude(date) - lahiriAyanamsa(birth.year));
  const nakSize = 360 / 27;
  const nakIndex = Math.floor(sid / nakSize);
  const within = sid % 30;
  return {
    siderealLongitude: sid,
    rashi: RASHIS[Math.floor(sid / 30)] ?? RASHIS[0],
    nakshatra: NAKSHATRAS[nakIndex] ?? NAKSHATRAS[0],
    pada: Math.floor((sid % nakSize) / (nakSize / 4)) + 1,
    nearBoundary: within < 1 || within > 29,
  };
}

export const VEDIC_TOPICS = [
  {
    title: 'Sidereal vs tropical',
    body: 'Western astrology anchors the zodiac to the seasons (tropical). Vedic astrology, or Jyotish, anchors it to the fixed stars (sidereal). The two have drifted about 24° apart, so most people’s Vedic Sun sign is one sign earlier than their Western one.',
  },
  {
    title: 'Why the Moon matters most',
    body: 'In Jyotish the Moon sign (Rashi) and the Moon’s lunar mansion (Nakshatra) are central to daily predictions. They change every two to three days, so they need your exact birth time and place to calculate.',
  },
  {
    title: 'The 27 Nakshatras',
    body: 'The sky is divided into 27 lunar mansions of 13°20′ each, each with its own deity, symbol and temperament. Each one is split into four padas (quarters).',
  },
  {
    title: 'Panchang',
    body: 'The traditional Hindu almanac tracks five daily elements: tithi (lunar day), vara (weekday), nakshatra, yoga and karana. It is used to choose auspicious times.',
  },
  {
    title: 'Grahas',
    body: 'Jyotish uses nine grahas: Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn and the lunar nodes Rahu and Ketu.',
  },
] as const;
