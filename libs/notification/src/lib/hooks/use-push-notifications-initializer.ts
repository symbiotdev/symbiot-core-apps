import { useCallback, useEffect } from 'react';
import { Platform } from 'react-native';
import {
  AndroidImportance,
  getExpoPushTokenAsync,
  getPermissionsAsync,
  requestPermissionsAsync,
  setNotificationChannelAsync,
} from 'expo-notifications';
import Constants from 'expo-constants';
import { ShowNativeFailedAlert } from '@symbiot-core-apps/shared';
import { useAccountUpdateDeviceQuery } from '@symbiot-core-apps/api';
import { useMe } from '@symbiot-core-apps/store';

export const usePushNotificationsInitializer = ({
  onPermissionsDenied,
}: {
  onPermissionsDenied: () => void;
}) => {
  const { me } = useMe();
  const { mutateAsync } = useAccountUpdateDeviceQuery();

  const init = useCallback(async () => {
    if (Platform.OS === 'android') {
      await setNotificationChannelAsync('default', {
        name: 'default',
        sound: 'notifications-sound.wav',
        importance: AndroidImportance.MAX,
        vibrationPattern: me?.preferences?.enableNotificationVibration
          ? [0, 250, 0, 250]
          : [],
      });
    }

    const { status: existingStatus } = await getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await requestPermissionsAsync();

      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      onPermissionsDenied();
    } else {
      try {
        const projectId =
          Constants?.expoConfig?.extra?.eas?.projectId ??
          Constants?.easConfig?.projectId;
        const pushToken = await getExpoPushTokenAsync({
          projectId,
        });

        void mutateAsync({
          expoPushToken: pushToken.data,
        });
      } catch (error) {
        ShowNativeFailedAlert({
          text: String(error),
        });
      }
    }
  }, [
    me?.preferences?.enableNotificationVibration,
    mutateAsync,
    onPermissionsDenied,
  ]);

  return useEffect(() => {
    void init();
  }, [init]);
};
