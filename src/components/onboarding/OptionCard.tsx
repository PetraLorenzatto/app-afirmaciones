import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { COLORS } from '@/theme/colors';

export function OptionCard({
  emoji,
  label,
  description,
  selected,
  onPress,
  disabled,
}: {
  emoji: string;
  label: string;
  description?: string;
  selected: boolean;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <TouchableOpacity
      style={[styles.card, selected && styles.cardSelected, disabled && styles.cardDisabled]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.85}>
      <Text style={styles.emoji}>{emoji}</Text>
      <View style={styles.textWrapper}>
        <Text style={[styles.label, selected && styles.labelSelected]}>{label}</Text>
        {description ? (
          <Text style={[styles.description, selected && styles.descriptionSelected]}>{description}</Text>
        ) : null}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: COLORS.chipInactiveBg,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  cardSelected: {
    backgroundColor: COLORS.chipActiveBg,
    borderColor: COLORS.gold,
  },
  cardDisabled: {
    opacity: 0.4,
  },
  emoji: {
    fontSize: 22,
  },
  textWrapper: {
    flex: 1,
  },
  label: {
    color: COLORS.textLight,
    fontSize: 16,
    fontWeight: '600',
  },
  labelSelected: {
    color: COLORS.chipActiveText,
  },
  description: {
    color: COLORS.textMuted,
    fontSize: 13,
    marginTop: 4,
    lineHeight: 18,
  },
  descriptionSelected: {
    color: COLORS.chipActiveText,
    opacity: 0.85,
  },
});
