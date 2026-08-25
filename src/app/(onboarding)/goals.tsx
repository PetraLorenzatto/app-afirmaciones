import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { GradientBackground } from '@/components/GradientBackground';
import { OnboardingHeader } from '@/components/onboarding/OnboardingHeader';
import { OptionCard } from '@/components/onboarding/OptionCard';
import { PrimaryButton } from '@/components/onboarding/PrimaryButton';
import { MAX_GOALS, useOnboarding } from '@/context/OnboardingContext';
import { useTheme } from '@/context/ThemeContext';
import { GOAL_OPTIONS } from '@/data/onboarding';
import { COLORS } from '@/theme/colors';

export default function GoalsScreen() {
  const router = useRouter();
  const { fonts } = useTheme();
  const { draft, toggleGoal } = useOnboarding();

  const canContinue = draft.goals.length >= 1;

  return (
    <GradientBackground>
      <SafeAreaView style={styles.safeArea}>
        <OnboardingHeader step={2} />

        <Text style={[styles.title, { fontFamily: fonts.serifSemiBold }]}>
          ¿Qué te gustaría fortalecer?
        </Text>
        <Text style={styles.subtitle}>Elegí hasta 3.</Text>
        <Text style={styles.counter}>
          {draft.goals.length} de {MAX_GOALS} elegidos
        </Text>

        <ScrollView
          style={styles.list}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}>
          {GOAL_OPTIONS.map((option) => {
            const selected = draft.goals.includes(option.key);
            return (
              <OptionCard
                key={option.key}
                emoji={option.emoji}
                label={option.label}
                selected={selected}
                onPress={() => toggleGoal(option.key)}
                disabled={!selected && draft.goals.length >= MAX_GOALS}
              />
            );
          })}
        </ScrollView>

        <PrimaryButton
          label="Continuar"
          onPress={() => router.push('/(onboarding)/need')}
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
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textMuted,
  },
  counter: {
    fontSize: 13,
    color: COLORS.gold,
    fontWeight: '700',
    marginTop: 8,
    marginBottom: 16,
  },
  list: {
    flex: 1,
  },
  listContent: {
    gap: 10,
    paddingBottom: 12,
  },
});
