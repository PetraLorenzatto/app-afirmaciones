import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CategoryPicker } from '@/components/CategoryPicker';
import { GradientBackground } from '@/components/GradientBackground';
import { CATEGORIES } from '@/data/affirmations';
import { useSavedAffirmations } from '@/context/SavedAffirmationsContext';
import { COLORS } from '@/theme/colors';
import { FONTS } from '@/theme/fonts';
import type { Category, SavedAffirmation } from '@/types';

export default function GuardadasScreen() {
  const { saved, addAffirmation, removeAffirmation } = useSavedAffirmations();
  const [text, setText] = useState('');
  const [category, setCategory] = useState<Category>('amor');

  const handleSave = () => {
    if (!text.trim()) return;
    addAffirmation(text, category);
    setText('');
  };

  return (
    <GradientBackground>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <SafeAreaView style={styles.safeArea}>
          <Text style={styles.heading}>Guardadas</Text>

          <View style={styles.form}>
            <TextInput
              value={text}
              onChangeText={setText}
              placeholder="Escribí tu propia afirmación..."
              placeholderTextColor={COLORS.textMuted}
              style={styles.input}
              multiline
            />
            <CategoryPicker selected={category} onSelect={setCategory} />
            <TouchableOpacity style={styles.saveButton} onPress={handleSave} activeOpacity={0.85}>
              <Text style={styles.saveButtonText}>Guardar</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={saved}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <Text style={styles.emptyText}>Todavía no guardaste ninguna afirmación propia.</Text>
            }
            renderItem={({ item }) => (
              <SavedItem item={item} onDelete={() => removeAffirmation(item.id)} />
            )}
          />
        </SafeAreaView>
      </KeyboardAvoidingView>
    </GradientBackground>
  );
}

function SavedItem({ item, onDelete }: { item: SavedAffirmation; onDelete: () => void }) {
  const categoryInfo = CATEGORIES.find((c) => c.key === item.category);
  return (
    <View style={styles.item}>
      <View style={styles.itemTextWrapper}>
        {categoryInfo && (
          <View style={styles.itemTag}>
            <Ionicons
            name={categoryInfo.icon as keyof typeof Ionicons.glyphMap}
            size={12}
            color={COLORS.gold}
          />
            <Text style={styles.itemTagText}>{categoryInfo.label}</Text>
          </View>
        )}
        <Text style={styles.itemText}>{item.text}</Text>
      </View>
      <TouchableOpacity onPress={onDelete} hitSlop={10}>
        <Ionicons name="trash-outline" size={20} color={COLORS.danger} />
      </TouchableOpacity>
    </View>
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
    fontFamily: FONTS.serifSemiBold,
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
    gap: 10,
    paddingBottom: 24,
  },
  emptyText: {
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: 40,
    fontSize: 14,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    backgroundColor: COLORS.chipInactiveBg,
    borderRadius: 16,
    padding: 14,
    gap: 12,
  },
  itemTextWrapper: {
    flex: 1,
    gap: 6,
  },
  itemTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  itemTagText: {
    color: COLORS.gold,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  itemText: {
    color: COLORS.textLight,
    fontSize: 15,
    lineHeight: 21,
  },
});
