export type Category = 'amor' | 'dinero' | 'salud' | 'proposito' | 'calma';

export interface CategoryInfo {
  key: Category;
  label: string;
  icon: string;
}

export type AffirmationOrigin = 'custom' | 'favorite';

export interface SavedAffirmation {
  id: string;
  text: string;
  category: Category;
  createdAt: number;
  origin: AffirmationOrigin;
}

export interface NotificationSettings {
  enabled: boolean;
  hour: number;
  minute: number;
}

export interface JournalEntry {
  id: string;
  text: string;
  createdAt: number;
}

export interface StreakState {
  streak: number;
  lastCompletedDate: string | null;
  todayDate: string;
  todayReadTexts: string[];
}

export type GradientColors = readonly [string, string, ...string[]];

export type GradientKey = 'sunrise' | 'dusk' | 'ocean' | 'forest';
export type FontKey = 'playfair' | 'lora' | 'quicksand';

export interface FontFamily {
  serif: string;
  serifSemiBold: string;
  serifItalic: string;
}

export interface ThemePrefs {
  gradient: GradientKey;
  font: FontKey;
}

// ---- V2: perfil de usuario y registro diario ----

export type UserGoal =
  | 'amor_propio'
  | 'confianza'
  | 'disciplina'
  | 'calma'
  | 'proposito'
  | 'estudio_carrera'
  | 'finanzas'
  | 'bienestar_movimiento'
  | 'relaciones'
  | 'disfrutar';

export type CurrentNeed =
  | 'tranquilidad'
  | 'motivacion'
  | 'claridad'
  | 'confianza'
  | 'energia'
  | 'contencion'
  | 'constancia'
  | 'general';

export type SupportTone = 'suave' | 'positiva' | 'directa' | 'reflexiva';

export type SupportTime = 'morning' | 'day' | 'evening';

export interface UserProfile {
  name: string | null;
  goals: UserGoal[];
  currentNeed: CurrentNeed | null;
  tone: SupportTone | null;
  supportTimes: SupportTime[];
  onboardingCompleted: boolean;
  createdAt: number;
}

export type Mood = 'very_low' | 'low' | 'neutral' | 'good' | 'great';

export interface DailyEntry {
  id: string;
  date: string;
  morningMood: Mood | null;
  eveningMood: Mood | null;
  affirmationText: string | null;
  microActionText: string | null;
  microActionAccepted: boolean;
  microActionCompleted: boolean;
  reflection: string | null;
  gratitude: string | null;
  createdAt: number;
  updatedAt: number;
}
