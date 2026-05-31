// Toast store — imperative API for transient feedback.

import { create } from 'zustand';

export type ToastTone = 'info' | 'success' | 'warn' | 'error';

export interface Toast {
  id: string;
  tone: ToastTone;
  message: string;
  durationMs: number;
}

interface ToastState {
  toasts: Toast[];
  push: (tone: ToastTone, message: string, durationMs?: number) => void;
  dismiss: (id: string) => void;
  clear: () => void;
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  push: (tone, message, durationMs = 3000) => {
    const id = `t-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    set((s) => ({ toasts: [...s.toasts, { id, tone, message, durationMs }] }));
    setTimeout(() => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })), durationMs);
  },
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
  clear: () => set({ toasts: [] }),
}));
