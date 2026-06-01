// Meal detail — design.md § 8 screen 29. Photo + totals + items + notes.

import { useState, useEffect } from 'react';
import { Pressable, ScrollView, Text, TextInput, View, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, MoreVertical, Pencil, Plus, Sparkles } from 'lucide-react-native';
import { Button, Card, IconButton, LoadingShimmer, EmptyState } from '../../../src/components/ui';
import { useMeal, useUpdateMeal, useDeleteMealItem } from '../../../src/api/meals';
import { safeBack } from '../../../src/lib/safeBack';

export default function MealDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const meal = useMeal(id);
  const update = useUpdateMeal();
  const deleteItem = useDeleteMealItem();
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (meal.data?.notes) setNotes(meal.data.notes);
  }, [meal.data?.notes]);

  const m = meal.data;
  const items = m?.items ?? [];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0F1115' }} edges={['top', 'bottom']}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 }}>
          <IconButton icon={<ArrowLeft color="#F1F5F9" size={20} />} accessibilityLabel="Back" variant="ghost" onPress={() => safeBack('/(tabs)/fuel')} />
          <View style={{ flex: 1 }}>
            <Text style={{ color: '#F1F5F9', fontSize: 16, fontWeight: '700' }}>{m?.slot ?? '—'}</Text>
            <Text style={{ color: '#94A3B8', fontFamily: 'JetBrainsMono_500Medium', fontSize: 10 }}>
              {m?.date?.slice(0, 10) ?? ''}
            </Text>
          </View>
        </View>
        <IconButton icon={<Pencil color="#F1F5F9" size={16} />} accessibilityLabel="Edit" variant="ghost" size={36} onPress={() => router.push(`/meal/${id}/edit` as any)} />
        <IconButton icon={<MoreVertical color="#F1F5F9" size={16} />} accessibilityLabel="More" variant="ghost" size={36} />
      </View>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100, gap: 12 }}>
        {meal.isLoading ? <Card><LoadingShimmer height={120} /></Card> : null}
        {m?.photoUrl ? (
          <View style={{ height: 140, borderRadius: 14, overflow: 'hidden', position: 'relative' }}>
            <Image source={{ uri: m.photoUrl }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
            {m.aiConfidence ? (
              <View style={{ position: 'absolute', top: 8, right: 8, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999, backgroundColor: 'rgba(0,0,0,0.5)', flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Sparkles color="#F1F5F9" size={12} />
                <Text style={{ color: '#F1F5F9', fontFamily: 'JetBrainsMono_700Bold', fontSize: 11 }}>AI · {m.aiConfidence.toFixed(2)}</Text>
              </View>
            ) : null}
          </View>
        ) : null}
        <Card>
          <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
            {[
              { label: 'P', value: m?.proteinG ?? 0, color: '#14B8A6' },
              { label: 'C', value: m?.carbsG ?? 0, color: '#F97316' },
              { label: 'F', value: m?.fatG ?? 0, color: '#A78BFA' },
              { label: 'kcal', value: m?.kcal ?? 0, color: '#F1F5F9' },
            ].map((row) => (
              <View key={row.label} style={{ alignItems: 'center' }}>
                <Text style={{ color: '#94A3B8', fontSize: 9, fontWeight: '700', textTransform: 'uppercase' }}>{row.label}</Text>
                <Text style={{ color: row.color, fontFamily: 'JetBrainsMono_700Bold', fontSize: 18, marginTop: 2 }}>
                  {Math.round(row.value)}
                  {row.label !== 'kcal' ? <Text style={{ fontSize: 11 }}>g</Text> : null}
                </Text>
              </View>
            ))}
          </View>
        </Card>
        <Text style={{ color: '#94A3B8', fontSize: 11, fontWeight: '700', letterSpacing: 0.08, textTransform: 'uppercase' }}>
          Items ({items.length})
        </Text>
        {items.length === 0 ? (
          <Card>
            <EmptyState title="No items" subtitle="Add items to track macros." />
          </Card>
        ) : (
          <Card padding={0}>
            {items.map((it: any, i: number) => (
              <View key={it.id}>
                <Pressable
                  onLongPress={() => deleteItem.mutate({ mealId: id!, itemId: it.id })}
                  style={{ padding: 12 }}
                >
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 }}>
                    <Text style={{ color: '#F1F5F9', fontSize: 14, fontWeight: '600', flex: 1 }} numberOfLines={1}>
                      {it.name ?? '—'}
                    </Text>
                    <Text style={{ color: '#F1F5F9', fontFamily: 'JetBrainsMono_700Bold', fontSize: 13 }}>
                      {it.grams ?? '—'}g
                    </Text>
                  </View>
                  <Text style={{ color: '#94A3B8', fontFamily: 'JetBrainsMono_500Medium', fontSize: 10 }}>
                    {Math.round(it.proteinG ?? 0)} P · {Math.round(it.carbsG ?? 0)} C · {Math.round(it.fatG ?? 0)} F · {Math.round(it.kcal ?? 0)} kcal
                  </Text>
                </Pressable>
                {i < items.length - 1 ? <View style={{ height: 1, backgroundColor: '#2A2F3A' }} /> : null}
              </View>
            ))}
          </Card>
        )}
        <Button label="Add item" variant="secondary" fullWidth leadingIcon={<Plus color="#F1F5F9" size={16} />} onPress={() => {}} />
        <View>
          <Text style={{ color: '#94A3B8', fontSize: 11, fontWeight: '700', letterSpacing: 0.08, textTransform: 'uppercase', marginBottom: 6 }}>
            Notes
          </Text>
          <TextInput
            value={notes}
            onChangeText={setNotes}
            onEndEditing={() => update.mutate({ id: id!, notes })}
            placeholder="Optional…"
            placeholderTextColor="#64748B"
            multiline
            style={{ minHeight: 60, padding: 12, borderRadius: 12, backgroundColor: '#181B22', borderWidth: 1, borderColor: '#2A2F3A', color: '#F1F5F9', fontSize: 14, textAlignVertical: 'top' }}
          />
        </View>
      </ScrollView>
      <View style={{ padding: 20, paddingBottom: 24 }}>
        <Button label="Confirm" variant="primary-orange" fullWidth onPress={() => safeBack('/(tabs)/fuel')} />
      </View>
    </SafeAreaView>
  );
}
