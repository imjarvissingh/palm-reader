import { CormorantGaramond_600SemiBold, CormorantGaramond_700Bold, useFonts } from '@expo-google-fonts/cormorant-garamond';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppStateProvider, useApp } from '@/state/AppState';
import { PalmDraftProvider } from '@/state/palmDraft';
import { colors, fonts } from '@/theme/tokens';

void SplashScreen.preventAutoHideAsync().catch(() => undefined);

function RootStack() {
  const { state } = useApp();
  const [fontsLoaded, fontError] = useFonts({ CormorantGaramond_600SemiBold, CormorantGaramond_700Bold });
  const ready = state.hydrated && (fontsLoaded || !!fontError);

  useEffect(() => {
    if (ready) void SplashScreen.hideAsync().catch(() => undefined);
  }, [ready]);

  if (!ready) return null;

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.bg },
        headerTintColor: colors.text,
        headerTitleStyle: { fontFamily: fonts.displaySemi, fontSize: 22 },
        headerShadowVisible: false,
        headerBackButtonDisplayMode: 'minimal',
        contentStyle: { backgroundColor: colors.bg },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="onboarding" options={{ headerShown: false, gestureEnabled: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="palm/start" options={{ title: 'New reading' }} />
      <Stack.Screen name="palm/capture" options={{ title: 'Palm photo', headerShown: false }} />
      <Stack.Screen name="palm/questions" options={{ title: 'Your lines' }} />
      <Stack.Screen name="palm/generating" options={{ headerShown: false, gestureEnabled: false }} />
      <Stack.Screen name="reading/[id]" options={{ title: 'Your reading' }} />
      <Stack.Screen name="history" options={{ title: 'Reading history' }} />
      <Stack.Screen name="sign/[id]" options={{ title: '' }} />
      <Stack.Screen name="tools/compatibility" options={{ title: 'Compatibility' }} />
      <Stack.Screen name="tools/numerology" options={{ title: 'Numerology' }} />
      <Stack.Screen name="tools/dreams" options={{ title: 'Dream meanings' }} />
      <Stack.Screen name="tools/moon" options={{ title: 'Moon calendar' }} />
      <Stack.Screen name="tools/vedic" options={{ title: 'Vedic astrology' }} />
      <Stack.Screen name="learn/index" options={{ title: 'Learn' }} />
      <Stack.Screen name="learn/[id]" options={{ title: '' }} />
      <Stack.Screen name="legal/privacy" options={{ title: 'Privacy' }} />
      <Stack.Screen name="legal/terms" options={{ title: 'Terms & disclaimer' }} />
      <Stack.Screen name="premium" options={{ title: 'Lunara Plus', presentation: 'modal' }} />
      <Stack.Screen name="edit-profile" options={{ title: 'Your details' }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AppStateProvider>
        <PalmDraftProvider>
          <StatusBar style="light" />
          <RootStack />
        </PalmDraftProvider>
      </AppStateProvider>
    </SafeAreaProvider>
  );
}
