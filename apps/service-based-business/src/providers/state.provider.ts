import { PropsWithChildren, useEffect } from 'react';
import {
  useCurrentAccountState,
  useCurrentBrandBookingsState,
  useCurrentBrandEmployeeState,
  useCurrentBrandState,
  useFaqState,
} from '@symbiot-core-apps/state';

export const StateProvider = ({ children }: PropsWithChildren) => {
  const { clear: clearCurrentAccountState } = useCurrentAccountState();
  const { clear: clearCurrentBrandState } = useCurrentBrandState();
  const { clear: clearCurrentBrandBookingsState } =
    useCurrentBrandBookingsState();
  const { clear: clearCurrentBrandEmployeeState } =
    useCurrentBrandEmployeeState();
  const { clear: clearFaq } = useFaqState();

  useEffect(() => {
    return () => {
      clearCurrentAccountState();
      clearCurrentBrandState();
      clearCurrentBrandBookingsState();
      clearCurrentBrandEmployeeState();
      clearFaq();
    };
  }, [
    clearCurrentAccountState,
    clearCurrentBrandState,
    clearCurrentBrandBookingsState,
    clearCurrentBrandEmployeeState,
    clearFaq,
  ]);

  return children;
};
