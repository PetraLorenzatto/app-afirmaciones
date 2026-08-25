import AsyncStorage from '@react-native-async-storage/async-storage';

import type { UserProfile } from '@/types';

const STORAGE_KEY = '@app-afirmaciones/user-profile';

// Se calcula una sola vez al cargar el módulo, no en cada llamada a loadUserProfile,
// para que "createdAt" del perfil default no cambie entre chequeos dentro de la misma sesión.
const DEFAULT_CREATED_AT = Date.now();

export function createDefaultUserProfile(): UserProfile {
  return {
    name: null,
    goals: [],
    currentNeed: null,
    tone: null,
    onboardingCompleted: false,
    createdAt: DEFAULT_CREATED_AT,
  };
}

export async function loadUserProfile(): Promise<UserProfile> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) return createDefaultUserProfile();
  try {
    return { ...createDefaultUserProfile(), ...(JSON.parse(raw) as Partial<UserProfile>) };
  } catch {
    return createDefaultUserProfile();
  }
}

export async function persistUserProfile(profile: UserProfile): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}

export async function clearUserProfile(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEY);
}
