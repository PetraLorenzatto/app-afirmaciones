import AsyncStorage from '@react-native-async-storage/async-storage';

import type { StreakState } from '@/types';

export const DAILY_GOAL = 5;

const STORAGE_KEY = 'streak-state';

export const DEFAULT_STREAK_STATE: StreakState = {
  streak: 0,
  lastCompletedDate: null,
  todayDate: '',
  todayReadTexts: [],
};

export async function loadStreakState(): Promise<StreakState> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) return DEFAULT_STREAK_STATE;
  try {
    return { ...DEFAULT_STREAK_STATE, ...(JSON.parse(raw) as Partial<StreakState>) };
  } catch {
    return DEFAULT_STREAK_STATE;
  }
}

export async function persistStreakState(state: StreakState): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

/** Fecha local (no UTC) en formato 'YYYY-MM-DD', para que el corte de día coincida con el del usuario. */
export function todayDateString(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function isYesterday(dateStr: string | null, today: string): boolean {
  if (!dateStr) return false;
  const d = new Date(`${today}T00:00:00`);
  d.setDate(d.getDate() - 1);
  return todayDateString(d) === dateStr;
}
