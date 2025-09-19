import {
  Brand,
  UpdateBrand,
  useCurrentBrandUpdate,
} from '@symbiot-core-apps/api';
import { create } from 'zustand/index';
import { devtools, persist } from 'zustand/middleware';
import { createZustandStorage } from '@symbiot-core-apps/storage';
import { useCallback } from 'react';
import { ImagePickerAsset } from 'expo-image-picker';

type CurrentBrandState = {
  brand?: Brand;
  brands?: Brand[];
  clear: () => void;
  setBrand: (brand?: Brand) => void;
  setBrands: (brands?: Brand[]) => void;
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

export const useCurrentBrandUpdater = () => {
  const { brand, setBrand } = useCurrentBrandState();
  const {
    mutateAsync: updateBrand,
    isPending: isBrandUpdating,
    error: updateBrandError,
  } = useCurrentBrandUpdate();
  const {
    mutateAsync: updateAvatar,
    isPending: isAvatarUpdating,
    error: updateAvatarError,
  } = useCurrentBrandUpdate();

  const updateBrand$ = useCallback(
    async (data: UpdateBrand) => setBrand(await updateBrand(data)),
    [setBrand, updateBrand],
  );

  const updateAvatar$ = useCallback(
    async (avatar: ImagePickerAsset) =>
      setBrand(await updateAvatar({ avatar })),
    [updateAvatar, setBrand],
  );

  return {
    updateBrand$,
    updateAvatar$,
    brand,
    updating: isBrandUpdating,
    updateError: updateBrandError,
    avatarUpdating: isAvatarUpdating,
    avatarError: updateAvatarError,
  };
};
