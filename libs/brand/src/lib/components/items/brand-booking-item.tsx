import { TextProps, View, ViewProps, XStack } from 'tamagui';
import {
  AnyBrandBooking,
  AppConfigIconName,
  BrandBookingType,
  isBrandBookingAllDay,
} from '@symbiot-core-apps/api';
import { Icon, MediumText, RegularText } from '@symbiot-core-apps/ui';
import { useTranslation } from 'react-i18next';
import { DateHelper } from '@symbiot-core-apps/shared';
import { useMemo } from 'react';
import { useCurrentAccountState } from '@symbiot-core-apps/state';

export const configByType: Record<
  BrandBookingType,
  {
    backgroundColor: string;
    color: string;
    markerColor: string;
    iconKey: AppConfigIconName;
  }
> = {
  [BrandBookingType.unavailable]: {
    backgroundColor: '$calendarUnavailableSlotBackgroundColor',
    color: '$calendarUnavailableSlotColor',
    markerColor: '$calendarUnavailableSlotMarkerColor',
    iconKey: 'UnavailableBooking',
  },
  [BrandBookingType.service]: {
    backgroundColor: '$calendarServiceSlotBackgroundColor',
    color: '$calendarServiceSlotColor',
    markerColor: '$calendarServiceSlotMarkerColor',
    iconKey: 'ServiceBooking',
  },
};

export const BrandBookingItem = ({
  nameProps,
  hideSchedule,
  showLocalTime,
  timezone,
  booking,
  ...viewProps
}: ViewProps & {
  nameProps?: TextProps;
  hideSchedule?: boolean;
  showLocalTime?: boolean;
  timezone?: string;
  booking: AnyBrandBooking;
}) => {
  const { t } = useTranslation();
  const config = configByType[booking.type];

  return (
    <View
      flex={1}
      overflow="hidden"
      padding="$2"
      gap="$2"
      width="100%"
      position="relative"
      backgroundColor={config.backgroundColor}
      {...viewProps}
    >
      {!!booking.cancelAt && (
        <XStack gap="$1" alignSelf="flex-end" justifyContent="space-between">
          <Icon name="Close" size={16} color="$error" />
          <RegularText color="$error" alignSelf="center" fontSize={12}>
            {t('shared.canceled')}
          </RegularText>
        </XStack>
      )}

      <View
        width={2}
        backgroundColor={config.markerColor}
        position="absolute"
        left={0}
        top={0}
        bottom={0}
      />

      <MediumText
        color={config.color}
        numberOfLines={1}
        minHeight={14}
        {...nameProps}
      >
        {booking.name}
      </MediumText>

      {!hideSchedule && (
        <Schedule
          booking={booking}
          timezone={timezone}
          showLocalTime={showLocalTime}
        />
      )}

      {!!booking.employees?.length && (
        <RegularText numberOfLines={1} fontSize={12} minHeight={12}>
          {booking.employees.map(({ name }) => name).join(', ')}
        </RegularText>
      )}
    </View>
  );
};

export const useBookingScheduleFormattedTime = ({
  booking,
  timezone,
}: {
  booking: AnyBrandBooking;
  timezone?: string;
}) => {
  const { t } = useTranslation();
  const { me } = useCurrentAccountState();

  return useMemo(() => {
    if (isBrandBookingAllDay(booking)) {
      return {
        zonedTime: t('shared.schedule.duration.all_day'),
        localTime: '',
      };
    } else {
      const adjustedTimezone = timezone || booking.timezone;
      const start = DateHelper.toZonedTime(booking.start, adjustedTimezone);
      const end = DateHelper.toZonedTime(booking.end, adjustedTimezone);
      const dateFormat = me?.preferences?.dateFormat;
      let zonedTime: string;
      let localTime = '';

      if (!DateHelper.isSameDay(start, end)) {
        zonedTime = `${DateHelper.format(start, dateFormat)} ${DateHelper.format(start, 'p')} - ${DateHelper.format(end, dateFormat)} ${DateHelper.format(end, 'p')}`;
      } else {
        zonedTime = `${DateHelper.format(start, 'p')} - ${DateHelper.format(end, 'p')}`;
      }

      if (!DateHelper.isSame(start, booking.start)) {
        const moreThanOneDay = !DateHelper.isSameDay(
          booking.start,
          booking.end,
        );

        if (!DateHelper.isSameDay(start, booking.start) || moreThanOneDay) {
          localTime = `${DateHelper.format(booking.start, dateFormat)} ${DateHelper.format(booking.start, 'p')} -${moreThanOneDay ? ` ${DateHelper.format(booking.end, dateFormat)}` : ''} ${DateHelper.format(booking.end, 'p')}`;
        } else {
          localTime = `${DateHelper.format(booking.start, 'p')} - ${DateHelper.format(booking.end, 'p')}`;
        }
      }

      return {
        zonedTime,
        localTime,
      };
    }
  }, [booking, me?.preferences?.dateFormat, t, timezone]);
};

const Schedule = ({
  booking,
  timezone,
  showLocalTime,
}: {
  booking: AnyBrandBooking;
  timezone?: string;
  showLocalTime?: boolean;
}) => {
  const { t } = useTranslation();
  const config = configByType[booking.type];
  const { zonedTime, localTime } = useBookingScheduleFormattedTime({
    booking,
    timezone,
  });

  return (
    <RegularText
      fontSize={12}
      minHeight={12}
      color={config.color}
      numberOfLines={1}
    >
      {`${zonedTime}${showLocalTime && localTime ? ` (${t('shared.local_time')}: ${localTime})` : ''}`}
    </RegularText>
  );
};
