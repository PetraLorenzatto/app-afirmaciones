import AsyncStorage from '@react-native-async-storage/async-storage';

import type { JournalEntry } from '@/types';

const STORAGE_KEY = 'journal-entries';

export async function loadJournalEntries(): Promise<JournalEntry[]> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as JournalEntry[];
  } catch {
    return [];
  }
}

export async function persistJournalEntries(items: JournalEntry[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function createJournalEntry(text: string): JournalEntry {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    text: text.trim(),
    createdAt: Date.now(),
  };
}
