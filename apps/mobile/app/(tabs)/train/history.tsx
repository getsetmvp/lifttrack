// History — design.md § 8 screen 19.

import { RefreshControl, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, Filter } from 'lucide-react-native';
import { Card, EmptyState, IconButton, LoadingShimmer } from '../../../src/components/ui';
import { useWorkouts } from '../../../src/api/workouts';
import { formatRelativeDay } from '../../../src/lib/format';
import { useRefresh } from '../../../src/lib/useRefresh';

const MOOD_EMOJI = ['😞', '😐', '🙂', '😄', '🔥'];

export default function History() {
  const w = useWorkouts();
  const { refreshing, onRefresh } = useRefresh(w);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0F1115' }} edges={['top']}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <IconButton icon={<ArrowLeft color="#F1F5F9" size={20} />} accessibilityLabel="Back" variant="ghost" onPress={() => router.back()} />
          <Text style={{ color: '#F1F5F9', fontSize: 22, fontWeight: '700' }}>History</Text>
        </View>
        <IconButton icon={<Filter color="#F1F5F9" size={20} />} accessibilityLabel="Filter" />
      </View>
      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 80, gap: 10 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#14B8A6" colors={['#14B8A6']} />}
      >
        {w.isLoading ? <Card><LoadingShimmer height={60} /></Card> : (w.data ?? []).length === 0 ? (
          <Card><EmptyState title="No workouts yet" subtitle="Your sessions appear here." /></Card>
        ) : (w.data ?? []).map((x) => (
          <Card key={x.id}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
              <Text style={{ color: '#F1F5F9', fontSize: 14, fontWeight: '700' }}>{x.dayName ?? 'Free workout'}</Text>
              <Text style={{ color: '#94A3B8', fontFamily: 'JetBrainsMono_500Medium', fontSize: 11 }}>{formatRelativeDay(x.startedAt)}</Text>
            </View>
            <Text style={{ color: '#94A3B8', fontFamily: 'JetBrainsMono_500Medium', fontSize: 11 }}>
              {Math.round((x.totalVolume ?? 0) / 1000 * 10) / 10} t · {x.prCount} PR · {MOOD_EMOJI[(x.mood ?? 3) - 1] ?? ''}
            </Text>
          </Card>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
