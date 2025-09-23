import { Control, Path, useForm } from 'react-hook-form';
import { ComponentType, useEffect } from 'react';
import { arraysOfObjectsEqual } from '@symbiot-core-apps/shared';

type FormValue = Record<string, unknown[]>;

export function MultiElementsForm<CP>({
  name,
  value,
  controllerProps,
  Controller,
  onUpdate,
}: {
  name: string;
  value: unknown[];
  controllerProps?: CP;
  onUpdate: (value: FormValue) => void;
  Controller: ComponentType<{
    name: Path<FormValue>;
    disabled?: boolean;
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
          !arraysOfObjectsEqual(value, currentValue[name]) &&
          onUpdate({ [name]: currentValue[name] }),
      )}
    />
  );
}
