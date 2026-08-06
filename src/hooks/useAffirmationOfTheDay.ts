import { useMemo } from 'react';

import { AFFIRMATIONS } from '@/data/affirmations';
import type { Category, SavedAffirmation } from '@/types';

export function getCombinedAffirmations(category: Category, saved: SavedAffirmation[]): string[] {
  const custom = saved.filter((item) => item.category === category).map((item) => item.text);
  return [...AFFIRMATIONS[category], ...custom];
}

function dayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

/** Elige siempre la misma frase para una fecha + lista dadas (para que la app y la notificación coincidan). */
export function pickForDate(list: string[], date: Date = new Date()): string {
  if (list.length === 0) return '';
  const index = dayOfYear(date) % list.length;
  return list[index];
}

export function useAffirmationOfTheDay(category: Category, saved: SavedAffirmation[]): string {
  return useMemo(() => {
    const list = getCombinedAffirmations(category, saved);
    return pickForDate(list);
  }, [category, saved]);
}
