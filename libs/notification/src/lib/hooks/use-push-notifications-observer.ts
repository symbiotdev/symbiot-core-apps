import { useCallback, useLayoutEffect, useState } from 'react';
import {
  addNotificationResponseClearedListener,
  addNotificationResponseReceivedListener,
  getLastNotificationResponseAsync,
  MaybeNotificationResponse,
  NotificationResponse,
} from 'expo-notifications';
import { isDevice } from 'expo-device';
import { Platform } from 'react-native';
import { Notification } from '@symbiot-core-apps/api';
import { persist } from 'zustand/middleware';
import { create } from 'zustand';
import { createZustandStorage } from '@symbiot-core-apps/storage';

type LastPushNotificationIdState = {
  id?: string;
  setId: (id: string) => void;
};

export const useLastPushNotificationIdState =
  create<LastPushNotificationIdState>()(
    persist<LastPushNotificationIdState>(
      (set) => ({
        setId: (id) => {
          set({ id });
        },
      }),
      {
        name: 'symbiot-last-push-notification-id',
        storage: createZustandStorage(),
      },
    ),
  );

const determineNextResponse = (
  prevResponse: MaybeNotificationResponse,
  newResponse: NotificationResponse | null,
) => {
  if (!newResponse) {
    return null;
  }

  if (!prevResponse) {
    return newResponse;
  }

  return prevResponse.notification.request.identifier !==
    newResponse.notification.request.identifier
    ? newResponse
    : prevResponse;
};

export const usePushNotificationsObserver = ({
  onPressNotification,
}: {
  onPressNotification?: (notification: Notification) => void;
} = {}) => {
  const {
    id: lastPushNotificationIdentifier,
    setId: setLastPushNotificationIdentifier,
  } = useLastPushNotificationIdState();

  const [lastNotificationResponse, setLastNotificationResponse] =
    useState<MaybeNotificationResponse>(undefined);

  const handleLastNotification = useCallback(
    (response: NotificationResponse | null) => {
      setLastNotificationResponse((prevResponse) =>
        determineNextResponse(prevResponse, response),
      );

      if (response) {
        const request = response.notification.request;
        const identifier = request.identifier;

        if (!identifier || lastPushNotificationIdentifier === identifier) {
          return;
        }

        onPressNotification?.(request.content.data as Notification);
        setLastPushNotificationIdentifier(identifier);
      }
    },
    [
      lastPushNotificationIdentifier,
      onPressNotification,
      setLastPushNotificationIdentifier,
    ],
  );

  useLayoutEffect(() => {
    if (!isDevice || Platform.OS === 'web') {
      return;
    }

    let isMounted = true;

    getLastNotificationResponseAsync().then((response) => {
      if (isMounted) {
        handleLastNotification(response);
      }
    });

    const subscription = addNotificationResponseReceivedListener(
      handleLastNotification,
    );
    const clearResponseSubscription = addNotificationResponseClearedListener(
      () => {
        setLastNotificationResponse(null);
      },
    );
    return () => {
      isMounted = false;
      subscription.remove();
      clearResponseSubscription.remove();
    };
  }, [handleLastNotification]);

  return lastNotificationResponse;
};
