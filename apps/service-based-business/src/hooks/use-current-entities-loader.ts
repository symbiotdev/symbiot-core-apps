import {
  useAccountMeQuery,
  useAuthTokens,
  useCurrentBrandEmployeeQuery,
  useCurrentBrandQuery,
} from '@symbiot-core-apps/api';
import { useEffect } from 'react';
import { changeAppLanguage } from '@symbiot-core-apps/i18n';
import {
  useCurrentAccount,
  useCurrentBrandEmployeeState,
  useCurrentBrandState,
} from '@symbiot-core-apps/state';
import { useInitializing } from './use-initializing';
import { useApp } from '@symbiot-core-apps/app';

export const useCurrentEntitiesLoader = () => {
  const { languages } = useApp();
  const initializing = useInitializing();
  const { updateMe, updateMePreferences } = useCurrentAccount();
  const { tokens, setTokens } = useAuthTokens();
  const { setCurrentEmployee } = useCurrentBrandEmployeeState();
  const {
    brand: currentBrand,
    setBrand: setCurrentBrand,
    setBrands: setCurrentBrands,
  } = useCurrentBrandState();
  const { data: meResponse, error: meResponseError } = useAccountMeQuery({
    enabled: !!tokens.access,
  });
  const { data: currentBrandResponse, error: currentBrandResponseError } =
    useCurrentBrandQuery({
      enabled: !!tokens.access,
    });
  const {
    data: currentBrandEmployeeResponse,
    error: currentBrandEmployeeResponseError,
  } = useCurrentBrandEmployeeQuery({
    enabled: !!tokens.access && !!currentBrand,
  });

  useEffect(() => {
    if (meResponseError) {
      updateMe(undefined);
    } else if (meResponse) {
      updateMe(meResponse);

      if (
        meResponse.language &&
        languages.some(({ code }) => code === meResponse.language)
      ) {
        changeAppLanguage(meResponse.language);
      }

      if (meResponse.preferences) {
        void updateMePreferences(meResponse.preferences);
      }
    }
  }, [meResponse, meResponseError, updateMe, updateMePreferences, languages]);

  useEffect(() => {
    if (currentBrandResponseError) {
      setCurrentBrand(undefined);
      setCurrentBrands(undefined);
    } else if (currentBrandResponse) {
      setCurrentBrand(currentBrandResponse.brand);

      if (currentBrandResponse.brands) {
        setCurrentBrands(currentBrandResponse.brands);
      }

      if (currentBrandResponse.tokens) {
        setTokens(currentBrandResponse.tokens);
      }
    }
  }, [
    currentBrandResponse,
    currentBrandResponseError,
    setCurrentBrand,
    setCurrentBrands,
    setTokens,
  ]);

  useEffect(() => {
    if (currentBrandEmployeeResponseError) {
      setCurrentEmployee(undefined);
    } else if (currentBrandEmployeeResponse) {
      setCurrentEmployee(currentBrandEmployeeResponse);
    }
  }, [
    currentBrandEmployeeResponse,
    currentBrandEmployeeResponseError,
    setCurrentEmployee,
  ]);

  return !initializing;
};
