import { AccountNotification, PaginationList } from '@symbiot-core-apps/api';
import { create } from 'zustand/index';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

type AccountNotificationsState = {
  notifications?: PaginationList<AccountNotification>;
  clear: () => void;
  setNotifications: (list: PaginationList<AccountNotification>) => void;
};

export const useAccountNotificationsState = create<AccountNotificationsState>()(
  persist<AccountNotificationsState>(
    (set) => ({
      clear: () => {
        set({
          notifications: undefined,
        });
      },
      setNotifications: (notifications) => {
        set({
          notifications,
        });
      },
    }),
    {
      name: 'account-notifications',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
