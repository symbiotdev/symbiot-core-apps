import { useBrandCurrenciesQuery } from '@symbiot-core-apps/api';
import { SelectPicker } from '@symbiot-core-apps/ui';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

export function BrandCurrenciesController<T extends FieldValues>({
  name,
  control,
  noLabel,
  onBlur,
}: {
  name: Path<T>;
  control: Control<T>;
  noLabel?: boolean;
  onBlur?: () => void;
}) {
  const { t } = useTranslation();
  const {
    data,
    isPending: currenciesLoading,
    error: currenciesError,
  } = useBrandCurrenciesQuery();

  return (
    <Controller
      control={control}
      name={name}
      rules={{
        required: {
          value: true,
          message: t('brand.form.currency.error.required'),
        },
      }}
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
}
