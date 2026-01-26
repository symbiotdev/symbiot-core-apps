import { useEffect, useRef } from 'react';
import {
  addNotificationReceivedListener,
  EventSubscription,
  setNotificationHandler,
} from 'expo-notifications';
import { notificationAsync, NotificationFeedbackType } from 'expo-haptics';
import { useCurrentAccountState } from '@symbiot-core-apps/state';

export const usePushNotificationsPreferences = () => {
  const { me } = useCurrentAccountState();

  const notificationListener = useRef<EventSubscription>(null);

  return useEffect(() => {
    setNotificationHandler({
      handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldSetBadge: false,
        shouldPlaySound: !!me?.preferences?.notificationsSound,
      }),
    });

    notificationListener.current = addNotificationReceivedListener(() => {
      if (me?.preferences?.notificationsVibration) {
        void notificationAsync(NotificationFeedbackType.Success);
      }
    });

    return () => {
      notificationListener.current?.remove();
    };
  }, [
    me?.preferences?.notificationsSound,
    me?.preferences?.notificationsVibration,
  ]);
};
