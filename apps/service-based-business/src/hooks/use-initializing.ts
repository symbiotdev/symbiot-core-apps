import { useMemo } from 'react';
import {
  useCurrentAccount,
  useCurrentBrandState,
} from '@symbiot-core-apps/state';
import { useBrandAuthState } from '@symbiot-core-apps/brand';

export const useInitializing = () => {
  const { me } = useCurrentAccount();
  const { processing: authProcessing } = useBrandAuthState();
  const { brand: currentBrand, brands: currentBrands } = useCurrentBrandState();

  return useMemo(
    () => !me || !(currentBrand || currentBrands) || authProcessing,
    [me, currentBrand, currentBrands],
  );
};
