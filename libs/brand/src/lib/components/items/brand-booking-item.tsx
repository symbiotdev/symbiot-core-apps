import { TextProps, View, ViewProps, XStack } from 'tamagui';
import {
  AnyBrandBooking,
  AppConfigIconNameLegacy,
  BrandBookingType,
  isBrandBookingAllDay,
} from '@symbiot-core-apps/api';
import { Icon, MediumText, RegularText } from '@symbiot-core-apps/ui';
import { DateHelper, useI18n } from '@symbiot-core-apps/shared';
import { useMemo } from 'react';
import { useCurrentAccountPreferences } from '@symbiot-core-apps/state';

export const configByType: Record<
  BrandBookingType,
  {
    backgroundColor: string;
    color: string;
    markerColor: string;
    iconKey: AppConfigIconNameLegacy;
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
  hideCancelledText,
  showLocalTime,
  timezone,
  booking,
  ...viewProps
}: ViewProps & {
  nameProps?: TextProps;
  hideSchedule?: boolean;
  hideCancelledText?: boolean;
  showLocalTime?: boolean;
  timezone?: string;
  booking: AnyBrandBooking;
}) => {
  const { t } = useI18n();
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
      {!hideCancelledText && !!booking.cancelAt && (
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
  const { t } = useI18n();
  const preferences = useCurrentAccountPreferences();

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
      const dateFormat = preferences.dateFormat;
      const timeFormat = preferences.timeFormat;
      let zonedTime: string;
      let localTime = '';

      if (!DateHelper.isSameDay(start, end)) {
        zonedTime = `${DateHelper.format(start, dateFormat)} ${DateHelper.format(start, timeFormat)} - ${DateHelper.format(end, dateFormat)} ${DateHelper.format(end, timeFormat)}`;
      } else {
        zonedTime = `${DateHelper.format(start, timeFormat)} - ${DateHelper.format(end, timeFormat)}`;
      }

      if (!DateHelper.isSame(start, booking.start)) {
        const moreThanOneDay = !DateHelper.isSameDay(
          booking.start,
          booking.end,
        );

        if (!DateHelper.isSameDay(start, booking.start) || moreThanOneDay) {
          localTime = `${DateHelper.format(booking.start, dateFormat)} ${DateHelper.format(booking.start, timeFormat)} -${moreThanOneDay ? ` ${DateHelper.format(booking.end, dateFormat)}` : ''} ${DateHelper.format(booking.end, timeFormat)}`;
        } else {
          localTime = `${DateHelper.format(booking.start, timeFormat)} - ${DateHelper.format(booking.end, timeFormat)}`;
        }
      }

      return {
        zonedTime,
        localTime,
      };
    }
  }, [t, booking, timezone, preferences?.dateFormat, preferences?.timeFormat]);
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
  const { t } = useI18n();
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
