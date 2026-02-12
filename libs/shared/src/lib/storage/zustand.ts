import { createJSONStorage } from 'zustand/middleware';
import { JsonMMKVStorage, JsonSecureStore } from './json';
import { isWeb } from '../utils/device';

export function createZustandStorage<T>(params?: { secure?: boolean }) {
  return createJSONStorage<T>(() =>
    !params?.secure || isWeb ? JsonMMKVStorage : JsonSecureStore,
  );
}
