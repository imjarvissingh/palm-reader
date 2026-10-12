import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { ActivityIndicator, Platform, Pressable, StyleSheet, View, type ViewStyle } from 'react-native';
import { colors, gradients, radius, spacing, touchTarget } from '@/theme/tokens';
import { Text } from './Text';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

export interface ButtonProps {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
  accessibilityHint?: string;
  testID?: string;
}

export function haptic() {
  if (Platform.OS !== 'web') void Haptics.selectionAsync().catch(() => undefined);
}

export function Button({ label, onPress, variant = 'primary', disabled, loading, icon, style, accessibilityHint, testID }: ButtonProps) {
  const inactive = disabled || loading;
  const content = (
    <View style={styles.inner}>
      {loading ? <ActivityIndicator color={variant === 'primary' ? colors.onAccent : colors.accent} /> : icon}
      <Text variant="subheading" tone={variant === 'primary' ? 'onAccent' : variant === 'danger' ? 'danger' : 'default'}>
        {label}
      </Text>
    </View>
  );

  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: !!inactive, busy: !!loading }}
      disabled={inactive}
      onPress={() => {
        haptic();
        onPress?.();
      }}
      style={({ pressed }) => [styles.base, variant !== 'primary' && styles[variant], inactive && styles.disabled, pressed && styles.pressed, style]}
    >
      {variant === 'primary' ? (
        <LinearGradient colors={gradients.gold} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.gradient}>
          {content}
        </LinearGradient>
      ) : (
        content
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { minHeight: touchTarget + 4, borderRadius: radius.pill, overflow: 'hidden', justifyContent: 'center' },
  gradient: { flex: 1, minHeight: touchTarget + 4, justifyContent: 'center', paddingHorizontal: spacing.xl },
  inner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, paddingHorizontal: spacing.lg },
  secondary: { borderWidth: 1.5, borderColor: colors.borderStrong, backgroundColor: colors.surface },
  ghost: { backgroundColor: 'transparent' },
  danger: { borderWidth: 1.5, borderColor: colors.danger, backgroundColor: 'transparent' },
  disabled: { opacity: 0.45 },
  pressed: { opacity: 0.82, transform: [{ scale: 0.99 }] },
});
