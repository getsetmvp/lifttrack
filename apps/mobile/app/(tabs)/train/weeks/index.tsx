import { Pressable, RefreshControl, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, ChevronRight, Plus } from 'lucide-react-native';
import { Card, EmptyState, IconButton, LoadingShimmer } from '../../../../src/components/ui';
import { useWeeks } from '../../../../src/api/weeks';
import { useRefresh } from '../../../../src/lib/useRefresh';

const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

export default function WeeksList() {
  const weeks = useWeeks();
  const { refreshing, onRefresh } = useRefresh(weeks);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0F1115' }} edges={['top']}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <IconButton icon={<ArrowLeft color="#F1F5F9" size={20} />} accessibilityLabel="Back" variant="ghost" onPress={() => router.back()} />
          <Text style={{ color: '#F1F5F9', fontSize: 22, fontWeight: '700' }}>Weeks</Text>
        </View>
        <IconButton icon={<Plus color="#042F2A" size={20} />} accessibilityLabel="New" variant="accent-teal" onPress={() => router.push('/(tabs)/train/weeks/new')} />
      </View>
      <ScrollView
        contentContainerStyle={{ padding: 20, gap: 10, paddingBottom: 80 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#14B8A6" colors={['#14B8A6']} />}
      >
        {weeks.isLoading ? <Card><LoadingShimmer height={80} /></Card> : (weeks.data ?? []).length === 0 ? (
          <Card><EmptyState title="No weeks" subtitle="A Week composes 7 Days. Used in Routines." /></Card>
        ) : (weeks.data ?? []).map((w) => (
          <Pressable key={w.id} onPress={() => router.push(`/(tabs)/train/weeks/${w.id}`)}>
            <Card>
              <Text style={{ color: '#F1F5F9', fontSize: 15, fontWeight: '700' }}>{w.name}</Text>
              <View style={{ flexDirection: 'row', gap: 3, marginTop: 6 }}>
                {DAYS.map((d, i) => {
                  const slot = w.slots.find((s) => s.dayIndex === i);
                  const filled = !!slot?.dayId;
                  return (
                    <View key={i} style={{ flex: 1 }}>
                      <Text style={{ color: '#94A3B8', fontSize: 9, textAlign: 'center', marginBottom: 2 }}>{d}</Text>
                      <View
                        style={{
                          height: 22,
                          borderRadius: 5,
                          backgroundColor: filled ? 'rgba(20,184,166,0.18)' : 'rgba(148,163,184,0.12)',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Text style={{ color: filled ? '#14B8A6' : '#64748B', fontFamily: 'JetBrainsMono_700Bold', fontSize: 10 }}>
                          {filled ? slot?.day?.name?.charAt(0) ?? '?' : '·'}
                        </Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            </Card>
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
