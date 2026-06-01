// Routine new — design.md § 8 screen 12. Compact functional version.

import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { X } from 'lucide-react-native';
import { Button, Card, IconButton, Input, SegmentedControl } from '../../../../src/components/ui';
import { useCreateRoutine } from '../../../../src/api/routines';
import { useWeeks } from '../../../../src/api/weeks';

export default function RoutineNew() {
  const [name, setName] = useState('');
  const [cycleMode, setCycleMode] = useState<'LOOP' | 'SEQUENCE' | 'WEEKLY_PICK'>('LOOP');
  const [selectedWeekIds, setSelectedWeekIds] = useState<string[]>([]);
  const create = useCreateRoutine();
  const weeks = useWeeks();

  const today = new Date().toISOString().slice(0, 10);

  const save = async () => {
    if (!name.trim() || selectedWeekIds.length === 0) return;
    try {
      const r = await create.mutateAsync({
        name: name.trim(),
        cycleMode,
        startDate: today,
        weekIds: selectedWeekIds,
      });
      router.replace(`/(tabs)/train/routines/${r.id}`);
    } catch {}
  };

  const toggle = (id: string) => {
    setSelectedWeekIds((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]));
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0F1115' }} edges={['top']}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 12 }}>
        <IconButton icon={<X color="#F1F5F9" size={20} />} accessibilityLabel="Cancel" variant="ghost" onPress={() => router.back()} />
        <Text style={{ color: '#F1F5F9', fontSize: 17, fontWeight: '700' }}>New routine</Text>
        <Pressable onPress={save} disabled={!name.trim() || selectedWeekIds.length === 0 || create.isPending}>
          <Text style={{ color: !name.trim() || selectedWeekIds.length === 0 ? '#64748B' : '#14B8A6', fontSize: 14, fontWeight: '700' }}>Save</Text>
        </Pressable>
      </View>
      <ScrollView contentContainerStyle={{ padding: 20, gap: 16, paddingBottom: 80 }}>
        <Input label="Name" value={name} onChangeText={setName} placeholder="e.g. PPL Hybrid" />
        <View>
          <Text style={{ color: '#94A3B8', fontSize: 11, fontWeight: '700', letterSpacing: 0.08, textTransform: 'uppercase', marginBottom: 8 }}>Cycle mode</Text>
          <SegmentedControl
            options={[
              { label: 'Loop', value: 'LOOP' },
              { label: 'Seq', value: 'SEQUENCE' },
              { label: 'Manual', value: 'WEEKLY_PICK' },
            ]}
            value={cycleMode}
            onChange={setCycleMode}
          />
        </View>
        <View>
          <Text style={{ color: '#94A3B8', fontSize: 11, fontWeight: '700', letterSpacing: 0.08, textTransform: 'uppercase', marginBottom: 8 }}>
            Pick weeks ({selectedWeekIds.length} selected)
          </Text>
          {(weeks.data ?? []).length === 0 ? (
            <Card><Text style={{ color: '#94A3B8', fontSize: 12, textAlign: 'center', padding: 12 }}>No weeks yet. Create weeks first.</Text></Card>
          ) : (
            (weeks.data ?? []).map((w) => {
              const idx = selectedWeekIds.indexOf(w.id);
              const selected = idx >= 0;
              return (
                <Pressable key={w.id} onPress={() => toggle(w.id)} style={{ marginBottom: 8 }}>
                  <Card accent={selected ? 'teal' : undefined}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Text style={{ color: '#F1F5F9', fontSize: 14, fontWeight: '700' }}>{w.name}</Text>
                      {selected ? <Text style={{ color: '#14B8A6', fontFamily: 'JetBrainsMono_700Bold', fontSize: 14 }}>{idx + 1}</Text> : null}
                    </View>
                  </Card>
                </Pressable>
              );
            })
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
