import { useMemo } from 'react';
import { DateHelper, useNativeNow } from '@symbiot-core-apps/shared';
import { useAuthTokens } from './use-auth-tokens';

export const useQueryEnabled = (enabled?: boolean) => {
  const { nextRefreshDate } = useAuthTokens();
  const { now } = useNativeNow();

  return useMemo(
    () =>
      (!nextRefreshDate ||
        DateHelper.isAfter(nextRefreshDate, now) ||
        DateHelper.isSame(nextRefreshDate, now)) &&
      (enabled === undefined || enabled),
    [enabled, nextRefreshDate, now],
  );
};
