import { useMemo } from 'react';
import { useI18n } from '@symbiot-core-apps/shared';

export const useAnyBrandService = () => {
  const { t } = useI18n();

  return useMemo(
    () => ({
      label: t('brand_service.form.any.label'),
      description: t('brand_service.form.any.placeholder'),
      value: null,
    }),
    [t],
  );
};
