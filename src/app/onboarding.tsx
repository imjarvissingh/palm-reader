import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { BackHandler, StyleSheet, TextInput, View } from 'react-native';
import { BirthDateFields, inputStyle, type BirthFields } from '@/components/BirthDateFields';
import { Button } from '@/components/Button';
import { PalmDiagram } from '@/components/PalmDiagram';
import { Screen } from '@/components/Screen';
import { Text } from '@/components/Text';
import { Disclaimer, Eyebrow, IconCircle, Row, SignGrid, ZodiacBadge } from '@/components/ui';
import { getSign, getZodiacSign, type ZodiacId } from '@/features/horoscope/zodiac';
import { toISODate, validateBirthInput } from '@/lib/date';
import { useApp } from '@/state/AppState';
import { colors, gradients, radius, spacing } from '@/theme/tokens';

const STEPS = 4;

export default function Onboarding() {
  const { dispatch } = useApp();
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [birth, setBirth] = useState<BirthFields>({ day: '', month: '', year: '' });
  const [pickedSign, setPickedSign] = useState<ZodiacId | null>(null);
  const [showPicker, setShowPicker] = useState(false);

  const birthResult = useMemo(() => validateBirthInput(birth.day, birth.month, birth.year), [birth]);
  const derived = birthResult.parts ? getZodiacSign(birthResult.parts) : null;
  const sign = pickedSign ?? derived?.sign.id ?? null;
  const partialBirth = !!(birth.day || birth.month || birth.year);

  // Android back: step backwards through onboarding instead of leaving the app.
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (step > 0) {
        setStep((s) => s - 1);
        return true;
      }
      return false;
    });
    return () => sub.remove();
  }, [step]);

  const finish = () => {
    dispatch({
      type: 'updateProfile',
      profile: {
        name,
        birthDate: birthResult.parts ? toISODate(birthResult.parts) : null,
        signId: pickedSign,
        onboarded: true,
      },
    });
    router.replace('/(tabs)');
  };

  const next = () => (step < STEPS - 1 ? setStep(step + 1) : finish());
  const canContinue = step !== 2 || !partialBirth || !!birthResult.parts;

  const footer = (
    <View style={{ gap: spacing.sm }}>
      <Progress step={step} />
      <Button
        testID="onboarding-next"
        label={step === 0 ? 'Begin' : step === STEPS - 1 ? 'Enter Lunara' : 'Continue'}
        onPress={next}
        disabled={!canContinue}
      />
      {step === 2 ? <Button variant="ghost" label="Skip for now" onPress={() => setStep(3)} /> : null}
    </View>
  );

  return (
    <Screen footer={footer} testID="onboarding">
      {step === 0 ? (
        <View style={styles.hero}>
          <LinearGradient colors={gradients.hero} style={styles.heroGlow}>
            <PalmDiagram size={170} showLabels={false} />
          </LinearGradient>
          <Eyebrow>Welcome to</Eyebrow>
          <Text variant="display" center>
            Lunara
          </Text>
          <Text variant="heading" tone="gold" center>
            Palm readings & daily stars
          </Text>
          <Text tone="muted" center>
            A calm, private space to explore palmistry, your zodiac and the rhythm of the Moon — no account needed.
          </Text>
        </View>
      ) : null}

      {step === 1 ? (
        <View style={{ gap: spacing.lg }}>
          <Eyebrow>What you can do</Eyebrow>
          <Text variant="title">Your guide to the lines and the stars</Text>
          <Feature icon="hand-left-outline" title="Guided palm readings" body="Answer simple questions about your seven major lines and get a detailed, personal report." />
          <Feature icon="planet-outline" title="Daily horoscopes" body="Today, tomorrow, the week and the month for all twelve signs." />
          <Feature icon="heart-circle-outline" title="Compatibility & numerology" body="Compare signs, find your life path number and more." />
          <Feature icon="moon-outline" title="Moon calendar & dreams" body="Calculated moon phases and a dream symbol dictionary." />
        </View>
      ) : null}

      {step === 2 ? (
        <View style={{ gap: spacing.lg }}>
          <Eyebrow>Personalise (optional)</Eyebrow>
          <Text variant="title">Tell us a little about you</Text>
          <View style={{ gap: 6 }}>
            <Text variant="caption" tone="muted">
              Name or nickname
            </Text>
            <TextInput
              testID="onboarding-name"
              accessibilityLabel="Name or nickname"
              value={name}
              onChangeText={(t) => setName(t.slice(0, 40))}
              placeholder="e.g. Sam"
              placeholderTextColor={colors.textSubtle}
              style={inputStyle}
              autoCapitalize="words"
              returnKeyType="done"
            />
          </View>
          <View style={{ gap: 6 }}>
            <Text variant="caption" tone="muted">
              Date of birth — used to find your sign. Stored only on this device.
            </Text>
            <BirthDateFields value={birth} onChange={(v) => { setBirth(v); setPickedSign(null); }} error={birthResult.error} />
          </View>
          {sign ? (
            <Row style={styles.signRow}>
              <ZodiacBadge signId={sign} size={48} />
              <View style={{ flex: 1 }}>
                <Text variant="subheading">You are {getSign(sign).name}</Text>
                <Text variant="caption" tone="muted">
                  {derived?.isCusp && !pickedSign ? 'Born on a cusp — the boundary shifts by a day some years, so pick your sign below if you prefer.' : getSign(sign).summary}
                </Text>
              </View>
            </Row>
          ) : null}
          <Button variant="secondary" label={showPicker ? 'Hide signs' : 'Choose my sign instead'} onPress={() => setShowPicker((s) => !s)} />
          {showPicker ? <SignGrid value={sign} onChange={setPickedSign} /> : null}
        </View>
      ) : null}

      {step === 3 ? (
        <View style={{ gap: spacing.lg }}>
          <Eyebrow>Your privacy</Eyebrow>
          <Text variant="title">Private by design</Text>
          <Feature icon="phone-portrait-outline" title="Everything stays on your device" body="Your details, readings and palm photos are stored locally. There is no account and no server." />
          <Feature icon="camera-outline" title="Camera only when you ask" body="We only request camera access when you choose to photograph your palm. Photos are optional." />
          <Feature icon="trash-outline" title="Delete any time" body="Remove a reading, clear your history or erase everything from Settings." />
          <Disclaimer />
        </View>
      ) : null}
    </Screen>
  );
}

function Feature({ icon, title, body }: { icon: React.ComponentProps<typeof IconCircle>['name']; title: string; body: string }) {
  return (
    <Row style={{ alignItems: 'flex-start' }}>
      <IconCircle name={icon} />
      <View style={{ flex: 1, gap: 2 }}>
        <Text variant="subheading">{title}</Text>
        <Text tone="muted" variant="bodySmall">
          {body}
        </Text>
      </View>
    </Row>
  );
}

function Progress({ step }: { step: number }) {
  return (
    <View style={styles.progress} accessible accessibilityLabel={`Step ${step + 1} of ${STEPS}`}>
      {Array.from({ length: STEPS }, (_, i) => (
        <View key={i} style={[styles.progressDot, i <= step && styles.progressOn]} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { alignItems: 'center', gap: spacing.md, paddingTop: spacing.xxl },
  heroGlow: { borderRadius: 140, padding: spacing.xxl, marginBottom: spacing.lg, borderWidth: 1, borderColor: colors.border },
  signRow: { padding: spacing.md, borderRadius: radius.md, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  progress: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginBottom: spacing.xs },
  progressDot: { width: 18, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.15)' },
  progressOn: { backgroundColor: colors.gold },
});
