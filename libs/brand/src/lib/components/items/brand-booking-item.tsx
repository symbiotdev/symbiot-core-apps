import { View, ViewProps, XStack } from 'tamagui';
import {
  AnyBrandBooking,
  AppConfigIconName,
  BrandBookingType,
  isBrandBookingAllDay,
} from '@symbiot-core-apps/api';
import {
  formViewStyles,
  Icon,
  MediumText,
  RegularText,
} from '@symbiot-core-apps/ui';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { DateHelper } from '@symbiot-core-apps/shared';
import { useApp } from '@symbiot-core-apps/app';

const configByType: Record<
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
    backgroundColor: '$background1',
    color: '$color',
    iconKey: 'ServiceBooking',
  },
};

export const BrandBookingItem = ({
  booking,
  ...viewProps
}: ViewProps & {
  booking: AnyBrandBooking;
}) => {
  const { icons } = useApp();
  const { t } = useTranslation();
  const config = configByType[booking.type];

  return (
    <View
      backgroundColor={config.backgroundColor}
      padding="$2"
      gap="$2"
      width="100%"
      borderRadius="$4"
      cursor="pointer"
      style={formViewStyles}
      pressStyle={{ opacity: 0.8 }}
      onPress={() =>
        router.push(`/booking/${booking.type}/${booking.id}/profile`)
      }
      {...viewProps}
    >
      <XStack alignItems="center" gap="$1">
        <Icon color={config.color} name={icons[config.iconKey]} size={16} />

        <RegularText fontSize={12} color={config.color} numberOfLines={1}>
          {isBrandBookingAllDay(booking)
            ? t('shared.schedule.all_day')
            : `${DateHelper.format(booking.start, 'p')} - ${DateHelper.format(booking.end, 'p')}`}
        </RegularText>
      </XStack>

      <MediumText color={config.color} numberOfLines={1}>
        {booking.name}
      </MediumText>

      {!!booking.employees?.length && (
        <RegularText>
          {booking.employees.map(({ name }) => name).join(', ')}
        </RegularText>
      )}
    </View>
  );
};
