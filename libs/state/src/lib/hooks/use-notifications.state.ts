import { Notification, PaginationList } from '@symbiot-core-apps/api';
import { create } from 'zustand/index';
import { persist } from 'zustand/middleware';
import { createZustandStorage } from '@symbiot-core-apps/storage';

type NotificationsState = {
  notifications?: PaginationList<Notification>;
  clear: () => void;
  add: (notification: Notification) => void;
  setNotifications: (list: PaginationList<Notification>) => void;
};

export const useNotificationsState = create<NotificationsState>()(
  persist<NotificationsState>(
    (set, get) => ({
      clear: () =>
        set({
          notifications: undefined,
        }),
      setNotifications: (notifications) =>
        set({
          notifications,
        }),
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
      name: 'symbiot-notifications',
      storage: createZustandStorage(),
    },
  ),
);
