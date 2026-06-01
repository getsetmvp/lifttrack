import { useQuery } from '@tanstack/react-query';
import type {
  AnalyticsSummary,
  CorrelationResponse,
  NutritionPoint,
  StrengthDetail,
  StrengthRow,
  VolumePoint,
} from '@liftfuel/shared-types';
import { api } from '../lib/api';
import { qk } from './keys';

export type Range = '7d' | '30d' | '90d' | 'all';

export function useAnalyticsSummary(range: Range = '30d') {
  return useQuery({
    queryKey: qk.analyticsSummary(range),
    queryFn: () => api<AnalyticsSummary>(`/analytics/summary?range=${range}`),
  });
}

export function useStrengthAll(range: Range = '30d') {
  return useQuery({
    queryKey: qk.analyticsStrengthAll(range),
    queryFn: () => api<StrengthRow[]>(`/analytics/strength/all?range=${range}`),
  });
}

export function useStrengthDetail(exerciseId: string | undefined, range: Range = '90d') {
  return useQuery({
    enabled: !!exerciseId,
    queryKey: qk.analyticsStrength(exerciseId ?? '', range),
    queryFn: () =>
      api<StrengthDetail>(`/analytics/strength?exercise_id=${exerciseId}&range=${range}`),
  });
}

export function useVolume(range: Range = '30d', groupBy: 'week' | 'day' = 'week') {
  return useQuery({
    queryKey: qk.analyticsVolume(range, groupBy),
    queryFn: () => api<VolumePoint[]>(`/analytics/volume?range=${range}&group_by=${groupBy}`),
  });
}

export function useNutritionAnalytics(range: Range = '30d') {
  return useQuery({
    queryKey: qk.analyticsNutrition(range),
    queryFn: () => api<NutritionPoint[]>(`/analytics/nutrition?range=${range}`),
  });
}

export function useCorrelation(metricA: string, metricB: string, range: Range = '30d') {
  return useQuery({
    enabled: !!metricA && !!metricB,
    queryKey: ['analytics', 'correlation', metricA, metricB, range],
    queryFn: () =>
      api<CorrelationResponse>(
        `/analytics/correlation?metric_a=${metricA}&metric_b=${metricB}&range=${range}`,
      ),
  });
}
