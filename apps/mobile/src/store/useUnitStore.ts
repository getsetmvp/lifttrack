// Unit preference — mirrors user.unit on profile. Cached locally for instant render
// while user object hydrates. Defaults to KG.

import { create } from 'zustand';
import type { Unit } from '@liftfuel/shared-types';

interface UnitState {
  unit: Unit;
  increment: number;
  setUnit: (unit: Unit) => void;
  setIncrement: (n: number) => void;
}

export const useUnitStore = create<UnitState>((set) => ({
  unit: 'KG',
  increment: 0.25,
  setUnit: (unit) => set({ unit }),
  setIncrement: (increment) => set({ increment }),
}));
