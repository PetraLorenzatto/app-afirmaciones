import { Ionicons } from '@expo/vector-icons';
import { Modal, Pressable, StyleSheet, Text, TouchableOpacity } from 'react-native';

import { CATEGORIES } from '@/data/affirmations';
import { useTheme } from '@/context/ThemeContext';
import { COLORS } from '@/theme/colors';
import type { Category } from '@/types';

export function CategoryMenu({
  visible,
  selected,
  onSelect,
  onClose,
}: {
  visible: boolean;
  selected: Category;
  onSelect: (category: Category) => void;
  onClose: () => void;
}) {
  const { fonts } = useTheme();
  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.sheet}>
          <Text style={[styles.title, { fontFamily: fonts.serifSemiBold }]}>Elegí una categoría</Text>
          {CATEGORIES.map((category) => {
            const isActive = category.key === selected;
            return (
              <TouchableOpacity
                key={category.key}
                style={[styles.row, isActive && styles.rowActive]}
                onPress={() => {
                  onSelect(category.key);
                  onClose();
                }}
                activeOpacity={0.8}>
                <Ionicons
                  name={category.icon as keyof typeof Ionicons.glyphMap}
                  size={20}
                  color={isActive ? COLORS.chipActiveText : COLORS.textLight}
                />
                <Text style={[styles.label, isActive && styles.labelActive]}>{category.label}</Text>
              </TouchableOpacity>
            );
          })}
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
