import { useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { CategoryPicker } from '@/components/CategoryPicker';
import { useTheme } from '@/context/ThemeContext';
import { COLORS } from '@/theme/colors';
import type { Category, SavedAffirmation } from '@/types';

export function EditAffirmationModal({
  item,
  onSave,
  onClose,
}: {
  item: SavedAffirmation | null;
  onSave: (id: string, text: string, category: Category) => void;
  onClose: () => void;
}) {
  const { fonts } = useTheme();
  const [text, setText] = useState('');
  const [category, setCategory] = useState<Category>('amor');

  useEffect(() => {
    if (item) {
      setText(item.text);
      setCategory(item.category);
    }
  }, [item]);

  const handleSave = () => {
    if (!item || !text.trim()) return;
    onSave(item.id, text, category);
    onClose();
  };

  return (
    <Modal visible={item !== null} animationType="fade" transparent onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.sheet}>
          <Text style={[styles.title, { fontFamily: fonts.serifSemiBold }]}>Editar afirmación</Text>
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="Escribí tu afirmación..."
            placeholderTextColor={COLORS.textMuted}
            style={styles.input}
            multiline
          />
          <CategoryPicker selected={category} onSelect={setCategory} />
          <View style={styles.actions}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose} activeOpacity={0.8}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave} activeOpacity={0.85}>
              <Text style={styles.saveText}>Guardar</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#241b3d',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 40,
    gap: 14,
  },
  title: {
    fontSize: 20,
    color: COLORS.textLight,
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
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 4,
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 20,
  },
  cancelText: {
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: COLORS.chipActiveBg,
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: 20,
  },
  saveText: {
    color: COLORS.chipActiveText,
    fontWeight: '700',
  },
});
