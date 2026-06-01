import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { CreateRoutineDto, Page, Routine, RoutineTodayResponse } from '@liftfuel/shared-types';
import { api } from '../lib/api';
import { qk } from './keys';

export function useRoutines() {
  return useQuery({
    queryKey: qk.routines,
    queryFn: async () => {
      const res = await api<Page<Routine>>('/routines');
      return res.data;
    },
  });
}

export function useActiveRoutine() {
  const q = useRoutines();
  return { ...q, data: q.data?.find((r) => r.isActive) };
}

export function useRoutine(id: string | undefined) {
  return useQuery({
    enabled: !!id,
    queryKey: qk.routine(id ?? ''),
    queryFn: () => api<Routine>(`/routines/${id}`),
  });
}

export function useRoutineToday(id: string | undefined) {
  return useQuery({
    enabled: !!id,
    queryKey: qk.routineToday(id ?? ''),
    queryFn: () => api<RoutineTodayResponse>(`/routines/${id}/today`),
    staleTime: 60_000,
  });
}

export function useCreateRoutine() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateRoutineDto) =>
      api<Routine>('/routines', { method: 'POST', body: JSON.stringify(dto) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.routines }),
  });
}

export function useActivateRoutine() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api<Routine>(`/routines/${id}/activate`, { method: 'POST' }),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.routines }),
  });
}

export function useDeleteRoutine() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api<void>(`/routines/${id}`, { method: 'DELETE' }),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.routines }),
  });
}
