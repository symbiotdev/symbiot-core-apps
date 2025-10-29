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
    iconKey: AppConfigIconName;
  }
> = {
  [BrandBookingType.unavailable]: {
    backgroundColor: '$highlighted',
    color: '$disabled',
    iconKey: 'UnavailableBooking',
  },
  [BrandBookingType.service]: {
    backgroundColor: 'red',
    color: '$color',
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
      backgroundColor={config.backgroundColor}
      {...viewProps}
    >
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
            ? t('shared.schedule.all_day')
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
