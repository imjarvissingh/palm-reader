import { toISODate } from '@/lib/date';
import { hashString, pick, seededRandom } from '@/lib/random';

export const AFFIRMATIONS = [
  'I move at my own pace and still arrive.',
  'I am allowed to take up space.',
  'My curiosity is a compass.',
  'Small steps today build the life I want.',
  'I can hold both hope and patience.',
  'I trust myself to handle what comes.',
  'Rest is part of the work.',
  'I choose kindness, starting with myself.',
  'I let go of what I cannot control.',
  'I am learning, and that is enough.',
  'My feelings are information, not instructions.',
  'I welcome good things without guilt.',
  'I am becoming who I want to be.',
  'There is room for joy in an ordinary day.',
  'I keep the promises I make to myself.',
  'My voice matters.',
  'I am grateful for how far I have come.',
  'I can begin again at any moment.',
  'I attract what I am ready to receive.',
  'Today, I choose focus over noise.',
] as const;

export function dailyAffirmation(date: Date, signId?: string | null): string {
  return pick(seededRandom(hashString(`affirm|${signId ?? ''}|${toISODate(date)}`)), AFFIRMATIONS);
}
