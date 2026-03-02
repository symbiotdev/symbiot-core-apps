import { useMemo } from 'react';
import { useI18n } from '@symbiot-core-apps/shared';

export const useDynamicBrandLocation = () => {
  const { t } = useI18n();

  return useMemo(
    () => ({
      label: t('brand_location.form.dynamic.label'),
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
      value: null,
    }),
    [t],
  );
};
