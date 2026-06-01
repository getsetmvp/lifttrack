// Body metrics — design.md § 8 screen 39.

import { useState } from 'react';
import { Modal, Pressable, RefreshControl, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, Plus, X } from 'lucide-react-native';
import { Button, Card, IconButton, Input, LoadingShimmer } from '../../../src/components/ui';
import { useAddBodyMetric, useBodyMetrics } from '../../../src/api/users';
import { formatRelativeDay } from '../../../src/lib/format';
import { useRefresh } from '../../../src/lib/useRefresh';

export default function BodyMetrics() {
  const bm = useBodyMetrics();
  const add = useAddBodyMetric();
  const { refreshing, onRefresh } = useRefresh(bm);
  const [open, setOpen] = useState(false);
  const [weight, setWeight] = useState('');
  const [bf, setBf] = useState('');

  const latest = bm.data?.[0];
  const earliest = bm.data?.[bm.data.length - 1];
  const delta = latest?.weightKg && earliest?.weightKg && latest.id !== earliest.id
    ? (latest.weightKg - earliest.weightKg)
    : 0;

  const save = async () => {
    if (!weight) return;
    try {
      await add.mutateAsync({
        date: new Date().toISOString().slice(0, 10),
        weightKg: parseFloat(weight),
        bodyFatPct: bf ? parseFloat(bf) : undefined,
      });
      setWeight('');
      setBf('');
      setOpen(false);
    } catch {}
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0F1115' }} edges={['top']}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <IconButton icon={<ArrowLeft color="#F1F5F9" size={20} />} accessibilityLabel="Back" variant="ghost" onPress={() => router.back()} />
          <Text style={{ color: '#F1F5F9', fontSize: 22, fontWeight: '700' }}>Body metrics</Text>
        </View>
        <IconButton icon={<Plus color="#042F2A" size={20} />} accessibilityLabel="Add" variant="accent-teal" onPress={() => setOpen(true)} />
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 80, gap: 12 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#14B8A6" colors={['#14B8A6']} />}
      >
        <Card>
          {bm.isLoading ? (
            <LoadingShimmer height={80} />
          ) : (
            <View>
              <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 6 }}>
                <Text style={{ color: '#F1F5F9', fontFamily: 'JetBrainsMono_700Bold', fontSize: 32 }}>
                  {latest?.weightKg ?? '—'}
                </Text>
                <Text style={{ color: '#94A3B8', fontSize: 13 }}>kg current</Text>
                {delta !== 0 ? (
                  <Text style={{ marginLeft: 'auto', color: delta > 0 ? '#10B981' : '#EF4444', fontFamily: 'JetBrainsMono_700Bold', fontSize: 11 }}>
                    {delta > 0 ? '▲' : '▼'} {Math.abs(delta).toFixed(1)} kg
                  </Text>
                ) : null}
              </View>
            </View>
          )}
        </Card>

        <Text style={{ color: '#94A3B8', fontSize: 11, fontWeight: '700', letterSpacing: 0.08, textTransform: 'uppercase' }}>Entries</Text>
        {(bm.data ?? []).length === 0 ? (
          <Card>
            <Text style={{ color: '#94A3B8', fontSize: 13, textAlign: 'center', padding: 20 }}>
              No body metric entries yet. Tap + to log.
            </Text>
          </Card>
        ) : (
          <Card padding={0}>
            {(bm.data ?? []).map((m, i, arr) => (
              <View key={m.id}>
                <View style={{ flexDirection: 'row', alignItems: 'center', padding: 12 }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: '#F1F5F9', fontSize: 14, fontWeight: '700' }}>{new Date(m.date).toISOString().slice(0, 10)}</Text>
                    <Text style={{ color: '#94A3B8', fontFamily: 'JetBrainsMono_500Medium', fontSize: 11 }}>{formatRelativeDay(m.date)}</Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={{ color: '#F1F5F9', fontFamily: 'JetBrainsMono_700Bold', fontSize: 14 }}>
                      {m.weightKg ?? '—'} kg
                    </Text>
                    <Text style={{ color: '#94A3B8', fontSize: 10 }}>
                      {m.bodyFatPct ? `${m.bodyFatPct}% BF` : '— BF'}
                    </Text>
                  </View>
                </View>
                {i < arr.length - 1 ? <View style={{ height: 1, backgroundColor: '#2A2F3A', marginLeft: 12 }} /> : null}
              </View>
            ))}
          </Card>
        )}
      </ScrollView>

      <Modal visible={open} transparent animationType="slide" onRequestClose={() => setOpen(false)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' }}>
          <View style={{ backgroundColor: '#21252E', borderTopLeftRadius: 22, borderTopRightRadius: 22, padding: 20, gap: 12 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text style={{ color: '#F1F5F9', fontSize: 18, fontWeight: '700' }}>New entry</Text>
              <Pressable onPress={() => setOpen(false)}>
                <X color="#94A3B8" size={20} />
              </Pressable>
            </View>
            <Input label="Weight (kg)" value={weight} onChangeText={setWeight} keyboardType="decimal-pad" mono />
            <Input label="Body fat % (optional)" value={bf} onChangeText={setBf} keyboardType="decimal-pad" mono />
            <Button label="Save" variant="primary-teal" fullWidth onPress={save} loading={add.isPending} disabled={!weight} />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
