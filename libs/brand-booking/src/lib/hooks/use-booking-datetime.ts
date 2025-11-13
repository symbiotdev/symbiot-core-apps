import { useMemo } from 'react';
import { DateHelper } from '@symbiot-core-apps/shared';
import { useCurrentBrandBookingsState } from '@symbiot-core-apps/state';

export const useBookingDatetime = ({
  fallbackZone,
}: { fallbackZone?: string } = {}) => {
  const { location } = useCurrentBrandBookingsState();

  const timezone = useMemo(
    () => location?.timezone || fallbackZone || DateHelper.currentTimezone(),
    [fallbackZone, location?.timezone],
  );

  return {
    timezone,
  };
};
