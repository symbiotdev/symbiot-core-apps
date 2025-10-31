import { InitView } from '@symbiot-core-apps/ui';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import {
  BrandBookingType,
  getTranslateKeyByBrandBookingType,
  ServiceBrandBooking,
  UnavailableBrandBooking,
  useBrandBookingDetailedByIdReq,
} from '@symbiot-core-apps/api';
import React, { useLayoutEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ServiceBrandBookingProfile,
  UnavailableBrandBookingProfile,
} from '@symbiot-core-apps/brand-booking';

export default () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { id, type } = useLocalSearchParams<{
    id: string;
    type: BrandBookingType;
  }>();

  const {
    data: booking,
    isPending,
    error,
  } = useBrandBookingDetailedByIdReq(id, type);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: t(
        `${getTranslateKeyByBrandBookingType(type)}.profile.title`,
      ),
    });
  }, [navigation, type, t]);

  if (!booking || error) {
    return <InitView loading={isPending} error={error} />;
  }

  return type === BrandBookingType.unavailable ? (
    <UnavailableBrandBookingProfile
      booking={booking as UnavailableBrandBooking}
    />
  ) : (
    <ServiceBrandBookingProfile booking={booking as ServiceBrandBooking} />
  );
};
