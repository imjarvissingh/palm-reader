import { router } from 'expo-router';
import React from 'react';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Screen } from '@/components/Screen';
import { Text } from '@/components/Text';
import { Disclaimer, Expandable, Eyebrow, SectionHeader } from '@/components/ui';
import { vedicSun, VEDIC_TOPICS } from '@/features/astro/vedic';
import { getZodiacSign } from '@/features/horoscope/zodiac';
import { parseISODate } from '@/lib/date';
import { useApp } from '@/state/AppState';

export default function Vedic() {
  const { state } = useApp();
  const birth = parseISODate(state.profile.birthDate);
  const sun = birth ? vedicSun(birth) : null;
  const western = birth ? getZodiacSign(birth).sign : null;

  return (
    <Screen edgeTop={false} testID="vedic">
      {sun && western ? (
        <Card glow>
          <Eyebrow>Your sidereal Sun</Eyebrow>
          <Text variant="title" tone="gold">
            {sun.rashi.name}
          </Text>
          <Text>
            {sun.rashi.western} in Vedic terms, ruled by {sun.rashi.ruler}. Your Western (tropical) Sun sign is {western.name}.
          </Text>
          <Text variant="bodySmall" tone="muted">
            Sun nakshatra: {sun.nakshatra}, pada {sun.pada} · {sun.siderealLongitude.toFixed(1)}° sidereal
          </Text>
          {sun.nearBoundary ? (
            <Text variant="caption" tone="gold">
              The Sun was close to a sign boundary on your birthday, so your exact birth time could change this result.
            </Text>
          ) : null}
          <Text variant="caption" tone="subtle">
            Calculated with the Lahiri ayanamsa and a low-precision solar formula. Your Moon sign and ascendant need birth time and place, which Lunara does not collect.
          </Text>
        </Card>
      ) : (
        <Card>
          <Text variant="subheading">Add your birth date</Text>
          <Text variant="bodySmall" tone="muted">
            Your sidereal Sun sign and nakshatra are calculated from your date of birth.
          </Text>
          <Button variant="secondary" label="Add birth date" onPress={() => router.push('/edit-profile')} />
        </Card>
      )}

      <SectionHeader title="Jyotish basics" />
      {VEDIC_TOPICS.map((t, i) => (
        <Expandable key={t.title} title={t.title} initiallyOpen={i === 0}>
          <Text variant="bodySmall">{t.body}</Text>
        </Expandable>
      ))}
      <Disclaimer compact />
    </Screen>
  );
}
