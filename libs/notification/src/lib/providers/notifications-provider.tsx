import { createContext, PropsWithChildren, useCallback } from 'react';
import { Notification } from '@symbiot-core-apps/api';
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
  onPressNotification: (notification: Notification) => void;
}>) => {
  const onPermissionsDenied = useCallback(() => {
    // todo
  }, []);

  useSocketNotifications({ soundSource });
  usePushNotificationsPreferences();
  usePushNotificationsObserver({ onPressNotification });
  usePushNotificationsInitializer({
    onPermissionsDenied,
  });

  return <Context.Provider value={{}}>{children}</Context.Provider>;
};
