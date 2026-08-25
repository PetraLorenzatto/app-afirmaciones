import { StyleSheet, Text, TouchableOpacity } from 'react-native';

import { COLORS } from '@/theme/colors';

export function PrimaryButton({
  label,
  onPress,
  disabled,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.buttonDisabled]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.85}>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.chipActiveBg,
    paddingVertical: 16,
    borderRadius: 28,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  label: {
    color: COLORS.chipActiveText,
    fontWeight: '700',
    fontSize: 16,
  },
});
