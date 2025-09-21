import { useForm } from 'react-hook-form';
import { useCallback } from 'react';
import { BrandLocationTimezoneController } from '../controller/brand-location-timezone-controller';

type FormValue = {
  timezone: string;
};

export const BrandLocationTimezoneForm = ({
  timezone,
  country,
  onUpdate,
}: FormValue & {
  country?: string;
  onUpdate: (value: FormValue) => void;
}) => {
  const { control, handleSubmit } = useForm<FormValue>({
    defaultValues: {
      timezone,
    },
  });

  const update = useCallback(
    (value: FormValue) => timezone !== value.timezone && onUpdate(value),
    [timezone, onUpdate],
  );

  return (
    <BrandLocationTimezoneController
      disableDrag
      name="timezone"
      country={country}
      control={control}
      onBlur={handleSubmit(update)}
    />
  );
};
