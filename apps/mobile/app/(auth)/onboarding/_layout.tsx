import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#0F1115' },
        animation: 'simple_push',
        animationDuration: 220,
        gestureEnabled: true,
      }}
    />
  );
}
