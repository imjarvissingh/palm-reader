import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Screen } from '@/components/Screen';
import { Text } from '@/components/Text';
import { Eyebrow, Row } from '@/components/ui';
import { getEntitlements } from '@/features/premium/entitlements';
import { colors, spacing } from '@/theme/tokens';

const INCLUDED = [
  'Unlimited palm readings for both hands',
  'Full seven-line reports with themes',
  'Daily, weekly and monthly horoscopes for every sign',
  'Compatibility, numerology, moon calendar, dreams and Vedic basics',
  'No ads, no account, no tracking',
];

export default function Premium() {
  const ent = getEntitlements();
  return (
    <Screen edgeTop={false} testID="premium">
      <View style={{ alignItems: 'center', gap: spacing.sm }}>
        <Ionicons name="sparkles" size={40} color={colors.gold} />
        <Text variant="title" center>
          Everything is free right now
        </Text>
        <Text tone="muted" center>
          Lunara Plus is not on sale yet. Every feature in this version is unlocked for everyone.
        </Text>
      </View>
      <Card glow>
        <Eyebrow>Included today</Eyebrow>
        {INCLUDED.map((t) => (
          <Row key={t} gap={spacing.sm}>
            <Ionicons name="checkmark-circle" size={18} color={colors.success} />
            <Text variant="bodySmall" style={{ flex: 1 }}>
              {t}
            </Text>
          </Row>
        ))}
      </Card>
      <Text variant="caption" tone="subtle" center>
        {ent.purchasesAvailable ? '' : 'In-app purchases are not configured in this build, so there is nothing to buy or restore.'}
      </Text>
      <Button label="Got it" onPress={() => router.back()} />
    </Screen>
  );
}
