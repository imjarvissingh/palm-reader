import { Ionicons } from '@expo/vector-icons';
import { router, useNavigation } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { Alert, BackHandler, Image, StyleSheet, View } from 'react-native';
import { Button } from '@/components/Button';
import { PalmDiagram } from '@/components/PalmDiagram';
import { Screen } from '@/components/Screen';
import { Text } from '@/components/Text';
import { Eyebrow, OptionRow, Row } from '@/components/ui';
import { analyzePalmPhoto, getAnalysisEndpoint } from '@/features/palm/analyzer';
import { LINE_INFO, questionsForStep, STEPS, UNSURE } from '@/features/palm/questions';
import { usePalmDraft } from '@/state/palmDraft';
import { colors, radius, spacing } from '@/theme/tokens';

export default function Questions() {
  const { draft, update } = usePalmDraft();
  const navigation = useNavigation();
  const [index, setIndex] = useState(0);
  const [analyzing, setAnalyzing] = useState(false);
  const step = STEPS[index] ?? 'hand';
  const questions = useMemo(() => questionsForStep(step, draft.answers), [step, draft.answers]);
  const endpoint = getAnalysisEndpoint();

  // Started without choosing a hand (e.g. deep link): go back to the start.
  useEffect(() => {
    if (!draft.hand) router.replace('/palm/start');
  }, [draft.hand]);

  useEffect(() => {
    navigation.setOptions({ title: `Step ${index + 1} of ${STEPS.length}` });
  }, [index, navigation]);

  // Android back steps through the questionnaire.
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (index > 0) {
        setIndex((i) => i - 1);
        return true;
      }
      return false;
    });
    return () => sub.remove();
  }, [index]);

  const answer = (qid: string, optionId: string) => update({ answers: { ...draft.answers, [qid]: optionId } });

  const isLast = index === STEPS.length - 1;
  const next = () => (isLast ? router.replace('/palm/generating') : setIndex(index + 1));

  const runAnalysis = () => {
    if (!endpoint || !draft.photoUri || !draft.hand) return;
    Alert.alert(
      'Upload photo for analysis?',
      'Your palm photo will be sent to the analysis service configured for this app to pre-fill your answers. You can review every answer afterwards.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Upload',
          onPress: async () => {
            setAnalyzing(true);
            try {
              const res = await analyzePalmPhoto(draft.photoUri!, draft.hand!, { endpoint });
              update({ answers: { ...draft.answers, ...res.answers }, photoAssisted: Object.keys(res.answers).length > 0 });
            } catch {
              Alert.alert('Analysis unavailable', 'The service could not analyse this photo. You can answer the questions yourself.');
            } finally {
              setAnalyzing(false);
            }
          },
        },
      ],
    );
  };

  const info = step === 'hand' ? null : LINE_INFO[step];
  const accent = step === 'hand' ? colors.accent : colors.line[step];

  return (
    <Screen
      edgeTop={false}
      testID={`questions-${step}`}
      footer={
        <View style={styles.footerRow}>
          <Button variant="secondary" label="Back" onPress={() => (index > 0 ? setIndex(index - 1) : router.back())} style={{ flex: 1 }} />
          <Button testID="questions-next" label={isLast ? 'See my reading' : 'Next'} onPress={next} style={{ flex: 2 }} />
        </View>
      }
    >
      <View style={styles.progress} accessible accessibilityLabel={`Step ${index + 1} of ${STEPS.length}`}>
        <View style={[styles.progressFill, { width: `${((index + 1) / STEPS.length) * 100}%` }]} />
      </View>

      <Row style={{ alignItems: 'flex-start' }}>
        <View style={{ flex: 1, gap: spacing.xs }}>
          <Eyebrow>{step === 'hand' ? 'Hand shape' : (info?.alias ?? 'Palm line')}</Eyebrow>
          <Text variant="title" style={{ color: accent }}>
            {step === 'hand' ? 'Your hand' : info?.title}
          </Text>
          <Text variant="bodySmall" tone="muted">
            {step === 'hand' ? 'The overall shape sets the tone for the whole reading.' : info?.where}
          </Text>
        </View>
        {draft.photoUri ? (
          <Image source={{ uri: draft.photoUri }} style={styles.photo} accessibilityLabel="Your palm photo for reference" />
        ) : null}
      </Row>

      <View style={styles.diagram}>
        <PalmDiagram size={150} highlight={step === 'hand' ? null : step} mirrored={draft.hand === 'left'} />
        {info ? (
          <Text variant="caption" tone="muted" center style={{ maxWidth: 280 }}>
            {info.represents}
          </Text>
        ) : null}
      </View>

      {index === 0 && endpoint && draft.photoUri ? (
        <Button variant="secondary" label="Pre-fill answers from my photo" loading={analyzing} onPress={runAnalysis} icon={<Ionicons name="scan" size={18} color={colors.accent} />} />
      ) : null}
      {draft.photoAssisted ? (
        <Text variant="caption" tone="accent">
          Some answers were pre-filled from photo analysis. Check each one against your palm.
        </Text>
      ) : null}

      {questions.map((q) => (
        <View key={q.id} style={{ gap: spacing.sm }} accessibilityRole="radiogroup" accessibilityLabel={q.prompt}>
          <Text variant="subheading">{q.prompt}</Text>
          {q.help ? (
            <Text variant="caption" tone="muted">
              {q.help}
            </Text>
          ) : null}
          {q.options.map((o) => (
            <OptionRow
              key={o.id}
              testID={`opt-${q.id}-${o.id}`}
              label={o.label}
              hint={o.id === UNSURE ? undefined : o.hint}
              selected={draft.answers[q.id] === o.id}
              onPress={() => answer(q.id, o.id)}
            />
          ))}
        </View>
      ))}
      <Text variant="caption" tone="subtle" center>
        Skip anything you are unsure about — the report will say what it could not read.
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  footerRow: { flexDirection: 'row', gap: spacing.sm },
  progress: { height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.1)', overflow: 'hidden' },
  progressFill: { height: 4, backgroundColor: colors.gold },
  photo: { width: 72, height: 96, borderRadius: radius.sm, borderWidth: 1, borderColor: colors.border },
  diagram: { alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.sm },
});
