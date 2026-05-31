// Active Workout placeholder — Phase 5.2 Agent C replaces (design.md § 8.6).

import { SafeAreaView, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function ActiveWorkout() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0F1115' }}>
      <View style={{ padding: 20 }}>
        <Text style={{ color: '#F1F5F9', fontSize: 22, fontWeight: '700' }}>Active workout</Text>
        <Text style={{ color: '#94A3B8', fontSize: 12, marginTop: 4 }}>id: {id ?? '—'}</Text>
        <Text style={{ color: '#94A3B8', fontSize: 13, marginTop: 12 }}>Agent C (Phase 5.2).</Text>
      </View>
    </SafeAreaView>
  );
}
