// Profile tab placeholder — Phase 5.2 Agent B replaces.

import { SafeAreaView, Text, View } from 'react-native';
import { Avatar } from '../../src/components/ui';

export default function Profile() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0F1115' }}>
      <View style={{ padding: 20, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <Avatar name="Yash" size={56} />
        <View>
          <Text style={{ color: '#F1F5F9', fontSize: 18, fontWeight: '700' }}>Profile</Text>
          <Text style={{ color: '#94A3B8', fontSize: 12 }}>Agent B lands here in Phase 5.2.</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
