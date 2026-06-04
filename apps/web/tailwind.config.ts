import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  darkMode: 'media',
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'ui-monospace', 'monospace'],
      },
      colors: {
        // LiftTrack brand pair — teal=lift, orange=fuel/eat
        brand: {
          DEFAULT: '#14B8A6',
          deep: '#0D9488',
          light: '#5EEAD4',
          50: '#F0FDFA',
          100: '#CCFBF1',
          200: '#99F6E4',
          300: '#5EEAD4',
          400: '#2DD4BF',
          500: '#14B8A6',
          600: '#0D9488',
          700: '#0F766E',
          800: '#115E59',
          900: '#134E4A',
        },
        accent: {
          DEFAULT: '#F97316',
          deep: '#EA580C',
          light: '#FB923C',
          50: '#FFF7ED',
          100: '#FFEDD5',
          400: '#FB923C',
          500: '#F97316',
          600: '#EA580C',
          700: '#C2410C',
        },
        ink: {
          DEFAULT: '#0F1115',
          inverse: '#F1F5F9',
        },
        paper: {
          DEFAULT: '#FAFAFA',
          subtle: '#F1F5F9',
        },
        night: {
          DEFAULT: '#0F1115',
          surface: '#181B22',
          surface2: '#21252E',
          surface3: '#2A2F3A',
        },
        muted: {
          DEFAULT: '#64748B',
          dark: '#94A3B8',
        },
        edge: {
          DEFAULT: '#E2E8F0',
          dark: '#2A2F3A',
        },
        good: '#10B981',
        warn: '#F59E0B',
        bad: '#EF4444',
      },
      boxShadow: {
        card: '0 1px 2px rgba(0,0,0,0.04), 0 4px 24px rgba(0,0,0,0.06)',
        cardDark: '0 1px 2px rgba(0,0,0,0.4), 0 8px 32px rgba(0,0,0,0.5)',
        glow: '0 0 0 1px rgba(20,184,166,0.20), 0 20px 60px -10px rgba(20,184,166,0.45)',
      },
      borderRadius: {
        xs: '6px',
        '4xl': '32px',
      },
      maxWidth: {
        container: '1200px',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease-out both',
        'fade-in': 'fadeIn 0.6s ease-out both',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
