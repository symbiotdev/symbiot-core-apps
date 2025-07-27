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
  clear: () => void;
  items?: RenderPaginationList<AccountNotification>; // don't clean it because after next auth the previous pressed push should be ignored
  // methods
  lastPushNotificationIdentifier?: string;
  setItems: (list: PaginationList<AccountNotification>) => void;
  setLastPushNotificationIdentifier: (id: string) => void;
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
      setLastPushNotificationIdentifier: (lastPushNotificationIdentifier) => {
        set({ lastPushNotificationIdentifier });
      },
    }),
    {
      name: 'account-notifications',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
