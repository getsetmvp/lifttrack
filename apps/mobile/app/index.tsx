// Placeholder home — replaced by Phase 5 Agent B (Today screen 08).
// Phase 3 boilerplate only; renders centered brand mark + status.

import { View, Text } from 'react-native';

export default function Index() {
  return (
    <View className="flex-1 items-center justify-center bg-canvas-dark px-8">
      <View className="w-20 h-20 rounded-3xl bg-teal items-center justify-center mb-5">
        <Text className="text-3xl font-bold" style={{ color: '#042F2A' }}>LF</Text>
      </View>
      <Text className="text-3xl font-bold text-tx-hi tracking-tight">LiftFuel</Text>
      <Text className="text-sm text-tx-mid mt-1">Train smart. Eat smarter.</Text>
      <Text className="text-xs text-tx-lo mt-6 font-mono">Phase 3 scaffold · features land in Phase 5</Text>
    </View>
  );
}
