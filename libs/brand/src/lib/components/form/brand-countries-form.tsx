import { useForm } from 'react-hook-form';
import { useCallback, useEffect } from 'react';
import { arraysOfObjectsEqual } from '@symbiot-core-apps/shared';
import { BrandCountriesController } from '../contoller/brand-countries-controller';

type FormValue = {
  countries: string[];
};

export const BrandCountriesForm = ({
  countries,
  onUpdate,
}: FormValue & {
  onUpdate: (value: FormValue) => void;
}) => {
  const { control, handleSubmit, setValue } = useForm<{
    country: string | null;
  }>({
    defaultValues: {
      country: countries[0],
    },
  });

  const update = useCallback(
    ({ country }: { country: string | null }) => {
      if (!country || arraysOfObjectsEqual([country], countries)) return;

      onUpdate({ countries: [country] });
    },
    [countries, onUpdate],
  );

  useEffect(() => {
    setValue('country', countries[0] || null);
  }, [setValue, countries]);

  return (
    <BrandCountriesController
      name="country"
      control={control}
      onBlur={handleSubmit(update)}
    />
  );
};
