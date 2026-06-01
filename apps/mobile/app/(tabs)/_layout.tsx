// Tabs: Today / Train / Fuel / Stats / Profile. Per design.md § 6.

import { Tabs, router } from 'expo-router';
import { Sun, Dumbbell, Apple, Activity, CircleUser } from 'lucide-react-native';

// Tap on a tab always lands on that tab's root screen — pop any pushed sub-routes
// in the underlying stack so back from root goes to Today/exit, not a sibling sub-route.
const resetOnTap = (rootPath: string) => ({
  tabPress: (e: { preventDefault: () => void }) => {
    e.preventDefault();
    router.navigate(rootPath as any);
  },
});

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'rgba(15,17,21,0.85)',
          borderTopColor: '#2A2F3A',
          height: 78,
          paddingTop: 8,
        },
        tabBarActiveTintColor: route.name === 'fuel' ? '#F97316' : '#14B8A6',
        tabBarInactiveTintColor: '#94A3B8',
        tabBarLabelStyle: { fontSize: 10, fontWeight: '600' },
      })}
    >
      <Tabs.Screen
        name="today"
        options={{
          title: 'Today',
          tabBarIcon: ({ color }) => <Sun color={color} size={20} />,
        }}
        listeners={() => resetOnTap('/(tabs)/today')}
      />
      <Tabs.Screen
        name="train"
        options={{
          title: 'Train',
          tabBarIcon: ({ color }) => <Dumbbell color={color} size={20} />,
        }}
        listeners={() => resetOnTap('/(tabs)/train')}
      />
      <Tabs.Screen
        name="fuel"
        options={{
          title: 'Fuel',
          tabBarIcon: ({ color }) => <Apple color={color} size={20} />,
        }}
        listeners={() => resetOnTap('/(tabs)/fuel')}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: 'Stats',
          tabBarIcon: ({ color }) => <Activity color={color} size={20} />,
        }}
        listeners={() => resetOnTap('/(tabs)/stats')}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <CircleUser color={color} size={20} />,
        }}
        listeners={() => resetOnTap('/(tabs)/profile')}
      />
    </Tabs>
  );
}
