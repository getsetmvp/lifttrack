// Auth store — token-loaded user identity. Hydrated from /auth/me on cold start.

import { create } from 'zustand';
import type { User } from '@liftfuel/shared-types';

interface AuthState {
  user: User | null;
  ready: boolean;
  setUser: (user: User | null) => void;
  setReady: (ready: boolean) => void;
  reset: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  ready: false,
  setUser: (user) => set({ user }),
  setReady: (ready) => set({ ready }),
  reset: () => set({ user: null, ready: true }),
}));
