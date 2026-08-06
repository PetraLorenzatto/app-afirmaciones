import AsyncStorage from '@react-native-async-storage/async-storage';

import type { NotificationSettings } from '@/types';

const STORAGE_KEY = 'notification-settings';

export const DEFAULT_SETTINGS: NotificationSettings = {
  enabled: false,
  hour: 8,
  minute: 0,
};

export async function loadSettings(): Promise<NotificationSettings> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) return DEFAULT_SETTINGS;
  try {
    return { ...DEFAULT_SETTINGS, ...(JSON.parse(raw) as Partial<NotificationSettings>) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export async function persistSettings(settings: NotificationSettings): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}
