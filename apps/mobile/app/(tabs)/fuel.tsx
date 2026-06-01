// Fuel day view — design.md § 8.11.

import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Camera, ChevronLeft, ChevronRight, Loader, PlusCircle } from 'lucide-react-native';
import { Card, IconButton, LoadingShimmer, MacroRing } from '../../src/components/ui';
import { useMealsForDate } from '../../src/api/meals';
import { useMe } from '../../src/api/auth';

const SLOTS: { value: string; emoji: string; label: string }[] = [
  { value: 'BREAKFAST', emoji: '🌅', label: 'Breakfast' },
  { value: 'PRE_LUNCH', emoji: '☕', label: 'Pre-Lunch' },
  { value: 'LUNCH', emoji: '🥗', label: 'Lunch' },
  { value: 'SNACK', emoji: '🍎', label: 'Snack' },
  { value: 'PRE_WORKOUT', emoji: '💪', label: 'Pre-Workout' },
  { value: 'POST_WORKOUT', emoji: '🥤', label: 'Post-Workout' },
  { value: 'DINNER', emoji: '🍽', label: 'Dinner' },
];

export default function Fuel() {
  const [date, setDate] = useState(new Date());
  const dateStr = date.toISOString().slice(0, 10);
  const meals = useMealsForDate(dateStr);
  const me = useMe();
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

  const move = (delta: number) => {
    const d = new Date(date);
    d.setDate(d.getDate() + delta);
    setDate(d);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0F1115' }} edges={['top']}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 12 }}>
        <View>
          <Text style={{ color: '#F1F5F9', fontSize: 24, fontWeight: '700' }}>Fuel</Text>
          <Text style={{ color: '#94A3B8', fontFamily: 'JetBrainsMono_500Medium', fontSize: 11 }}>
            {date.toLocaleDateString('en', { weekday: 'short', month: 'short', day: 'numeric' })}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 4 }}>
          <IconButton icon={<ChevronLeft color="#F1F5F9" size={18} />} accessibilityLabel="Prev day" onPress={() => move(-1)} />
          <IconButton icon={<ChevronRight color="#F1F5F9" size={18} />} accessibilityLabel="Next day" onPress={() => move(1)} />
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, gap: 12, paddingBottom: 120 }}>
        <Card>
          <View style={{ alignItems: 'center', marginBottom: 8 }}>
            <MacroRing
              protein={totals.proteinG}
              carbs={totals.carbsG}
              fat={totals.fatG}
              kcal={totals.kcal}
              targets={{ protein: targets.proteinG, carbs: targets.carbsG, fat: targets.fatG, kcal: targets.kcal }}
              size={80}
            />
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
            {[
              { l: 'Protein', v: totals.proteinG, t: targets.proteinG },
              { l: 'Carbs', v: totals.carbsG, t: targets.carbsG },
              { l: 'Fat', v: totals.fatG, t: targets.fatG },
              { l: 'kcal', v: totals.kcal, t: targets.kcal },
            ].map((m) => (
              <View key={m.l} style={{ alignItems: 'center' }}>
                <Text style={{ color: '#94A3B8', fontSize: 10 }}>{m.l}</Text>
                <Text style={{ color: '#F1F5F9', fontFamily: 'JetBrainsMono_600SemiBold', fontSize: 12 }}>
                  {Math.round(m.v)}<Text style={{ color: '#64748B' }}>/{m.t}</Text>
                </Text>
              </View>
            ))}
          </View>
        </Card>

        <Text style={{ color: '#94A3B8', fontSize: 11, fontWeight: '700', letterSpacing: 0.08, textTransform: 'uppercase' }}>Meal slots</Text>
        {meals.isLoading ? (
          <Card><LoadingShimmer height={200} /></Card>
        ) : (
          <Card padding={0}>
            {SLOTS.map((s, i) => {
              const meal = (meals.data ?? []).find((m) => m.slot === s.value);
              return (
                <View key={s.value}>
                  <Pressable
                    onPress={() => (meal ? router.push(`/meal/${meal.id}`) : router.push(`/meal/camera?slot=${s.value}`))}
                    style={{ flexDirection: 'row', alignItems: 'center', padding: 12, gap: 12 }}
                  >
                    <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: meal ? 'rgba(249,115,22,0.15)' : '#21252E', alignItems: 'center', justifyContent: 'center', opacity: meal ? 1 : 0.5 }}>
                      <Text style={{ fontSize: 16 }}>{s.emoji}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ color: meal ? '#F1F5F9' : '#94A3B8', fontSize: 14, fontWeight: '700' }}>{s.label}</Text>
                      {meal ? (
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 }}>
                          <Text style={{ color: '#94A3B8', fontFamily: 'JetBrainsMono_500Medium', fontSize: 10 }}>
                            {new Date(meal.createdAt).toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' })}
                          </Text>
                          {meal.status === 'ANALYZING' || meal.status === 'PENDING' ? (
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 6, paddingVertical: 1, borderRadius: 999, backgroundColor: 'rgba(245,158,11,0.18)' }}>
                              <Loader color="#F59E0B" size={10} />
                              <Text style={{ color: '#F59E0B', fontSize: 9, fontWeight: '800' }}>ANALYZING</Text>
                            </View>
                          ) : null}
                          {meal.status === 'FAILED' ? (
                            <Text style={{ color: '#EF4444', fontSize: 10, fontWeight: '700' }}>FAILED</Text>
                          ) : null}
                        </View>
                      ) : null}
                    </View>
                    {meal ? (
                      <View style={{ alignItems: 'flex-end' }}>
                        <Text style={{ color: '#F1F5F9', fontFamily: 'JetBrainsMono_700Bold', fontSize: 13 }}>{Math.round(meal.kcal)}</Text>
                        <Text style={{ color: '#94A3B8', fontSize: 9 }}>kcal</Text>
                      </View>
                    ) : (
                      <PlusCircle color="#64748B" size={18} />
                    )}
                  </Pressable>
                  {i < SLOTS.length - 1 ? <View style={{ height: 1, backgroundColor: '#2A2F3A', marginLeft: 60 }} /> : null}
                </View>
              );
            })}
          </Card>
        )}
      </ScrollView>

      <Pressable
        onPress={() => router.push('/meal/camera')}
        style={{
          position: 'absolute',
          right: 20,
          bottom: 100,
          width: 56,
          height: 56,
          borderRadius: 28,
          backgroundColor: '#F97316',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Camera color="#3D1A04" size={24} />
      </Pressable>
    </SafeAreaView>
  );
}
