import { Control, Path, useForm } from 'react-hook-form';
import { ComponentType, useEffect } from 'react';
import { isEqual } from '@symbiot-core-apps/shared';

type FormValue = Record<string, unknown>;

export function SingeElementForm({
  name,
  value,
  disabled,
  loading,
  Controller,
  onUpdate,
}: {
  name: string;
  value: unknown;
  disabled?: boolean;
  loading?: boolean;
  onUpdate: (value: FormValue) => void;
  Controller: ComponentType<{
    name: Path<FormValue>;
    disabled?: boolean;
    loading?: boolean;
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
      disabled={disabled}
      loading={loading}
      control={control}
      onBlur={handleSubmit(
        (currentValue: FormValue) =>
          !isEqual(value, currentValue[name]) && onUpdate(currentValue),
      )}
    />
  );
}
