import { useMemo } from 'react';
import {
  useCurrentAccount,
  useCurrentBrandEmployee,
  useCurrentBrandState,
} from '@symbiot-core-apps/state';
import { useBrandAuthState } from '@symbiot-core-apps/brand';

export const useInitializing = () => {
  const { me } = useCurrentAccount();
  const { processing: authProcessing } = useBrandAuthState();
  const { brand: currentBrand, brands: currentBrands } = useCurrentBrandState();
  const { currentEmployee } = useCurrentBrandEmployee();

  return useMemo(
    () =>
      !me ||
      !((currentBrand && currentEmployee) || currentBrands) ||
      authProcessing,
    [me, currentBrand, currentEmployee, currentBrands],
  );
};
