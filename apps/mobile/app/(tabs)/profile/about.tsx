// About — design.md § 8 screen 40.

import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, Dumbbell, ExternalLink } from 'lucide-react-native';
import { Card, IconButton } from '../../../src/components/ui';
import Constants from 'expo-constants';
import { safeBack } from '../../../src/lib/safeBack';

export default function About() {
  const ver = (Constants.expoConfig as any)?.version ?? '1.0.0';
  const env = (Constants.expoConfig?.extra as any)?.env ?? 'production';

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0F1115' }} edges={['top']}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 20, paddingVertical: 12 }}>
        <IconButton icon={<ArrowLeft color="#F1F5F9" size={20} />} accessibilityLabel="Back" variant="ghost" onPress={() => safeBack('/(tabs)/profile')} />
        <Text style={{ color: '#F1F5F9', fontSize: 22, fontWeight: '700' }}>About</Text>
      </View>
      <ScrollView contentContainerStyle={{ padding: 20, gap: 16 }}>
        <Card>
          <View style={{ alignItems: 'center', paddingVertical: 12 }}>
            <View style={{ width: 64, height: 64, borderRadius: 18, backgroundColor: '#14B8A6', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
              <Dumbbell color="#042F2A" size={32} />
            </View>
            <Text style={{ color: '#F1F5F9', fontSize: 24, fontWeight: '700', letterSpacing: -0.3 }}>LiftFuel</Text>
            <Text style={{ color: '#94A3B8', fontSize: 13, marginTop: 4 }}>Train smart. Eat smarter.</Text>
            <Text style={{ color: '#64748B', fontFamily: 'JetBrainsMono_500Medium', fontSize: 10, marginTop: 8 }}>
              v{ver} · {env}
            </Text>
          </View>
        </Card>

        <Section title="System">
          <Row label="Backend" value="server.getsetmvp.com" />
          <Row label="Tenant" value="liftfuel · v1" />
          <Row label="OTA" value="cloudflare · prod" />
        </Section>

        <Section title="Links">
          <Link label="Changelog" />
          <Link label="Report a bug" />
          <Link label="Open source licenses" />
        </Section>

        <Text style={{ color: '#64748B', fontFamily: 'JetBrainsMono_500Medium', fontSize: 10, textAlign: 'center' }}>
          © 2026 Yash Gupta · Made in India
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View>
      <Text style={{ color: '#94A3B8', fontSize: 11, fontWeight: '700', letterSpacing: 0.08, textTransform: 'uppercase', marginBottom: 8 }}>
        {title}
      </Text>
      <Card padding={0}>{children}</Card>
    </View>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', padding: 12 }}>
      <Text style={{ flex: 1, color: '#F1F5F9', fontSize: 14 }}>{label}</Text>
      <Text style={{ color: '#94A3B8', fontFamily: 'JetBrainsMono_500Medium', fontSize: 11 }}>{value}</Text>
    </View>
  );
}

function Link({ label }: { label: string }) {
  return (
    <Pressable style={{ flexDirection: 'row', alignItems: 'center', padding: 12 }}>
      <Text style={{ flex: 1, color: '#F1F5F9', fontSize: 14, fontWeight: '600' }}>{label}</Text>
      <ExternalLink color="#64748B" size={16} />
    </Pressable>
  );
}
