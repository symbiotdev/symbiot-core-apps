import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

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
