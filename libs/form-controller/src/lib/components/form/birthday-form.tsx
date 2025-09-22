import { Control, Path, useForm } from 'react-hook-form';
import { ReactElement, useEffect, useRef } from 'react';
import { DateHelper } from '@symbiot-core-apps/shared';

type FormValue = {
  birthday: string | null;
};

export const BirthdayForm = ({
  birthday,
  Controller,
  onUpdate,
}: FormValue & {
  onUpdate: (value: FormValue) => void;
  Controller: (props: {
    name: Path<FormValue>;
    control: Control<FormValue>;
    onBlur: () => void;
  }) => ReactElement;
}) => {
  const { control, handleSubmit, setValue } = useForm<FormValue>({
    defaultValues: {
      birthday,
    },
  });

  const birthdayRef = useRef(birthday);

  useEffect(() => {
    const nextValue = birthday || null;

    birthdayRef.current = nextValue;
    setValue('birthday', nextValue);
  }, [birthday, setValue]);

  return Controller({
    name: 'birthday',
    control,
    onBlur: handleSubmit((value: FormValue) => {
      const birthday = birthdayRef.current;

      birthday !== value.birthday &&
        (!birthday ||
          !value.birthday ||
          !DateHelper.isSameDay(birthday, value.birthday)) &&
        onUpdate(value);
    }),
  });
};
