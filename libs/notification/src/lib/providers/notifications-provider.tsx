import { createContext, PropsWithChildren } from 'react';
import { AccountNotification } from '@symbiot-core-apps/api';
import { usePushNotificationsObserver } from '../hooks/use-push-notifications-observer';
import { usePushNotificationsInitializer } from '../hooks/use-push-notifications-initializer';
import { usePushNotificationsPreferences } from '../hooks/use-push-notifications-preferences';

const Context = createContext({});

export const NotificationsProvider = ({
  children,
  onPressNotification,
}: PropsWithChildren<{
  onPressNotification: (notification: AccountNotification) => void;
}>) => {
  usePushNotificationsPreferences();
  usePushNotificationsObserver({ onPressNotification });
  usePushNotificationsInitializer({
    onPermissionsDenied: () => {
      // todo
    },
  });

  return <Context.Provider value={{}}>{children}</Context.Provider>;
};
