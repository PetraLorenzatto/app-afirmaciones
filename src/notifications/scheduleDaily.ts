import Constants from 'expo-constants';
import { Platform } from 'react-native';

const NOTIFICATION_IDENTIFIER = 'daily-affirmation';

/**
 * Desde el SDK 53, expo-notifications lanza un error apenas se *importa* en Expo Go
 * para Android (las notificaciones locales solo funcionan ahí en un development build).
 * Por eso nunca lo importamos de forma estática: solo se carga de forma diferida, y
 * únicamente fuera de este entorno restringido.
 */
const notificationsUnavailable = Platform.OS === 'android' && Constants.appOwnership === 'expo';

type NotificationsModule = typeof import('expo-notifications');

let notificationsModule: NotificationsModule | null = null;

async function getNotifications(): Promise<NotificationsModule | null> {
  if (notificationsUnavailable) return null;
  if (!notificationsModule) {
    notificationsModule = await import('expo-notifications');
    notificationsModule.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
      }),
    });
  }
  return notificationsModule;
}

export function isNotificationsAvailable(): boolean {
  return !notificationsUnavailable;
}

export async function requestNotificationPermissions(): Promise<boolean> {
  const Notifications = await getNotifications();
  if (!Notifications) return false;

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
  const Notifications = await getNotifications();
  if (!Notifications) return;

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
  const Notifications = await getNotifications();
  if (!Notifications) return;
  await Notifications.cancelScheduledNotificationAsync(NOTIFICATION_IDENTIFIER).catch(() => {});
}
