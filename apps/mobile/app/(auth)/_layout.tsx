// Auth stack — Welcome → Login | Register → Onboarding (unit/goal/body) → Today.

import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#0F1115' },
        animation: 'fade',
        animationDuration: 120,
        freezeOnBlur: false,
      }}
    />
  );
}
