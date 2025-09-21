import { useForm } from 'react-hook-form';
import { useCallback, useEffect } from 'react';
import { AccountBirthdayController } from '../controller/account-birthday-controller';

type FormValue = {
  birthday: string | null;
};

export const AccountBirthdayForm = ({
  birthday,
  onUpdate,
}: FormValue & {
  onUpdate: (value: FormValue) => void;
}) => {
  const { control, handleSubmit, setValue } = useForm<FormValue>({
    defaultValues: {
      birthday,
    },
  });

  const update = useCallback(
    (value: FormValue) => birthday !== value.birthday && onUpdate(value),
    [birthday, onUpdate],
  );

  useEffect(() => {
    setValue('birthday', birthday || null);
  }, [birthday, setValue]);

  return (
    <AccountBirthdayController
      name="birthday"
      control={control}
      onBlur={handleSubmit(update)}
    />
  );
};
