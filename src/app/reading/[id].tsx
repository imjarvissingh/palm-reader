import { Ionicons } from '@expo/vector-icons';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import Svg, { G, Path } from 'react-native-svg';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { HAND_PATH, LINE_PATHS, PalmDiagram } from '@/components/PalmDiagram';
import { Screen } from '@/components/Screen';
import { Text } from '@/components/Text';
import { Disclaimer, EmptyState, Expandable, Eyebrow, Row, ScoreBar, SectionHeader } from '@/components/ui';
import { getSign } from '@/features/horoscope/zodiac';
import { reportShareText, traitLabel } from '@/features/palm/engine';
import { LINE_INFO } from '@/features/palm/questions';
import type { LineId } from '@/features/palm/types';
import { confirmDestructive } from '@/lib/confirm';
import { formatLongDate } from '@/lib/date';
import { shareText } from '@/lib/share';
import { useApp } from '@/state/AppState';
import { colors, radius, spacing } from '@/theme/tokens';

const THEME_ICONS = { personality: 'person-outline', relationships: 'heart-outline', career: 'briefcase-outline', growth: 'leaf-outline' } as const;

export default function ReadingScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { state, dispatch, deleteReading } = useApp();
  const report = state.readings.find((r) => r.id === id);

  if (!report) {
    return (
      <Screen edgeTop={false}>
        <EmptyState icon="search-outline" title="Reading not found" body="It may have been deleted." action={<Button label="Start a new reading" onPress={() => router.replace('/palm/start')} />} />
      </Screen>
    );
  }

  const remove = async () => {
    if (await confirmDestructive('Delete this reading?', 'The reading and its palm photo will be removed from this device.')) {
      deleteReading(report.id);
      router.back();
    }
  };

  const mirrored = report.hand === 'left';

  return (
    <Screen edgeTop={false} testID="reading">
      <Stack.Screen
        options={{
          headerRight: () => (
            <Row gap={spacing.xs}>
              <Pressable accessibilityRole="button" accessibilityLabel={report.favorite ? 'Remove from favourites' : 'Add to favourites'} onPress={() => dispatch({ type: 'toggleReadingFavorite', id: report.id })} style={styles.headerBtn}>
                <Ionicons name={report.favorite ? 'star' : 'star-outline'} size={22} color={colors.gold} />
              </Pressable>
              <Pressable accessibilityRole="button" accessibilityLabel="Share reading" onPress={() => void shareText(reportShareText(report), 'My palm reading')} style={styles.headerBtn}>
                <Ionicons name="share-outline" size={22} color={colors.text} />
              </Pressable>
            </Row>
          ),
        }}
      />

      <View style={{ gap: spacing.xs }}>
        <Eyebrow>{`${report.hand} hand · ${formatLongDate(new Date(report.createdAt))}`}</Eyebrow>
        <Text variant="title">{report.name ? `${report.name}’s palm reading` : 'Your palm reading'}</Text>
        <Row gap={spacing.sm}>
          <Badge icon="list-outline" label={report.method === 'questionnaire' ? 'Based on your answers' : 'Answers + photo assist'} />
          {report.signId ? <Badge icon="planet-outline" label={getSign(report.signId).name} /> : null}
        </Row>
      </View>

      {report.photoUri ? (
        <View style={styles.photoFrame}>
          <Image source={{ uri: report.photoUri }} style={StyleSheet.absoluteFill} resizeMode="cover" accessibilityLabel="Your palm photo" />
          <View style={styles.photoOverlay} pointerEvents="none">
            <Svg width="80%" height="80%" viewBox="0 0 200 260">
              <G transform={mirrored ? 'translate(200,0) scale(-1,1)' : undefined} opacity={0.85}>
                <Path d={HAND_PATH} fill="none" stroke={colors.gold} strokeWidth={1.2} strokeDasharray="5 5" />
                {(Object.keys(LINE_PATHS) as LineId[]).map((l) => LINE_PATHS[l].map((d, i) => <Path key={`${l}${i}`} d={d} stroke={colors.line[l]} strokeWidth={2.4} fill="none" strokeLinecap="round" />))}
              </G>
            </Svg>
          </View>
          <View style={styles.photoCaption}>
            <Text variant="caption">Illustrative guide — where each line usually sits. Not traced from your photo.</Text>
          </View>
        </View>
      ) : (
        <View style={styles.diagram}>
          <PalmDiagram size={180} showLabels mirrored={mirrored} />
        </View>
      )}

      <Card glow>
        <Eyebrow>Summary</Eyebrow>
        <Text>{report.summary}</Text>
        {report.topTraits.length ? (
          <View style={styles.traits}>
            {report.topTraits.map((t) => (
              <View key={t} style={styles.trait}>
                <Text variant="caption" tone="gold">
                  {traitLabel(t)}
                </Text>
              </View>
            ))}
          </View>
        ) : null}
      </Card>

      <SectionHeader title="The seven lines" />
      {report.lines.map((line, i) => (
        <Expandable key={line.id} title={line.title} subtitle={line.headline} accent={colors.line[line.id]} initiallyOpen={i === 0}>
          {line.answered > 0 ? <ScoreBar label="How pronounced" value={line.strength} color={colors.line[line.id]} /> : null}
          {line.paragraphs.map((p) => (
            <Text key={p} variant="bodySmall">
              {p}
            </Text>
          ))}
          <Text variant="caption" tone="subtle">
            Where to find it: {LINE_INFO[line.id].where}
          </Text>
        </Expandable>
      ))}

      <SectionHeader title="Themes" />
      {report.themes.map((t) => (
        <Card key={t.id}>
          <Row>
            <Ionicons name={THEME_ICONS[t.id]} size={22} color={colors.accent} />
            <Text variant="subheading">{t.title}</Text>
          </Row>
          <Text variant="bodySmall" tone="muted">
            {t.text}
          </Text>
        </Card>
      ))}

      <Button label="Share this reading" variant="secondary" onPress={() => void shareText(reportShareText(report), 'My palm reading')} icon={<Ionicons name="share-outline" size={18} color={colors.text} />} />
      <Button label="Delete reading" variant="danger" onPress={remove} />
      <Disclaimer />
    </Screen>
  );
}

function Badge({ icon, label }: { icon: React.ComponentProps<typeof Ionicons>['name']; label: string }) {
  return (
    <View style={styles.badge}>
      <Ionicons name={icon} size={14} color={colors.accent} />
      <Text variant="caption" tone="accent">
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  headerBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  photoFrame: { width: '100%', aspectRatio: 3 / 4, borderRadius: radius.lg, overflow: 'hidden', borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
  photoOverlay: { ...StyleSheet.absoluteFill, alignItems: 'center', justifyContent: 'center' },
  photoCaption: { position: 'absolute', left: 0, right: 0, bottom: 0, padding: spacing.sm, backgroundColor: colors.overlay },
  diagram: { alignItems: 'center' },
  traits: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  trait: { paddingHorizontal: spacing.md, paddingVertical: 6, borderRadius: radius.pill, backgroundColor: 'rgba(232,199,122,0.12)', borderWidth: 1, borderColor: 'rgba(232,199,122,0.35)' },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: spacing.sm, paddingVertical: 4, borderRadius: radius.pill, backgroundColor: 'rgba(201,168,255,0.12)' },
});
