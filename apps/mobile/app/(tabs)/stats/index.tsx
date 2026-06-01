// Stats landing — design.md § 8.14.

import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ChevronRight, Sparkles } from 'lucide-react-native';
import { Button, Card, LoadingShimmer, ProgressBar, RangePill } from '../../../src/components/ui';
import type { RangeValue } from '../../../src/components/ui';
import { useAnalyticsSummary, useNutritionAnalytics, useStrengthAll } from '../../../src/api/analytics';

export default function StatsLanding() {
  const [range, setRange] = useState<RangeValue>('30d');
  const summary = useAnalyticsSummary(range as any);
  const strengthAll = useStrengthAll(range as any);
  const nutrition = useNutritionAnalytics(range as any);

  const nutAvgAdherence = (nutrition.data ?? []).length
    ? Math.round(((nutrition.data ?? []).reduce((a, p) => a + (p.adherencePct ?? 0), 0) / (nutrition.data ?? []).length))
    : 0;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0F1115' }} edges={['top']}>
      <View style={{ paddingHorizontal: 20, paddingVertical: 12 }}>
        <Text style={{ color: '#F1F5F9', fontSize: 24, fontWeight: '700' }}>Stats</Text>
      </View>
      <View style={{ paddingHorizontal: 20, marginBottom: 12 }}>
        <RangePill value={range} onChange={setRange} />
      </View>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 120, gap: 16 }}>
        <Pressable onPress={() => router.push('/(tabs)/stats/strength' as any)}>
          <View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <Text style={{ color: '#94A3B8', fontSize: 11, fontWeight: '700', letterSpacing: 0.08, textTransform: 'uppercase' }}>Strength</Text>
              <ChevronRight color="#64748B" size={14} />
            </View>
            {strengthAll.isLoading ? <Card><LoadingShimmer height={60} /></Card> : (strengthAll.data ?? []).length === 0 ? (
              <Card><Text style={{ color: '#94A3B8', fontSize: 12, textAlign: 'center', padding: 12 }}>No strength data yet — log a workout.</Text></Card>
            ) : (
              <Card padding={0}>
                {(strengthAll.data ?? []).slice(0, 4).map((row, i, arr) => (
                  <View key={row.exerciseId}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', padding: 12, gap: 12 }}>
                      <View style={{ flex: 1 }}>
                        <Text style={{ color: '#F1F5F9', fontSize: 14, fontWeight: '700' }}>{row.name}</Text>
                        <Text style={{ color: '#94A3B8', fontFamily: 'JetBrainsMono_500Medium', fontSize: 11 }}>
                          e1RM {Math.round(row.e1rmLatest * 10) / 10} kg{' '}
                          <Text style={{ color: row.deltaPct > 0 ? '#10B981' : row.deltaPct < 0 ? '#EF4444' : '#94A3B8' }}>
                            {row.deltaPct > 0 ? '▲' : row.deltaPct < 0 ? '▼' : '▬'} {row.deltaPct.toFixed(1)}%
                          </Text>
                        </Text>
                      </View>
                    </View>
                    {i < Math.min(arr.length, 4) - 1 ? <View style={{ height: 1, backgroundColor: '#2A2F3A', marginLeft: 12 }} /> : null}
                  </View>
                ))}
              </Card>
            )}
          </View>
        </Pressable>

        <View>
          <Text style={{ color: '#94A3B8', fontSize: 11, fontWeight: '700', letterSpacing: 0.08, textTransform: 'uppercase', marginBottom: 8 }}>Volume · {range}</Text>
          <Card>
            <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 6 }}>
              <Text style={{ color: '#F1F5F9', fontFamily: 'JetBrainsMono_700Bold', fontSize: 24 }}>
                {Math.round((summary.data?.volumeKg ?? 0) / 1000 * 10) / 10}
              </Text>
              <Text style={{ color: '#94A3B8', fontSize: 13 }}>t total</Text>
            </View>
            <Text style={{ color: '#94A3B8', fontFamily: 'JetBrainsMono_500Medium', fontSize: 11, marginTop: 4 }}>
              {summary.data?.workouts ?? 0} workouts · {summary.data?.prs ?? 0} PRs
            </Text>
          </Card>
        </View>

        <View>
          <Text style={{ color: '#94A3B8', fontSize: 11, fontWeight: '700', letterSpacing: 0.08, textTransform: 'uppercase', marginBottom: 8 }}>Nutrition</Text>
          <Card>
            <View style={{ gap: 12 }}>
              <View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                  <Text style={{ color: '#94A3B8', fontSize: 12 }}>Avg adherence</Text>
                  <Text style={{ color: nutAvgAdherence >= 80 ? '#10B981' : '#F59E0B', fontFamily: 'JetBrainsMono_700Bold', fontSize: 12 }}>
                    {nutAvgAdherence}%
                  </Text>
                </View>
                <ProgressBar value={nutAvgAdherence} max={100} tone={nutAvgAdherence >= 80 ? 'success' : 'warn'} />
              </View>
              <Text style={{ color: '#94A3B8', fontFamily: 'JetBrainsMono_500Medium', fontSize: 11 }}>
                Protein avg {(summary.data?.proteinPerKgAvg ?? 0).toFixed(1)} g/kg · {Math.round(summary.data?.kcalAvg ?? 0)} kcal avg
              </Text>
            </View>
          </Card>
        </View>

        <Button
          label="Ask LiftFuel"
          variant="primary-teal"
          fullWidth
          leadingIcon={<Sparkles color="#042F2A" size={16} />}
          onPress={() => router.push('/(tabs)/stats/ask' as any)}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
