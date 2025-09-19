import { BrandCountry, useBrandCountriesQuery } from '@symbiot-core-apps/api';
import { SelectPicker } from '@symbiot-core-apps/ui';
import { Controller, useForm } from 'react-hook-form';
import { useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { arraysOfObjectsEqual } from '@symbiot-core-apps/shared';

type FormValue = {
  countries: BrandCountry[];
};

export const BrandCountriesController = ({
  countries,
  onUpdate,
}: FormValue & {
  onUpdate: (props: { countries: string[] }) => void;
}) => {
  const { t } = useTranslation();
  const {
    data,
    isPending: countriesLoading,
    error: countriesError,
  } = useBrandCountriesQuery();

  const { control, handleSubmit, setValue } = useForm<{
    country: string | null;
  }>({
    defaultValues: {
      country: countries[0]?.value,
    },
  });

  const options = useMemo(
    () =>
      data?.map((item) => ({
        label: `${item.flag} ${item.label}`,
        value: item.value,
      })),
    [data],
  );

  const update = useCallback(
    ({ country }: { country: string | null }) => {
      if (!country || arraysOfObjectsEqual([country], countries)) return;

      onUpdate({ countries: [country] });
    },
    [countries, onUpdate],
  );

  useEffect(() => {
    setValue('country', countries[0]?.value || null);
  }, [setValue, countries]);

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
          label={t('brand.form.country.label')}
          sheetLabel={t('brand.form.country.label')}
          placeholder={t('brand.form.country.placeholder')}
          onChange={(country) => {
            onChange(country);
            handleSubmit(update)();
          }}
        />
      )}
    />
  );
};
