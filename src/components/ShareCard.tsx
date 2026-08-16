import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/context/ThemeContext';
import { COLORS } from '@/theme/colors';

const CARD_WIDTH = 360;
const CARD_HEIGHT = 480;

export function ShareCard({ text }: { text: string }) {
  const { gradientColors, fonts } = useTheme();

  return (
    <View style={styles.wrapper}>
      <LinearGradient colors={gradientColors} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={styles.card}>
        <Text style={[styles.quoteMark, { fontFamily: fonts.serifSemiBold }]}>“</Text>
        <Text style={[styles.text, { fontFamily: fonts.serif }]}>{text}</Text>
        <Text style={[styles.brand, { fontFamily: fonts.serifSemiBold }]}>Afirmaciones</Text>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
  },
  card: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  quoteMark: {
    fontSize: 40,
    color: COLORS.gold,
    lineHeight: 40,
    marginBottom: 10,
  },
  text: {
    fontSize: 22,
    lineHeight: 30,
    color: COLORS.textLight,
    textAlign: 'center',
  },
  brand: {
    position: 'absolute',
    bottom: 24,
    fontSize: 13,
    color: COLORS.goldSoft,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
});
