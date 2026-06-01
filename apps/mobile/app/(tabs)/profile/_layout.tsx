import { Stack } from 'expo-router';

export default function ProfileLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#0F1115' },
        animation: 'none',
        freezeOnBlur: false,
      }}
    />
  );
}
