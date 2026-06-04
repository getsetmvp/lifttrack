import type { Config } from 'tailwindcss';

// LiftTrack palette — locked in design.md § 2 (Soft-Dark Modern, teal + orange).
const config: Config = {
  content: ['./app/**/*.{tsx,ts,jsx,js}', './src/**/*.{tsx,ts,jsx,js}'],
  presets: [require('nativewind/preset')],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrainsMono', 'ui-monospace', 'monospace'],
      },
      colors: {
        // Canvas + surfaces (dark default, light reserved for v1.1)
        canvas: { DEFAULT: '#FAFAFA', dark: '#0F1115', subtle: '#13161C' },
        surf: {
          1: '#FFFFFF', '1d': '#181B22',
          2: '#F1F5F9', '2d': '#21252E',
          3: '#E2E8F0', '3d': '#2A2F3A',
        },
        // Brand pair — teal = lift, orange = fuel
        teal: {
          DEFAULT: '#14B8A6',
          hover: '#0D9488',
          subtle: 'rgba(20,184,166,0.12)',
          ink: '#042F2A',
        },
        orange: {
          DEFAULT: '#F97316',
          hover: '#EA580C',
          subtle: 'rgba(249,115,22,0.12)',
          ink: '#3D1A04',
        },
        // Semantic states
        good: { DEFAULT: '#10B981', dark: '#34D399' },
        warn: { DEFAULT: '#F59E0B', dark: '#FBBF24' },
        bad:  { DEFAULT: '#EF4444', dark: '#F87171' },
        info: { DEFAULT: '#3B82F6', dark: '#60A5FA' },
        // Chart palette (locked order — never invent per-screen)
        chart: {
          1: '#14B8A6', // primary line (teal)
          2: '#F97316', // secondary line (orange)
          3: '#A78BFA', // tertiary (purple)
          grid: 'rgba(255,255,255,0.04)',
        },
        // Text scale
        tx: {
          hi: '#F1F5F9',
          mid: '#94A3B8',
          lo: '#64748B',
          disabled: '#475569',
          inverse: '#0F1115',
          // Light-mode counterparts (v1.1)
          'hi-l': '#0F172A',
          'mid-l': '#475569',
          'lo-l': '#94A3B8',
        },
        line: { light: '#E2E8F0', dark: '#2A2F3A' },
      },
      borderRadius: {
        sm: '6px',
        md: '10px',
        lg: '14px',
        xl: '20px',
        '2xl': '28px',
      },
      spacing: {
        // 4-base scale (matches design.md § 4)
        1: '4px', 2: '8px', 3: '12px', 4: '16px',
        5: '20px', 6: '24px', 8: '32px', 10: '40px',
        12: '48px', 16: '64px',
      },
      boxShadow: {
        'cta': '0 1px 2px rgba(0,0,0,0.30), inset 0 1px 0 rgba(255,255,255,0.18)',
        'card-inner': 'inset 0 1px 0 rgba(255,255,255,0.04)',
      },
    },
  },
  plugins: [],
};

export default config;
