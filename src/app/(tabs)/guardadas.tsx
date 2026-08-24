import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CategoryPicker } from '@/components/CategoryPicker';
import { EditAffirmationModal } from '@/components/EditAffirmationModal';
import { GradientBackground } from '@/components/GradientBackground';
import { CATEGORIES } from '@/data/affirmations';
import { useSavedAffirmations } from '@/context/SavedAffirmationsContext';
import { useTheme } from '@/context/ThemeContext';
import { COLORS } from '@/theme/colors';
import type { Category, SavedAffirmation } from '@/types';

type CategoryFilter = 'all' | Category;

export default function GuardadasScreen() {
  const { saved, addAffirmation, removeAffirmation, editAffirmation } = useSavedAffirmations();
  const { fonts } = useTheme();
  const [text, setText] = useState('');
  const [category, setCategory] = useState<Category>('amor');
  const [query, setQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [editingItem, setEditingItem] = useState<SavedAffirmation | null>(null);

  const handleSave = () => {
    if (!text.trim()) return;
    addAffirmation(text, category);
    setText('');
  };

  const filtered = useMemo(
    () =>
      saved.filter((item) => {
        const matchesQuery =
          query.trim() === '' || item.text.toLowerCase().includes(query.trim().toLowerCase());
        const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
        return matchesQuery && matchesCategory;
      }),
    [saved, query, categoryFilter]
  );

  return (
    <GradientBackground>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <SafeAreaView style={styles.safeArea}>
          <Text style={[styles.heading, { fontFamily: fonts.serifSemiBold }]}>Guardadas</Text>

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

          <View style={styles.searchRow}>
            <Ionicons name="search" size={16} color={COLORS.textMuted} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Buscar en tus guardadas..."
              placeholderTextColor={COLORS.textMuted}
              style={styles.searchInput}
            />
          </View>

          <ScrollView
            horizontal
            style={styles.filterScroll}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterRow}>
            <FilterChip
              label="Todas"
              active={categoryFilter === 'all'}
              onPress={() => setCategoryFilter('all')}
            />
            {CATEGORIES.map((c) => (
              <FilterChip
                key={c.key}
                label={c.label}
                active={categoryFilter === c.key}
                onPress={() => setCategoryFilter(c.key)}
              />
            ))}
          </ScrollView>

          <FlatList
            data={filtered}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <Text style={styles.emptyText}>
                {saved.length === 0
                  ? "Todavía no guardaste ninguna afirmación. Tocá el corazón en 'Hoy' o escribí la tuya acá."
                  : 'No encontramos afirmaciones que coincidan con tu búsqueda.'}
              </Text>
            }
            renderItem={({ item }) => (
              <SavedItem
                item={item}
                onDelete={() => removeAffirmation(item.id)}
                onEdit={() => setEditingItem(item)}
              />
            )}
          />
        </SafeAreaView>
      </KeyboardAvoidingView>

      <EditAffirmationModal
        item={editingItem}
        onSave={(id, newText, newCategory) => editAffirmation(id, newText, newCategory)}
        onClose={() => setEditingItem(null)}
      />
    </GradientBackground>
  );
}

function FilterChip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.filterChip, active && styles.filterChipActive]}
      activeOpacity={0.8}>
      <Text style={[styles.filterChipText, active && styles.filterChipTextActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

function SavedItem({
  item,
  onDelete,
  onEdit,
}: {
  item: SavedAffirmation;
  onDelete: () => void;
  onEdit: () => void;
}) {
  const categoryInfo = CATEGORIES.find((c) => c.key === item.category);
  return (
    <TouchableOpacity style={styles.item} onPress={onEdit} activeOpacity={0.8}>
      <View style={styles.itemTextWrapper}>
        <View style={styles.tagsRow}>
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
          <View style={styles.itemTag}>
            <Ionicons
              name={item.origin === 'favorite' ? 'heart' : 'create-outline'}
              size={12}
              color={item.origin === 'favorite' ? COLORS.gold : COLORS.textMuted}
            />
            <Text
              style={[
                styles.itemTagText,
                item.origin !== 'favorite' && { color: COLORS.textMuted },
              ]}>
              {item.origin === 'favorite' ? 'Favorita' : 'Propia'}
            </Text>
          </View>
        </View>
        <Text style={styles.itemText}>{item.text}</Text>
      </View>
      <TouchableOpacity onPress={onDelete} hitSlop={10}>
        <Ionicons name="trash-outline" size={20} color={COLORS.danger} />
      </TouchableOpacity>
    </TouchableOpacity>
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
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.chipInactiveBg,
    borderRadius: 14,
    paddingHorizontal: 14,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    color: COLORS.textLight,
    fontSize: 14,
    paddingVertical: 10,
  },
  filterScroll: {
    flexGrow: 0,
  },
  filterRow: {
    gap: 8,
    paddingBottom: 12,
  },
  filterChip: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 16,
    backgroundColor: COLORS.chipInactiveBg,
  },
  filterChipActive: {
    backgroundColor: COLORS.chipActiveBg,
  },
  filterChipText: {
    color: COLORS.textLight,
    fontSize: 13,
    fontWeight: '600',
  },
  filterChipTextActive: {
    color: COLORS.chipActiveText,
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
  tagsRow: {
    flexDirection: 'row',
    gap: 8,
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
