export type Category = 'amor' | 'dinero' | 'salud' | 'proposito' | 'calma';

export interface CategoryInfo {
  key: Category;
  label: string;
  icon: string;
}

export interface SavedAffirmation {
  id: string;
  text: string;
  category: Category;
  createdAt: number;
}

export interface NotificationSettings {
  enabled: boolean;
  hour: number;
  minute: number;
}
