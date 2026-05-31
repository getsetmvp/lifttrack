// Button atom — variants per design.md § 10.
// Soft-Dark Modern: 1px border + 1px top highlight for depth (no big shadows).

import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { haptic } from '../../lib/haptics';
import type { ReactNode } from 'react';

export type ButtonVariant = 'primary-teal' | 'primary-orange' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface Props {
  label: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  testID?: string;
}

const heightBySize: Record<ButtonSize, number> = { sm: 36, md: 44, lg: 48 };

export function Button({
  label,
  onPress,
  variant = 'primary-teal',
  size = 'md',
  leadingIcon,
  trailingIcon,
  loading = false,
  disabled = false,
  fullWidth = false,
  testID,
}: Props) {
  const isDisabled = disabled || loading;

  const bg =
    variant === 'primary-teal' ? '#14B8A6' :
    variant === 'primary-orange' ? '#F97316' :
    variant === 'danger' ? 'rgba(239,68,68,0.12)' :
    variant === 'ghost' ? 'transparent' :
    '#21252E';

  const textColor =
    variant === 'primary-teal' ? '#042F2A' :
    variant === 'primary-orange' ? '#3D1A04' :
    variant === 'danger' ? '#EF4444' :
    '#F1F5F9';

  const borderColor =
    variant === 'secondary' || variant === 'ghost' ? '#2A2F3A' :
    variant === 'danger' ? 'rgba(239,68,68,0.30)' :
    'transparent';

  return (
    <Pressable
      testID={testID}
      onPress={() => {
        if (isDisabled) return;
        haptic.selection();
        onPress?.();
      }}
      disabled={isDisabled}
      style={({ pressed }) => ({
        height: heightBySize[size],
        paddingHorizontal: size === 'sm' ? 12 : 16,
        borderRadius: 12,
        backgroundColor: bg,
        borderWidth: borderColor === 'transparent' ? 0 : 1,
        borderColor,
        opacity: isDisabled ? 0.5 : pressed ? 0.85 : 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        ...(fullWidth ? { width: '100%' as const } : {}),
      })}
    >
      {loading ? (
        <ActivityIndicator color={textColor} size="small" />
      ) : (
        <>
          {leadingIcon}
          <Text
            style={{
              color: textColor,
              fontWeight: '700',
              fontSize: size === 'sm' ? 13 : 15,
              letterSpacing: -0.1,
            }}
          >
            {label}
          </Text>
          {trailingIcon}
        </>
      )}
    </Pressable>
  );
}
