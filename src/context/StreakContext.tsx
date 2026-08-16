import { createContext, useCallback, useContext, useEffect, useState } from 'react';

import {
  DAILY_GOAL,
  DEFAULT_STREAK_STATE,
  isYesterday,
  loadStreakState,
  persistStreakState,
  todayDateString,
} from '@/storage/streak';
import type { StreakState } from '@/types';

interface StreakContextValue {
  streak: number;
  todayCount: number;
  goal: number;
  goalCompletedToday: boolean;
  loading: boolean;
  markRead: (text: string) => Promise<void>;
}

const StreakContext = createContext<StreakContextValue | null>(null);

function withRollover(state: StreakState): StreakState {
  const today = todayDateString();
  if (state.todayDate === today) return state;
  return { ...state, todayDate: today, todayReadTexts: [] };
}

function resolveDisplayStreak(state: StreakState): number {
  if (state.streak === 0) return 0;
  const today = todayDateString();
  if (state.lastCompletedDate === today) return state.streak;
  if (isYesterday(state.lastCompletedDate, today)) return state.streak;
  return 0;
}

export function StreakProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<StreakState>(DEFAULT_STREAK_STATE);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStreakState().then((stored) => {
      setState(withRollover(stored));
      setLoading(false);
    });
  }, []);

  const markRead = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setState((current) => {
      const rolled = withRollover(current);
      if (rolled.todayReadTexts.includes(trimmed)) {
        if (rolled !== current) persistStreakState(rolled);
        return rolled;
      }

      const todayReadTexts = [...rolled.todayReadTexts, trimmed];
      let { streak, lastCompletedDate } = rolled;

      if (todayReadTexts.length === DAILY_GOAL) {
        streak = isYesterday(rolled.lastCompletedDate, rolled.todayDate) ? rolled.streak + 1 : 1;
        lastCompletedDate = rolled.todayDate;
      }

      const next: StreakState = { ...rolled, todayReadTexts, streak, lastCompletedDate };
      persistStreakState(next);
      return next;
    });
  }, []);

  const today = todayDateString();
  const todayCount = state.todayDate === today ? state.todayReadTexts.length : 0;
  const streak = resolveDisplayStreak(state);
  const goalCompletedToday = todayCount >= DAILY_GOAL;

  return (
    <StreakContext.Provider
      value={{ streak, todayCount, goal: DAILY_GOAL, goalCompletedToday, loading, markRead }}>
      {children}
    </StreakContext.Provider>
  );
}

export function useStreak() {
  const context = useContext(StreakContext);
  if (!context) {
    throw new Error('useStreak debe usarse dentro de StreakProvider');
  }
  return context;
}
