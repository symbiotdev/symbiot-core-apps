import { createContext, PropsWithChildren, useEffect } from 'react';
import { queryClient } from '@symbiot-core-apps/api';
import { useCurrentAccountState } from '../hooks/use-current-account.state';
import { useNotificationsState } from '../hooks/use-notifications.state';
import { useFaqState } from '../hooks/use-faq.state';
import { useCurrentBrandState } from '../hooks/use-current-brand';

const Context = createContext({});

export const StateProvider = ({ children }: PropsWithChildren) => {
  const { clear: clearCurrentAccountState } = useCurrentAccountState();
  const { clear: clearCurrentBrandState } = useCurrentBrandState();
  const { clear: clearFaq } = useFaqState();
  const { clear: clearNotificationsState } = useNotificationsState();

  useEffect(() => {
    return () => {
      queryClient.clear();
      clearCurrentAccountState();
      clearCurrentBrandState();
      clearFaq();
      clearNotificationsState();
    };
  }, [
    clearCurrentAccountState,
    clearCurrentBrandState,
    clearFaq,
    clearNotificationsState,
  ]);

  return <Context.Provider value={{}}>{children}</Context.Provider>;
};
