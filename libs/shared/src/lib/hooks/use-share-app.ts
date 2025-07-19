import { useCallback } from 'react';
import { Linking, Platform } from 'react-native';
import { isAvailableAsync, shareAsync } from 'expo-sharing';

export const IOS_STORE_URL = `https://apps.apple.com/app/apple-store/id${process.env.EXPO_PUBLIC_APPSTORE_ID}`;
export const ANDROID_STORE_URL = `https://play.google.com/store/apps/details?id=${process.env.EXPO_PUBLIC_APP_ID}`;

export const useShareApp = () => {
  return useCallback(async () => {
    const isAvailable = await isAvailableAsync();
    const url = Platform.OS === 'android' ? ANDROID_STORE_URL : IOS_STORE_URL;

    if (isAvailable) {
      void shareAsync(url);
    } else {
      void Linking.openURL(url);
    }
  }, []);
};
