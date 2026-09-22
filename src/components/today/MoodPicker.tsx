import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { COLORS } from '@/theme/colors';
import type { Mood } from '@/types';

const MOOD_OPTIONS: { key: Mood; emoji: string; label: string }[] = [
  { key: 'very_low', emoji: '😞', label: 'Muy mal' },
  { key: 'low', emoji: '😕', label: 'No muy bien' },
  { key: 'neutral', emoji: '😐', label: 'Normal' },
  { key: 'good', emoji: '🙂', label: 'Bien' },
  { key: 'great', emoji: '🔥', label: 'Genial' },
];

export function MoodPicker({ onSelect }: { onSelect: (mood: Mood) => void }) {
  return (
    <View style={styles.row}>
      {MOOD_OPTIONS.map((option) => (
        <TouchableOpacity
          key={option.key}
          style={styles.option}
          onPress={() => onSelect(option.key)}
          activeOpacity={0.7}
          hitSlop={6}>
          <Text style={styles.emoji}>{option.emoji}</Text>
          <Text style={styles.label}>{option.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  option: {
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  emoji: {
    fontSize: 34,
  },
  label: {
    color: COLORS.textMuted,
    fontSize: 11,
    textAlign: 'center',
  },
});
