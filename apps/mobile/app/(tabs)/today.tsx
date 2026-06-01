// Today — design.md § 8.1. Live data from /auth/me + active routine + today's meals + summary.

import { ScrollView, Text, View, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Svg, { Circle } from 'react-native-svg';
import { Camera, ChevronRight, Dumbbell, Flame, Play } from 'lucide-react-native';
import {
  Avatar,
  Button,
  Card,
  Chip,
  EmptyState,
  IconButton,
  LoadingShimmer,
  StatTile,
} from '../../src/components/ui';
import { useMe } from '../../src/api/auth';
import { useActiveRoutine, useRoutineToday } from '../../src/api/routines';
import { useMealsForDate } from '../../src/api/meals';
import { useAnalyticsSummary } from '../../src/api/analytics';
import { useWorkouts, useStartWorkout } from '../../src/api/workouts';
import { formatRelativeDay, formatVolume } from '../../src/lib/format';

const TODAY = new Date().toISOString().slice(0, 10);

function dayName(d = new Date()) {
  return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getDay()];
}

export default function Today() {
  const me = useMe();
  const activeRoutine = useActiveRoutine();
  const todayRes = useRoutineToday(activeRoutine.data?.id);
  const meals = useMealsForDate(TODAY);
  const summary = useAnalyticsSummary('7d');
  const recent = useWorkouts();
  const start = useStartWorkout();

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  })();

  const totals = (meals.data ?? []).reduce(
    (acc, m) => ({
      kcal: acc.kcal + m.kcal,
      proteinG: acc.proteinG + m.proteinG,
      carbsG: acc.carbsG + m.carbsG,
      fatG: acc.fatG + m.fatG,
    }),
    { kcal: 0, proteinG: 0, carbsG: 0, fatG: 0 },
  );

  const targets = me.data?.macroOverride ?? { kcal: 2400, proteinG: 180, carbsG: 280, fatG: 75 };

  const startToday = async () => {
    const r = activeRoutine.data;
    const t = todayRes.data;
    try {
      const w = await start.mutateAsync({ dayId: t?.day?.id, routineId: r?.id });
      router.push(`/workout/${w.id}/active`);
    } catch {}
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0F1115' }} edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 100, gap: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ flex: 1 }}>
            <Text style={{ color: '#94A3B8', fontSize: 12 }}>{greeting}</Text>
            <Text style={{ color: '#F1F5F9', fontSize: 22, fontWeight: '700', letterSpacing: -0.3 }}>
              {me.data?.name ?? '—'}
            </Text>
            {activeRoutine.data ? (
              <Text style={{ color: '#14B8A6', fontSize: 12, fontWeight: '700', marginTop: 2 }}>
                {activeRoutine.data.name} · {dayName()} ·{' '}
                {todayRes.data?.isRest ? 'Rest' : todayRes.data?.day?.name ?? '—'}
              </Text>
            ) : null}
          </View>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <IconButton icon={<Flame color="#F97316" size={20} />} accessibilityLabel="Streak" />
            <Avatar name={me.data?.name ?? '?'} size={40} />
          </View>
        </View>

        {activeRoutine.isLoading || todayRes.isLoading ? (
          <Card><LoadingShimmer height={120} radius={8} /></Card>
        ) : !activeRoutine.data ? (
          <Card accent="teal">
            <EmptyState
              icon={<Dumbbell color="#14B8A6" size={28} />}
              title="No active routine"
              subtitle="Pick one or create a new routine to plan your week."
              cta={
                <Button label="Browse routines" variant="primary-teal" onPress={() => router.push('/(tabs)/train')} />
              }
            />
          </Card>
        ) : todayRes.data?.isRest ? (
          <Card>
            <Text style={{ color: '#94A3B8', fontSize: 11, fontWeight: '700', letterSpacing: 0.08, textTransform: 'uppercase' }}>Today</Text>
            <Text style={{ color: '#F1F5F9', fontSize: 20, fontWeight: '700', marginTop: 4 }}>Rest day</Text>
            <Text style={{ color: '#94A3B8', fontSize: 13, marginTop: 4 }}>Recover well.</Text>
            <View style={{ height: 12 }} />
            <Button
              label="Start free workout"
              variant="secondary"
              fullWidth
              onPress={() =>
                start.mutateAsync({}).then((w) => router.push(`/workout/${w.id}/active`))
              }
            />
          </Card>
        ) : (
          <Card accent="teal">
            <Text style={{ color: '#94A3B8', fontSize: 11, fontWeight: '700', letterSpacing: 0.08, textTransform: 'uppercase' }}>Today's workout</Text>
            <Text style={{ color: '#F1F5F9', fontSize: 20, fontWeight: '700', marginTop: 4 }}>{todayRes.data?.day?.name}</Text>
            <Text style={{ color: '#94A3B8', fontFamily: 'JetBrainsMono_500Medium', fontSize: 12, marginTop: 2 }}>
              {todayRes.data?.day?.exercises?.length ?? 0} exercises
            </Text>
            <View style={{ flexDirection: 'row', gap: 6, marginTop: 12, flexWrap: 'wrap' }}>
              {(todayRes.data?.day?.exercises ?? []).slice(0, 3).map((e: any) => (
                <Chip key={e.id} label={e.exercise?.name ?? '—'} tone="teal" />
              ))}
              {(todayRes.data?.day?.exercises?.length ?? 0) > 3 ? (
                <Chip label={`+${(todayRes.data?.day?.exercises?.length ?? 0) - 3}`} tone="neutral" />
              ) : null}
            </View>
            <View style={{ height: 12 }} />
            <Button
              label="Start workout"
              variant="primary-teal"
              fullWidth
              loading={start.isPending}
              onPress={startToday}
              leadingIcon={<Play color="#042F2A" size={16} />}
            />
          </Card>
        )}

        <Card>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <Text style={{ color: '#94A3B8', fontSize: 11, fontWeight: '700', letterSpacing: 0.08, textTransform: 'uppercase' }}>Nutrition</Text>
            <Text style={{ color: '#94A3B8', fontFamily: 'JetBrainsMono_500Medium', fontSize: 11 }}>
              {Math.round(totals.kcal)} / {targets.kcal} kcal
            </Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
            {[
              { label: 'Protein', v: totals.proteinG, t: targets.proteinG, color: '#14B8A6' },
              { label: 'Carbs', v: totals.carbsG, t: targets.carbsG, color: '#F97316' },
              { label: 'Fat', v: totals.fatG, t: targets.fatG, color: '#A78BFA' },
              { label: 'kcal', v: totals.kcal, t: targets.kcal, color: '#F1F5F9' },
            ].map((m) => (
              <View key={m.label} style={{ alignItems: 'center', flex: 1 }}>
                <MiniRing pct={m.t ? (m.v / m.t) * 100 : 0} color={m.color} />
                <Text style={{ color: '#94A3B8', fontSize: 10, marginTop: 4 }}>{m.label}</Text>
                <Text style={{ color: '#F1F5F9', fontFamily: 'JetBrainsMono_600SemiBold', fontSize: 12, marginTop: 1 }}>
                  {Math.round(m.v)}<Text style={{ color: '#64748B', fontSize: 10 }}>/{m.t}</Text>
                </Text>
              </View>
            ))}
          </View>
          <Button
            label="Snap meal"
            variant="primary-orange"
            fullWidth
            leadingIcon={<Camera color="#3D1A04" size={16} />}
            onPress={() => router.push('/meal/camera')}
          />
        </Card>

        <View style={{ flexDirection: 'row', gap: 8 }}>
          <StatTile label="Streak" value={`${summary.data?.streak ?? 0} d`} />
          <StatTile label="Volume" value={formatVolume(summary.data?.volumeKg ?? 0, me.data?.unit ?? 'KG')} />
          <StatTile label="PRs · 7d" value={`${summary.data?.prs ?? 0}`} tone="teal" />
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
          <Text style={{ color: '#94A3B8', fontSize: 11, fontWeight: '700', letterSpacing: 0.08, textTransform: 'uppercase' }}>
            Recent workouts
          </Text>
          <Pressable onPress={() => router.push('/(tabs)/train/history')} hitSlop={8}>
            <Text style={{ color: '#14B8A6', fontSize: 12, fontWeight: '700' }}>See all</Text>
          </Pressable>
        </View>
        {recent.isLoading ? (
          <Card><LoadingShimmer height={80} radius={8} /></Card>
        ) : (recent.data ?? []).length === 0 ? (
          <Card>
            <EmptyState
              icon={<Dumbbell color="#94A3B8" size={28} />}
              title="No workouts yet"
              subtitle="Start your first session to see history here."
            />
          </Card>
        ) : (
          <Card padding={0}>
            {(recent.data ?? []).slice(0, 5).map((w, i, arr) => (
              <View key={w.id}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12 }}>
                  <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(20,184,166,0.15)', alignItems: 'center', justifyContent: 'center' }}>
                    <Dumbbell color="#14B8A6" size={18} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: '#F1F5F9', fontSize: 14, fontWeight: '700' }}>
                      {w.dayName ?? 'Free workout'}
                    </Text>
                    <Text style={{ color: '#94A3B8', fontFamily: 'JetBrainsMono_500Medium', fontSize: 11 }}>
                      {formatRelativeDay(w.startedAt)} · {Math.round((w.totalVolume ?? 0) / 1000 * 10) / 10} t · {w.prCount} PR
                    </Text>
                  </View>
                  <ChevronRight color="#64748B" size={16} />
                </View>
                {i < arr.length - 1 ? <View style={{ height: 1, backgroundColor: '#2A2F3A', marginLeft: 60 }} /> : null}
              </View>
            ))}
          </Card>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function MiniRing({ pct, color }: { pct: number; color: string }) {
  const size = 48;
  const r = 15;
  const stroke = 3;
  const circ = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(100, pct));
  const dash = `${(circ * clamped) / 100} ${circ}`;
  return (
    <Svg width={size} height={size} viewBox="0 0 36 36" style={{ transform: [{ rotate: '-90deg' }] }}>
      <Circle cx={18} cy={18} r={r} fill="none" stroke="rgba(148,163,184,0.18)" strokeWidth={stroke} />
      <Circle cx={18} cy={18} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeDasharray={dash} strokeLinecap="round" />
    </Svg>
  );
}
