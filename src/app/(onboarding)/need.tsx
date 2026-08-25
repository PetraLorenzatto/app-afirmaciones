import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { GradientBackground } from '@/components/GradientBackground';
import { OnboardingHeader } from '@/components/onboarding/OnboardingHeader';
import { OptionCard } from '@/components/onboarding/OptionCard';
import { PrimaryButton } from '@/components/onboarding/PrimaryButton';
import { useOnboarding } from '@/context/OnboardingContext';
import { useTheme } from '@/context/ThemeContext';
import { NEED_OPTIONS } from '@/data/onboarding';
import { COLORS } from '@/theme/colors';

export default function NeedScreen() {
  const router = useRouter();
  const { fonts } = useTheme();
  const { draft, setCurrentNeed } = useOnboarding();

  return (
    <GradientBackground>
      <SafeAreaView style={styles.safeArea}>
        <OnboardingHeader step={3} />

        <Text style={[styles.title, { fontFamily: fonts.serifSemiBold }]}>
          ¿Qué sentís que necesitás más últimamente?
        </Text>

        <ScrollView
          style={styles.list}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}>
          {NEED_OPTIONS.map((option) => (
            <OptionCard
              key={option.key}
              emoji={option.emoji}
              label={option.label}
              selected={draft.currentNeed === option.key}
              onPress={() => setCurrentNeed(option.key)}
            />
          ))}
        </ScrollView>

        <PrimaryButton
          label="Continuar"
          onPress={() => router.push('/(onboarding)/tone')}
          disabled={!draft.currentNeed}
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
