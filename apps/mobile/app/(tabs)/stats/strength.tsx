// Stats · Strength detail — design.md § 8 screen 32. Per-exercise e1RM curve + history.

import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Share2 } from 'lucide-react-native';
import { Card, IconButton, SegmentedControl, EmptyState } from '../../../src/components/ui';
import { safeBack } from '../../../src/lib/safeBack';

type Range = '7D' | '30D' | '90D' | 'ALL';

export default function StrengthDetail() {
  const { exerciseId, exerciseName } = useLocalSearchParams<{ exerciseId?: string; exerciseName?: string }>();
  const [range, setRange] = useState<Range>('30D');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0F1115' }} edges={['top']}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 }}>
          <IconButton icon={<ArrowLeft color="#F1F5F9" size={20} />} accessibilityLabel="Back" variant="ghost" onPress={() => safeBack('/(tabs)/stats')} />
          <Text style={{ color: '#F1F5F9', fontSize: 22, fontWeight: '700', letterSpacing: -0.3 }} numberOfLines={1}>
            {exerciseName ?? 'Strength'}
          </Text>
        </View>
        <IconButton icon={<Share2 color="#F1F5F9" size={18} />} accessibilityLabel="Share" variant="ghost" />
      </View>
      <View style={{ paddingHorizontal: 20, marginBottom: 12 }}>
        <SegmentedControl
          options={[
            { label: '7D', value: '7D' },
            { label: '30D', value: '30D' },
            { label: '90D', value: '90D' },
            { label: 'All', value: 'ALL' },
          ]}
          value={range}
          onChange={setRange}
        />
      </View>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 80, gap: 12 }}>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <Stat label="e1RM" value="—" trend="" tone="teal" />
          <Stat label="Best set" value="—" trend="" />
          <Stat label="Volume" value="—" trend="total" />
        </View>
        <Card>
          <Text style={{ color: '#94A3B8', fontSize: 11, fontWeight: '700', letterSpacing: 0.08, textTransform: 'uppercase', marginBottom: 8 }}>
            e1RM curve
          </Text>
          <EmptyState title="Log sets to see trend" subtitle="Once you have 3+ sessions, your e1RM curve appears here." />
        </Card>
        <Text style={{ color: '#94A3B8', fontSize: 11, fontWeight: '700', letterSpacing: 0.08, textTransform: 'uppercase', marginTop: 4 }}>
          Recent sessions
        </Text>
        <Card>
          <EmptyState title="No sessions yet" subtitle="Start logging to see history." />
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

function Stat({ label, value, trend, tone }: { label: string; value: string; trend: string; tone?: 'teal' }) {
  return (
    <View style={{ flex: 1, padding: 12, borderRadius: 12, backgroundColor: '#181B22', borderWidth: 1, borderColor: '#2A2F3A' }}>
      <Text style={{ color: '#94A3B8', fontSize: 10, fontWeight: '700', textTransform: 'uppercase' }}>{label}</Text>
      <Text style={{ color: tone === 'teal' ? '#14B8A6' : '#F1F5F9', fontFamily: 'JetBrainsMono_700Bold', fontSize: 18, marginTop: 2 }}>{value}</Text>
      {trend ? <Text style={{ color: '#64748B', fontFamily: 'JetBrainsMono_500Medium', fontSize: 9, marginTop: 2 }}>{trend}</Text> : null}
    </View>
  );
}
