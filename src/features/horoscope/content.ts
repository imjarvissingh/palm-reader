/**
 * Original horoscope phrase bank. The generator combines these fragments with
 * sign traits, the period and the real moon phase, seeded by date, so each
 * sign gets stable, distinct copy for each day, week and month.
 *
 * Placeholders: {drive} {keyword} {strength} {period} {match}
 */
import type { Element } from './zodiac';

export const HEADLINES = [
  'Small steps, bright signals', 'Let the quiet speak', 'Lead with warmth', 'Clear the runway',
  'Curiosity opens a door', 'Steady hands, open heart', 'A timely conversation', 'Trust the slower path',
  'Say the honest thing', 'Room to breathe', 'Plant something new', 'Finish what matters',
  'Follow the spark', 'Gentle course correction', 'An invitation to play', 'Choose your focus',
] as const;

export const ELEMENT_OPENERS: Record<Element, readonly string[]> = {
  fire: [
    '{period} rewards initiative. Put {drive} behind one idea instead of five.',
    'Energy runs high {periodLower}, and it wants a direction. Pick the goal that excites you most and move.',
    'Your enthusiasm is contagious {periodLower}. Use it to rally people, not to rush them.',
  ],
  earth: [
    '{period} favours practical progress. {drive} turns a vague plan into something you can hold.',
    'Slow and solid wins {periodLower}. A routine you keep beats a resolution you forget.',
    'Look at what is already working {periodLower} and give it a little more care.',
  ],
  air: [
    '{period} is full of conversations worth having. {drive} helps you spot the connection others miss.',
    'Ideas arrive quickly {periodLower}. Write them down before you judge them.',
    'A fresh perspective changes the picture {periodLower}. Ask one more question than usual.',
  ],
  water: [
    '{period} asks you to trust what you feel before you can explain it. {drive} is a reliable compass.',
    'Emotions run close to the surface {periodLower}. Naming them gently takes away their sting.',
    'Pay attention to small kindnesses {periodLower}, given and received. They point the way.',
  ],
};

export const OVERVIEW_MIDDLES = [
  'Lean into {keyword}; it is where your best results come from right now.',
  'A small decision you have been postponing becomes easier once you stop waiting for perfect conditions.',
  'Someone close notices your effort, even if they do not say it straight away.',
  'If something feels stuck, change the setting: a walk, a new room, a different time of day.',
  'Your strength — {strength} — is the right tool for what comes up.',
  'Balance is not about doing everything; it is about doing the next right thing.',
  'Old patterns may knock. You can answer differently this time.',
  'Make space for one thing that is purely for joy.',
] as const;

export const LOVE = [
  'Affection grows through attention. A thoughtful question goes further than a grand gesture.',
  'If you are partnered, plan something simple and shared. If single, let curiosity lead conversations.',
  'Say what you appreciate out loud. It lands more softly than you expect.',
  'An old misunderstanding can be cleared with patience and a little humour.',
  'Chemistry with {match} energy feels easy right now — notice who brings out your playful side.',
  'Boundaries are a form of care. Being clear about what you need invites honesty in return.',
  'Romance favours the unhurried. Let things unfold instead of forcing a timeline.',
  'Listen for what is not being said. A gentle check-in builds trust.',
  'Self-love counts too: treat yourself with the patience you give others.',
  'A message you have been holding back may be welcome. Keep it kind and brief.',
] as const;

export const CAREER = [
  'Tackle the task with the biggest payoff first, before notifications set the agenda.',
  'Your ideas gain traction when you share a rough draft early instead of polishing in private.',
  'Collaboration beats competition now. Offer help and it comes back.',
  'Money matters favour careful review. Read the fine print before agreeing to anything new.',
  'A mentor-style conversation could clarify your next move. Ask someone who has walked the path.',
  'Recognition may be slow, but your consistency is being noticed.',
  'Trim one commitment that drains you so the important work gets your best energy.',
  'Learning a small new skill now pays off sooner than you think.',
  'Negotiations go well when you lead with what both sides want.',
  'Organise your space and your calendar; clarity outside creates clarity inside.',
] as const;

export const GROWTH = [
  'Journal for five minutes: what are you ready to outgrow?',
  'Notice your inner critic and answer it the way you would answer a friend.',
  'Courage looks small from the outside. Doing one uncomfortable thing counts.',
  'Curiosity is a better guide than certainty. Explore the question rather than forcing the answer.',
  'Let go of one expectation that was never really yours.',
  'Celebrate a recent win, however small. Progress compounds.',
  'Try a beginner’s mindset with something familiar; you may see it anew.',
  'Spend time with people who make you feel more like yourself.',
] as const;

export const WELLBEING = [
  'Your body appreciates rhythm: regular meals, water and a consistent bedtime.',
  'A short walk outdoors resets more than you expect.',
  'Give your eyes and mind a screen break each hour.',
  'Stretch the places that hold tension, especially shoulders and jaw.',
  'Rest is productive. Protect at least one unscheduled hour.',
  'Breathe slowly for a minute before reacting to anything stressful.',
  'Move in a way that feels like play rather than a chore.',
  'Notice what drains you and what restores you. Choose more of the second.',
] as const;

export const MOODS = ['Optimistic', 'Reflective', 'Playful', 'Focused', 'Tender', 'Bold', 'Calm', 'Curious', 'Grounded', 'Inspired'] as const;

export const LUCKY_COLORS = [
  'Amethyst', 'Midnight blue', 'Rose gold', 'Emerald', 'Ivory', 'Coral', 'Silver', 'Saffron',
  'Teal', 'Lavender', 'Burgundy', 'Sky blue',
] as const;

export const FOCUS_WORDS = ['Patience', 'Clarity', 'Courage', 'Kindness', 'Balance', 'Release', 'Momentum', 'Trust', 'Play', 'Gratitude', 'Focus', 'Renewal'] as const;
