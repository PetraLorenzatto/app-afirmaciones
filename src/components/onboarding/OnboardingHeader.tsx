import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { COLORS } from '@/theme/colors';

const TOTAL_STEPS = 6;

export function OnboardingHeader({ step, showBack = true }: { step: number; showBack?: boolean }) {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        {showBack ? (
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton} activeOpacity={0.8}>
            <Ionicons name="chevron-back" size={22} color={COLORS.textLight} />
          </TouchableOpacity>
        ) : (
          <View style={styles.backButtonPlaceholder} />
        )}
        <Text style={styles.stepLabel}>
          {step} de {TOTAL_STEPS}
        </Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${(step / TOTAL_STEPS) * 100}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.chipInactiveBg,
  },
  backButtonPlaceholder: {
    width: 36,
    height: 36,
  },
  stepLabel: {
    color: COLORS.textMuted,
    fontSize: 13,
    fontWeight: '600',
  },
  track: {
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.chipInactiveBg,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 2,
    backgroundColor: COLORS.gold,
  },
});
