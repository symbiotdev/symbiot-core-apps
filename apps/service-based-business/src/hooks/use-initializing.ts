import { useMemo } from 'react';
import {
  useCurrentAccount,
  useCurrentBrandEmployeeState,
  useCurrentBrandState,
} from '@symbiot-core-apps/state';
import { useBrandAuthState } from '@symbiot-core-apps/brand';

export const useInitializing = () => {
  const { me } = useCurrentAccount();
  const { processing: authProcessing } = useBrandAuthState();
  const { brand: currentBrand, brands: currentBrands } = useCurrentBrandState();
  const { brandEmployee: currentBrandEmployee } =
    useCurrentBrandEmployeeState();

  return useMemo(
    () =>
      !me ||
      !((currentBrand && currentBrandEmployee) || currentBrands) ||
      authProcessing,
    [me, currentBrand, currentBrandEmployee, currentBrands],
  );
};
