import { Notification, PaginationList } from '@symbiot-core-apps/api';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createZustandStorage } from '@symbiot-core-apps/storage';

type NotificationsState = {
  notifications?: PaginationList<Notification>;
  clear: () => void;
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
    }),
    {
      name: 'symbiot-notifications',
      storage: createZustandStorage(),
    },
  ),
);
