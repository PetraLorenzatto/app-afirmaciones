import { createContext, useCallback, useContext, useEffect, useState } from 'react';

import type { OnboardingDraft } from '@/context/OnboardingContext';
import {
  clearUserProfile,
  createDefaultUserProfile,
  loadUserProfile,
  persistUserProfile,
} from '@/storage/userProfile';
import type { UserProfile } from '@/types';

interface UserProfileContextValue {
  profile: UserProfile;
  loading: boolean;
  completeOnboarding: (draft: OnboardingDraft) => Promise<void>;
  /** Herramienta temporal de desarrollo: borra el perfil y vuelve a mostrar el onboarding. */
  resetProfile: () => Promise<void>;
}

const UserProfileContext = createContext<UserProfileContextValue | null>(null);

export function UserProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>(createDefaultUserProfile);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserProfile().then((stored) => {
      setProfile(stored);
      setLoading(false);
    });
  }, []);

  const completeOnboarding = useCallback(
    async (draft: OnboardingDraft) => {
      // Se parte del perfil actual (no de un objeto nuevo) para conservar su `createdAt`
      // original, sea el de un perfil ya persistido o el default estable de esta sesión.
      const next: UserProfile = {
        ...profile,
        name: draft.name?.trim() || null,
        goals: draft.goals,
        currentNeed: draft.currentNeed,
        tone: draft.tone,
        supportTimes: draft.supportTimes,
        onboardingCompleted: true,
      };
      setProfile(next);
      await persistUserProfile(next);
    },
    [profile]
  );

  const resetProfile = useCallback(async () => {
    await clearUserProfile();
    setProfile(createDefaultUserProfile());
  }, []);

  return (
    <UserProfileContext.Provider value={{ profile, loading, completeOnboarding, resetProfile }}>
      {children}
    </UserProfileContext.Provider>
  );
}

export function useUserProfile() {
  const context = useContext(UserProfileContext);
  if (!context) {
    throw new Error('useUserProfile debe usarse dentro de UserProfileProvider');
  }
  return context;
}
