import { create } from 'zustand';
import {
  clearInitialQueryData,
  NotificationQueryKey,
  queryClient,
  useAuthTokens,
  useBrandAuthQuery,
} from '@symbiot-core-apps/api';
import { useCallback } from 'react';
import { useCurrentBrandState } from '@symbiot-core-apps/state';
import { router } from 'expo-router';

type BrandAuthState = {
  processing: boolean;
  setProcessing: (processing: boolean) => void;
};

export const useBrandAuthState = create<BrandAuthState>((set) => ({
  processing: false,
  setProcessing: (processing) => set({ processing }),
}));

export const useAuthBrand = () => {
  const { mutateAsync } = useBrandAuthQuery();
  const { setProcessing } = useBrandAuthState();
  const { setBrand: setCurrentBrand } = useCurrentBrandState();
  const { setTokens } = useAuthTokens();

  return useCallback(
    async ({ id }: { id: string }) => {
      setProcessing(true);

      try {
        const { brand, tokens } = await mutateAsync(id);

        setTokens(tokens);
        setCurrentBrand(brand);
        clearInitialQueryData();

        await new Promise<void>((resolve) => {
          setTimeout(async () => {
            try {
              await Promise.all([
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

        router.replace('/');
      } finally {
        setProcessing(false);
      }
    },
    [mutateAsync, setCurrentBrand, setProcessing, setTokens],
  );
};
