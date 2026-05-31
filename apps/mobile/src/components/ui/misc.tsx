// Small atoms grouped — Divider, Tag, Avatar, EmptyState, LoadingShimmer, ErrorBanner,
// ProgressBar, RangePill, StatTile, Checkbox, Switch.

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Animated, Pressable, Text, View } from 'react-native';

// ── Divider ────────────────────────────────────────────────────────────

export function Divider({ inset = 0 }: { inset?: number }) {
  return <View style={{ height: 1, backgroundColor: 'rgba(255,255,255,0.06)', marginLeft: inset }} />;
}

// ── Tag ────────────────────────────────────────────────────────────────

export function Tag({ label, tone = 'neutral' }: { label: string; tone?: 'neutral' | 'teal' | 'orange' }) {
  const bg = tone === 'teal' ? 'rgba(20,184,166,0.15)' : tone === 'orange' ? 'rgba(249,115,22,0.15)' : '#21252E';
  const fg = tone === 'teal' ? '#14B8A6' : tone === 'orange' ? '#F97316' : '#94A3B8';
  return (
    <View style={{ paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, backgroundColor: bg }}>
      <Text style={{ color: fg, fontSize: 10, fontWeight: '700', letterSpacing: 0.04 }}>{label.toUpperCase()}</Text>
    </View>
  );
}

// ── Avatar ─────────────────────────────────────────────────────────────

export function Avatar({ name, size = 40 }: { name: string; size?: number }) {
  const letter = (name?.charAt(0) || '?').toUpperCase();
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: 'rgba(20,184,166,0.18)',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text style={{ color: '#14B8A6', fontFamily: 'JetBrainsMono_700Bold', fontSize: Math.round(size * 0.4) }}>
        {letter}
      </Text>
    </View>
  );
}

// ── EmptyState ─────────────────────────────────────────────────────────

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  subtitle?: string;
  cta?: ReactNode;
}

export function EmptyState({ icon, title, subtitle, cta }: EmptyStateProps) {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', padding: 48, gap: 12 }}>
      {icon}
      <Text style={{ color: '#F1F5F9', fontSize: 18, fontWeight: '700', textAlign: 'center' }}>{title}</Text>
      {subtitle ? (
        <Text style={{ color: '#94A3B8', fontSize: 13, textAlign: 'center', maxWidth: 240 }}>{subtitle}</Text>
      ) : null}
      {cta}
    </View>
  );
}

// ── LoadingShimmer ─────────────────────────────────────────────────────

export function LoadingShimmer({
  width = '100%',
  height = 14,
  radius = 6,
}: {
  width?: number | `${number}%`;
  height?: number;
  radius?: number;
}) {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.timing(anim, { toValue: 1, duration: 1200, useNativeDriver: true }),
    ).start();
  }, [anim]);
  const opacity = anim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.4, 0.8, 0.4] });
  return (
    <Animated.View
      style={{
        width,
        height,
        borderRadius: radius,
        backgroundColor: '#21252E',
        opacity,
      }}
    />
  );
}

// ── ErrorBanner ────────────────────────────────────────────────────────

interface ErrorBannerProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorBanner({ message, onRetry }: ErrorBannerProps) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        padding: 12,
        borderRadius: 12,
        backgroundColor: 'rgba(239,68,68,0.10)',
        borderLeftWidth: 3,
        borderLeftColor: '#EF4444',
      }}
    >
      <Text style={{ flex: 1, color: '#F1F5F9', fontSize: 13 }}>{message}</Text>
      {onRetry ? (
        <Pressable onPress={onRetry}>
          <Text style={{ color: '#EF4444', fontSize: 13, fontWeight: '700' }}>Retry</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

// ── ProgressBar ────────────────────────────────────────────────────────

export function ProgressBar({
  value,
  max,
  tone = 'teal',
  height = 6,
}: {
  value: number;
  max: number;
  tone?: 'teal' | 'orange' | 'success' | 'warn' | 'error';
  height?: number;
}) {
  const pct = Math.max(0, Math.min(100, (value / Math.max(1, max)) * 100));
  const fill =
    tone === 'orange' ? '#F97316' :
    tone === 'success' ? '#10B981' :
    tone === 'warn' ? '#F59E0B' :
    tone === 'error' ? '#EF4444' :
    '#14B8A6';
  return (
    <View
      style={{
        height,
        borderRadius: height / 2,
        backgroundColor: '#21252E',
        overflow: 'hidden',
      }}
    >
      <View style={{ width: `${pct}%`, height: '100%', backgroundColor: fill }} />
    </View>
  );
}

// ── RangePill ──────────────────────────────────────────────────────────

export type RangeValue = '7d' | '30d' | '90d' | 'all';

export function RangePill({
  value,
  onChange,
}: {
  value: RangeValue;
  onChange: (v: RangeValue) => void;
}) {
  const options: RangeValue[] = ['7d', '30d', '90d', 'all'];
  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: '#181B22',
        borderWidth: 1,
        borderColor: '#2A2F3A',
        borderRadius: 12,
        padding: 4,
        gap: 4,
      }}
    >
      {options.map((o) => {
        const selected = o === value;
        return (
          <Pressable
            key={o}
            onPress={() => onChange(o)}
            style={{
              flex: 1,
              height: 32,
              borderRadius: 8,
              backgroundColor: selected ? '#14B8A6' : 'transparent',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text
              style={{
                color: selected ? '#042F2A' : '#94A3B8',
                fontWeight: '700',
                fontSize: 12,
              }}
            >
              {o.toUpperCase()}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

// ── StatTile ───────────────────────────────────────────────────────────

export function StatTile({
  label,
  value,
  delta,
  tone = 'neutral',
}: {
  label: string;
  value: string;
  delta?: string;
  tone?: 'neutral' | 'teal';
}) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#181B22',
        borderWidth: 1,
        borderColor: '#2A2F3A',
        borderRadius: 14,
        padding: 12,
      }}
    >
      <Text style={{ color: '#94A3B8', fontSize: 10, fontWeight: '700', letterSpacing: 0.08, textTransform: 'uppercase' }}>
        {label}
      </Text>
      <Text
        style={{
          color: tone === 'teal' ? '#14B8A6' : '#F1F5F9',
          fontFamily: 'JetBrainsMono_700Bold',
          fontSize: 22,
          marginTop: 2,
        }}
      >
        {value}
      </Text>
      {delta ? (
        <Text style={{ color: '#94A3B8', fontFamily: 'JetBrainsMono_500Medium', fontSize: 10, marginTop: 2 }}>
          {delta}
        </Text>
      ) : null}
    </View>
  );
}

// ── Checkbox ───────────────────────────────────────────────────────────

export function Checkbox({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: string;
}) {
  return (
    <Pressable
      onPress={() => onChange(!checked)}
      style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
    >
      <View
        style={{
          width: 18,
          height: 18,
          borderRadius: 5,
          backgroundColor: checked ? '#14B8A6' : 'transparent',
          borderWidth: 1.5,
          borderColor: checked ? '#14B8A6' : '#475569',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {checked ? <Text style={{ color: '#042F2A', fontSize: 11, fontWeight: '900' }}>✓</Text> : null}
      </View>
      {label ? <Text style={{ color: '#F1F5F9', fontSize: 13, fontWeight: '600' }}>{label}</Text> : null}
    </Pressable>
  );
}

// ── Switch ─────────────────────────────────────────────────────────────

export function Switch({
  value,
  onChange,
}: {
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <Pressable onPress={() => onChange(!value)}>
      <View
        style={{
          width: 44,
          height: 24,
          borderRadius: 999,
          backgroundColor: value ? '#14B8A6' : '#21252E',
          padding: 2,
          justifyContent: 'center',
        }}
      >
        <View
          style={{
            width: 20,
            height: 20,
            borderRadius: 999,
            backgroundColor: value ? '#FFFFFF' : '#64748B',
            alignSelf: value ? 'flex-end' : 'flex-start',
          }}
        />
      </View>
    </Pressable>
  );
}
