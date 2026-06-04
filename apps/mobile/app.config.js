// Dynamic Expo config. Reads APP_ENV from process env to decide preview vs production identity.
// Two distinct app installs possible side-by-side (preview + production) via different package names.

require('dotenv').config({ path: process.env.APP_ENV === 'production' ? '.env.prod' : '.env.dev' });

module.exports = ({ config }) => {
  const env = process.env.APP_ENV || 'production';
  const isPreview = env === 'preview';

  return {
    ...config,
    name: isPreview ? 'LiftTrack (Preview)' : 'LiftTrack',
    slug: isPreview ? 'lifttrack-preview' : 'lifttrack',
    version: '1.0.0',
    runtimeVersion: '1.0.0',
    orientation: 'portrait',
    scheme: 'lifttrack',
    userInterfaceStyle: 'dark',
    newArchEnabled: true,
    icon: './assets/images/icon.png',
    splash: {
      image: './assets/images/splash-icon.png',
      resizeMode: 'contain',
      backgroundColor: '#0F1115',
    },
    updates: {
      url: `${process.env.OTA_SERVER_URL || 'https://ota-server.yashguptadeveloper.workers.dev'}/liftfuel/${env}/manifest`,
      checkAutomatically: 'NEVER',
      codeSigningCertificate: './certs/certificate.pem',
      codeSigningMetadata: {
        keyid: 'main',
        alg: 'rsa-v1_5-sha256',
      },
      enabled: true,
    },
    ios: {
      supportsTablet: false,
      bundleIdentifier: isPreview
        ? 'com.getsetmvp.lifttrack.preview'
        : 'com.getsetmvp.lifttrack',
    },
    android: {
      package: isPreview
        ? 'com.getsetmvp.lifttrack.preview'
        : 'com.getsetmvp.lifttrack',
      adaptiveIcon: {
        foregroundImage: './assets/images/adaptive-icon.png',
        backgroundColor: '#0F1115',
      },
      edgeToEdgeEnabled: true,
      permissions: [
        'android.permission.CAMERA',
        'android.permission.READ_EXTERNAL_STORAGE',
        'android.permission.WRITE_EXTERNAL_STORAGE',
        'android.permission.POST_NOTIFICATIONS',
        'android.permission.VIBRATE',
      ],
    },
    plugins: [
      'expo-router',
      'expo-secure-store',
      'expo-font',
      [
        'expo-camera',
        {
          cameraPermission: 'Allow LiftTrack to use the camera to capture meal photos for macro analysis.',
        },
      ],
      [
        'expo-image-picker',
        {
          photosPermission: 'Allow LiftTrack to read photos from your library to import meals.',
        },
      ],
      [
        'expo-notifications',
        {
          icon: './assets/images/icon.png',
          color: '#14B8A6',
        },
      ],
      [
        'expo-splash-screen',
        {
          image: './assets/images/splash-icon.png',
          imageWidth: 200,
          resizeMode: 'contain',
          backgroundColor: '#0F1115',
        },
      ],
      './plugins/with-remove-system-alert-window',
    ],
    experiments: {
      typedRoutes: false,
    },
    extra: {
      ...(config?.extra ?? {}),
      env,
      apiUrl: process.env.EXPO_PUBLIC_API_URL || 'https://server.getsetmvp.com',
      tenant: 'liftfuel',
      sentryDsn: process.env.EXPO_PUBLIC_SENTRY_DSN || '',
    },
    owner: 'yashguptadeveloper',
  };
};
