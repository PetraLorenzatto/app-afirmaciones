import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { CategoryMenu } from '@/components/CategoryMenu';
import { GradientBackground } from '@/components/GradientBackground';
import { useSavedAffirmations } from '@/context/SavedAffirmationsContext';
import { useAffirmationFeed } from '@/hooks/useAffirmationFeed';
import { COLORS } from '@/theme/colors';
import { FONTS } from '@/theme/fonts';
import type { Category } from '@/types';

export default function HoyScreen() {
  const [category, setCategory] = useState<Category>('calma');
  const [menuVisible, setMenuVisible] = useState(false);
  const [pageHeight, setPageHeight] = useState(0);
  const { saved } = useSavedAffirmations();
  const feed = useAffirmationFeed(category, saved);
  const insets = useSafeAreaInsets();

  return (
    <GradientBackground>
      <SafeAreaView
        style={styles.safeArea}
        onLayout={(event) => setPageHeight(event.nativeEvent.layout.height)}>
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
            keyExtractor={(item, index) => `${index}-${item.slice(0, 16)}`}
            pagingEnabled
            showsVerticalScrollIndicator={false}
            snapToInterval={pageHeight}
            decelerationRate="fast"
            getItemLayout={(_, index) => ({ length: pageHeight, offset: pageHeight * index, index })}
            renderItem={({ item }) => (
              <View style={[styles.page, { height: pageHeight }]}>
                <Text style={styles.quoteMark}>“</Text>
                <Text style={styles.text}>{item}</Text>
              </View>
            )}
          />
        )}
      </SafeAreaView>

      <CategoryMenu
        visible={menuVisible}
        selected={category}
        onSelect={setCategory}
        onClose={() => setMenuVisible(false)}
      />
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
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
    fontFamily: FONTS.serifSemiBold,
    fontSize: 48,
    color: COLORS.gold,
    lineHeight: 48,
    marginBottom: 12,
  },
  text: {
    fontFamily: FONTS.serif,
    fontSize: 28,
    lineHeight: 40,
    color: COLORS.textLight,
    textAlign: 'center',
  },
});
