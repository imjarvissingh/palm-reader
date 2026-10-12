import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, Easing, StyleSheet } from 'react-native';
import { Button } from '@/components/Button';
import { PalmDiagram } from '@/components/PalmDiagram';
import { Screen } from '@/components/Screen';
import { Text } from '@/components/Text';
import { generatePalmReport } from '@/features/palm/engine';
import { persistPhoto } from '@/features/palm/photoStore';
import { createId } from '@/lib/random';
import { useApp } from '@/state/AppState';
import { usePalmDraft } from '@/state/palmDraft';
import { profileSign } from '@/state/selectors';
import { spacing } from '@/theme/tokens';

/**
 * Builds the report from the questionnaire answers and saves it. The short
 * pause is a transition only; the copy says exactly what is happening.
 */
export default function Generating() {
  const { state, dispatch } = useApp();
  const { draft, reset } = usePalmDraft();
  const [failed, setFailed] = useState(false);
  const started = useRef(false);
  const spin = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(Animated.timing(spin, { toValue: 1, duration: 2400, easing: Easing.inOut(Easing.quad), useNativeDriver: true }));
    loop.start();
    return () => loop.stop();
  }, [spin]);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    if (!draft.hand) {
      router.replace('/palm/start');
      return;
    }
    const id = createId('reading');
    (async () => {
      try {
        let photoUri: string | undefined;
        if (draft.photoUri) {
          try {
            photoUri = await persistPhoto(draft.photoUri, id);
          } catch {
            photoUri = undefined; // The reading still works without the photo.
          }
        }
        const report = generatePalmReport({
          id,
          createdAt: new Date(),
          hand: draft.hand!,
          isDominant: draft.isDominant,
          answers: draft.answers,
          name: state.profile.name,
          signId: profileSign(state.profile) ?? undefined,
          photoUri,
          method: draft.photoAssisted ? 'questionnaire+photo-assist' : 'questionnaire',
        });
        await new Promise((r) => setTimeout(r, 900));
        dispatch({ type: 'addReading', reading: report });
        reset();
        router.replace(`/reading/${report.id}`);
      } catch {
        setFailed(true);
      }
    })();
  }, [draft, dispatch, reset, state.profile]);

  const opacity = spin.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.5, 1, 0.5] });

  return (
    <Screen scroll={false} contentStyle={styles.center} testID="generating">
      {failed ? (
        <>
          <Text variant="heading" center>
            Something went wrong
          </Text>
          <Text tone="muted" center>
            Your reading could not be created. Your answers are still here.
          </Text>
          <Button label="Back to questions" onPress={() => router.replace('/palm/questions')} />
        </>
      ) : (
        <>
          <Animated.View style={{ opacity }}>
            <PalmDiagram size={160} />
          </Animated.View>
          <Text variant="heading" center accessibilityLiveRegion="polite">
            Composing your reading
          </Text>
          <Text tone="muted" center>
            Interpreting your answers for each of the seven lines…
          </Text>
          <ActivityIndicator />
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.lg },
});
