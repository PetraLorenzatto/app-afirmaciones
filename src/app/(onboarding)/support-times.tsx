import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { GradientBackground } from '@/components/GradientBackground';
import { OnboardingHeader } from '@/components/onboarding/OnboardingHeader';
import { OptionCard } from '@/components/onboarding/OptionCard';
import { PrimaryButton } from '@/components/onboarding/PrimaryButton';
import { useOnboarding } from '@/context/OnboardingContext';
import { useTheme } from '@/context/ThemeContext';
import { SUPPORT_TIME_OPTIONS } from '@/data/onboarding';
import { COLORS } from '@/theme/colors';

export default function SupportTimesScreen() {
  const router = useRouter();
  const { fonts } = useTheme();
  const { draft, toggleSupportTime } = useOnboarding();

  const canContinue = draft.supportTimes.length >= 1;

  return (
    <GradientBackground>
      <SafeAreaView style={styles.safeArea}>
        <OnboardingHeader step={5} />

        <Text style={[styles.title, { fontFamily: fonts.serifSemiBold }]}>
          ¿Cuándo te gustaría que estemos ahí?
        </Text>

        <ScrollView
          style={styles.list}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}>
          {SUPPORT_TIME_OPTIONS.map((option) => (
            <OptionCard
              key={option.key}
              emoji={option.emoji}
              label={option.label}
              selected={draft.supportTimes.includes(option.key)}
              onPress={() => toggleSupportTime(option.key)}
            />
          ))}
        </ScrollView>

        <PrimaryButton
          label="Continuar"
          onPress={() => router.push('/(onboarding)/complete')}
          disabled={!canContinue}
        />
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 24,
  },
  title: {
    fontSize: 26,
    color: COLORS.textLight,
    marginBottom: 20,
  },
  list: {
    flex: 1,
  },
  listContent: {
    gap: 10,
    paddingBottom: 12,
  },
});
