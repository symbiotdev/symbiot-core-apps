import { AccountNotification, PaginationList } from '@symbiot-core-apps/api';
import { create } from 'zustand/index';
import { persist } from 'zustand/middleware';
import { createZustandStorage } from '@symbiot-core-apps/storage';

type AccountNotificationsState = {
  notifications?: PaginationList<AccountNotification>;
  clear: () => void;
  add: (notification: AccountNotification) => void;
  setNotifications: (list: PaginationList<AccountNotification>) => void;
};

export const useAccountNotificationsState = create<AccountNotificationsState>()(
  persist<AccountNotificationsState>(
    (set, get) => ({
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
      add: (notification) => {
        const { notifications } = get();

        set({
          notifications: notifications?.items
            ? {
                ...notifications,
                items: [notification, ...notifications.items],
              }
            : {
                items: [notification],
                count: 1,
              },
        });
      },
    }),
    {
      name: 'account-notifications',
      storage: createZustandStorage(),
    },
  ),
);
