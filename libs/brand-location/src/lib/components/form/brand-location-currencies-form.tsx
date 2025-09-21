import { useForm } from 'react-hook-form';
import { useCallback } from 'react';
import { BrandLocationCurrenciesController } from '../controller/brand-location-currencies-controller';

type FormValue = {
  currencies: string[];
};

export const BrandLocationCurrenciesForm = ({
  currencies,
  onUpdate,
}: FormValue & {
  onUpdate: (value: FormValue) => void;
}) => {
  const { control, handleSubmit } = useForm<{ currency: string }>({
    defaultValues: {
      currency: currencies[0],
    },
  });

  const update = useCallback(
    (value: { currency: string }) =>
      currencies[0] !== value.currency &&
      onUpdate({ currencies: [value.currency] }),
    [currencies, onUpdate],
  );

  return (
    <BrandLocationCurrenciesController
      disableDrag
      name="currency"
      control={control}
      onBlur={handleSubmit(update)}
    />
  );
};
