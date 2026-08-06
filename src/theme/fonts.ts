import {
  PlayfairDisplay_400Regular,
  PlayfairDisplay_600SemiBold,
  PlayfairDisplay_700Bold_Italic,
} from '@expo-google-fonts/playfair-display';
import { useFonts } from 'expo-font';

export const FONTS = {
  serif: 'PlayfairDisplay_400Regular',
  serifSemiBold: 'PlayfairDisplay_600SemiBold',
  serifItalic: 'PlayfairDisplay_700Bold_Italic',
};

export function useAppFonts() {
  return useFonts({
    PlayfairDisplay_400Regular,
    PlayfairDisplay_600SemiBold,
    PlayfairDisplay_700Bold_Italic,
  });
}
