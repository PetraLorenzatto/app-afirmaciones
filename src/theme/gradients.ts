import { SUNRISE_GRADIENT } from './colors';
import type { GradientColors, GradientKey } from '@/types';

export const GRADIENT_PRESETS: Record<GradientKey, { label: string; colors: GradientColors }> = {
  sunrise: { label: 'Amanecer', colors: SUNRISE_GRADIENT },
  dusk: { label: 'Atardecer', colors: ['#1a1030', '#4a1942', '#8c2f5e', '#c14f6e', '#e8896f'] as const },
  ocean: { label: 'Océano', colors: ['#0b132b', '#1c2541', '#3a506b', '#5bc0be', '#a8dadc'] as const },
  forest: { label: 'Bosque', colors: ['#101c14', '#1f3a2e', '#2f5d3a', '#5c8a52', '#a7c579'] as const },
};
