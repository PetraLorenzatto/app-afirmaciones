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
  editAffirmation: (id: string, text: string, category: Category) => Promise<void>;
  toggleFavorite: (text: string, category: Category) => Promise<void>;
  isSaved: (text: string, category: Category) => boolean;
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
      const next = [createSavedAffirmation(text, category, 'custom'), ...current];
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

  const editAffirmation = useCallback(async (id: string, text: string, category: Category) => {
    if (!text.trim()) return;
    setSaved((current) => {
      const next = current.map((item) =>
        item.id === id ? { ...item, text: text.trim(), category } : item
      );
      persistSavedAffirmations(next);
      return next;
    });
  }, []);

  const toggleFavorite = useCallback(async (text: string, category: Category) => {
    const trimmed = text.trim();
    setSaved((current) => {
      const existingFavorite = current.find(
        (item) => item.origin === 'favorite' && item.text === trimmed && item.category === category
      );
      if (existingFavorite) {
        const next = current.filter((item) => item.id !== existingFavorite.id);
        persistSavedAffirmations(next);
        return next;
      }
      const alreadySaved = current.some((item) => item.text === trimmed && item.category === category);
      if (alreadySaved) return current;
      const next = [createSavedAffirmation(trimmed, category, 'favorite'), ...current];
      persistSavedAffirmations(next);
      return next;
    });
  }, []);

  const isSaved = useCallback(
    (text: string, category: Category) => {
      const trimmed = text.trim();
      return saved.some((item) => item.text === trimmed && item.category === category);
    },
    [saved]
  );

  return (
    <SavedAffirmationsContext.Provider
      value={{ saved, loading, addAffirmation, removeAffirmation, editAffirmation, toggleFavorite, isSaved }}>
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
