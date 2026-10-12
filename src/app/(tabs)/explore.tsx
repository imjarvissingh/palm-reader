import { router, type Href } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card } from '@/components/Card';
import { Screen } from '@/components/Screen';
import { Text } from '@/components/Text';
import { IconCircle, Row, SectionHeader, ZodiacBadge } from '@/components/ui';
import { SIGNS } from '@/features/horoscope/zodiac';
import { spacing } from '@/theme/tokens';

const TOOLS: { href: Href; icon: React.ComponentProps<typeof IconCircle>['name']; title: string; body: string }[] = [
  { href: '/tools/compatibility', icon: 'heart-outline', title: 'Zodiac & love compatibility', body: 'Compare any two signs for love, friendship and work.' },
  { href: '/tools/numerology', icon: 'keypad-outline', title: 'Numerology', body: 'Life path, expression and personal year numbers.' },
  { href: '/tools/moon', icon: 'moon-outline', title: 'Moon calendar', body: 'Calculated phases for every day of the month.' },
  { href: '/tools/dreams', icon: 'cloudy-night-outline', title: 'Dream meanings', body: 'Search 40 common dream symbols.' },
  { href: '/tools/vedic', icon: 'flower-outline', title: 'Vedic astrology', body: 'Your sidereal Sun sign, nakshatra and the basics of Jyotish.' },
  { href: '/learn', icon: 'book-outline', title: 'Learn', body: 'Short guides to palmistry and astrology.' },
];

export default function Explore() {
  return (
    <Screen testID="explore">
      <Text variant="title" accessibilityRole="header">
        Explore
      </Text>
      {TOOLS.map((t) => (
        <Card key={t.title} onPress={() => router.push(t.href)} accessibilityLabel={`${t.title}. ${t.body}`}>
          <Row>
            <IconCircle name={t.icon} />
            <View style={{ flex: 1 }}>
              <Text variant="subheading">{t.title}</Text>
              <Text variant="bodySmall" tone="muted">
                {t.body}
              </Text>
            </View>
          </Row>
        </Card>
      ))}
      <SectionHeader title="The zodiac" />
      <View style={styles.grid}>
        {SIGNS.map((s) => (
          <Card key={s.id} onPress={() => router.push(`/sign/${s.id}`)} style={styles.cell} accessibilityLabel={s.name}>
            <View style={{ alignItems: 'center', gap: 4 }}>
              <ZodiacBadge signId={s.id} size={44} />
              <Text variant="caption">{s.name}</Text>
            </View>
          </Card>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  cell: { width: '31.5%' },
});
