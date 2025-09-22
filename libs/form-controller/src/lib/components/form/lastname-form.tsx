import { Control, Path, useForm } from 'react-hook-form';
import { ComponentType, useEffect } from 'react';

type FormValue = {
  lastname: string;
};

export const LastnameForm = ({
  lastname,
  Controller,
  onUpdate,
}: FormValue & {
  onUpdate: (value: FormValue) => void;
  Controller: ComponentType<{
    name: Path<FormValue>;
    control: Control<FormValue>;
    onBlur: () => void;
  }>;
}) => {
  const { control, handleSubmit, setValue } = useForm<FormValue>({
    defaultValues: {
      lastname,
    },
  });

  useEffect(() => {
    setValue('lastname', lastname);
  }, [lastname, setValue]);

  return (
    <Controller
      name="lastname"
      control={control}
      onBlur={handleSubmit(
        (value: FormValue) => lastname !== value.lastname && onUpdate(value),
      )}
    />
  );
};
