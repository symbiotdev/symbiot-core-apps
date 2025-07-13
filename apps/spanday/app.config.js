export default ({ config }) => {
  const env = process.env.NODE_ENV || 'production';
  const name = env === 'production' ? 'Spanday PRO' : 'Spanday PRO Dev';
  const bundleId =
    env === 'production' ? 'com.spanday.pro' : 'com.spandaydev.pro';

  return {
    ...config,
    newArchEnabled: true,
    name,
    slug: 'spanday-pro',
    scheme: 'spanday-pro',
    version: '2.0.0',
    userInterfaceStyle: 'automatic',
    orientation: 'default',
    icon: './assets/images/icon/adaptive-icon.png',
    assetBundlePatterns: ['**/*'],
    splash: {
      ...config.splash,
      image: './assets/images/icon/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    ios: {
      ...config.ios,
      bundleIdentifier: bundleId,
      buildNumber: '12',
      googleServicesFile: `./google/${env}/GoogleService-Info.plist`,
      supportsTablet: true,
      usesAppleSignIn: true,
      requireFullScreen: true,
      icon: {
        ...config.ios?.icon,
        dark: './assets/images/icon/ios-dark.png',
        light: './assets/images/icon/ios-light.png',
        tinted: './assets/images/icon/ios-tinted.png',
      },
      entitlements: {
        ...config.ios?.entitlements,
        'com.apple.developer.networking.wifi-info': true,
      },
      infoPlist: {
        ...config.ios?.infoPlist,
        ITSAppUsesNonExemptEncryption: false,
      },
    },
    android: {
      ...config.android,
      package: bundleId,
      versionCode: 12,
      icon: './assets/images/icon/ios-light.png',
      adaptiveIcon: {
        ...config.android?.adaptiveIcon,
        foregroundImage: './assets/images/icon/adaptive-icon.png',
        backgroundColor: '#080726',
      },
      googleServicesFile: `./google/${env}/GoogleService-Info.plist`,
      permissions: [
        ...(config.android?.permissions || []),
        'android.permission.CAMERA',
        'android.permission.RECORD_AUDIO',
        'android.permission.READ_EXTERNAL_STORAGE',
        'android.permission.WRITE_EXTERNAL_STORAGE',
      ],
    },
    web: {
      ...config.web,
      favicon: './assets/images/icon/favicon.png',
      bundler: 'metro',
    },
    plugins: [
      ...(config.plugins || []),
      'react-native-legal',
      'expo-localization',
      'expo-apple-authentication',
      '@react-native-firebase/app',
      '@react-native-firebase/auth',
      '@react-native-google-signin/google-signin',
      [
        'expo-screen-orientation',
        {
          initialOrientation: 'DEFAULT',
        },
      ],
      [
        'expo-splash-screen',
        {
          image: './assets/images/icon/splash-icon-dark.png',
          imageWidth: 150,
          resizeMode: 'contain',
          backgroundColor: '#ffffff',
          dark: {
            image: './assets/images/icon/splash-icon-light.png',
            backgroundColor: '#000000',
          },
        },
      ],
      [
        'expo-font',
        {
          fonts: [],
        },
      ],
      [
        'expo-build-properties',
        {
          ios: {
            useFrameworks: 'static',
            infoPlist: {
              LSMinimumSystemVersion: '12.0',
            },
          },
        },
      ],
      [
        'expo-camera',
        {
          cameraPermission:
            'Allow $(PRODUCT_NAME) to access your camera to capture photos and videos for user profiles and content sharing.',
          microphonePermission:
            'Allow $(PRODUCT_NAME) to access your microphone to record audio for video recordings and voice communication features.',
          recordAudioAndroid: true,
        },
      ],
      [
        'expo-image-picker',
        {
          photosPermission:
            'Allow $(PRODUCT_NAME) to access your photos to upload and share images with customers and teammates.',
          cameraPermission:
            'Allow $(PRODUCT_NAME) to access your camera to capture and share photos directly within the app.',
        },
      ],
      [
        'expo-media-library',
        {
          photosPermission:
            'Allow $(PRODUCT_NAME) to access your photos to display and manage your media for sharing or editing within the app.',
          savePhotosPermission:
            'Allow $(PRODUCT_NAME) to save photos to your device after editing or creating new media in the app.',
          isAccessMediaLocationEnabled: true,
        },
      ],
      [
        'expo-video',
        {
          supportsBackgroundPlayback: true,
          supportsPictureInPicture: true,
        },
      ],
    ],
    extra: {
      ...config.extra,
      eas: {
        ...config.extra?.eas,
        projectId: '745568dc-a1a7-4c08-ac3c-ac87cd97a948',
      },
    },
  };
};
