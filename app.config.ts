import type { ExpoConfig } from 'expo/config';

/**
 * Matchoo - Noms de chats.
 * Variante de Matchoo - Noms de chiens (mêmes données, design lavande), avec son propre identifiant.
 */
const ID = 'fr.linradigital.matchoo.chats';

/**
 * AdMob (compte de Julien, blocs de cette appli). ID d'application (~) = manifeste ; ID de bloc d'annonces (/) = pub interstitielle.
 * En développement (__DEV__), src/lib/pubs.ts utilise toujours les pubs de test de Google, jamais ces blocs.
 */
const ADMOB = {
  androidAppId: 'ca-app-pub-8758882513712192~8731255220',
  iosAppId: 'ca-app-pub-8758882513712192~5996535818',
  interstitielAndroid: 'ca-app-pub-8758882513712192/3311407585',
  interstitielIos: 'ca-app-pub-8758882513712192/2165846879',
};

const config: ExpoConfig = {
  name: 'Matchoo - Noms de chats',
  slug: 'matchoo-noms-chats',
  owner: 'linra-digital',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'matchoo-chats',
  userInterfaceStyle: 'light',
  ios: {
    bundleIdentifier: ID,
    supportsTablet: false,
  },
  android: {
    adaptiveIcon: {
      backgroundColor: '#7B5CD6',
      foregroundImage: './assets/images/android-icon-foreground.png',
      backgroundImage: './assets/images/android-icon-background.png',
    },
    predictiveBackGestureEnabled: false,
    package: ID,
  },
  web: {
    output: 'single',
    favicon: './assets/images/favicon.png',
  },
  plugins: [
    'expo-router',
    [
      'expo-splash-screen',
      {
        backgroundColor: '#F4F0FF',
        image: './assets/images/splash-icon.png',
        imageWidth: 200,
      },
    ],
    'expo-sqlite',
    [
      'expo-build-properties',
      { android: { enableMinifyInReleaseBuilds: true, enableShrinkResourcesInReleaseBuilds: true } },
    ],
    [
      'react-native-google-mobile-ads',
      {
        androidAppId: ADMOB.androidAppId,
        iosAppId: ADMOB.iosAppId,
        userTrackingUsageDescription:
          'Cet identifiant sert à afficher des publicités plus pertinentes. Vous pouvez refuser.',
      },
    ],
    [
      'expo-camera',
      {
        cameraPermission: 'Matchoo utilise la caméra uniquement pour lire le QR code de votre partenaire.',
        recordAudioAndroid: false,
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
  extra: {
    admob: {
      interstitielAndroid: ADMOB.interstitielAndroid,
      interstitielIos: ADMOB.interstitielIos,
    },
    eas: { projectId: 'a06719b4-d0d5-47bc-8b95-497bbe497f86' },
  },
};

export default config;
