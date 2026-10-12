import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Screen } from '@/components/Screen';
import { Text } from '@/components/Text';
import { Disclaimer, Dots, Eyebrow, Row, Segmented, ZodiacBadge } from '@/components/ui';
import { generateHoroscope, horoscopeShareText, PERIODS, type HoroscopePeriod } from '@/features/horoscope/generator';
import { getSign, SIGNS, type ZodiacId } from '@/features/horoscope/zodiac';
import { shareText } from '@/lib/share';
import { useApp } from '@/state/AppState';
import { profileSign } from '@/state/selectors';
import { colors, gradients, radius, spacing } from '@/theme/tokens';

const SECTION_ICONS = { love: 'heart', career: 'briefcase', growth: 'leaf', wellbeing: 'fitness' } as const;

export default function HoroscopeTab() {
  const { state, dispatch } = useApp();
  const mine = profileSign(state.profile);
  const [signId, setSignId] = useState<ZodiacId>(mine ?? state.favoriteSigns[0] ?? 'aries');
  const [period, setPeriod] = useState<HoroscopePeriod>('today');
  const h = useMemo(() => generateHoroscope(signId, period, new Date()), [signId, period]);
  const sign = getSign(signId);
  const isFav = state.favoriteSigns.includes(signId);

  // Your sign first, then favourites, then the rest.
  const ordered = useMemo(() => {
    const first = [mine, ...state.favoriteSigns].filter((x): x is ZodiacId => !!x);
    const uniq = Array.from(new Set(first));
    return [...uniq, ...SIGNS.map((s) => s.id).filter((id) => !uniq.includes(id))];
  }, [mine, state.favoriteSigns]);

  return (
    <Screen testID="horoscope">
      <Text variant="title" accessibilityRole="header">
        Horoscope
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.signs} accessibilityRole="tablist">
        {ordered.map((id) => (
          <Pressable
            key={id}
            testID={`horo-sign-${id}`}
            accessibilityRole="tab"
            accessibilityState={{ selected: id === signId }}
            accessibilityLabel={`${getSign(id).name}${id === mine ? ', your sign' : ''}${state.favoriteSigns.includes(id) ? ', favourite' : ''}`}
            onPress={() => setSignId(id)}
            style={styles.signItem}
          >
            <ZodiacBadge signId={id} size={50} selected={id === signId} />
            <Text variant="caption" tone={id === signId ? 'gold' : 'muted'}>
              {getSign(id).name}
            </Text>
            {id === mine ? <View style={styles.mineDot} /> : null}
          </Pressable>
        ))}
      </ScrollView>

      <Segmented items={PERIODS} value={period} onChange={setPeriod} />

      <View style={styles.hero}>
        <LinearGradient colors={gradients.hero} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
        <View style={styles.heroInner}>
          <Row>
            <View style={{ flex: 1, gap: 4 }}>
              <Eyebrow>{`${sign.name} · ${h.rangeLabel}`}</Eyebrow>
              <Text variant="title">{h.headline}</Text>
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={isFav ? `Remove ${sign.name} from favourites` : `Add ${sign.name} to favourites`}
              onPress={() => dispatch({ type: 'toggleFavoriteSign', signId })}
              style={styles.iconBtn}
            >
              <Ionicons name={isFav ? 'star' : 'star-outline'} size={24} color={colors.gold} />
            </Pressable>
          </Row>
          <Text>{h.overview}</Text>
          <View style={styles.stats}>
            <Stat label="Mood" value={h.mood} />
            <Stat label="Lucky no." value={String(h.luckyNumber)} />
            <Stat label="Colour" value={h.luckyColor} />
            <Stat label="Focus" value={h.focusWord} />
          </View>
        </View>
      </View>

      {h.sections.map((s) => (
        <Card key={s.id}>
          <Row>
            <Ionicons name={SECTION_ICONS[s.id]} size={20} color={colors.accent} />
            <Text variant="subheading" style={{ flex: 1 }}>
              {s.title}
            </Text>
            <Dots score={s.score} label={`${s.title} outlook`} />
          </Row>
          <Text variant="bodySmall" tone="muted">
            {s.text}
          </Text>
        </Card>
      ))}

      <Card onPress={() => router.push({ pathname: '/tools/compatibility', params: { a: signId, b: h.bestMatch } })} accessibilityLabel={`Best match: ${getSign(h.bestMatch).name}. Open compatibility`}>
        <Row>
          <ZodiacBadge signId={h.bestMatch} size={44} />
          <View style={{ flex: 1 }}>
            <Eyebrow>Best match</Eyebrow>
            <Text variant="subheading">{getSign(h.bestMatch).name}</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.textSubtle} />
        </Row>
      </Card>

      <Row gap={spacing.sm}>
        <Button variant="secondary" label="Share" style={{ flex: 1 }} onPress={() => void shareText(horoscopeShareText(h), `${sign.name} horoscope`)} icon={<Ionicons name="share-outline" size={18} color={colors.text} />} />
        <Button variant="secondary" label={`About ${sign.name}`} style={{ flex: 1 }} onPress={() => router.push(`/sign/${signId}`)} />
      </Row>
      <Text variant="caption" tone="subtle">
        Horoscopes in Lunara are original, generated writing seeded by sign and date, with the real moon phase for daily readings. They are not calculated from planetary positions.
      </Text>
      <Disclaimer compact />
    </Screen>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.stat}>
      <Text variant="caption" tone="muted">
        {label}
      </Text>
      <Text variant="bodySmall" style={{ fontWeight: '700' }} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  signs: { gap: spacing.md, paddingVertical: spacing.xs },
  signItem: { alignItems: 'center', gap: 4, minWidth: 64 },
  mineDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: colors.gold },
  hero: { borderRadius: radius.xl, overflow: 'hidden', borderWidth: 1, borderColor: colors.borderStrong },
  heroInner: { padding: spacing.xl, gap: spacing.md },
  iconBtn: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center' },
  stats: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  stat: { flexGrow: 1, flexBasis: '45%', padding: spacing.sm, borderRadius: radius.md, backgroundColor: 'rgba(11,8,32,0.35)' },
});
