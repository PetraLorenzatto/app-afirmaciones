import AsyncStorage from '@react-native-async-storage/async-storage';

import type { ThemePrefs } from '@/types';

const STORAGE_KEY = 'theme-prefs';

export const DEFAULT_THEME_PREFS: ThemePrefs = {
  gradient: 'sunrise',
  font: 'playfair',
};

export async function loadThemePrefs(): Promise<ThemePrefs> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) return DEFAULT_THEME_PREFS;
  try {
    return { ...DEFAULT_THEME_PREFS, ...(JSON.parse(raw) as Partial<ThemePrefs>) };
  } catch {
    return DEFAULT_THEME_PREFS;
  }
}

export async function persistThemePrefs(prefs: ThemePrefs): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
}
