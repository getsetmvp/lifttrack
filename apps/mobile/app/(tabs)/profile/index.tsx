// Profile — design.md § 8.17.

import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ChevronRight, Download, LogOut, Pencil, Settings } from 'lucide-react-native';
import { Avatar, Button, Card, Chip, IconButton } from '../../../src/components/ui';
import { useMe, useSignOut } from '../../../src/api/auth';

export default function Profile() {
  const me = useMe();
  const signOut = useSignOut();

  const u = me.data;
  const goalLabel: Record<string, string> = {
    MUSCLE: 'Muscle',
    FAT: 'Cut',
    MAINTAIN: 'Maintain',
    STRENGTH: 'Strength',
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0F1115' }} edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 100, gap: 16 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ color: '#F1F5F9', fontSize: 24, fontWeight: '700' }}>Profile</Text>
          <IconButton icon={<Settings color="#F1F5F9" size={20} />} accessibilityLabel="Settings" onPress={() => router.push('/(tabs)/profile/settings')} />
        </View>

        <Card>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <Avatar name={u?.name ?? '?'} size={64} />
            <View style={{ flex: 1 }}>
              <Text style={{ color: '#F1F5F9', fontSize: 18, fontWeight: '700' }}>{u?.name ?? '—'}</Text>
              <Text style={{ color: '#94A3B8', fontSize: 12 }}>{u?.email ?? '—'}</Text>
              <Text style={{ color: '#64748B', fontFamily: 'JetBrainsMono_500Medium', fontSize: 10, marginTop: 2 }}>
                Member since {u?.createdAt ? new Date(u.createdAt).toLocaleDateString('en', { month: 'short', year: 'numeric' }) : '—'}
              </Text>
            </View>
            <IconButton icon={<Pencil color="#94A3B8" size={16} />} accessibilityLabel="Edit" size={36} />
          </View>
        </Card>

        <Section title="Body">
          <Row label="Height" value={u?.heightCm ? `${u.heightCm} cm` : '—'} onPress={() => router.push('/(tabs)/profile/settings')} />
          <Row label="Weight" value="—" onPress={() => router.push('/(tabs)/profile/body-metrics')} />
          <Row label="Body fat" value={u?.bodyFatPct ? `${u.bodyFatPct}%` : '—'} onPress={() => router.push('/(tabs)/profile/body-metrics')} />
          <Row
            label="Goal"
            value={goalLabel[u?.goal ?? 'MUSCLE']!}
            onPress={() => router.push('/(tabs)/profile/settings')}
            chipTone="teal"
          />
        </Section>

        <Section title="Preferences">
          <Row label="Unit" value={u?.unit === 'LB' ? 'lb' : 'kg'} onPress={() => router.push('/(tabs)/profile/settings')} />
          <Row label="Increment" value={u?.increment ? `${u.increment} kg` : '0.25 kg'} onPress={() => router.push('/(tabs)/profile/settings')} />
          <Row label="Macro targets" value={u?.macroOverride ? 'Custom' : 'Auto'} onPress={() => router.push('/(tabs)/profile/settings')} />
        </Section>

        <Section title="Data">
          <Row label="Export CSV" trailing={<Download color="#94A3B8" size={16} />} />
          <Row label="Delete account" valueTone="bad" />
        </Section>

        <Card>
          <Pressable onPress={() => router.push('/(tabs)/profile/about')}>
            <Text style={{ color: '#94A3B8', fontSize: 13, textAlign: 'center' }}>About LiftFuel</Text>
          </Pressable>
        </Card>

        <Button
          label="Sign out"
          variant="ghost"
          fullWidth
          leadingIcon={<LogOut color="#F1F5F9" size={16} />}
          onPress={() => signOut.mutate(undefined, { onSuccess: () => router.replace('/(auth)/welcome') })}
          loading={signOut.isPending}
        />
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

function Row({
  label,
  value,
  onPress,
  trailing,
  chipTone,
  valueTone,
}: {
  label: string;
  value?: string;
  onPress?: () => void;
  trailing?: React.ReactNode;
  chipTone?: 'teal' | 'orange';
  valueTone?: 'bad';
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        opacity: pressed ? 0.7 : 1,
      })}
    >
      <Text style={{ flex: 1, color: valueTone === 'bad' ? '#EF4444' : '#F1F5F9', fontSize: 14, fontWeight: '600' }}>
        {label}
      </Text>
      {value ? (
        chipTone ? (
          <Chip label={value} tone={chipTone} />
        ) : (
          <Text style={{ color: '#94A3B8', fontFamily: 'JetBrainsMono_500Medium', fontSize: 13 }}>{value}</Text>
        )
      ) : null}
      {trailing ?? <ChevronRight color="#64748B" size={16} style={{ marginLeft: 8 }} />}
    </Pressable>
  );
}
