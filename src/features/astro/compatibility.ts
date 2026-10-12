import { getSign, SIGNS, type Element, type ZodiacId } from '@/features/horoscope/zodiac';

export interface CompatibilityResult {
  a: ZodiacId;
  b: ZodiacId;
  /** All scores are 0-100. */
  overall: number;
  love: number;
  friendship: number;
  work: number;
  relation: string;
  summary: string;
  strengths: string[];
  watchFor: string[];
}

const ELEMENT_HARMONY: Record<Element, Record<Element, number>> = {
  fire: { fire: 82, air: 88, earth: 52, water: 48 },
  earth: { earth: 80, water: 86, fire: 52, air: 50 },
  air: { air: 78, fire: 88, water: 52, earth: 50 },
  water: { water: 84, earth: 86, air: 52, fire: 48 },
};

function signIndex(id: ZodiacId): number {
  return SIGNS.findIndex((s) => s.id === id);
}

/** Classic aspect between two signs, from their distance around the wheel. */
export function signAspect(a: ZodiacId, b: ZodiacId): { name: string; delta: number } {
  const d = Math.abs(signIndex(a) - signIndex(b));
  const delta = Math.min(d, 12 - d);
  const names = ['Same sign', 'Neighbours', 'Sextile', 'Square', 'Trine', 'Quincunx', 'Opposites'];
  return { name: names[delta] ?? 'Unknown', delta };
}

const clamp = (n: number) => Math.max(5, Math.min(99, Math.round(n)));

/**
 * Rule-based compatibility from element harmony, modality and aspect.
 * Symmetric: score(a, b) === score(b, a).
 */
export function compatibilityScore(a: ZodiacId, b: ZodiacId): CompatibilityResult {
  const sa = getSign(a);
  const sb = getSign(b);
  const base = ELEMENT_HARMONY[sa.element][sb.element];
  const { name: relation, delta } = signAspect(a, b);
  const aspectBonus = [4, -6, 6, -8, 10, -10, 2][delta] ?? 0;
  const sameModality = sa.modality === sb.modality;

  const love = clamp(base + aspectBonus + (delta === 6 ? 6 : 0) - (sameModality && delta !== 0 ? 4 : 0));
  const friendship = clamp(base + aspectBonus / 2 + (sa.element === sb.element ? 6 : 0));
  const work = clamp(base - 4 + (sameModality ? -6 : 6) + (sa.element === 'earth' || sb.element === 'earth' ? 5 : 0));
  const overall = clamp((love * 2 + friendship + work) / 4);

  const strengths: string[] = [];
  const watchFor: string[] = [];
  if (sa.element === sb.element) strengths.push(`You share ${sa.element} energy, so you understand each other’s pace.`);
  if (base >= 85) strengths.push(`${cap(sa.element)} and ${sb.element} feed each other: one supplies what the other needs.`);
  if (delta === 4) strengths.push('A trine: easy flow and natural understanding.');
  if (delta === 2) strengths.push('A sextile: friendly, lively and good at making plans together.');
  if (delta === 6) strengths.push('Opposites attract: each of you holds a missing piece for the other.');
  if (!sameModality) strengths.push(`${cap(sa.modality)} and ${sb.modality} styles cover different stages of a project.`);
  if (delta === 3) watchFor.push('A square: friction that can spark growth if you talk it through.');
  if (delta === 5) watchFor.push('A quincunx: different wiring. Expect to explain yourselves more often.');
  if (delta === 1) watchFor.push('Neighbouring signs can feel unfamiliar at first; curiosity helps.');
  if (base <= 52) watchFor.push(`${cap(sa.element)} and ${sb.element} need patience: different ways of handling feelings and plans.`);
  if (sameModality && delta !== 0) watchFor.push(`Both ${sa.modality}: you may compete for the same role. Take turns leading.`);
  if (delta === 0) watchFor.push('Same sign: you mirror each other, flaws included.');
  if (strengths.length === 0) strengths.push('Shared goals and respect can bridge almost any difference.');
  if (watchFor.length === 0) watchFor.push('Easy harmony can turn into comfort zones. Keep surprising each other.');

  const tone = overall >= 80 ? 'a naturally warm match' : overall >= 65 ? 'a promising match with room to grow' : overall >= 50 ? 'a match that rewards effort' : 'a challenging but educational pairing';
  const summary = `${sa.name} and ${sb.name} make ${tone}. ${sa.name} brings ${sa.keywords[0]} while ${sb.name} brings ${sb.keywords[0]}.`;

  return { a, b, overall, love, friendship, work, relation, summary, strengths, watchFor };
}

function cap(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
