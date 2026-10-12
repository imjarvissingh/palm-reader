import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, gradients, spacing } from '@/theme/tokens';
import { Starfield } from './Starfield';

interface ScreenProps {
  children: React.ReactNode;
  scroll?: boolean;
  /** Apply the top safe-area inset (off for screens under a native header). */
  edgeTop?: boolean;
  /** Extra bottom padding (e.g. above a sticky footer). */
  padBottom?: number;
  contentStyle?: ViewStyle;
  footer?: React.ReactNode;
  testID?: string;
}

export function Screen({ children, scroll = true, edgeTop = true, padBottom = 0, contentStyle, footer, testID }: ScreenProps) {
  const insets = useSafeAreaInsets();
  const pad: ViewStyle = {
    paddingTop: (edgeTop ? insets.top : 0) + spacing.lg,
    paddingBottom: spacing.xxxl + padBottom + (footer ? 0 : insets.bottom),
    paddingHorizontal: spacing.xl,
  };

  return (
    <View style={styles.root} testID={testID}>
      <LinearGradient colors={gradients.screen} style={StyleSheet.absoluteFill} />
      <Starfield />
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {scroll ? (
          <ScrollView
            style={styles.flex}
            contentContainerStyle={[styles.content, pad, contentStyle]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {children}
          </ScrollView>
        ) : (
          <View style={[styles.flex, styles.content, pad, contentStyle]}>{children}</View>
        )}
        {footer ? <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}>{footer}</View> : null}
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  flex: { flex: 1 },
  content: { width: '100%', maxWidth: 640, alignSelf: 'center', gap: spacing.lg },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    backgroundColor: colors.bg,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
});
