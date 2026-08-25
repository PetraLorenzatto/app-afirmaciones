import { createContext, useCallback, useContext, useMemo, useState } from 'react';

import type { CurrentNeed, SupportTime, SupportTone, UserGoal } from '@/types';

export const MAX_GOALS = 3;

export interface OnboardingDraft {
  name: string | null;
  goals: UserGoal[];
  currentNeed: CurrentNeed | null;
  tone: SupportTone | null;
  supportTimes: SupportTime[];
}

const EMPTY_DRAFT: OnboardingDraft = {
  name: null,
  goals: [],
  currentNeed: null,
  tone: null,
  supportTimes: [],
};

interface OnboardingContextValue {
  draft: OnboardingDraft;
  setName: (name: string | null) => void;
  toggleGoal: (goal: UserGoal) => void;
  setCurrentNeed: (need: CurrentNeed) => void;
  setTone: (tone: SupportTone) => void;
  toggleSupportTime: (time: SupportTime) => void;
}

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

/**
 * Vive solo mientras el grupo de rutas (onboarding) está montado: se crea de nuevo
 * cada vez que se entra al flujo, así que no hace falta resetearla a mano.
 */
export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [draft, setDraft] = useState<OnboardingDraft>(EMPTY_DRAFT);

  const setName = useCallback((name: string | null) => {
    setDraft((current) => ({ ...current, name }));
  }, []);

  const toggleGoal = useCallback((goal: UserGoal) => {
    setDraft((current) => {
      const isSelected = current.goals.includes(goal);
      if (isSelected) {
        return { ...current, goals: current.goals.filter((item) => item !== goal) };
      }
      if (current.goals.length >= MAX_GOALS) return current;
      return { ...current, goals: [...current.goals, goal] };
    });
  }, []);

  const setCurrentNeed = useCallback((currentNeed: CurrentNeed) => {
    setDraft((current) => ({ ...current, currentNeed }));
  }, []);

  const setTone = useCallback((tone: SupportTone) => {
    setDraft((current) => ({ ...current, tone }));
  }, []);

  const toggleSupportTime = useCallback((time: SupportTime) => {
    setDraft((current) => {
      const isSelected = current.supportTimes.includes(time);
      return {
        ...current,
        supportTimes: isSelected
          ? current.supportTimes.filter((item) => item !== time)
          : [...current.supportTimes, time],
      };
    });
  }, []);

  const value = useMemo(
    () => ({ draft, setName, toggleGoal, setCurrentNeed, setTone, toggleSupportTime }),
    [draft, setName, toggleGoal, setCurrentNeed, setTone, toggleSupportTime]
  );

  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>;
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding debe usarse dentro de OnboardingProvider');
  }
  return context;
}
