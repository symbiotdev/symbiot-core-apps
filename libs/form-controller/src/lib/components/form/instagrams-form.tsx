import { Control, Path, useForm } from 'react-hook-form';
import { ReactElement, useEffect } from 'react';

type FormValue = {
  instagrams: string[];
};

type InternalValue = {
  instagram: string;
};

export const InstagramsForm = ({
  instagrams,
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
      instagram: instagrams[0],
    },
  });

  useEffect(() => {
    setValue('instagram', instagrams[0]);
  }, [instagrams, setValue]);

  return Controller({
    name: 'instagram',
    control,
    onBlur: handleSubmit(
      (value: InternalValue) =>
        instagrams[0] !== value.instagram &&
        onUpdate({ instagrams: [value.instagram].filter(Boolean) }),
    ),
  });
};
