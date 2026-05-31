// Today screen placeholder — Phase 5.2 Agent B replaces.

import { SafeAreaView, Text, View } from 'react-native';
import { Button, Card, MacroRing, StatTile } from '../../src/components/ui';

export default function Today() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0F1115' }}>
      <View style={{ padding: 20, gap: 16 }}>
        <Text style={{ color: '#94A3B8', fontSize: 12 }}>Good morning</Text>
        <Text style={{ color: '#F1F5F9', fontSize: 28, fontWeight: '700' }}>Yash</Text>
        <Card accent="teal">
          <Text style={{ color: '#94A3B8', fontSize: 11, fontWeight: '700', letterSpacing: 0.08, textTransform: 'uppercase' }}>
            Today's workout
          </Text>
          <Text style={{ color: '#F1F5F9', fontSize: 20, fontWeight: '700', marginTop: 4 }}>Push Day</Text>
          <Text style={{ color: '#94A3B8', fontFamily: 'JetBrainsMono_500Medium', fontSize: 12, marginTop: 2 }}>
            5 exercises · ~62 min
          </Text>
          <View style={{ height: 12 }} />
          <Button label="Start workout" variant="primary-teal" fullWidth />
        </Card>
        <Card>
          <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
            <MacroRing protein={145} carbs={220} fat={60} kcal={1820} targets={{ protein: 180, carbs: 280, fat: 75, kcal: 2400 }} />
          </View>
          <View style={{ height: 12 }} />
          <Button label="Snap meal" variant="primary-orange" fullWidth />
        </Card>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <StatTile label="Streak" value="12 d" />
          <StatTile label="Volume" value="24.5 t" />
          <StatTile label="PRs · 7d" value="3" tone="teal" />
        </View>
      </View>
    </SafeAreaView>
  );
}
