import { Control, Path, useForm } from 'react-hook-form';
import { ReactElement, useEffect } from 'react';

type FormValue = {
  phones: string[];
};

type InternalValue = {
  phone: string;
};

export const PhonesForm = ({
  phones,
  Controller,
  onUpdate,
}: FormValue & {
  onUpdate: (value: FormValue) => void;
  Controller: (props: {
    name: Path<InternalValue>;
    control: Control<InternalValue>;
    onBlur: () => void;
  }) => ReactElement;
}) => {
  const { control, handleSubmit, setValue } = useForm<InternalValue>({
    defaultValues: {
      phone: phones[0],
    },
  });

  useEffect(() => {
    setValue('phone', phones[0]);
  }, [phones, setValue]);

  return Controller({
    name: 'phone',
    control,
    onBlur: handleSubmit(
      (value: InternalValue) =>
        phones[0] !== value.phone &&
        onUpdate({ phones: [value.phone].filter(Boolean) }),
    ),
  });
};
