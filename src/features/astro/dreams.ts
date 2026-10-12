/** Original dream-symbol dictionary. Interpretations are folkloric and for reflection only. */

export interface DreamSymbol {
  id: string;
  name: string;
  category: 'nature' | 'animals' | 'people' | 'places' | 'actions' | 'objects';
  meaning: string;
  ask: string;
}

export const DREAM_SYMBOLS: readonly DreamSymbol[] = [
  { id: 'falling', name: 'Falling', category: 'actions', meaning: 'Often linked to a sense of losing control or footing in waking life — a change that is happening faster than you would like.', ask: 'Where do you feel unsupported right now?' },
  { id: 'flying', name: 'Flying', category: 'actions', meaning: 'Freedom, perspective and rising above a problem. Effortless flight suggests confidence; struggling to stay up hints at doubt.', ask: 'What would you do if nothing held you back?' },
  { id: 'chased', name: 'Being chased', category: 'actions', meaning: 'Avoidance. Something you are putting off — a feeling, a conversation, a decision — keeps following you.', ask: 'What are you running from, and what happens if you turn around?' },
  { id: 'teeth', name: 'Teeth falling out', category: 'actions', meaning: 'Commonly tied to worries about appearance, communication or a transition such as ageing or a new role.', ask: 'Are you worried about how you come across?' },
  { id: 'exam', name: 'Unprepared for an exam', category: 'actions', meaning: 'Feeling tested or judged. Frequent in people who hold themselves to high standards.', ask: 'Who are you trying to prove yourself to?' },
  { id: 'lost', name: 'Being lost', category: 'places', meaning: 'Uncertainty about direction, or a choice with too many paths.', ask: 'Which next step is small enough to take today?' },
  { id: 'house', name: 'A house', category: 'places', meaning: 'Often a picture of the self. New rooms can mean discovering new abilities; a crumbling house can mean neglected needs.', ask: 'Which part of your life needs some care?' },
  { id: 'school', name: 'School', category: 'places', meaning: 'Lessons still being learned, or old patterns from earlier years resurfacing.', ask: 'What lesson keeps repeating for you?' },
  { id: 'bridge', name: 'A bridge', category: 'places', meaning: 'Transition from one phase to another. A sturdy bridge suggests readiness; a shaky one, hesitation.', ask: 'What are you crossing toward?' },
  { id: 'water', name: 'Water', category: 'nature', meaning: 'Emotions. Calm water reflects peace; rough or murky water reflects turbulence or confusion.', ask: 'How would you describe the water — and your feelings?' },
  { id: 'ocean', name: 'The ocean', category: 'nature', meaning: 'The vast unknown and deep feelings. Swimming easily suggests emotional trust.', ask: 'What feels bigger than you right now?' },
  { id: 'rain', name: 'Rain', category: 'nature', meaning: 'Release and renewal. A good cry for the soul, or growth after a dry spell.', ask: 'What are you ready to wash away?' },
  { id: 'fire', name: 'Fire', category: 'nature', meaning: 'Passion, transformation or anger. Warming fire nourishes; wild fire warns of burnout.', ask: 'Is your fire warming you or burning you out?' },
  { id: 'storm', name: 'A storm', category: 'nature', meaning: 'Tension building toward release. Often appears before a needed confrontation or change.', ask: 'What tension is waiting to break?' },
  { id: 'moon', name: 'The Moon', category: 'nature', meaning: 'Intuition, cycles and the hidden side of things.', ask: 'What does your intuition already know?' },
  { id: 'sun', name: 'The Sun', category: 'nature', meaning: 'Vitality, clarity and success. A bright sun often shows optimism returning.', ask: 'What is becoming clear to you?' },
  { id: 'mountain', name: 'A mountain', category: 'nature', meaning: 'A goal or obstacle. Climbing shows effort; reaching the top shows achievement.', ask: 'What summit are you working toward?' },
  { id: 'flowers', name: 'Flowers', category: 'nature', meaning: 'Growth, beauty and appreciation. Blooming flowers can mark a relationship or project flourishing.', ask: 'What is blossoming in your life?' },
  { id: 'snake', name: 'A snake', category: 'animals', meaning: 'Transformation and healing (shedding skin), or a warning about a hidden threat, depending on how it felt.', ask: 'What are you outgrowing?' },
  { id: 'cat', name: 'A cat', category: 'animals', meaning: 'Independence, intuition and feminine energy. A friendly cat can mean trusting your instincts.', ask: 'Where do you need more independence?' },
  { id: 'dog', name: 'A dog', category: 'animals', meaning: 'Loyalty, friendship and protection.', ask: 'Who has been loyal to you — and to whom are you loyal?' },
  { id: 'bird', name: 'A bird', category: 'animals', meaning: 'Freedom, messages and aspirations.', ask: 'What message are you waiting to receive or send?' },
  { id: 'spider', name: 'A spider', category: 'animals', meaning: 'Creativity and patience (weaving a web), or feeling entangled in a situation.', ask: 'What are you building — or caught in?' },
  { id: 'fish', name: 'Fish', category: 'animals', meaning: 'Abundance, fertility of ideas, and insights from the subconscious.', ask: 'What new idea is surfacing?' },
  { id: 'horse', name: 'A horse', category: 'animals', meaning: 'Power, drive and freedom of movement.', ask: 'Where do you want to go faster?' },
  { id: 'baby', name: 'A baby', category: 'people', meaning: 'A new beginning, a fresh project, or a vulnerable part of yourself needing care.', ask: 'What new thing are you nurturing?' },
  { id: 'ex', name: 'An ex-partner', category: 'people', meaning: 'Rarely about the person. Usually about a quality, lesson or feeling from that time.', ask: 'What did that chapter teach you?' },
  { id: 'stranger', name: 'A stranger', category: 'people', meaning: 'An unfamiliar side of yourself, or new influences entering your life.', ask: 'What quality did the stranger have?' },
  { id: 'wedding', name: 'A wedding', category: 'people', meaning: 'Commitment and union — sometimes between two parts of yourself, such as head and heart.', ask: 'What are you ready to commit to?' },
  { id: 'death', name: 'Death', category: 'people', meaning: 'Almost always symbolic: an ending that makes room for something new.', ask: 'What chapter is closing?' },
  { id: 'keys', name: 'Keys', category: 'objects', meaning: 'Access, answers and opportunity. Losing keys can mean feeling locked out.', ask: 'What door would you like to open?' },
  { id: 'mirror', name: 'A mirror', category: 'objects', meaning: 'Self-image and self-reflection. A distorted mirror can point to self-criticism.', ask: 'How do you see yourself lately?' },
  { id: 'money', name: 'Money', category: 'objects', meaning: 'Self-worth and energy exchange, not only finances.', ask: 'Where do you feel valued — or undervalued?' },
  { id: 'phone', name: 'A phone that will not work', category: 'objects', meaning: 'Frustrated communication; feeling unheard.', ask: 'Who do you need to reach?' },
  { id: 'car', name: 'A car', category: 'objects', meaning: 'Your direction and control in life. Who is driving matters.', ask: 'Are you in the driver’s seat?' },
  { id: 'door', name: 'A door', category: 'objects', meaning: 'Opportunity and transition. Open doors invite; locked doors ask for patience or a new approach.', ask: 'Which door are you standing in front of?' },
  { id: 'clock', name: 'A clock', category: 'objects', meaning: 'Time pressure or a reminder about priorities.', ask: 'What feels urgent, and is it truly important?' },
  { id: 'naked', name: 'Being naked in public', category: 'actions', meaning: 'Vulnerability and fear of exposure — or a wish to be seen as you really are.', ask: 'Where do you feel exposed?' },
  { id: 'swimming', name: 'Swimming', category: 'actions', meaning: 'Navigating emotions. Easy swimming means flow; struggling means feeling overwhelmed.', ask: 'Are you floating or fighting the current?' },
  { id: 'dancing', name: 'Dancing', category: 'actions', meaning: 'Joy, freedom of expression and harmony with others.', ask: 'Where could you be more playful?' },
];

export function searchDreams(query: string): DreamSymbol[] {
  const q = query.trim().toLowerCase();
  if (!q) return [...DREAM_SYMBOLS];
  return DREAM_SYMBOLS.filter((d) => d.name.toLowerCase().includes(q) || d.meaning.toLowerCase().includes(q) || d.category.includes(q));
}
