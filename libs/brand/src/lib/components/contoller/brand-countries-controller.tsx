import { useBrandCountriesQuery } from '@symbiot-core-apps/api';
import { SelectPicker } from '@symbiot-core-apps/ui';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export function BrandCountriesController<T extends FieldValues>({
  name,
  control,
  disabled,
  noLabel,
  onBlur,
}: {
  name: Path<T>;
  control: Control<T>;
  noLabel?: boolean;
  disabled?: boolean;
  onBlur?: () => void;
}) {
  const { t } = useTranslation();
  const {
    data,
    isPending: countriesLoading,
    error: countriesError,
  } = useBrandCountriesQuery();

  const options = useMemo(
    () =>
      data?.map((item) => ({
        label: `${item.flag} ${item.label}`,
        value: item.value,
      })),
    [data],
  );

  return (
    <Controller
      control={control}
      name={name}
      rules={{
        required: {
          value: true,
          message: t('brand.form.country.error.required'),
        },
      }}
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <SelectPicker
          disabled={disabled}
          value={value as string}
          error={error?.message}
          options={options}
          optionsLoading={countriesLoading}
          optionsError={countriesError}
          label={!noLabel ? t('brand.form.country.label') : undefined}
          sheetLabel={t('brand.form.country.label')}
          placeholder={t('brand.form.country.placeholder')}
          onChange={onChange}
          onBlur={onBlur}
        />
      )}
    />
  );
}
