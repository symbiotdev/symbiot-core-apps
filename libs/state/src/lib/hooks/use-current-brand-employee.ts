import { BrandEmployee } from '@symbiot-core-apps/api';
import { create } from 'zustand/index';
import { devtools, persist } from 'zustand/middleware';
import { createZustandStorage } from '@symbiot-core-apps/storage';

type CurrentBrandEmployeeState = {
  brandEmployee?: BrandEmployee;
  clear: () => void;
  setBrandEmployee: (brandEmployee?: BrandEmployee) => void;
};

export const useCurrentBrandEmployeeState = create<CurrentBrandEmployeeState>()(
  devtools(
    persist<CurrentBrandEmployeeState>(
      (set) => ({
        clear: () => {
          set({
            brandEmployee: undefined,
          });
        },
        setBrandEmployee: (brandEmployee) => set({ brandEmployee }),
      }),
      {
        name: 'symbiot-current-brand-employee',
        storage: createZustandStorage(),
      },
    ),
  ),
);
