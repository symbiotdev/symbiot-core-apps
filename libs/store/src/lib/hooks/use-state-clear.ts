import { useCallback } from 'react';
import { useAccountMeState } from '../state/use-account-me.state';
import { useAccountNotificationsState } from '../state/use-account-notifications.state';
import { queryClient } from '@symbiot-core-apps/api';

export const useStateClear = () => {
  const { clear: clearAccountMeState } = useAccountMeState();
  const { clear: clearAccountNotificationsState } =
    useAccountNotificationsState();

  return useCallback(() => {
    queryClient.clear();
    clearAccountMeState();
    clearAccountNotificationsState();
  }, [clearAccountMeState, clearAccountNotificationsState]);
};
