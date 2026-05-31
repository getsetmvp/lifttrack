import { forwardRef, type ReactNode, useState } from 'react';
import { Text, TextInput, View, type TextInputProps } from 'react-native';

interface Props extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  mono?: boolean;
  testID?: string;
}

export const Input = forwardRef<TextInput, Props>(function Input(
  { label, error, leadingIcon, trailingIcon, mono = false, testID, ...rest },
  ref,
) {
  const [focused, setFocused] = useState(false);
  const border = error ? '#EF4444' : focused ? '#14B8A6' : '#2A2F3A';
  return (
    <View testID={testID}>
      {label ? (
        <Text
          style={{
            color: '#94A3B8',
            fontSize: 11,
            fontWeight: '700',
            letterSpacing: 0.08,
            textTransform: 'uppercase',
            marginBottom: 6,
          }}
        >
          {label}
        </Text>
      ) : null}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#21252E',
          borderWidth: 1,
          borderColor: border,
          borderRadius: 12,
          paddingHorizontal: 12,
          height: 48,
          gap: 8,
        }}
      >
        {leadingIcon}
        <TextInput
          ref={ref}
          onFocus={(e) => {
            setFocused(true);
            rest.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            rest.onBlur?.(e);
          }}
          placeholderTextColor="#64748B"
          {...rest}
          style={{
            flex: 1,
            color: '#F1F5F9',
            fontSize: 15,
            fontFamily: mono ? 'JetBrainsMono_500Medium' : 'Inter_500Medium',
          }}
        />
        {trailingIcon}
      </View>
      {error ? (
        <Text style={{ color: '#EF4444', fontSize: 12, marginTop: 6, fontWeight: '500' }}>{error}</Text>
      ) : null}
    </View>
  );
});
