import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { PalmDiagram } from '@/components/PalmDiagram';
import { ReadingCard } from '@/components/ReadingCard';
import { Screen } from '@/components/Screen';
import { Text } from '@/components/Text';
import { Disclaimer, Expandable, SectionHeader } from '@/components/ui';
import { LINE_INFO, LINE_ORDER } from '@/features/palm/questions';
import { confirmDestructive } from '@/lib/confirm';
import { useApp } from '@/state/AppState';
import { colors, spacing } from '@/theme/tokens';

export default function PalmTab() {
  const { state, dispatch, deleteReading } = useApp();

  return (
    <Screen testID="palm-tab">
      <Text variant="title" accessibilityRole="header">
        Palm reading
      </Text>
      <Card glow>
        <View style={styles.hero}>
          <PalmDiagram size={150} showLabels />
        </View>
        <Text variant="heading" center>
          Read all seven lines
        </Text>
        <Text tone="muted" center variant="bodySmall">
          Add a photo for reference (optional), answer guided questions about each line, and get a detailed report you can keep.
        </Text>
        <Button testID="palm-tab-start" label="Start a new reading" onPress={() => router.push('/palm/start')} />
      </Card>

      <SectionHeader title="Your readings" action={state.readings.length > 3 ? 'See all' : undefined} onAction={() => router.push('/history')} />
      {state.readings.length === 0 ? (
        <Text tone="muted" variant="bodySmall">
          No readings yet. They are saved privately on this device.
        </Text>
      ) : (
        state.readings.slice(0, 3).map((r) => (
          <ReadingCard
            key={r.id}
            r={r}
            onFavorite={() => dispatch({ type: 'toggleReadingFavorite', id: r.id })}
            onDelete={async () => {
              if (await confirmDestructive('Delete this reading?', 'The reading and its palm photo will be removed from this device.')) deleteReading(r.id);
            }}
          />
        ))
      )}

      <SectionHeader title="Line guide" />
      {LINE_ORDER.map((id) => (
        <Expandable key={id} title={LINE_INFO[id].title} subtitle={LINE_INFO[id].alias} accent={colors.line[id]}>
          <View style={styles.guideRow}>
            <PalmDiagram size={70} highlight={id} />
            <View style={{ flex: 1, gap: spacing.xs }}>
              <Text variant="bodySmall">{LINE_INFO[id].represents}</Text>
              <Text variant="caption" tone="muted">
                {LINE_INFO[id].where}
              </Text>
            </View>
          </View>
        </Expandable>
      ))}
      <Disclaimer />
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { alignItems: 'center' },
  guideRow: { flexDirection: 'row', gap: spacing.md, alignItems: 'center' },
});
