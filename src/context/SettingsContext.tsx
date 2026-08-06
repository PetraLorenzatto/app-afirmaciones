import { createContext, useContext, useEffect, useState } from 'react';

import { AFFIRMATIONS } from '@/data/affirmations';
import { pickForDate } from '@/hooks/useAffirmationOfTheDay';
import {
  cancelDailyAffirmationNotification,
  requestNotificationPermissions,
  scheduleDailyAffirmationNotification,
} from '@/notifications/scheduleDaily';
import { DEFAULT_SETTINGS, loadSettings, persistSettings } from '@/storage/settings';
import type { NotificationSettings } from '@/types';

interface SettingsContextValue {
  settings: NotificationSettings;
  loading: boolean;
  permissionDenied: boolean;
  setEnabled: (enabled: boolean) => Promise<void>;
  setTime: (hour: number, minute: number) => Promise<void>;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

function todaysNotificationBody(): string {
  const allPhrases = Object.values(AFFIRMATIONS).flat();
  return pickForDate(allPhrases);
}

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<NotificationSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [permissionDenied, setPermissionDenied] = useState(false);

  useEffect(() => {
    loadSettings().then((stored) => {
      setSettings(stored);
      setLoading(false);
      if (stored.enabled) {
        scheduleDailyAffirmationNotification(stored.hour, stored.minute, todaysNotificationBody());
      }
    });
  }, []);

  const setEnabled = async (enabled: boolean) => {
    if (enabled) {
      const granted = await requestNotificationPermissions();
      if (!granted) {
        setPermissionDenied(true);
        return;
      }
      setPermissionDenied(false);
      await scheduleDailyAffirmationNotification(settings.hour, settings.minute, todaysNotificationBody());
    } else {
      await cancelDailyAffirmationNotification();
    }
    const next = { ...settings, enabled };
    setSettings(next);
    await persistSettings(next);
  };

  const setTime = async (hour: number, minute: number) => {
    const next = { ...settings, hour, minute };
    setSettings(next);
    await persistSettings(next);
    if (next.enabled) {
      await scheduleDailyAffirmationNotification(hour, minute, todaysNotificationBody());
    }
  };

  return (
    <SettingsContext.Provider value={{ settings, loading, permissionDenied, setEnabled, setTime }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings debe usarse dentro de SettingsProvider');
  }
  return context;
}
