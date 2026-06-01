import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { BodyMetric, CreateBodyMetricDto, MacroOverride, User } from '@liftfuel/shared-types';
import { api } from '../lib/api';
import { qk } from './keys';
import { useUnitStore } from '../store/useUnitStore';

export interface UpdateUserDto {
  name?: string;
  unit?: 'KG' | 'LB';
  increment?: number;
  goal?: 'MUSCLE' | 'FAT' | 'MAINTAIN' | 'STRENGTH';
  heightCm?: number;
  bodyFatPct?: number;
  macroOverride?: MacroOverride | null;
  fcmToken?: string;
}

export function useUpdateUser() {
  const qc = useQueryClient();
  const setUnit = useUnitStore((s) => s.setUnit);
  const setIncrement = useUnitStore((s) => s.setIncrement);
  return useMutation({
    mutationFn: (dto: UpdateUserDto) =>
      api<User>('/users/me', { method: 'PATCH', body: JSON.stringify(dto) }),
    onSuccess: (u) => {
      qc.setQueryData(qk.me, u);
      if (u.unit) setUnit(u.unit);
      if (u.increment) setIncrement(u.increment);
    },
  });
}

export function useBodyMetrics(from?: string, to?: string) {
  return useQuery({
    queryKey: qk.bodyMetrics(from, to),
    queryFn: async () => {
      const params = new URLSearchParams();
      if (from) params.set('from', from);
      if (to) params.set('to', to);
      const qs = params.toString();
      const res = await api<{ data: BodyMetric[]; next_cursor: string | null }>(
        `/users/me/body-metrics${qs ? `?${qs}` : ''}`,
      );
      return res.data;
    },
  });
}

export function useAddBodyMetric() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateBodyMetricDto) =>
      api<BodyMetric>('/users/me/body-metrics', { method: 'POST', body: JSON.stringify(dto) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['body-metrics'] }),
  });
}
