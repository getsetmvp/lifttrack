// e1RM helpers — Epley formula. Locked in design.md § 12 derivations.

export function epley(weightKg: number, reps: number): number {
  if (reps <= 0) return 0;
  return weightKg * (1 + reps / 30);
}

/** Round e1RM to 0.1 kg for display */
export function epleyDisplay(weightKg: number, reps: number): number {
  return Math.round(epley(weightKg, reps) * 10) / 10;
}

/** Volume per set: weight × reps. Warm-ups should be filtered before summing. */
export function setVolume(weightKg: number, reps: number): number {
  return weightKg * reps;
}

/** Sum volume across sets (caller filters warm-ups). */
export function sumVolume(sets: Array<{ weightKg: number; reps: number; isWarmup?: boolean }>): number {
  return sets
    .filter((s) => !s.isWarmup)
    .reduce((acc, s) => acc + s.weightKg * s.reps, 0);
}
