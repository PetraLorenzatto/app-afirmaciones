import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

const NOTIFICATION_IDENTIFIER = 'daily-affirmation';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export async function requestNotificationPermissions(): Promise<boolean> {
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;

  const request = await Notifications.requestPermissionsAsync();
  return request.granted;
}

export async function scheduleDailyAffirmationNotification(
  hour: number,
  minute: number,
  body: string
): Promise<void> {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Afirmación diaria',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }

  await Notifications.cancelScheduledNotificationAsync(NOTIFICATION_IDENTIFIER).catch(() => {});

  await Notifications.scheduleNotificationAsync({
    identifier: NOTIFICATION_IDENTIFIER,
    content: {
      title: 'Tu afirmación de hoy',
      body,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
    },
  });
}

export async function cancelDailyAffirmationNotification(): Promise<void> {
  await Notifications.cancelScheduledNotificationAsync(NOTIFICATION_IDENTIFIER).catch(() => {});
}
