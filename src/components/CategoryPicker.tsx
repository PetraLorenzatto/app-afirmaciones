import { Ionicons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';

import { CATEGORIES } from '@/data/affirmations';
import { COLORS } from '@/theme/colors';
import type { Category } from '@/types';

export function CategoryPicker({
  selected,
  onSelect,
}: {
  selected: Category;
  onSelect: (category: Category) => void;
}) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}>
      {CATEGORIES.map((category) => {
        const isActive = category.key === selected;
        return (
          <TouchableOpacity
            key={category.key}
            onPress={() => onSelect(category.key)}
            style={[styles.chip, isActive && styles.chipActive]}
            activeOpacity={0.8}>
            <Ionicons
              name={category.icon as keyof typeof Ionicons.glyphMap}
              size={16}
              color={isActive ? COLORS.chipActiveText : COLORS.textLight}
              style={styles.icon}
            />
            <Text style={[styles.label, isActive && styles.labelActive]}>{category.label}</Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    gap: 10,
    paddingHorizontal: 4,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: COLORS.chipInactiveBg,
  },
  chipActive: {
    backgroundColor: COLORS.chipActiveBg,
  },
  icon: {
    marginRight: 6,
  },
  label: {
    color: COLORS.textLight,
    fontWeight: '600',
    fontSize: 14,
  },
  labelActive: {
    color: COLORS.chipActiveText,
  },
});
