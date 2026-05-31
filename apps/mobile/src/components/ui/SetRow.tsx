// SetRow — used inside ActiveWorkout exercise card to render one set line.
// Logged sets show check + optional PR badge; pending tap-to-log shows dashed border.

import { Pressable, Text, View } from 'react-native';
import { CheckCircle2, Plus, Trophy } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { useUnitStore } from '../../store/useUnitStore';
import { formatWeight } from '../../lib/format';
import { Chip } from './Chip';

interface Props {
  setIndex: number;
  weightKg?: number;
  reps?: number;
  isWarmup?: boolean;
  isPr?: boolean;
  state: 'logged' | 'pending' | 'in-progress';
  onPress?: () => void;
  drops?: Array<{ weightKg: number; reps: number }>;
  testID?: string;
}

export function SetRow({ setIndex, weightKg, reps, isWarmup, isPr, state, onPress, drops, testID }: Props) {
  const { unit } = useUnitStore();

  if (state === 'pending') {
    return (
      <Pressable
        testID={testID}
        onPress={onPress}
        style={({ pressed }) => ({
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
          padding: 12,
          borderRadius: 10,
          borderWidth: 2,
          borderStyle: 'dashed',
          borderColor: 'rgba(20,184,166,0.40)',
          opacity: pressed ? 0.6 : 1,
        })}
      >
        <SetBadge n={setIndex} accent />
        <Text style={{ flex: 1, color: '#14B8A6', fontWeight: '700', fontSize: 14 }}>Tap to log set</Text>
        <Plus color="#14B8A6" size={16} />
      </Pressable>
    );
  }

  return (
    <View testID={testID}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
          padding: 10,
          borderRadius: 10,
          backgroundColor: '#21252E',
        }}
      >
        <SetBadge n={setIndex} accent />
        <Text
          style={{
            flex: 1,
            color: '#F1F5F9',
            fontFamily: 'JetBrainsMono_500Medium',
            fontSize: 14,
          }}
        >
          {weightKg != null && reps != null ? `${formatWeight(weightKg, unit)} × ${reps}` : '—'}
        </Text>
        {isWarmup ? <Chip label="WARM" tone="warn" /> : null}
        {isPr ? <PrBadge /> : <CheckCircle2 color="#10B981" size={16} />}
      </View>
      {drops && drops.length > 0 ? (
        <View style={{ paddingLeft: 38, marginTop: 4, gap: 4 }}>
          {drops.map((d, i) => (
            <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Chip label={`D${i + 1}`} tone="orange" />
              <Text style={{ color: '#94A3B8', fontFamily: 'JetBrainsMono_500Medium', fontSize: 12 }}>
                {formatWeight(d.weightKg, unit)} × {d.reps}
              </Text>
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
}

function SetBadge({ n, accent }: { n: number; accent?: boolean }) {
  return (
    <View
      style={{
        width: 24,
        height: 24,
        borderRadius: 6,
        backgroundColor: accent ? 'rgba(20,184,166,0.18)' : '#2A2F3A',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text
        style={{
          fontFamily: 'JetBrainsMono_700Bold',
          fontSize: 11,
          color: accent ? '#14B8A6' : '#94A3B8',
        }}
      >
        {n}
      </Text>
    </View>
  );
}

export function PrBadge() {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 7,
        paddingVertical: 2,
        borderRadius: 999,
        backgroundColor: 'rgba(20,184,166,0.15)',
        borderWidth: 1,
        borderColor: 'rgba(20,184,166,0.30)',
      }}
    >
      <Trophy color="#14B8A6" size={10} />
      <Text style={{ color: '#14B8A6', fontSize: 10, fontWeight: '800', letterSpacing: 0.04 }}>PR</Text>
    </View>
  );
}
