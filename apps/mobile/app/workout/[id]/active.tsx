// Active workout — design.md § 8.6.

import { useEffect, useState } from 'react';
import { Alert, Modal, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import {
  ChevronDown,
  ChevronRight,
  Dumbbell,
  Flag,
  MoreVertical,
  Plus,
  TrendingDown,
  X,
} from 'lucide-react-native';
import { Button, Card, IconButton, NumberPad, ProgressBar, SetRow, SegmentedControl } from '../../../src/components/ui';
import { useUpdateWorkout, useWorkout, useLogSet, useSetDrops } from '../../../src/api/workouts';
import { formatDuration, formatWeight } from '../../../src/lib/format';
import { useUnitStore } from '../../../src/store/useUnitStore';
import { haptic } from '../../../src/lib/haptics';

export default function ActiveWorkout() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const workoutId = id ?? '';
  const w = useWorkout(workoutId);
  const update = useUpdateWorkout();
  const logSet = useLogSet(workoutId);
  const setDrops = useSetDrops(workoutId);
  const { unit } = useUnitStore();
  const [currentWeId, setCurrentWeId] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const [dropTargetSetId, setDropTargetSetId] = useState<string | null>(null);
  const [dropList, setDropList] = useState<{ weightKg: string; reps: string }[]>([]);
  const [weightVal, setWeightVal] = useState('');
  const [repsVal, setRepsVal] = useState('');
  const [warmup, setWarmup] = useState(false);
  const [failure, setFailure] = useState(false);
  const [unitTab, setUnitTab] = useState<'KG' | 'LB'>(unit);

  // tick clock
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const startedMs = w.data ? new Date(w.data.startedAt).getTime() : now;
  const elapsedMs = now - startedMs;

  const exercises = w.data?.exercises ?? [];
  const totalSets = exercises.reduce((a, e) => a + (e.sets?.length ?? 0), 0);
  const targetSets = exercises.length * 3; // rough heuristic
  const allPrs = exercises.flatMap((e) => e.sets ?? []).filter((s) => s.isPr).length;
  const volume = exercises.reduce(
    (acc, e) => acc + (e.sets ?? []).filter((s) => !s.isWarmup).reduce((a, s) => a + s.weightKg * s.reps, 0),
    0,
  );

  const finishWorkout = async () => {
    Alert.alert('Finish workout?', 'Mark this session complete.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Finish',
        onPress: async () => {
          await update.mutateAsync({ id: workoutId, endedAt: new Date().toISOString() });
          router.replace(`/workout/${workoutId}/complete`);
        },
      },
    ]);
  };

  const submitSet = async () => {
    if (!currentWeId) return;
    const weightKg = unitTab === 'LB' ? parseFloat(weightVal || '0') / 2.20462 : parseFloat(weightVal || '0');
    const reps = parseInt(repsVal || '0', 10);
    if (weightKg <= 0 || reps <= 0) return;
    try {
      await logSet.mutateAsync({ weId: currentWeId, dto: { weightKg, reps, isWarmup: warmup, isFailure: failure } });
      haptic.light();
      setSheetOpen(false);

      // Auto-start rest timer after non-warmup sets.
      if (!warmup) {
        const we = exercises.find((e) => e.id === currentWeId);
        const restSeconds = (we as any)?.dayExercise?.restSeconds
          ?? (we as any)?.restSeconds
          ?? 90;
        const exName = we?.exercise?.name ?? 'Next set';
        const nextSetIdx = (we?.sets?.length ?? 0) + 1;
        const targetReps = (we as any)?.dayExercise?.targetRepsMin
          ? `${(we as any).dayExercise.targetRepsMin}-${(we as any).dayExercise.targetRepsMax}`
          : null;
        const targetStr = targetReps ? `${formatWeight(weightKg, unit)} × ${targetReps}` : null;
        router.push({
          pathname: '/rest-timer' as any,
          params: {
            seconds: String(restSeconds),
            next: `Next: Set ${nextSetIdx} of ${exName}`,
            ...(targetStr ? { target: targetStr } : {}),
          },
        });
      }
      setWeightVal('');
      setRepsVal('');
      setWarmup(false);
      setFailure(false);
    } catch {}
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0F1115' }} edges={['top']}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 12 }}>
        <IconButton icon={<ChevronDown color="#F1F5F9" size={20} />} accessibilityLabel="Dismiss" variant="ghost" onPress={() => router.back()} />
        <View style={{ alignItems: 'center' }}>
          <Text style={{ color: '#94A3B8', fontSize: 11 }}>{w.data?.dayName ?? 'Free workout'}</Text>
          <Text style={{ color: '#F1F5F9', fontFamily: 'JetBrainsMono_700Bold', fontSize: 16 }}>{formatDuration(elapsedMs)}</Text>
        </View>
        <IconButton icon={<MoreVertical color="#F1F5F9" size={20} />} accessibilityLabel="More" variant="ghost" />
      </View>

      <View style={{ paddingHorizontal: 20, marginBottom: 8 }}>
        <ProgressBar value={totalSets} max={Math.max(1, targetSets)} />
        <Text style={{ color: '#94A3B8', fontFamily: 'JetBrainsMono_500Medium', fontSize: 11, marginTop: 4 }}>
          {totalSets} sets · {allPrs} PRs · {Math.round(volume / 1000 * 10) / 10} t
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 100, gap: 12 }}>
        {exercises.length === 0 ? (
          <Card>
            <Text style={{ color: '#94A3B8', fontSize: 13, textAlign: 'center', padding: 12 }}>
              No exercises yet. Add some from your Day, or pick from catalog.
            </Text>
          </Card>
        ) : null}

        {exercises.map((we) => {
          const sets = we.sets ?? [];
          const nextIdx = sets.length + 1;
          return (
            <Card key={we.id} accent="teal">
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(20,184,166,0.15)', alignItems: 'center', justifyContent: 'center' }}>
                  <Dumbbell color="#14B8A6" size={18} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: '#F1F5F9', fontSize: 16, fontWeight: '700' }}>{we.exercise?.name ?? '—'}</Text>
                  <Text style={{ color: '#94A3B8', fontFamily: 'JetBrainsMono_500Medium', fontSize: 11 }}>
                    {sets.length} sets logged
                  </Text>
                </View>
              </View>
              <View style={{ gap: 6 }}>
                {sets.map((s) => (
                  <SetRow
                    key={s.id}
                    setIndex={s.setIndex}
                    weightKg={s.weightKg}
                    reps={s.reps}
                    isWarmup={s.isWarmup}
                    isPr={s.isPr}
                    state="logged"
                    drops={s.drops}
                  />
                ))}
                <SetRow
                  setIndex={nextIdx}
                  state="pending"
                  onPress={() => {
                    setCurrentWeId(we.id);
                    setSheetOpen(true);
                  }}
                />
              </View>
              <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
                <Button
                  label="Drop set"
                  variant="ghost"
                  size="sm"
                  leadingIcon={<TrendingDown color="#F1F5F9" size={14} />}
                  onPress={() => {
                    setCurrentWeId(we.id);
                    // Default to most-recent non-warmup set in this exercise.
                    const topSet = [...sets].reverse().find((s) => !s.isWarmup);
                    setDropTargetSetId(topSet?.id ?? null);
                    setDropList([{ weightKg: topSet ? String(Math.round(topSet.weightKg * 10) / 10 * 0.875) : '', reps: '' }]);
                    setDropOpen(true);
                  }}
                />
                <Button label="Add set" variant="ghost" size="sm" leadingIcon={<Plus color="#F1F5F9" size={14} />} onPress={() => { setCurrentWeId(we.id); setSheetOpen(true); }} />
              </View>
            </Card>
          );
        })}
      </ScrollView>

      <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: 20, paddingBottom: 32 }}>
        <Button
          label="Finish workout"
          variant="primary-teal"
          fullWidth
          leadingIcon={<Flag color="#042F2A" size={16} />}
          onPress={finishWorkout}
        />
      </View>

      {/* Set Logger sheet */}
      <Modal visible={sheetOpen} transparent animationType="slide" onRequestClose={() => setSheetOpen(false)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' }}>
          <View style={{ backgroundColor: '#21252E', borderTopLeftRadius: 22, borderTopRightRadius: 22, padding: 20, gap: 12, maxHeight: '90%' }}>
            <View style={{ alignItems: 'center', marginBottom: 4 }}>
              <View style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: 'rgba(148,163,184,0.30)' }} />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View>
                <Text style={{ color: '#F1F5F9', fontSize: 18, fontWeight: '700' }}>Log Set</Text>
                <Text style={{ color: '#94A3B8', fontSize: 11 }}>
                  {exercises.find((e) => e.id === currentWeId)?.exercise?.name ?? '—'}
                </Text>
              </View>
              <Pressable onPress={() => setSheetOpen(false)}><X color="#94A3B8" size={20} /></Pressable>
            </View>

            <View style={{ flexDirection: 'row', gap: 8 }}>
              <View style={{ flex: 1 }}>
                <Text style={{ color: '#94A3B8', fontSize: 10, fontWeight: '700', letterSpacing: 0.08, textTransform: 'uppercase', textAlign: 'center', marginBottom: 4 }}>Weight</Text>
                <View style={{ height: 56, backgroundColor: '#181B22', borderRadius: 12, borderWidth: 2, borderColor: '#14B8A6', alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ color: '#F1F5F9', fontFamily: 'JetBrainsMono_700Bold', fontSize: 22 }}>{weightVal || '0'}</Text>
                </View>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: '#94A3B8', fontSize: 10, fontWeight: '700', letterSpacing: 0.08, textTransform: 'uppercase', textAlign: 'center', marginBottom: 4 }}>Reps</Text>
                <View style={{ height: 56, backgroundColor: '#181B22', borderRadius: 12, borderWidth: 1, borderColor: '#2A2F3A', alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ color: '#F1F5F9', fontFamily: 'JetBrainsMono_700Bold', fontSize: 22 }}>{repsVal || '0'}</Text>
                </View>
              </View>
            </View>

            <SegmentedControl
              options={[{ label: 'kg', value: 'KG' }, { label: 'lb', value: 'LB' }]}
              value={unitTab}
              onChange={setUnitTab}
            />
            <View style={{ flexDirection: 'row', gap: 16, marginVertical: 4 }}>
              <Pressable onPress={() => setWarmup(!warmup)} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <View style={{ width: 16, height: 16, borderRadius: 4, backgroundColor: warmup ? '#14B8A6' : 'transparent', borderWidth: 1.5, borderColor: warmup ? '#14B8A6' : '#475569' }} />
                <Text style={{ color: '#F1F5F9', fontSize: 12, fontWeight: '600' }}>Warmup</Text>
              </Pressable>
              <Pressable onPress={() => setFailure(!failure)} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <View style={{ width: 16, height: 16, borderRadius: 4, backgroundColor: failure ? '#EF4444' : 'transparent', borderWidth: 1.5, borderColor: failure ? '#EF4444' : '#475569' }} />
                <Text style={{ color: '#F1F5F9', fontSize: 12, fontWeight: '600' }}>Failure</Text>
              </Pressable>
            </View>

            <PadFor target={weightVal} onChange={setWeightVal} />
            <View style={{ flexDirection: 'row', gap: 6 }}>
              <Pressable onPress={() => setRepsVal(String(Math.max(0, parseInt(repsVal || '0', 10) - 1)))} style={{ flex: 1, height: 36, backgroundColor: '#21252E', borderRadius: 10, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: '#F1F5F9', fontFamily: 'JetBrainsMono_600SemiBold', fontSize: 14 }}>−1 rep</Text>
              </Pressable>
              <Pressable onPress={() => setRepsVal(String(parseInt(repsVal || '0', 10) + 1))} style={{ flex: 1, height: 36, backgroundColor: '#21252E', borderRadius: 10, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: '#F1F5F9', fontFamily: 'JetBrainsMono_600SemiBold', fontSize: 14 }}>+1 rep</Text>
              </Pressable>
            </View>

            <Button label="Save set" variant="primary-teal" fullWidth onPress={submitSet} loading={logSet.isPending} />
          </View>
        </View>
      </Modal>

      {/* Drop set sheet */}
      <Modal visible={dropOpen} transparent animationType="slide" onRequestClose={() => setDropOpen(false)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' }}>
          <View style={{ backgroundColor: '#21252E', borderTopLeftRadius: 22, borderTopRightRadius: 22, padding: 20, gap: 12, maxHeight: '85%' }}>
            <View style={{ alignItems: 'center', marginBottom: 4 }}>
              <View style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: 'rgba(148,163,184,0.30)' }} />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View>
                <Text style={{ color: '#F1F5F9', fontSize: 18, fontWeight: '700' }}>Drop set</Text>
                <Text style={{ color: '#94A3B8', fontSize: 11 }}>
                  {exercises.find((e) => e.id === currentWeId)?.exercise?.name ?? '—'}
                </Text>
              </View>
              <Pressable onPress={() => setDropOpen(false)}><X color="#94A3B8" size={20} /></Pressable>
            </View>
            {(() => {
              const we = exercises.find((e) => e.id === currentWeId);
              const topSet = we?.sets?.find((s) => s.id === dropTargetSetId);
              if (!topSet) {
                return (
                  <Text style={{ color: '#94A3B8', fontSize: 13, paddingVertical: 8 }}>
                    Log a top set first via the set logger, then tap Drop set again.
                  </Text>
                );
              }
              return (
                <View style={{ gap: 10 }}>
                  <Text style={{ color: '#94A3B8', fontSize: 10, fontWeight: '700', letterSpacing: 0.08, textTransform: 'uppercase' }}>Top set</Text>
                  <View style={{ padding: 12, borderRadius: 12, backgroundColor: '#181B22', borderWidth: 1, borderColor: '#2A2F3A', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={{ color: '#F1F5F9', fontFamily: 'JetBrainsMono_700Bold', fontSize: 18 }}>
                      {formatWeight(topSet.weightKg, unit)} × {topSet.reps}
                    </Text>
                    {topSet.isPr ? <Text style={{ color: '#10B981', fontSize: 10, fontWeight: '800' }}>PR</Text> : null}
                  </View>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 }}>
                    <Text style={{ color: '#94A3B8', fontSize: 10, fontWeight: '700', letterSpacing: 0.08, textTransform: 'uppercase' }}>Drops</Text>
                    <Text style={{ color: '#64748B', fontSize: 10 }}>max 5</Text>
                  </View>
                  <ScrollView style={{ maxHeight: 280 }} contentContainerStyle={{ gap: 8 }}>
                    {dropList.map((d, i) => (
                      <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        <View style={{ width: 32, height: 40, borderRadius: 8, backgroundColor: 'rgba(249,115,22,0.18)', alignItems: 'center', justifyContent: 'center' }}>
                          <Text style={{ color: '#F97316', fontFamily: 'JetBrainsMono_700Bold', fontSize: 11 }}>D{i + 1}</Text>
                        </View>
                        <TextInput
                          value={d.weightKg}
                          onChangeText={(v) => {
                            const next = [...dropList];
                            next[i] = { ...next[i]!, weightKg: v };
                            setDropList(next);
                          }}
                          keyboardType="decimal-pad"
                          placeholder={unit === 'KG' ? 'kg' : 'lb'}
                          placeholderTextColor="#64748B"
                          style={{ flex: 1, height: 40, paddingHorizontal: 10, borderRadius: 8, backgroundColor: '#181B22', borderWidth: 1, borderColor: '#2A2F3A', color: '#F1F5F9', fontFamily: 'JetBrainsMono_700Bold', fontSize: 14 }}
                        />
                        <Text style={{ color: '#94A3B8' }}>×</Text>
                        <TextInput
                          value={d.reps}
                          onChangeText={(v) => {
                            const next = [...dropList];
                            next[i] = { ...next[i]!, reps: v.replace(/[^0-9]/g, '') };
                            setDropList(next);
                          }}
                          keyboardType="number-pad"
                          placeholder="reps"
                          placeholderTextColor="#64748B"
                          style={{ width: 60, height: 40, paddingHorizontal: 10, borderRadius: 8, backgroundColor: '#181B22', borderWidth: 1, borderColor: '#2A2F3A', color: '#F1F5F9', fontFamily: 'JetBrainsMono_700Bold', fontSize: 14, textAlign: 'center' }}
                        />
                        <Pressable
                          onPress={() => setDropList(dropList.filter((_, j) => j !== i))}
                          style={{ width: 32, height: 32, alignItems: 'center', justifyContent: 'center' }}
                          hitSlop={6}
                        >
                          <X color="#EF4444" size={16} />
                        </Pressable>
                      </View>
                    ))}
                  </ScrollView>
                  {dropList.length < 5 ? (
                    <Pressable
                      onPress={() => setDropList([...dropList, { weightKg: '', reps: '' }])}
                      style={{ padding: 12, borderRadius: 12, borderWidth: 2, borderStyle: 'dashed', borderColor: 'rgba(249,115,22,0.4)', alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 6 }}
                    >
                      <Plus color="#F97316" size={14} />
                      <Text style={{ color: '#F97316', fontWeight: '700', fontSize: 13 }}>Add drop</Text>
                    </Pressable>
                  ) : null}
                  <Button
                    label={setDrops.isPending ? 'Saving…' : 'Finish set'}
                    variant="primary-orange"
                    fullWidth
                    loading={setDrops.isPending}
                    onPress={async () => {
                      const validDrops = dropList
                        .map((d, i) => ({
                          dropIndex: i,
                          weightKg: unit === 'LB' ? parseFloat(d.weightKg || '0') / 2.20462 : parseFloat(d.weightKg || '0'),
                          reps: parseInt(d.reps || '0', 10),
                        }))
                        .filter((d) => d.weightKg > 0 && d.reps > 0);
                      if (validDrops.length === 0 || !dropTargetSetId) {
                        Alert.alert('Add at least one drop', 'Fill weight + reps for each drop row.');
                        return;
                      }
                      try {
                        await setDrops.mutateAsync({ setId: dropTargetSetId, drops: validDrops });
                        haptic.light();
                        setDropOpen(false);
                        setDropList([]);
                      } catch (e: any) {
                        Alert.alert('Save failed', e?.message ?? 'Unknown error');
                      }
                    }}
                  />
                </View>
              );
            })()}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function PadFor({ target, onChange }: { target: string; onChange: (v: string) => void }) {
  const push = (d: string) => {
    if (d === '.') {
      if (target.includes('.')) return;
      onChange(target === '' ? '0.' : target + '.');
      return;
    }
    onChange(target === '0' ? d : target + d);
  };
  const erase = () => onChange(target.length <= 1 ? '' : target.slice(0, -1));
  const inc = (delta: number) => {
    const cur = parseFloat(target || '0') + delta;
    onChange(String(Math.max(0, Math.round(cur * 100) / 100)));
  };
  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'del'];
  return (
    <View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
        {keys.map((k) => (
          <Pressable
            key={k}
            onPress={() => (k === 'del' ? erase() : push(k))}
            style={{ width: '32%', height: 48, borderRadius: 10, backgroundColor: '#181B22', alignItems: 'center', justifyContent: 'center' }}
          >
            <Text style={{ color: '#F1F5F9', fontFamily: 'JetBrainsMono_600SemiBold', fontSize: 20 }}>{k === 'del' ? '⌫' : k}</Text>
          </Pressable>
        ))}
      </View>
      <View style={{ flexDirection: 'row', gap: 6, marginTop: 6 }}>
        {[-2.5, 2.5, 5].map((n) => (
          <Pressable key={n} onPress={() => inc(n)} style={{ flex: 1, height: 40, borderRadius: 10, backgroundColor: 'rgba(20,184,166,0.15)', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: '#14B8A6', fontFamily: 'JetBrainsMono_600SemiBold', fontSize: 13 }}>{n > 0 ? `+${n}` : n}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
