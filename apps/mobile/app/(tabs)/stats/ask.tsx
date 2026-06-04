// AI chat — design.md § 8.16.

import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { RotateCcw, Send, Sparkles, X } from 'lucide-react-native';
import { Card, IconButton } from '../../../src/components/ui';
import { useAsk } from '../../../src/api/ai';
import { safeBack } from '../../../src/lib/safeBack';

interface Msg { role: 'user' | 'ai'; text: string }

export default function AskChat() {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [draft, setDraft] = useState('');
  const ask = useAsk();

  const submit = async () => {
    const q = draft.trim();
    if (!q || ask.isPending) return;
    setDraft('');
    setMsgs((m) => [...m, { role: 'user', text: q }]);
    try {
      const r = await ask.mutateAsync(q);
      setMsgs((m) => [...m, { role: 'ai', text: r.answerMd }]);
    } catch (e: any) {
      setMsgs((m) => [...m, { role: 'ai', text: '⚠ AI gateway error. Try again later.' }]);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0F1115' }} edges={['top']}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 12 }}>
        <IconButton icon={<X color="#F1F5F9" size={20} />} accessibilityLabel="Close" variant="ghost" onPress={() => safeBack('/(tabs)/stats')} />
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Sparkles color="#14B8A6" size={16} />
          <Text style={{ color: '#F1F5F9', fontSize: 17, fontWeight: '700' }}>Ask LiftTrack</Text>
        </View>
        <IconButton icon={<RotateCcw color="#F1F5F9" size={18} />} accessibilityLabel="Reset" variant="ghost" onPress={() => setMsgs([])} />
      </View>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ padding: 20, gap: 12, paddingBottom: 20 }}>
          {msgs.length === 0 ? (
            <Card>
              <Text style={{ color: '#94A3B8', fontSize: 13, textAlign: 'center', padding: 12 }}>
                Ask anything about your data — "why did bench dip last week?", "what's my best lift?", "protein avg vs target?"
              </Text>
            </Card>
          ) : null}
          {msgs.map((m, i) => (
            <View key={i} style={{ flexDirection: 'row', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
              <View
                style={{
                  maxWidth: '85%',
                  padding: 12,
                  borderRadius: 16,
                  borderBottomRightRadius: m.role === 'user' ? 6 : 16,
                  borderBottomLeftRadius: m.role === 'ai' ? 6 : 16,
                  backgroundColor: m.role === 'user' ? '#14B8A6' : '#181B22',
                  borderWidth: m.role === 'ai' ? 1 : 0,
                  borderColor: '#2A2F3A',
                }}
              >
                <Text style={{ color: m.role === 'user' ? '#042F2A' : '#F1F5F9', fontSize: 14, lineHeight: 20 }}>{m.text}</Text>
              </View>
            </View>
          ))}
          {ask.isPending ? (
            <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
              <View style={{ padding: 12, borderRadius: 16, borderBottomLeftRadius: 6, backgroundColor: '#181B22', borderWidth: 1, borderColor: '#2A2F3A' }}>
                <Text style={{ color: '#94A3B8', fontSize: 13 }}>thinking…</Text>
              </View>
            </View>
          ) : null}
        </ScrollView>

        <View style={{ paddingHorizontal: 20, paddingBottom: 20 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, padding: 6, backgroundColor: '#181B22', borderWidth: 1, borderColor: '#2A2F3A', borderRadius: 14 }}>
            <TextInput
              value={draft}
              onChangeText={setDraft}
              onSubmitEditing={submit}
              placeholder="Ask about your data…"
              placeholderTextColor="#64748B"
              style={{ flex: 1, color: '#F1F5F9', fontSize: 14, paddingHorizontal: 12, paddingVertical: 8 }}
              returnKeyType="send"
            />
            <Pressable
              onPress={submit}
              disabled={!draft.trim() || ask.isPending}
              style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: '#14B8A6', alignItems: 'center', justifyContent: 'center', opacity: !draft.trim() || ask.isPending ? 0.5 : 1 }}
            >
              <Send color="#042F2A" size={16} />
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
