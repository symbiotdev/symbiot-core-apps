import {
  useAccountMeReq,
  useAuthTokens,
  useCurrentBrandEmployeeReq,
  useCurrentBrandReq,
} from '@symbiot-core-apps/api';
import { useEffect } from 'react';
import {
  useCurrentAccount,
  useCurrentBrandEmployee,
  useCurrentBrandState,
} from '@symbiot-core-apps/state';
import { useInitializing } from './use-initializing';
import { useApp } from '@symbiot-core-apps/app';
import { useI18n } from '@symbiot-core-apps/shared';

export const useCurrentEntitiesLoader = () => {
  const { languages } = useApp();
  const { changeLanguage } = useI18n();
  const initializing = useInitializing();
  const { updateMe, updateMePreferences } = useCurrentAccount();
  const { tokens, setTokens } = useAuthTokens();
  const { setCurrentEmployee } = useCurrentBrandEmployee();
  const {
    brand: currentBrand,
    setBrand: setCurrentBrand,
    setBrands: setCurrentBrands,
  } = useCurrentBrandState();
  const {
    data: meResponse,
    error: meResponseError,
    refetch,
  } = useAccountMeReq({
    enabled: !!tokens.access,
  });
  const { data: currentBrandResponse, error: currentBrandResponseError } =
    useCurrentBrandReq({
      enabled: !!tokens.access,
    });
  const {
    data: currentBrandEmployeeResponse,
    error: currentBrandEmployeeResponseError,
  } = useCurrentBrandEmployeeReq({
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
        changeLanguage(meResponse.language);
      }

      if (meResponse.preferences) {
        void updateMePreferences(meResponse.preferences);
      }
    }
  }, [
    meResponse,
    meResponseError,
    updateMe,
    languages,
    updateMePreferences,
    changeLanguage,
  ]);

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

  return {
    loaded: !initializing,
    refetchCurrentAccount: refetch,
  };
};
