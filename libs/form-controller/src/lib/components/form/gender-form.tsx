import { Control, Path, useForm } from 'react-hook-form';
import { ComponentType, useEffect } from 'react';

type FormValue = {
  gender: string | null;
};

export const GenderForm = ({
  gender,
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
      gender,
    },
  });

  useEffect(() => {
    setValue('gender', gender || null);
  }, [gender, setValue]);

  return (
    <Controller
      name="gender"
      control={control}
      onBlur={handleSubmit(
        (value: FormValue) => gender !== value.gender && onUpdate(value),
      )}
    />
  );
};
