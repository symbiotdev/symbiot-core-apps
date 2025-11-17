import { InitView } from '@symbiot-core-apps/ui';
import { useLocalSearchParams } from 'expo-router';
import {
  BrandBookingType,
  ServiceBrandBooking,
  UnavailableBrandBooking,
  useBrandBookingDetailedByIdReq,
} from '@symbiot-core-apps/api';
import React from 'react';
import {
  ServiceBrandBookingProfile,
  UnavailableBrandBookingProfile,
} from '@symbiot-core-apps/brand-booking';

export default () => {
  const { id, type } = useLocalSearchParams<{
    id: string;
    type: BrandBookingType;
  }>();
  const {
    data: booking,
    isPending,
    error,
  } = useBrandBookingDetailedByIdReq(id, type);

  if (!booking || error) {
    return <InitView loading={isPending} error={error} />;
  }

  if (type === BrandBookingType.unavailable) {
    return (
      <UnavailableBrandBookingProfile
        booking={booking as UnavailableBrandBooking}
      />
    );
  } else {
    return (
      <ServiceBrandBookingProfile booking={booking as ServiceBrandBooking} />
    );
  }
};
