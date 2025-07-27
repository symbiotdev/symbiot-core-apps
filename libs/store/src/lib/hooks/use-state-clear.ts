import { useCallback } from 'react';
import { useAccountMeState } from '../state/use-account-me.state';
import { useAccountNotificationsState } from '../state/use-account-notifications.state';

export const useStateClear = () => {
  const { clear: clearAccountMeState } = useAccountMeState();
  const { clear: clearAccountNotificationsState } =
    useAccountNotificationsState();

  return useCallback(() => {
    clearAccountMeState();
    clearAccountNotificationsState();
  }, [clearAccountMeState, clearAccountNotificationsState]);
};
