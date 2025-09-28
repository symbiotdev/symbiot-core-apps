import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export const useAnyBrandService = () => {
  const { t } = useTranslation();

  return useMemo(
    () => ({
      label: t('brand_service.form.any.label'),
      description: t('brand_service.form.any.placeholder'),
      value: null,
    }),
    [t],
  );
};
