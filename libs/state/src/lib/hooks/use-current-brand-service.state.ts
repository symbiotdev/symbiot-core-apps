import { BrandService, PaginationList } from '@symbiot-core-apps/api';
import { create } from 'zustand/index';
import { devtools, persist } from 'zustand/middleware';
import { createZustandStorage } from '@symbiot-core-apps/storage';

type CurrentBrandServiceState = {
  currentList?: PaginationList<BrandService>;
  clear: () => void;
  setCurrentList: (list?: PaginationList<BrandService>) => void;
};

export const useCurrentBrandServiceState = create<CurrentBrandServiceState>()(
  devtools(
    persist<CurrentBrandServiceState>(
      (set) => ({
        clear: () => {
          set({
            currentList: undefined,
          });
        },
        setCurrentList: (currentList) => set({ currentList }),
      }),
      {
        name: 'symbiot-current-brand-service',
        storage: createZustandStorage(),
      },
    ),
  ),
);
