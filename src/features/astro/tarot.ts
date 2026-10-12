/** The 22 Major Arcana (traditional names, public domain) with original yes/no readings. */
export type TarotAnswer = 'Yes' | 'No' | 'Maybe';

export interface TarotCard {
  id: number;
  name: string;
  answer: TarotAnswer;
  meaning: string;
}

export const MAJOR_ARCANA: readonly TarotCard[] = [
  { id: 0, name: 'The Fool', answer: 'Yes', meaning: 'A fresh start. Leap, but look where you land.' },
  { id: 1, name: 'The Magician', answer: 'Yes', meaning: 'You have the tools you need. Act with intent.' },
  { id: 2, name: 'The High Priestess', answer: 'Maybe', meaning: 'The answer is not visible yet. Trust what you sense.' },
  { id: 3, name: 'The Empress', answer: 'Yes', meaning: 'Growth and abundance. Nurture it and it flourishes.' },
  { id: 4, name: 'The Emperor', answer: 'Yes', meaning: 'Structure wins. Make a plan and hold to it.' },
  { id: 5, name: 'The Hierophant', answer: 'Maybe', meaning: 'Seek advice or follow the proven path first.' },
  { id: 6, name: 'The Lovers', answer: 'Yes', meaning: 'Alignment of heart and values. Choose wholeheartedly.' },
  { id: 7, name: 'The Chariot', answer: 'Yes', meaning: 'Momentum is on your side if you stay focused.' },
  { id: 8, name: 'Strength', answer: 'Yes', meaning: 'Gentle persistence achieves more than force.' },
  { id: 9, name: 'The Hermit', answer: 'Maybe', meaning: 'Step back and reflect before deciding.' },
  { id: 10, name: 'Wheel of Fortune', answer: 'Yes', meaning: 'Things are turning. Be ready to move with them.' },
  { id: 11, name: 'Justice', answer: 'Maybe', meaning: 'The outcome reflects what is fair. Be honest with yourself.' },
  { id: 12, name: 'The Hanged Man', answer: 'No', meaning: 'Pause. A new perspective is needed first.' },
  { id: 13, name: 'Death', answer: 'No', meaning: 'Something is ending to make space. Let it.' },
  { id: 14, name: 'Temperance', answer: 'Maybe', meaning: 'Balance and patience; blend options rather than choosing extremes.' },
  { id: 15, name: 'The Devil', answer: 'No', meaning: 'Check what is holding you. Not every attachment serves you.' },
  { id: 16, name: 'The Tower', answer: 'No', meaning: 'Sudden change. Rebuild on firmer ground.' },
  { id: 17, name: 'The Star', answer: 'Yes', meaning: 'Hope and healing. The way forward is opening.' },
  { id: 18, name: 'The Moon', answer: 'Maybe', meaning: 'Things are unclear. Wait for more light.' },
  { id: 19, name: 'The Sun', answer: 'Yes', meaning: 'Clarity, joy and success.' },
  { id: 20, name: 'Judgement', answer: 'Yes', meaning: 'A wake-up call. Answer it.' },
  { id: 21, name: 'The World', answer: 'Yes', meaning: 'Completion. You are closer than you think.' },
];

export function drawCard(rand: () => number = Math.random): TarotCard {
  return MAJOR_ARCANA[Math.floor(rand() * MAJOR_ARCANA.length)] ?? MAJOR_ARCANA[0]!;
}
