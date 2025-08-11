import { createContext, PropsWithChildren, useEffect } from 'react';
import { queryClient } from '@symbiot-core-apps/api';
import { useCurrentAccountState } from '../hooks/use-current-account.state';
import { useAccountNotificationsState } from '../hooks/use-account-notifications.state';
import { useFaqState } from '../hooks/use-faq.state';
import { useCurrentBrandState } from '../hooks/use-current-brand';

const Context = createContext({});

export const StateProvider = ({ children }: PropsWithChildren) => {
  const { clear: clearAccountNotificationsState } =
    useAccountNotificationsState();
  const { clear: clearCurrentAccountState } = useCurrentAccountState();
  const { clear: clearCurrentBrandState } = useCurrentBrandState();
  const { clear: clearFaq } = useFaqState();

  useEffect(() => {
    return () => {
      queryClient.clear();
      clearAccountNotificationsState();
      clearCurrentAccountState();
      clearCurrentBrandState();
      clearFaq();
    };
  }, [
    clearAccountNotificationsState,
    clearCurrentAccountState,
    clearCurrentBrandState,
    clearFaq,
  ]);

  return <Context.Provider value={{}}>{children}</Context.Provider>;
};
