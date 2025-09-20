import { useBrandCountriesQuery } from '@symbiot-core-apps/api';
import { SelectPicker } from '@symbiot-core-apps/ui';
import { Control, Controller } from 'react-hook-form';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export const BrandCountriesController = ({
  control,
  noLabel,
  onBlur,
}: {
  control: Control<{ country: string | null }>;
  noLabel?: boolean;
  onBlur?: () => void;
}) => {
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
      name="country"
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <SelectPicker
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
};
