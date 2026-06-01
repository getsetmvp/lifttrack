// Login screen — design.md § 8 screen 03.

import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, SafeAreaView, ScrollView, Text, View } from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, Dumbbell, Eye, EyeOff } from 'lucide-react-native';
import { Button, ErrorBanner, IconButton, Input } from '../../src/components/ui';
import { useSignIn } from '../../src/api/auth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const signIn = useSignIn();

  const submit = async () => {
    if (!email.trim() || !password) return;
    try {
      await signIn.mutateAsync({ email: email.trim(), password });
      router.replace('/(tabs)/today');
    } catch {
      // surfaced via signIn.isError below
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
            <View style={{ width: 48, height: 48, borderRadius: 16, backgroundColor: '#14B8A6', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
              <Dumbbell color="#042F2A" size={24} />
            </View>
            <Text style={{ color: '#F1F5F9', fontSize: 30, fontWeight: '700', letterSpacing: -0.4 }}>Welcome back</Text>
            <Text style={{ color: '#94A3B8', fontSize: 14, marginTop: 4, marginBottom: 28 }}>Pick up where you left off.</Text>
            <View style={{ gap: 12 }}>
              <Input
                label="Email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                autoComplete="email"
                keyboardType="email-address"
              />
              <Input
                label="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPw}
                autoComplete="password"
                trailingIcon={
                  <Pressable onPress={() => setShowPw((s) => !s)}>
                    {showPw ? <EyeOff color="#94A3B8" size={20} /> : <Eye color="#94A3B8" size={20} />}
                  </Pressable>
                }
              />
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 12 }}>
              <Pressable onPress={() => {}} hitSlop={8}>
                <Text style={{ color: '#14B8A6', fontSize: 14, fontWeight: '600' }}>Forgot password?</Text>
              </Pressable>
            </View>
            {signIn.isError ? <View style={{ marginTop: 16 }}><ErrorBanner message="Invalid email or password." /></View> : null}
          </View>
          <View style={{ padding: 24, paddingBottom: 32 }}>
            <Button label="Sign in" variant="primary-teal" fullWidth onPress={submit} loading={signIn.isPending} />
            <Pressable onPress={() => router.replace('/(auth)/register')} style={{ marginTop: 16, alignItems: 'center' }}>
              <Text style={{ color: '#94A3B8', fontSize: 13 }}>
                No account? <Text style={{ color: '#14B8A6', fontWeight: '700' }}>Create one</Text>
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
