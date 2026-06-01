// Onboarding step 1 — design.md § 8.18.

import { Pressable, SafeAreaView, Text, View } from 'react-native';
import { router } from 'expo-router';
import { CheckCircle2 } from 'lucide-react-native';
import { Button } from '../../../src/components/ui';
import { useUpdateUser } from '../../../src/api/users';
import { useUnitStore } from '../../../src/store/useUnitStore';
import { useState } from 'react';

export default function OnboardUnit() {
  const [unit, setUnit] = useState<'KG' | 'LB'>('KG');
  const updateUser = useUpdateUser();
  const setUnitStore = useUnitStore((s) => s.setUnit);

  const next = async () => {
    setUnitStore(unit);
    try {
      await updateUser.mutateAsync({ unit, increment: unit === 'KG' ? 0.25 : 0.5 });
    } catch {}
    router.push('/(auth)/onboarding/goal');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0F1115' }} edges={['top', 'bottom']}>
      <View style={{ paddingHorizontal: 24, paddingTop: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ color: '#94A3B8', fontSize: 11, fontWeight: '700', letterSpacing: 0.08, textTransform: 'uppercase' }}>Step 1 of 3</Text>
        <Pressable onPress={next}>
          <Text style={{ color: '#94A3B8', fontSize: 13, fontWeight: '700' }}>Skip</Text>
        </Pressable>
      </View>
      <View style={{ paddingHorizontal: 24, paddingTop: 24, flex: 1 }}>
        <Text style={{ color: '#F1F5F9', fontSize: 24, fontWeight: '700', letterSpacing: -0.2 }}>How do you measure?</Text>
        <Text style={{ color: '#94A3B8', fontSize: 13, marginTop: 4, marginBottom: 24 }}>Used on every weight + body stat.</Text>
        <View style={{ gap: 12 }}>
          <UnitTile selected={unit === 'KG'} onPress={() => setUnit('KG')} short="kg" title="Kilograms" subtitle="Metric · 0.25 kg increment" />
          <UnitTile selected={unit === 'LB'} onPress={() => setUnit('LB')} short="lb" title="Pounds" subtitle="Imperial · 0.5 lb increment" />
        </View>
      </View>
      <View style={{ padding: 24, paddingBottom: 32 }}>
        <Dots active={0} total={3} />
        <Button label="Continue" variant="primary-teal" fullWidth onPress={next} loading={updateUser.isPending} />
      </View>
    </SafeAreaView>
  );
}

function UnitTile({ selected, onPress, short, title, subtitle }: { selected: boolean; onPress: () => void; short: string; title: string; subtitle: string }) {
  return (
    <Pressable
      onPress={onPress}
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
          width: 48,
          height: 48,
          borderRadius: 12,
          backgroundColor: selected ? '#14B8A6' : '#21252E',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text style={{ color: selected ? '#042F2A' : '#F1F5F9', fontFamily: 'JetBrainsMono_700Bold', fontSize: 18 }}>{short}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ color: '#F1F5F9', fontSize: 15, fontWeight: '700' }}>{title}</Text>
        <Text style={{ color: '#94A3B8', fontSize: 12 }}>{subtitle}</Text>
      </View>
      {selected ? <CheckCircle2 color="#14B8A6" size={22} /> : null}
    </Pressable>
  );
}

export function Dots({ active, total }: { active: number; total: number }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 6, marginBottom: 20 }}>
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          style={{
            width: i === active ? 24 : 6,
            height: 6,
            borderRadius: 3,
            backgroundColor: i === active ? '#14B8A6' : '#2A2F3A',
          }}
        />
      ))}
    </View>
  );
}
