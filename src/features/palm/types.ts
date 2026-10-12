import type { ZodiacId } from '@/features/horoscope/zodiac';

export type LineId = 'life' | 'heart' | 'head' | 'fate' | 'success' | 'marriage' | 'travel';
export type Hand = 'left' | 'right';

export type QuestionId =
  | 'hand_shape'
  | 'life_length' | 'life_depth' | 'life_curve' | 'life_breaks'
  | 'heart_end' | 'heart_shape' | 'heart_breaks'
  | 'head_length' | 'head_shape' | 'head_start'
  | 'fate_presence' | 'fate_start'
  | 'success_presence'
  | 'marriage_count' | 'marriage_shape'
  | 'travel_count';

/** Selected option id per question. Missing or 'unsure' means not answered. */
export type PalmAnswers = Partial<Record<QuestionId, string>>;

export type Trait =
  | 'resilient' | 'steady' | 'energetic' | 'cautious' | 'adaptable'
  | 'romantic' | 'idealistic' | 'reserved' | 'warm' | 'sensitive'
  | 'analytical' | 'creative' | 'decisive' | 'independent' | 'thoughtful'
  | 'driven' | 'self-made' | 'free-spirited' | 'recognised' | 'loyal' | 'adventurous' | 'homebody';

export interface PalmOption {
  id: string;
  label: string;
  hint?: string;
  /** Interpretation used in the report when this option is chosen. */
  meaning: string;
  traits?: Trait[];
  /** Contribution to the line's strength score, -2 to +2. */
  weight?: number;
}

export interface PalmQuestion {
  id: QuestionId;
  line: LineId | 'hand';
  prompt: string;
  help?: string;
  options: PalmOption[];
  /** Only ask when another answer matches. */
  showIf?: { question: QuestionId; notIn: string[] };
}

export interface LineReading {
  id: LineId;
  title: string;
  /** 0-100, how pronounced the line's qualities are from the answers. */
  strength: number;
  headline: string;
  paragraphs: string[];
  traits: Trait[];
  answered: number;
  asked: number;
}

export interface ThemeReading {
  id: 'personality' | 'relationships' | 'career' | 'growth';
  title: string;
  text: string;
}

export type ReadingMethod = 'questionnaire' | 'questionnaire+photo-assist';

export interface PalmReport {
  id: string;
  version: 1;
  createdAt: string;
  hand: Hand;
  isDominant: boolean | null;
  name?: string;
  signId?: ZodiacId;
  /** Local file URI of the user's palm photo, if they added one. Never uploaded by default. */
  photoUri?: string;
  answers: PalmAnswers;
  method: ReadingMethod;
  lines: LineReading[];
  themes: ThemeReading[];
  topTraits: Trait[];
  summary: string;
  favorite?: boolean;
}
