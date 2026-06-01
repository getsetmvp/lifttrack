// Settings — design.md § 8 screen 38.

import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, ExternalLink, Laptop, Moon, RefreshCw, Sun } from 'lucide-react-native';
import { Card, IconButton, Switch } from '../../../src/components/ui';
import { useState } from 'react';
import { safeBack } from '../../../src/lib/safeBack';

// expo-updates is only available in dev-builds / production APK, not in Expo Go.
// Guard import so settings page renders w/o crashing.
const Updates: {
  runtimeVersion?: string | null;
  updateId?: string | null;
  checkForUpdateAsync: () => Promise<unknown>;
} = (() => {
  try {
    return require('expo-updates');
  } catch {
    return { runtimeVersion: null, updateId: null, checkForUpdateAsync: async () => undefined };
  }
})();

export default function SettingsScreen() {
  const [restTimerNotif, setRestTimerNotif] = useState(true);
  const [reduceMotion, setReduceMotion] = useState(false);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0F1115' }} edges={['top']}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 20, paddingVertical: 12 }}>
        <IconButton icon={<ArrowLeft color="#F1F5F9" size={20} />} accessibilityLabel="Back" variant="ghost" onPress={() => safeBack('/(tabs)/profile')} />
        <Text style={{ color: '#F1F5F9', fontSize: 22, fontWeight: '700' }}>Settings</Text>
      </View>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40, gap: 16 }}>
        <Section title="Notifications">
          <SwitchRow
            label="Rest timer alerts"
            sub="Local notification when rest ends"
            value={restTimerNotif}
            onChange={setRestTimerNotif}
          />
          <SwitchRow label="Daily log reminder" sub="v1.1 coming soon" value={false} onChange={() => {}} disabled />
        </Section>

        <Section title="Appearance">
          <View style={{ padding: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text style={{ color: '#F1F5F9', fontSize: 14, fontWeight: '600' }}>Theme</Text>
            <View style={{ flexDirection: 'row', backgroundColor: '#21252E', borderRadius: 10, padding: 2, gap: 2 }}>
              <ThemeBtn icon={<Sun color="#94A3B8" size={16} />} label="Light" />
              <ThemeBtn icon={<Moon color="#042F2A" size={16} />} label="Dark" active />
              <ThemeBtn icon={<Laptop color="#94A3B8" size={16} />} label="Auto" />
            </View>
          </View>
          <Text style={{ color: '#64748B', fontSize: 10, paddingHorizontal: 12, paddingBottom: 12 }}>
            Light + Auto deferred to v1.1. Dark canonical.
          </Text>
          <View style={{ height: 1, backgroundColor: '#2A2F3A' }} />
          <SwitchRow
            label="Reduce motion"
            sub="Disable arc fills + confetti"
            value={reduceMotion}
            onChange={setReduceMotion}
          />
        </Section>

        <Section title="Developer">
          <Row label="OTA channel" value="production" tone="teal" />
          <Row label="Bundle" value={`v${Updates.runtimeVersion ?? '1.0.0'} · ${Updates.updateId?.slice(0, 8) ?? 'embedded'}`} />
          <Row label="Check for update" trailing={<RefreshCw color="#14B8A6" size={16} />} onPress={() => Updates.checkForUpdateAsync().catch(() => {})} />
        </Section>

        <Section title="Privacy">
          <Row label="Privacy policy" trailing={<ExternalLink color="#64748B" size={16} />} />
          <Row label="Terms" trailing={<ExternalLink color="#64748B" size={16} />} />
        </Section>
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

function SwitchRow({ label, sub, value, onChange, disabled }: { label: string; sub?: string; value: boolean; onChange: (v: boolean) => void; disabled?: boolean }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', padding: 12, opacity: disabled ? 0.5 : 1 }}>
      <View style={{ flex: 1 }}>
        <Text style={{ color: '#F1F5F9', fontSize: 14, fontWeight: '600' }}>{label}</Text>
        {sub ? <Text style={{ color: '#94A3B8', fontSize: 11, marginTop: 2 }}>{sub}</Text> : null}
      </View>
      <Switch value={value} onChange={disabled ? () => {} : onChange} />
    </View>
  );
}

function Row({ label, value, trailing, tone, onPress }: { label: string; value?: string; trailing?: React.ReactNode; tone?: 'teal'; onPress?: () => void }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', padding: 12 }}>
      <Text style={{ flex: 1, color: '#F1F5F9', fontSize: 14, fontWeight: '600' }}>{label}</Text>
      {value ? (
        <Text
          style={{
            color: tone === 'teal' ? '#14B8A6' : '#94A3B8',
            fontFamily: 'JetBrainsMono_500Medium',
            fontSize: 12,
            marginRight: trailing ? 8 : 0,
          }}
        >
          {value}
        </Text>
      ) : null}
      {trailing}
    </View>
  );
}

function ThemeBtn({ icon, label, active }: { icon: React.ReactNode; label: string; active?: boolean }) {
  return (
    <View
      style={{
        width: 40,
        height: 30,
        borderRadius: 8,
        backgroundColor: active ? '#14B8A6' : 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {icon}
    </View>
  );
}
