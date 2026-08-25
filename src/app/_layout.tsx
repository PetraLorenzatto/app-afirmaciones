import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

import { JournalProvider } from '@/context/JournalContext';
import { SavedAffirmationsProvider } from '@/context/SavedAffirmationsContext';
import { SettingsProvider } from '@/context/SettingsContext';
import { StreakProvider } from '@/context/StreakContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { UserProfileProvider, useUserProfile } from '@/context/UserProfileContext';
import { SUNRISE_GRADIENT } from '@/theme/colors';
import { useAppFonts } from '@/theme/fonts';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useAppFonts();

  return (
    <SavedAffirmationsProvider>
      <SettingsProvider>
        <ThemeProvider>
          <StreakProvider>
            <JournalProvider>
              <UserProfileProvider>
                <StatusBar style="light" />
                <RootNavigator fontsLoaded={fontsLoaded} />
              </UserProfileProvider>
            </JournalProvider>
          </StreakProvider>
        </ThemeProvider>
      </SettingsProvider>
    </SavedAffirmationsProvider>
  );
}

/**
 * Separado del RootLayout porque necesita leer UserProfileContext (loading + onboardingCompleted)
 * para decidir a qué grupo de rutas entrar, y ese contexto solo existe por debajo de su Provider.
 * El splash nativo se mantiene visible hasta que fuentes Y perfil estén listos, para que nunca
 * se vea un flash de (tabs) antes de redirigir a (onboarding) (ni viceversa).
 */
function RootNavigator({ fontsLoaded }: { fontsLoaded: boolean }) {
  const { profile, loading: profileLoading } = useUserProfile();
  const ready = fontsLoaded && !profileLoading;

  useEffect(() => {
    if (ready) {
      SplashScreen.hideAsync();
    }
  }, [ready]);

  if (!ready) {
    return null;
  }

  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: SUNRISE_GRADIENT[0] } }}>
      <Stack.Screen name="(onboarding)" redirect={profile.onboardingCompleted} />
      <Stack.Screen name="(tabs)" redirect={!profile.onboardingCompleted} />
      <Stack.Screen name="ajustes" options={{ presentation: 'card' }} />
    </Stack>
  );
}
