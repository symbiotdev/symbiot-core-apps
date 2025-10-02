import { PropsWithChildren, useEffect } from 'react';
import {
  useCurrentAccountState,
  useCurrentBrandClientState,
  useCurrentBrandEmployeeState,
  useCurrentBrandMembershipState,
  useCurrentBrandServiceState,
  useCurrentBrandState,
  useCurrentBrandTicketState,
  useCurrentBrandTransactionState,
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
  const { clear: clearCurrentBrandMembershipState } =
    useCurrentBrandMembershipState();
  const { clear: clearCurrentBrandTicketState } = useCurrentBrandTicketState();
  const { clear: clearCurrentBrandTransactionState } =
    useCurrentBrandTransactionState();
  const { clear: clearFaq } = useFaqState();
  const { clear: clearNotificationsState } = useNotificationsState();

  useEffect(() => {
    return () => {
      clearCurrentAccountState();
      clearCurrentBrandState();
      clearCurrentBrandEmployeeState();
      clearCurrentBrandClientState();
      clearCurrentBrandServiceState();
      clearCurrentBrandMembershipState();
      clearCurrentBrandTicketState();
      clearCurrentBrandTransactionState();
      clearFaq();
      clearNotificationsState();
    };
  }, [
    clearCurrentAccountState,
    clearCurrentBrandState,
    clearCurrentBrandEmployeeState,
    clearCurrentBrandClientState,
    clearCurrentBrandServiceState,
    clearCurrentBrandMembershipState,
    clearCurrentBrandTicketState,
    clearCurrentBrandTransactionState,
    clearFaq,
    clearNotificationsState,
  ]);

  return children;
};
