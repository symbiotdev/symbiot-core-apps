import { AccountAuthTokens } from '../types/account-auth';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createZustandStorage } from '@symbiot-core-apps/storage';
import { DateHelper } from '@symbiot-core-apps/shared';

export type OnboardingState = {
  tokens: AccountAuthTokens;
  accessToDate?: Date;
  setTokens: (tokens: AccountAuthTokens) => Promise<void>;
  removeTokens: () => Promise<void>;
};

export const authTokenHeaderKey = {
  access: 'x-authorization',
  refresh: 'x-refresh-token',
};

export const useAuthTokens = create<OnboardingState>()(
  persist<OnboardingState>(
    (set) => ({
      tokens: {
        access: '',
        refresh: '',
      },
      setTokens: async (tokens) => {
        set({
          tokens,
          accessToDate: DateHelper.addMinutes(new Date(), 5),
        });

        return Promise.resolve();
      },
      removeTokens: async () => {
        set({
          accessToDate: undefined,
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
      storage: createZustandStorage({ secure: true }),
    },
  ),
);
