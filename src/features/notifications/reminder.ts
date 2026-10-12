import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

/**
 * Optional daily local reminder. Scheduled on-device only: no push token is
 * requested and nothing is sent to a server.
 */

const REMINDER_ID = 'lunara-daily-horoscope';
const CHANNEL_ID = 'daily';

export const remindersSupported = Platform.OS === 'ios' || Platform.OS === 'android';

let handlerSet = false;
function ensureHandler() {
  if (handlerSet) return;
  handlerSet = true;
  Notifications.setNotificationHandler({
    handleNotification: async () => ({ shouldShowBanner: true, shouldShowList: true, shouldPlaySound: false, shouldSetBadge: false }),
  });
}

/** Returns 'scheduled', 'denied' or 'unsupported'. */
export async function enableDailyReminder(hour: number): Promise<'scheduled' | 'denied' | 'unsupported'> {
  if (!remindersSupported) return 'unsupported';
  try {
    ensureHandler();
    const current = await Notifications.getPermissionsAsync();
    const status = current.granted ? current : await Notifications.requestPermissionsAsync();
    if (!status.granted) return 'denied';
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync(CHANNEL_ID, { name: 'Daily horoscope', importance: Notifications.AndroidImportance.DEFAULT });
    }
    await Notifications.cancelScheduledNotificationAsync(REMINDER_ID).catch(() => undefined);
    await Notifications.scheduleNotificationAsync({
      identifier: REMINDER_ID,
      content: { title: 'Your daily stars are ready', body: 'Open Lunara for today’s horoscope and moon phase.' },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.DAILY, hour, minute: 0, channelId: CHANNEL_ID },
    });
    return 'scheduled';
  } catch {
    return 'unsupported';
  }
}

export async function disableDailyReminder(): Promise<void> {
  if (!remindersSupported) return;
  try {
    await Notifications.cancelScheduledNotificationAsync(REMINDER_ID);
  } catch {
    // Nothing scheduled.
  }
}
