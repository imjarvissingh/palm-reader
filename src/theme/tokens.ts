/**
 * Lunara design tokens. Components read colours, spacing, radii and type from
 * here only — never raw values — so a rebrand is a change to this file.
 */
import { Platform } from 'react-native';

export const colors = {
  bg: '#0B0820',
  bgElevated: '#140F33',
  surface: 'rgba(255,255,255,0.06)',
  surfaceStrong: '#1E1747',
  surfacePressed: 'rgba(255,255,255,0.12)',
  border: 'rgba(201,168,255,0.22)',
  borderStrong: 'rgba(201,168,255,0.5)',
  text: '#F4EFFF',
  textMuted: '#B9B0DA',
  textSubtle: '#9289B8',
  accent: '#C9A8FF',
  accentDeep: '#7B4DDB',
  onAccent: '#1A1238',
  gold: '#E8C77A',
  goldDeep: '#C99A3E',
  danger: '#FF8A9A',
  success: '#8FE3B9',
  warning: '#FFD27A',
  overlay: 'rgba(11,8,32,0.72)',
  // Palm line colours used by diagrams and report accents.
  line: {
    life: '#8FE3B9',
    heart: '#FF8FB1',
    head: '#8FC8FF',
    fate: '#E8C77A',
    success: '#FFB86B',
    marriage: '#D59BFF',
    travel: '#7FE6E0',
  },
} as const;

export const gradients = {
  screen: ['#1B1145', '#0B0820'] as const,
  hero: ['#4A2A93', '#22135A', '#140F33'] as const,
  card: ['rgba(123,77,219,0.28)', 'rgba(30,23,71,0.6)'] as const,
  gold: ['#F6DE9B', '#D3A44A'] as const,
  lavender: ['#D9C2FF', '#9B6DF0'] as const,
};

export const spacing = { xxs: 2, xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, xxxl: 32, huge: 48 } as const;

export const radius = { sm: 8, md: 12, lg: 18, xl: 24, pill: 999 } as const;

const serifFallback = Platform.select({ ios: 'Georgia', android: 'serif', default: 'Georgia, serif' });

export const fonts = {
  display: 'CormorantGaramond_700Bold',
  displaySemi: 'CormorantGaramond_600SemiBold',
  serifFallback,
} as const;

export const type = {
  display: { fontFamily: fonts.display, fontSize: 38, lineHeight: 44 },
  title: { fontFamily: fonts.display, fontSize: 30, lineHeight: 36 },
  heading: { fontFamily: fonts.displaySemi, fontSize: 22, lineHeight: 28 },
  subheading: { fontSize: 17, lineHeight: 24, fontWeight: '600' as const },
  body: { fontSize: 15, lineHeight: 23 },
  bodySmall: { fontSize: 13, lineHeight: 19 },
  caption: { fontSize: 12, lineHeight: 16 },
  label: { fontSize: 12, lineHeight: 16, fontWeight: '700' as const, letterSpacing: 1.2 },
};

/** Minimum touch target recommended by both Apple and Google guidelines. */
export const touchTarget = 48;
