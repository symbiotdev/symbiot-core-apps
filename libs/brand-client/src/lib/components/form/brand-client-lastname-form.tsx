import { useForm } from 'react-hook-form';
import { useCallback, useEffect } from 'react';
import { BrandClientLastnameController } from '../controller/brand-client-lastname-controller';

type FormValue = {
  lastname: string;
};

export const BrandClientLastnameForm = ({
  lastname,
  onUpdate,
}: FormValue & {
  onUpdate: (value: FormValue) => void;
}) => {
  const { control, handleSubmit, setValue } = useForm<FormValue>({
    defaultValues: {
      lastname,
    },
  });

  const update = useCallback(
    (value: FormValue) => value.lastname !== lastname && onUpdate(value),
    [lastname, onUpdate],
  );

  useEffect(() => {
    lastname && setValue('lastname', lastname);
  }, [lastname, setValue]);

  return (
    <BrandClientLastnameController
      name="lastname"
      control={control}
      onBlur={handleSubmit(update)}
    />
  );
};
