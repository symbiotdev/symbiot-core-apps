import { useMemo } from 'react';
import { DateHelper } from '@symbiot-core-apps/shared';
import { useCurrentBrandBookingsState } from '@symbiot-core-apps/state';

export const useBookingDate = ({
  fallbackZone,
}: { fallbackZone?: string } = {}) => {
  const { location } = useCurrentBrandBookingsState();

  const timezone = useMemo(
    () => location?.timezone || fallbackZone || DateHelper.currentTimezone(),
    [fallbackZone, location?.timezone],
  );
  const date = useMemo(
    () => DateHelper.toZonedTime(new Date(), timezone),
    [timezone],
  );

  return {
    date,
    timezone,
  };
};
