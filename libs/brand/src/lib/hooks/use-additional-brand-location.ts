import { useMemo } from 'react';
import { useI18n } from '@symbiot-core-apps/shared';

export const useDynamicBrandLocation = () => {
  const { t } = useI18n();

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
  const { t } = useI18n();

  return useMemo(
    () => ({
      label: t('brand_location.form.any.label'),
      description: t('brand_location.form.any.placeholder'),
      value: null,
    }),
    [t],
  );
};

export const useAllBrandLocation = () => {
  const { t } = useI18n();

  return useMemo(
    () => ({
      label: t('brand_location.form.all.label'),
      description: t('brand_location.form.all.placeholder'),
      value: null,
    }),
    [t],
  );
};
