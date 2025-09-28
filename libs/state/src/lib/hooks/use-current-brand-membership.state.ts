import { BrandMembership, PaginationList } from '@symbiot-core-apps/api';
import { create } from 'zustand/index';
import { devtools, persist } from 'zustand/middleware';
import { createZustandStorage } from '@symbiot-core-apps/storage';

type CurrentBrandMembershipState = {
  currentList?: PaginationList<BrandMembership>;
  clear: () => void;
  setCurrentList: (list?: PaginationList<BrandMembership>) => void;
};

export const useCurrentBrandMembershipState =
  create<CurrentBrandMembershipState>()(
    devtools(
      persist<CurrentBrandMembershipState>(
        (set) => ({
          clear: () => {
            set({
              currentList: undefined,
            });
          },
          setCurrentList: (currentList) => set({ currentList }),
        }),
        {
          name: 'symbiot-current-brand-membership',
          storage: createZustandStorage(),
        },
      ),
    ),
  );
