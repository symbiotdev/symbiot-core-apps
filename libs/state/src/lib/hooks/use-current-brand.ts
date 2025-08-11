import {
  AccountAuthTokens,
  Brand,
  BrandQueryKey,
  NotificationQueryKey,
  queryClient,
  useAuthTokens,
} from '@symbiot-core-apps/api';
import { create } from 'zustand/index';
import { devtools, persist } from 'zustand/middleware';
import { createZustandStorage } from '@symbiot-core-apps/storage';
import { useCallback } from 'react';
import { useAccountNotificationsState } from './use-account-notifications.state';

type CurrentBrandState = {
  brand?: Brand;
  brands?: Brand[];
  clear: () => void;
  setBrand: (brand?: Brand) => void;
  setBrands: (brands: Brand[]) => void;
};

export const useCurrentBrandState = create<CurrentBrandState>()(
  devtools(
    persist<CurrentBrandState>(
      (set) => ({
        clear: () => {
          set({
            brand: undefined,
            brands: undefined,
          });
        },
        setBrand: (brand) => set({ brand }),
        setBrands: (brands) => set({ brands }),
      }),
      {
        name: 'symbiot-current-brand',
        storage: createZustandStorage(),
      },
    ),
  ),
);

export const useCurrentBrandSwitcher = () => {
  const { clear: clearNotifications } = useAccountNotificationsState();
  const { setTokens } = useAuthTokens();

  return useCallback(
    async (tokens: AccountAuthTokens) => {
      setTokens(tokens);
      clearNotifications();

      await new Promise<void>((resolve) => {
        setTimeout(async () => {
          try {
            await Promise.all([
              queryClient.refetchQueries({
                queryKey: [BrandQueryKey.current],
              }),
              queryClient.refetchQueries({
                queryKey: [NotificationQueryKey.countNew],
              }),
              queryClient.resetQueries({
                queryKey: [NotificationQueryKey.getList],
              }),
            ]);
          } finally {
            resolve();
          }
        }, 500);
      });

      return;
    },
    [clearNotifications, setTokens],
  );
};
