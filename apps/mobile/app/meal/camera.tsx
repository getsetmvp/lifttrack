// Meal camera — design.md § 8 screen 28. Snap, AI-parse, attach to meal.

import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { Camera, Image as ImageIcon, RefreshCw, X, Zap, ZapOff } from 'lucide-react-native';
import type { MealSlot } from '@liftfuel/shared-types';
import { Button, IconButton } from '../../src/components/ui';
import { useCreateMeal } from '../../src/api/meals';
import { useParseMeal } from '../../src/api/ai';

type Phase = 'CAPTURE' | 'PREVIEW' | 'ANALYZING';

const SLOTS: MealSlot[] = ['BREAKFAST', 'PRE_LUNCH', 'LUNCH', 'SNACK', 'PRE_WORKOUT', 'POST_WORKOUT', 'DINNER'];
const isMealSlot = (v: unknown): v is MealSlot => typeof v === 'string' && (SLOTS as string[]).includes(v);

export default function MealCamera() {
  const { slot, mealId } = useLocalSearchParams<{ slot?: string; mealId?: string }>();
  const initialSlot: MealSlot = isMealSlot(slot) ? slot : 'LUNCH';
  const [perm, requestPerm] = useCameraPermissions();
  const camRef = useRef<CameraView | null>(null);
  const [phase, setPhase] = useState<Phase>('CAPTURE');
  const [preview, setPreview] = useState<{ uri: string; base64: string } | null>(null);
  const [flash, setFlash] = useState<'off' | 'on'>('off');
  const [facing, setFacing] = useState<'back' | 'front'>('back');
  const createMeal = useCreateMeal();
  const parseMeal = useParseMeal();

  useEffect(() => {
    if (perm && !perm.granted && perm.canAskAgain) {
      requestPerm();
    }
  }, [perm, requestPerm]);

  const today = new Date().toISOString().slice(0, 10);

  // Resize + recompress before upload. The AskChimps vision gateway rejects
  // payloads above ~50KB base64 with HTTP 500. 640px max edge + JPEG 0.45
  // yields ~25-40KB base64 — fits the budget and still gives the model enough
  // detail to identify food items.
  const shrink = async (uri: string): Promise<{ uri: string; base64: string }> => {
    const out = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 640 } }],
      { compress: 0.45, format: ImageManipulator.SaveFormat.JPEG, base64: true },
    );
    return { uri: out.uri, base64: out.base64 ?? '' };
  };

  const onCapture = async () => {
    if (!camRef.current) return;
    try {
      const pic = await camRef.current.takePictureAsync({ quality: 0.7, exif: false });
      if (!pic?.uri) {
        Alert.alert('Capture failed', 'No image data returned.');
        return;
      }
      const small = await shrink(pic.uri);
      if (!small.base64) {
        Alert.alert('Capture failed', 'Could not encode photo.');
        return;
      }
      setPreview(small);
      setPhase('PREVIEW');
    } catch (e: any) {
      Alert.alert('Capture failed', e?.message ?? 'Unknown error');
    }
  };

  const onPickFromGallery = async () => {
    try {
      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.9,
        allowsEditing: false,
      });
      if (res.canceled || !res.assets?.[0]?.uri) return;
      const small = await shrink(res.assets[0].uri);
      if (!small.base64) {
        Alert.alert('Gallery error', 'Could not encode photo.');
        return;
      }
      setPreview(small);
      setPhase('PREVIEW');
    } catch (e: any) {
      Alert.alert('Gallery error', e?.message ?? 'Unknown error');
    }
  };

  const onAnalyze = async () => {
    if (!preview) return;
    setPhase('ANALYZING');
    try {
      let targetMealId = typeof mealId === 'string' ? mealId : undefined;
      if (!targetMealId) {
        const m = await createMeal.mutateAsync({ date: today, slot: initialSlot });
        targetMealId = m.id;
      }
      await parseMeal.mutateAsync({ mealId: targetMealId, base64: preview.base64, mime: 'image/jpeg' });
      router.replace(`/meal/${targetMealId}` as any);
    } catch (e: any) {
      Alert.alert('Analysis failed', e?.message ?? 'Could not parse meal. Try again or edit manually.');
      setPhase('PREVIEW');
    }
  };

  if (!perm) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#0F1115', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color="#14B8A6" />
      </SafeAreaView>
    );
  }

  if (!perm.granted) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#0F1115' }} edges={['top', 'bottom']}>
        <View style={{ padding: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <IconButton icon={<X color="#F1F5F9" size={20} />} accessibilityLabel="Close" variant="ghost" onPress={() => router.back()} />
          <Text style={{ color: '#F1F5F9', fontSize: 16, fontWeight: '700' }}>Snap meal</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={{ flex: 1, padding: 20, justifyContent: 'center', gap: 12 }}>
          <View style={{ width: 64, height: 64, borderRadius: 18, backgroundColor: 'rgba(20,184,166,0.15)', alignItems: 'center', justifyContent: 'center', alignSelf: 'center' }}>
            <Camera color="#14B8A6" size={28} />
          </View>
          <Text style={{ color: '#F1F5F9', fontSize: 18, fontWeight: '700', textAlign: 'center' }}>Camera permission needed</Text>
          <Text style={{ color: '#94A3B8', fontSize: 13, textAlign: 'center', lineHeight: 20 }}>
            LiftFuel needs camera access to analyze meal photos. You can also pick an existing photo from your library.
          </Text>
          <Button label="Grant camera access" variant="primary-teal" fullWidth onPress={() => requestPerm()} />
          <Button label="Pick from gallery instead" variant="secondary" fullWidth onPress={onPickFromGallery} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }} edges={['top', 'bottom']}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 }}>
        <IconButton icon={<X color="#F1F5F9" size={20} />} accessibilityLabel="Close" variant="ghost" onPress={() => router.back()} />
        <Text style={{ color: '#F1F5F9', fontSize: 14, fontWeight: '700' }}>
          {phase === 'ANALYZING' ? 'Analyzing…' : phase === 'PREVIEW' ? 'Review' : `Snap meal · ${initialSlot.replace('_', ' ')}`}
        </Text>
        <IconButton
          icon={flash === 'on' ? <Zap color="#F1F5F9" size={18} /> : <ZapOff color="#94A3B8" size={18} />}
          accessibilityLabel="Toggle flash"
          variant="ghost"
          onPress={() => setFlash((f) => (f === 'on' ? 'off' : 'on'))}
        />
      </View>

      <View style={{ flex: 1, marginHorizontal: 16, borderRadius: 22, overflow: 'hidden', backgroundColor: '#0F1115' }}>
        {phase === 'CAPTURE' ? (
          <CameraView
            ref={(r) => {
              camRef.current = r;
            }}
            style={{ flex: 1 }}
            facing={facing}
            enableTorch={flash === 'on'}
          />
        ) : preview ? (
          <View style={{ flex: 1 }}>
            {/* eslint-disable-next-line @typescript-eslint/no-var-requires */}
            <PreviewImage uri={preview.uri} />
            {phase === 'ANALYZING' ? (
              <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <ActivityIndicator color="#14B8A6" />
                <Text style={{ color: '#F1F5F9', fontSize: 13, fontWeight: '600' }}>AI is parsing your meal…</Text>
              </View>
            ) : null}
          </View>
        ) : null}
      </View>

      <View style={{ padding: 20, gap: 12 }}>
        {phase === 'CAPTURE' ? (
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <IconButton
              icon={<ImageIcon color="#F1F5F9" size={20} />}
              accessibilityLabel="Gallery"
              variant="card"
              size={48}
              onPress={onPickFromGallery}
            />
            <Pressable
              onPress={onCapture}
              style={{ width: 78, height: 78, borderRadius: 39, backgroundColor: '#F97316', alignItems: 'center', justifyContent: 'center', borderWidth: 4, borderColor: 'rgba(255,255,255,0.18)' }}
            >
              <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: '#F97316' }} />
            </Pressable>
            <IconButton
              icon={<RefreshCw color="#F1F5F9" size={20} />}
              accessibilityLabel="Flip camera"
              variant="card"
              size={48}
              onPress={() => setFacing((f) => (f === 'back' ? 'front' : 'back'))}
            />
          </View>
        ) : (
          <View style={{ gap: 8 }}>
            <Button
              label={phase === 'ANALYZING' ? 'Analyzing…' : 'Analyze with AI'}
              variant="primary-orange"
              fullWidth
              loading={phase === 'ANALYZING'}
              onPress={onAnalyze}
            />
            <Button
              label="Retake"
              variant="ghost"
              fullWidth
              onPress={() => {
                setPreview(null);
                setPhase('CAPTURE');
              }}
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

function PreviewImage({ uri }: { uri: string }) {
  // Lazy require to avoid pulling Image into the camera bundle if unused.
  const { Image } = require('react-native');
  return <Image source={{ uri }} style={{ flex: 1 }} resizeMode="cover" />;
}
