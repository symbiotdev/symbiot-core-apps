import {
  BrandBookingType,
  Notification,
  NotificationType,
} from '@symbiot-core-apps/api';
import { router } from 'expo-router';

export const onPressNotification = (notification: Notification) => {
  if (!notification?.type) {
    return;
  }

  if (notification.type === NotificationType.welcome) {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.navigate('/');
    }
  } else if (
    [
      NotificationType.unavailableBrandBookingsCreated,
      NotificationType.unavailableBrandBookingsCanceled,
      NotificationType.unavailableBrandBookingsUpdated,
    ].includes(notification.type)
  ) {
    router.navigate(
      `/bookings/${BrandBookingType.unavailable}/${notification.brandBookingId}/profile`,
    );
  } else if (
    [
      NotificationType.serviceBrandBookingsCanceled,
      NotificationType.serviceBrandBookingsCreated,
      NotificationType.serviceBrandBookingsUpdated,
      NotificationType.serviceBrandBookingClientAdded,
      NotificationType.serviceBrandBookingClientRemoved,
    ].includes(notification.type)
  ) {
    router.navigate(
      `/bookings/${BrandBookingType.service}/${notification.brandBookingId}/profile`,
    );
  } else {
    if (process.env.EXPO_PUBLIC_APP_MODE !== 'production') {
      alert('Handle it');
    }
  }
};
