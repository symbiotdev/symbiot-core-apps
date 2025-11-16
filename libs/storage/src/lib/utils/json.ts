import { StateStorage } from 'zustand/middleware/persist';
import * as SecureStore from 'expo-secure-store';
import { mmkvGlobalStorage } from './global';

export const JsonMMKVStorage: StateStorage = {
  getItem: (name) => {
    return mmkvGlobalStorage.getString(name) ?? null;
  },
  setItem: (name, value) => {
    return mmkvGlobalStorage.set(name, value);
  },
  removeItem: (name) => {
    return mmkvGlobalStorage.remove(name);
  },
};

export const JsonSecureStore = {
  getItem: (name: string) => {
    return SecureStore.getItemAsync(name);
  },
  setItem: (name: string, value: string) => {
    return SecureStore.setItemAsync(name, value);
  },
  removeItem: (name: string) => {
    return SecureStore.deleteItemAsync(name);
  },
};
