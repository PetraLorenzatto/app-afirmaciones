import { createContext, useCallback, useContext, useEffect, useState } from 'react';

import { createJournalEntry, loadJournalEntries, persistJournalEntries } from '@/storage/journal';
import type { JournalEntry } from '@/types';

interface JournalContextValue {
  entries: JournalEntry[];
  loading: boolean;
  addEntry: (text: string) => Promise<void>;
  removeEntry: (id: string) => Promise<void>;
}

const JournalContext = createContext<JournalContextValue | null>(null);

export function JournalProvider({ children }: { children: React.ReactNode }) {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadJournalEntries().then((items) => {
      setEntries(items);
      setLoading(false);
    });
  }, []);

  const addEntry = useCallback(async (text: string) => {
    if (!text.trim()) return;
    setEntries((current) => {
      const next = [createJournalEntry(text), ...current];
      persistJournalEntries(next);
      return next;
    });
  }, []);

  const removeEntry = useCallback(async (id: string) => {
    setEntries((current) => {
      const next = current.filter((item) => item.id !== id);
      persistJournalEntries(next);
      return next;
    });
  }, []);

  return (
    <JournalContext.Provider value={{ entries, loading, addEntry, removeEntry }}>
      {children}
    </JournalContext.Provider>
  );
}

export function useJournal() {
  const context = useContext(JournalContext);
  if (!context) {
    throw new Error('useJournal debe usarse dentro de JournalProvider');
  }
  return context;
}
