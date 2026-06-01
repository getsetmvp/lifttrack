// Week detail — design.md § 8.4 (compact).

import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, ChevronRight, MoreVertical } from 'lucide-react-native';
import { Card, IconButton, LoadingShimmer } from '../../../../src/components/ui';
import { useWeek } from '../../../../src/api/weeks';

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function WeekDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const w = useWeek(id);
  const slots = (w.data?.slots ?? []).slice().sort((a, b) => a.dayIndex - b.dayIndex);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0F1115' }} edges={['top']}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 }}>
          <IconButton icon={<ArrowLeft color="#F1F5F9" size={20} />} accessibilityLabel="Back" variant="ghost" onPress={() => router.back()} />
          <Text style={{ color: '#F1F5F9', fontSize: 17, fontWeight: '700', flex: 1 }} numberOfLines={1}>{w.data?.name ?? '—'}</Text>
        </View>
        <IconButton icon={<MoreVertical color="#F1F5F9" size={16} />} accessibilityLabel="More" variant="ghost" size={36} />
      </View>
      <Text style={{ color: '#94A3B8', fontSize: 11, paddingHorizontal: 20, marginBottom: 12 }}>
        Used in {w.data?.usedInRoutines ?? 0} routines · same Day reusable across slots
      </Text>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 80, gap: 8 }}>
        {w.isLoading ? <Card><LoadingShimmer height={200} /></Card> : (
          slots.map((s) => (
            <Card key={s.id}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <View style={{ width: 36, height: 30, borderRadius: 6, backgroundColor: '#21252E', alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ color: '#F1F5F9', fontFamily: 'JetBrainsMono_700Bold', fontSize: 11 }}>{DAY_LABELS[s.dayIndex]}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: s.day ? '#F1F5F9' : '#94A3B8', fontSize: 14, fontWeight: '700' }}>
                    {s.day?.name ?? 'Rest day'}
                  </Text>
                  {s.day ? (
                    <Text style={{ color: '#94A3B8', fontSize: 11 }}>{s.day.exercises?.length ?? 0} exercises</Text>
                  ) : null}
                </View>
                <ChevronRight color="#64748B" size={16} />
              </View>
            </Card>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
