import { useForm } from 'react-hook-form';
import { useCallback, useEffect } from 'react';
import { AccountFirstnameController } from '../controller/account-firstname-controller';

type FormValue = {
  firstname: string;
};

export const AccountFirstnameForm = ({
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
    (value: FormValue) => firstname !== value.firstname && onUpdate(value),
    [firstname, onUpdate],
  );

  useEffect(() => {
    setValue('firstname', firstname);
  }, [firstname, setValue]);

  return (
    <AccountFirstnameController
      name="firstname"
      control={control}
      onBlur={handleSubmit(update)}
    />
  );
};
