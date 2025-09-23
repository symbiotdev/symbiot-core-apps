import { Control, Path, useForm } from 'react-hook-form';
import { ComponentType, useEffect } from 'react';
import { isEqual } from '@symbiot-core-apps/shared';

type FormValue = Record<string, unknown>;

export function SingeElementForm<CP>({
  name,
  value,
  controllerProps,
  Controller,
  onUpdate,
}: {
  name: string;
  value: unknown;
  controllerProps?: CP;
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
      {...controllerProps}
      name={name}
      control={control}
      onBlur={handleSubmit(
        (currentValue: FormValue) =>
          !isEqual(value, currentValue[name]) && onUpdate(currentValue),
      )}
    />
  );
}
