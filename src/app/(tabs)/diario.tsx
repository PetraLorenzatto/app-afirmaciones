import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SectionList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { GradientBackground } from '@/components/GradientBackground';
import { useJournal } from '@/context/JournalContext';
import { useTheme } from '@/context/ThemeContext';
import { COLORS } from '@/theme/colors';
import { formatDateLabel } from '@/utils/formatDate';
import type { JournalEntry } from '@/types';

export default function DiarioScreen() {
  const { entries, addEntry, removeEntry } = useJournal();
  const { fonts } = useTheme();
  const [text, setText] = useState('');

  const handleSave = () => {
    if (!text.trim()) return;
    addEntry(text);
    setText('');
  };

  const sections = useMemo(() => {
    const sorted = [...entries].sort((a, b) => b.createdAt - a.createdAt);
    const groups = new Map<string, JournalEntry[]>();
    for (const entry of sorted) {
      const key = formatDateLabel(entry.createdAt);
      const group = groups.get(key);
      if (group) {
        group.push(entry);
      } else {
        groups.set(key, [entry]);
      }
    }
    return [...groups.entries()].map(([title, data]) => ({ title, data }));
  }, [entries]);

  return (
    <GradientBackground>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <SafeAreaView style={styles.safeArea}>
          <Text style={[styles.heading, { fontFamily: fonts.serifSemiBold }]}>Diario</Text>

          <View style={styles.form}>
            <TextInput
              value={text}
              onChangeText={setText}
              placeholder="¿Por qué estás agradecido/a hoy?"
              placeholderTextColor={COLORS.textMuted}
              style={styles.input}
              multiline
            />
            <TouchableOpacity style={styles.saveButton} onPress={handleSave} activeOpacity={0.85}>
              <Text style={styles.saveButtonText}>Guardar</Text>
            </TouchableOpacity>
          </View>

          <SectionList
            sections={sections}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            stickySectionHeadersEnabled={false}
            ListEmptyComponent={
              <Text style={styles.emptyText}>
                Todavía no escribiste ninguna entrada. ¿Por qué estás agradecido/a hoy?
              </Text>
            }
            renderSectionHeader={({ section }) => (
              <Text style={styles.sectionHeader}>{section.title}</Text>
            )}
            renderItem={({ item }) => (
              <View style={styles.item}>
                <Text style={styles.itemText}>{item.text}</Text>
                <TouchableOpacity onPress={() => removeEntry(item.id)} hitSlop={10}>
                  <Ionicons name="trash-outline" size={20} color={COLORS.danger} />
                </TouchableOpacity>
              </View>
            )}
          />
        </SafeAreaView>
      </KeyboardAvoidingView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  safeArea: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  heading: {
    fontSize: 30,
    color: COLORS.textLight,
    marginBottom: 16,
  },
  form: {
    gap: 12,
    marginBottom: 20,
  },
  input: {
    backgroundColor: COLORS.chipInactiveBg,
    borderRadius: 16,
    padding: 14,
    color: COLORS.textLight,
    fontSize: 15,
    minHeight: 60,
    textAlignVertical: 'top',
  },
  saveButton: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.chipActiveBg,
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: 20,
  },
  saveButtonText: {
    color: COLORS.chipActiveText,
    fontWeight: '700',
  },
  listContent: {
    paddingBottom: 24,
  },
  emptyText: {
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: 40,
    fontSize: 14,
  },
  sectionHeader: {
    color: COLORS.gold,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
    marginTop: 12,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    backgroundColor: COLORS.chipInactiveBg,
    borderRadius: 16,
    padding: 14,
    gap: 12,
    marginBottom: 10,
  },
  itemText: {
    flex: 1,
    color: COLORS.textLight,
    fontSize: 15,
    lineHeight: 21,
  },
});
