import Constants from 'expo-constants';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, Switch, View } from 'react-native';
import { Card } from '@/components/Card';
import { Screen } from '@/components/Screen';
import { Text } from '@/components/Text';
import { Chip, Disclaimer, ListRow, Row, SectionHeader, ZodiacBadge } from '@/components/ui';
import { getSign } from '@/features/horoscope/zodiac';
import { disableDailyReminder, enableDailyReminder, remindersSupported } from '@/features/notifications/reminder';
import { confirmDestructive } from '@/lib/confirm';
import { formatLongDate, parseISODate } from '@/lib/date';
import { useApp } from '@/state/AppState';
import { profileSign } from '@/state/selectors';
import { colors, spacing } from '@/theme/tokens';

const HOURS = [7, 9, 12, 18, 21];

export default function Me() {
  const { state, dispatch, clearReadings, eraseAllData } = useApp();
  const { profile, settings } = state;
  const sign = profileSign(profile);
  const birth = parseISODate(profile.birthDate);
  const [busy, setBusy] = useState(false);

  const toggleReminder = async (on: boolean) => {
    setBusy(true);
    try {
      if (!on) {
        await disableDailyReminder();
        dispatch({ type: 'updateSettings', settings: { dailyReminder: false } });
        return;
      }
      const res = await enableDailyReminder(settings.reminderHour);
      if (res === 'scheduled') dispatch({ type: 'updateSettings', settings: { dailyReminder: true } });
      else if (res === 'denied') Alert.alert('Notifications are off', 'Allow notifications for Lunara in your device settings to get a daily reminder.');
      else Alert.alert('Not available', 'Reminders are not supported on this device.');
    } finally {
      setBusy(false);
    }
  };

  const setHour = async (hour: number) => {
    dispatch({ type: 'updateSettings', settings: { reminderHour: hour } });
    if (settings.dailyReminder) await enableDailyReminder(hour);
  };

  const clear = async () => {
    if (await confirmDestructive('Clear reading history?', `All ${state.readings.length} readings and their palm photos will be deleted.`, 'Clear')) clearReadings();
  };

  const erase = async () => {
    if (await confirmDestructive('Erase all data?', 'This deletes your profile, readings, palm photos, favourites and settings from this device. It cannot be undone.', 'Erase')) {
      await disableDailyReminder();
      await eraseAllData();
      router.replace('/onboarding');
    }
  };

  return (
    <Screen testID="me">
      <Text variant="title" accessibilityRole="header">
        Me
      </Text>
      <Card onPress={() => router.push('/edit-profile')} accessibilityLabel="Edit your details">
        <Row>
          {sign ? <ZodiacBadge signId={sign} size={56} /> : null}
          <View style={{ flex: 1 }}>
            <Text variant="heading">{profile.name || 'Guest'}</Text>
            <Text variant="bodySmall" tone="muted">
              {[sign ? getSign(sign).name : 'No sign set', birth ? formatLongDate(new Date(birth.year, birth.month - 1, birth.day)) : null].filter(Boolean).join(' · ')}
            </Text>
          </View>
          <Text variant="bodySmall" tone="accent">
            Edit
          </Text>
        </Row>
      </Card>

      {state.favoriteSigns.length ? (
        <>
          <SectionHeader title="Favourite signs" />
          <Row style={{ flexWrap: 'wrap' }} gap={spacing.sm}>
            {state.favoriteSigns.map((s) => (
              <Chip key={s} label={getSign(s).name} onPress={() => router.push(`/sign/${s}`)} />
            ))}
          </Row>
        </>
      ) : null}

      <SectionHeader title="Readings" />
      <Card>
        <ListRow icon="time-outline" title="Reading history" subtitle={`${state.readings.length} saved on this device`} onPress={() => router.push('/history')} />
        <ListRow icon="sparkles-outline" title="Lunara Plus" subtitle="Everything is free in this version" onPress={() => router.push('/premium')} />
      </Card>

      <SectionHeader title="Notifications" />
      <Card>
        <ListRow
          icon="notifications-outline"
          title="Daily horoscope reminder"
          subtitle={remindersSupported ? 'A gentle local reminder, once a day' : 'Available in the iOS and Android apps'}
          right={
            <Switch
              accessibilityLabel="Daily horoscope reminder"
              value={settings.dailyReminder}
              disabled={busy || !remindersSupported}
              onValueChange={(v) => void toggleReminder(v)}
              trackColor={{ true: colors.accentDeep, false: colors.surfaceStrong }}
              thumbColor={settings.dailyReminder ? colors.gold : colors.textMuted}
            />
          }
        />
        {settings.dailyReminder ? (
          <Row style={{ flexWrap: 'wrap' }} gap={spacing.sm}>
            {HOURS.map((h) => (
              <Chip key={h} label={`${String(h).padStart(2, '0')}:00`} selected={settings.reminderHour === h} onPress={() => void setHour(h)} />
            ))}
          </Row>
        ) : null}
      </Card>

      <SectionHeader title="Privacy & data" />
      <Card>
        <ListRow icon="shield-checkmark-outline" title="Privacy" onPress={() => router.push('/legal/privacy')} />
        <ListRow icon="document-text-outline" title="Terms & disclaimer" onPress={() => router.push('/legal/terms')} />
        <ListRow icon="trash-outline" title="Clear reading history" subtitle="Deletes readings and palm photos" onPress={clear} danger testID="me-clear" />
        <ListRow icon="nuclear-outline" title="Erase all data" subtitle="Resets the app to a fresh install" onPress={erase} danger testID="me-erase" />
      </Card>

      <Disclaimer />
      <Text variant="caption" tone="subtle" center style={styles.version}>
        Lunara {Constants.expoConfig?.version ?? ''}
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({ version: { marginTop: spacing.sm } });
