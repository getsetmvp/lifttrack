// Stats · Nutrition — design.md § 8 screen 34.

import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { Card, IconButton, EmptyState } from '../../../src/components/ui';
import { useNutritionAnalytics } from '../../../src/api/analytics';

export default function NutritionDetail() {
  const raw = useNutritionAnalytics('30d');
  const days = raw.data ?? [];
  const avg = (k: 'kcal' | 'proteinG' | 'carbsG' | 'fatG') =>
    days.length ? days.reduce((a: number, d: any) => a + (d[k] ?? 0), 0) / days.length : 0;
  const avgAdh = (k: 'adherenceProtein' | 'adherenceCarbs' | 'adherenceFat' | 'adherenceKcal') =>
    days.length ? days.reduce((a: number, d: any) => a + (d[k] ?? 0), 0) / days.length : 0;
  const n: any = {
    data: days.length
      ? {
          avgKcal: avg('kcal'),
          targetKcal: (days[days.length - 1] as any)?.targetKcal,
          avgProteinG: avg('proteinG'),
          avgCarbsG: avg('carbsG'),
          avgFatG: avg('fatG'),
          adherenceProtein: avgAdh('adherenceProtein'),
          adherenceCarbs: avgAdh('adherenceCarbs'),
          adherenceFat: avgAdh('adherenceFat'),
          adherenceKcal: avgAdh('adherenceKcal'),
        }
      : undefined,
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0F1115' }} edges={['top']}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 20, paddingVertical: 12 }}>
        <IconButton icon={<ArrowLeft color="#F1F5F9" size={20} />} accessibilityLabel="Back" variant="ghost" onPress={() => router.back()} />
        <Text style={{ color: '#F1F5F9', fontSize: 22, fontWeight: '700', letterSpacing: -0.3 }}>Nutrition</Text>
      </View>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 80, gap: 12 }}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          <Tile label="kcal avg" value={n.data?.avgKcal ? Math.round(n.data.avgKcal).toString() : '—'} sub={n.data?.targetKcal ? `target ${n.data.targetKcal}` : ''} />
          <Tile label="Protein avg" value={n.data?.avgProteinG ? `${Math.round(n.data.avgProteinG)}g` : '—'} sub="" tone="teal" />
          <Tile label="Carbs avg" value={n.data?.avgCarbsG ? `${Math.round(n.data.avgCarbsG)}g` : '—'} sub="" tone="orange" />
          <Tile label="Fat avg" value={n.data?.avgFatG ? `${Math.round(n.data.avgFatG)}g` : '—'} sub="" tone="purple" />
        </View>
        <Card>
          <Text style={{ color: '#94A3B8', fontSize: 11, fontWeight: '700', letterSpacing: 0.08, textTransform: 'uppercase', marginBottom: 8 }}>
            kcal by day · 14d
          </Text>
          <EmptyState title="Log meals to see trend" subtitle="kcal-by-day chart appears with logged meals." />
        </Card>
        <Text style={{ color: '#94A3B8', fontSize: 11, fontWeight: '700', letterSpacing: 0.08, textTransform: 'uppercase', marginTop: 4 }}>
          Adherence
        </Text>
        <Card>
          {[
            { label: 'Protein', pct: n.data?.adherenceProtein ?? 0 },
            { label: 'Carbs', pct: n.data?.adherenceCarbs ?? 0 },
            { label: 'Fat', pct: n.data?.adherenceFat ?? 0 },
            { label: 'kcal', pct: n.data?.adherenceKcal ?? 0 },
          ].map((row) => {
            const pct = Math.round(row.pct);
            const color = pct >= 85 ? '#10B981' : pct >= 70 ? '#F59E0B' : '#EF4444';
            return (
              <View key={row.label} style={{ marginBottom: 12 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                  <Text style={{ color: '#94A3B8', fontSize: 12 }}>{row.label}</Text>
                  <Text style={{ color, fontFamily: 'JetBrainsMono_700Bold', fontSize: 12 }}>{pct}%</Text>
                </View>
                <View style={{ height: 6, backgroundColor: '#2A2F3A', borderRadius: 3, overflow: 'hidden' }}>
                  <View style={{ height: '100%', width: `${Math.min(100, pct)}%`, backgroundColor: color }} />
                </View>
              </View>
            );
          })}
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

function Tile({ label, value, sub, tone }: { label: string; value: string; sub: string; tone?: 'teal' | 'orange' | 'purple' }) {
  const color = tone === 'teal' ? '#14B8A6' : tone === 'orange' ? '#F97316' : tone === 'purple' ? '#A78BFA' : '#F1F5F9';
  return (
    <View style={{ flexBasis: '48%', flexGrow: 1, padding: 12, borderRadius: 12, backgroundColor: '#181B22', borderWidth: 1, borderColor: '#2A2F3A' }}>
      <Text style={{ color: '#94A3B8', fontSize: 10, fontWeight: '700', textTransform: 'uppercase' }}>{label}</Text>
      <Text style={{ color, fontFamily: 'JetBrainsMono_700Bold', fontSize: 20, marginTop: 2 }}>{value}</Text>
      {sub ? <Text style={{ color: '#64748B', fontFamily: 'JetBrainsMono_500Medium', fontSize: 10, marginTop: 2 }}>{sub}</Text> : null}
    </View>
  );
}
