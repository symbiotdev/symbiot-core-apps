import { Control, Path, useForm } from 'react-hook-form';
import { ComponentType, useEffect } from 'react';
import { isEqual } from '@symbiot-core-apps/shared';

type FormValue = Record<string, unknown[]>;

type InternalValue = { str: unknown };

export const SingleElementToArrayForm = ({
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
    name: Path<InternalValue>;
    disabled?: boolean;
    control: Control<InternalValue>;
    onBlur: () => void;
  }>;
}) => {
  const { control, handleSubmit, setValue } = useForm<InternalValue>({
    defaultValues: {
      str: value[0],
    },
  });

  useEffect(() => {
    setValue('str', value[0]);
  }, [value, setValue]);

  return (
    <Controller
      name="str"
      control={control}
      disabled={disabled}
      onBlur={handleSubmit(
        (currentValue: InternalValue) =>
          !isEqual(value[0], currentValue.str) &&
          onUpdate({ [name]: [currentValue.str].filter(Boolean) }),
      )}
    />
  );
};
