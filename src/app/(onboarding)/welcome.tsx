import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { GradientBackground } from '@/components/GradientBackground';
import { PrimaryButton } from '@/components/onboarding/PrimaryButton';
import { useTheme } from '@/context/ThemeContext';
import { COLORS } from '@/theme/colors';

export default function WelcomeScreen() {
  const router = useRouter();
  const { fonts } = useTheme();

  return (
    <GradientBackground>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <Text style={[styles.title, { fontFamily: fonts.serifSemiBold }]}>
            Este espacio es para vos.
          </Text>
          <Text style={styles.body}>
            No se trata de ser positiva todo el tiempo. Se trata de conocerte, acompañarte y avanzar a
            tu manera.
          </Text>
        </View>

        <PrimaryButton label="Empezar" onPress={() => router.push('/(onboarding)/name')} />
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 24,
    paddingBottom: 24,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 34,
    lineHeight: 42,
    color: COLORS.textLight,
    marginBottom: 20,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.textMuted,
  },
});
