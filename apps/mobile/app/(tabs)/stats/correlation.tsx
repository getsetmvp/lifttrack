// Stats · Correlation — design.md § 8 screen 35.

import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, ChevronDown, Sparkles } from 'lucide-react-native';
import { Card, IconButton, EmptyState } from '../../../src/components/ui';
import { safeBack } from '../../../src/lib/safeBack';

const X_OPTIONS = ['Protein g/kg', 'kcal surplus', 'Workout duration'];
const Y_OPTIONS = ['PR count', 'Volume', 'e1RM gain'];

export default function CorrelationDetail() {
  const [x, setX] = useState(X_OPTIONS[0]!);
  const [y, setY] = useState(Y_OPTIONS[0]!);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0F1115' }} edges={['top']}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 20, paddingVertical: 12 }}>
        <IconButton icon={<ArrowLeft color="#F1F5F9" size={20} />} accessibilityLabel="Back" variant="ghost" onPress={() => safeBack('/(tabs)/stats')} />
        <Text style={{ color: '#F1F5F9', fontSize: 22, fontWeight: '700', letterSpacing: -0.3 }}>Correlation</Text>
      </View>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 80, gap: 12 }}>
        <Card>
          <Text style={{ color: '#94A3B8', fontSize: 10, fontWeight: '700', textTransform: 'uppercase', marginBottom: 6 }}>X-axis</Text>
          <Picker value={x} options={X_OPTIONS} onChange={setX} />
          <Text style={{ color: '#94A3B8', fontSize: 10, fontWeight: '700', textTransform: 'uppercase', marginBottom: 6, marginTop: 12 }}>Y-axis</Text>
          <Picker value={y} options={Y_OPTIONS} onChange={setY} />
        </Card>
        <Card>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
            <Text style={{ color: '#94A3B8', fontSize: 11, fontWeight: '700', letterSpacing: 0.08, textTransform: 'uppercase' }}>Scatter</Text>
            <Text style={{ color: '#14B8A6', fontFamily: 'JetBrainsMono_700Bold', fontSize: 12 }}>r = —</Text>
          </View>
          <EmptyState title="Not enough data" subtitle="Need ≥4 weeks of workout + meal logs to build a scatter." />
        </Card>
        <View style={{ flexDirection: 'row', gap: 8, padding: 12, borderRadius: 12, borderWidth: 1, borderColor: '#14B8A6', backgroundColor: 'rgba(20,184,166,0.06)' }}>
          <Sparkles color="#14B8A6" size={18} />
          <Text style={{ flex: 1, color: '#F1F5F9', fontSize: 13, lineHeight: 18 }}>
            Insight appears here once correlations are computed.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Picker({ value, options, onChange }: { value: string; options: string[]; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <View>
      <Pressable
        onPress={() => setOpen((o) => !o)}
        style={{ height: 40, paddingHorizontal: 12, borderRadius: 10, backgroundColor: '#21252E', borderWidth: 1, borderColor: '#2A2F3A', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
      >
        <Text style={{ color: '#F1F5F9', fontSize: 13, fontWeight: '600' }}>{value}</Text>
        <ChevronDown color="#94A3B8" size={14} />
      </Pressable>
      {open ? (
        <View style={{ marginTop: 4, borderRadius: 10, backgroundColor: '#181B22', borderWidth: 1, borderColor: '#2A2F3A', overflow: 'hidden' }}>
          {options.map((o) => (
            <Pressable
              key={o}
              onPress={() => {
                onChange(o);
                setOpen(false);
              }}
              style={{ padding: 10 }}
            >
              <Text style={{ color: o === value ? '#14B8A6' : '#F1F5F9', fontSize: 13, fontWeight: '600' }}>{o}</Text>
            </Pressable>
          ))}
        </View>
      ) : null}
    </View>
  );
}
