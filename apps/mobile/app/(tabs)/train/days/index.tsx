// Days list — design.md § 8.16. Compact functional version.

import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, ChevronRight, Plus } from 'lucide-react-native';
import { Card, Chip, EmptyState, IconButton, LoadingShimmer } from '../../../../src/components/ui';
import { useDays } from '../../../../src/api/days';

export default function DaysList() {
  const days = useDays();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0F1115' }} edges={['top']}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <IconButton icon={<ArrowLeft color="#F1F5F9" size={20} />} accessibilityLabel="Back" variant="ghost" onPress={() => router.back()} />
          <Text style={{ color: '#F1F5F9', fontSize: 22, fontWeight: '700' }}>Days</Text>
        </View>
        <IconButton icon={<Plus color="#042F2A" size={20} />} accessibilityLabel="New day" variant="accent-teal" onPress={() => router.push('/(tabs)/train/days/new')} />
      </View>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 80, gap: 10 }}>
        {days.isLoading ? (
          <Card><LoadingShimmer height={60} /></Card>
        ) : (days.data ?? []).length === 0 ? (
          <Card>
            <EmptyState title="No days yet" subtitle="Days are reusable workout templates. Create one and use it in multiple weeks." />
          </Card>
        ) : (
          (days.data ?? []).map((d) => (
            <Pressable key={d.id} onPress={() => router.push(`/(tabs)/train/days/${d.id}`)}>
              <Card>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: '#F1F5F9', fontSize: 16, fontWeight: '700' }}>{d.name}</Text>
                    <Text style={{ color: '#94A3B8', fontSize: 11, marginTop: 2 }}>
                      {d.exercises?.length ?? 0} exercises
                    </Text>
                  </View>
                  <ChevronRight color="#64748B" size={16} />
                </View>
              </Card>
            </Pressable>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
