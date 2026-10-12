import React, { useMemo, useState } from 'react';
import { TextInput, View } from 'react-native';
import { BirthDateFields, fieldsFromISO, inputStyle, type BirthFields } from '@/components/BirthDateFields';
import { Card } from '@/components/Card';
import { Screen } from '@/components/Screen';
import { Text } from '@/components/Text';
import { Disclaimer, Eyebrow } from '@/components/ui';
import { expressionNumber, lifePathNumber, NUMBER_MEANINGS, PERSONAL_YEAR_THEMES, personalYearNumber } from '@/features/astro/numerology';
import { validateBirthInput } from '@/lib/date';
import { useApp } from '@/state/AppState';
import { colors, spacing } from '@/theme/tokens';

export default function Numerology() {
  const { state } = useApp();
  const [name, setName] = useState(state.profile.name);
  const [birth, setBirth] = useState<BirthFields>(fieldsFromISO(state.profile.birthDate));
  const result = useMemo(() => validateBirthInput(birth.day, birth.month, birth.year), [birth]);
  const year = new Date().getFullYear();
  const life = result.parts ? lifePathNumber(result.parts) : null;
  const personal = result.parts ? personalYearNumber(result.parts, year) : null;
  const expr = expressionNumber(name);

  return (
    <Screen edgeTop={false} testID="numerology">
      <Text tone="muted" variant="bodySmall">
        Numerology reduces your birth date and name to single numbers, each with a traditional theme.
      </Text>
      <View style={{ gap: 6 }}>
        <Text variant="caption" tone="muted">
          Full name (for your expression number)
        </Text>
        <TextInput accessibilityLabel="Full name" value={name} onChangeText={(t) => setName(t.slice(0, 80))} style={inputStyle} placeholder="e.g. Alex Morgan" placeholderTextColor={colors.textSubtle} />
      </View>
      <View style={{ gap: 6 }}>
        <Text variant="caption" tone="muted">
          Date of birth
        </Text>
        <BirthDateFields value={birth} onChange={setBirth} error={result.error} />
      </View>

      {life ? <NumberCard eyebrow="Life path" n={life} /> : <Text tone="subtle">Enter your birth date to see your life path number.</Text>}
      {expr ? <NumberCard eyebrow="Expression" n={expr} /> : null}
      {personal ? (
        <Card>
          <Eyebrow>{`Personal year ${year}`}</Eyebrow>
          <Text variant="display" tone="gold">
            {personal}
          </Text>
          <Text>{PERSONAL_YEAR_THEMES[personal]}</Text>
        </Card>
      ) : null}
      <View style={{ height: spacing.sm }} />
      <Disclaimer compact />
    </Screen>
  );
}

function NumberCard({ eyebrow, n }: { eyebrow: string; n: number }) {
  const m = NUMBER_MEANINGS[n];
  return (
    <Card glow>
      <Eyebrow>{eyebrow}</Eyebrow>
      <Text variant="display" tone="gold">
        {n}
      </Text>
      <Text variant="heading">{m?.title}</Text>
      <Text tone="muted">{m?.text}</Text>
    </Card>
  );
}
