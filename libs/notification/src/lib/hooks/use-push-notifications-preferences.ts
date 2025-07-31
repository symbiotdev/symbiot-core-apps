import { useEffect, useRef } from 'react';
import {
  addNotificationReceivedListener,
  EventSubscription,
  setNotificationHandler,
} from 'expo-notifications';
import { notificationAsync, NotificationFeedbackType } from 'expo-haptics';
import { useMe } from '@symbiot-core-apps/state';

export const usePushNotificationsPreferences = () => {
  const { me } = useMe();

  const notificationListener = useRef<EventSubscription>(null);

  return useEffect(() => {
    setNotificationHandler({
      handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldSetBadge: false,
        shouldPlaySound: !!me?.preferences?.enableNotificationSound,
      }),
    });

    notificationListener.current = addNotificationReceivedListener(() => {
      if (me?.preferences?.enableNotificationVibration) {
        void notificationAsync(NotificationFeedbackType.Success);
      }
    });

    return () => {
      notificationListener.current?.remove();
    };
  }, [
    me?.preferences?.enableNotificationSound,
    me?.preferences?.enableNotificationVibration,
  ]);
};
