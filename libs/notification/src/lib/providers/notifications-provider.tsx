import { PropsWithChildren, useCallback } from 'react';
import { Notification } from '@symbiot-core-apps/api';
import { usePushNotificationsObserver } from '../hooks/use-push-notifications-observer';
import { usePushNotificationsInitializer } from '../hooks/use-push-notifications-initializer';
import { usePushNotificationsPreferences } from '../hooks/use-push-notifications-preferences';

export const NotificationsProvider = ({
  children,
  onPressNotification,
}: PropsWithChildren<{
  onPressNotification: (notification: Notification) => void;
}>) => {
  const onPermissionsDenied = useCallback(() => {
    // todo
  }, []);

  usePushNotificationsPreferences();
  usePushNotificationsObserver({ onPressNotification });
  usePushNotificationsInitializer({
    onPermissionsDenied,
  });

  return children;
};
