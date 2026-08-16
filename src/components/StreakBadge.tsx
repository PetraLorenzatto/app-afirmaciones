import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withSpring, withTiming } from 'react-native-reanimated';

import { useStreak } from '@/context/StreakContext';
import { COLORS } from '@/theme/colors';

export function StreakBadge() {
  const { streak, todayCount, goal, goalCompletedToday } = useStreak();
  const scale = useSharedValue(1);
  const wasCompleted = useRef(goalCompletedToday);

  useEffect(() => {
    if (goalCompletedToday && !wasCompleted.current) {
      scale.value = withSequence(withTiming(1.25, { duration: 150 }), withSpring(1));
    }
    wasCompleted.current = goalCompletedToday;
  }, [goalCompletedToday, scale]);

  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <Ionicons name="flame" size={18} color={COLORS.gold} />
      <View>
        <Text style={styles.streakText}>{streak}</Text>
        {!goalCompletedToday && (
          <Text style={styles.progressText}>
            {todayCount}/{goal}
          </Text>
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(251, 243, 230, 0.15)',
    borderRadius: 21,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  streakText: {
    color: COLORS.textLight,
    fontWeight: '700',
    fontSize: 15,
    lineHeight: 17,
  },
  progressText: {
    color: COLORS.textMuted,
    fontSize: 10,
    lineHeight: 12,
  },
});
