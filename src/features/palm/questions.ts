import type { LineId, PalmAnswers, PalmQuestion, QuestionId } from './types';

export const UNSURE = 'unsure';

const unsure = { id: UNSURE, label: 'Not sure', meaning: '' };

export interface LineInfo {
  id: LineId;
  title: string;
  alias?: string;
  where: string;
  represents: string;
}

export const LINE_INFO: Record<LineId, LineInfo> = {
  life: {
    id: 'life', title: 'Life Line',
    where: 'Curves around the base of the thumb, starting between thumb and index finger.',
    represents: 'Vitality, stamina and how you meet big changes. It is not read for lifespan.',
  },
  heart: {
    id: 'heart', title: 'Heart Line',
    where: 'The top horizontal line, running from the little-finger edge toward the index or middle finger.',
    represents: 'How you feel, love and express emotion.',
  },
  head: {
    id: 'head', title: 'Head Line',
    where: 'The middle horizontal line, starting near the life line and crossing the palm.',
    represents: 'Thinking style, focus and how you make decisions.',
  },
  fate: {
    id: 'fate', title: 'Fate Line', alias: 'Line of destiny',
    where: 'A vertical line rising from the wrist toward the middle finger. Not everyone has one.',
    represents: 'Direction, career path and the sense of being guided by purpose.',
  },
  success: {
    id: 'success', title: 'Success Line', alias: 'Sun or Apollo line',
    where: 'A vertical line rising toward the ring finger, often short or faint.',
    represents: 'Recognition, creativity and satisfaction in what you achieve.',
  },
  marriage: {
    id: 'marriage', title: 'Marriage Line', alias: 'Relationship lines',
    where: 'Short horizontal lines on the outer edge of the palm, just below the little finger.',
    represents: 'Close bonds and long-term partnerships.',
  },
  travel: {
    id: 'travel', title: 'Travel Line',
    where: 'Short horizontal lines on the outer edge of the palm, near the wrist.',
    represents: 'Restlessness, journeys and the appetite for new places.',
  },
};

export const LINE_ORDER: LineId[] = ['life', 'heart', 'head', 'fate', 'success', 'marriage', 'travel'];

export const QUESTIONS: readonly PalmQuestion[] = [
  {
    id: 'hand_shape', line: 'hand',
    prompt: 'Which best describes your hand shape?',
    help: 'Compare palm length (wrist to finger base) with the length of your middle finger.',
    options: [
      { id: 'earth', label: 'Square palm, short fingers', hint: 'Earth hand', meaning: 'An earth hand: grounded, practical and happiest making real, tangible progress.', traits: ['steady'] },
      { id: 'air', label: 'Square palm, long fingers', hint: 'Air hand', meaning: 'An air hand: curious, articulate and energised by ideas and conversation.', traits: ['analytical'] },
      { id: 'fire', label: 'Long palm, short fingers', hint: 'Fire hand', meaning: 'A fire hand: spirited, spontaneous and quick to act on inspiration.', traits: ['energetic'] },
      { id: 'water', label: 'Long palm, long fingers', hint: 'Water hand', meaning: 'A water hand: sensitive, imaginative and tuned in to other people’s moods.', traits: ['sensitive'] },
      unsure,
    ],
  },
  // Life line
  {
    id: 'life_length', line: 'life', prompt: 'How long is your life line?',
    options: [
      { id: 'long', label: 'Long — curves all the way to the wrist', meaning: 'A long, sweeping life line is read as robust energy and a love of being involved in life.', traits: ['resilient'], weight: 2 },
      { id: 'medium', label: 'Medium', meaning: 'A medium-length life line suggests balanced energy: you pace yourself well.', traits: ['steady'], weight: 1 },
      { id: 'short', label: 'Short', meaning: 'A short life line is traditionally read as independence — you draw energy from within rather than from routine. It says nothing about lifespan.', traits: ['independent'], weight: 0 },
      unsure,
    ],
  },
  {
    id: 'life_depth', line: 'life', prompt: 'How clearly is it marked?',
    options: [
      { id: 'deep', label: 'Deep and clear', meaning: 'A deep line points to steady vitality and a strong sense of self.', traits: ['resilient'], weight: 2 },
      { id: 'faint', label: 'Faint or thin', meaning: 'A fainter line suggests a sensitive system that benefits from rest and gentle routines.', traits: ['sensitive'], weight: -1 },
      unsure,
    ],
  },
  {
    id: 'life_curve', line: 'life', prompt: 'How does it curve?',
    options: [
      { id: 'wide', label: 'Wide arc into the palm', meaning: 'A wide arc is linked with enthusiasm, warmth and an appetite for new experiences.', traits: ['adventurous', 'warm'], weight: 1 },
      { id: 'close', label: 'Hugs the thumb closely', meaning: 'A line that hugs the thumb is read as caution and a preference for familiar comforts.', traits: ['cautious', 'homebody'], weight: 0 },
      unsure,
    ],
  },
  {
    id: 'life_breaks', line: 'life', prompt: 'Any breaks or overlaps?',
    options: [
      { id: 'none', label: 'Unbroken', meaning: 'An unbroken line suggests continuity — you tend to build on what came before.', traits: ['steady'], weight: 1 },
      { id: 'one', label: 'One break', meaning: 'A single break is read as a turning point: a move, a new chapter or a change of lifestyle.', traits: ['adaptable'], weight: 0 },
      { id: 'several', label: 'Several breaks', meaning: 'Several breaks suggest a life of reinventions. You adapt well, even when change is uncomfortable.', traits: ['adaptable', 'resilient'], weight: 0 },
      unsure,
    ],
  },
  // Heart line
  {
    id: 'heart_end', line: 'heart', prompt: 'Where does your heart line end?',
    options: [
      { id: 'index', label: 'Under the index finger', meaning: 'Ending under the index finger is linked with high ideals in love: you want a partner you can admire.', traits: ['idealistic', 'romantic'], weight: 2 },
      { id: 'between', label: 'Between index and middle', meaning: 'Ending between the index and middle fingers suggests a balance of head and heart — caring but realistic.', traits: ['warm', 'thoughtful'], weight: 2 },
      { id: 'middle', label: 'Under the middle finger', meaning: 'Ending under the middle finger is read as practical love: you show feelings through actions more than words.', traits: ['reserved', 'loyal'], weight: 1 },
      unsure,
    ],
  },
  {
    id: 'heart_shape', line: 'heart', prompt: 'Is it curved or straight?',
    options: [
      { id: 'curved', label: 'Curves upward', meaning: 'An upward curve suggests you express emotion openly and warmly.', traits: ['warm', 'romantic'], weight: 1 },
      { id: 'straight', label: 'Fairly straight', meaning: 'A straight heart line suggests a calm, considered approach to feelings.', traits: ['reserved', 'thoughtful'], weight: 0 },
      unsure,
    ],
  },
  {
    id: 'heart_breaks', line: 'heart', prompt: 'Are there breaks or chain-like links along it?',
    help: 'Look for small gaps, islands or short overlapping segments.',
    options: [
      { id: 'none', label: 'Clean and continuous', meaning: 'A clean heart line suggests emotional steadiness and loyalty.', traits: ['loyal'], weight: 1 },
      { id: 'few', label: 'A few breaks', meaning: 'A few breaks are read as meaningful emotional lessons that shaped how you love today.', traits: ['resilient'], weight: 0 },
      { id: 'many', label: 'Many breaks or chains', meaning: 'Many breaks or chains suggest deep sensitivity: you feel intensely and benefit from partners who are patient and clear.', traits: ['sensitive'], weight: -1 },
      unsure,
    ],
  },
  // Head line
  {
    id: 'head_length', line: 'head', prompt: 'How far does your head line reach?',
    options: [
      { id: 'long', label: 'Almost across the palm', meaning: 'A long head line suggests thorough thinking: you like to consider every angle.', traits: ['analytical', 'thoughtful'], weight: 2 },
      { id: 'medium', label: 'To the middle of the palm', meaning: 'A medium head line points to clear, efficient thinking.', traits: ['decisive'], weight: 1 },
      { id: 'short', label: 'Short', meaning: 'A short head line is read as quick, instinctive decision-making — you trust your gut.', traits: ['decisive', 'energetic'], weight: 1 },
      unsure,
    ],
  },
  {
    id: 'head_shape', line: 'head', prompt: 'What is its shape?',
    options: [
      { id: 'straight', label: 'Straight across', meaning: 'A straight head line favours logic, structure and realistic planning.', traits: ['analytical'], weight: 1 },
      { id: 'sloping', label: 'Slopes down toward the wrist', meaning: 'A sloping head line is linked with imagination and creative problem-solving.', traits: ['creative'], weight: 1 },
      { id: 'forked', label: 'Forked at the end', meaning: 'A forked end — sometimes called the writer’s fork — suggests you can see both sides and express ideas well.', traits: ['creative', 'analytical'], weight: 2 },
      unsure,
    ],
  },
  {
    id: 'head_start', line: 'head', prompt: 'Where does it start?',
    options: [
      { id: 'joined', label: 'Joined to the life line', meaning: 'A head line joined to the life line suggests a thoughtful, careful start before big decisions.', traits: ['cautious', 'thoughtful'], weight: 0 },
      { id: 'separate', label: 'Separate from the life line', meaning: 'A gap between head and life lines is read as independence of thought and a willingness to take risks.', traits: ['independent', 'adventurous'], weight: 1 },
      unsure,
    ],
  },
  // Fate line
  {
    id: 'fate_presence', line: 'fate', prompt: 'Can you see a fate line?',
    help: 'Look for a vertical line rising up the centre of the palm.',
    options: [
      { id: 'clear', label: 'Yes, clearly', meaning: 'A clear fate line suggests a strong sense of direction and commitment to a chosen path.', traits: ['driven'], weight: 2 },
      { id: 'faint', label: 'Faint or broken', meaning: 'A faint or broken fate line suggests a path with several chapters and changes of direction.', traits: ['adaptable'], weight: 1 },
      { id: 'absent', label: 'No fate line', meaning: 'Having no fate line is common. It is read as freedom: you write your own script rather than following one.', traits: ['free-spirited', 'independent'], weight: 0 },
      unsure,
    ],
  },
  {
    id: 'fate_start', line: 'fate', prompt: 'Where does the fate line begin?',
    showIf: { question: 'fate_presence', notIn: ['absent', 'unsure'] },
    options: [
      { id: 'wrist', label: 'At the wrist', meaning: 'Starting at the wrist is linked with knowing early what you wanted to do.', traits: ['driven'], weight: 1 },
      { id: 'life', label: 'From the life line', meaning: 'Rising from the life line is read as a self-made path, built through your own effort.', traits: ['self-made'], weight: 1 },
      { id: 'luna', label: 'From the outer palm edge', meaning: 'Starting from the outer edge (mount of Luna) suggests a career shaped by other people, public life or creativity.', traits: ['creative', 'recognised'], weight: 1 },
      unsure,
    ],
  },
  // Success line
  {
    id: 'success_presence', line: 'success', prompt: 'Is there a line rising toward your ring finger?',
    options: [
      { id: 'clear', label: 'Yes, clearly', meaning: 'A clear success line is linked with recognition and real satisfaction from your work.', traits: ['recognised', 'creative'], weight: 2 },
      { id: 'faint', label: 'Faint or short', meaning: 'A faint success line suggests satisfaction that grows quietly over time rather than arriving all at once.', traits: ['steady'], weight: 1 },
      { id: 'absent', label: 'No line', meaning: 'No success line is common and simply suggests that fulfilment comes from many sources, not one public achievement.', traits: ['independent'], weight: 0 },
      unsure,
    ],
  },
  // Marriage lines
  {
    id: 'marriage_count', line: 'marriage', prompt: 'How many short lines are below your little finger?',
    options: [
      { id: 'none', label: 'None visible', meaning: 'No visible lines here is read as an independent heart: relationships form on your own terms and timeline.', traits: ['independent'], weight: 0 },
      { id: 'one', label: 'One', meaning: 'A single strong line is associated with one deep, defining partnership.', traits: ['loyal'], weight: 2 },
      { id: 'two', label: 'Two', meaning: 'Two lines suggest two significant bonds — they may be romantic or deep friendships.', traits: ['warm'], weight: 1 },
      { id: 'many', label: 'Three or more', meaning: 'Several lines suggest a big heart that forms many meaningful connections.', traits: ['warm', 'romantic'], weight: 1 },
      unsure,
    ],
  },
  {
    id: 'marriage_shape', line: 'marriage', prompt: 'How does the clearest one look?',
    showIf: { question: 'marriage_count', notIn: ['none', 'unsure'] },
    options: [
      { id: 'straight', label: 'Straight', meaning: 'A straight line is read as a stable, balanced partnership.', traits: ['loyal'], weight: 1 },
      { id: 'up', label: 'Curves up', meaning: 'An upward curve is linked with a partnership that brings joy and growth.', traits: ['romantic'], weight: 1 },
      { id: 'down', label: 'Curves down', meaning: 'A downward curve is a reminder to keep investing time and honesty in your closest bond — communication is the key.', traits: ['sensitive'], weight: 0 },
      { id: 'forked', label: 'Forked', meaning: 'A fork suggests partners who need space to grow as individuals; independence within togetherness.', traits: ['independent'], weight: 0 },
      unsure,
    ],
  },
  // Travel lines
  {
    id: 'travel_count', line: 'travel', prompt: 'Any horizontal lines on the outer palm near your wrist?',
    options: [
      { id: 'none', label: 'None', meaning: 'Few travel lines suggest you find adventure close to home — in people, projects and ideas.', traits: ['homebody'], weight: 0 },
      { id: 'few', label: 'One or two', meaning: 'One or two travel lines suggest memorable journeys that change your outlook.', traits: ['adventurous'], weight: 1 },
      { id: 'many', label: 'Several', meaning: 'Many travel lines are read as a restless, curious spirit drawn to new places and cultures.', traits: ['adventurous', 'free-spirited'], weight: 2 },
      unsure,
    ],
  },
];

const BY_ID = new Map(QUESTIONS.map((q) => [q.id, q]));

export function getQuestion(id: QuestionId): PalmQuestion {
  const q = BY_ID.get(id);
  if (!q) throw new Error(`Unknown question ${id}`);
  return q;
}

/** Whether a question applies given current answers (conditional questions). */
export function isQuestionActive(q: PalmQuestion, answers: PalmAnswers): boolean {
  if (!q.showIf) return true;
  const dep = answers[q.showIf.question];
  return dep !== undefined && !q.showIf.notIn.includes(dep);
}

export type StepId = 'hand' | LineId;

export const STEPS: StepId[] = ['hand', ...LINE_ORDER];

export function questionsForStep(step: StepId, answers: PalmAnswers): PalmQuestion[] {
  return QUESTIONS.filter((q) => q.line === step && isQuestionActive(q, answers));
}

/** Drops answers whose conditional question no longer applies and unknown option ids. */
export function sanitizeAnswers(answers: PalmAnswers): PalmAnswers {
  const out: PalmAnswers = {};
  for (const q of QUESTIONS) {
    const v = answers[q.id];
    if (v === undefined) continue;
    if (!q.options.some((o) => o.id === v)) continue;
    if (!isQuestionActive(q, answers)) continue;
    out[q.id] = v;
  }
  return out;
}
