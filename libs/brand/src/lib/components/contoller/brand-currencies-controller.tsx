import { useBrandCurrenciesQuery } from '@symbiot-core-apps/api';
import { SelectPicker } from '@symbiot-core-apps/ui';
import { Controller, useForm } from 'react-hook-form';
import { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { arraysOfObjectsEqual } from '@symbiot-core-apps/shared';

type FormValue = {
  currencies: string[];
};

export const BrandCurrenciesController = ({
  currencies,
  onUpdate,
}: FormValue & {
  onUpdate: (props: { currencies: string[] }) => void;
}) => {
  const { t } = useTranslation();
  const {
    data,
    isPending: currenciesLoading,
    error: currenciesError,
  } = useBrandCurrenciesQuery();

  const { control, handleSubmit, setValue } = useForm<{
    currency: string | null;
  }>({
    defaultValues: {
      currency: currencies[0],
    },
  });

  const update = useCallback(
    ({ currency }: { currency: string | null }) => {
      if (!currency || arraysOfObjectsEqual([currency], currencies)) return;

      onUpdate({ currencies: [currency] });
    },
    [currencies, onUpdate],
  );

  useEffect(() => {
    setValue('currency', currencies[0] || null);
  }, [setValue, currencies]);

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
          label={t('brand.form.currency.label')}
          sheetLabel={t('brand.form.currency.label')}
          placeholder={t('brand.form.currency.placeholder')}
          onChange={(currency) => {
            onChange(currency);
            handleSubmit(update)();
          }}
        />
      )}
    />
  );
};
