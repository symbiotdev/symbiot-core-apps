import { Control, Path, useForm } from 'react-hook-form';
import { ComponentType, useEffect } from 'react';
import { arraysOfObjectsEqual } from '@symbiot-core-apps/shared';

type FormValue = Record<string, unknown[]>;

export const MultiElementsForm = ({
  name,
  value,
  disabled,
  Controller,
  onUpdate,
}: {
  name: string;
  value: unknown[];
  disabled?: boolean;
  onUpdate: (value: FormValue) => void;
  Controller: ComponentType<{
    name: Path<FormValue>;
    disabled?: boolean;
    control: Control<FormValue>;
    onBlur: () => void;
  }>;
}) => {
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
      disabled={disabled}
      onBlur={handleSubmit(
        (currentValue: FormValue) =>
          !arraysOfObjectsEqual(value, currentValue[name]) &&
          onUpdate({ [name]: currentValue[name] }),
      )}
    />
  );
};
