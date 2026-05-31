// MacroRing — 4 concentric arcs for protein / carbs / fat / kcal.
// Used on Today + Fuel + Stats Nutrition screens. Color tokens locked in design.md § 2.

import Svg, { Circle } from 'react-native-svg';
import { Text, View } from 'react-native';

interface Props {
  protein: number;
  carbs: number;
  fat: number;
  kcal: number;
  targets?: { protein: number; carbs: number; fat: number; kcal: number };
  size?: number;
}

const RING_COLORS = {
  protein: '#14B8A6',
  carbs: '#F97316',
  fat: '#A78BFA',
  kcal: '#F1F5F9',
};

function Arc({ pct, radius, color }: { pct: number; radius: number; color: string }) {
  const stroke = 3;
  const circ = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, pct));
  const dash = `${(circ * clamped) / 100} ${circ}`;
  return (
    <Circle
      cx={20}
      cy={20}
      r={radius}
      fill="none"
      stroke={color}
      strokeWidth={stroke}
      strokeDasharray={dash}
      strokeLinecap="round"
    />
  );
}

function bg(radius: number) {
  return (
    <Circle
      cx={20}
      cy={20}
      r={radius}
      fill="none"
      stroke="rgba(148,163,184,0.18)"
      strokeWidth={3}
    />
  );
}

export function MacroRing({ protein, carbs, fat, kcal, targets, size = 56 }: Props) {
  const pPct = targets?.protein ? (protein / targets.protein) * 100 : 0;
  const cPct = targets?.carbs ? (carbs / targets.carbs) * 100 : 0;
  const fPct = targets?.fat ? (fat / targets.fat) * 100 : 0;
  const kPct = targets?.kcal ? (kcal / targets.kcal) * 100 : 0;
  return (
    <View
      style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}
      accessibilityLabel={`Protein ${Math.round(pPct)}%, Carbs ${Math.round(cPct)}%, Fat ${Math.round(fPct)}%, kcal ${Math.round(kPct)}%`}
    >
      <Svg width={size} height={size} viewBox="0 0 40 40" style={{ transform: [{ rotate: '-90deg' }] }}>
        {bg(17)}
        <Arc pct={pPct} radius={17} color={RING_COLORS.protein} />
        {bg(13)}
        <Arc pct={cPct} radius={13} color={RING_COLORS.carbs} />
        {bg(9)}
        <Arc pct={fPct} radius={9} color={RING_COLORS.fat} />
        {bg(5)}
        <Arc pct={kPct} radius={5} color={RING_COLORS.kcal} />
      </Svg>
    </View>
  );
}
