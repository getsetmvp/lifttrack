// Onboarding step 2 — design.md § 8.18.

import { useState } from 'react';
import { Pressable, SafeAreaView, Text, View } from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, CheckCircle2, Minus, TrendingDown, TrendingUp, Zap } from 'lucide-react-native';
import { Button, IconButton } from '../../../src/components/ui';
import { useUpdateUser } from '../../../src/api/users';
import { Dots } from './unit';

type Goal = 'MUSCLE' | 'FAT' | 'MAINTAIN' | 'STRENGTH';

const GOALS: { value: Goal; title: string; subtitle: string; icon: React.ReactNode }[] = [
  { value: 'MUSCLE', title: 'Build muscle', subtitle: '+300 kcal · 2.0 g/kg protein', icon: <TrendingUp color="#14B8A6" size={20} /> },
  { value: 'FAT', title: 'Lose fat', subtitle: '−400 kcal · 2.2 g/kg protein', icon: <TrendingDown color="#94A3B8" size={20} /> },
  { value: 'MAINTAIN', title: 'Maintain', subtitle: 'TDEE · 1.6 g/kg protein', icon: <Minus color="#94A3B8" size={20} /> },
  { value: 'STRENGTH', title: 'Strength only', subtitle: 'No macro tracking', icon: <Zap color="#94A3B8" size={20} /> },
];

export default function OnboardGoal() {
  const [goal, setGoal] = useState<Goal>('MUSCLE');
  const update = useUpdateUser();

  const next = async () => {
    try {
      await update.mutateAsync({ goal });
    } catch {}
    router.push('/(auth)/onboarding/body');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0F1115' }} edges={['top', 'bottom']}>
      <View style={{ paddingHorizontal: 20, paddingTop: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <IconButton icon={<ArrowLeft color="#F1F5F9" size={20} />} accessibilityLabel="Back" variant="ghost" onPress={() => router.back()} />
        <Text style={{ color: '#94A3B8', fontSize: 11, fontWeight: '700', letterSpacing: 0.08, textTransform: 'uppercase' }}>Step 2 of 3</Text>
        <Pressable onPress={next}><Text style={{ color: '#94A3B8', fontSize: 13, fontWeight: '700' }}>Skip</Text></Pressable>
      </View>
      <View style={{ paddingHorizontal: 24, paddingTop: 16, flex: 1 }}>
        <Text style={{ color: '#F1F5F9', fontSize: 24, fontWeight: '700', letterSpacing: -0.2 }}>What's your goal?</Text>
        <Text style={{ color: '#94A3B8', fontSize: 13, marginTop: 4, marginBottom: 24 }}>Drives macro targets + suggestions.</Text>
        <View style={{ gap: 10 }}>
          {GOALS.map((g) => {
            const selected = goal === g.value;
            return (
              <Pressable
                key={g.value}
                onPress={() => setGoal(g.value)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 12,
                  padding: 16,
                  borderRadius: 14,
                  backgroundColor: selected ? 'rgba(20,184,166,0.08)' : '#181B22',
                  borderWidth: 1,
                  borderColor: selected ? '#14B8A6' : '#2A2F3A',
                }}
              >
                <View
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    backgroundColor: selected ? 'rgba(20,184,166,0.18)' : '#21252E',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {g.icon}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: '#F1F5F9', fontSize: 15, fontWeight: '700' }}>{g.title}</Text>
                  <Text style={{ color: '#94A3B8', fontSize: 12 }}>{g.subtitle}</Text>
                </View>
                {selected ? <CheckCircle2 color="#14B8A6" size={22} /> : null}
              </Pressable>
            );
          })}
        </View>
      </View>
      <View style={{ padding: 24, paddingBottom: 32 }}>
        <Dots active={1} total={3} />
        <Button label="Continue" variant="primary-teal" fullWidth onPress={next} loading={update.isPending} />
      </View>
    </SafeAreaView>
  );
}
