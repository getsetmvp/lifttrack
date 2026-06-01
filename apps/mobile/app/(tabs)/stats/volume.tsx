// Stats · Volume — design.md § 8 screen 33.

import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, ChevronDown } from 'lucide-react-native';
import { Card, IconButton, SegmentedControl, EmptyState } from '../../../src/components/ui';
import { useAnalyticsSummary } from '../../../src/api/analytics';
import { safeBack } from '../../../src/lib/safeBack';

export default function VolumeDetail() {
  const [unit, setUnit] = useState<'WEEK' | 'DAY'>('WEEK');
  const summary = useAnalyticsSummary('30d');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0F1115' }} edges={['top']}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 20, paddingVertical: 12 }}>
        <IconButton icon={<ArrowLeft color="#F1F5F9" size={20} />} accessibilityLabel="Back" variant="ghost" onPress={() => safeBack('/(tabs)/stats')} />
        <Text style={{ color: '#F1F5F9', fontSize: 22, fontWeight: '700', letterSpacing: -0.3 }}>Volume</Text>
      </View>
      <View style={{ flexDirection: 'row', gap: 8, paddingHorizontal: 20, marginBottom: 12 }}>
        <View style={{ flex: 1 }}>
          <SegmentedControl
            options={[
              { label: 'Week', value: 'WEEK' },
              { label: 'Day', value: 'DAY' },
            ]}
            value={unit}
            onChange={setUnit}
          />
        </View>
        <Pressable style={{ height: 40, paddingHorizontal: 12, borderRadius: 10, backgroundColor: '#181B22', borderWidth: 1, borderColor: '#2A2F3A', flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <Text style={{ color: '#F1F5F9', fontSize: 12, fontWeight: '600' }}>All muscles</Text>
          <ChevronDown color="#94A3B8" size={14} />
        </Pressable>
      </View>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 80, gap: 12 }}>
        <Card>
          <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
            <Text style={{ color: '#F1F5F9', fontFamily: 'JetBrainsMono_700Bold', fontSize: 28 }}>
              {((summary.data?.volumeKg ?? 0) / 1000).toFixed(1)}
            </Text>
            <Text style={{ color: '#94A3B8', fontSize: 13 }}>t / {unit === 'WEEK' ? 'week' : 'day'} avg</Text>
          </View>
          <EmptyState title="No volume yet" subtitle="Log workouts to build trend." />
        </Card>
        <Text style={{ color: '#94A3B8', fontSize: 11, fontWeight: '700', letterSpacing: 0.08, textTransform: 'uppercase', marginTop: 4 }}>
          By muscle group
        </Text>
        <Card>
          <EmptyState title="—" subtitle="Muscle-group breakdown appears once you've logged sets." />
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}
