import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

import { JournalProvider } from '@/context/JournalContext';
import { SavedAffirmationsProvider } from '@/context/SavedAffirmationsContext';
import { SettingsProvider } from '@/context/SettingsContext';
import { StreakProvider } from '@/context/StreakContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { SUNRISE_GRADIENT } from '@/theme/colors';
import { useAppFonts } from '@/theme/fonts';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useAppFonts();

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SavedAffirmationsProvider>
      <SettingsProvider>
        <ThemeProvider>
          <StreakProvider>
            <JournalProvider>
              <StatusBar style="light" />
              <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: SUNRISE_GRADIENT[0] } }}>
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="ajustes" options={{ presentation: 'card' }} />
              </Stack>
            </JournalProvider>
          </StreakProvider>
        </ThemeProvider>
      </SettingsProvider>
    </SavedAffirmationsProvider>
  );
}
