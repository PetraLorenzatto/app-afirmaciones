import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

import { SavedAffirmationsProvider } from '@/context/SavedAffirmationsContext';
import { SettingsProvider } from '@/context/SettingsContext';
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
        <StatusBar style="light" />
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: SUNRISE_GRADIENT[0] } }}>
          <Stack.Screen name="(tabs)" />
        </Stack>
      </SettingsProvider>
    </SavedAffirmationsProvider>
  );
}
