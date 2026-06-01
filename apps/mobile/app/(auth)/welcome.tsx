// Welcome screen — design.md § 8 mockup 02.

import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Button } from '../../src/components/ui';
import { Dumbbell } from 'lucide-react-native';

export default function Welcome() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0F1115' }} edges={['top', 'bottom']}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32, gap: 16 }}>
        <View
          style={{
            width: 96,
            height: 96,
            borderRadius: 24,
            backgroundColor: 'rgba(20,184,166,0.12)',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Dumbbell color="#14B8A6" size={42} />
        </View>
        <Text style={{ color: '#F1F5F9', fontSize: 24, fontWeight: '700', textAlign: 'center' }}>
          Lift more.{'\n'}Eat with intent.
        </Text>
        <Text style={{ color: '#94A3B8', fontSize: 13, textAlign: 'center', maxWidth: 280 }}>
          Log every set. Snap every meal. See what's actually moving your numbers.
        </Text>
      </View>
      <View style={{ paddingHorizontal: 24, paddingBottom: 32, gap: 8 }}>
        <Button label="Create account" variant="primary-teal" fullWidth onPress={() => router.push('/(auth)/register')} />
        <Button label="I already have an account" variant="ghost" fullWidth onPress={() => router.push('/(auth)/login')} />
      </View>
    </SafeAreaView>
  );
}
