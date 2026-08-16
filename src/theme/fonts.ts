import {
  PlayfairDisplay_400Regular,
  PlayfairDisplay_600SemiBold,
  PlayfairDisplay_700Bold_Italic,
} from '@expo-google-fonts/playfair-display';
import { Lora_400Regular, Lora_600SemiBold, Lora_700Bold_Italic } from '@expo-google-fonts/lora';
import { Quicksand_400Regular, Quicksand_600SemiBold } from '@expo-google-fonts/quicksand';
import { useFonts } from 'expo-font';

import type { FontFamily, FontKey } from '@/types';

export const FONT_PRESETS: Record<FontKey, { label: string; family: FontFamily }> = {
  playfair: {
    label: 'Playfair (clásica)',
    family: {
      serif: 'PlayfairDisplay_400Regular',
      serifSemiBold: 'PlayfairDisplay_600SemiBold',
      serifItalic: 'PlayfairDisplay_700Bold_Italic',
    },
  },
  lora: {
    label: 'Lora (suave)',
    family: {
      serif: 'Lora_400Regular',
      serifSemiBold: 'Lora_600SemiBold',
      serifItalic: 'Lora_700Bold_Italic',
    },
  },
  quicksand: {
    label: 'Quicksand (amigable)',
    family: {
      serif: 'Quicksand_400Regular',
      serifSemiBold: 'Quicksand_600SemiBold',
      serifItalic: 'Quicksand_600SemiBold',
    },
  },
};

/** Se mantiene como valor por defecto estático para el primer render, antes de que cargue el ThemeContext. */
export const FONTS = FONT_PRESETS.playfair.family;

export function useAppFonts() {
  return useFonts({
    PlayfairDisplay_400Regular,
    PlayfairDisplay_600SemiBold,
    PlayfairDisplay_700Bold_Italic,
    Lora_400Regular,
    Lora_600SemiBold,
    Lora_700Bold_Italic,
    Quicksand_400Regular,
    Quicksand_600SemiBold,
  });
}
