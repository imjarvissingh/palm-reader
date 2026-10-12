import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useRef, useState } from 'react';
import { ActivityIndicator, Image, Linking, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { Button } from '@/components/Button';
import { HAND_PATH } from '@/components/PalmDiagram';
import { Screen } from '@/components/Screen';
import { Text } from '@/components/Text';
import { EmptyState } from '@/components/ui';
import { preparePhoto } from '@/features/palm/photoStore';
import { usePalmDraft } from '@/state/palmDraft';
import { colors, radius, spacing } from '@/theme/tokens';

/** Palm-shaped alignment guide drawn over the camera preview or photo. */
function GuideOverlay({ mirrored }: { mirrored: boolean }) {
  return (
    <View pointerEvents="none" style={styles.overlay} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      <Svg width="78%" height="78%" viewBox="0 0 200 260" preserveAspectRatio="xMidYMid meet">
        <Path
          d={HAND_PATH}
          transform={mirrored ? 'translate(200,0) scale(-1,1)' : undefined}
          fill="none"
          stroke={colors.gold}
          strokeWidth={1.6}
          strokeDasharray="6 5"
          opacity={0.9}
        />
      </Svg>
    </View>
  );
}

export default function Capture() {
  const { mode } = useLocalSearchParams<{ mode?: string }>();
  const insets = useSafeAreaInsets();
  const { draft, update } = usePalmDraft();
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewing, setPreviewing] = useState(mode === 'preview' && !!draft.photoUri);
  const mirrored = draft.hand === 'left';

  const pickLibrary = async () => {
    try {
      const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.9 });
      if (res.canceled || !res.assets[0]) return;
      setBusy(true);
      const prepared = await preparePhoto(res.assets[0].uri);
      update({ photoUri: prepared.uri, photoWarnings: prepared.assessment.messages });
      setPreviewing(true);
    } catch {
      setError('That image could not be loaded.');
    } finally {
      setBusy(false);
    }
  };

  const capture = async () => {
    if (!cameraRef.current || busy) return;
    setBusy(true);
    setError(null);
    try {
      const pic = await cameraRef.current.takePictureAsync({ quality: 0.85, skipProcessing: false });
      if (!pic?.uri) throw new Error('No photo');
      const prepared = await preparePhoto(pic.uri);
      update({ photoUri: prepared.uri, photoWarnings: prepared.assessment.messages });
      setPreviewing(true);
    } catch {
      setError('The photo could not be taken. Try again, or choose one from your library.');
    } finally {
      setBusy(false);
    }
  };

  const close = () => (router.canGoBack() ? router.back() : router.replace('/palm/start'));
  const skip = () => {
    update({ photoUri: null, photoWarnings: [] });
    router.replace('/palm/questions');
  };

  // ── Preview ───────────────────────────────────────────────
  if (previewing && draft.photoUri) {
    return (
      <Screen
        testID="capture-preview"
        footer={
          <View style={{ gap: spacing.sm }}>
            <Button testID="use-photo" label="Use this photo" onPress={() => router.replace('/palm/questions')} />
            <Button
              variant="secondary"
              label="Retake"
              onPress={() => {
                update({ photoUri: null, photoWarnings: [] });
                setPreviewing(false);
              }}
            />
          </View>
        }
      >
        <Text variant="title">Check your photo</Text>
        <View style={styles.previewFrame}>
          <Image source={{ uri: draft.photoUri }} style={StyleSheet.absoluteFill} resizeMode="cover" accessibilityLabel="Your palm photo" />
          <GuideOverlay mirrored={mirrored} />
        </View>
        {draft.photoWarnings.length ? (
          <View style={styles.warning} accessibilityLiveRegion="polite">
            <Ionicons name="alert-circle" size={20} color={colors.warning} />
            <View style={{ flex: 1, gap: 4 }}>
              {draft.photoWarnings.map((w) => (
                <Text key={w} variant="bodySmall">
                  {w}
                </Text>
              ))}
              <Text variant="caption" tone="muted">
                You can still use it — the photo is for your reference only.
              </Text>
            </View>
          </View>
        ) : (
          <Text variant="bodySmall" tone="success">
            Size and clarity checks passed. Compare your lines with the guide as you answer the next questions.
          </Text>
        )}
      </Screen>
    );
  }

  // ── Permission states ─────────────────────────────────────
  if (!permission) {
    return (
      <Screen scroll={false} contentStyle={styles.center}>
        <ActivityIndicator color={colors.accent} />
      </Screen>
    );
  }

  if (!permission.granted) {
    const blocked = !permission.canAskAgain;
    return (
      <Screen testID="camera-permission">
        <Pressable accessibilityRole="button" accessibilityLabel="Close" onPress={close} style={styles.closeInline}>
          <Ionicons name="close" size={26} color={colors.text} />
        </Pressable>
        <EmptyState
          icon="camera-outline"
          title={blocked ? 'Camera access is off' : 'Allow camera access'}
          body={
            blocked
              ? 'Camera permission was denied. You can turn it on in Settings, choose a photo from your library, or continue without a photo.'
              : 'Lunara needs the camera only to take your palm photo. The photo stays on this device.'
          }
        />
        <View style={{ gap: spacing.sm }}>
          {blocked ? (
            <Button label="Open Settings" onPress={() => void Linking.openSettings()} />
          ) : (
            <Button testID="grant-camera" label="Allow camera" onPress={() => void requestPermission()} />
          )}
          <Button variant="secondary" label="Choose from library" onPress={pickLibrary} loading={busy} />
          <Button variant="ghost" label="Continue without a photo" onPress={skip} />
        </View>
      </Screen>
    );
  }

  // ── Camera ────────────────────────────────────────────────
  return (
    <View style={styles.cameraRoot} testID="camera">
      {error === 'unavailable' ? (
        <Screen>
          <EmptyState icon="videocam-off-outline" title="Camera unavailable" body="This device or environment has no usable camera. Choose a photo from your library or continue without one." />
          <Button variant="secondary" label="Choose from library" onPress={pickLibrary} />
          <Button variant="ghost" label="Continue without a photo" onPress={skip} />
        </Screen>
      ) : (
        <>
          <CameraView
            ref={cameraRef}
            style={StyleSheet.absoluteFill}
            facing="back"
            onCameraReady={() => setReady(true)}
            onMountError={() => setError('unavailable')}
            accessibilityLabel="Camera preview"
          />
          <GuideOverlay mirrored={mirrored} />
          <View style={[styles.topBar, { paddingTop: insets.top + spacing.sm }]}>
            <Pressable accessibilityRole="button" accessibilityLabel="Close camera" onPress={close} style={styles.iconBtn}>
              <Ionicons name="close" size={26} color={colors.text} />
            </Pressable>
            <Text variant="bodySmall" center style={{ flex: 1 }}>
              Line up your {draft.hand ?? ''} palm with the outline
            </Text>
            <View style={styles.iconBtn} />
          </View>
          <View style={[styles.bottomBar, { paddingBottom: insets.bottom + spacing.lg }]}>
            {error ? (
              <Text variant="bodySmall" tone="danger" center accessibilityLiveRegion="assertive">
                {error}
              </Text>
            ) : null}
            <View style={styles.controls}>
              <Pressable accessibilityRole="button" accessibilityLabel="Choose from library" onPress={pickLibrary} style={styles.iconBtn}>
                <Ionicons name="images-outline" size={26} color={colors.text} />
              </Pressable>
              <Pressable
                testID="shutter"
                accessibilityRole="button"
                accessibilityLabel="Take photo"
                accessibilityState={{ disabled: !ready || busy, busy }}
                disabled={!ready || busy}
                onPress={capture}
                style={({ pressed }) => [styles.shutter, (pressed || busy) && { opacity: 0.6 }]}
              >
                {busy ? <ActivityIndicator color={colors.onAccent} /> : <View style={styles.shutterInner} />}
              </Pressable>
              <Pressable accessibilityRole="button" accessibilityLabel="Skip photo" onPress={skip} style={styles.iconBtn}>
                <Text variant="bodySmall">Skip</Text>
              </Pressable>
            </View>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  center: { alignItems: 'center', justifyContent: 'center' },
  cameraRoot: { flex: 1, backgroundColor: '#000' },
  overlay: { ...StyleSheet.absoluteFill, alignItems: 'center', justifyContent: 'center' },
  topBar: { position: 'absolute', top: 0, left: 0, right: 0, flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.lg, backgroundColor: colors.overlay, paddingBottom: spacing.sm },
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, gap: spacing.md, paddingTop: spacing.lg, backgroundColor: colors.overlay },
  controls: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' },
  iconBtn: { width: 56, height: 56, alignItems: 'center', justifyContent: 'center' },
  shutter: { width: 76, height: 76, borderRadius: 38, borderWidth: 4, borderColor: colors.gold, alignItems: 'center', justifyContent: 'center' },
  shutterInner: { width: 58, height: 58, borderRadius: 29, backgroundColor: colors.gold },
  previewFrame: { width: '100%', aspectRatio: 3 / 4, borderRadius: radius.lg, overflow: 'hidden', backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  warning: { flexDirection: 'row', gap: spacing.sm, padding: spacing.md, borderRadius: radius.md, backgroundColor: 'rgba(255,210,122,0.1)', borderWidth: 1, borderColor: 'rgba(255,210,122,0.4)' },
  closeInline: { alignSelf: 'flex-end', width: 48, height: 48, alignItems: 'center', justifyContent: 'center' },
});
