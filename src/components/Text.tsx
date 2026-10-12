import React from 'react';
import { Text as RNText, type TextProps, type TextStyle, StyleSheet } from 'react-native';
import { colors, type as typeScale } from '@/theme/tokens';

type Variant = keyof typeof typeScale;
type Tone = 'default' | 'muted' | 'subtle' | 'accent' | 'gold' | 'danger' | 'success' | 'onAccent';

const toneColor: Record<Tone, string> = {
  default: colors.text,
  muted: colors.textMuted,
  subtle: colors.textSubtle,
  accent: colors.accent,
  gold: colors.gold,
  danger: colors.danger,
  success: colors.success,
  onAccent: colors.onAccent,
};

export interface AppTextProps extends TextProps {
  variant?: Variant;
  tone?: Tone;
  center?: boolean;
  style?: TextStyle | TextStyle[];
}

export function Text({ variant = 'body', tone = 'default', center, style, ...rest }: AppTextProps) {
  return (
    <RNText
      maxFontSizeMultiplier={1.6}
      {...rest}
      style={[typeScale[variant], { color: toneColor[tone] }, center && styles.center, style]}
    />
  );
}

const styles = StyleSheet.create({ center: { textAlign: 'center' } });
