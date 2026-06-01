import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { LogDropDto, LogSetDto, Page, StartWorkoutDto, Workout, WorkoutSet } from '@liftfuel/shared-types';
import { api } from '../lib/api';
import { qk } from './keys';

export function useWorkouts(from?: string, to?: string) {
  return useQuery({
    queryKey: qk.workouts(from, to),
    queryFn: async () => {
      const p = new URLSearchParams();
      if (from) p.set('from', from);
      if (to) p.set('to', to);
      p.set('limit', '50');
      const qs = p.toString();
      const res = await api<Page<Workout>>(`/workouts${qs ? `?${qs}` : ''}`);
      return res.data;
    },
  });
}

export function useWorkout(id: string | undefined) {
  return useQuery({
    enabled: !!id,
    queryKey: qk.workout(id ?? ''),
    queryFn: () => api<Workout>(`/workouts/${id}`),
  });
}

export function useStartWorkout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: StartWorkoutDto) =>
      api<Workout>('/workouts', { method: 'POST', body: JSON.stringify(dto) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['workouts'] }),
  });
}

export function useUpdateWorkout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...dto }: { id: string; endedAt?: string; notes?: string; mood?: number }) =>
      api<Workout>(`/workouts/${id}`, { method: 'PATCH', body: JSON.stringify(dto) }),
    onSuccess: (w) => {
      qc.invalidateQueries({ queryKey: qk.workout(w.id) });
      qc.invalidateQueries({ queryKey: ['workouts'] });
    },
  });
}

export function useDeleteWorkout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api<void>(`/workouts/${id}`, { method: 'DELETE' }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['workouts'] }),
  });
}

export function useAddWorkoutExercise() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ workoutId, exerciseId, order }: { workoutId: string; exerciseId: string; order?: number }) =>
      api(`/workouts/${workoutId}/exercises`, {
        method: 'POST',
        body: JSON.stringify({ exerciseId, order }),
      }),
    onSuccess: (_x, { workoutId }) => qc.invalidateQueries({ queryKey: qk.workout(workoutId) }),
  });
}

export function useLogSet(workoutId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ weId, dto }: { weId: string; dto: LogSetDto }) =>
      api<WorkoutSet>(`/workouts/exercises/${weId}/sets`, {
        method: 'POST',
        body: JSON.stringify(dto),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.workout(workoutId) }),
  });
}

export function usePatchSet(workoutId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: Partial<LogSetDto> }) =>
      api<WorkoutSet>(`/workouts/sets/${id}`, { method: 'PATCH', body: JSON.stringify(dto) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.workout(workoutId) }),
  });
}

export function useDeleteSet(workoutId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api<void>(`/workouts/sets/${id}`, { method: 'DELETE' }),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.workout(workoutId) }),
  });
}

export function useSetDrops(workoutId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ setId, drops }: { setId: string; drops: LogDropDto[] }) =>
      api(`/workouts/sets/${setId}/drops`, { method: 'POST', body: JSON.stringify({ drops }) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.workout(workoutId) }),
  });
}
