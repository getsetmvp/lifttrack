// Root layout — Expo Router entry. Mounts OTA hook on cold start.
// Per-feature screens added by Phase 5 agents under app/(auth)/, app/(tabs)/, app/workout/, app/meal/.

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import '../src/styles/global.css';

import { useOTAUpdates } from '../hooks/useOTAUpdates';

export default function RootLayout() {
  useOTAUpdates();

  return (
    <>
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#0F1115' } }}>
        <Stack.Screen name="index" />
      </Stack>
      <StatusBar style="light" />
    </>
  );
}
