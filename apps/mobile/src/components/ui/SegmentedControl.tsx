import { Pressable, Text, View } from 'react-native';
import { haptic } from '../../lib/haptics';

interface Option<V> {
  label: string;
  value: V;
}

interface Props<V> {
  options: Option<V>[];
  value: V;
  onChange: (v: V) => void;
  accent?: 'teal' | 'orange';
  testID?: string;
}

export function SegmentedControl<V extends string | number>({
  options,
  value,
  onChange,
  accent = 'teal',
  testID,
}: Props<V>) {
  const activeBg = accent === 'teal' ? '#14B8A6' : '#F97316';
  const activeInk = accent === 'teal' ? '#042F2A' : '#3D1A04';
  return (
    <View
      testID={testID}
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
        const selected = o.value === value;
        return (
          <Pressable
            key={String(o.value)}
            onPress={() => {
              haptic.selection();
              onChange(o.value);
            }}
            style={{
              flex: 1,
              height: 36,
              borderRadius: 8,
              backgroundColor: selected ? activeBg : 'transparent',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text
              style={{
                color: selected ? activeInk : '#94A3B8',
                fontWeight: '700',
                fontSize: 12,
                letterSpacing: 0.04,
              }}
            >
              {o.label.toUpperCase()}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
