// Rest timer overlay — design.md § 8 screen 25.
// Full-screen overlay launched after logging a set. Params: seconds (target rest), next (next set label).
// Auto-dismisses when timer hits zero (notification + chime per haptic vocab).

import { useEffect, useRef, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { RestTimerArc } from '../src/components/ui';
import { haptic } from '../src/lib/haptics';

export default function RestTimer() {
  const { seconds, next, target } = useLocalSearchParams<{ seconds?: string; next?: string; target?: string }>();
  const totalMs = (parseInt(seconds ?? '90', 10) || 90) * 1000;
  const startedAt = useRef(Date.now());
  const [extraMs, setExtraMs] = useState(0);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(t);
  }, []);

  const elapsed = now - startedAt.current;
  const remaining = Math.max(0, totalMs + extraMs - elapsed);

  useEffect(() => {
    if (remaining <= 0 && totalMs > 0) {
      haptic.success();
      router.back();
    }
  }, [remaining, totalMs]);

  useEffect(() => {
    if (remaining > 0 && remaining <= 10_000 && remaining > 9_800) {
      haptic.warning();
    }
  }, [remaining]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#042F2A' }} edges={['top', 'bottom']}>
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '50%', backgroundColor: '#0F1115' }} />
      <View style={{ position: 'absolute', top: '40%', left: '50%', width: 400, height: 400, borderRadius: 200, backgroundColor: 'rgba(20,184,166,0.18)', transform: [{ translateX: -200 }, { translateY: -200 }] }} />
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 }}>
        <Text
          style={{
            color: 'rgba(255,255,255,0.5)',
            fontSize: 10,
            fontWeight: '700',
            letterSpacing: 2.4,
            marginBottom: 24,
          }}
        >
          REST
        </Text>
        <RestTimerArc totalMs={totalMs + extraMs} remainingMs={remaining} size={260} />
        {next ? (
          <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14, marginTop: 32, textAlign: 'center' }}>
            {next}
          </Text>
        ) : null}
        {target ? (
          <Text
            style={{
              color: 'rgba(255,255,255,0.5)',
              fontFamily: 'JetBrainsMono_500Medium',
              fontSize: 11,
              marginTop: 6,
              textAlign: 'center',
            }}
          >
            target {target}
          </Text>
        ) : null}
        <View style={{ flexDirection: 'row', gap: 12, marginTop: 40 }}>
          <PillButton
            label="−15"
            mono
            onPress={() => {
              setExtraMs((m) => m - 15_000);
              haptic.selection();
            }}
          />
          <Pressable
            onPress={() => {
              haptic.medium();
              router.back();
            }}
            style={{
              height: 56,
              paddingHorizontal: 28,
              borderRadius: 18,
              backgroundColor: '#F1F5F9',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ color: '#0F1115', fontSize: 14, fontWeight: '700' }}>Skip rest</Text>
          </Pressable>
          <PillButton
            label="+15"
            mono
            onPress={() => {
              setExtraMs((m) => m + 15_000);
              haptic.selection();
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

function PillButton({ label, onPress, mono }: { label: string; onPress: () => void; mono?: boolean }) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        width: 56,
        height: 56,
        borderRadius: 18,
        backgroundColor: 'rgba(255,255,255,0.1)',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text
        style={{
          color: '#F1F5F9',
          fontFamily: mono ? 'JetBrainsMono_700Bold' : undefined,
          fontWeight: '700',
          fontSize: 14,
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}
