import { createContext, useCallback, useContext, useEffect, useState } from 'react';

import {
  createSavedAffirmation,
  loadSavedAffirmations,
  persistSavedAffirmations,
} from '@/storage/savedAffirmations';
import type { Category, SavedAffirmation } from '@/types';

interface SavedAffirmationsContextValue {
  saved: SavedAffirmation[];
  loading: boolean;
  addAffirmation: (text: string, category: Category) => Promise<void>;
  removeAffirmation: (id: string) => Promise<void>;
}

const SavedAffirmationsContext = createContext<SavedAffirmationsContextValue | null>(null);

export function SavedAffirmationsProvider({ children }: { children: React.ReactNode }) {
  const [saved, setSaved] = useState<SavedAffirmation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSavedAffirmations().then((items) => {
      setSaved(items);
      setLoading(false);
    });
  }, []);

  const addAffirmation = useCallback(async (text: string, category: Category) => {
    if (!text.trim()) return;
    setSaved((current) => {
      const next = [createSavedAffirmation(text, category), ...current];
      persistSavedAffirmations(next);
      return next;
    });
  }, []);

  const removeAffirmation = useCallback(async (id: string) => {
    setSaved((current) => {
      const next = current.filter((item) => item.id !== id);
      persistSavedAffirmations(next);
      return next;
    });
  }, []);

  return (
    <SavedAffirmationsContext.Provider value={{ saved, loading, addAffirmation, removeAffirmation }}>
      {children}
    </SavedAffirmationsContext.Provider>
  );
}

export function useSavedAffirmations() {
  const context = useContext(SavedAffirmationsContext);
  if (!context) {
    throw new Error('useSavedAffirmations debe usarse dentro de SavedAffirmationsProvider');
  }
  return context;
}
