import { PropsWithChildren, useEffect } from 'react';
import {
  useCurrentAccountState,
  useCurrentBrandEmployeeState,
  useCurrentBrandState,
  useFaqState,
} from '@symbiot-core-apps/state';

export const StateProvider = ({ children }: PropsWithChildren) => {
  const { clear: clearCurrentAccountState } = useCurrentAccountState();
  const { clear: clearCurrentBrandState } = useCurrentBrandState();
  const { clear: clearCurrentBrandEmployeeState } =
    useCurrentBrandEmployeeState();
  const { clear: clearFaq } = useFaqState();

  useEffect(() => {
    return () => {
      clearCurrentAccountState();
      clearCurrentBrandState();
      clearCurrentBrandEmployeeState();
      clearFaq();
    };
  }, [
    clearCurrentAccountState,
    clearCurrentBrandState,
    clearCurrentBrandEmployeeState,
    clearFaq,
  ]);

  return children;
};
