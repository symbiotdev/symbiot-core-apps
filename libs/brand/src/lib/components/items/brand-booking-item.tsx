import { TextProps, View, ViewProps } from 'tamagui';
import {
  AnyBrandBooking,
  AppConfigIconName,
  BrandBookingType,
  isBrandBookingAllDay,
} from '@symbiot-core-apps/api';
import { MediumText, RegularText } from '@symbiot-core-apps/ui';
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
    backgroundColor: '$highlighted',
    color: '$disabled',
    markerColor: '#dddddd',
    iconKey: 'UnavailableBooking',
  },
  [BrandBookingType.service]: {
    backgroundColor: 'red',
    color: '$color',
    markerColor: '$background1',
    iconKey: 'ServiceBooking',
  },
};

export const BrandBookingItem = ({
  nameProps,
  hideSchedule,
  booking,
  ...viewProps
}: ViewProps & {
  nameProps?: TextProps;
  hideSchedule?: boolean;
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
        <RegularText
          fontSize={12}
          minHeight={12}
          color={config.color}
          numberOfLines={1}
        >
          {isBrandBookingAllDay(booking)
            ? t('shared.schedule.duration.all_day')
            : `${DateHelper.format(booking.start, 'p')} - ${DateHelper.format(booking.end, 'p')}`}
        </RegularText>
      )}

      {!!booking.employees?.length && (
        <RegularText numberOfLines={1} fontSize={12} minHeight={12}>
          {booking.employees.map(({ name }) => name).join(', ')}
        </RegularText>
      )}
    </View>
  );
};
