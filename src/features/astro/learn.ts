/** Original short-form learning content. */

export interface Article {
  id: string;
  title: string;
  minutes: number;
  topic: 'palmistry' | 'astrology';
  paragraphs: string[];
}

export const ARTICLES: readonly Article[] = [
  {
    id: 'palmistry-basics', title: 'Palmistry in five minutes', minutes: 5, topic: 'palmistry',
    paragraphs: [
      'Palmistry, or chiromancy, is a centuries-old practice found in India, China, Greece and medieval Europe. Readers look at the shape of the hand, the fingers, the raised pads (mounts) and the lines.',
      'Traditionally the non-dominant hand is said to show your natural tendencies and the dominant hand what you have done with them. Many readers compare both.',
      'There is no scientific evidence that palm features predict personality or the future. Treat a reading as a mirror for reflection — a structured way to think about your life — rather than a forecast.',
    ],
  },
  {
    id: 'hand-shapes', title: 'The four hand shapes', minutes: 3, topic: 'palmistry',
    paragraphs: [
      'Earth hands have square palms and short fingers: practical, steady and hands-on.',
      'Air hands have square palms and long fingers: curious, communicative and analytical.',
      'Fire hands have long palms and short fingers: energetic, spontaneous and bold.',
      'Water hands have long palms and long fingers: sensitive, intuitive and imaginative.',
      'Measure your palm from wrist crease to the base of the middle finger, and compare it with the length of the middle finger.',
    ],
  },
  {
    id: 'major-lines', title: 'The three major lines', minutes: 4, topic: 'palmistry',
    paragraphs: [
      'The life line curves around the base of the thumb. Despite its name, it is read for vitality and how you meet change — not for lifespan.',
      'The head line runs across the middle of the palm. It is associated with thinking style: straight for logic, sloping for imagination.',
      'The heart line runs across the top of the palm below the fingers. Its ending point and curve are read for how you express feelings.',
    ],
  },
  {
    id: 'minor-lines', title: 'Fate, sun, marriage and travel lines', minutes: 4, topic: 'palmistry',
    paragraphs: [
      'The fate line rises vertically toward the middle finger and is linked with direction and career. Many hands do not have one, which is read as freedom to change course.',
      'The sun (success) line runs toward the ring finger and is associated with recognition and creative fulfilment.',
      'Marriage or relationship lines are short horizontal marks on the outer edge of the palm below the little finger.',
      'Travel lines are horizontal lines on the outer edge near the wrist, read as restlessness and journeys.',
    ],
  },
  {
    id: 'mounts', title: 'The mounts of the hand', minutes: 3, topic: 'palmistry',
    paragraphs: [
      'Below each finger is a mount named for a planet: Jupiter (index) for ambition, Saturn (middle) for responsibility, Apollo (ring) for creativity and Mercury (little) for communication.',
      'The mount of Venus at the base of the thumb is linked with warmth and love of life; the mount of Luna on the opposite side with imagination.',
    ],
  },
  {
    id: 'elements', title: 'Elements and modalities', minutes: 4, topic: 'astrology',
    paragraphs: [
      'Each zodiac sign belongs to one of four elements: fire (Aries, Leo, Sagittarius), earth (Taurus, Virgo, Capricorn), air (Gemini, Libra, Aquarius) and water (Cancer, Scorpio, Pisces).',
      'Each also has a modality. Cardinal signs start things, fixed signs sustain them and mutable signs adapt them.',
      'Element plus modality gives each sign a unique pairing — Leo is fixed fire, Pisces is mutable water — which is why no two signs are alike.',
    ],
  },
  {
    id: 'sun-moon-rising', title: 'Sun, Moon and rising', minutes: 3, topic: 'astrology',
    paragraphs: [
      'Your Sun sign comes from your birthday and describes your core identity. It is what daily horoscopes use.',
      'Your Moon sign describes emotional needs; it changes every two to three days, so it needs birth time.',
      'Your rising sign (ascendant) is the sign on the eastern horizon at your birth and changes every two hours, so it needs exact time and place.',
    ],
  },
  {
    id: 'moon-phases', title: 'Working with moon phases', minutes: 3, topic: 'astrology',
    paragraphs: [
      'Many people use the lunar cycle as a rhythm for planning: intentions at the new moon, action while it waxes, reflection at the full moon and release as it wanes.',
      'You do not need to believe in astrology to find a monthly check-in useful. The Moon calendar in Lunara shows the calculated phase for each day.',
    ],
  },
];

export function getArticle(id: string): Article | undefined {
  return ARTICLES.find((a) => a.id === id);
}
