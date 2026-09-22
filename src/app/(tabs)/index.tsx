import { Ionicons } from '@expo/vector-icons';
import * as Sharing from 'expo-sharing';
import { useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn, useAnimatedStyle, useSharedValue, withSequence, withTiming } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { GradientBackground } from '@/components/GradientBackground';
import { ShareCard } from '@/components/ShareCard';
import { StreakBadge } from '@/components/StreakBadge';
import { MoodPicker } from '@/components/today/MoodPicker';
import { PrimaryButton } from '@/components/onboarding/PrimaryButton';
import { useSavedAffirmations } from '@/context/SavedAffirmationsContext';
import { useTheme } from '@/context/ThemeContext';
import { useUserProfile } from '@/context/UserProfileContext';
import { findAffirmationCategory } from '@/data/todayContent';
import { MAX_MICRO_ACTION_REROLLS, useTodayEntry } from '@/hooks/useTodayEntry';
import { COLORS } from '@/theme/colors';
import type { DailyEntry } from '@/types';
import { getGreeting } from '@/utils/greeting';

type Phase = 'checkin' | 'today' | 'committed' | 'completed';

function getPhase(entry: DailyEntry | null): Phase {
  if (!entry || entry.morningMood === null) return 'checkin';
  if (entry.microActionCompleted) return 'completed';
  if (entry.microActionAccepted) return 'committed';
  return 'today';
}

export default function HoyScreen() {
  const { profile } = useUserProfile();
  const { entry, loading, checkIn, rerollMicroAction, commit, complete } = useTodayEntry(profile);
  const { toggleFavorite, isSaved } = useSavedAffirmations();
  const { fonts } = useTheme();
  const [shareText, setShareText] = useState<string | null>(null);
  const shareViewRef = useRef<View>(null);

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

  if (loading) {
    return (
      <GradientBackground>
        <SafeAreaView style={styles.safeArea} />
      </GradientBackground>
    );
  }

  const phase = getPhase(entry);
  const affirmationText = entry?.affirmationText ?? null;
  const microActionText = entry?.microActionText ?? null;
  const affirmationCategory = affirmationText ? findAffirmationCategory(affirmationText) : null;
  const canReroll = !!entry && entry.microActionRerollCount < MAX_MICRO_ACTION_REROLLS;

  return (
    <GradientBackground>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.headerRow}>
          <Text style={[styles.greeting, { fontFamily: fonts.serifSemiBold }]}>{getGreeting(profile.name)}</Text>
          <StreakBadge />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {phase === 'checkin' && (
            <Animated.View entering={FadeIn.duration(300)} style={styles.checkinWrapper}>
              <Text style={[styles.question, { fontFamily: fonts.serifSemiBold }]}>¿Cómo llegás hoy?</Text>
              <MoodPicker onSelect={checkIn} />
            </Animated.View>
          )}

          {phase !== 'checkin' && (
            <View style={styles.content}>
              {affirmationText && (
                <Animated.View entering={FadeIn.duration(400)} style={styles.section}>
                  <Text style={styles.sectionLabel}>Para vos hoy</Text>
                  <Text style={[styles.quoteMark, { fontFamily: fonts.serifSemiBold }]}>“</Text>
                  <Text style={[styles.affirmationText, { fontFamily: fonts.serif }]}>{affirmationText}</Text>
                  <View style={styles.actionsRow}>
                    <HeartButton
                      active={!!affirmationCategory && isSaved(affirmationText, affirmationCategory)}
                      onPress={() => affirmationCategory && toggleFavorite(affirmationText, affirmationCategory)}
                    />
                    <TouchableOpacity
                      style={styles.shareButton}
                      onPress={() => setShareText(affirmationText)}
                      activeOpacity={0.8}
                      hitSlop={12}>
                      <Ionicons name="share-outline" size={24} color={COLORS.textLight} />
                    </TouchableOpacity>
                  </View>
                </Animated.View>
              )}

              {phase === 'today' && microActionText && (
                <Animated.View entering={FadeIn.duration(400).delay(150)} style={styles.microActionCard}>
                  <Text style={styles.sectionLabel}>Un pequeño paso</Text>
                  <Text style={styles.microActionText}>{microActionText}</Text>
                  <PrimaryButton label="Me comprometo" onPress={commit} />
                  {canReroll && (
                    <TouchableOpacity onPress={rerollMicroAction} activeOpacity={0.7} style={styles.rerollButton}>
                      <Text style={styles.rerollText}>Dame otro</Text>
                    </TouchableOpacity>
                  )}
                </Animated.View>
              )}

              {phase === 'committed' && microActionText && (
                <Animated.View entering={FadeIn.duration(400).delay(150)} style={styles.microActionCard}>
                  <Text style={styles.sectionLabel}>Tu paso de hoy</Text>
                  <Text style={styles.microActionText}>{microActionText}</Text>
                  <Text style={styles.statusText}>En marcha 🌱</Text>
                  <PrimaryButton label="✓ Ya lo hice" onPress={complete} />
                </Animated.View>
              )}

              {phase === 'completed' && microActionText && (
                <Animated.View entering={FadeIn.duration(400).delay(150)} style={styles.microActionCard}>
                  <Text style={styles.doneText}>Pequeño paso completado ✓</Text>
                  <Text style={styles.microActionText}>{microActionText}</Text>
                  <Text style={styles.confirmationText}>Hecho por hoy ✨</Text>
                </Animated.View>
              )}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>

      {shareText && (
        <View ref={shareViewRef} collapsable={false} style={styles.offscreenCapture}>
          <ShareCard text={shareText} />
        </View>
      )}
    </GradientBackground>
  );
}

function HeartButton({ active, onPress }: { active: boolean; onPress: () => void }) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const handlePress = () => {
    // react-native-reanimated: asignar `.value` es la API prevista para mutar un shared
    // value desde un event handler (corre en el hilo de UI, no es estado de React); el
    // lint de reglas de hooks todavía no reconoce ese patrón como seguro.
    // eslint-disable-next-line react-hooks/immutability
    scale.value = withSequence(withTiming(1.3, { duration: 120 }), withTiming(1, { duration: 120 }));
    onPress();
  };

  return (
    <TouchableOpacity style={styles.heartButton} onPress={handlePress} activeOpacity={0.8} hitSlop={12}>
      <Animated.View style={animatedStyle}>
        <Ionicons
          name={active ? 'heart' : 'heart-outline'}
          size={26}
          color={active ? COLORS.gold : COLORS.textLight}
        />
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingHorizontal: 24,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    paddingBottom: 4,
  },
  greeting: {
    fontSize: 22,
    color: COLORS.textLight,
    flexShrink: 1,
    paddingRight: 12,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  checkinWrapper: {
    flex: 1,
    justifyContent: 'center',
    gap: 28,
    paddingBottom: 60,
  },
  question: {
    fontSize: 24,
    color: COLORS.textLight,
    textAlign: 'center',
  },
  content: {
    gap: 36,
    paddingTop: 24,
  },
  section: {
    alignItems: 'center',
  },
  sectionLabel: {
    color: COLORS.textMuted,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 14,
  },
  quoteMark: {
    fontSize: 40,
    color: COLORS.gold,
    lineHeight: 40,
    marginBottom: 8,
  },
  affirmationText: {
    fontSize: 24,
    lineHeight: 34,
    color: COLORS.textLight,
    textAlign: 'center',
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
    marginTop: 20,
  },
  heartButton: {},
  shareButton: {},
  microActionCard: {
    backgroundColor: COLORS.chipInactiveBg,
    borderRadius: 24,
    padding: 22,
    gap: 14,
  },
  microActionText: {
    color: COLORS.textLight,
    fontSize: 17,
    lineHeight: 25,
  },
  statusText: {
    color: COLORS.goldSoft,
    fontSize: 14,
    fontWeight: '600',
  },
  doneText: {
    color: COLORS.gold,
    fontSize: 15,
    fontWeight: '700',
  },
  confirmationText: {
    color: COLORS.textMuted,
    fontSize: 14,
    marginTop: 2,
  },
  rerollButton: {
    alignSelf: 'center',
  },
  rerollText: {
    color: COLORS.textMuted,
    fontSize: 13,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  offscreenCapture: {
    position: 'absolute',
    left: -9999,
    top: 0,
  },
});
