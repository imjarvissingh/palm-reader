import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Pressable, StyleSheet, View, type ViewStyle } from 'react-native';
import { colors, gradients, radius, spacing } from '@/theme/tokens';
import { haptic } from './Button';

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle | ViewStyle[];
  glow?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  testID?: string;
}

export function Card({ children, onPress, style, glow, accessibilityLabel, accessibilityHint, testID }: CardProps) {
  const body = (
    <>
      <LinearGradient colors={gradients.card} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
      <View style={styles.inner}>{children}</View>
    </>
  );
  if (!onPress) {
    return (
      <View testID={testID} style={[styles.card, glow && styles.glow, style]}>
        {body}
      </View>
    );
  }
  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      onPress={() => {
        haptic();
        onPress();
      }}
      style={({ pressed }) => [styles.card, glow && styles.glow, pressed && styles.pressed, style]}
    >
      {body}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    backgroundColor: colors.bgElevated,
  },
  inner: { padding: spacing.lg, gap: spacing.sm },
  glow: { borderColor: colors.borderStrong },
  pressed: { opacity: 0.85 },
});
