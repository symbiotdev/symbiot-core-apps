import { createContext, PropsWithChildren, useEffect } from 'react';
import { queryClient } from '@symbiot-core-apps/api';
import { useAccountMeState } from '../hooks/use-account-me.state';
import { useAccountNotificationsState } from '../hooks/use-account-notifications.state';
import { useFaqState } from '../hooks/use-faq.state';

const Context = createContext({});

export const StateProvider = ({ children }: PropsWithChildren) => {
  const { clear: clearAccountMeState } = useAccountMeState();
  const { clear: clearAccountNotificationsState } =
    useAccountNotificationsState();
  const { clear: clearFaq } = useFaqState();

  useEffect(() => {
    return () => {
      queryClient.clear();
      clearAccountMeState();
      clearAccountNotificationsState();
      clearFaq();
    };
  }, [clearAccountMeState, clearAccountNotificationsState, clearFaq]);

  return <Context.Provider value={{}}>{children}</Context.Provider>;
};
