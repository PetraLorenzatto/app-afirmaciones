import { LinearGradient } from 'expo-linear-gradient';
import type { PropsWithChildren } from 'react';

import { SUNRISE_GRADIENT } from '@/theme/colors';

export function GradientBackground({ children }: PropsWithChildren) {
  return (
    <LinearGradient
      colors={SUNRISE_GRADIENT}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{ flex: 1 }}>
      {children}
    </LinearGradient>
  );
}
