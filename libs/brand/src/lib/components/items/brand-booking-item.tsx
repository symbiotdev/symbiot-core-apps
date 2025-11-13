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
  let text: string;

  if (isBrandBookingAllDay(booking)) {
    text = t('shared.schedule.duration.all_day');
  } else {
    const adjustedTimezone = timezone || booking.timezone;
    const start = DateHelper.toZonedTime(booking.start, adjustedTimezone);
    const end = DateHelper.toZonedTime(booking.end, adjustedTimezone);

    text = `${DateHelper.format(start, 'p')} - ${DateHelper.format(end, 'p')}`;

    if (showLocalTime && !DateHelper.isSame(start, booking.start)) {
      text = `${text} (${t('shared.local_time')}: ${DateHelper.format(booking.start, 'p')} - ${DateHelper.format(booking.end, 'p')})`;
    }
  }

  return (
    <RegularText
      fontSize={12}
      minHeight={12}
      color={config.color}
      numberOfLines={1}
    >
      {text}
    </RegularText>
  );
};
