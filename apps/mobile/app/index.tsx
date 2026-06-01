// Entry — gates auth: bounce to (auth)/welcome if no token, else (tabs)/today.

import { useEffect, useState } from 'react';
import { Redirect } from 'expo-router';
import { Text, View } from 'react-native';
import { getAccessToken } from '../src/lib/api';

export default function Index() {
  const [authed, setAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      const tok = await getAccessToken();
      setAuthed(!!tok);
    })();
  }, []);

  if (authed === null) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0F1115' }}>
        <View style={{ width: 64, height: 64, borderRadius: 16, backgroundColor: '#14B8A6', alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: '#042F2A', fontSize: 24, fontWeight: '800' }}>LF</Text>
        </View>
      </View>
    );
  }

  return <Redirect href={authed ? '/(tabs)/today' : '/(auth)/welcome'} />;
}
