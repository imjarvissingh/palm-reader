import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { colors, radius, spacing, touchTarget } from '@/theme/tokens';
import { Text } from './Text';

export interface BirthFields {
  day: string;
  month: string;
  year: string;
}

export function fieldsFromISO(iso: string | null): BirthFields {
  const m = iso ? /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso) : null;
  return m ? { year: m[1] ?? '', month: String(Number(m[2])), day: String(Number(m[3])) } : { day: '', month: '', year: '' };
}

export function BirthDateFields({ value, onChange, error }: { value: BirthFields; onChange: (v: BirthFields) => void; error?: string | null }) {
  const field = (key: keyof BirthFields, label: string, placeholder: string, maxLength: number, flex: number) => (
    <View style={{ flex, gap: 6 }}>
      <Text variant="caption" tone="muted">
        {label}
      </Text>
      <TextInput
        testID={`birth-${key}`}
        accessibilityLabel={`Birth ${label.toLowerCase()}`}
        value={value[key]}
        onChangeText={(t) => onChange({ ...value, [key]: t.replace(/[^0-9]/g, '').slice(0, maxLength) })}
        placeholder={placeholder}
        placeholderTextColor={colors.textSubtle}
        keyboardType="number-pad"
        maxLength={maxLength}
        style={[styles.input, error ? styles.inputError : null]}
        returnKeyType="done"
      />
    </View>
  );
  return (
    <View style={{ gap: spacing.sm }}>
      <View style={styles.row}>
        {field('day', 'Day', 'DD', 2, 1)}
        {field('month', 'Month', 'MM', 2, 1)}
        {field('year', 'Year', 'YYYY', 4, 1.5)}
      </View>
      {error ? (
        <Text variant="caption" tone="danger" accessibilityLiveRegion="polite">
          {error}
        </Text>
      ) : null}
    </View>
  );
}

export const inputStyle = {
  minHeight: touchTarget + 4,
  borderRadius: radius.md,
  borderWidth: 1,
  borderColor: colors.borderStrong,
  backgroundColor: colors.surface,
  color: colors.text,
  paddingHorizontal: spacing.lg,
  fontSize: 17,
};

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.md },
  input: { ...inputStyle, textAlign: 'center' },
  inputError: { borderColor: colors.danger },
});
