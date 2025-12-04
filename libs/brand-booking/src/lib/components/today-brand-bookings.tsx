import { useTranslation } from 'react-i18next';
import {
  ActionCard,
  Icon,
  InitView,
  Link,
  MediumText,
} from '@symbiot-core-apps/ui';
import React, { useMemo } from 'react';
import { useBrandBookingLoader } from '../hooks/use-brand-booking-loader';
import {
  DateHelper,
  emitHaptic,
  useNativeNow,
} from '@symbiot-core-apps/shared';
import { useApp } from '@symbiot-core-apps/app';
import { BrandBookingItem } from '@symbiot-core-apps/brand';
import {
  useCurrentBrandBookingsState,
  useCurrentBrandEmployee,
} from '@symbiot-core-apps/state';
import { View, XStack } from 'tamagui';
import { router } from 'expo-router';
import { BrandBookingType } from '@symbiot-core-apps/api';

export const TodayBrandBookings = () => {
  const { t } = useTranslation();
  const { icons } = useApp();
  const { now } = useNativeNow();
  const { currentEmployee, hasPermission } = useCurrentBrandEmployee();
  const { bookings } = useCurrentBrandBookingsState();

  const bookingsParams = useMemo(
    () => ({
      start: DateHelper.startOfDay(now),
      end: DateHelper.endOfDay(DateHelper.addDays(now, 1)),
    }),
    [now],
  );

  const { isPending, error } = useBrandBookingLoader(bookingsParams);

  const hasCompletedServices = useMemo(
    () =>
      bookings?.some(
        ({ start, end, type }) =>
          type === BrandBookingType.service &&
          (DateHelper.isSameDay(now, start) ||
            DateHelper.isSameDay(now, end)) &&
          DateHelper.isAfter(now, end),
      ),
    [bookings, now],
  );

  const adjustedBookings = useMemo(
    () =>
      bookings?.filter(
        ({ start, end, employees }) =>
          DateHelper.isSameDay(now, start) &&
          DateHelper.isBefore(now, end) &&
          employees.some(({ id }) => id === currentEmployee?.id),
      ),
    [bookings, now, currentEmployee?.id],
  );

  if (!adjustedBookings) {
    return <InitView height={100} loading={isPending} error={error?.message} />;
  } else {
    return (
      <View gap="$1">
        <XStack alignItems="center" gap="$5" paddingHorizontal="$3">
          <MediumText color="$placeholderColor">
            {t('brand_booking.today_schedule')}
          </MediumText>

          <Link
            marginLeft="auto"
            fontSize={14}
            onPress={() => {
              emitHaptic();
              router.push('/bookings');
            }}
          >
            {t('brand_booking.see_all')}
          </Link>
        </XStack>

        {adjustedBookings.map((booking) => (
          <BrandBookingItem
            showLocalTime
            padding="$4"
            borderRadius="$10"
            cursor="pointer"
            key={booking.id}
            booking={booking}
            pressStyle={{ opacity: 0.8 }}
            onPress={() =>
              router.push(`/bookings/${booking.type}/${booking.id}/profile`)
            }
          />
        ))}

        {!adjustedBookings.length && (
          <ActionCard
            {...(hasCompletedServices
              ? {
                  title: t('brand_booking.today_schedules_completed.title'),
                  subtitle: t(
                    'brand_booking.today_schedules_completed.subtitle',
                  ),
                  buttonLabel: t(
                    'brand_booking.today_schedules_completed.button.label',
                  ),
                }
              : {
                  title: t('brand_booking.today_no_schedules.title'),
                  subtitle: t('brand_booking.today_no_schedules.subtitle'),
                  buttonLabel: t(
                    'brand_booking.today_no_schedules.button.label',
                  ),
                })}
            buttonHidden={!hasPermission('bookings')}
            buttonIcon={<Icon name={icons.ServiceBooking} />}
            onPress={() =>
              router.push(`/bookings/${BrandBookingType.service}/create`)
            }
          />
        )}
      </View>
    );
  }
};
