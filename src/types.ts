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
