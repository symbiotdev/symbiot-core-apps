import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export const useDynamicBrandLocation = () => {
  const { t } = useTranslation();

  return useMemo(
    () => ({
      label: t('brand_location.form.dynamic_location.label'),
      description: t('brand_location.form.dynamic_location.placeholder'),
      value: null,
    }),
    [t],
  );
};
