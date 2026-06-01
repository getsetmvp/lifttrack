// React Query key factory — central source of truth for cache keys.

export const qk = {
  me: ['me'] as const,
  bodyMetrics: (from?: string, to?: string) => ['body-metrics', from ?? '', to ?? ''] as const,
  exercises: (q?: string, muscle?: string, equipment?: string, category?: string) =>
    ['exercises', q ?? '', muscle ?? '', equipment ?? '', category ?? ''] as const,
  exercise: (id: string) => ['exercise', id] as const,
  exerciseHistory: (id: string, range?: string) => ['exercise-history', id, range ?? '90d'] as const,
  days: ['days'] as const,
  day: (id: string) => ['day', id] as const,
  weeks: ['weeks'] as const,
  week: (id: string) => ['week', id] as const,
  routines: ['routines'] as const,
  routine: (id: string) => ['routine', id] as const,
  routineToday: (id: string) => ['routine-today', id] as const,
  workouts: (from?: string, to?: string) => ['workouts', from ?? '', to ?? ''] as const,
  workout: (id: string) => ['workout', id] as const,
  meals: (date: string) => ['meals', date] as const,
  meal: (id: string) => ['meal', id] as const,
  analyticsSummary: (range: string) => ['analytics', 'summary', range] as const,
  analyticsStrength: (exerciseId: string, range: string) => ['analytics', 'strength', exerciseId, range] as const,
  analyticsStrengthAll: (range: string) => ['analytics', 'strength-all', range] as const,
  analyticsVolume: (range: string, groupBy: string) => ['analytics', 'volume', range, groupBy] as const,
  analyticsNutrition: (range: string) => ['analytics', 'nutrition', range] as const,
} as const;
