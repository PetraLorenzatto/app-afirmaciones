import type { CurrentNeed, SupportTime, SupportTone, UserGoal } from '@/types';

export interface OnboardingOption<T extends string> {
  key: T;
  emoji: string;
  label: string;
}

export const GOAL_OPTIONS: OnboardingOption<UserGoal>[] = [
  { key: 'amor_propio', emoji: '❤️', label: 'Amor propio' },
  { key: 'confianza', emoji: '💪', label: 'Confianza' },
  { key: 'disciplina', emoji: '🔥', label: 'Disciplina y constancia' },
  { key: 'calma', emoji: '🧘', label: 'Calma' },
  { key: 'proposito', emoji: '🎯', label: 'Propósito' },
  { key: 'estudio_carrera', emoji: '📚', label: 'Estudio y carrera' },
  { key: 'finanzas', emoji: '💰', label: 'Finanzas' },
  { key: 'bienestar_movimiento', emoji: '🏃', label: 'Bienestar y movimiento' },
  { key: 'relaciones', emoji: '🤝', label: 'Relaciones' },
  { key: 'disfrutar', emoji: '✨', label: 'Disfrutar más' },
];

export const NEED_OPTIONS: OnboardingOption<CurrentNeed>[] = [
  { key: 'tranquilidad', emoji: '🌿', label: 'Tranquilidad' },
  { key: 'motivacion', emoji: '🔥', label: 'Motivación' },
  { key: 'claridad', emoji: '🧭', label: 'Claridad' },
  { key: 'confianza', emoji: '💪', label: 'Confianza' },
  { key: 'energia', emoji: '⚡', label: 'Energía' },
  { key: 'contencion', emoji: '🫶', label: 'Contención' },
  { key: 'constancia', emoji: '🎯', label: 'Constancia' },
  { key: 'general', emoji: '✨', label: 'Un poco de todo' },
];

export interface ToneOption {
  key: SupportTone;
  emoji: string;
  label: string;
  example: string;
}

export const TONE_OPTIONS: ToneOption[] = [
  {
    key: 'suave',
    emoji: '🌿',
    label: 'Suave',
    example: 'No necesitás resolverlo todo hoy. Empecemos por algo pequeño.',
  },
  {
    key: 'positiva',
    emoji: '✨',
    label: 'Positiva',
    example: 'Hoy puede ser una nueva oportunidad para acercarte a lo que querés.',
  },
  {
    key: 'directa',
    emoji: '🔥',
    label: 'Directa',
    example: 'No esperes a tener ganas. Elegí una cosa y empezá.',
  },
  {
    key: 'reflexiva',
    emoji: '🧠',
    label: 'Reflexiva',
    example: '¿Qué cambiaría hoy si dejaras de exigirte tener todas las respuestas?',
  },
];

export const SUPPORT_TIME_OPTIONS: OnboardingOption<SupportTime>[] = [
  { key: 'morning', emoji: '🌅', label: 'Al comenzar el día' },
  { key: 'day', emoji: '☀️', label: 'Durante el día' },
  { key: 'evening', emoji: '🌙', label: 'Al terminar el día' },
];
