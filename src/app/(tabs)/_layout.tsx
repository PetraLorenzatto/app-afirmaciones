import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

import { COLORS } from '@/theme/colors';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.gold,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarStyle: {
          backgroundColor: 'rgba(18, 16, 42, 0.92)',
          borderTopWidth: 0,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Hoy',
          tabBarIcon: ({ color, size }) => <Ionicons name="sunny" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="guardadas"
        options={{
          title: 'Guardadas',
          tabBarIcon: ({ color, size }) => <Ionicons name="bookmark" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="ajustes"
        options={{
          title: 'Ajustes',
          tabBarIcon: ({ color, size }) => <Ionicons name="settings" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
