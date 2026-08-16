import { createContext, useCallback, useContext, useEffect, useState } from 'react';

import { DEFAULT_THEME_PREFS, loadThemePrefs, persistThemePrefs } from '@/storage/theme';
import { FONT_PRESETS } from '@/theme/fonts';
import { GRADIENT_PRESETS } from '@/theme/gradients';
import type { FontFamily, FontKey, GradientColors, GradientKey, ThemePrefs } from '@/types';

interface ThemeContextValue {
  prefs: ThemePrefs;
  loading: boolean;
  gradientColors: GradientColors;
  fonts: FontFamily;
  setGradient: (key: GradientKey) => Promise<void>;
  setFont: (key: FontKey) => Promise<void>;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [prefs, setPrefs] = useState<ThemePrefs>(DEFAULT_THEME_PREFS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadThemePrefs().then((stored) => {
      setPrefs(stored);
      setLoading(false);
    });
  }, []);

  const setGradient = useCallback(async (gradient: GradientKey) => {
    setPrefs((current) => {
      const next = { ...current, gradient };
      persistThemePrefs(next);
      return next;
    });
  }, []);

  const setFont = useCallback(async (font: FontKey) => {
    setPrefs((current) => {
      const next = { ...current, font };
      persistThemePrefs(next);
      return next;
    });
  }, []);

  const gradientColors = GRADIENT_PRESETS[prefs.gradient].colors;
  const fonts = FONT_PRESETS[prefs.font].family;

  return (
    <ThemeContext.Provider value={{ prefs, loading, gradientColors, fonts, setGradient, setFont }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme debe usarse dentro de ThemeProvider');
  }
  return context;
}
