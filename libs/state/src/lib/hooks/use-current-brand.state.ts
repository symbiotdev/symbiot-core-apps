import { Brand, BrandStats } from '@symbiot-core-apps/api';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createZustandStorage } from '@symbiot-core-apps/storage';

type CurrentBrandState = {
  brand?: Brand;
  brands?: Brand[];
  clear: () => void;
  setBrand: (brand?: Brand) => void;
  setBrandStats: (stats: BrandStats) => void;
  setBrands: (brands?: Brand[]) => void;
};

export const useCurrentBrandState = create<CurrentBrandState>()(
  persist<CurrentBrandState>(
    (set, get) => ({
      clear: () => {
        set({
          brand: undefined,
          brands: undefined,
        });
      },
      setBrand: (brand) => set({ brand }),
      setBrandStats: (stats) => {
        const brand = get().brand;

        if (!brand) return;

        set({
          brand: {
            ...brand,
            stats,
          },
        });
      },
      setBrands: (brands) => set({ brands }),
    }),
    {
      name: 'symbiot-current-brand',
      storage: createZustandStorage(),
    },
  ),
);
