import { Brand } from '@symbiot-core-apps/api';
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { createZustandStorage } from '@symbiot-core-apps/storage';

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
