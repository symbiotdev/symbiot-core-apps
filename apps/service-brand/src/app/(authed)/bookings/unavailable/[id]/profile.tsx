import { useLocalSearchParams } from 'expo-router';
import {
  BrandBookingType,
  UnavailableBrandBooking,
  useBrandBookingDetailedByIdReq,
} from '@symbiot-core-apps/api';
import React from 'react';
import { UnavailableBrandBookingProfile } from '@symbiot-core-apps/brand-booking';
import { FallbackView } from '@symbiot-core-apps/ui2';

export default () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const {
    data: booking,
    isPending,
    error,
  } = useBrandBookingDetailedByIdReq(id, BrandBookingType.unavailable);

  if (!booking || error) {
    return <FallbackView loading={isPending} error={error} />;
  }

  return (
    <UnavailableBrandBookingProfile
      booking={booking as UnavailableBrandBooking}
    />
  );
};
