import { useForm } from 'react-hook-form';
import { useCallback, useEffect } from 'react';
import { BrandClientBirthdayController } from '../controller/brand-client-birthday-controller';

type FormValue = {
  birthday: string | null;
};

export const BrandClientBirthdayForm = ({
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
    (value: FormValue) => {
      value.birthday !== birthday &&
        onUpdate({
          birthday: value.birthday
            ? new Date(value.birthday)?.toISOString()
            : null,
        });
    },
    [birthday, onUpdate],
  );

  useEffect(() => {
    setValue('birthday', birthday);
  }, [birthday, setValue]);

  return (
    <BrandClientBirthdayController
      name="birthday"
      control={control}
      onBlur={handleSubmit(update)}
    />
  );
};
