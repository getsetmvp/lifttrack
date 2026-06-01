import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { X } from 'lucide-react-native';
import { Button, Card, IconButton, Input } from '../../../../src/components/ui';
import { useCreateWeek } from '../../../../src/api/weeks';
import { useDays } from '../../../../src/api/days';

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function WeekNew() {
  const [name, setName] = useState('');
  const [slots, setSlots] = useState<(string | null)[]>(Array(7).fill(null));
  const create = useCreateWeek();
  const days = useDays();

  const save = async () => {
    if (!name.trim()) return;
    try {
      const w = await create.mutateAsync({
        name: name.trim(),
        slots: slots.map((dayId, dayIndex) => ({ dayIndex, dayId })),
      });
      router.replace(`/(tabs)/train/weeks/${w.id}`);
    } catch {}
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0F1115' }} edges={['top']}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 12 }}>
        <IconButton icon={<X color="#F1F5F9" size={20} />} accessibilityLabel="Cancel" variant="ghost" onPress={() => router.back()} />
        <Text style={{ color: '#F1F5F9', fontSize: 17, fontWeight: '700' }}>New week</Text>
        <Pressable onPress={save} disabled={!name.trim() || create.isPending}>
          <Text style={{ color: !name.trim() ? '#64748B' : '#14B8A6', fontSize: 14, fontWeight: '700' }}>Save</Text>
        </Pressable>
      </View>
      <ScrollView contentContainerStyle={{ padding: 20, gap: 16, paddingBottom: 80 }}>
        <Input label="Name" value={name} onChangeText={setName} placeholder="e.g. PPL Wk1" />
        <Text style={{ color: '#94A3B8', fontSize: 11, fontWeight: '700', letterSpacing: 0.08, textTransform: 'uppercase' }}>
          Slots (tap to cycle through Days + Rest)
        </Text>
        {slots.map((slotDayId, dayIndex) => {
          const cur = (days.data ?? []).find((d) => d.id === slotDayId);
          return (
            <Pressable
              key={dayIndex}
              onPress={() => {
                // cycle: null → first day → second → ... → null
                const all = [null, ...(days.data ?? []).map((d) => d.id)];
                const next = all[(all.indexOf(slotDayId) + 1) % all.length] ?? null;
                setSlots((s) => s.map((v, i) => (i === dayIndex ? next : v)));
              }}
            >
              <Card>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  <View style={{ width: 44, height: 28, borderRadius: 6, backgroundColor: '#21252E', alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ color: '#F1F5F9', fontFamily: 'JetBrainsMono_700Bold', fontSize: 11 }}>{DAY_LABELS[dayIndex]}</Text>
                  </View>
                  <Text style={{ flex: 1, color: cur ? '#F1F5F9' : '#94A3B8', fontSize: 14, fontWeight: '700' }}>
                    {cur?.name ?? 'Rest'}
                  </Text>
                </View>
              </Card>
            </Pressable>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}
