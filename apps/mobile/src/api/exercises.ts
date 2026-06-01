import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import type { Exercise, ExerciseHistoryResponse, Page } from '@liftfuel/shared-types';
import { api } from '../lib/api';
import { qk } from './keys';

interface ListParams {
  q?: string;
  muscle?: string;
  equipment?: string;
  category?: string;
}

export function useExercises(params: ListParams = {}) {
  return useInfiniteQuery({
    queryKey: qk.exercises(params.q, params.muscle, params.equipment, params.category),
    initialPageParam: undefined as string | undefined,
    queryFn: async ({ pageParam }) => {
      const p = new URLSearchParams();
      if (params.q) p.set('q', params.q);
      if (params.muscle) p.set('muscle', params.muscle);
      if (params.equipment) p.set('equipment', params.equipment);
      if (params.category) p.set('category', params.category);
      if (pageParam) p.set('cursor', pageParam);
      p.set('limit', '50');
      return api<Page<Exercise>>(`/exercises?${p.toString()}`);
    },
    getNextPageParam: (last) => last.next_cursor ?? undefined,
  });
}

export function useExercise(id: string | undefined) {
  return useQuery({
    enabled: !!id,
    queryKey: qk.exercise(id ?? ''),
    queryFn: () => api<Exercise>(`/exercises/${id}`),
  });
}

export function useExerciseHistory(id: string | undefined, range: '7d' | '30d' | '90d' = '90d') {
  return useQuery({
    enabled: !!id,
    queryKey: qk.exerciseHistory(id ?? '', range),
    queryFn: () => api<ExerciseHistoryResponse>(`/exercises/${id}/history?range=${range}`),
  });
}
