import { StateStorage } from 'zustand/middleware/persist';
import * as SecureStore from 'expo-secure-store';
import { mmkvGlobalStorage } from './global';

export const JsonMMKVStorage: StateStorage = {
  setItem: (name, value) => {
    return mmkvGlobalStorage.set(name, value);
  },
  getItem: (name) => {
    const value = mmkvGlobalStorage.getString(name);
    return value ?? null;
  },
  removeItem: (name) => {
    return mmkvGlobalStorage.delete(name);
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
