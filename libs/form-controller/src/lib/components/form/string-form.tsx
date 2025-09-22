import { Control, Path, useForm } from 'react-hook-form';
import { ComponentType, useEffect } from 'react';

type FormValue = Record<string, string | null>;

export function StringForm({
  name,
  value,
  Controller,
  onUpdate,
}: {
  name: string;
  value: string | null;
  onUpdate: (value: FormValue) => void;
  Controller: ComponentType<{
    name: Path<FormValue>;
    control: Control<FormValue>;
    onBlur: () => void;
  }>;
}) {
  const { control, handleSubmit, setValue } = useForm<FormValue>({
    defaultValues: {
      [name]: value,
    },
  });

  useEffect(() => {
    setValue(name, value);
  }, [name, value, setValue]);

  return (
    <Controller
      name={name}
      control={control}
      onBlur={handleSubmit(
        (currentValue: FormValue) =>
          value !== currentValue[name] && onUpdate(currentValue),
      )}
    />
  );
}
