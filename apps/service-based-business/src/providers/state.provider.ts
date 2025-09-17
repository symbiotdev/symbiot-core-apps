import { PropsWithChildren, useEffect } from 'react';
import {
  useCurrentAccountState,
  useCurrentBrandClientState,
  useCurrentBrandEmployeeState,
  useCurrentBrandServiceState,
  useCurrentBrandState,
  useFaqState,
  useNotificationsState,
} from '@symbiot-core-apps/state';

export const StateProvider = ({ children }: PropsWithChildren) => {
  const { clear: clearCurrentAccountState } = useCurrentAccountState();
  const { clear: clearCurrentBrandState } = useCurrentBrandState();
  const { clear: clearCurrentBrandClientState } = useCurrentBrandClientState();
  const { clear: clearCurrentBrandEmployeeState } =
    useCurrentBrandEmployeeState();
  const { clear: clearCurrentBrandServiceState } =
    useCurrentBrandServiceState();
  const { clear: clearFaq } = useFaqState();
  const { clear: clearNotificationsState } = useNotificationsState();

  useEffect(() => {
    return () => {
      clearCurrentAccountState();
      clearCurrentBrandState();
      clearCurrentBrandEmployeeState();
      clearCurrentBrandClientState();
      clearCurrentBrandServiceState();
      clearFaq();
      clearNotificationsState();
    };
  }, [
    clearCurrentAccountState,
    clearCurrentBrandState,
    clearCurrentBrandEmployeeState,
    clearCurrentBrandClientState,
    clearCurrentBrandServiceState,
    clearFaq,
    clearNotificationsState,
  ]);

  return children;
};
