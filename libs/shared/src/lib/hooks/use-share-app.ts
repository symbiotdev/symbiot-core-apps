import { useCallback } from 'react';
import { Linking, Platform } from 'react-native';
import { isAvailableAsync, shareAsync } from 'expo-sharing';

export const STORE_URL: Record<typeof Platform.OS, string> = {
  ios: `https://apps.apple.com/app/apple-store/id${process.env.EXPO_PUBLIC_APPSTORE_ID}`,
  macos: `https://apps.apple.com/app/apple-store/id${process.env.EXPO_PUBLIC_APPSTORE_ID}`,
  android: `https://play.google.com/store/apps/details?id=${process.env.EXPO_PUBLIC_APP_ID}`,
  windows: '',
  web: '',
};

export const PLATFORM_STORE_URL = STORE_URL[Platform.OS];
export const openPlatformStore = () => Linking.openURL(PLATFORM_STORE_URL);

export const useShareApp = () => {
  return useCallback(async () => {
    const isAvailable = await isAvailableAsync();

    if (isAvailable) {
      void shareAsync(PLATFORM_STORE_URL);
    } else {
      void openPlatformStore();
    }
  }, []);
};
