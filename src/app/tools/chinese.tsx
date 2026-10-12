import { router } from 'expo-router';
import React from 'react';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Screen } from '@/components/Screen';
import { Text } from '@/components/Text';
import { Disclaimer, Eyebrow } from '@/components/ui';
import { ANIMALS, chineseSign } from '@/features/astro/chinese';
import { parseISODate } from '@/lib/date';
import { useApp } from '@/state/AppState';

export default function Chinese() {
  const { state } = useApp();
  const birth = parseISODate(state.profile.birthDate);
  const sign = birth ? chineseSign(birth) : null;

  return (
    <Screen edgeTop={false} testID="chinese">
      {sign ? (
        <Card glow>
          <Eyebrow>{`Born ${birth!.year}`}</Eyebrow>
          <Text variant="title" tone="gold">
            {sign.element} {sign.animal.name}
          </Text>
          <Text>{sign.animal.traits}</Text>
          {sign.previousIfBeforeNewYear ? (
            <Text variant="caption" tone="muted">
              Lunar New Year falls between January 21 and February 20. If you were born before it that year, your sign is the {sign.previousIfBeforeNewYear.element} {sign.previousIfBeforeNewYear.animal.name}.
            </Text>
          ) : null}
        </Card>
      ) : (
        <Card>
          <Text variant="subheading">Add your birth date</Text>
          <Text variant="bodySmall" tone="muted">
            Your Chinese zodiac animal comes from your birth year.
          </Text>
          <Button variant="secondary" label="Add birth date" onPress={() => router.push('/edit-profile')} />
        </Card>
      )}
      <Eyebrow>The twelve animals</Eyebrow>
      {ANIMALS.map((a) => (
        <Text key={a.name} variant="bodySmall">
          <Text variant="bodySmall" style={{ fontWeight: '700' }}>
            {a.name}
          </Text>
          {`  ${a.traits}`}
        </Text>
      ))}
      <Disclaimer compact />
    </Screen>
  );
}
