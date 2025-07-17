import { Platform } from 'react-native';
import { AccountAuthTokens } from '../types/account-auth';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { JsonSecureStore } from '@symbiot-core-apps/shared';

export type OnboardingState = {
  tokens: AccountAuthTokens;
  setTokens: (tokens: AccountAuthTokens) => void;
  removeTokens: () => void;
};

export const authTokenHeaderKey = {
  access: 'X-Authorization',
  refresh: 'X-Refresh-Token',
}

export const useAuthTokens = create<OnboardingState>()(
  persist<OnboardingState>(
    (set) => ({
      tokens: {
        access: '',
        refresh: '',
      },
      setTokens: (tokens) => {
        set({ tokens });
      },
      removeTokens: () => {
        set({
          tokens: {
            access: '',
            refresh: '',
          },
        });
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
