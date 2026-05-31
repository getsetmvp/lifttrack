// Format helpers — single source of truth for display formatting.
// Weights canonical kg; convert at display time per user.unit.

export function formatWeight(kg: number, unit: 'KG' | 'LB' = 'KG'): string {
  if (unit === 'LB') {
    const lb = kg * 2.20462;
    return `${roundTo(lb, 1).toFixed(1)} lb`;
  }
  return `${roundTo(kg, 2).toFixed(kg % 1 === 0 ? 0 : 1)} kg`;
}

export function formatWeightNum(kg: number, unit: 'KG' | 'LB' = 'KG'): number {
  return unit === 'LB' ? roundTo(kg * 2.20462, 1) : roundTo(kg, 2);
}

export function lbToKg(lb: number): number {
  return roundTo(lb / 2.20462, 2);
}

export function kgToLb(kg: number): number {
  return roundTo(kg * 2.20462, 1);
}

export function formatReps(reps: number): string {
  return String(reps);
}

export function formatDuration(ms: number): string {
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function formatDurationLong(ms: number): string {
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

export function formatKcal(n: number): string {
  return `${Math.round(n)}`;
}

export function formatGrams(n: number): string {
  return `${Math.round(n)}g`;
}

export function formatVolume(kg: number, unit: 'KG' | 'LB' = 'KG'): string {
  // Tonnes for kg / klb for lb at >= 1000
  if (unit === 'LB') {
    const lb = kg * 2.20462;
    if (lb >= 1000) return `${(lb / 1000).toFixed(1)}k lb`;
    return `${Math.round(lb)} lb`;
  }
  if (kg >= 1000) return `${(kg / 1000).toFixed(1)} t`;
  return `${Math.round(kg)} kg`;
}

export function formatDate(iso: string | Date): string {
  const d = typeof iso === 'string' ? new Date(iso) : iso;
  return d.toISOString().slice(0, 10);
}

export function formatRelativeDay(iso: string | Date): string {
  const d = typeof iso === 'string' ? new Date(iso) : iso;
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - d.getTime()) / 86400_000);
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  return formatDate(d);
}

export function formatPct(n: number, digits = 0): string {
  return `${n.toFixed(digits)}%`;
}

function roundTo(n: number, decimals: number): number {
  const f = Math.pow(10, decimals);
  return Math.round(n * f) / f;
}
