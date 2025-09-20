import { useForm } from 'react-hook-form';
import { useCallback, useEffect } from 'react';
import { BrandNameController } from '../contoller/brand-name-controller';

type FormValue = {
  name: string;
};

export const BrandNameForm = ({
  name,
  onUpdate,
}: FormValue & {
  onUpdate: (value: FormValue) => void;
}) => {
  const { control, handleSubmit, setValue } = useForm<FormValue>({
    defaultValues: {
      name,
    },
  });

  const update = useCallback(
    (value: FormValue) => {
      value.name !== name && onUpdate(value);
    },
    [name, onUpdate],
  );

  useEffect(() => {
    name && setValue('name', name);
  }, [name, setValue]);

  return (
    <BrandNameController
      name="name"
      control={control}
      onBlur={handleSubmit(update)}
    />
  );
};
