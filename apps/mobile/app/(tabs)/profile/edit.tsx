// Profile editor — handles identity (name) + body (height, BF, goal) + preferences (unit, increment, macros).
// Each profile-page row deep-links here w/ a `focus` query param.

import { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Check, Minus, TrendingDown, TrendingUp, Zap } from 'lucide-react-native';
import { Button, Card, IconButton, Input, SegmentedControl } from '../../../src/components/ui';
import { useMe } from '../../../src/api/auth';
import { useUpdateUser } from '../../../src/api/users';
import { safeBack } from '../../../src/lib/safeBack';

type Goal = 'MUSCLE' | 'FAT' | 'MAINTAIN' | 'STRENGTH';

const GOALS: { value: Goal; title: string; subtitle: string; icon: React.ReactNode }[] = [
  { value: 'MUSCLE', title: 'Build muscle', subtitle: '+300 kcal · 2.0 g/kg protein', icon: <TrendingUp color="#14B8A6" size={20} /> },
  { value: 'FAT', title: 'Lose fat', subtitle: '−400 kcal · 2.2 g/kg protein', icon: <TrendingDown color="#94A3B8" size={20} /> },
  { value: 'MAINTAIN', title: 'Maintain', subtitle: 'TDEE · 1.6 g/kg protein', icon: <Minus color="#94A3B8" size={20} /> },
  { value: 'STRENGTH', title: 'Strength only', subtitle: 'No macro tracking', icon: <Zap color="#94A3B8" size={20} /> },
];

export default function ProfileEdit() {
  const { focus } = useLocalSearchParams<{ focus?: string }>();
  const me = useMe();
  const u = me.data;
  const update = useUpdateUser();

  const [name, setName] = useState('');
  const [heightCm, setHeightCm] = useState('');
  const [bodyFatPct, setBodyFatPct] = useState('');
  const [goal, setGoal] = useState<Goal>('MUSCLE');
  const [unit, setUnit] = useState<'KG' | 'LB'>('KG');
  const [increment, setIncrement] = useState('0.25');
  const [macroMode, setMacroMode] = useState<'AUTO' | 'CUSTOM'>('AUTO');
  const [mKcal, setMKcal] = useState('');
  const [mProtein, setMProtein] = useState('');
  const [mCarbs, setMCarbs] = useState('');
  const [mFat, setMFat] = useState('');

  useEffect(() => {
    if (!u) return;
    setName(u.name ?? '');
    setHeightCm(u.heightCm ? String(u.heightCm) : '');
    setBodyFatPct(u.bodyFatPct ? String(u.bodyFatPct) : '');
    setGoal((u.goal as Goal) ?? 'MUSCLE');
    setUnit((u.unit as 'KG' | 'LB') ?? 'KG');
    setIncrement(u.increment ? String(u.increment) : '0.25');
    if (u.macroOverride) {
      setMacroMode('CUSTOM');
      setMKcal(String((u.macroOverride as any).kcal ?? ''));
      setMProtein(String((u.macroOverride as any).proteinG ?? ''));
      setMCarbs(String((u.macroOverride as any).carbsG ?? ''));
      setMFat(String((u.macroOverride as any).fatG ?? ''));
    }
  }, [u]);

  const save = async () => {
    const dto: any = {
      name: name.trim() || undefined,
      heightCm: heightCm ? parseFloat(heightCm) : undefined,
      bodyFatPct: bodyFatPct ? parseFloat(bodyFatPct) : undefined,
      goal,
      unit,
      increment: parseFloat(increment) || 0.25,
    };
    if (macroMode === 'CUSTOM') {
      dto.macroOverride = {
        kcal: parseFloat(mKcal) || 0,
        proteinG: parseFloat(mProtein) || 0,
        carbsG: parseFloat(mCarbs) || 0,
        fatG: parseFloat(mFat) || 0,
      };
    } else {
      dto.macroOverride = null;
    }
    try {
      await update.mutateAsync(dto);
      safeBack('/(tabs)/profile');
    } catch (e: any) {
      Alert.alert('Save failed', e?.message ?? 'Unknown error');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0F1115' }} edges={['top']}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <IconButton icon={<ArrowLeft color="#F1F5F9" size={20} />} accessibilityLabel="Back" variant="ghost" onPress={() => safeBack('/(tabs)/profile')} />
          <Text style={{ color: '#F1F5F9', fontSize: 20, fontWeight: '700' }}>Edit profile</Text>
        </View>
        <Pressable onPress={save} hitSlop={8} disabled={update.isPending}>
          <Text style={{ color: '#14B8A6', fontSize: 14, fontWeight: '700' }}>{update.isPending ? 'Saving…' : 'Save'}</Text>
        </Pressable>
      </View>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 80, gap: 16 }}>
        <Section title="Identity">
          <Input label="Name" value={name} onChangeText={setName} autoCapitalize="words" />
        </Section>

        <Section title="Body">
          <View style={{ gap: 10 }}>
            <Input label="Height (cm)" value={heightCm} onChangeText={setHeightCm} keyboardType="decimal-pad" mono />
            <Input label="Body fat (%)" value={bodyFatPct} onChangeText={setBodyFatPct} keyboardType="decimal-pad" mono placeholder="Optional" />
          </View>
        </Section>

        <Section title="Goal" highlight={focus === 'goal'}>
          <View style={{ gap: 8 }}>
            {GOALS.map((g) => {
              const selected = goal === g.value;
              return (
                <Pressable
                  key={g.value}
                  onPress={() => setGoal(g.value)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 10,
                    padding: 12,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: selected ? '#14B8A6' : '#2A2F3A',
                    backgroundColor: selected ? 'rgba(20,184,166,0.08)' : '#181B22',
                  }}
                >
                  <View style={{ width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: selected ? 'rgba(20,184,166,0.18)' : '#21252E' }}>
                    {g.icon}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: '#F1F5F9', fontSize: 14, fontWeight: '700' }}>{g.title}</Text>
                    <Text style={{ color: '#94A3B8', fontSize: 11 }}>{g.subtitle}</Text>
                  </View>
                  {selected ? <Check color="#14B8A6" size={18} /> : null}
                </Pressable>
              );
            })}
          </View>
        </Section>

        <Section title="Preferences" highlight={focus === 'unit' || focus === 'increment'}>
          <View style={{ gap: 10 }}>
            <View>
              <Text style={{ color: '#94A3B8', fontSize: 10, fontWeight: '700', textTransform: 'uppercase', marginBottom: 6 }}>Unit</Text>
              <SegmentedControl
                options={[
                  { label: 'kg', value: 'KG' },
                  { label: 'lb', value: 'LB' },
                ]}
                value={unit}
                onChange={(v: 'KG' | 'LB') => {
                  setUnit(v);
                  if (v === 'KG' && parseFloat(increment) === 0.5) setIncrement('0.25');
                  if (v === 'LB' && parseFloat(increment) === 0.25) setIncrement('0.5');
                }}
              />
            </View>
            <Input
              label={`Increment (${unit === 'KG' ? 'kg' : 'lb'})`}
              value={increment}
              onChangeText={setIncrement}
              keyboardType="decimal-pad"
              mono
            />
          </View>
        </Section>

        <Section title="Macro targets" highlight={focus === 'macros'}>
          <SegmentedControl
            options={[
              { label: 'Auto', value: 'AUTO' },
              { label: 'Custom', value: 'CUSTOM' },
            ]}
            value={macroMode}
            onChange={setMacroMode}
          />
          {macroMode === 'CUSTOM' ? (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
              <View style={{ flexBasis: '47%', flexGrow: 1 }}>
                <Input label="kcal" value={mKcal} onChangeText={setMKcal} keyboardType="decimal-pad" mono />
              </View>
              <View style={{ flexBasis: '47%', flexGrow: 1 }}>
                <Input label="Protein (g)" value={mProtein} onChangeText={setMProtein} keyboardType="decimal-pad" mono />
              </View>
              <View style={{ flexBasis: '47%', flexGrow: 1 }}>
                <Input label="Carbs (g)" value={mCarbs} onChangeText={setMCarbs} keyboardType="decimal-pad" mono />
              </View>
              <View style={{ flexBasis: '47%', flexGrow: 1 }}>
                <Input label="Fat (g)" value={mFat} onChangeText={setMFat} keyboardType="decimal-pad" mono />
              </View>
            </View>
          ) : (
            <Text style={{ color: '#94A3B8', fontSize: 12, marginTop: 10, lineHeight: 18 }}>
              Auto-computed via Mifflin × 1.55 + your goal adjustment. Toggle Custom to override.
            </Text>
          )}
        </Section>

        <Button label="Save changes" variant="primary-teal" fullWidth onPress={save} loading={update.isPending} />
      </ScrollView>
    </SafeAreaView>
  );
}

function Section({ title, children, highlight }: { title: string; children: React.ReactNode; highlight?: boolean }) {
  return (
    <View>
      <Text style={{ color: highlight ? '#14B8A6' : '#94A3B8', fontSize: 11, fontWeight: '700', letterSpacing: 0.08, textTransform: 'uppercase', marginBottom: 8 }}>
        {title}
      </Text>
      <Card>{children}</Card>
    </View>
  );
}
