import { Stack } from 'expo-router';

export default function MealLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#0F1115' },
        animation: 'slide_from_bottom',
      }}
    />
  );
}
