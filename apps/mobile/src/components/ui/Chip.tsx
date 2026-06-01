import { Pressable, Text, View } from 'react-native';
import type { ReactNode } from 'react';

export type ChipTone = 'neutral' | 'teal' | 'orange' | 'success' | 'warn' | 'error' | 'purple';

interface ChipProps {
  label: string;
  tone?: ChipTone;
  selected?: boolean;
  leadingIcon?: ReactNode;
  onPress?: () => void;
  testID?: string;
}

const palette: Record<ChipTone, { bg: string; fg: string; border: string }> = {
  neutral: { bg: '#21252E', fg: '#94A3B8', border: '#2A2F3A' },
  teal: { bg: 'rgba(20,184,166,0.15)', fg: '#14B8A6', border: 'rgba(20,184,166,0.30)' },
  orange: { bg: 'rgba(249,115,22,0.15)', fg: '#F97316', border: 'rgba(249,115,22,0.30)' },
  success: { bg: 'rgba(16,185,129,0.15)', fg: '#10B981', border: 'rgba(16,185,129,0.30)' },
  warn: { bg: 'rgba(245,158,11,0.15)', fg: '#F59E0B', border: 'rgba(245,158,11,0.30)' },
  error: { bg: 'rgba(239,68,68,0.15)', fg: '#EF4444', border: 'rgba(239,68,68,0.30)' },
  purple: { bg: 'rgba(167,139,250,0.15)', fg: '#A78BFA', border: 'rgba(167,139,250,0.30)' },
};

export function Chip({ label, tone = 'neutral', selected = false, leadingIcon, onPress, testID }: ChipProps) {
  const c = palette[tone];
  const content = (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 999,
        backgroundColor: c.bg,
        borderWidth: selected ? 1 : 0,
        borderColor: c.border,
      }}
    >
      {leadingIcon}
      <Text style={{ color: c.fg, fontSize: 11, fontWeight: '700', letterSpacing: 0.04 }}>{label}</Text>
    </View>
  );
  if (onPress) {
    return (
      <Pressable testID={testID} onPress={onPress}>
        {content}
      </Pressable>
    );
  }
  return content;
}

interface ChipGroupOption<V> {
  label: string;
  value: V;
  tone?: ChipTone;
}

interface ChipGroupProps<V> {
  options: ChipGroupOption<V>[];
  value: V | V[];
  onChange: (v: V) => void;
  multi?: boolean;
  testID?: string;
}

export function ChipGroup<V extends string | number>({ options, value, onChange, testID }: ChipGroupProps<V>) {
  const isSelected = (v: V) =>
    Array.isArray(value) ? (value as V[]).includes(v) : value === v;
  return (
    <View testID={testID} style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
      {options.map((o) => (
        <Chip
          key={String(o.value)}
          label={o.label}
          tone={isSelected(o.value) ? o.tone ?? 'teal' : 'neutral'}
          selected={isSelected(o.value)}
          onPress={() => onChange(o.value)}
        />
      ))}
    </View>
  );
}
