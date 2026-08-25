import { Stack } from 'expo-router';

import { OnboardingProvider } from '@/context/OnboardingContext';
import { SUNRISE_GRADIENT } from '@/theme/colors';

export default function OnboardingLayout() {
  return (
    <OnboardingProvider>
      <Stack
        initialRouteName="welcome"
        screenOptions={{ headerShown: false, contentStyle: { backgroundColor: SUNRISE_GRADIENT[0] } }}
      />
    </OnboardingProvider>
  );
}
