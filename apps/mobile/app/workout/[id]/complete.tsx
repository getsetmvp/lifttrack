// Workout complete — design.md § 8.10.

import { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Trophy } from 'lucide-react-native';
import { Button, Card, IconButton, PrBadge } from '../../../src/components/ui';
import { useUpdateWorkout, useWorkout } from '../../../src/api/workouts';
import { formatDuration } from '../../../src/lib/format';

const MOODS = ['😞', '😐', '🙂', '😄', '🔥'];

export default function Complete() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const workoutId = id ?? '';
  const w = useWorkout(workoutId);
  const update = useUpdateWorkout();
  const [mood, setMood] = useState(3);
  const [notes, setNotes] = useState('');

  const exercises = w.data?.exercises ?? [];
  const prs = exercises.flatMap((e) => (e.sets ?? []).map((s) => ({ ...s, name: e.exercise?.name ?? '—' }))).filter((s) => s.isPr);
  const totalVol = exercises.reduce((acc, e) => acc + (e.sets ?? []).reduce((a, s) => a + s.weightKg * s.reps, 0), 0);
  const totalSets = exercises.reduce((a, e) => a + (e.sets?.length ?? 0), 0);
  const startedMs = w.data ? new Date(w.data.startedAt).getTime() : 0;
  const endedMs = w.data?.endedAt ? new Date(w.data.endedAt).getTime() : Date.now();
  const durationMs = endedMs - startedMs;

  const save = async () => {
    await update.mutateAsync({ id: workoutId, mood: mood + 1, notes });
    router.replace('/(tabs)/today');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0F1115' }} edges={['top']}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 12 }}>
        <IconButton icon={<ArrowLeft color="#F1F5F9" size={20} />} accessibilityLabel="Back" variant="ghost" onPress={() => router.back()} />
        <Text style={{ color: '#F1F5F9', fontSize: 17, fontWeight: '700' }}>Workout complete</Text>
        <Pressable onPress={save}><Text style={{ color: '#14B8A6', fontSize: 14, fontWeight: '700' }}>Save</Text></Pressable>
      </View>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 80, gap: 16 }}>
        <Card accent="teal">
          <View style={{ alignItems: 'center' }}>
            <Text style={{ color: '#94A3B8', fontSize: 10, fontWeight: '700', letterSpacing: 0.16, textTransform: 'uppercase' }}>
              {w.data?.dayName ?? 'Free workout'}
            </Text>
            <Text style={{ color: '#F1F5F9', fontFamily: 'JetBrainsMono_700Bold', fontSize: 36, marginTop: 4 }}>
              {formatDuration(durationMs)}
            </Text>
            <View style={{ flexDirection: 'row', gap: 16, marginTop: 12 }}>
              <Stat label="Volume" value={`${(totalVol / 1000).toFixed(1)} t`} />
              <Divider />
              <Stat label="Sets" value={`${totalSets}`} />
              <Divider />
              <Stat label="PRs" value={`${prs.length}`} tone="teal" />
            </View>
          </View>
        </Card>

        {prs.length > 0 ? (
          <View>
            <Text style={{ color: '#94A3B8', fontSize: 11, fontWeight: '700', letterSpacing: 0.08, textTransform: 'uppercase', marginBottom: 8 }}>
              Personal records
            </Text>
            <Card padding={0}>
              {prs.map((s, i, arr) => (
                <View key={s.id}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12 }}>
                    <PrBadge />
                    <View style={{ flex: 1 }}>
                      <Text style={{ color: '#F1F5F9', fontSize: 14, fontWeight: '700' }}>{s.name}</Text>
                      <Text style={{ color: '#94A3B8', fontFamily: 'JetBrainsMono_500Medium', fontSize: 11 }}>
                        {s.weightKg} × {s.reps} → e1RM {Math.round(s.weightKg * (1 + s.reps / 30) * 10) / 10} kg
                      </Text>
                    </View>
                  </View>
                  {i < arr.length - 1 ? <View style={{ height: 1, backgroundColor: '#2A2F3A', marginLeft: 12 }} /> : null}
                </View>
              ))}
            </Card>
          </View>
        ) : null}

        <View>
          <Text style={{ color: '#94A3B8', fontSize: 11, fontWeight: '700', letterSpacing: 0.08, textTransform: 'uppercase', marginBottom: 8 }}>
            How did it feel?
          </Text>
          <Card>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
              {MOODS.map((m, i) => (
                <Pressable
                  key={i}
                  onPress={() => setMood(i)}
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 22,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: i === mood ? 'rgba(20,184,166,0.18)' : 'transparent',
                    borderWidth: i === mood ? 2 : 0,
                    borderColor: '#14B8A6',
                  }}
                >
                  <Text style={{ fontSize: 22, opacity: i === mood ? 1 : 0.4 }}>{m}</Text>
                </Pressable>
              ))}
            </View>
          </Card>
        </View>

        <View>
          <Text style={{ color: '#94A3B8', fontSize: 11, fontWeight: '700', letterSpacing: 0.08, textTransform: 'uppercase', marginBottom: 8 }}>
            Notes
          </Text>
          <Card>
            <TextInput
              value={notes}
              onChangeText={setNotes}
              multiline
              placeholder="Optional reflection…"
              placeholderTextColor="#64748B"
              style={{ color: '#F1F5F9', fontSize: 14, minHeight: 60, textAlignVertical: 'top' }}
            />
          </Card>
        </View>

        <Button label="Save workout" variant="primary-teal" fullWidth onPress={save} loading={update.isPending} />
      </ScrollView>
    </SafeAreaView>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone?: 'teal' }) {
  return (
    <View style={{ alignItems: 'center' }}>
      <Text style={{ color: '#94A3B8', fontSize: 10 }}>{label}</Text>
      <Text style={{ color: tone === 'teal' ? '#14B8A6' : '#F1F5F9', fontFamily: 'JetBrainsMono_700Bold', fontSize: 16, marginTop: 2 }}>{value}</Text>
    </View>
  );
}

function Divider() {
  return <View style={{ width: 1, height: 32, backgroundColor: '#2A2F3A' }} />;
}
