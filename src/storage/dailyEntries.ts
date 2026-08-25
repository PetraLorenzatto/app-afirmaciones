import AsyncStorage from '@react-native-async-storage/async-storage';

import type { DailyEntry } from '@/types';

const STORAGE_KEY = '@app-afirmaciones/daily-entries';

export async function loadDailyEntries(): Promise<DailyEntry[]> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as DailyEntry[];
  } catch {
    return [];
  }
}

export async function persistDailyEntries(entries: DailyEntry[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

/** Inserta la entrada si su `id` no existe todavía, o reemplaza la existente. */
export async function upsertDailyEntry(entry: DailyEntry): Promise<DailyEntry[]> {
  const current = await loadDailyEntries();
  const index = current.findIndex((item) => item.id === entry.id);
  const next =
    index === -1
      ? [...current, entry]
      : current.map((item, i) => (i === index ? entry : item));
  await persistDailyEntries(next);
  return next;
}
