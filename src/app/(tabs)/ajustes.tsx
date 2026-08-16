import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { Platform, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FontPickerSheet } from '@/components/FontPickerSheet';
import { GradientBackground } from '@/components/GradientBackground';
import { GradientPickerSheet } from '@/components/GradientPickerSheet';
import { useSettings } from '@/context/SettingsContext';
import { useTheme } from '@/context/ThemeContext';
import { COLORS } from '@/theme/colors';
import { FONT_PRESETS } from '@/theme/fonts';
import { GRADIENT_PRESETS } from '@/theme/gradients';

function formatTime(hour: number, minute: number): string {
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}

export default function AjustesScreen() {
  const { settings, permissionDenied, setEnabled, setTime } = useSettings();
  const { prefs, fonts } = useTheme();
  const [showIosPicker, setShowIosPicker] = useState(false);
  const [gradientPickerVisible, setGradientPickerVisible] = useState(false);
  const [fontPickerVisible, setFontPickerVisible] = useState(false);

  const currentDate = useMemo(() => {
    const date = new Date();
    date.setHours(settings.hour, settings.minute, 0, 0);
    return date;
  }, [settings.hour, settings.minute]);

  const openPicker = () => {
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: currentDate,
        mode: 'time',
        is24Hour: true,
        onChange: (event, date) => {
          if (event.type === 'set' && date) {
            setTime(date.getHours(), date.getMinutes());
          }
        },
      });
    } else {
      setShowIosPicker(true);
    }
  };

  return (
    <GradientBackground>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Text style={[styles.heading, { fontFamily: fonts.serifSemiBold }]}>Ajustes</Text>

          <Text style={styles.sectionLabel}>Notificaciones</Text>

          <View style={styles.row}>
            <View style={styles.rowTextWrapper}>
              <Text style={styles.rowTitle}>Notificación diaria</Text>
              <Text style={styles.rowSubtitle}>Recibí una afirmación todos los días.</Text>
            </View>
            <Switch
              value={settings.enabled}
              onValueChange={setEnabled}
              trackColor={{ false: COLORS.chipInactiveBg, true: COLORS.chipActiveBg }}
              thumbColor={COLORS.textLight}
            />
          </View>

          {permissionDenied && (
            <Text style={styles.warning}>
              No pudimos activar las notificaciones porque el permiso fue rechazado. Activalo desde
              los ajustes del sistema para tu celular.
            </Text>
          )}

          {settings.enabled && (
            <View style={styles.row}>
              <View style={styles.rowTextWrapper}>
                <Text style={styles.rowTitle}>Horario</Text>
                <Text style={styles.rowSubtitle}>A qué hora querés recibirla.</Text>
              </View>
              <TouchableOpacity style={styles.timeButton} onPress={openPicker} activeOpacity={0.85}>
                <Text style={styles.timeButtonText}>{formatTime(settings.hour, settings.minute)}</Text>
              </TouchableOpacity>
            </View>
          )}

          {showIosPicker && (
            <View style={styles.iosPickerWrapper}>
              <DateTimePicker
                value={currentDate}
                mode="time"
                display="spinner"
                themeVariant="dark"
                onChange={(_event, date) => {
                  if (date) setTime(date.getHours(), date.getMinutes());
                }}
              />
              <TouchableOpacity
                style={styles.doneButton}
                onPress={() => setShowIosPicker(false)}
                activeOpacity={0.85}>
                <Text style={styles.timeButtonText}>Listo</Text>
              </TouchableOpacity>
            </View>
          )}

          <Text style={styles.sectionLabel}>Apariencia</Text>

          <TouchableOpacity
            style={styles.row}
            onPress={() => setGradientPickerVisible(true)}
            activeOpacity={0.85}>
            <View style={styles.rowTextWrapper}>
              <Text style={styles.rowTitle}>Fondo</Text>
              <Text style={styles.rowSubtitle}>{GRADIENT_PRESETS[prefs.gradient].label}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.row}
            onPress={() => setFontPickerVisible(true)}
            activeOpacity={0.85}>
            <View style={styles.rowTextWrapper}>
              <Text style={styles.rowTitle}>Tipografía</Text>
              <Text style={styles.rowSubtitle}>{FONT_PRESETS[prefs.font].label}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>

      <GradientPickerSheet visible={gradientPickerVisible} onClose={() => setGradientPickerVisible(false)} />
      <FontPickerSheet visible={fontPickerVisible} onClose={() => setFontPickerVisible(false)} />
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  heading: {
    fontSize: 30,
    color: COLORS.textLight,
    marginBottom: 24,
  },
  sectionLabel: {
    color: COLORS.textMuted,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
    marginTop: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.chipInactiveBg,
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
  },
  rowTextWrapper: {
    flex: 1,
    paddingRight: 12,
  },
  rowTitle: {
    color: COLORS.textLight,
    fontSize: 16,
    fontWeight: '600',
  },
  rowSubtitle: {
    color: COLORS.textMuted,
    fontSize: 13,
    marginTop: 2,
  },
  timeButton: {
    backgroundColor: COLORS.chipActiveBg,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
  },
  timeButtonText: {
    color: COLORS.chipActiveText,
    fontWeight: '700',
    fontSize: 15,
  },
  warning: {
    color: COLORS.danger,
    fontSize: 13,
    marginBottom: 14,
  },
  iosPickerWrapper: {
    backgroundColor: COLORS.chipInactiveBg,
    borderRadius: 16,
    alignItems: 'center',
    paddingBottom: 12,
  },
  doneButton: {
    backgroundColor: COLORS.chipActiveBg,
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 16,
    marginTop: 4,
  },
});
