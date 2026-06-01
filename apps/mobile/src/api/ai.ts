import { useMutation } from '@tanstack/react-query';
import type { AskResponse } from '@liftfuel/shared-types';
import { api } from '../lib/api';

export function useAsk() {
  return useMutation({
    mutationFn: (question: string) =>
      api<AskResponse>('/ai/ask', { method: 'POST', body: JSON.stringify({ question }) }),
  });
}

export interface ParseMealResult {
  items: Array<{
    name: string;
    portionG: number | null;
    kcal: number;
    proteinG: number;
    carbsG: number;
    fatG: number;
    notes: string | null;
  }>;
  confidence: number;
}

export function useParseMeal() {
  return useMutation({
    mutationFn: ({ mealId, base64, mime }: { mealId?: string; base64: string; mime: string }) =>
      api<ParseMealResult>('/ai/parse-meal', {
        method: 'POST',
        body: JSON.stringify({ image: { data: base64, mime }, meal_id: mealId }),
      }),
  });
}
