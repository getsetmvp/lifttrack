import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { CreateMealItemDto, Meal, MealItem, MealSlot, Page } from '@liftfuel/shared-types';
import { api } from '../lib/api';
import { qk } from './keys';

export function useMealsForDate(date: string) {
  return useQuery({
    queryKey: qk.meals(date),
    queryFn: async () => {
      const res = await api<Page<Meal>>(`/meals?date=${date}`);
      return res.data;
    },
  });
}

export function useMeal(id: string | undefined) {
  return useQuery({
    enabled: !!id,
    queryKey: qk.meal(id ?? ''),
    queryFn: () => api<Meal>(`/meals/${id}`),
  });
}

export function useCreateMeal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ date, slot }: { date: string; slot: MealSlot }) =>
      api<Meal>('/meals', { method: 'POST', body: JSON.stringify({ date, slot }) }),
    onSuccess: (_m, { date }) => qc.invalidateQueries({ queryKey: qk.meals(date) }),
  });
}

export function useUpdateMeal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      ...dto
    }: {
      id: string;
      kcal?: number;
      proteinG?: number;
      carbsG?: number;
      fatG?: number;
      notes?: string;
    }) => api<Meal>(`/meals/${id}`, { method: 'PATCH', body: JSON.stringify(dto) }),
    onSuccess: (m) => {
      qc.invalidateQueries({ queryKey: qk.meal(m.id) });
      qc.invalidateQueries({ queryKey: ['meals'] });
    },
  });
}

export function useDeleteMeal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api<void>(`/meals/${id}`, { method: 'DELETE' }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['meals'] }),
  });
}

export function useAddMealItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ mealId, ...dto }: { mealId: string } & CreateMealItemDto) =>
      api<MealItem>(`/meals/${mealId}/items`, { method: 'POST', body: JSON.stringify(dto) }),
    onSuccess: (_m, { mealId }) => qc.invalidateQueries({ queryKey: qk.meal(mealId) }),
  });
}

export function usePatchMealItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      mealId,
      itemId,
      ...dto
    }: { mealId: string; itemId: string } & Partial<CreateMealItemDto>) =>
      api<MealItem>(`/meals/${mealId}/items/${itemId}`, {
        method: 'PATCH',
        body: JSON.stringify(dto),
      }),
    onSuccess: (_m, { mealId }) => qc.invalidateQueries({ queryKey: qk.meal(mealId) }),
  });
}

export function useDeleteMealItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ mealId, itemId }: { mealId: string; itemId: string }) =>
      api<void>(`/meals/${mealId}/items/${itemId}`, { method: 'DELETE' }),
    onSuccess: (_m, { mealId }) => qc.invalidateQueries({ queryKey: qk.meal(mealId) }),
  });
}
