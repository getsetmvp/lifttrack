import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { CreateDayDto, Day, DayExerciseInput, Page } from '@liftfuel/shared-types';
import { api } from '../lib/api';
import { qk } from './keys';

export function useDays() {
  return useQuery({
    queryKey: qk.days,
    queryFn: async () => {
      const res = await api<Page<Day>>('/days');
      return res.data;
    },
  });
}

export function useDay(id: string | undefined) {
  return useQuery({
    enabled: !!id,
    queryKey: qk.day(id ?? ''),
    queryFn: () => api<Day & { usedInWeeks: number }>(`/days/${id}`),
  });
}

export function useCreateDay() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateDayDto) => api<Day>('/days', { method: 'POST', body: JSON.stringify(dto) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.days }),
  });
}

export function useUpdateDay() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...dto }: { id: string; name?: string; notes?: string | null }) =>
      api<Day>(`/days/${id}`, { method: 'PATCH', body: JSON.stringify(dto) }),
    onSuccess: (d) => {
      qc.invalidateQueries({ queryKey: qk.days });
      qc.invalidateQueries({ queryKey: qk.day(d.id) });
    },
  });
}

export function useDeleteDay() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api<void>(`/days/${id}`, { method: 'DELETE' }),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.days }),
  });
}

export function useDuplicateDay() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, name }: { id: string; name?: string }) =>
      api<Day>(`/days/${id}/duplicate`, { method: 'POST', body: JSON.stringify({ name }) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.days }),
  });
}

export function useAddDayExercises() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, exercises }: { id: string; exercises: DayExerciseInput[] }) =>
      api(`/days/${id}/exercises`, { method: 'POST', body: JSON.stringify(exercises) }),
    onSuccess: (_d, { id }) => {
      qc.invalidateQueries({ queryKey: qk.day(id) });
      qc.invalidateQueries({ queryKey: qk.days });
    },
  });
}

export function useDeleteDayExercise() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api<void>(`/days/exercises/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.days });
      qc.invalidateQueries({ queryKey: ['day'] });
    },
  });
}
