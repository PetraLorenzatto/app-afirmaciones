import { useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { GradientBackground } from '@/components/GradientBackground';
import { OnboardingHeader } from '@/components/onboarding/OnboardingHeader';
import { PrimaryButton } from '@/components/onboarding/PrimaryButton';
import { useOnboarding } from '@/context/OnboardingContext';
import { useTheme } from '@/context/ThemeContext';
import { COLORS } from '@/theme/colors';

export default function NameScreen() {
  const router = useRouter();
  const { fonts } = useTheme();
  const { draft, setName } = useOnboarding();
  const [value, setValue] = useState(draft.name ?? '');

  const goNext = () => {
    setName(value.trim() || null);
    router.push('/(onboarding)/goals');
  };

  const skip = () => {
    setName(null);
    router.push('/(onboarding)/goals');
  };

  return (
    <GradientBackground>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <SafeAreaView style={styles.safeArea}>
          <OnboardingHeader step={1} />

          <Text style={[styles.title, { fontFamily: fonts.serifSemiBold }]}>
            ¿Cómo querés que te llamemos?
          </Text>
          <Text style={styles.subtitle}>Lo usaremos para hacer tu experiencia más personal.</Text>

          <TextInput
            value={value}
            onChangeText={setValue}
            placeholder="Tu nombre"
            placeholderTextColor={COLORS.textMuted}
            style={styles.input}
            autoCapitalize="words"
            returnKeyType="done"
            onSubmitEditing={goNext}
          />

          <View style={styles.spacer} />

          <TouchableOpacity onPress={skip} style={styles.skipButton} activeOpacity={0.7}>
            <Text style={styles.skipText}>Prefiero no decirlo</Text>
          </TouchableOpacity>

          <PrimaryButton label="Continuar" onPress={goNext} />
        </SafeAreaView>
      </KeyboardAvoidingView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 24,
  },
  title: {
    fontSize: 26,
    color: COLORS.textLight,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textMuted,
    marginBottom: 24,
  },
  input: {
    backgroundColor: COLORS.chipInactiveBg,
    borderRadius: 16,
    padding: 16,
    color: COLORS.textLight,
    fontSize: 16,
  },
  spacer: {
    flex: 1,
  },
  skipButton: {
    alignSelf: 'center',
    marginBottom: 16,
  },
  skipText: {
    color: COLORS.textMuted,
    fontSize: 14,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});
