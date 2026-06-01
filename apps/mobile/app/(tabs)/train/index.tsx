// Train landing — design.md § 8.2.

import { Pressable, RefreshControl, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { CalendarDays, ChevronRight, Folder, History, Layers, Play, Search } from 'lucide-react-native';
import { Button, Card, Chip, IconButton, LoadingShimmer } from '../../../src/components/ui';
import { useActiveRoutine, useRoutines } from '../../../src/api/routines';
import { useDays } from '../../../src/api/days';
import { useWeeks } from '../../../src/api/weeks';
import { useStartWorkout } from '../../../src/api/workouts';
import { useRefresh } from '../../../src/lib/useRefresh';

export default function TrainLanding() {
  const active = useActiveRoutine();
  const days = useDays();
  const weeks = useWeeks();
  const routines = useRoutines();
  const start = useStartWorkout();
  const { refreshing, onRefresh } = useRefresh(active, days, weeks, routines);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0F1115' }} edges={['top']}>
      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 100, gap: 16 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#14B8A6" colors={['#14B8A6']} />}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={{ color: '#F1F5F9', fontSize: 24, fontWeight: '700' }}>Train</Text>
          <IconButton icon={<History color="#F1F5F9" size={20} />} accessibilityLabel="History" onPress={() => router.push('/(tabs)/train/history')} />
        </View>

        <View>
          <Text style={{ color: '#94A3B8', fontSize: 11, fontWeight: '700', letterSpacing: 0.08, textTransform: 'uppercase', marginBottom: 8 }}>
            Active routine
          </Text>
          {active.isLoading ? (
            <Card><LoadingShimmer height={80} /></Card>
          ) : !active.data ? (
            <Card>
              <Text style={{ color: '#94A3B8', fontSize: 13, textAlign: 'center', padding: 20 }}>
                No active routine yet.
              </Text>
            </Card>
          ) : (
            <Card accent="teal">
              <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: '#F1F5F9', fontSize: 18, fontWeight: '700' }}>{active.data.name}</Text>
                  <Text style={{ color: '#94A3B8', fontFamily: 'JetBrainsMono_500Medium', fontSize: 11, marginTop: 2 }}>
                    {active.data.weekRefs.length} weeks · {active.data.cycleMode}
                  </Text>
                </View>
                <Chip label="Active" tone="teal" />
              </View>
              <View style={{ height: 12 }} />
              <Button label="View routine" variant="secondary" fullWidth onPress={() => router.push(`/(tabs)/train/routines/${active.data!.id}`)} />
            </Card>
          )}
        </View>

        <View>
          <Text style={{ color: '#94A3B8', fontSize: 11, fontWeight: '700', letterSpacing: 0.08, textTransform: 'uppercase', marginBottom: 8 }}>
            Library
          </Text>
          <Card padding={0}>
            <LibRow
              icon={<Folder color="#14B8A6" size={18} />}
              title="Routines"
              count={routines.data?.length ?? 0}
              onPress={() => router.push('/(tabs)/train/routines')}
            />
            <View style={{ height: 1, backgroundColor: '#2A2F3A', marginLeft: 60 }} />
            <LibRow
              icon={<CalendarDays color="#14B8A6" size={18} />}
              title="Weeks"
              count={weeks.data?.length ?? 0}
              onPress={() => router.push('/(tabs)/train/weeks')}
            />
            <View style={{ height: 1, backgroundColor: '#2A2F3A', marginLeft: 60 }} />
            <LibRow
              icon={<Layers color="#14B8A6" size={18} />}
              title="Days"
              count={days.data?.length ?? 0}
              onPress={() => router.push('/(tabs)/train/days')}
            />
          </Card>
        </View>

        <View>
          <Text style={{ color: '#94A3B8', fontSize: 11, fontWeight: '700', letterSpacing: 0.08, textTransform: 'uppercase', marginBottom: 8 }}>
            Quick actions
          </Text>
          <View style={{ gap: 8 }}>
            <Pressable
              onPress={async () => {
                const w = await start.mutateAsync({});
                router.push(`/workout/${w.id}/active`);
              }}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 12,
                padding: 12,
                backgroundColor: '#181B22',
                borderWidth: 1,
                borderColor: '#2A2F3A',
                borderRadius: 14,
              }}
            >
              <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: '#14B8A6', alignItems: 'center', justifyContent: 'center' }}>
                <Play color="#042F2A" size={16} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: '#F1F5F9', fontSize: 14, fontWeight: '700' }}>Start free workout</Text>
                <Text style={{ color: '#94A3B8', fontSize: 11 }}>No plan, just log</Text>
              </View>
              <ChevronRight color="#64748B" size={16} />
            </Pressable>
            <Pressable
              onPress={() => router.push('/(tabs)/train/routines')}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 12,
                padding: 12,
                backgroundColor: '#181B22',
                borderWidth: 1,
                borderColor: '#2A2F3A',
                borderRadius: 14,
              }}
            >
              <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: '#21252E', alignItems: 'center', justifyContent: 'center' }}>
                <Search color="#94A3B8" size={16} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: '#F1F5F9', fontSize: 14, fontWeight: '700' }}>Browse exercises</Text>
                <Text style={{ color: '#94A3B8', fontSize: 11 }}>Find an exercise to add</Text>
              </View>
              <ChevronRight color="#64748B" size={16} />
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function LibRow({ icon, title, count, onPress }: { icon: React.ReactNode; title: string; count: number; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={{ flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 }}>
      <View style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: 'rgba(20,184,166,0.15)', alignItems: 'center', justifyContent: 'center' }}>
        {icon}
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ color: '#F1F5F9', fontSize: 14, fontWeight: '700' }}>{title}</Text>
        <Text style={{ color: '#94A3B8', fontSize: 11 }}>{count} saved</Text>
      </View>
      <ChevronRight color="#64748B" size={16} />
    </Pressable>
  );
}
