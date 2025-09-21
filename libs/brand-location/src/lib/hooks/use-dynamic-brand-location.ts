import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { PickerItem } from '@symbiot-core-apps/ui';

export const useDynamicBrandLocation = () => {
  const { t } = useTranslation();

  return useMemo(
    () =>
      ({
        label: t('brand_location.dynamic.title'),
        description: t('brand_location.dynamic.subtitle'),
        value: null,
      }) as PickerItem,
    [t],
  );
};
