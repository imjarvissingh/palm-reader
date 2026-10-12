import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { TextInput, View } from 'react-native';
import { BirthDateFields, fieldsFromISO, inputStyle, type BirthFields } from '@/components/BirthDateFields';
import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { Text } from '@/components/Text';
import { SignGrid } from '@/components/ui';
import { getSign, getZodiacSign, type ZodiacId } from '@/features/horoscope/zodiac';
import { toISODate, validateBirthInput } from '@/lib/date';
import { useApp } from '@/state/AppState';
import { colors, spacing } from '@/theme/tokens';

export default function EditProfile() {
  const { state, dispatch } = useApp();
  const [name, setName] = useState(state.profile.name);
  const [birth, setBirth] = useState<BirthFields>(fieldsFromISO(state.profile.birthDate));
  const [signId, setSignId] = useState<ZodiacId | null>(state.profile.signId);
  const result = useMemo(() => validateBirthInput(birth.day, birth.month, birth.year), [birth]);
  const derived = result.parts ? getZodiacSign(result.parts).sign.id : null;
  const effective = signId ?? derived;

  const save = () => {
    dispatch({ type: 'updateProfile', profile: { name, birthDate: result.parts ? toISODate(result.parts) : null, signId } });
    router.back();
  };

  return (
    <Screen edgeTop={false} footer={<Button testID="profile-save" label="Save" onPress={save} disabled={!!result.error} />}>
      <View style={{ gap: 6 }}>
        <Text variant="caption" tone="muted">
          Name or nickname
        </Text>
        <TextInput accessibilityLabel="Name or nickname" value={name} onChangeText={(t) => setName(t.slice(0, 40))} style={inputStyle} placeholder="Optional" placeholderTextColor={colors.textSubtle} />
      </View>
      <View style={{ gap: 6 }}>
        <Text variant="caption" tone="muted">
          Date of birth (optional, stored on this device only)
        </Text>
        <BirthDateFields value={birth} onChange={(v) => { setBirth(v); setSignId(null); }} error={result.error} />
      </View>
      <Text variant="subheading">{effective ? `Sign: ${getSign(effective).name}` : 'Pick your sign'}</Text>
      <Text variant="caption" tone="muted">
        Your sign is calculated from your birth date. Tap a sign to override it (useful if you were born on a cusp).
      </Text>
      <SignGrid value={effective} onChange={setSignId} />
      {signId ? <Button variant="ghost" label="Use the sign from my birth date" onPress={() => setSignId(null)} /> : null}
      <View style={{ height: spacing.lg }} />
    </Screen>
  );
}
