// Button atom — variants per design.md § 10.

import { useState, type ReactNode } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { haptic } from '../../lib/haptics';

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

const variantStyles = {
  'primary-teal': { bg: '#14B8A6', fg: '#042F2A', border: 'transparent' },
  'primary-orange': { bg: '#F97316', fg: '#3D1A04', border: 'transparent' },
  secondary: { bg: '#21252E', fg: '#F1F5F9', border: '#2A2F3A' },
  ghost: { bg: 'transparent', fg: '#F1F5F9', border: '#2A2F3A' },
  danger: { bg: 'rgba(239,68,68,0.12)', fg: '#EF4444', border: 'rgba(239,68,68,0.30)' },
} as const;

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
  const v = variantStyles[variant];
  const [pressed, setPressed] = useState(false);

  return (
    <Pressable
      testID={testID}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      onPress={() => {
        if (isDisabled) return;
        haptic.selection();
        onPress?.();
      }}
      disabled={isDisabled}
    >
      <View
        style={{
          height: heightBySize[size],
          paddingHorizontal: size === 'sm' ? 12 : 16,
          backgroundColor: v.bg,
          borderColor: v.border,
          borderWidth: v.border === 'transparent' ? 0 : 1,
          borderRadius: 12,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: isDisabled ? 0.5 : pressed ? 0.85 : 1,
          alignSelf: fullWidth ? 'stretch' : undefined,
        }}
      >
        {loading ? (
          <ActivityIndicator color={v.fg} size="small" />
        ) : (
          <View style={styles.row}>
            {leadingIcon}
            <Text
              style={{
                color: v.fg,
                fontWeight: '700',
                fontSize: size === 'sm' ? 13 : 15,
                letterSpacing: -0.1,
              }}
            >
              {label}
            </Text>
            {trailingIcon}
          </View>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
});
