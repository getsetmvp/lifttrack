// RestTimerArc — full-screen overlay component on workout/rest-timer route.
// Arc fills CW; pulses red at ≤10s. Locked in design.md § 8.9.

import Svg, { Circle } from 'react-native-svg';
import { Text, View } from 'react-native';
import { formatDuration } from '../../lib/format';

interface Props {
  totalMs: number;
  remainingMs: number;
  size?: number;
  pulseAtMs?: number;
}

export function RestTimerArc({ totalMs, remainingMs, size = 224, pulseAtMs = 10_000 }: Props) {
  const pct = Math.max(0, Math.min(1, remainingMs / Math.max(1, totalMs)));
  const radius = 88;
  const circ = 2 * Math.PI * radius;
  const dashOffset = circ * (1 - pct);
  const urgent = remainingMs <= pulseAtMs;
  const stroke = urgent ? '#EF4444' : '#14B8A6';
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} viewBox="0 0 200 200">
        <Circle cx={100} cy={100} r={radius} stroke="rgba(255,255,255,0.10)" strokeWidth={8} fill="none" />
        <Circle
          cx={100}
          cy={100}
          r={radius}
          stroke={stroke}
          strokeWidth={8}
          fill="none"
          strokeDasharray={`${circ} ${circ}`}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          transform={`rotate(-90 100 100)`}
        />
      </Svg>
      <View style={{ position: 'absolute', alignItems: 'center' }}>
        <Text
          style={{
            fontFamily: 'JetBrainsMono_700Bold',
            fontSize: 48,
            color: '#F1F5F9',
            letterSpacing: -0.02 * 48,
          }}
        >
          {formatDuration(remainingMs)}
        </Text>
        <Text
          style={{
            fontSize: 10,
            color: 'rgba(255,255,255,0.6)',
            letterSpacing: 1.6,
            marginTop: 8,
            fontWeight: '700',
          }}
        >
          REMAINING
        </Text>
      </View>
    </View>
  );
}
