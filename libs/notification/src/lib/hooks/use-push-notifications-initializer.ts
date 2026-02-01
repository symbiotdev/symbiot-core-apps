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
import { useAccountUpdateDeviceReq } from '@symbiot-core-apps/api';
import { useCurrentAccountPreferences } from '@symbiot-core-apps/state';
import { isDevice } from 'expo-device';

export const usePushNotificationsInitializer = ({
  onPermissionsDenied,
}: {
  onPermissionsDenied: () => void;
}) => {
  const preferences = useCurrentAccountPreferences();
  const { mutateAsync } = useAccountUpdateDeviceReq();

  const init = useCallback(async () => {
    if (!isDevice || Platform.OS === 'web') {
      return;
    }

    if (Platform.OS === 'android') {
      await setNotificationChannelAsync('default', {
        name: 'default',
        sound: 'new_notification_sound.wav',
        importance: AndroidImportance.MAX,
        vibrationPattern: preferences.notificationsVibration
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
  }, [preferences?.notificationsVibration, mutateAsync, onPermissionsDenied]);

  return useEffect(() => {
    void init();
  }, [init]);
};
