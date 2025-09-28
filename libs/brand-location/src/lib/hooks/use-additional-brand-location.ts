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
      label: t('brand_location.form.any.label'),
      description: t('brand_location.form.any.placeholder'),
      value: null,
    }),
    [t],
  );
};

