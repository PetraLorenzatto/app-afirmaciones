import { Ionicons } from '@expo/vector-icons';
import * as Sharing from 'expo-sharing';
import { useEffect, useRef, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View, type ViewToken } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withTiming } from 'react-native-reanimated';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { CategoryMenu } from '@/components/CategoryMenu';
import { GradientBackground } from '@/components/GradientBackground';
import { ShareCard } from '@/components/ShareCard';
import { StreakBadge } from '@/components/StreakBadge';
import { useSavedAffirmations } from '@/context/SavedAffirmationsContext';
import { useStreak } from '@/context/StreakContext';
import { useTheme } from '@/context/ThemeContext';
import { useAffirmationFeed } from '@/hooks/useAffirmationFeed';
import { COLORS } from '@/theme/colors';
import type { Category } from '@/types';

export default function HoyScreen() {
  const [category, setCategory] = useState<Category>('calma');
  const [menuVisible, setMenuVisible] = useState(false);
  const [pageHeight, setPageHeight] = useState(0);
  const [shareText, setShareText] = useState<string | null>(null);
  const { saved, toggleFavorite, isSaved } = useSavedAffirmations();
  const { markRead } = useStreak();
  const { fonts } = useTheme();
  const feed = useAffirmationFeed(category, saved);
  const insets = useSafeAreaInsets();
  const shareViewRef = useRef<View>(null);

  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 90 }).current;
  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    const first = viewableItems[0];
    if (first?.isViewable && typeof first.item === 'string') {
      markRead(first.item);
    }
  }).current;

  useEffect(() => {
    if (!shareText) return;
    const frame = requestAnimationFrame(async () => {
      try {
        // Import dinámico: react-native-view-shot usa un módulo nativo que Expo Go no
        // incluye. Si se importara arriba del archivo, tirar abajo toda la pantalla "Hoy"
        // en Expo Go (aunque nunca se toque "compartir"). Al importarlo acá adentro, solo
        // falla —silenciosamente, atajado por este try/catch— si de verdad se usa la función,
        // y recién hace falta un dev build para que funcione de verdad.
        const { captureRef } = await import('react-native-view-shot');
        const uri = await captureRef(shareViewRef, { format: 'png', quality: 1 });
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(uri, { mimeType: 'image/png', dialogTitle: 'Compartir afirmación' });
        }
      } catch {
        // Función de compartir casual: si falla, no interrumpimos la experiencia con un alert.
      } finally {
        setShareText(null);
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [shareText]);

  return (
    <GradientBackground>
      <SafeAreaView
        style={styles.safeArea}
        onLayout={(event) => setPageHeight(event.nativeEvent.layout.height)}>
        <View style={[styles.streakBadgeWrapper, { top: insets.top + 12 }]}>
          <StreakBadge />
        </View>

        <TouchableOpacity
          style={[styles.menuButton, { top: insets.top + 12 }]}
          onPress={() => setMenuVisible(true)}
          activeOpacity={0.8}>
          <Ionicons name="apps-outline" size={20} color={COLORS.textLight} />
        </TouchableOpacity>

        {pageHeight > 0 && (
          <FlatList
            key={category}
            data={feed}
            extraData={saved}
            keyExtractor={(item, index) => `${index}-${item.slice(0, 16)}`}
            pagingEnabled
            showsVerticalScrollIndicator={false}
            snapToInterval={pageHeight}
            decelerationRate="fast"
            viewabilityConfig={viewabilityConfig}
            onViewableItemsChanged={onViewableItemsChanged}
            getItemLayout={(_, index) => ({ length: pageHeight, offset: pageHeight * index, index })}
            renderItem={({ item }) => (
              <View style={[styles.page, { height: pageHeight }]}>
                <Text style={[styles.quoteMark, { fontFamily: fonts.serifSemiBold }]}>“</Text>
                <Text style={[styles.text, { fontFamily: fonts.serif }]}>{item}</Text>
                <View style={styles.actionsRow}>
                  <HeartButton
                    active={isSaved(item, category)}
                    onPress={() => toggleFavorite(item, category)}
                  />
                  <TouchableOpacity
                    style={styles.shareButton}
                    onPress={() => setShareText(item)}
                    activeOpacity={0.8}
                    hitSlop={12}>
                    <Ionicons name="share-outline" size={26} color={COLORS.textLight} />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        )}
      </SafeAreaView>

      {shareText && (
        <View ref={shareViewRef} collapsable={false} style={styles.offscreenCapture}>
          <ShareCard text={shareText} />
        </View>
      )}

      <CategoryMenu
        visible={menuVisible}
        selected={category}
        onSelect={setCategory}
        onClose={() => setMenuVisible(false)}
      />
    </GradientBackground>
  );
}

function HeartButton({ active, onPress }: { active: boolean; onPress: () => void }) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const handlePress = () => {
    scale.value = withSequence(withTiming(1.3, { duration: 120 }), withTiming(1, { duration: 120 }));
    onPress();
  };

  return (
    <TouchableOpacity style={styles.heartButton} onPress={handlePress} activeOpacity={0.8} hitSlop={12}>
      <Animated.View style={animatedStyle}>
        <Ionicons
          name={active ? 'heart' : 'heart-outline'}
          size={28}
          color={active ? COLORS.gold : COLORS.textLight}
        />
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  streakBadgeWrapper: {
    position: 'absolute',
    left: 20,
    zIndex: 10,
  },
  menuButton: {
    position: 'absolute',
    right: 20,
    zIndex: 10,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(251, 243, 230, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  page: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 36,
  },
  quoteMark: {
    fontSize: 48,
    color: COLORS.gold,
    lineHeight: 48,
    marginBottom: 12,
  },
  text: {
    fontSize: 28,
    lineHeight: 40,
    color: COLORS.textLight,
    textAlign: 'center',
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 28,
    marginTop: 28,
  },
  heartButton: {},
  shareButton: {},
  offscreenCapture: {
    position: 'absolute',
    left: -9999,
    top: 0,
  },
});
