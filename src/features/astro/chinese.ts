import { type DateParts } from '@/lib/date';

export const ANIMALS = [
  { name: 'Rat', traits: 'Quick-witted, resourceful and sociable.' },
  { name: 'Ox', traits: 'Patient, dependable and determined.' },
  { name: 'Tiger', traits: 'Brave, confident and competitive.' },
  { name: 'Rabbit', traits: 'Gentle, elegant and diplomatic.' },
  { name: 'Dragon', traits: 'Ambitious, energetic and charismatic.' },
  { name: 'Snake', traits: 'Wise, intuitive and composed.' },
  { name: 'Horse', traits: 'Free-spirited, warm and active.' },
  { name: 'Goat', traits: 'Calm, creative and kind-hearted.' },
  { name: 'Monkey', traits: 'Clever, curious and playful.' },
  { name: 'Rooster', traits: 'Observant, hardworking and honest.' },
  { name: 'Dog', traits: 'Loyal, fair and protective.' },
  { name: 'Pig', traits: 'Generous, easy-going and sincere.' },
] as const;

const ELEMENTS = ['Metal', 'Metal', 'Water', 'Water', 'Wood', 'Wood', 'Fire', 'Fire', 'Earth', 'Earth'] as const;

export interface ChineseSign {
  animal: (typeof ANIMALS)[number];
  element: string;
  /** Set when the birthday falls before the latest possible Lunar New Year (Feb 20). */
  previousIfBeforeNewYear?: { animal: (typeof ANIMALS)[number]; element: string };
}

function forYear(year: number) {
  const idx = (((year - 4) % 12) + 12) % 12;
  return { animal: ANIMALS[idx]!, element: ELEMENTS[((year % 10) + 10) % 10]! };
}

/**
 * Chinese zodiac by birth year. Lunar New Year moves between Jan 21 and Feb 20,
 * so for birthdays in that window we also return the previous year's sign.
 */
export function chineseSign(d: DateParts): ChineseSign {
  const cur = forYear(d.year);
  const early = d.month === 1 || (d.month === 2 && d.day <= 20);
  return early ? { ...cur, previousIfBeforeNewYear: forYear(d.year - 1) } : cur;
}
