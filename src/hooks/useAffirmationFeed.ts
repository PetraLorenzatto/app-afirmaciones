import { useMemo } from 'react';

import { getCombinedAffirmations, pickForDate } from '@/hooks/useAffirmationOfTheDay';
import type { Category, SavedAffirmation } from '@/types';

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Arma el "feed" para hacer scroll: la primera frase es la del día
 * (la misma que se manda por notificación), el resto es la biblioteca
 * de esa categoría barajada al azar.
 */
export function useAffirmationFeed(category: Category, saved: SavedAffirmation[]): string[] {
  return useMemo(() => {
    const list = getCombinedAffirmations(category, saved);
    if (list.length === 0) return [];
    const today = pickForDate(list);
    const rest = shuffle(list.filter((text) => text !== today));
    return [today, ...rest];
  }, [category, saved]);
}
