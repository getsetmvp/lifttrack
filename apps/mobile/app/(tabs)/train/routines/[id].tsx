// Routine detail — design.md § 8.5 (compact).

import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, GripVertical, MoreVertical, Pencil } from 'lucide-react-native';
import { Button, Card, Chip, IconButton, LoadingShimmer, SegmentedControl } from '../../../../src/components/ui';
import { useActivateRoutine, useDeleteRoutine, useRoutine } from '../../../../src/api/routines';
import { useState } from 'react';

export default function RoutineDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const r = useRoutine(id);
  const activate = useActivateRoutine();
  const del = useDeleteRoutine();
  const [cycleMode, setCycleMode] = useState<'LOOP' | 'SEQUENCE' | 'WEEKLY_PICK'>(
    (r.data?.cycleMode as any) ?? 'LOOP',
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0F1115' }} edges={['top']}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 }}>
          <IconButton icon={<ArrowLeft color="#F1F5F9" size={20} />} accessibilityLabel="Back" variant="ghost" onPress={() => router.back()} />
          <Text style={{ color: '#F1F5F9', fontSize: 18, fontWeight: '700', flex: 1 }} numberOfLines={1}>{r.data?.name ?? '—'}</Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 4 }}>
          <IconButton icon={<Pencil color="#F1F5F9" size={16} />} accessibilityLabel="Edit" variant="ghost" size={36} />
          <IconButton icon={<MoreVertical color="#F1F5F9" size={16} />} accessibilityLabel="More" variant="ghost" size={36} />
        </View>
      </View>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 80, gap: 16 }}>
        {r.isLoading ? <Card><LoadingShimmer height={100} /></Card> : (
          <>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {r.data?.isActive ? <Chip label="Active" tone="teal" /> : null}
              <Text style={{ color: '#94A3B8', fontFamily: 'JetBrainsMono_500Medium', fontSize: 11 }}>
                started {r.data?.startDate?.slice(0, 10)}
              </Text>
            </View>
            <View>
              <Text style={{ color: '#94A3B8', fontSize: 11, fontWeight: '700', letterSpacing: 0.08, textTransform: 'uppercase', marginBottom: 8 }}>Cycle mode</Text>
              <SegmentedControl
                options={[
                  { label: 'Loop', value: 'LOOP' },
                  { label: 'Seq', value: 'SEQUENCE' },
                  { label: 'Manual', value: 'WEEKLY_PICK' },
                ]}
                value={cycleMode}
                onChange={setCycleMode}
              />
            </View>
            <View>
              <Text style={{ color: '#94A3B8', fontSize: 11, fontWeight: '700', letterSpacing: 0.08, textTransform: 'uppercase', marginBottom: 8 }}>Weeks ({(r.data?.weekRefs ?? []).length})</Text>
              <Card padding={0}>
                {(r.data?.weekRefs ?? []).map((wr, i, arr) => (
                  <View key={wr.id}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', padding: 12, gap: 12 }}>
                      <GripVertical color="#64748B" size={16} />
                      <View style={{ width: 28, height: 28, borderRadius: 6, backgroundColor: 'rgba(20,184,166,0.18)', alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ color: '#14B8A6', fontFamily: 'JetBrainsMono_700Bold', fontSize: 12 }}>{wr.position + 1}</Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={{ color: '#F1F5F9', fontSize: 14, fontWeight: '700' }}>{wr.week?.name ?? '—'}</Text>
                      </View>
                    </View>
                    {i < arr.length - 1 ? <View style={{ height: 1, backgroundColor: '#2A2F3A', marginLeft: 56 }} /> : null}
                  </View>
                ))}
              </Card>
            </View>
            {!r.data?.isActive ? (
              <Button
                label="Make active"
                variant="primary-teal"
                fullWidth
                onPress={() => activate.mutateAsync(id!)}
                loading={activate.isPending}
              />
            ) : null}
            <Button
              label="Delete routine"
              variant="danger"
              fullWidth
              onPress={() => del.mutateAsync(id!).then(() => router.back())}
              loading={del.isPending}
            />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
