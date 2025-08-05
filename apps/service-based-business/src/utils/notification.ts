import {
  AccountNotification,
  AccountNotificationType,
} from '@symbiot-core-apps/api';
import { router } from 'expo-router';

export const onPressNotification = (notification: AccountNotification) => {
  if (!notification?.type) {
    return;
  }

  if (notification.type === AccountNotificationType.welcome) {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.navigate('/');
    }
  } else {
    if (process.env.EXPO_PUBLIC_APP_MODE !== 'production') {
      alert('Handle it');
    }
  }
};
