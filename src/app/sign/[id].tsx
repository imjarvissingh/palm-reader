import { Ionicons } from '@expo/vector-icons';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Screen } from '@/components/Screen';
import { Text } from '@/components/Text';
import { EmptyState, Eyebrow, Row, ZodiacBadge } from '@/components/ui';
import { compatibilityScore } from '@/features/astro/compatibility';
import { ELEMENT_INFO, formatRange, getSign, isZodiacId, SIGNS } from '@/features/horoscope/zodiac';
import { useApp } from '@/state/AppState';
import { colors, spacing } from '@/theme/tokens';

export default function SignScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { state, dispatch } = useApp();
  if (!isZodiacId(id)) {
    return (
      <Screen edgeTop={false}>
        <EmptyState icon="planet-outline" title="Unknown sign" body="That zodiac sign does not exist." />
      </Screen>
    );
  }
  const s = getSign(id);
  const fav = state.favoriteSigns.includes(id);
  const best = SIGNS.filter((x) => x.id !== id)
    .map((x) => ({ x, score: compatibilityScore(id, x.id).overall }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  return (
    <Screen edgeTop={false} testID={`sign-${id}`}>
      <Stack.Screen options={{ title: s.name }} />
      <View style={{ alignItems: 'center', gap: spacing.sm }}>
        <ZodiacBadge signId={id} size={96} />
        <Text variant="title">{s.name}</Text>
        <Text tone="muted">{formatRange(s)}</Text>
      </View>
      <Text>{s.summary}</Text>
      <Card>
        <Row style={{ justifyContent: 'space-between' }}>
          <Fact label="Element" value={ELEMENT_INFO[s.element].label} />
          <Fact label="Modality" value={cap(s.modality)} />
          <Fact label="Ruler" value={cap(s.ruler)} />
        </Row>
        <Text variant="caption" tone="muted">
          {ELEMENT_INFO[s.element].label} signs are associated with {ELEMENT_INFO[s.element].theme}.
        </Text>
      </Card>
      <Card>
        <Eyebrow>Strengths</Eyebrow>
        {s.strengths.map((t) => (
          <Row key={t} gap={spacing.sm}>
            <Ionicons name="sparkles" size={14} color={colors.gold} />
            <Text variant="bodySmall">{t}</Text>
          </Row>
        ))}
        <Eyebrow>Growth edges</Eyebrow>
        {s.challenges.map((t) => (
          <Row key={t} gap={spacing.sm}>
            <Ionicons name="leaf-outline" size={14} color={colors.accent} />
            <Text variant="bodySmall">{t}</Text>
          </Row>
        ))}
      </Card>
      <Card>
        <Eyebrow>Most compatible</Eyebrow>
        {best.map(({ x, score }) => (
          <Row key={x.id}>
            <ZodiacBadge signId={x.id} size={36} />
            <Text style={{ flex: 1 }}>{x.name}</Text>
            <Text tone="gold">{score}%</Text>
          </Row>
        ))}
      </Card>
      <Button label={fav ? 'Remove from favourites' : 'Add to favourites'} variant="secondary" onPress={() => dispatch({ type: 'toggleFavoriteSign', signId: id })} />
      <Button label="Compare with another sign" onPress={() => router.push({ pathname: '/tools/compatibility', params: { a: id } })} />
    </Screen>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ flex: 1, gap: 2 }}>
      <Text variant="caption" tone="muted">
        {label}
      </Text>
      <Text variant="bodySmall" style={{ fontWeight: '700' }}>
        {value}
      </Text>
    </View>
  );
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
