import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Screen } from '@/components/Screen';
import { Text } from '@/components/Text';
import { Disclaimer, Eyebrow, Row, ScoreBar, Segmented, SignGrid, ZodiacBadge } from '@/components/ui';
import { compatibilityScore } from '@/features/astro/compatibility';
import { getSign, isZodiacId, type ZodiacId } from '@/features/horoscope/zodiac';
import { shareText } from '@/lib/share';
import { useApp } from '@/state/AppState';
import { profileSign } from '@/state/selectors';
import { colors, spacing } from '@/theme/tokens';

export default function Compatibility() {
  const params = useLocalSearchParams<{ a?: string; b?: string }>();
  const { state } = useApp();
  const [a, setA] = useState<ZodiacId>(isZodiacId(params.a) ? params.a : (profileSign(state.profile) ?? 'leo'));
  const [b, setB] = useState<ZodiacId>(isZodiacId(params.b) ? params.b : 'libra');
  const [editing, setEditing] = useState<'a' | 'b'>('b');
  const r = useMemo(() => compatibilityScore(a, b), [a, b]);

  return (
    <Screen edgeTop={false} testID="compatibility">
      <Row style={styles.pair}>
        <SignSlot id={a} label="You" active={editing === 'a'} onPress={() => setEditing('a')} />
        <Ionicons name="heart" size={28} color={colors.line.heart} />
        <SignSlot id={b} label="Them" active={editing === 'b'} onPress={() => setEditing('b')} />
      </Row>
      <Segmented items={[{ id: 'a', label: `Change ${getSign(a).name}` }, { id: 'b', label: `Change ${getSign(b).name}` }]} value={editing} onChange={setEditing} />
      <SignGrid columns={6} value={editing === 'a' ? a : b} onChange={(id) => (editing === 'a' ? setA(id) : setB(id))} />

      <Card glow>
        <Eyebrow>{r.relation}</Eyebrow>
        <Text variant="display" tone="gold" accessibilityLabel={`Overall compatibility ${r.overall} percent`}>
          {r.overall}%
        </Text>
        <Text>{r.summary}</Text>
        <ScoreBar label="Love" value={r.love} color={colors.line.heart} />
        <ScoreBar label="Friendship" value={r.friendship} color={colors.line.life} />
        <ScoreBar label="Work" value={r.work} color={colors.line.head} />
      </Card>
      <Card>
        <Text variant="subheading">What works</Text>
        {r.strengths.map((s) => (
          <Bullet key={s} text={s} icon="checkmark-circle" color={colors.success} />
        ))}
        <Text variant="subheading" style={{ marginTop: spacing.sm }}>
          Watch for
        </Text>
        {r.watchFor.map((s) => (
          <Bullet key={s} text={s} icon="alert-circle" color={colors.warning} />
        ))}
      </Card>
      <Button
        variant="secondary"
        label="Share result"
        onPress={() => void shareText(`${getSign(a).name} + ${getSign(b).name}: ${r.overall}% compatible (love ${r.love}%, friendship ${r.friendship}%, work ${r.work}%). ${r.summary}\n— Lunara, for fun`)}
      />
      <Text variant="caption" tone="subtle">
        Scores come from classical sign relationships (element, modality and aspect). Real relationships depend on far more than Sun signs.
      </Text>
      <Disclaimer compact />
    </Screen>
  );
}

function SignSlot({ id, label, active, onPress }: { id: ZodiacId; label: string; active: boolean; onPress: () => void }) {
  return (
    <Card onPress={onPress} style={[styles.slot, active ? { borderColor: colors.gold } : {}]} accessibilityLabel={`${label}: ${getSign(id).name}. Tap to change`}>
      <View style={{ alignItems: 'center', gap: 4 }}>
        <ZodiacBadge signId={id} size={56} />
        <Text variant="caption" tone="muted">
          {label}
        </Text>
        <Text variant="subheading">{getSign(id).name}</Text>
      </View>
    </Card>
  );
}

function Bullet({ text, icon, color }: { text: string; icon: React.ComponentProps<typeof Ionicons>['name']; color: string }) {
  return (
    <Row gap={spacing.sm} style={{ alignItems: 'flex-start' }}>
      <Ionicons name={icon} size={18} color={color} />
      <Text variant="bodySmall" style={{ flex: 1 }}>
        {text}
      </Text>
    </Row>
  );
}

const styles = StyleSheet.create({
  pair: { justifyContent: 'space-between' },
  slot: { flex: 1 },
});
