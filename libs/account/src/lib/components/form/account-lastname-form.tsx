import { useForm } from 'react-hook-form';
import { useCallback, useEffect } from 'react';
import { AccountLastnameController } from '../controller/account-lastname-controller';

type FormValue = {
  lastname: string;
};

export const AccountLastnameForm = ({
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
    (value: FormValue) => lastname !== value.lastname && onUpdate(value),
    [lastname, onUpdate],
  );

  useEffect(() => {
    setValue('lastname', lastname);
  }, [lastname, setValue]);

  return (
    <AccountLastnameController
      name="lastname"
      control={control}
      onBlur={handleSubmit(update)}
    />
  );
};
