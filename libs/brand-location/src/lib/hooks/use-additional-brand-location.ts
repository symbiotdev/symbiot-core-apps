import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export const useDynamicBrandLocation = () => {
  const { t } = useTranslation();

  return useMemo(
    () => ({
      label: t('brand_location.form.dynamic.label'),
      description: t('brand_location.form.dynamic.placeholder'),
      value: null,
    }),
    [t],
  );
};

export const useAnyBrandLocation = () => {
  const { t } = useTranslation();

  return useMemo(
    () => ({
      label: t('brand_service.form.any_location.label'),
      description: t('brand_service.form.any_location.placeholder'),
      value: null,
    }),
    [t],
  );
};

