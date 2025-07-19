import { Platform } from 'react-native';
import { AccountAuthTokens } from '../types/account-auth';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { JsonSecureStore } from '@symbiot-core-apps/shared';

export type OnboardingState = {
  tokens: AccountAuthTokens;
  setTokens: (tokens: AccountAuthTokens) => Promise<void>;
  removeTokens: () => Promise<void>;
};

export const authTokenHeaderKey = {
  access: 'X-Authorization',
  refresh: 'X-Refresh-Token',
};

export const useAuthTokens = create<OnboardingState>()(
  persist<OnboardingState>(
    (set) => ({
      tokens: {
        access: '',
        refresh: '',
      },
      setTokens: async (tokens) => {
        set({ tokens });

        return Promise.resolve();
      },
      removeTokens: async () => {
        set({
          tokens: {
            access: '',
            refresh: '',
          },
        });

        return Promise.resolve();
      },
    }),
    {
      name: 'x-tokens',
      storage: createJSONStorage(() =>
        Platform.OS === 'web' ? AsyncStorage : JsonSecureStore
      ),
    }
  )
);
