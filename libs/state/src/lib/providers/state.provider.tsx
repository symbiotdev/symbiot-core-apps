import { createContext, PropsWithChildren, useEffect } from 'react';
import { queryClient } from '@symbiot-core-apps/api';
import { useAccountMeState } from '../hooks/use-account-me.state';
import { useAccountNotificationsState } from '../hooks/use-account-notifications.state';

const Context = createContext({});

export const StateProvider = ({ children }: PropsWithChildren) => {
  const { clear: clearAccountMeState } = useAccountMeState();
  const { clear: clearAccountNotificationsState } =
    useAccountNotificationsState();

  useEffect(() => {
    return () => {
      queryClient.clear();
      clearAccountMeState();
      clearAccountNotificationsState();
    };
  }, [clearAccountMeState, clearAccountNotificationsState]);

  return <Context.Provider value={{}}>{children}</Context.Provider>;
};
