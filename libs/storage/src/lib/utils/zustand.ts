import { createJSONStorage } from 'zustand/middleware';
import { Platform } from 'react-native';
import { JsonMMKVStorage, JsonSecureStore } from './json';

export function createZustandStorage<T>(params?: { secure?: boolean }) {
  return createJSONStorage<T>(() =>
    !params?.secure || Platform.OS === 'web'
      ? JsonMMKVStorage
      : JsonSecureStore,
  );
}
