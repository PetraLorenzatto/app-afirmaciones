import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { useMemo, useState } from 'react';
import { Platform, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { GradientBackground } from '@/components/GradientBackground';
import { useSettings } from '@/context/SettingsContext';
import { COLORS } from '@/theme/colors';
import { FONTS } from '@/theme/fonts';

function formatTime(hour: number, minute: number): string {
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}

export default function AjustesScreen() {
  const { settings, permissionDenied, setEnabled, setTime } = useSettings();
  const [showIosPicker, setShowIosPicker] = useState(false);

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
        <Text style={styles.heading}>Ajustes</Text>

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
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  heading: {
    fontFamily: FONTS.serifSemiBold,
    fontSize: 30,
    color: COLORS.textLight,
    marginBottom: 24,
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
