import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Image, StyleSheet, View } from 'react-native';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { PalmDiagram } from '@/components/PalmDiagram';
import { Screen } from '@/components/Screen';
import { Text } from '@/components/Text';
import { Disclaimer, Eyebrow, OptionRow, Row } from '@/components/ui';
import { preparePhoto } from '@/features/palm/photoStore';
import type { Hand } from '@/features/palm/types';
import { useApp } from '@/state/AppState';
import { usePalmDraft } from '@/state/palmDraft';
import { colors, radius, spacing } from '@/theme/tokens';

const TIPS = [
  'Bright, even light — daylight near a window is ideal',
  'Open your hand flat with fingers together',
  'Fill the frame from wrist to fingertips',
  'Hold the phone steady, parallel to your palm',
];

export default function PalmStart() {
  const { state } = useApp();
  const { draft, update, reset } = usePalmDraft();
  const [busy, setBusy] = useState(false);

  // Fresh draft every time the flow starts.
  useEffect(() => {
    reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const hand = draft.hand;
  const lastPhoto = hand ? state.readings.find((r) => r.hand === hand && r.photoUri)?.photoUri : undefined;

  const pickFromLibrary = async () => {
    setBusy(true);
    try {
      const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.9, allowsEditing: false });
      if (res.canceled || !res.assets[0]) return;
      const prepared = await preparePhoto(res.assets[0].uri);
      update({ photoUri: prepared.uri, photoWarnings: prepared.assessment.messages });
      router.push({ pathname: '/palm/capture', params: { mode: 'preview' } });
    } catch {
      Alert.alert('Could not open photo', 'That image could not be loaded. Try another photo or continue without one.');
    } finally {
      setBusy(false);
    }
  };

  const reuse = () => {
    if (!lastPhoto) return;
    update({ photoUri: lastPhoto, photoWarnings: [] });
    router.push('/palm/questions');
  };

  return (
    <Screen edgeTop={false} testID="palm-start">
      <Row style={{ alignItems: 'center' }}>
        <View style={{ flex: 1, gap: spacing.sm }}>
          <Eyebrow>Step 1 · Your hand</Eyebrow>
          <Text variant="title">Which palm are we reading?</Text>
        </View>
        <PalmDiagram size={80} mirrored={hand === 'left'} />
      </Row>
      <Text tone="muted" variant="bodySmall">
        Tradition says your non-dominant hand shows natural tendencies and your dominant hand shows what you have made of them.
      </Text>
      <View style={{ gap: spacing.sm }} accessibilityRole="radiogroup" accessibilityLabel="Hand">
        {(['right', 'left'] as Hand[]).map((h) => (
          <OptionRow key={h} testID={`hand-${h}`} label={h === 'right' ? 'Right hand' : 'Left hand'} selected={hand === h} onPress={() => update({ hand: h })} />
        ))}
      </View>
      {hand ? (
        <View style={{ gap: spacing.sm }} accessibilityRole="radiogroup" accessibilityLabel="Dominant hand">
          <Text variant="subheading">Is this the hand you write with?</Text>
          <Row gap={spacing.sm}>
            {[
              { v: true, l: 'Yes' },
              { v: false, l: 'No' },
              { v: null, l: 'Not sure' },
            ].map((o) => (
              <View key={o.l} style={{ flex: 1 }}>
                <OptionRow label={o.l} selected={draft.isDominant === o.v} onPress={() => update({ isDominant: o.v })} />
              </View>
            ))}
          </Row>
        </View>
      ) : null}

      <Card>
        <Eyebrow>For the best photo</Eyebrow>
        {TIPS.map((t) => (
          <Row key={t} gap={spacing.sm} style={{ alignItems: 'flex-start' }}>
            <Ionicons name="checkmark-circle" size={18} color={colors.success} />
            <Text variant="bodySmall" style={{ flex: 1 }}>
              {t}
            </Text>
          </Row>
        ))}
        <Text variant="caption" tone="subtle">
          Your photo stays on this device. It is used as your personal reference beside the report — Lunara does not run image analysis on it. The reading comes from your answers.
        </Text>
      </Card>

      <View style={{ gap: spacing.sm }}>
        <Button testID="palm-take-photo" label="Take a palm photo" disabled={!hand || busy} onPress={() => router.push('/palm/capture')} icon={<Ionicons name="camera" size={20} color={colors.onAccent} />} />
        <Button variant="secondary" label="Choose from library" disabled={!hand || busy} loading={busy} onPress={pickFromLibrary} />
        {lastPhoto ? (
          <Card onPress={reuse} accessibilityLabel="Reuse your last palm photo for this hand">
            <Row>
              <Image source={{ uri: lastPhoto }} style={styles.thumb} accessibilityIgnoresInvertColors />
              <View style={{ flex: 1 }}>
                <Text variant="subheading">Reuse my last photo</Text>
                <Text variant="caption" tone="muted">
                  No need to retake it every time.
                </Text>
              </View>
            </Row>
          </Card>
        ) : null}
        <Button testID="palm-skip-photo" variant="ghost" label="Continue without a photo" disabled={!hand} onPress={() => router.push('/palm/questions')} />
      </View>
      <Disclaimer compact />
    </Screen>
  );
}

const styles = StyleSheet.create({
  thumb: { width: 48, height: 48, borderRadius: radius.sm, backgroundColor: colors.surface },
});
