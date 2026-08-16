import { LinearGradient } from 'expo-linear-gradient';
import { Modal, Pressable, StyleSheet, Text, TouchableOpacity } from 'react-native';

import { useTheme } from '@/context/ThemeContext';
import { COLORS } from '@/theme/colors';
import { GRADIENT_PRESETS } from '@/theme/gradients';
import type { GradientKey } from '@/types';

export function GradientPickerSheet({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const { prefs, fonts, setGradient } = useTheme();

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.sheet}>
          <Text style={[styles.title, { fontFamily: fonts.serifSemiBold }]}>Elegí un fondo</Text>
          {(Object.entries(GRADIENT_PRESETS) as [GradientKey, (typeof GRADIENT_PRESETS)[GradientKey]][]).map(
            ([key, preset]) => {
              const isActive = key === prefs.gradient;
              return (
                <TouchableOpacity
                  key={key}
                  style={[styles.row, isActive && styles.rowActive]}
                  onPress={() => {
                    setGradient(key);
                    onClose();
                  }}
                  activeOpacity={0.8}>
                  <LinearGradient
                    colors={preset.colors}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={styles.swatch}
                  />
                  <Text style={[styles.label, isActive && styles.labelActive]}>{preset.label}</Text>
                </TouchableOpacity>
              );
            }
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#241b3d',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 40,
    gap: 8,
  },
  title: {
    fontSize: 20,
    color: COLORS.textLight,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 14,
  },
  rowActive: {
    backgroundColor: COLORS.chipActiveBg,
  },
  swatch: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  label: {
    color: COLORS.textLight,
    fontSize: 16,
    fontWeight: '600',
  },
  labelActive: {
    color: COLORS.chipActiveText,
    fontWeight: '700',
  },
});
