// Card atom — Soft-Dark Modern depth via border + 1px highlight, no shadows.
// Use accent prop to bind a card to teal/orange identity (lift vs fuel).

import { Pressable, View } from 'react-native';
import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  padding?: number;
  accent?: 'teal' | 'orange';
  onPress?: () => void;
  testID?: string;
  style?: any;
}

export function Card({ children, padding = 16, accent, onPress, testID, style }: Props) {
  const borderColor =
    accent === 'teal' ? '#14B8A6' :
    accent === 'orange' ? '#F97316' :
    '#2A2F3A';
  const inner = (
    <View style={{ padding, ...(style ?? {}) }}>
      {/* 1px top highlight = signature of Soft-Dark Modern */}
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 1,
          backgroundColor: 'rgba(255,255,255,0.04)',
        }}
      />
      {children}
    </View>
  );

  const wrapStyle: any = {
    backgroundColor: '#181B22',
    borderRadius: 14,
    borderWidth: 1,
    borderColor,
    overflow: 'hidden',
  };

  if (onPress) {
    return (
      <Pressable
        testID={testID}
        onPress={onPress}
        style={({ pressed }) => [wrapStyle, { opacity: pressed ? 0.85 : 1 }]}
      >
        {inner}
      </Pressable>
    );
  }
  return (
    <View testID={testID} style={wrapStyle}>
      {inner}
    </View>
  );
}
