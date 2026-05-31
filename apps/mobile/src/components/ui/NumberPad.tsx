// NumberPad — the set-logger's input surface. Decimal-aware, configurable quick-increment row.
// Locked in design.md § 8.7 (Set Logger sheet).

import { Pressable, Text, View } from 'react-native';
import { Delete } from 'lucide-react-native';
import { haptic } from '../../lib/haptics';

interface Props {
  value: string; // string so we can preserve trailing decimal point during typing
  onChange: (v: string) => void;
  decimal?: boolean;
  increments?: number[]; // numeric quick-add buttons, e.g. [-2.5, 2.5, 5]
  testID?: string;
}

export function NumberPad({
  value,
  onChange,
  decimal = true,
  increments = [-2.5, 2.5, 5],
  testID,
}: Props) {
  const push = (digit: string) => {
    haptic.selection();
    if (digit === '.') {
      if (!decimal) return;
      if (value.includes('.')) return;
      onChange(value === '' ? '0.' : value + '.');
      return;
    }
    onChange(value === '0' ? digit : value + digit);
  };

  const erase = () => {
    haptic.selection();
    if (value.length <= 1) onChange('');
    else onChange(value.slice(0, -1));
  };

  const applyIncrement = (delta: number) => {
    haptic.light();
    const cur = parseFloat(value || '0');
    const next = Math.max(0, cur + delta);
    onChange(decimal ? String(Math.round(next * 100) / 100) : String(Math.round(next)));
  };

  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'del'];

  return (
    <View testID={testID}>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
        {keys.map((k) => (
          <Pressable
            key={k}
            onPress={() => (k === 'del' ? erase() : push(k))}
            style={({ pressed }) => ({
              width: '32%',
              height: 52,
              borderRadius: 10,
              backgroundColor: '#21252E',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: pressed ? 0.7 : 1,
            })}
          >
            {k === 'del' ? (
              <Delete color="#F1F5F9" size={20} />
            ) : (
              <Text style={{ color: '#F1F5F9', fontFamily: 'JetBrainsMono_600SemiBold', fontSize: 22 }}>
                {k}
              </Text>
            )}
          </Pressable>
        ))}
      </View>
      <View style={{ flexDirection: 'row', gap: 6, marginTop: 6 }}>
        {increments.map((n) => (
          <Pressable
            key={n}
            onPress={() => applyIncrement(n)}
            style={({ pressed }) => ({
              flex: 1,
              height: 44,
              borderRadius: 10,
              backgroundColor: 'rgba(20,184,166,0.15)',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: pressed ? 0.7 : 1,
            })}
          >
            <Text
              style={{
                color: '#14B8A6',
                fontFamily: 'JetBrainsMono_600SemiBold',
                fontSize: 14,
              }}
            >
              {n > 0 ? `+${n}` : n}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
