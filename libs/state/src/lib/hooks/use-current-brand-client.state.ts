import { BrandClient, PaginationList } from '@symbiot-core-apps/api';
import { create } from 'zustand/index';
import { devtools, persist } from 'zustand/middleware';
import { createZustandStorage } from '@symbiot-core-apps/storage';

type CurrentBrandClientState = {
  currentList?: PaginationList<BrandClient>;
  clear: () => void;
  setCurrentList: (list?: PaginationList<BrandClient>) => void;
};

export const useCurrentBrandClientState = create<CurrentBrandClientState>()(
  devtools(
    persist<CurrentBrandClientState>(
      (set) => ({
        clear: () => {
          set({
            currentList: undefined,
          });
        },
        setCurrentList: (currentList) => set({ currentList }),
      }),
      {
        name: 'symbiot-current-brand-client',
        storage: createZustandStorage(),
      },
    ),
  ),
);
