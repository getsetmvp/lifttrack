// Exercise picker modal — design.md § 8 screen 21.
// Opens from Day detail "Add exercise" button. Selecting an exercise adds it w/ default targets.
// dayId passed via query param.

import { useState } from 'react';
import { FlatList, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Dumbbell, Search, X } from 'lucide-react-native';
import type { Exercise } from '@liftfuel/shared-types';
import { Card, IconButton, EmptyState, LoadingShimmer } from '../src/components/ui';
import { useExercises } from '../src/api/exercises';
import { useAddDayExercises, useDay } from '../src/api/days';
import { safeBack } from '../src/lib/safeBack';

const MUSCLES = ['ALL', 'CHEST', 'BACK', 'SHOULDERS', 'LEGS', 'ARMS', 'CORE'] as const;
type Muscle = (typeof MUSCLES)[number];

export default function ExercisePicker() {
  const { dayId } = useLocalSearchParams<{ dayId: string }>();
  const [q, setQ] = useState('');
  const [muscle, setMuscle] = useState<Muscle>('ALL');
  const exercises = useExercises({ q: q || undefined, muscle: muscle === 'ALL' ? undefined : muscle });
  const day = useDay(dayId);
  const addExercises = useAddDayExercises();

  const onPick = async (ex: Exercise) => {
    const nextOrder = day.data?.exercises?.length ?? 0;
    await addExercises.mutateAsync({
      id: dayId!,
      exercises: [
        {
          exerciseId: ex.id,
          order: nextOrder,
          isWarmup: false,
          targetSets: 3,
          targetRepsMin: 8,
          targetRepsMax: 12,
          restSeconds: 90,
          allowsDropset: false,
          notes: null,
        },
      ],
    });
    safeBack(`/(tabs)/train/days/${dayId}` as any);
  };

  const rows: Exercise[] = (exercises.data?.pages ?? []).flatMap((p: any) => p.data ?? []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0F1115' }} edges={['top', 'bottom']}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <IconButton icon={<X color="#F1F5F9" size={20} />} accessibilityLabel="Close" variant="ghost" onPress={() => safeBack(`/(tabs)/train/days/${dayId}` as any)} />
          <Text style={{ color: '#F1F5F9', fontSize: 18, fontWeight: '700' }}>Add exercise</Text>
        </View>
      </View>
      <View style={{ paddingHorizontal: 20, marginBottom: 8 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, padding: 10, borderRadius: 12, backgroundColor: '#181B22', borderWidth: 1, borderColor: '#2A2F3A' }}>
          <Search color="#94A3B8" size={18} />
          <TextInput
            value={q}
            onChangeText={setQ}
            placeholder="Search exercises…"
            placeholderTextColor="#64748B"
            style={{ flex: 1, color: '#F1F5F9', fontSize: 14, padding: 0 }}
            autoCorrect={false}
            autoCapitalize="none"
          />
        </View>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ maxHeight: 50 }} contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}>
        {MUSCLES.map((m) => {
          const selected = muscle === m;
          return (
            <Pressable
              key={m}
              onPress={() => setMuscle(m)}
              style={{
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 999,
                backgroundColor: selected ? 'rgba(20,184,166,0.18)' : '#181B22',
                borderWidth: 1,
                borderColor: selected ? '#14B8A6' : '#2A2F3A',
              }}
            >
              <Text style={{ color: selected ? '#14B8A6' : '#94A3B8', fontSize: 12, fontWeight: '700' }}>
                {m === 'ALL' ? 'All' : m.charAt(0) + m.slice(1).toLowerCase()}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
      <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 8 }}>
        {exercises.isLoading ? (
          <Card>
            <LoadingShimmer height={300} />
          </Card>
        ) : rows.length === 0 ? (
          <Card>
            <EmptyState
              icon={<Dumbbell color="#94A3B8" size={28} />}
              title="No exercises found"
              subtitle={q ? `No matches for "${q}".` : 'Exercise catalog not yet seeded.'}
            />
          </Card>
        ) : (
          <FlatList
            data={rows}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => onPick(item)}
                disabled={addExercises.isPending}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 12,
                  padding: 12,
                  borderRadius: 12,
                  backgroundColor: '#181B22',
                  borderWidth: 1,
                  borderColor: '#2A2F3A',
                  marginBottom: 8,
                  opacity: addExercises.isPending ? 0.5 : 1,
                }}
              >
                <View style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: 'rgba(20,184,166,0.15)', alignItems: 'center', justifyContent: 'center' }}>
                  <Dumbbell color="#14B8A6" size={18} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: '#F1F5F9', fontSize: 14, fontWeight: '700' }}>{item.name}</Text>
                  <Text style={{ color: '#94A3B8', fontFamily: 'JetBrainsMono_500Medium', fontSize: 10 }}>
                    {item.muscleGroup} · {item.equipment} · {item.category}
                  </Text>
                </View>
              </Pressable>
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 40 }}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
