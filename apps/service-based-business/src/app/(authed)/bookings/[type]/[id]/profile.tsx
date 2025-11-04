import {
  ContextMenuItem,
  ContextMenuPopover,
  Icon,
  InitView,
} from '@symbiot-core-apps/ui';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import {
  BrandBookingType,
  ServiceBrandBooking,
  UnavailableBrandBooking,
  useBrandBookingDetailedByIdReq,
  useCancelServiceBrandBookingReq,
  useCancelUnavailableBrandBookingReq,
} from '@symbiot-core-apps/api';
import React, { useCallback, useLayoutEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ServiceBrandBookingProfile,
  UnavailableBrandBookingProfile,
} from '@symbiot-core-apps/brand-booking';
import { ConfirmAlert } from '@symbiot-core-apps/shared';
import { useCurrentBrandEmployee } from '@symbiot-core-apps/state';

export default () => {
  const { id, type } = useLocalSearchParams<{
    id: string;
    type: BrandBookingType;
  }>();

  if (type === BrandBookingType.unavailable) {
    return <UnavailableBooking id={id} />;
  } else {
    return <ServiceBooking id={id} />;
  }
};

const UnavailableBooking = ({ id }: { id: string }) => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const {
    data: booking,
    isPending,
    error,
  } = useBrandBookingDetailedByIdReq(id, BrandBookingType.unavailable);
  const { mutateAsync: cancel, isPending: cancelProcessing } =
    useCancelUnavailableBrandBookingReq();
  const { currentEmployee } = useCurrentBrandEmployee();

  const contextMenuItems: ContextMenuItem[] = useMemo(
    () => [
      {
        label: t(`unavailable_brand_booking.profile.context_menu.cancel.label`),
        icon: <Icon name="Close" />,
        color: '$error',
        onPress: async () => {
          if (!booking?.id) return;

          let recurring = false;

          if (booking.repetitive) {
            recurring = await new Promise((resolve) => {
              ConfirmAlert({
                title: t('unavailable_brand_booking.profile.update_recurring'),
                cancelText: t('shared.no'),
                confirmText: t('shared.yes'),
                onCancel: () => resolve(false),
                onAgree: () => {
                  resolve(true);

                  void cancel({
                    id: booking.id,
                    recurring: true,
                  });
                },
              });
            });
          }

          if (!recurring) {
            void cancel({
              id: booking.id,
              recurring: false,
            });
          }
        },
      } as ContextMenuItem,
    ],
    [booking?.id, booking?.repetitive, cancel, t],
  );

  const headerRight = useCallback(
    () =>
      !!booking?.id &&
      !booking?.cancelAt &&
      currentEmployee?.permissions?.bookings && (
        <ContextMenuPopover
          loading={cancelProcessing}
          disabled={cancelProcessing}
          items={contextMenuItems}
        />
      ),
    [
      booking?.cancelAt,
      booking?.id,
      currentEmployee?.permissions?.bookings,
      cancelProcessing,
      contextMenuItems,
    ],
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: t(`unavailable_brand_booking.profile.title`),
      headerRight,
    });
  }, [navigation, t, headerRight]);

  if (!booking || error) {
    return <InitView loading={isPending} error={error} />;
  }

  return (
    <UnavailableBrandBookingProfile
      booking={booking as UnavailableBrandBooking}
    />
  );
};

const ServiceBooking = ({ id }: { id: string }) => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const {
    data: booking,
    isPending,
    error,
  } = useBrandBookingDetailedByIdReq(id, BrandBookingType.service);
  const { mutateAsync: cancel, isPending: cancelProcessing } =
    useCancelServiceBrandBookingReq();
  const { currentEmployee } = useCurrentBrandEmployee();

  const contextMenuItems: ContextMenuItem[] = useMemo(
    () => [
      {
        label: t(`service_brand_booking.profile.context_menu.cancel.label`),
        icon: <Icon name="Close" />,
        color: '$error',
        onPress: () => {
          if (!booking?.id) return;

          let recurring = false;

          if (booking.repetitive) {
            ConfirmAlert({
              title: t('service_brand_booking.profile.update_recurring'),
              cancelText: t('shared.no'),
              confirmText: t('shared.yes'),
              onAgree: async () => {
                recurring = true;

                void cancel({
                  id: booking.id,
                  recurring: true,
                });
              },
            });
          }

          if (!recurring) {
            void cancel({
              id: booking.id,
              recurring: false,
            });
          }
        },
      } as ContextMenuItem,
    ],
    [booking?.id, booking?.repetitive, cancel, t],
  );

  const headerRight = useCallback(
    () =>
      !!booking?.id &&
      !booking?.cancelAt &&
      currentEmployee?.permissions?.bookings && (
        <ContextMenuPopover
          loading={cancelProcessing}
          disabled={cancelProcessing}
          items={contextMenuItems}
        />
      ),
    [
      booking?.cancelAt,
      booking?.id,
      currentEmployee?.permissions?.bookings,
      cancelProcessing,
      contextMenuItems,
    ],
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: t(`service_brand_booking.profile.title`),
      headerRight,
    });
  }, [navigation, t, headerRight]);

  if (!booking || error) {
    return <InitView loading={isPending} error={error} />;
  }

  return (
    <ServiceBrandBookingProfile booking={booking as ServiceBrandBooking} />
  );
};
