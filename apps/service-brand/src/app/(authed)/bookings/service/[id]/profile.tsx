import { useLocalSearchParams } from 'expo-router';
import {
  BrandBookingType,
  ServiceBrandBooking,
  useBrandBookingDetailedByIdReq,
} from '@symbiot-core-apps/api';
import React from 'react';
import { ServiceBrandBookingProfile } from '@symbiot-core-apps/brand-booking';
import { FallbackView } from '@symbiot-core-apps/ui2';

export default () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const {
    data: booking,
    isPending,
    error,
  } = useBrandBookingDetailedByIdReq(id, BrandBookingType.service);

  if (!booking || error) {
    return <FallbackView loading={isPending} error={error} />;
  }

  return (
    <ServiceBrandBookingProfile booking={booking as ServiceBrandBooking} />
  );
};
