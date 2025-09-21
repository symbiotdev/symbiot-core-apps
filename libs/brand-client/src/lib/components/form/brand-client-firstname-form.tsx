import { useForm } from 'react-hook-form';
import { useCallback, useEffect } from 'react';
import { BrandClientFirstnameController } from '../controller/brand-client-firstname-controller';

type FormValue = {
  firstname: string;
};

export const BrandClientFirstnameForm = ({
  firstname,
  onUpdate,
}: FormValue & {
  onUpdate: (value: FormValue) => void;
}) => {
  const { control, handleSubmit, setValue } = useForm<FormValue>({
    defaultValues: {
      firstname,
    },
  });

  const update = useCallback(
    (value: FormValue) => value.firstname !== firstname && onUpdate(value),
    [firstname, onUpdate],
  );

  useEffect(() => {
    firstname && setValue('firstname', firstname);
  }, [firstname, setValue]);

  return (
    <BrandClientFirstnameController
      name="firstname"
      control={control}
      onBlur={handleSubmit(update)}
    />
  );
};
