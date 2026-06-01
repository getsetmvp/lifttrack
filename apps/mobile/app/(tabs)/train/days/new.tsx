// Day create — design.md § 8 screen 18 (compact).

import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { X } from 'lucide-react-native';
import { Button, Card, IconButton, Input } from '../../../../src/components/ui';
import { useCreateDay } from '../../../../src/api/days';

export default function DayNew() {
  const [name, setName] = useState('');
  const [notes, setNotes] = useState('');
  const create = useCreateDay();

  const save = async () => {
    if (!name.trim()) return;
    try {
      const d = await create.mutateAsync({ name: name.trim(), notes: notes.trim() || null, exercises: [] });
      router.replace(`/(tabs)/train/days/${d.id}`);
    } catch {}
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0F1115' }} edges={['top']}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 12 }}>
        <IconButton icon={<X color="#F1F5F9" size={20} />} accessibilityLabel="Cancel" variant="ghost" onPress={() => router.back()} />
        <Text style={{ color: '#F1F5F9', fontSize: 17, fontWeight: '700' }}>New day</Text>
        <Pressable onPress={save} disabled={!name.trim() || create.isPending}>
          <Text style={{ color: !name.trim() || create.isPending ? '#64748B' : '#14B8A6', fontSize: 14, fontWeight: '700' }}>Save</Text>
        </Pressable>
      </View>
      <ScrollView contentContainerStyle={{ padding: 20, gap: 16 }}>
        <Input label="Name" value={name} onChangeText={setName} placeholder="e.g. Heavy Push" />
        <Input label="Notes (optional)" value={notes} onChangeText={setNotes} placeholder="Focus on slow eccentric…" />
        <Card>
          <Text style={{ color: '#94A3B8', fontSize: 12, textAlign: 'center', padding: 12 }}>
            Add exercises in the Day detail after save. Search from 82-exercise catalog (seed pending — R2 asset migration P1 task).
          </Text>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}
