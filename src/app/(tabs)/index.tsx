import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { PalmDiagram } from '@/components/PalmDiagram';
import { Screen } from '@/components/Screen';
import { Text } from '@/components/Text';
import { Disclaimer, Eyebrow, IconCircle, Row, SectionHeader, ZodiacBadge } from '@/components/ui';
import { getMoonPhase } from '@/features/astro/moon';
import { generateHoroscope } from '@/features/horoscope/generator';
import { getSign } from '@/features/horoscope/zodiac';
import { LINE_INFO, LINE_ORDER } from '@/features/palm/questions';
import { formatLongDate } from '@/lib/date';
import { useApp } from '@/state/AppState';
import { greeting, profileSign } from '@/state/selectors';
import { colors, gradients, radius, spacing } from '@/theme/tokens';

const TOOLS = [
  { href: '/tools/compatibility', icon: 'heart-outline', title: 'Compatibility' },
  { href: '/tools/numerology', icon: 'keypad-outline', title: 'Numerology' },
  { href: '/tools/moon', icon: 'moon-outline', title: 'Moon calendar' },
  { href: '/tools/dreams', icon: 'cloudy-night-outline', title: 'Dreams' },
] as const;

export default function Home() {
  const { state } = useApp();
  const signId = profileSign(state.profile);
  const today = useMemo(() => new Date(), []);
  const horoscope = useMemo(() => (signId ? generateHoroscope(signId, 'today', today) : null), [signId, today]);
  const moon = getMoonPhase(today);
  const recent = state.readings.slice(0, 3);
  const name = state.profile.name;

  return (
    <Screen testID="home">
      <View style={{ gap: 4 }}>
        <Text variant="caption" tone="muted">
          {formatLongDate(today)}
        </Text>
        <Text variant="title" accessibilityRole="header">
          {greeting(today)}
          {name ? `, ${name}` : ''}
        </Text>
      </View>

      {/* Daily horoscope preview */}
      {horoscope && signId ? (
        <Card glow onPress={() => router.push('/(tabs)/horoscope')} accessibilityLabel={`Today's ${getSign(signId).name} horoscope: ${horoscope.headline}`} testID="home-horoscope">
          <Row>
            <ZodiacBadge signId={signId} size={52} />
            <View style={{ flex: 1 }}>
              <Eyebrow>{`${getSign(signId).name} · today`}</Eyebrow>
              <Text variant="heading">{horoscope.headline}</Text>
            </View>
          </Row>
          <Text tone="muted" numberOfLines={4}>
            {horoscope.overview}
          </Text>
          <Row>
            <Pill label={`Mood · ${horoscope.mood}`} />
            <Pill label={`Lucky ${horoscope.luckyNumber}`} />
            <Pill label={horoscope.luckyColor} />
          </Row>
        </Card>
      ) : (
        <Card onPress={() => router.push('/edit-profile')} accessibilityLabel="Add your sign to personalise your daily horoscope">
          <Text variant="heading">Personalise your stars</Text>
          <Text tone="muted">Add your birth date or pick your sign to see your daily horoscope here.</Text>
        </Card>
      )}

      {/* Palm scan CTA */}
      <View style={styles.palmCta}>
        <LinearGradient colors={gradients.hero} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
        <View style={styles.palmCtaInner}>
          <View style={{ flex: 1, gap: spacing.sm }}>
            <Eyebrow>Palm reading</Eyebrow>
            <Text variant="heading">What do your lines say?</Text>
            <Text variant="bodySmall" tone="muted">
              A guided reading of all seven major lines in about three minutes.
            </Text>
          </View>
          <PalmDiagram size={92} />
        </View>
        <Button testID="home-start-reading" label="Start a palm reading" onPress={() => router.push('/palm/start')} style={{ marginHorizontal: spacing.lg, marginBottom: spacing.lg }} />
      </View>

      <SectionHeader title="The seven lines" action="Learn" onAction={() => router.push('/learn/major-lines')} />
      <View style={styles.lineGrid}>
        {LINE_ORDER.map((id) => (
          <View key={id} style={styles.lineChip} accessible accessibilityLabel={`${LINE_INFO[id].title}: ${LINE_INFO[id].represents}`}>
            <View style={[styles.lineDot, { backgroundColor: colors.line[id] }]} />
            <Text variant="bodySmall">{LINE_INFO[id].title}</Text>
          </View>
        ))}
      </View>

      <SectionHeader title="Tonight's Moon" action="Calendar" onAction={() => router.push('/tools/moon')} />
      <Card onPress={() => router.push('/tools/moon')} accessibilityLabel={`${moon.name}, ${Math.round(moon.illumination * 100)} percent illuminated`}>
        <Row>
          <Text style={{ fontSize: 40, lineHeight: 48 }}>{moon.emoji}</Text>
          <View style={{ flex: 1 }}>
            <Text variant="subheading">{moon.name}</Text>
            <Text variant="caption" tone="muted">
              {Math.round(moon.illumination * 100)}% illuminated · day {Math.floor(moon.age) + 1} of the cycle
            </Text>
          </View>
        </Row>
        <Text variant="bodySmall" tone="muted">
          {moon.guidance}
        </Text>
      </Card>

      <SectionHeader title="Astrology tools" action="See all" onAction={() => router.push('/(tabs)/explore')} />
      <View style={styles.toolGrid}>
        {TOOLS.map((t) => (
          <Pressable key={t.href} accessibilityRole="button" accessibilityLabel={t.title} onPress={() => router.push(t.href)} style={({ pressed }) => [styles.tool, pressed && { opacity: 0.8 }]}>
            <IconCircle name={t.icon} />
            <Text variant="bodySmall" center>
              {t.title}
            </Text>
          </Pressable>
        ))}
      </View>

      <SectionHeader title="Recent readings" action={state.readings.length ? 'History' : undefined} onAction={() => router.push('/history')} />
      {recent.length ? (
        recent.map((r) => (
          <Card key={r.id} onPress={() => router.push(`/reading/${r.id}`)} accessibilityLabel={`Reading from ${formatLongDate(new Date(r.createdAt))}`}>
            <Row>
              <Ionicons name="hand-left" size={22} color={colors.gold} />
              <View style={{ flex: 1 }}>
                <Text variant="subheading">{cap(r.hand)} hand reading</Text>
                <Text variant="caption" tone="muted">
                  {formatLongDate(new Date(r.createdAt))}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textSubtle} />
            </Row>
          </Card>
        ))
      ) : (
        <Text tone="muted" variant="bodySmall">
          Your readings will appear here.
        </Text>
      )}

      <Disclaimer compact />
    </Screen>
  );
}

function Pill({ label }: { label: string }) {
  return (
    <View style={styles.pill}>
      <Text variant="caption" tone="gold">
        {label}
      </Text>
    </View>
  );
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const styles = StyleSheet.create({
  palmCta: { borderRadius: radius.xl, overflow: 'hidden', borderWidth: 1, borderColor: colors.borderStrong },
  palmCtaInner: { flexDirection: 'row', alignItems: 'center', padding: spacing.lg, gap: spacing.md },
  lineGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  lineChip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: radius.pill, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  lineDot: { width: 8, height: 8, borderRadius: 4 },
  toolGrid: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.sm },
  tool: { flex: 1, alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.md, borderRadius: radius.lg, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, minHeight: 96 },
  pill: { paddingHorizontal: spacing.sm, paddingVertical: 4, borderRadius: radius.pill, backgroundColor: 'rgba(232,199,122,0.12)' },
});
