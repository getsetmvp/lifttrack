// Meal camera placeholder — Phase 5.2 Agent D replaces (design.md § 8.12).

import { SafeAreaView, Text, View } from 'react-native';

export default function MealCamera() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0F1115' }}>
      <View style={{ padding: 20 }}>
        <Text style={{ color: '#F1F5F9', fontSize: 22, fontWeight: '700' }}>Meal camera</Text>
        <Text style={{ color: '#94A3B8', fontSize: 13, marginTop: 12 }}>Agent D (Phase 5.2).</Text>
      </View>
    </SafeAreaView>
  );
}
