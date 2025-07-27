import {
  AccountNotification,
  mapPaginationListToRenderPaginationList,
  PaginationList,
  RenderPaginationList,
} from '@symbiot-core-apps/api';
import { create } from 'zustand/index';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

type AccountNotificationsState = {
  items?: RenderPaginationList<AccountNotification>;
  clear: () => void;
  setItems: (list: PaginationList<AccountNotification>) => void;
};

export const useAccountNotificationsState = create<AccountNotificationsState>()(
  persist<AccountNotificationsState>(
    (set) => ({
      clear: () => {
        set({
          items: undefined,
        });
      },
      setItems: (list) => {
        set({
          items: mapPaginationListToRenderPaginationList(list),
        });
      },
    }),
    {
      name: 'account-notifications',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
