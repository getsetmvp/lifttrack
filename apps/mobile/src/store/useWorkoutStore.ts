// Active workout store. Holds in-flight session shadow + offline action queue.
// React Query owns server-authoritative data; this owns transient UI state.

import { create } from 'zustand';

export interface PendingSetAction {
  type: 'log-set';
  workoutExerciseId: string;
  weightKg: number;
  reps: number;
  isWarmup?: boolean;
  isFailure?: boolean;
  tempId: string;
}

interface WorkoutState {
  activeWorkoutId: string | null;
  startedAt: number | null; // epoch ms
  restingUntil: number | null; // epoch ms, null = no rest
  pendingActions: PendingSetAction[];
  setActive: (id: string | null) => void;
  startSession: (id: string) => void;
  endSession: () => void;
  startRest: (seconds: number) => void;
  clearRest: () => void;
  enqueue: (action: PendingSetAction) => void;
  removePending: (tempId: string) => void;
  clearPending: () => void;
}

export const useWorkoutStore = create<WorkoutState>((set) => ({
  activeWorkoutId: null,
  startedAt: null,
  restingUntil: null,
  pendingActions: [],
  setActive: (activeWorkoutId) => set({ activeWorkoutId }),
  startSession: (id) => set({ activeWorkoutId: id, startedAt: Date.now() }),
  endSession: () => set({ activeWorkoutId: null, startedAt: null, restingUntil: null, pendingActions: [] }),
  startRest: (seconds) => set({ restingUntil: Date.now() + seconds * 1000 }),
  clearRest: () => set({ restingUntil: null }),
  enqueue: (action) => set((s) => ({ pendingActions: [...s.pendingActions, action] })),
  removePending: (tempId) => set((s) => ({ pendingActions: s.pendingActions.filter((a) => a.tempId !== tempId) })),
  clearPending: () => set({ pendingActions: [] }),
}));
