import React, { useMemo, useState } from 'react';
import { TextInput } from 'react-native';
import { inputStyle } from '@/components/BirthDateFields';
import { Screen } from '@/components/Screen';
import { Text } from '@/components/Text';
import { Disclaimer, EmptyState, Expandable } from '@/components/ui';
import { searchDreams } from '@/features/astro/dreams';
import { colors } from '@/theme/tokens';

export default function Dreams() {
  const [q, setQ] = useState('');
  const results = useMemo(() => searchDreams(q), [q]);
  return (
    <Screen edgeTop={false} testID="dreams">
      <TextInput
        accessibilityLabel="Search dream symbols"
        value={q}
        onChangeText={setQ}
        placeholder="Search: water, falling, teeth…"
        placeholderTextColor={colors.textSubtle}
        style={inputStyle}
        autoCorrect={false}
        clearButtonMode="while-editing"
      />
      <Text variant="caption" tone="muted" accessibilityLiveRegion="polite">
        {results.length} symbol{results.length === 1 ? '' : 's'}
      </Text>
      {results.length === 0 ? (
        <EmptyState icon="cloudy-night-outline" title="No match" body="Try a simpler word, like the main object or action in your dream." />
      ) : (
        results.map((d) => (
          <Expandable key={d.id} title={d.name} subtitle={d.category}>
            <Text variant="bodySmall">{d.meaning}</Text>
            <Text variant="bodySmall" tone="gold">
              Reflect: {d.ask}
            </Text>
          </Expandable>
        ))
      )}
      <Disclaimer compact />
    </Screen>
  );
}
