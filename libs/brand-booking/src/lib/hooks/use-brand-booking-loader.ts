import {
  useCurrentBrandBookingsState,
  useCurrentBrandEmployee,
} from '@symbiot-core-apps/state';
import { useBrandBookingPeriodListReq } from '@symbiot-core-apps/api';
import { useEffect, useRef } from 'react';
import { useRestoreNativeApp } from '@symbiot-core-apps/shared';

export const useBrandBookingLoader = (params: {
  start: Date;
  end: Date;
  locationId?: string;
}) => {
  const { currentEmployee } = useCurrentBrandEmployee();

  const paramsRef = useRef(params);
  const permissionsRef = useRef(currentEmployee?.permissions?.bookings);

  const { syncBookings } = useCurrentBrandBookingsState();

  const { data, isFetching, isPending, error, isFetchedAfterMount, refetch } =
    useBrandBookingPeriodListReq({
      params,
    });

  useRestoreNativeApp(refetch);

  useEffect(() => {
    paramsRef.current = params;
  }, [params]);

  useEffect(() => {
    if (permissionsRef.current === currentEmployee?.permissions?.bookings)
      return;

    permissionsRef.current = currentEmployee?.permissions?.bookings;

    void refetch();
  }, [currentEmployee?.permissions?.bookings, refetch]);

  useEffect(() => {
    if (isFetchedAfterMount && data) {
      syncBookings({
        bookings: data.items,
        start: paramsRef.current.start,
        end: paramsRef.current.end,
      });
    }
  }, [data, isFetchedAfterMount, syncBookings]);

  return {
    bookings: data,
    isFetching,
    isPending,
    error,
    refetch,
  };
};
