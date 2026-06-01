import { Pressable } from 'react-native';
import type { ReactNode } from 'react';
import { haptic } from '../../lib/haptics';

interface Props {
  icon: ReactNode;
  onPress?: () => void;
  size?: number;
  accessibilityLabel: string;
  variant?: 'card' | 'ghost' | 'accent-teal' | 'accent-orange';
  disabled?: boolean;
  testID?: string;
}

export function IconButton({
  icon,
  onPress,
  size = 40,
  accessibilityLabel,
  variant = 'card',
  disabled = false,
  testID,
}: Props) {
  const bg =
    variant === 'card' ? '#181B22' :
    variant === 'accent-teal' ? '#14B8A6' :
    variant === 'accent-orange' ? '#F97316' :
    'transparent';
  const border = variant === 'card' ? '#2A2F3A' : 'transparent';
  return (
    <Pressable
      testID={testID}
      accessibilityLabel={accessibilityLabel}
      onPress={() => {
        if (disabled) return;
        haptic.selection();
        onPress?.();
      }}
      disabled={disabled}
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: bg,
        borderWidth: variant === 'card' ? 1 : 0,
        borderColor: border,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: disabled ? 0.5 : 1,
      }}
    >
      {icon}
    </Pressable>
  );
}
