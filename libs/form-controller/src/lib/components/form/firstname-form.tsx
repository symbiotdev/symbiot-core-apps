import { Control, Path, useForm } from 'react-hook-form';
import { ComponentType, useEffect } from 'react';

type FormValue = {
  firstname: string;
};

export const FirstnameForm = ({
  firstname,
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
      firstname,
    },
  });

  useEffect(() => {
    setValue('firstname', firstname);
  }, [firstname, setValue]);

  return (
    <Controller
      name="firstname"
      control={control}
      onBlur={handleSubmit(
        (value: FormValue) => firstname !== value.firstname && onUpdate(value),
      )}
    />
  );
};
