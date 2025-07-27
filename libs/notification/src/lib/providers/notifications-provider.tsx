import { createContext, PropsWithChildren } from 'react';
import { AccountNotification } from '@symbiot-core-apps/api';
import { usePushNotificationsObserver } from '../hooks/use-push-notifications-observer';
import { usePushNotificationsInitializer } from '../hooks/use-push-notifications-initializer';
import { usePushNotificationsPreferences } from '../hooks/use-push-notifications-preferences';
import { useSocketNotifications } from '../hooks/use-socket-notifications';
import { AudioSource } from 'expo-audio';

const Context = createContext({});

export const NotificationsProvider = ({
  children,
  soundSource,
  onPressNotification,
}: PropsWithChildren<{
  soundSource: AudioSource;
  onPressNotification: (notification: AccountNotification) => void;
}>) => {
  useSocketNotifications({ soundSource });
  usePushNotificationsPreferences();
  usePushNotificationsObserver({ onPressNotification });
  usePushNotificationsInitializer({
    onPermissionsDenied: () => {
      // todo
    },
  });

  return <Context.Provider value={{}}>{children}</Context.Provider>;
};
