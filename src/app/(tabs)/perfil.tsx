import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { GradientBackground } from '@/components/GradientBackground';
import { useTheme } from '@/context/ThemeContext';
import { COLORS } from '@/theme/colors';

export default function PerfilScreen() {
  const router = useRouter();
  const { fonts } = useTheme();

  return (
    <GradientBackground>
      <SafeAreaView style={styles.safeArea}>
        <Text style={[styles.heading, { fontFamily: fonts.serifSemiBold }]}>Perfil</Text>

        <Text style={styles.sectionLabel}>Preferencias</Text>

        <TouchableOpacity
          style={styles.row}
          onPress={() => router.push('/ajustes')}
          activeOpacity={0.85}>
          <View style={styles.rowIcon}>
            <Ionicons name="settings-outline" size={18} color={COLORS.chipActiveText} />
          </View>
          <View style={styles.rowTextWrapper}>
            <Text style={styles.rowTitle}>Ajustes</Text>
            <Text style={styles.rowSubtitle}>Notificaciones, fondo y tipografía.</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
        </TouchableOpacity>
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  heading: {
    fontSize: 30,
    color: COLORS.textLight,
    marginBottom: 24,
  },
  sectionLabel: {
    color: COLORS.textMuted,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.chipInactiveBg,
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  rowIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.chipActiveBg,
  },
  rowTextWrapper: {
    flex: 1,
  },
  rowTitle: {
    color: COLORS.textLight,
    fontSize: 16,
    fontWeight: '600',
  },
  rowSubtitle: {
    color: COLORS.textMuted,
    fontSize: 13,
    marginTop: 2,
  },
});
