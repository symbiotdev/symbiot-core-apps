import {
  BrandBookingType,
  BrandMembershipType,
  Notification,
  NotificationType,
} from '@symbiot-core-apps/api';
import { router } from 'expo-router';

const goHome = () =>
  router.canGoBack() ? router.back() : router.navigate('/');

export const onPressNotification = (notification: Notification) => {
  if (!notification?.type) {
    return;
  }

  if (
    [
      NotificationType.welcome,
      NotificationType.accountSubscriptionCreated,
      NotificationType.accountSubscriptionRemoved,
      NotificationType.brandEmployeeAssigned,
      NotificationType.brandEmployeeUnassigned,
    ].includes(notification.type)
  ) {
    goHome();
  } else if (
    [NotificationType.brandCreated, NotificationType.brandUpdated].includes(
      notification.type,
    )
  ) {
    router.navigate('/brand/profile');
  } else if (
    [
      NotificationType.brandLocationCreated,
      NotificationType.brandLocationUpdated,
      NotificationType.brandLocationRemoved,
    ].includes(notification.type)
  ) {
    router.navigate(
      notification.brandLocation
        ? `/locations/${notification.brandLocation.id}/profile`
        : '/locations',
    );
  } else if (
    [
      NotificationType.brandEmployeeCreated,
      NotificationType.brandEmployeeUpdated,
      NotificationType.brandEmployeeRemoved,
    ].includes(notification.type)
  ) {
    router.navigate(
      notification.brandEmployee
        ? `/employees/${notification.brandEmployee.id}/profile`
        : '/employees',
    );
  } else if (
    [
      NotificationType.brandPeriodMembershipCreated,
      NotificationType.brandPeriodMembershipUpdated,
      NotificationType.brandPeriodMembershipRemoved,
    ].includes(notification.type)
  ) {
    router.navigate(
      notification.brandMembership
        ? `/memberships/${notification.brandMembership.id}/profile`
        : `/memberships/${BrandMembershipType.period}`,
    );
  } else if (
    [
      NotificationType.brandVisitMembershipCreated,
      NotificationType.brandVisitMembershipUpdated,
      NotificationType.brandVisitMembershipRemoved,
    ].includes(notification.type)
  ) {
    router.navigate(
      notification.brandMembership
        ? `/memberships/${notification.brandMembership.id}/profile`
        : `/memberships/${BrandMembershipType.visits}`,
    );
  } else if (
    [
      NotificationType.brandServiceCreated,
      NotificationType.brandServiceUpdated,
      NotificationType.brandServiceRemoved,
    ].includes(notification.type)
  ) {
    router.navigate(
      notification.brandService
        ? `/services/${notification.brandService.id}/profile`
        : '/services',
    );
  } else if (
    [
      NotificationType.brandClientPeriodMembershipCreated,
      NotificationType.brandClientPeriodMembershipUpdated,
      NotificationType.brandClientPeriodMembershipRemoved,
      NotificationType.brandClientVisitMembershipCreated,
      NotificationType.brandClientVisitMembershipUpdated,
      NotificationType.brandClientVisitMembershipRemoved,
    ].includes(notification.type)
  ) {
    router.navigate(
      notification.brandClient
        ? `/clients/${notification.brandClient.id}/profile`
        : '/clients',
    );
  } else if (
    [
      NotificationType.unavailableBrandBookingCreated,
      NotificationType.unavailableBrandBookingCanceled,
      NotificationType.unavailableBrandBookingUpdated,
      NotificationType.unavailableBrandBookingUpcoming,
    ].includes(notification.type)
  ) {
    router.navigate(
      notification.brandBooking
        ? `/bookings/${BrandBookingType.unavailable}/${notification.brandBooking.id}/profile`
        : `/bookings/${BrandBookingType.unavailable}/`,
    );
  } else if (
    [
      NotificationType.serviceBrandBookingCanceled,
      NotificationType.serviceBrandBookingCreated,
      NotificationType.serviceBrandBookingUpdated,
      NotificationType.serviceBrandBookingUpcoming,
      NotificationType.serviceBrandBookingClientAdded,
      NotificationType.serviceBrandBookingClientRemoved,
    ].includes(notification.type)
  ) {
    router.navigate(
      notification.brandBooking
        ? `/bookings/${BrandBookingType.service}/${notification.brandBooking.id}/profile`
        : `/bookings/${BrandBookingType.service}`,
    );
  } else {
    if (process.env.EXPO_PUBLIC_APP_MODE !== 'production') {
      alert('Handle it');
    }

    goHome();
  }
};
