import AsyncStorage from '@react-native-async-storage/async-storage';

import type { Category, SavedAffirmation } from '@/types';

const STORAGE_KEY = 'saved-affirmations';

export async function loadSavedAffirmations(): Promise<SavedAffirmation[]> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as SavedAffirmation[];
  } catch {
    return [];
  }
}

export async function persistSavedAffirmations(items: SavedAffirmation[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function createSavedAffirmation(text: string, category: Category): SavedAffirmation {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    text: text.trim(),
    category,
    createdAt: Date.now(),
  };
}
