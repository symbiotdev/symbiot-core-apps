import { Control, Path, useForm } from 'react-hook-form';
import { ComponentType, useEffect, useRef } from 'react';
import { DateHelper } from '@symbiot-core-apps/shared';

type FormValue = Record<string, Date | string | null>;

export function DateFrom<CP>({
  name,
  value,
  controllerProps,
  Controller,
  onUpdate,
}: {
  name: string;
  value: string | null;
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

  const dateRef = useRef(value);

  useEffect(() => {
    const nextValue = value || null;

    dateRef.current = nextValue;
    setValue(name, nextValue);
  }, [name, value, setValue]);

  return (
    <Controller
      {...controllerProps}
      name={name}
      control={control}
      onBlur={handleSubmit((currentValue: FormValue) => {
        const date = dateRef.current;

        date !== currentValue[name] &&
          (!date ||
            !currentValue[name] ||
            !DateHelper.isSameDay(date, currentValue[name])) &&
          onUpdate(currentValue);
      })}
    />
  );
}
