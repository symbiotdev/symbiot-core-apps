import { useBrandCurrenciesQuery } from '@symbiot-core-apps/api';
import { SelectPicker } from '@symbiot-core-apps/ui';
import { Control, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

export const BrandCurrenciesController = ({
  control,
  noLabel,
  onBlur,
}: {
  control: Control<{ currency: string | null }>;
  noLabel?: boolean;
  onBlur?: () => void;
}) => {
  const { t } = useTranslation();
  const {
    data,
    isPending: currenciesLoading,
    error: currenciesError,
  } = useBrandCurrenciesQuery();

  return (
    <Controller
      control={control}
      name="currency"
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <SelectPicker
          value={value as string}
          error={error?.message}
          options={data}
          optionsLoading={currenciesLoading}
          optionsError={currenciesError}
          label={!noLabel ? t('brand.form.currency.label') : undefined}
          sheetLabel={t('brand.form.currency.label')}
          placeholder={t('brand.form.currency.placeholder')}
          onChange={onChange}
          onBlur={onBlur}
        />
      )}
    />
  );
};
