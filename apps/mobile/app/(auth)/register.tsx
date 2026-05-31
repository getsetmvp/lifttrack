// Register placeholder — Phase 5.2 Agent B replaces (design.md § 8 screen 04).

import { SafeAreaView, Text, View } from 'react-native';

export default function Register() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0F1115' }}>
      <View style={{ padding: 20 }}>
        <Text style={{ color: '#F1F5F9', fontSize: 24, fontWeight: '700' }}>Register</Text>
        <Text style={{ color: '#94A3B8', fontSize: 13, marginTop: 4 }}>Agent B (Phase 5.2).</Text>
      </View>
    </SafeAreaView>
  );
}
