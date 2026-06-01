// Register screen — design.md § 8 screen 04.

import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, SafeAreaView, ScrollView, Text, View } from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, Check } from 'lucide-react-native';
import { Button, ErrorBanner, IconButton, Input } from '../../src/components/ui';
import { useSignUp } from '../../src/api/auth';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreed, setAgreed] = useState(true);
  const signUp = useSignUp();

  const strength = passwordStrength(password);

  const submit = async () => {
    if (!name.trim() || !email.trim() || password.length < 8 || !agreed) return;
    try {
      await signUp.mutateAsync({ email: email.trim(), password, name: name.trim() });
      router.replace('/(auth)/onboarding/unit');
    } catch {
      // surfaced below
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0F1115' }}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          <View style={{ paddingHorizontal: 20, paddingTop: 8 }}>
            <IconButton icon={<ArrowLeft color="#F1F5F9" size={20} />} accessibilityLabel="Back" onPress={() => router.back()} variant="ghost" />
          </View>
          <View style={{ flex: 1, paddingHorizontal: 24, paddingTop: 24 }}>
            <Text style={{ color: '#F1F5F9', fontSize: 30, fontWeight: '700', letterSpacing: -0.5 }}>Create account</Text>
            <Text style={{ color: '#94A3B8', fontSize: 14, marginTop: 4, marginBottom: 24 }}>30 seconds. No card needed.</Text>
            <View style={{ gap: 12 }}>
              <Input label="Name" value={name} onChangeText={setName} autoCapitalize="words" />
              <Input
                label="Email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                autoComplete="email"
                keyboardType="email-address"
              />
              <View>
                <Input
                  label="Password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  autoComplete="password-new"
                />
                <View style={{ marginTop: 8, flexDirection: 'row', gap: 4 }}>
                  {[1, 2, 3, 4].map((i) => (
                    <View
                      key={i}
                      style={{
                        flex: 1,
                        height: 4,
                        borderRadius: 2,
                        backgroundColor: i <= strength.score ? strength.color : '#2A2F3A',
                      }}
                    />
                  ))}
                </View>
                <Text style={{ color: strength.color, fontSize: 11, fontWeight: '700', marginTop: 4 }}>
                  {strength.label}
                </Text>
              </View>
            </View>
            <Pressable
              onPress={() => setAgreed((a) => !a)}
              style={{ flexDirection: 'row', gap: 8, marginTop: 20 }}
            >
              <View
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 6,
                  backgroundColor: agreed ? '#14B8A6' : 'transparent',
                  borderWidth: 1.5,
                  borderColor: agreed ? '#14B8A6' : '#475569',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {agreed ? <Check color="#042F2A" size={14} /> : null}
              </View>
              <Text style={{ flex: 1, color: '#94A3B8', fontSize: 12, lineHeight: 18 }}>
                I agree to the <Text style={{ color: '#14B8A6', fontWeight: '700' }}>Terms</Text> and{' '}
                <Text style={{ color: '#14B8A6', fontWeight: '700' }}>Privacy</Text>.
              </Text>
            </Pressable>
            {signUp.isError ? (
              <View style={{ marginTop: 16 }}>
                <ErrorBanner message="Could not create account. Check inputs + try again." />
              </View>
            ) : null}
          </View>
          <View style={{ padding: 24, paddingBottom: 32 }}>
            <Button
              label="Create account"
              variant="primary-teal"
              fullWidth
              onPress={submit}
              loading={signUp.isPending}
              disabled={!name || !email || password.length < 8 || !agreed}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function passwordStrength(p: string): { score: number; label: string; color: string } {
  if (p.length === 0) return { score: 0, label: '', color: '#475569' };
  let score = 0;
  if (p.length >= 8) score++;
  if (/[A-Z]/.test(p) && /[a-z]/.test(p)) score++;
  if (/\d/.test(p)) score++;
  if (/[^A-Za-z0-9]/.test(p) || p.length >= 14) score++;
  const labels = ['Too short', 'Weak', 'OK', 'Strong', 'Strong'];
  const colors = ['#EF4444', '#EF4444', '#F59E0B', '#10B981', '#10B981'];
  return { score, label: labels[score]!, color: colors[score]! };
}
