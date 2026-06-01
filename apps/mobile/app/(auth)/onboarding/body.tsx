// Onboarding step 3 — design.md § 8.18.

import { useState } from 'react';
import { Pressable, SafeAreaView, Text, View } from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, Info } from 'lucide-react-native';
import { Button, IconButton, Input } from '../../../src/components/ui';
import { useUpdateUser } from '../../../src/api/users';
import { useAddBodyMetric } from '../../../src/api/users';
import { Dots } from './unit';

export default function OnboardBody() {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bf, setBf] = useState('');
  const update = useUpdateUser();
  const addBm = useAddBodyMetric();

  const submit = async () => {
    const heightCm = height ? parseFloat(height) : undefined;
    const weightKg = weight ? parseFloat(weight) : undefined;
    const bodyFatPct = bf ? parseFloat(bf) : undefined;
    try {
      if (heightCm || bodyFatPct !== undefined) await update.mutateAsync({ heightCm, bodyFatPct });
      if (weightKg) {
        const today = new Date().toISOString().slice(0, 10);
        await addBm.mutateAsync({ date: today, weightKg, bodyFatPct });
      }
    } catch {}
    router.replace('/(tabs)/today');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0F1115' }} edges={['top', 'bottom']}>
      <View style={{ paddingHorizontal: 20, paddingTop: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <IconButton icon={<ArrowLeft color="#F1F5F9" size={20} />} accessibilityLabel="Back" variant="ghost" onPress={() => router.back()} />
        <Text style={{ color: '#94A3B8', fontSize: 11, fontWeight: '700', letterSpacing: 0.08, textTransform: 'uppercase' }}>Step 3 of 3</Text>
        <Pressable onPress={() => router.replace('/(tabs)/today')}><Text style={{ color: '#94A3B8', fontSize: 13, fontWeight: '700' }}>Skip</Text></Pressable>
      </View>
      <View style={{ paddingHorizontal: 24, paddingTop: 16, flex: 1 }}>
        <Text style={{ color: '#F1F5F9', fontSize: 24, fontWeight: '700', letterSpacing: -0.2 }}>Quick body stats</Text>
        <Text style={{ color: '#94A3B8', fontSize: 13, marginTop: 4, marginBottom: 24 }}>Optional. Used to compute calorie targets.</Text>
        <View style={{ gap: 16 }}>
          <Unit2 label="Height" value={height} onChange={setHeight} unit="cm" />
          <Unit2 label="Weight" value={weight} onChange={setWeight} unit="kg" />
          <Unit2 label="Body fat (optional)" value={bf} onChange={setBf} unit="%" placeholder="—" />
        </View>
        <View
          style={{
            flexDirection: 'row',
            gap: 8,
            marginTop: 20,
            padding: 12,
            borderRadius: 12,
            backgroundColor: '#21252E',
          }}
        >
          <Info color="#14B8A6" size={18} />
          <Text style={{ flex: 1, color: '#94A3B8', fontSize: 12, lineHeight: 18 }}>
            Targets auto-set via Mifflin × 1.55. Override in Profile anytime.
          </Text>
        </View>
      </View>
      <View style={{ padding: 24, paddingBottom: 32 }}>
        <Dots active={2} total={3} />
        <Button label="Start using LiftFuel" variant="primary-teal" fullWidth onPress={submit} loading={update.isPending || addBm.isPending} />
      </View>
    </SafeAreaView>
  );
}

function Unit2({ label, value, onChange, unit, placeholder }: { label: string; value: string; onChange: (v: string) => void; unit: string; placeholder?: string }) {
  return (
    <View>
      <Text style={{ color: '#94A3B8', fontSize: 11, fontWeight: '700', letterSpacing: 0.08, textTransform: 'uppercase', marginBottom: 6 }}>
        {label}
      </Text>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <View style={{ flex: 1 }}>
          <Input
            value={value}
            onChangeText={onChange}
            keyboardType="decimal-pad"
            mono
            placeholder={placeholder}
          />
        </View>
        <View
          style={{
            width: 60,
            height: 48,
            borderRadius: 12,
            backgroundColor: '#21252E',
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 1,
            borderColor: '#2A2F3A',
          }}
        >
          <Text style={{ color: '#F1F5F9', fontFamily: 'JetBrainsMono_600SemiBold', fontSize: 13 }}>{unit}</Text>
        </View>
      </View>
    </View>
  );
}
