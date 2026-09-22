import { useCallback, useEffect, useState } from 'react';

import { deleteDailyEntry, loadDailyEntries, upsertDailyEntry } from '@/storage/dailyEntries';
import { todayDateString } from '@/storage/streak';
import type { DailyEntry, Mood, UserProfile } from '@/types';
import { selectAffirmation, selectMicroAction } from '@/utils/selectTodayContent';

export const MAX_MICRO_ACTION_REROLLS = 3;

function createEmptyEntry(date: string): DailyEntry {
  return {
    id: date,
    date,
    morningMood: null,
    eveningMood: null,
    affirmationText: null,
    microActionText: null,
    microActionAccepted: false,
    microActionCompleted: false,
    microActionRerollCount: 0,
    reflection: null,
    gratitude: null,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

/**
 * Carga y actualiza la entrada de HOY (por fecha, 'YYYY-MM-DD' como id) para que cerrar y
 * volver a abrir la app el mismo día recupere exactamente el mismo estado en vez de arrancar
 * de cero: mood, afirmación, microacción y si ya se comprometió o completó el paso.
 */
export function useTodayEntry(profile: UserProfile) {
  const [entry, setEntry] = useState<DailyEntry | null>(null);
  const [loading, setLoading] = useState(true);
  // Microacciones ya mostradas hoy (en esta sesión), para que "Otro paso" no repita
  // mientras queden alternativas. En memoria nada más: se resetea si se reabre la app al
  // día siguiente (nueva sesión) o al usar "Reiniciar el día".
  const [shownMicroActions, setShownMicroActions] = useState<string[]>([]);

  useEffect(() => {
    const date = todayDateString();
    loadDailyEntries().then((entries) => {
      const found = entries.find((item) => item.date === date) ?? null;
      setEntry(found);
      setShownMicroActions(found?.microActionText ? [found.microActionText] : []);
      setLoading(false);
    });
  }, []);

  const persist = useCallback(async (next: DailyEntry) => {
    setEntry(next);
    await upsertDailyEntry(next);
  }, []);

  const checkIn = useCallback(
    async (mood: Mood) => {
      const date = todayDateString();
      const base = entry && entry.date === date ? entry : createEmptyEntry(date);
      const params = { goals: profile.goals, currentNeed: profile.currentNeed, tone: profile.tone, mood };
      const affirmation = selectAffirmation(params);
      const microAction = selectMicroAction(params);
      setShownMicroActions([microAction.text]);
      await persist({
        ...base,
        morningMood: mood,
        affirmationText: affirmation.text,
        microActionText: microAction.text,
        updatedAt: Date.now(),
      });
    },
    [entry, profile, persist]
  );

  const rerollMicroAction = useCallback(async () => {
    if (!entry || !entry.morningMood) return;
    if (entry.microActionRerollCount >= MAX_MICRO_ACTION_REROLLS) return;

    const microAction = selectMicroAction(
      { goals: profile.goals, currentNeed: profile.currentNeed, tone: profile.tone, mood: entry.morningMood },
      shownMicroActions
    );
    setShownMicroActions((current) => (current.includes(microAction.text) ? current : [...current, microAction.text]));
    await persist({
      ...entry,
      microActionText: microAction.text,
      microActionRerollCount: entry.microActionRerollCount + 1,
      updatedAt: Date.now(),
    });
  }, [entry, profile, persist, shownMicroActions]);

  const commit = useCallback(async () => {
    if (!entry) return;
    await persist({ ...entry, microActionAccepted: true, updatedAt: Date.now() });
  }, [entry, persist]);

  const complete = useCallback(async () => {
    if (!entry) return;
    await persist({ ...entry, microActionCompleted: true, updatedAt: Date.now() });
  }, [entry, persist]);

  /** Herramienta temporal de desarrollo: borra la entrada de hoy para repetir el flujo sin esperar al día siguiente. */
  const resetToday = useCallback(async () => {
    await deleteDailyEntry(todayDateString());
    setEntry(null);
    setShownMicroActions([]);
  }, []);

  return { entry, loading, checkIn, rerollMicroAction, commit, complete, resetToday };
}
