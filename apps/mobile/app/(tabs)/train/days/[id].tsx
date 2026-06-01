// Day detail — design.md § 8.3 (compact).

import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Dumbbell, MoreVertical, Pencil, Plus, Zap } from 'lucide-react-native';
import { Button, Card, IconButton, LoadingShimmer } from '../../../../src/components/ui';
import { useDay } from '../../../../src/api/days';
import { safeBack } from '../../../../src/lib/safeBack';

export default function DayDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const day = useDay(id);

  const warmups = (day.data?.exercises ?? []).filter((e) => e.isWarmup);
  const main = (day.data?.exercises ?? []).filter((e) => !e.isWarmup);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0F1115' }} edges={['top']}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 }}>
          <IconButton icon={<ArrowLeft color="#F1F5F9" size={20} />} accessibilityLabel="Back" variant="ghost" onPress={() => safeBack('/(tabs)/train')} />
          <Text style={{ color: '#F1F5F9', fontSize: 18, fontWeight: '700', flex: 1 }} numberOfLines={1}>
            {day.data?.name ?? '—'}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 4 }}>
          <IconButton icon={<Pencil color="#F1F5F9" size={16} />} accessibilityLabel="Edit" variant="ghost" size={36} />
          <IconButton icon={<MoreVertical color="#F1F5F9" size={16} />} accessibilityLabel="More" variant="ghost" size={36} />
        </View>
      </View>
      <Text style={{ color: '#94A3B8', fontFamily: 'JetBrainsMono_500Medium', fontSize: 11, paddingHorizontal: 20, marginBottom: 12 }}>
        Used in {day.data?.usedInWeeks ?? 0} weeks · {(day.data?.exercises ?? []).length} exercises
      </Text>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 80, gap: 16 }}>
        {day.isLoading ? <Card><LoadingShimmer height={100} /></Card> : null}
        {warmups.length > 0 ? (
          <View>
            <Text style={{ color: '#94A3B8', fontSize: 11, fontWeight: '700', letterSpacing: 0.08, textTransform: 'uppercase', marginBottom: 8 }}>Warm-ups</Text>
            <Card padding={0}>
              {warmups.map((e, i, arr) => (
                <View key={e.id}>
                  <ExerciseLine name={e.exercise?.name ?? '—'} target={`${e.targetSets} × ${e.targetRepsMin}-${e.targetRepsMax}`} warm />
                  {i < arr.length - 1 ? <View style={{ height: 1, backgroundColor: '#2A2F3A', marginLeft: 56 }} /> : null}
                </View>
              ))}
            </Card>
          </View>
        ) : null}
        {main.length > 0 ? (
          <View>
            <Text style={{ color: '#94A3B8', fontSize: 11, fontWeight: '700', letterSpacing: 0.08, textTransform: 'uppercase', marginBottom: 8 }}>Main lifts</Text>
            <Card padding={0}>
              {main.map((e, i, arr) => (
                <View key={e.id}>
                  <ExerciseLine
                    name={e.exercise?.name ?? '—'}
                    target={`${e.targetSets} × ${e.targetRepsMin}-${e.targetRepsMax} · ${e.restSeconds}s`}
                    drop={e.allowsDropset}
                  />
                  {i < arr.length - 1 ? <View style={{ height: 1, backgroundColor: '#2A2F3A', marginLeft: 56 }} /> : null}
                </View>
              ))}
            </Card>
          </View>
        ) : null}
        <Button
          label="Add exercise"
          variant="secondary"
          fullWidth
          leadingIcon={<Plus color="#F1F5F9" size={16} />}
          onPress={() => router.push(`/exercise-picker?dayId=${id}` as any)}
        />
        {day.data?.notes ? (
          <View>
            <Text style={{ color: '#94A3B8', fontSize: 11, fontWeight: '700', letterSpacing: 0.08, textTransform: 'uppercase', marginBottom: 8 }}>Notes</Text>
            <Card>
              <Text style={{ color: '#F1F5F9', fontSize: 13 }}>{day.data.notes}</Text>
            </Card>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

function ExerciseLine({ name, target, warm, drop }: { name: string; target: string; warm?: boolean; drop?: boolean }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', padding: 12, gap: 12 }}>
      <View style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: warm ? 'rgba(245,158,11,0.15)' : 'rgba(20,184,166,0.15)', alignItems: 'center', justifyContent: 'center' }}>
        {warm ? <Zap color="#F59E0B" size={14} /> : <Dumbbell color="#14B8A6" size={14} />}
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ color: '#F1F5F9', fontSize: 14, fontWeight: '700' }}>{name}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 2 }}>
          <Text style={{ color: '#94A3B8', fontFamily: 'JetBrainsMono_500Medium', fontSize: 11 }}>{target}</Text>
          {drop ? <Text style={{ color: '#F97316', fontSize: 9, fontWeight: '800', letterSpacing: 0.04 }}>DROP</Text> : null}
        </View>
      </View>
    </View>
  );
}
