import { useEffect, useRef } from 'react';
import {
  addNotificationReceivedListener,
  EventSubscription,
  setNotificationHandler,
} from 'expo-notifications';
import { notificationAsync, NotificationFeedbackType } from 'expo-haptics';
import { useCurrentAccountPreferences } from '@symbiot-core-apps/state';

export const usePushNotificationsPreferences = () => {
  const preferences = useCurrentAccountPreferences();

  const notificationListener = useRef<EventSubscription>(null);

  return useEffect(() => {
    setNotificationHandler({
      handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldSetBadge: false,
        shouldPlaySound: Boolean(preferences.notificationsSound),
      }),
    });

    notificationListener.current = addNotificationReceivedListener(() => {
      if (preferences.notificationsVibration) {
        void notificationAsync(NotificationFeedbackType.Success);
      }
    });

    return () => {
      notificationListener.current?.remove();
    };
  }, [preferences.notificationsSound, preferences.notificationsVibration]);
};
