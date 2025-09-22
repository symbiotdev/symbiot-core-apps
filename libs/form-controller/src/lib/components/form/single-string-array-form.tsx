import { Control, Path, useForm } from 'react-hook-form';
import { ComponentType, useEffect } from 'react';

type FormValue = Record<string, string[]>;

type InternalValue = { str: string };

export const SingleStringArrayForm = ({
  name,
  value,
  Controller,
  onUpdate,
}: {
  name: string;
  value: string[];
  onUpdate: (value: FormValue) => void;
  Controller: ComponentType<{
    name: Path<InternalValue>;
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
      onBlur={handleSubmit(
        (currentValue: InternalValue) =>
          value[0] !== currentValue.str &&
          onUpdate({ [name]: [currentValue.str].filter(Boolean) }),
      )}
    />
  );
};
