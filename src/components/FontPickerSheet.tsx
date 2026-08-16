import { Modal, Pressable, StyleSheet, Text, TouchableOpacity } from 'react-native';

import { useTheme } from '@/context/ThemeContext';
import { COLORS } from '@/theme/colors';
import { FONT_PRESETS } from '@/theme/fonts';
import type { FontKey } from '@/types';

export function FontPickerSheet({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const { prefs, fonts, setFont } = useTheme();

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.sheet}>
          <Text style={[styles.title, { fontFamily: fonts.serifSemiBold }]}>Elegí una tipografía</Text>
          {(Object.entries(FONT_PRESETS) as [FontKey, (typeof FONT_PRESETS)[FontKey]][]).map(
            ([key, preset]) => {
              const isActive = key === prefs.font;
              return (
                <TouchableOpacity
                  key={key}
                  style={[styles.row, isActive && styles.rowActive]}
                  onPress={() => {
                    setFont(key);
                    onClose();
                  }}
                  activeOpacity={0.8}>
                  <Text
                    style={[
                      styles.label,
                      { fontFamily: preset.family.serifSemiBold },
                      isActive && styles.labelActive,
                    ]}>
                    {preset.label}
                  </Text>
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
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 14,
  },
  rowActive: {
    backgroundColor: COLORS.chipActiveBg,
  },
  label: {
    color: COLORS.textLight,
    fontSize: 18,
  },
  labelActive: {
    color: COLORS.chipActiveText,
  },
});
