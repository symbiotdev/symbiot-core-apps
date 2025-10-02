import { BrandTicket, PaginationList } from '@symbiot-core-apps/api';
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { createZustandStorage } from '@symbiot-core-apps/storage';

type CurrentBrandTicketState = {
  currentList?: PaginationList<BrandTicket>;
  clear: () => void;
  setCurrentList: (list?: PaginationList<BrandTicket>) => void;
};

export const useCurrentBrandTicketState = create<CurrentBrandTicketState>()(
  devtools(
    persist<CurrentBrandTicketState>(
      (set) => ({
        clear: () => {
          set({
            currentList: undefined,
          });
        },
        setCurrentList: (currentList) => set({ currentList }),
      }),
      {
        name: 'symbiot-current-brand-ticket',
        storage: createZustandStorage(),
      },
    ),
  ),
);
