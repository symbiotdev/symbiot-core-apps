import { useForm } from 'react-hook-form';
import { useCallback, useEffect } from 'react';
import { AccountGenderController } from '../controller/account-gender-controller';

type FormValue = {
  gender: string | null;
};

export const AccountGenderForm = ({
  gender,
  onUpdate,
}: FormValue & {
  onUpdate: (value: FormValue) => void;
}) => {
  const { control, handleSubmit, setValue } = useForm<FormValue>({
    defaultValues: {
      gender,
    },
  });

  const update = useCallback(
    (value: FormValue) => gender !== value.gender && onUpdate(value),
    [gender, onUpdate],
  );

  useEffect(() => {
    setValue('gender', gender || null);
  }, [gender, setValue]);

  return (
    <AccountGenderController
      name="gender"
      control={control}
      onBlur={handleSubmit(update)}
    />
  );
};
