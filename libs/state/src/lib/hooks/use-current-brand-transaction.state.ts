import { BrandTransaction, PaginationList } from '@symbiot-core-apps/api';
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { createZustandStorage } from '@symbiot-core-apps/storage';

type CurrentBrandTransactionState = {
  currentList?: PaginationList<BrandTransaction>;
  clear: () => void;
  setCurrentList: (list?: PaginationList<BrandTransaction>) => void;
};

export const useCurrentBrandTransactionState =
  create<CurrentBrandTransactionState>()(
    devtools(
      persist<CurrentBrandTransactionState>(
        (set) => ({
          clear: () => {
            set({
              currentList: undefined,
            });
          },
          setCurrentList: (currentList) => set({ currentList }),
        }),
        {
          name: 'symbiot-current-brand-transaction',
          storage: createZustandStorage(),
        },
      ),
    ),
  );
