import { getSign, type ZodiacId } from '@/features/horoscope/zodiac';
import { LINE_INFO, LINE_ORDER, QUESTIONS, UNSURE, isQuestionActive, sanitizeAnswers } from './questions';
import type {
  Hand, LineId, LineReading, PalmAnswers, PalmOption, PalmReport, ReadingMethod, ThemeReading, Trait,
} from './types';

/**
 * Rule-based palm reading engine. Every sentence in the report comes from an
 * answer the user gave (or from their sign), so different palms produce
 * different reports. It does not look at the photo: the photo is kept for the
 * user's reference and for a future, clearly-labelled vision integration.
 */

const HEADLINES: Record<LineId, [string, string, string]> = {
  life: ['A quiet, conserving energy', 'Balanced, steady vitality', 'Vivid, resilient life force'],
  heart: ['A private, protective heart', 'A warm and grounded heart', 'An open, expressive heart'],
  head: ['Instinct over analysis', 'Clear, practical thinking', 'A rich and layered mind'],
  fate: ['Free to write your own path', 'A path of many chapters', 'A strong sense of direction'],
  success: ['Fulfilment from many sources', 'Recognition that builds slowly', 'A bright line of achievement'],
  marriage: ['An independent heart', 'Meaningful, chosen bonds', 'Deep, lasting partnership'],
  travel: ['Adventure close to home', 'Journeys that change you', 'A restless, roaming spirit'],
};

const TRAIT_LABEL: Record<Trait, string> = {
  resilient: 'resilience', steady: 'steadiness', energetic: 'energy', cautious: 'care', adaptable: 'adaptability',
  romantic: 'romance', idealistic: 'idealism', reserved: 'composure', warm: 'warmth', sensitive: 'sensitivity',
  analytical: 'analytical thinking', creative: 'creativity', decisive: 'decisiveness', independent: 'independence',
  thoughtful: 'thoughtfulness', driven: 'drive', 'self-made': 'self-reliance', 'free-spirited': 'free spirit',
  recognised: 'visibility', loyal: 'loyalty', adventurous: 'adventurousness', homebody: 'love of home',
};

export function traitLabel(t: Trait): string {
  return TRAIT_LABEL[t];
}

function chosenOption(questionId: string, answers: PalmAnswers): PalmOption | undefined {
  const q = QUESTIONS.find((x) => x.id === questionId);
  if (!q) return undefined;
  const v = answers[q.id];
  if (!v || v === UNSURE) return undefined;
  return q.options.find((o) => o.id === v);
}

function readLine(line: LineId, answers: PalmAnswers): LineReading {
  const qs = QUESTIONS.filter((q) => q.line === line && isQuestionActive(q, answers));
  const chosen = qs.map((q) => chosenOption(q.id, answers)).filter((o): o is PalmOption => !!o);
  const info = LINE_INFO[line];

  // Strength: average weight mapped from [-2, 2] to [15, 95]; unanswered lines sit at 50.
  const avg = chosen.length ? chosen.reduce((s, o) => s + (o.weight ?? 0), 0) / chosen.length : 0.5;
  const strength = Math.round(55 + avg * 20);
  const band = strength >= 70 ? 2 : strength >= 50 ? 1 : 0;

  const paragraphs = chosen.length
    ? chosen.map((o) => o.meaning)
    : [`You skipped the questions for this line, so this section shows what the ${info.title.toLowerCase()} represents rather than a personal reading. ${info.represents}`];

  const traits = Array.from(new Set(chosen.flatMap((o) => o.traits ?? [])));
  return {
    id: line,
    title: info.title,
    strength: Math.max(10, Math.min(98, strength)),
    headline: chosen.length ? HEADLINES[line][band] : 'Not read — add details any time',
    paragraphs,
    traits,
    answered: chosen.length,
    asked: qs.length,
  };
}

function countTraits(lines: LineReading[], handTraits: Trait[]): Trait[] {
  const counts = new Map<Trait, number>();
  for (const t of [...handTraits, ...lines.flatMap((l) => l.traits)]) counts.set(t, (counts.get(t) ?? 0) + 1);
  return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).map(([t]) => t);
}

const join = (parts: (string | undefined | false)[]) => parts.filter(Boolean).join(' ');

function themes(answers: PalmAnswers, signId?: ZodiacId): ThemeReading[] {
  const o = (id: string) => chosenOption(id, answers);
  const sign = signId ? getSign(signId) : undefined;

  const personality = join([
    o('hand_shape')?.meaning ?? 'Your hand shape was not recorded, so this theme leans on your lines.',
    o('head_shape') && `Your head line adds: ${lower(o('head_shape')!.meaning)}`,
    sign && `As ${article(sign.name)} ${sign.name}, ${sign.drive} colours how these qualities show up.`,
  ]);

  const heartEnd = o('heart_end');
  const marriage = o('marriage_count');
  const relationships = join([
    heartEnd ? heartEnd.meaning : 'Your heart line ending was not recorded.',
    o('heart_breaks')?.id === 'many' && 'Because you feel things strongly, choose relationships where expectations are spoken aloud.',
    marriage && `Relationship lines: ${lower(marriage.meaning)}`,
    o('marriage_shape')?.meaning,
  ]);

  const fate = o('fate_presence');
  const success = o('success_presence');
  const careerParts = [
    fate ? fate.meaning : 'Your fate line was not recorded.',
    o('fate_start')?.meaning,
    success && success.id === 'clear' && 'Together with a clear success line, this is a classic sign of work that is both visible and satisfying.',
    success && success.id !== 'clear' && success.meaning,
    o('head_length')?.id === 'long' && 'Roles that reward depth and research suit you.',
    o('head_length')?.id === 'short' && 'Fast-moving environments where you can act on instinct suit you.',
  ];
  const career = join(careerParts);

  const life = o('life_curve');
  const travel = o('travel_count');
  const growth = join([
    life ? life.meaning : undefined,
    o('life_breaks')?.id && o('life_breaks')!.id !== 'none' ? o('life_breaks')!.meaning : undefined,
    travel?.meaning,
    !life && !travel && 'Answer the life and travel line questions to unlock this theme.',
  ]);

  return [
    { id: 'personality', title: 'Personality', text: personality },
    { id: 'relationships', title: 'Love & relationships', text: relationships },
    { id: 'career', title: 'Career & purpose', text: career },
    { id: 'growth', title: 'Growth & life experience', text: growth },
  ];
}

function lower(s: string) {
  return s.charAt(0).toLowerCase() + s.slice(1);
}

function article(word: string) {
  return /^[aeiou]/i.test(word) ? 'an' : 'a';
}

export interface GenerateInput {
  id: string;
  createdAt: Date;
  hand: Hand;
  isDominant: boolean | null;
  answers: PalmAnswers;
  name?: string;
  signId?: ZodiacId;
  photoUri?: string;
  method?: ReadingMethod;
}

export function answeredCount(answers: PalmAnswers): number {
  return Object.entries(sanitizeAnswers(answers)).filter(([, v]) => v && v !== UNSURE).length;
}

export function generatePalmReport(input: GenerateInput): PalmReport {
  const answers = sanitizeAnswers(input.answers);
  const lines = LINE_ORDER.map((l) => readLine(l, answers));
  const hand = chosenOption('hand_shape', answers);
  const top = countTraits(lines, hand?.traits ?? []).slice(0, 4);
  const strongest = [...lines].filter((l) => l.answered > 0).sort((a, b) => b.strength - a.strength)[0];

  const who = input.name?.trim() ? `${input.name.trim()}, your` : 'Your';
  const handLabel = `${input.hand} hand${input.isDominant === true ? ' (your dominant hand, read for how you use your gifts)' : input.isDominant === false ? ' (your non-dominant hand, read for natural tendencies)' : ''}`;
  const sign = input.signId ? getSign(input.signId) : undefined;
  const summary = top.length
    ? join([
        `${who} ${handLabel} points to ${listify(top.map(traitLabel))}.`,
        strongest && `Your most pronounced line is the ${strongest.title.toLowerCase()}: ${lower(strongest.headline)}.`,
        sign && `That pairs naturally with your ${sign.name} ${sign.keywords[0]}.`,
        'Use this as a prompt for reflection, not a prediction.',
      ])
    : `${who} reading is mostly blank because the questions were skipped. Add details about your lines for a personal report.`;

  return {
    id: input.id,
    version: 1,
    createdAt: input.createdAt.toISOString(),
    hand: input.hand,
    isDominant: input.isDominant,
    name: input.name?.trim() || undefined,
    signId: input.signId,
    photoUri: input.photoUri,
    answers,
    method: input.method ?? 'questionnaire',
    lines,
    themes: themes(answers, input.signId),
    topTraits: top,
    summary,
  };
}

function listify(items: string[]): string {
  if (items.length <= 1) return items[0] ?? '';
  return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;
}

export function reportShareText(r: PalmReport): string {
  return [
    `My Lunara palm reading (${r.hand} hand)`,
    '',
    r.summary,
    '',
    ...r.lines.filter((l) => l.answered > 0).map((l) => `${l.title}: ${l.headline}`),
    '',
    'For entertainment and reflection only.',
  ].join('\n');
}
