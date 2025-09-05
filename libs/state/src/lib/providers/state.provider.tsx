import { PropsWithChildren, useCallback, useEffect } from 'react';
import {
  Account,
  Brand,
  BrandEmployee,
  queryClient,
  socket,
  WebsocketAction,
} from '@symbiot-core-apps/api';
import { useCurrentAccountState } from '../hooks/use-current-account.state';
import { useNotificationsState } from '../hooks/use-notifications.state';
import { useFaqState } from '../hooks/use-faq.state';
import { useCurrentBrandState } from '../hooks/use-current-brand';
import { useCurrentBrandEmployeeState } from '../hooks/use-current-brand-employee';

export const StateProvider = ({ children }: PropsWithChildren) => {
  const { setMe, clear: clearCurrentAccountState } = useCurrentAccountState();
  const { setBrand: setCurrentBrand, clear: clearCurrentBrandState } =
    useCurrentBrandState();
  const { setCurrentEmployee, clear: clearCurrentBrandEmployeeState } =
    useCurrentBrandEmployeeState();
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

  const onBrandEmployeeUpdated = useCallback(
    (brandEmployee: BrandEmployee) => setCurrentEmployee(brandEmployee),
    [setCurrentEmployee],
  );

  useEffect(() => {
    socket.on(WebsocketAction.accountUpdated, onMeUpdated);
    socket.on(WebsocketAction.brandUpdated, onBrandUpdated);
    socket.on(WebsocketAction.brandEmployeeUpdated, onBrandEmployeeUpdated);

    return () => {
      socket.off(WebsocketAction.accountUpdated, onMeUpdated);
      socket.off(WebsocketAction.brandUpdated, onBrandUpdated);
      socket.off(WebsocketAction.brandEmployeeUpdated, onBrandEmployeeUpdated);

      queryClient.clear();
      clearCurrentAccountState();
      clearCurrentBrandState();
      clearCurrentBrandEmployeeState();
      clearFaq();
      clearNotificationsState();
    };
  }, [
    clearCurrentAccountState,
    clearCurrentBrandState,
    clearCurrentBrandEmployeeState,
    clearFaq,
    clearNotificationsState,
    onBrandUpdated,
    onMeUpdated,
    onBrandEmployeeUpdated,
  ]);

  return children;
};
