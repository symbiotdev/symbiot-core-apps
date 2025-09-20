import { useForm } from 'react-hook-form';
import { useCallback, useEffect } from 'react';
import { arraysOfObjectsEqual } from '@symbiot-core-apps/shared';
import { BrandCurrenciesController } from '../contoller/brand-currencies-controller';

type FormValue = {
  currencies: string[];
};

export const BrandCurrenciesForm = ({
  currencies,
  onUpdate,
}: FormValue & {
  onUpdate: (value: FormValue) => void;
}) => {
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
    <BrandCurrenciesController
      name="currency"
      control={control}
      onBlur={handleSubmit(update)}
    />
  );
};
