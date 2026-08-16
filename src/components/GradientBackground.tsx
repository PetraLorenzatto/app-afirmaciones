import { LinearGradient } from 'expo-linear-gradient';
import type { PropsWithChildren } from 'react';

import { useTheme } from '@/context/ThemeContext';

export function GradientBackground({ children }: PropsWithChildren) {
  const { gradientColors } = useTheme();
  return (
    <LinearGradient
      colors={gradientColors}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{ flex: 1 }}>
      {children}
    </LinearGradient>
  );
}
