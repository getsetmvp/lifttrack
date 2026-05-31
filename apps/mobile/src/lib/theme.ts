// Theme tokens — re-export of palette for non-NativeWind contexts (SVG, Reanimated, native props).
// Single source of truth for hex values. Mirrors apps/mobile/tailwind.config.ts colors.

export const colors = {
  canvas: { DEFAULT: '#FAFAFA', dark: '#0F1115', subtle: '#13161C' },
  surf: {
    1: '#FFFFFF', '1d': '#181B22',
    2: '#F1F5F9', '2d': '#21252E',
    3: '#E2E8F0', '3d': '#2A2F3A',
  },
  teal: { DEFAULT: '#14B8A6', hover: '#0D9488', subtle: 'rgba(20,184,166,0.12)', ink: '#042F2A' },
  orange: { DEFAULT: '#F97316', hover: '#EA580C', subtle: 'rgba(249,115,22,0.12)', ink: '#3D1A04' },
  good: { DEFAULT: '#10B981', dark: '#34D399' },
  warn: { DEFAULT: '#F59E0B', dark: '#FBBF24' },
  bad: { DEFAULT: '#EF4444', dark: '#F87171' },
  info: { DEFAULT: '#3B82F6', dark: '#60A5FA' },
  chart: { 1: '#14B8A6', 2: '#F97316', 3: '#A78BFA', grid: 'rgba(255,255,255,0.04)' },
  tx: {
    hi: '#F1F5F9',
    mid: '#94A3B8',
    lo: '#64748B',
    disabled: '#475569',
    inverse: '#0F1115',
  },
  line: { light: '#E2E8F0', dark: '#2A2F3A' },
} as const;

export const radius = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
  full: 9999,
} as const;

export const space = {
  1: 4, 2: 8, 3: 12, 4: 16, 5: 20, 6: 24, 8: 32, 10: 40, 12: 48, 16: 64,
} as const;
