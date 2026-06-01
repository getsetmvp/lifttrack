import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { CreateWeekDto, Page, Week, WeekSlot } from '@liftfuel/shared-types';
import { api } from '../lib/api';
import { qk } from './keys';

export function useWeeks() {
  return useQuery({
    queryKey: qk.weeks,
    queryFn: async () => {
      const res = await api<Page<Week>>('/weeks');
      return res.data;
    },
  });
}

export function useWeek(id: string | undefined) {
  return useQuery({
    enabled: !!id,
    queryKey: qk.week(id ?? ''),
    queryFn: () => api<Week & { usedInRoutines: number }>(`/weeks/${id}`),
  });
}

export function useCreateWeek() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateWeekDto) => api<Week>('/weeks', { method: 'POST', body: JSON.stringify(dto) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.weeks }),
  });
}

export function useUpdateWeek() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...dto }: { id: string; name?: string }) =>
      api<Week>(`/weeks/${id}`, { method: 'PATCH', body: JSON.stringify(dto) }),
    onSuccess: (w) => {
      qc.invalidateQueries({ queryKey: qk.weeks });
      qc.invalidateQueries({ queryKey: qk.week(w.id) });
    },
  });
}

export function useDeleteWeek() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api<void>(`/weeks/${id}`, { method: 'DELETE' }),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.weeks }),
  });
}

export function usePutWeekSlot() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ weekId, dayIndex, dayId }: { weekId: string; dayIndex: number; dayId: string | null }) =>
      api<WeekSlot>(`/weeks/${weekId}/slots/${dayIndex}`, {
        method: 'PUT',
        body: JSON.stringify({ dayId }),
      }),
    onSuccess: (_w, { weekId }) => {
      qc.invalidateQueries({ queryKey: qk.week(weekId) });
      qc.invalidateQueries({ queryKey: qk.weeks });
    },
  });
}
