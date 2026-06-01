// Routines list — design.md § 8 screen 10.

import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, ChevronRight, Plus } from 'lucide-react-native';
import { Card, Chip, EmptyState, IconButton, LoadingShimmer } from '../../../../src/components/ui';
import { useRoutines } from '../../../../src/api/routines';
import { formatRelativeDay } from '../../../../src/lib/format';

export default function RoutinesList() {
  const routines = useRoutines();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0F1115' }} edges={['top']}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <IconButton icon={<ArrowLeft color="#F1F5F9" size={20} />} accessibilityLabel="Back" variant="ghost" onPress={() => router.back()} />
          <Text style={{ color: '#F1F5F9', fontSize: 22, fontWeight: '700' }}>Routines</Text>
        </View>
        <IconButton icon={<Plus color="#042F2A" size={20} />} accessibilityLabel="New" variant="accent-teal" onPress={() => router.push('/(tabs)/train/routines/new')} />
      </View>
      <ScrollView contentContainerStyle={{ padding: 20, gap: 10, paddingBottom: 80 }}>
        {routines.isLoading ? <Card><LoadingShimmer height={60} /></Card> : (routines.data ?? []).length === 0 ? (
          <Card><EmptyState title="No routines" subtitle="Create your first routine to start training." /></Card>
        ) : (routines.data ?? []).map((r) => (
          <Pressable key={r.id} onPress={() => router.push(`/(tabs)/train/routines/${r.id}`)}>
            <Card accent={r.isActive ? 'teal' : undefined}>
              <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: '#F1F5F9', fontSize: 16, fontWeight: '700' }}>{r.name}</Text>
                  <Text style={{ color: '#94A3B8', fontFamily: 'JetBrainsMono_500Medium', fontSize: 11, marginTop: 2 }}>
                    {r.weekRefs.length} weeks · {r.cycleMode} · started {formatRelativeDay(r.startDate)}
                  </Text>
                </View>
                {r.isActive ? <Chip label="Active" tone="teal" /> : <ChevronRight color="#64748B" size={16} />}
              </View>
            </Card>
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
