import { BrandEmployee, PaginationList } from '@symbiot-core-apps/api';
import { create } from 'zustand/index';
import { devtools, persist } from 'zustand/middleware';
import { createZustandStorage } from '@symbiot-core-apps/storage';

type CurrentBrandEmployeeState = {
  currentEmployee?: BrandEmployee;
  currentList?: PaginationList<BrandEmployee>;
  clear: () => void;
  setCurrentEmployee: (brandEmployee?: BrandEmployee) => void;
  setCurrentList: (employees?: PaginationList<BrandEmployee>) => void;
};

export const useCurrentBrandEmployeeState = create<CurrentBrandEmployeeState>()(
  devtools(
    persist<CurrentBrandEmployeeState>(
      (set) => ({
        clear: () => {
          set({
            currentEmployee: undefined,
            currentList: undefined,
          });
        },
        setCurrentEmployee: (currentEmployee) => set({ currentEmployee }),
        setCurrentList: (currentList) => set({ currentList }),
      }),
      {
        name: 'symbiot-current-brand-employee',
        storage: createZustandStorage(),
      },
    ),
  ),
);
