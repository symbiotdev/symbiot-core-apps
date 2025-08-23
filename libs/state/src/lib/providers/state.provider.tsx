import { PropsWithChildren, useCallback, useEffect } from 'react';
import {
  Account,
  Brand,
  queryClient,
  socket,
  WebsocketAction,
} from '@symbiot-core-apps/api';
import { useCurrentAccountState } from '../hooks/use-current-account.state';
import { useNotificationsState } from '../hooks/use-notifications.state';
import { useFaqState } from '../hooks/use-faq.state';
import { useCurrentBrandState } from '../hooks/use-current-brand';

export const StateProvider = ({ children }: PropsWithChildren) => {
  const { setMe, clear: clearCurrentAccountState } = useCurrentAccountState();
  const { setBrand: setCurrentBrand, clear: clearCurrentBrandState } =
    useCurrentBrandState();
  const { clear: clearFaq } = useFaqState();
  const { clear: clearNotificationsState } = useNotificationsState();

  const onBrandUpdated = useCallback(
    (brand: Brand) => setCurrentBrand(brand),
    [setCurrentBrand],
  );

  const onMeUpdated = useCallback(
    (account: Account) => setMe(account),
    [setMe],
  );

  useEffect(() => {
    socket.on(WebsocketAction.accountUpdated, onMeUpdated);
    socket.on(WebsocketAction.brandUpdated, onBrandUpdated);

    return () => {
      socket.off(WebsocketAction.accountUpdated, onMeUpdated);
      socket.off(WebsocketAction.brandUpdated, onBrandUpdated);

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
    onBrandUpdated,
    onMeUpdated,
  ]);

  return children;
};
