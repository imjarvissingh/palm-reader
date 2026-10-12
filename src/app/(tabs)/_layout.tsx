import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import type { ColorValue } from 'react-native';
import { colors } from '@/theme/tokens';

type IconName = keyof typeof Ionicons.glyphMap;

const icon = (name: IconName, active: IconName) =>
  function TabIcon({ color, focused, size }: { color: ColorValue; focused: boolean; size: number }) {
    return <Ionicons name={focused ? active : name} color={color as string} size={size} />;
  };

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.gold,
        tabBarInactiveTintColor: colors.textSubtle,
        tabBarStyle: { backgroundColor: colors.bgElevated, borderTopColor: colors.border },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        sceneStyle: { backgroundColor: colors.bg },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Today', tabBarIcon: icon('sparkles-outline', 'sparkles') }} />
      <Tabs.Screen name="horoscope" options={{ title: 'Horoscope', tabBarIcon: icon('planet-outline', 'planet') }} />
      <Tabs.Screen name="palm" options={{ title: 'Palm', tabBarIcon: icon('hand-left-outline', 'hand-left') }} />
      <Tabs.Screen name="explore" options={{ title: 'Explore', tabBarIcon: icon('compass-outline', 'compass') }} />
      <Tabs.Screen name="me" options={{ title: 'Me', tabBarIcon: icon('person-circle-outline', 'person-circle') }} />
    </Tabs>
  );
}
