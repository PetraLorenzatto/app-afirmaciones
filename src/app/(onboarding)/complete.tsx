import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { GradientBackground } from '@/components/GradientBackground';
import { OnboardingHeader } from '@/components/onboarding/OnboardingHeader';
import { PrimaryButton } from '@/components/onboarding/PrimaryButton';
import { useOnboarding } from '@/context/OnboardingContext';
import { useTheme } from '@/context/ThemeContext';
import { useUserProfile } from '@/context/UserProfileContext';
import { COLORS } from '@/theme/colors';

export default function CompleteScreen() {
  const { fonts } = useTheme();
  const { draft } = useOnboarding();
  const { completeOnboarding } = useUserProfile();

  // Al persistir onboardingCompleted:true, el layout raíz redirige solo a (tabs)
  // (ver Stack.Screen redirect en src/app/_layout.tsx) — no hace falta navegar a mano.
  const finish = () => {
    completeOnboarding(draft);
  };

  return (
    <GradientBackground>
      <SafeAreaView style={styles.safeArea}>
        <OnboardingHeader step={6} />

        <View style={styles.content}>
          <Text style={[styles.title, { fontFamily: fonts.serifSemiBold }]}>
            {draft.name ? `Ya está, ${draft.name}. ✨` : 'Ya está. ✨'}
          </Text>
          <Text style={styles.body}>
            Este espacio va a ir creciendo con vos.{'\n\n'}
            No necesitás cambiar todo de golpe. Empecemos por hoy.
          </Text>
        </View>

        <PrimaryButton label="Ir a mi día" onPress={finish} />
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 12,
    paddingBottom: 24,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 30,
    lineHeight: 38,
    color: COLORS.textLight,
    marginBottom: 20,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.textMuted,
  },
});
