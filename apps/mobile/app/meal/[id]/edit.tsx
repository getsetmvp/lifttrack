// Meal edit item — design.md § 8 screen 30.

import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Info, X } from 'lucide-react-native';
import { IconButton, Input } from '../../../src/components/ui';
import { useMeal, useUpdateMeal } from '../../../src/api/meals';

export default function MealEdit() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const meal = useMeal(id);
  const update = useUpdateMeal();
  const m = meal.data;
  const [kcal, setKcal] = useState(String(m?.kcal ?? ''));
  const [protein, setProtein] = useState(String(m?.proteinG ?? ''));
  const [carbs, setCarbs] = useState(String(m?.carbsG ?? ''));
  const [fat, setFat] = useState(String(m?.fatG ?? ''));

  const save = async () => {
    await update.mutateAsync({
      id: id!,
      kcal: parseFloat(kcal) || 0,
      proteinG: parseFloat(protein) || 0,
      carbsG: parseFloat(carbs) || 0,
      fatG: parseFloat(fat) || 0,
    });
    router.back();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0F1115' }} edges={['top', 'bottom']}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 12 }}>
        <IconButton icon={<X color="#F1F5F9" size={20} />} accessibilityLabel="Cancel" variant="ghost" onPress={() => router.back()} />
        <Text style={{ color: '#F1F5F9', fontSize: 16, fontWeight: '700' }}>Edit macros</Text>
        <Pressable onPress={save}>
          <Text style={{ color: '#14B8A6', fontSize: 14, fontWeight: '700' }}>Save</Text>
        </Pressable>
      </View>
      <ScrollView contentContainerStyle={{ padding: 20, gap: 16, paddingBottom: 80 }}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
          <View style={{ flexBasis: '47%', flexGrow: 1 }}>
            <Input label="Protein" value={protein} onChangeText={setProtein} keyboardType="decimal-pad" mono trailingIcon={<Unit unit="g" />} />
          </View>
          <View style={{ flexBasis: '47%', flexGrow: 1 }}>
            <Input label="Carbs" value={carbs} onChangeText={setCarbs} keyboardType="decimal-pad" mono trailingIcon={<Unit unit="g" />} />
          </View>
          <View style={{ flexBasis: '47%', flexGrow: 1 }}>
            <Input label="Fat" value={fat} onChangeText={setFat} keyboardType="decimal-pad" mono trailingIcon={<Unit unit="g" />} />
          </View>
          <View style={{ flexBasis: '47%', flexGrow: 1 }}>
            <Input label="kcal" value={kcal} onChangeText={setKcal} keyboardType="decimal-pad" mono trailingIcon={<Unit unit="kcal" />} />
          </View>
        </View>
        <View style={{ flexDirection: 'row', gap: 8, padding: 12, borderRadius: 12, backgroundColor: '#21252E' }}>
          <Info color="#14B8A6" size={18} />
          <Text style={{ flex: 1, color: '#94A3B8', fontSize: 12, lineHeight: 18 }}>
            Editing macros marks the meal as EDITED. Original AI estimate kept for accuracy tracking.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Unit({ unit }: { unit: string }) {
  return (
    <Text style={{ color: '#F1F5F9', fontFamily: 'JetBrainsMono_600SemiBold', fontSize: 11 }}>{unit}</Text>
  );
}
