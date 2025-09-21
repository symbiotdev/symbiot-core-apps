import { useForm } from 'react-hook-form';
import { useCallback } from 'react';
import { BrandLocationNameController } from '../controller/brand-location-name-controller';

type FormValue = {
  name: string;
};

export const BrandLocationNameForm = ({
  name,
  onUpdate,
}: FormValue & {
  onUpdate: (value: FormValue) => void;
}) => {
  const { control, handleSubmit } = useForm<FormValue>({
    defaultValues: {
      name,
    },
  });

  const update = useCallback(
    (value: FormValue) => name !== value.name && onUpdate(value),
    [name, onUpdate],
  );

  return (
    <BrandLocationNameController
      name="name"
      control={control}
      onBlur={handleSubmit(update)}
    />
  );
};
