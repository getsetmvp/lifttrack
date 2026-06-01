// Root layout — fonts + QueryClient + safe-area + gesture root + OTA hook + status bar.
// Each tab/auth/workout/meal group has its own _layout.tsx.

import 'react-native-reanimated';
import '../src/styles/global.css';

import { ThemeProvider, DarkTheme } from '@react-navigation/native';
// Apply a fully-dark navigation theme so React Navigation's internal container
// view paints #0F1115 instead of the default white. Otherwise fade/swap
// transitions reveal a white layer between screens.
const NAV_THEME = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: '#0F1115',
    card: '#0F1115',
  },
};

import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
} from '@expo-google-fonts/inter';
import {
  JetBrainsMono_400Regular,
  JetBrainsMono_500Medium,
  JetBrainsMono_600SemiBold,
  JetBrainsMono_700Bold,
} from '@expo-google-fonts/jetbrains-mono';
import * as SplashScreen from 'expo-splash-screen';
import * as SystemUI from 'expo-system-ui';

import { useOTAUpdates } from '../hooks/useOTAUpdates';

// Set native window background once at module load so back-nav transitions
// don't flash the default white window between screens.
SystemUI.setBackgroundColorAsync('#0F1115').catch(() => {});

SplashScreen.preventAutoHideAsync().catch(() => {});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
      refetchOnWindowFocus: false,
    },
    mutations: { retry: 0 },
  },
});

export default function RootLayout() {
  useOTAUpdates();

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
    JetBrainsMono_400Regular,
    JetBrainsMono_500Medium,
    JetBrainsMono_600SemiBold,
    JetBrainsMono_700Bold,
  });
  const [forceReady, setForceReady] = useState(false);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync().catch(() => {});
      return;
    }
    // Safety net: if fonts haven't resolved in 3s (offline, asset CDN flake,
    // etc), unblock the app w/ system fallback fonts instead of hanging on splash.
    const t = setTimeout(() => {
      SplashScreen.hideAsync().catch(() => {});
      setForceReady(true);
    }, 3000);
    return () => clearTimeout(t);
  }, [fontsLoaded]);

  if (!fontsLoaded && !forceReady) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#0F1115' }}>
      <SafeAreaProvider>
        <ThemeProvider value={NAV_THEME}>
        <QueryClientProvider client={queryClient}>
          {/* Absolute dark backdrop sits behind the Stack at all times so any
              transient empty surface (screen mount, status bar re-paint, native
              container clear) reveals dark, not the OS window default. */}
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: '#0F1115',
            }}
            pointerEvents="none"
          />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: '#0F1115' },
              animation: 'none',
              freezeOnBlur: false,
              navigationBarColor: '#0F1115',
              statusBarBackgroundColor: '#0F1115',
              statusBarStyle: 'light',
            }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="workout" options={{ presentation: 'modal' }} />
            <Stack.Screen name="meal" options={{ presentation: 'modal' }} />
            <Stack.Screen name="exercise/[id]" />
            <Stack.Screen name="exercise-picker" options={{ presentation: 'modal' }} />
            <Stack.Screen
              name="rest-timer"
              options={{ presentation: 'transparentModal', animation: 'fade', gestureEnabled: false }}
            />
          </Stack>
          <StatusBar style="light" translucent={false} backgroundColor="#0F1115" />
        </QueryClientProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
